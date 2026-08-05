import React, { useState } from 'react';
import { PROFILE_INFO } from '../data/initialData';
import { Mail, Phone, MapPin, Send, CheckCircle2, Github, Linkedin, Globe, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onShowToast('Vui lòng điền đủ thông tin', 'Tên, email và lời nhắn không được để trống.', 'warning');
      return;
    }

    setSending(true);

    setTimeout(() => {
      setSending(false);
      onShowToast('Gửi tin nhắn thành công!', `Cảm ơn ${formData.name}, tôi sẽ phản hồi lại qua email ${formData.email} sớm nhất!`, 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold border border-blue-400/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Liên Hệ & Hợp Tác
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">Hãy Cùng Nhau Xây Dựng Sản Phẩm Tuyệt Vời!</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Bạn đang tìm kiếm ứng viên Full-Stack & AI Engineer tài năng hay muốn tư vấn dự án? Đừng ngần ngại để lại thông tin bên dưới!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Thông Tin Trực Tiếp</h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Email</div>
                  <a href={`mailto:${PROFILE_INFO.email}`} className="font-bold text-slate-900 dark:text-white hover:text-blue-500 transition">
                    {PROFILE_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Điện thoại</div>
                  <a href={`tel:${PROFILE_INFO.phone}`} className="font-bold text-slate-900 dark:text-white hover:text-blue-500 transition">
                    {PROFILE_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">Địa điểm</div>
                  <div className="font-bold text-slate-900 dark:text-white">{PROFILE_INFO.location}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Mạng Xã Hội</h3>
            <div className="flex items-center gap-3">
              <a
                href={PROFILE_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a
                href={PROFILE_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Gửi Lời Nhắn Trực Tiếp</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">
                    Họ và Tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn B"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">
                    Địa chỉ Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@company.com"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">
                  Tiêu đề cuộc trò chuyện
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Mời phỏng vấn / Hợp tác dự án SaaS..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">
                  Nội dung tin nhắn <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Xin chào A, tôi muốn trao đổi về vị trí công việc..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sending ? (
                  <span>Đang gửi tin nhắn...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Gửi Tin Nhắn Ngay
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
