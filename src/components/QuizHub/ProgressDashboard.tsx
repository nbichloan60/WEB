import React from 'react';
import { AppData, Session } from '../../types';
import { 
  BarChart3, 
  Flame, 
  Target, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  History,
  TrendingUp
} from 'lucide-react';

interface ProgressDashboardProps {
  appData: AppData;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ appData }) => {
  const { progress, sessions, subjects } = appData;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Dashboard Tiến Độ Học Tập (Learning Progress)
          </h2>
          <p className="text-blue-200 text-xs sm:text-sm mt-1">
            Tổng hợp dữ liệu số lần luyện tập, điểm số trung bình và lịch sử thi thử.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{progress.totalAttempts}</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tổng Lượt Luyện Tập</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{progress.averageScore}%</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Điểm Trung Bình</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{progress.streakDays} ngày</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Chuỗi Học Liên Tục</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{sessions.length}</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Bài Đã Nộp</div>
          </div>
        </div>

      </div>

      {/* Weak Topics & Accuracy Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Weak Topics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Chủ Đề Cần Cải Thiện (Weak Topics)
          </h3>

          <div className="space-y-3">
            {progress.weakTopics.map((topic, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 font-semibold flex items-center justify-between">
                <span>{topic}</span>
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded">Khuyên ôn lại</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects list summary */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Kho Môn Học Đã Đón Nhận
          </h3>

          <div className="space-y-3">
            {subjects.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <i className={`${s.icon} text-blue-500 text-sm`}></i>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                </div>
                <span className="font-semibold text-slate-500">{s.questionsCount} câu hỏi</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Exam Session History */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <History className="w-4 h-4 text-blue-500" />
          Lịch Sử Kiểm Tra Gần Đây
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 uppercase text-[10px] font-bold text-slate-500 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Môn học</th>
                <th className="p-3">Điểm số</th>
                <th className="p-3">Số câu đúng</th>
                <th className="p-3">Thời gian</th>
                <th className="p-3">Ngày thi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{sess.subjectName || sess.subjectId}</td>
                  <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{sess.score}%</td>
                  <td className="p-3 font-medium">{sess.correctAnswers} / {sess.totalQuestions}</td>
                  <td className="p-3 font-medium">{sess.timeSpent}s</td>
                  <td className="p-3 text-slate-400">{formatDate(sess.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
