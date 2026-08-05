import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, AlertCircle, RefreshCw, X, Cpu, ExternalLink, ShieldCheck } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../utils/storage';
import { MODELS, callGeminiAI } from '../utils/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelSelect: (model: string) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  hasServerKey?: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onModelSelect,
  onShowToast,
  hasServerKey = false,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey.trim());
    onShowToast('Đã lưu cấu hình API Key', 'API Key đã được cập nhật thành công trong LocalStorage.', 'success');
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    setTestResult(null);
    onShowToast('Đã xóa API Key cá nhân', 'Hệ thống sẽ thử sử dụng GEMINI_API_KEY từ Server nếu có.', 'info');
  };

  const handleTestKey = async () => {
    setTesting(true);
    setTestResult(null);

    // Save temporary if typed
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
    }

    try {
      const res = await callGeminiAI('Hãy chào tôi ngắn gọn bằng 1 câu tiếng Việt.');
      if (res.error) {
        setTestResult({
          success: false,
          message: `Lỗi: ${res.error}`
        });
      } else {
        setTestResult({
          success: true,
          message: `Thành công! Phản hồi từ model ${res.usedModel}: "${res.text.trim()}"`
        });
        onShowToast('API Key hoạt động tốt!', `Kết nối thành công với ${res.usedModel}`, 'success');
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Không thể kiểm tra API Key'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Cấu hình Gemini AI API Key</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Quản lý API Key & Model AI thông minh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Server Status Badge */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <ShieldCheck className={`w-5 h-5 shrink-0 ${hasServerKey ? 'text-emerald-500' : 'text-amber-500'}`} />
            <div className="text-xs text-slate-600 dark:text-slate-300">
              {hasServerKey ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Máy chủ đã được cài sẵn GEMINI_API_KEY mặc định.
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Chưa phát hiện Server Key. Hãy nhập API Key cá nhân của bạn dưới đây.
                </span>
              )}
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Gemini API Key Cá Nhân
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 pr-12 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Lưu an toàn trong LocalStorage trình duyệt</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                Lấy API Key miễn phí <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500" /> Chọn Model Ưu Tiên
            </label>
            <select
              value={selectedModel}
              onChange={(e) => onModelSelect(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium"
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {m} {m === 'gemini-3.6-flash' ? '(Khuyên dùng - Nhanh & Chuẩn)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Fallback Explanation */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 leading-relaxed space-y-1">
            <p className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Cơ chế Fallback Tự Động:
            </p>
            <p className="opacity-90">
              Nếu model được chọn gặp lỗi quá tải (500/503) hoặc giới hạn tốc độ (429), ứng dụng sẽ tự động chuyển sang thử nghiệm lần lượt: <code className="bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded text-blue-800 dark:text-blue-200">{MODELS.join(' → ')}</code>.
            </p>
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200 ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{testResult.message}</div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={testing}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-blue-500' : ''}`} />
              {testing ? 'Đang kiểm tra...' : 'Kiểm tra API Key'}
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              >
                Xóa Key
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-md hover:shadow-lg transition transform active:scale-95"
            >
              Lưu & Áp Dụng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
