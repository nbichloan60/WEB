import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            © 2026 Lê Vĩnh Phúc. Hệ thống Giáo dục Cá nhân & AI Learning Hub.
          </p>
        </div>

        <div className="flex items-center gap-1 font-medium">
          <span>Xây dựng bằng React 19, Tailwind CSS & Google Gemini AI</span>
        </div>
      </div>
    </footer>
  );
};
