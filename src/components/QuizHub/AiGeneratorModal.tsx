import React, { useState } from 'react';
import { Subject, Question } from '../../types';
import { Sparkles, X, Loader2, Bot, PlusCircle } from 'lucide-react';
import { generateQuizQuestionsAI } from '../../utils/gemini';

interface AiGeneratorModalProps {
  isOpen: boolean;
  subject: Subject | null;
  onClose: () => void;
  onQuestionsGenerated: (subjectId: string, newQuestions: Question[]) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  subject,
  onClose,
  onQuestionsGenerated,
  onShowToast
}) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(3);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !subject) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const actualTopic = topic.trim() || subject.name;

    try {
      const generated = await generateQuizQuestionsAI(subject.name, actualTopic, count, difficulty);
      
      const newQuestions: Question[] = generated.map((q: any, idx: number) => ({
        id: `ai-q-${Date.now()}-${idx}`,
        subjectId: subject.id,
        content: q.content,
        type: 'multiple_choice',
        options: q.options || [],
        correctAnswer: q.correctAnswer ?? 0,
        explanation: q.explanation || 'Giải thích từ AI.',
        difficulty: q.difficulty || difficulty
      }));

      onQuestionsGenerated(subject.id, newQuestions);
      onShowToast('Tạo câu hỏi thành công!', `Đã thêm ${newQuestions.length} câu hỏi mới vào kho "${subject.name}".`, 'success');
      onClose();
    } catch (err: any) {
      onShowToast('Lỗi tạo câu hỏi', err?.message || 'Không thể tạo câu hỏi qua AI', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base">Tạo Câu Hỏi Bằng Gemini AI</h3>
              <p className="text-xs text-purple-200">Môn học: {subject.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Chủ đề nhỏ (Topic cụ thể)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`Ví dụ: ${subject.name} Advanced, Best Practices...`}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Số lượng câu
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={3}>3 câu hỏi</option>
                <option value={5}>5 câu hỏi</option>
                <option value={10}>10 câu hỏi</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Độ khó
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="easy">Dễ (Easy)</option>
                <option value="medium">Trung bình (Medium)</option>
                <option value="hard">Khó (Hard)</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
            Gemini AI sẽ tự động phân tích chủ đề, sinh câu hỏi trắc nghiệm chuẩn 4 đáp án kèm lời giải thích chi tiết bổ sung vào kho đề môn <strong>{subject.name}</strong>.
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              {loading ? 'Đang gọi Gemini AI...' : 'Tạo Tự Động'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
