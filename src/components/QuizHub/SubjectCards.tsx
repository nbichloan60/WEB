import React from 'react';
import { Subject } from '../../types';
import { Play, Plus, BookOpen, Brain, Sparkles } from 'lucide-react';

interface SubjectCardsProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject, mode: 'practice' | 'exam') => void;
  onOpenAiGenerator: (subject: Subject) => void;
}

export const SubjectCards: React.FC<SubjectCardsProps> = ({
  subjects,
  onSelectSubject,
  onOpenAiGenerator
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Danh Sách Môn Học & Kỹ Năng
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chọn chủ đề để luyện tập hoặc bắt đầu thi thử có tính giờ.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header Icon */}
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${sub.color} text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition duration-300`}>
                  <i className={sub.icon}></i>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                  {sub.questionsCount} câu hỏi
                </span>
              </div>

              {/* Title & Desc */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {sub.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectSubject(sub, 'practice')}
                  className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" /> Luyện Tập
                </button>
                <button
                  onClick={() => onSelectSubject(sub, 'exam')}
                  className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Thi Thử
                </button>
              </div>

              <button
                onClick={() => onOpenAiGenerator(sub)}
                className="w-full py-2 rounded-xl border border-dashed border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Tạo Câu Hỏi Mới Bằng AI
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
