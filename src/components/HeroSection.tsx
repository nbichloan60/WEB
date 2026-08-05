import React from 'react';
import { PROFILE_INFO } from '../data/initialData';
import { 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  FileText, 
  GraduationCap, 
  Award, 
  ChevronRight,
  Code2,
  Brain,
  Rocket
} from 'lucide-react';
import { TabType } from './Header';

interface HeroSectionProps {
  onTabChange: (tab: TabType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onTabChange }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 lg:py-16">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/10 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-4" />
              <span>Sẵn sàng cho các dự án mới & Tuyển dụng</span>
            </div>

            {/* Profile Avatar Card */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-primary opacity-70 blur group-hover:opacity-100 transition duration-300" />
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-slate-100 dark:bg-slate-800">
                <img
                  src={PROFILE_INFO.avatar}
                  alt={PROFILE_INFO.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white dark:bg-slate-800 p-2.5 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            {/* Name & Role */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {PROFILE_INFO.name}
              </h1>
              <p className="text-base sm:text-lg font-bold text-gradient-primary mt-2">
                {PROFILE_INFO.role}
              </p>
            </div>

            {/* Contact Quick Meta */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                {PROFILE_INFO.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                {PROFILE_INFO.email}
              </span>
            </div>

            {/* Social Buttons */}
            <div className="flex items-center gap-3">
              <a
                href={PROFILE_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PROFILE_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <button
                onClick={() => onTabChange('contact')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-blue-600 dark:hover:bg-blue-400 transition shadow-sm"
              >
                Gửi Tin Nhắn
              </button>
            </div>

          </div>

          {/* Right Column: Bio, Stats & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Bio Card */}
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xl backdrop-blur-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-500" />
                Giới Thiệu Bản Thân
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {PROFILE_INFO.bio}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Hệ thống trang web này được tích hợp sẵn danh mục dự án nổi bật, blog cá nhân và đặc biệt là hệ thống <strong className="text-blue-600 dark:text-blue-400">Ôn tập & Kiểm tra Kiến thức AI</strong> kết hợp <strong className="text-amber-500">Trợ lý Gemini AI Tutor</strong> giúp bạn thử sức với các bài test kỹ năng thực tế ngay lập tức.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onTabChange('quiz')}
                  className="px-5 py-3 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Làm Bài Test Kỹ Năng AI
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onTabChange('projects')}
                  className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-blue-500 transition shadow-sm flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4 text-blue-500" />
                  Xem Danh Mục Dự Án
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{PROFILE_INFO.stats.yearsExp}</div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Năm Kinh Nghiệm</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <div className="text-2xl font-black text-amber-500">{PROFILE_INFO.stats.projectsDone}</div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Dự Án Đã Làm</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <div className="text-2xl font-black text-emerald-500">{PROFILE_INFO.stats.githubStars}</div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">GitHub Stars</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <div className="text-2xl font-black text-purple-500">{PROFILE_INFO.stats.coffeeCups}</div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Tách Cà Phê</div>
              </div>
            </div>

            {/* Key Skill Progress Bars */}
            <div className="p-5 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-amber-500" />
                Kỹ Năng Cốt Lõi (Core Technical Stack)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {PROFILE_INFO.skills.slice(0, 4).map((sk) => (
                  <div key={sk.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                      <span>{sk.name}</span>
                      <span className="text-blue-600 dark:text-blue-400">{sk.level}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary rounded-full transition-all duration-1000"
                        style={{ width: `${sk.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
