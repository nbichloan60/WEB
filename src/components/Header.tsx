import React, { useState } from 'react';
import { 
  Briefcase, 
  BookOpen, 
  Key, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  GraduationCap, 
  Bot, 
  FileText, 
  Mail, 
  Sparkles,
  Menu,
  X,
  MessageSquare,
  FileDown,
  Network,
  Video,
  Newspaper,
  Home
} from 'lucide-react';
import { AppData } from '../types';
import { exportDataAsJson, importDataFromJson, getStoredApiKey } from '../utils/storage';

export type TabType = 'portfolio' | 'info' | 'materials' | 'mindmap' | 'video' | 'quiz' | 'tutor' | 'projects' | 'blog' | 'contact';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  appData: AppData;
  onDataUpdate: (newData: AppData) => void;
  onOpenApiKeyModal: () => void;
  hasServerKey: boolean;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  appData,
  onDataUpdate,
  onOpenApiKeyModal,
  hasServerKey,
  onShowToast
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const localKey = getStoredApiKey();
  const isKeyActive = !!localKey || hasServerKey;

  const handleToggleTheme = () => {
    const nextTheme = appData.settings.theme === 'light' ? 'dark' : 'light';
    const updated = {
      ...appData,
      settings: { ...appData.settings, theme: nextTheme }
    };
    onDataUpdate(updated);
  };

  const handleToggleSound = () => {
    const nextSound = !appData.settings.soundEnabled;
    const updated = {
      ...appData,
      settings: { ...appData.settings, soundEnabled: nextSound }
    };
    onDataUpdate(updated);
    onShowToast(
      nextSound ? 'Đã bật âm thanh' : 'Đã tắt âm thanh',
      nextSound ? 'Âm thanh phản hồi đáp án đã được kích hoạt.' : 'Đã tắt hiệu ứng âm thanh.',
      'info'
    );
  };

  const handleExport = () => {
    exportDataAsJson(appData);
    onShowToast('Đã xuất file dữ liệu', 'File JSON sao lưu đã được tải xuống.', 'success');
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const restored = importDataFromJson(content);
        if (restored) {
          onDataUpdate(restored);
          onShowToast('Đã phục hồi dữ liệu!', 'Dữ liệu học tập & cài đặt đã cập nhật từ file JSON.', 'success');
        } else {
          onShowToast('Lỗi đọc file', 'File JSON không đúng cấu trúc AppData.', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'info', label: 'Trang thông tin', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'materials', label: 'Tài liệu', icon: <FileDown className="w-4 h-4" /> },
    { id: 'mindmap', label: 'Sơ đồ tư duy', icon: <Network className="w-4 h-4" /> },
    { id: 'video', label: 'Video bài giảng', icon: <Video className="w-4 h-4" /> },
    { id: 'tutor', label: 'Trợ giảng AI', icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3">
        
        {/* Top Row: Brand Logo & Mobile Menu */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onTabChange('portfolio')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight flex items-center gap-1.5">
                GV Lê Vĩnh Phúc
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                SĐT: 0944405124
              </p>
            </div>
          </button>

          {/* Mobile Menu Button (Only visible on small screens) */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Bottom Row: Desktop Navigation & Actions */}
        <div className="hidden lg:flex items-center justify-between gap-4 w-full">
          {/* Desktop Navigation */}
          <nav className="flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2">
            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-sm ${
                isKeyActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 animate-pulse'
              }`}
              title="Cài đặt API Key Gemini AI"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isKeyActive ? 'API Key: Đã sẵn sàng' : 'Nhập API Key'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isKeyActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </button>


          </div>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>


        </div>
      )}
    </header>
  );
};
