import React, { useState, useEffect } from 'react';
import { Question, Subject } from '../../types';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Bot, 
  Loader2,
  Award
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { askAiTutor } from '../../utils/gemini';

interface ScoreBoardProps {
  subject: Subject;
  questions: Question[];
  userAnswers: Record<string, number>;
  timeSpentSeconds: number;
  soundEnabled: boolean;
  onRetryQuiz: () => void;
  onBackToSubjects: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  subject,
  questions,
  userAnswers,
  timeSpentSeconds,
  soundEnabled,
  onRetryQuiz,
  onBackToSubjects
}) => {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAiAdvice, setLoadingAiAdvice] = useState(false);

  // Calculate score
  let correctCount = 0;
  questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const totalQuestions = questions.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  useEffect(() => {
    if (soundEnabled) {
      sounds.playCompleteSound();
    }
  }, [soundEnabled]);

  const handleGetAiAdvice = async () => {
    setLoadingAiAdvice(true);
    setAiAdvice(null);

    const wrongQuestions = questions.filter((q) => userAnswers[q.id] !== q.correctAnswer);
    const wrongTopics = wrongQuestions.map((q) => q.content).join('; ');

    const prompt = `Học viên vừa hoàn thành bài test chủ đề "${subject.name}" với điểm số ${scorePercent}% (${correctCount}/${totalQuestions} câu đúng) trong thời gian ${timeSpentSeconds} giây.
Các câu trả lời chưa đúng gồm: [${wrongTopics}].
Hãy phân tích điểm yếu và đưa ra 3 lời khuyên ôn tập cụ thể, dễ thực hiện nhất bằng tiếng Việt.`;

    try {
      const res = await askAiTutor([], prompt);
      if (res.error) {
        setAiAdvice(`Lỗi: ${res.error}`);
      } else {
        setAiAdvice(res.text);
      }
    } catch (err: any) {
      setAiAdvice('Không thể kết nối đến AI Tutor.');
    } finally {
      setLoadingAiAdvice(false);
    }
  };

  const getBadge = () => {
    if (scorePercent >= 80) return { title: 'Thần Đồng Lập Trình 🌟', color: 'from-amber-400 to-amber-600', text: 'Xuất Sắc! Bạn đã làm chủ kiến thức này.' };
    if (scorePercent >= 50) return { title: 'Thợ Code Siêu Cấp 👍', color: 'from-blue-400 to-blue-600', text: 'Khá Lắm! Hãy củng cố thêm vài chủ đề nhỏ.' };
    return { title: 'Tập Sự Cố Gắng 💪', color: 'from-purple-400 to-purple-600', text: 'Đừng nản lòng! Ôn lại bài và thử lại ngay nhé.' };
  };

  const badge = getBadge();

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Result Hero Banner */}
      <div className={`p-8 rounded-3xl bg-gradient-to-br ${badge.color} text-white shadow-2xl text-center space-y-4 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-md shadow-inner text-white">
          <Trophy className="w-12 h-12" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black">{badge.title}</h1>
        <p className="text-sm opacity-90">{badge.text}</p>

        {/* Score Ring */}
        <div className="pt-2 flex justify-center">
          <div className="w-28 h-28 rounded-full bg-white text-slate-900 font-black text-3xl flex flex-col items-center justify-center shadow-2xl border-4 border-white/40">
            <span>{scorePercent}%</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Điểm Số</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="flex justify-center text-emerald-500 mb-1"><CheckCircle2 className="w-6 h-6" /></div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{correctCount} / {totalQuestions}</div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Số Câu Đúng</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="flex justify-center text-rose-500 mb-1"><XCircle className="w-6 h-6" /></div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{totalQuestions - correctCount}</div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Số Câu Sai</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="flex justify-center text-blue-500 mb-1"><Clock className="w-6 h-6" /></div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{timeSpentSeconds}s</div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Thời Gian Làm</div>
        </div>
      </div>

      {/* AI Advice Panel */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-purple-900 dark:text-purple-200">
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
            Nhận Đánh Giá & Gợi Ý Ôn Tập Từ Gemini AI
          </div>
          <button
            onClick={handleGetAiAdvice}
            disabled={loadingAiAdvice}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition shadow-md disabled:opacity-50 flex items-center gap-1.5"
          >
            {loadingAiAdvice ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
            {loadingAiAdvice ? 'Đang phân tích...' : 'Phân Tích Bằng AI'}
          </button>
        </div>

        {aiAdvice && (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in">
            {aiAdvice}
          </div>
        )}
      </div>

      {/* Question Answer Breakdown */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          Xem Lại Đáp Án Chi Tiết
        </h3>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userPick = userAnswers[q.id];
            const isCorrect = userPick === q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border space-y-2 text-xs ${
                  isCorrect
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 font-semibold text-slate-900 dark:text-white">
                  <span>Câu {idx + 1}: {q.content}</span>
                  {isCorrect ? (
                    <span className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Đúng
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 shrink-0 font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Sai
                    </span>
                  )}
                </div>

                <div className="text-slate-600 dark:text-slate-300 space-y-1">
                  <p>Đáp án đúng: <strong className="text-emerald-700 dark:text-emerald-300">{q.options[q.correctAnswer]}</strong></p>
                  {userPick !== undefined && userPick !== q.correctAnswer && (
                    <p>Bạn đã chọn: <strong className="text-rose-700 dark:text-rose-300">{q.options[userPick]}</strong></p>
                  )}
                  <p className="text-[11px] text-slate-500 italic mt-1">💡 {q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToSubjects}
          className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Danh Sách Môn Học
        </button>

        <button
          onClick={onRetryQuiz}
          className="px-6 py-3 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Thử Lại Lần Nữa
        </button>
      </div>

    </div>
  );
};
