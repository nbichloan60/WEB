import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Fallback models supported
const MODELS = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.1-pro-preview',
  'gemini-2.5-flash'
];

// Helper to create Gemini client
function getGeminiClient(customApiKey?: string) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  const hasEnvKey = !!process.env.GEMINI_API_KEY;
  res.json({ status: "ok", hasEnvKey });
});

// Gemini AI API Proxy endpoint
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { prompt, model, systemInstruction, responseMimeType, customApiKey } = req.body;
    
    const clientKey = req.headers['x-gemini-api-key'] as string || customApiKey;
    const ai = getGeminiClient(clientKey);

    if (!ai) {
      res.status(401).json({
        error: "Chưa cấu hình API Key. Vui lòng nhập API Key trong phần Cài đặt hoặc thiết lập biến GEMINI_API_KEY."
      });
      return;
    }

    if (!prompt) {
      res.status(400).json({ error: "Prompt không được để trống" });
      return;
    }

    // Determine model list to try starting from requested model or index 0
    let selectedModel = model || 'gemini-3.6-flash';
    let modelIndex = MODELS.indexOf(selectedModel);
    if (modelIndex === -1) modelIndex = 0;

    let lastError: any = null;
    
    // Try fallback models if necessary
    for (let i = modelIndex; i < MODELS.length; i++) {
      const currentModel = MODELS[i];
      try {
        const config: any = {};
        if (systemInstruction) config.systemInstruction = systemInstruction;
        if (responseMimeType) config.responseMimeType = responseMimeType;

        const response = await ai.models.generateContent({
          model: currentModel,
          contents: prompt,
          config
        });

        const textOutput = response.text || "";
        res.json({
          text: textOutput,
          usedModel: currentModel
        });
        return;
      } catch (err: any) {
        console.error(`Error with model ${currentModel}:`, err?.message || err);
        lastError = err;
        
        // If 401 or 403, key is invalid; no point trying other models with same key
        if (err?.status === 401 || err?.status === 403 || err?.message?.includes('401') || err?.message?.includes('403')) {
          res.status(401).json({ error: "API Key không hợp lệ hoặc không có quyền truy cập." });
          return;
        }

        // If rate limited or standard server error, continue to next fallback model
      }
    }

    res.status(500).json({
      error: lastError?.message || "Lỗi xử lý AI với tất cả các models khả dụng."
    });

  } catch (error: any) {
    console.error("Server API Gemini error:", error);
    res.status(500).json({ error: error?.message || "Lỗi hệ thống máy chủ AI" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
