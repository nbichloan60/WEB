import { getStoredApiKey } from './storage';

export const MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash-8b'
];

export interface GeminiResponse {
  text: string;
  usedModel: string;
  error?: string;
}

/**
 * Call Gemini AI using Server Proxy first, then Direct Fetch as Fallback
 */
export async function callGeminiAI(
  prompt: string | any[],
  systemInstruction?: string,
  modelIndex: number = 0,
  responseMimeType?: string
): Promise<GeminiResponse> {
  const localApiKey = getStoredApiKey();

  // Try Server API route first
  try {
    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localApiKey ? { 'x-gemini-api-key': localApiKey } : {})
      },
      body: JSON.stringify({
        prompt,
        model: MODELS[modelIndex],
        systemInstruction,
        responseMimeType,
        customApiKey: localApiKey
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        text: data.text || '',
        usedModel: data.usedModel || MODELS[modelIndex]
      };
    }

    const errData = await response.json().catch(() => ({}));
    
    // If server failed because of missing key or invalid key AND we have local key, attempt direct fetch
    if (!localApiKey && response.status === 401) {
      return {
        text: '',
        usedModel: MODELS[modelIndex],
        error: errData.error || 'Vui lòng nhập API Key Gemini trong phần Cài đặt!'
      };
    }
  } catch (serverError) {
    console.warn('Server endpoint failed, checking direct client fallback...', serverError);
  }

  // Fallback to Direct Fetch if local API key is present
  if (!localApiKey) {
    return {
      text: '',
      usedModel: MODELS[modelIndex],
      error: 'Vui lòng nhập API Key trong Cài đặt hoặc đảm bảo máy chủ có GEMINI_API_KEY!'
    };
  }

  return directClientFetch(prompt, systemInstruction, modelIndex, responseMimeType, localApiKey);
}

