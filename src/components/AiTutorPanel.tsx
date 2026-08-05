import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Trash2, 
  Loader2, 
  Code2, 
  HelpCircle, 
  BookOpen, 
  Cpu,
  ImagePlus,
  X
} from 'lucide-react';
import { askAiTutor } from '../utils/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }

  return canvas.toDataURL('image/jpeg', 0.9);
}

export const AiTutorPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý **Gemini AI Tutor** của Thầy Phúc. Tôi có thể giúp bạn giải đáp mọi thắc mắc về Toán học.\n\n💡 **Mẹo hỏi bài nhanh:**\n- Dùng phím `Windows + Shift + S` (hoặc `Cmd + Shift + 4` trên Mac) để khoanh chụp bài toán, rồi ấn `Ctrl + V` dán thẳng vào ô chat.\n- Hoặc bấm biểu tượng 🖼️ để tải ảnh lên và dùng công cụ cắt tích hợp sẵn!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      usedModel: 'gemini-1.5-flash'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Crop States
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    'Giải thích cách tìm tiệm cận đứng và tiệm cận ngang',
    'Điều kiện để hàm số bậc 3 có 2 cực trị là gì?',
    'Làm sao để tính thể tích khối chóp tứ giác đều?',
    'Phân biệt tổ hợp và chỉnh hợp dễ hiểu nhất'
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('Vui lòng chọn ảnh nhỏ hơn 4MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImage(reader.result as string);
        setCrop(undefined);
        setCompletedCrop(null);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    // Đặt lại giá trị của input để có thể chọn lại cùng một file
    if (e.target) e.target.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setRawImage(reader.result as string);
            setCrop(undefined);
            setCompletedCrop(null);
            setCropModalOpen(true);
          };
          reader.readAsDataURL(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const applyCrop = () => {
    if (imgRef.current && completedCrop && completedCrop.width > 0 && completedCrop.height > 0) {
      const croppedBase64 = getCroppedImg(imgRef.current, completedCrop);
      setSelectedImage(croppedBase64);
    } else if (rawImage) {
      // Nếu không cắt gì, lấy luôn ảnh gốc
      setSelectedImage(rawImage);
    }
    setCropModalOpen(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageBase64: selectedImage || undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    const imageToSend = selectedImage;
    setSelectedImage(null);
    setLoading(true);

    try {
      const historyForAi = messages.map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
        imageBase64: m.imageBase64
      }));

      const res = await askAiTutor(historyForAi, text, imageToSend || undefined);

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: res.error ? `Lỗi AI: ${res.error}` : res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        usedModel: res.usedModel
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'ai',
          text: `Không thể gọi AI Tutor: ${err?.message || 'Lỗi mạng'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-init-reset',
        sender: 'ai',
        text: 'Cuộc trò chuyện đã được làm mới. Tôi sẵn sàng hỗ trợ bạn!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Bot className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-lg text-slate-800 dark:text-white">
            Trợ giảng AI Toán Học
          </h2>
        </div>

        <button
          onClick={handleClearChat}
          className="px-3 py-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm flex items-center gap-2 font-medium"
          title="Xóa lịch sử chat"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Xóa Chat</span>
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[520px]">
        
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow text-xs font-bold ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm space-y-1.5 leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}>
                  <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none break-words leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {msg.text.replace(/\\\((.*?)\\\)/g, '$$$1$$').replace(/\\\[(.*?)\\\]/gs, '$$$$$1$$$$').replace(/\\\$/g, '$')}
                    </ReactMarkdown>
                  </div>
                  {msg.imageBase64 && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-white/20">
                      <img src={msg.imageBase64} alt="Đính kèm" className="max-w-full h-auto max-h-48 object-contain bg-black/10" />
                    </div>
                  )}

                  <div className={`flex items-center justify-between text-[10px] pt-1 opacity-70 ${isUser ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    <span>{msg.timestamp}</span>
                    {msg.usedModel && (
                      <span className="flex items-center gap-1 font-mono">
                        <Cpu className="w-3 h-3 text-purple-400" /> {msg.usedModel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-500" />
                Gemini AI đang soạn câu trả lời...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Image Preview Area */}
        {selectedImage && (
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-start gap-3 relative">
            <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm inline-block">
              <img src={selectedImage} alt="Preview" className="h-20 w-auto object-cover" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="text-xs text-slate-500 pt-2">
              Đã đính kèm hình ảnh.
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-b-2xl flex items-center gap-2"
        >
          <input 
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageSelect}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="p-3 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition disabled:opacity-50"
            title="Đính kèm ảnh bài toán"
          >
            <ImagePlus className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPaste={handlePaste}
            placeholder={selectedImage ? "Nhập câu hỏi cho ảnh này..." : "Nhập câu hỏi hoặc dán (Ctrl+V) ảnh bài toán vào đây..."}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || loading}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition disabled:opacity-40 flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi</span>
          </button>
        </form>

        <div className="text-center pb-2 text-[11px] text-slate-400 dark:text-slate-500">
          💡 Mẹo: Nhấn <b>Windows + Shift + S</b> khoanh vùng câu hỏi, sau đó ấn <b>Ctrl + V</b> để gửi nhanh!
        </div>

      </div>

      {/* Modal Cắt Ảnh (Crop Image) */}
      {cropModalOpen && rawImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <ImagePlus className="w-5 h-5 text-purple-500" />
                Cắt vùng chứa bài toán cần hỏi
              </h3>
              <button 
                onClick={() => setCropModalOpen(false)}
                className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 rounded-full text-slate-500 transition-colors"
                title="Hủy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 relative overflow-y-auto flex justify-center items-center">
              <ReactCrop 
                crop={crop} 
                onChange={(c) => setCrop(c)} 
                onComplete={(c) => setCompletedCrop(c)}
                className="max-w-full"
              >
                <img 
                  ref={imgRef}
                  src={rawImage} 
                  alt="Ảnh gốc" 
                  className="max-w-full h-auto max-h-[60vh] object-contain shadow-md rounded border border-slate-300 dark:border-slate-700" 
                />
              </ReactCrop>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kéo chuột để chọn một vùng. Nếu không cắt, toàn bộ ảnh sẽ được gửi.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold text-sm transition"
                >
                  Hủy
                </button>
                <button
                  onClick={applyCrop}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition"
                >
                  Xác nhận & Đính kèm
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
