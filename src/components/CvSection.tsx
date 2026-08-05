import React from 'react';
import { WORK_EXPERIENCES, EDUCATION_HISTORY, CERTIFICATIONS, PROFILE_INFO } from '../data/initialData';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Download, 
  CheckCircle2, 
  Code, 
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

export const CvSection: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Sơ Yếu Lý Lịch (Online Curriculum Vitae)
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            Tổng hợp kinh nghiệm làm việc, học vấn, chứng chỉ và kỹ năng chuyên môn chuẩn chỉnh.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-md hover:bg-blue-50 transition flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Download className="w-4 h-4" />
          Xuất CV / In Bản Đẹp
        </button>
      </div>

      {/* Printable CV Container */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-10 print:p-0 print:border-none print:shadow-none">
        
        {/* Header Block in CV */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {PROFILE_INFO.name}
            </h1>
            <p className="text-base font-bold text-blue-600 dark:text-blue-400">
              {PROFILE_INFO.role}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {PROFILE_INFO.bio}
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{PROFILE_INFO.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{PROFILE_INFO.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{PROFILE_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{PROFILE_INFO.website}</span>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            Kinh Nghiệm Làm Việc (Work Experience)
          </h2>

          <div className="space-y-8 pl-2 sm:pl-4">
            {WORK_EXPERIENCES.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-blue-500/40 space-y-2 group">
                {/* Timeline node */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500 group-hover:scale-125 transition" />
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {exp.role} <span className="text-blue-600 dark:text-blue-400 font-medium">@ {exp.company}</span>
                  </h3>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                    {exp.period}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Education */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <GraduationCap className="w-5 h-5 text-amber-500" />
              Học Vấn (Education)
            </h2>

            {EDUCATION_HISTORY.map((edu) => (
              <div key={edu.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{edu.degree}</h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{edu.school}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{edu.period}</span>
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  GPA: {edu.gpa}
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 pt-1">
                  {edu.achievements.map((ach, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <Award className="w-5 h-5 text-emerald-500" />
              Chứng Chỉ Quốc Tế (Certifications)
            </h2>

            <div className="space-y-3">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-base">
                      <i className={cert.badge}></i>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">{cert.name}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Complete Skills Grid */}
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Code className="w-5 h-5 text-purple-500" />
            Năng Lực Kỹ Thuật (Technical Competencies)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PROFILE_INFO.skills.map((sk) => (
              <div key={sk.name} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <i className={`${sk.icon} text-blue-500`}></i>
                    {sk.name}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">{sk.level}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full"
                    style={{ width: `${sk.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