async function directClientFetch(
  prompt: string | any[],
  systemInstruction: string | undefined,
  modelIndex: number,
  responseMimeType: string | undefined,
  apiKey: string
): Promise<GeminiResponse> {
  const modelName = MODELS[modelIndex];

  try {
    const requestBody: any = {
      contents: Array.isArray(prompt) ? prompt : [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        ...(responseMimeType ? { responseMimeType } : {})
      }
    };

    if (systemInstruction) {
      requestBody.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    // Fallback model retry if 500, 503, 504
    if ([500, 503, 504].includes(response.status) && modelIndex < MODELS.length - 1) {
      return directClientFetch(prompt, systemInstruction, modelIndex + 1, responseMimeType, apiKey);
    }

    if (response.status === 401 || response.status === 403) {
      return {
        text: '',
        usedModel: modelName,
        error: 'API Key không hợp lệ hoặc không có quyền truy cập.'
      };
    }

    if (response.status === 429) {
      return {
        text: '',
        usedModel: modelName,
        error: 'Đã hết quota hoặc vượt giới hạn tốc độ API (429).'
      };
    }

    if (!response.ok) {
      throw new Error(`API Error status ${response.status}`);
    }

    const data = await response.json();
    const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return {
      text: textOutput,
      usedModel: modelName
    };
  } catch (error: any) {
    if (modelIndex < MODELS.length - 1) {
      return directClientFetch(prompt, systemInstruction, modelIndex + 1, responseMimeType, apiKey);
    }
    return {
      text: '',
      usedModel: modelName,
      error: error?.message || 'Không thể kết nối đến Gemini AI.'
    };
  }
}

/**
 * Generate Quiz Questions using Gemini
 */
export async function generateQuizQuestionsAI(
  subjectName: string,
  topic: string,
  count: number = 3,
  difficulty: string = 'medium'
) {
  const systemPrompt = `Bạn là một chuyên gia khảo thí và tạo câu hỏi trắc nghiệm lập trình phần mềm hàng đầu.
Nhiệm vụ của bạn là tạo các câu hỏi trắc nghiệm bằng tiếng Việt theo định dạng JSON array chuẩn.`;

  const userPrompt = `Hãy tạo ${count} câu hỏi trắc nghiệm tiếng Việt về chủ đề "${topic}" thuộc môn học "${subjectName}" với độ khó "${difficulty}".
Mỗi câu hỏi phải có chính xác 4 phương án lựa chọn, chỉ có 1 đáp án đúng (0-indexed integer từ 0 đến 3), và kèm theo lời giải thích ngắn gọn, dễ hiểu.

Yêu cầu trả về BẮT BUỘC theo cấu trúc JSON array như sau (không kèm markdown format ngoài array):
[
  {
    "content": "Nội dung câu hỏi...",
    "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
    "correctAnswer": 0,
    "explanation": "Giải thích chi tiết lý do phương án A đúng...",
    "difficulty": "${difficulty}"
  }
]`;

  const res = await callGeminiAI(userPrompt, systemPrompt, 0, 'application/json');
  if (res.error || !res.text) {
    throw new Error(res.error || 'Không nhận được dữ liệu từ Gemini AI');
  }

  try {
    let cleanText = res.text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```/g, '').trim();
    }
    return JSON.parse(cleanText);
  } catch (parseError) {
    console.error('Failed to parse AI question JSON:', res.text);
    throw new Error('Dữ liệu AI trả về không đúng định dạng JSON.');
  }
}

/**
 * Ask AI Tutor for detailed explanation
 */
export async function askAiTutor(
  conversationHistory: { role: 'user' | 'assistant'; content: string; imageBase64?: string }[],
  userMessage: string,
  imageBase64?: string
) {
  const systemPrompt = `Bạn là một chuyên gia Toán học xuất sắc với nhiều năm kinh nghiệm giảng dạy môn Toán cấp THPT theo chương trình giáo dục phổ thông 2018, bám sát bộ sách "Kết nối tri thức và cuộc sống".
Nhiệm vụ của bạn là đóng vai trò "Trợ giảng AI" của Thầy Phúc để giải đáp các thắc mắc, hướng dẫn giải bài tập và cung cấp lời khuyên học tập cho học sinh.
Hãy giải thích cặn kẽ, từng bước một, ngôn ngữ gần gũi, phù hợp với trình độ của học sinh ở mức độ trung bình khá để các em dễ hiểu nhất. Sử dụng Markdown tiếng Việt đẹp mắt, công thức toán học rõ ràng.`;

  const contents = conversationHistory.map(msg => {
    const parts: any[] = [{ text: msg.content }];
    if (msg.imageBase64) {
      const base64Data = msg.imageBase64.includes(',') ? msg.imageBase64.split(',')[1] : msg.imageBase64;
      const mimeType = msg.imageBase64.match(/data:(.*?);/)?.[1] || 'image/jpeg';
      parts.push({ inlineData: { mimeType, data: base64Data } });
    }
    return {
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts
    };
  });

  const currentUserParts: any[] = [{ text: userMessage }];
  if (imageBase64) {
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    const mimeType = imageBase64.match(/data:(.*?);/)?.[1] || 'image/jpeg';
    currentUserParts.push({ inlineData: { mimeType, data: base64Data } });
  }

  contents.push({
    role: 'user',
    parts: currentUserParts
  });

  return await callGeminiAI(contents as any, systemPrompt, 0);
}

/**
 * Summarize blog article
 */
export async function summarizeBlogArticle(title: string, content: string) {
  const systemPrompt = `Bạn là trợ lý AI tóm tắt nội dung bài viết kỹ thuật công nghệ.`;
  const prompt = `Hãy tóm tắt bài viết sau thành 3 đến 4 gạch đầu dòng cô đọng nhất bằng tiếng Việt:
Tiêu đề: ${title}
Nội dung: ${content}`;

  return await callGeminiAI(prompt, systemPrompt);
}
