import React, { useState } from 'react';
import { Question, Subject } from '../../types';
import { TimerWidget } from './TimerWidget';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  HelpCircle, 
  Flag,
  RotateCcw,
  Bot,
  Loader2
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { askAiTutor } from '../../utils/gemini';

interface QuizRunnerProps {
  subject: Subject;
  questions: Question[];
  mode: 'practice' | 'exam';
  soundEnabled: boolean;
  onFinishQuiz: (userAnswers: Record<string, number>, timeSpentSeconds: number) => void;
  onCancelQuiz: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  subject,
  questions,
  mode,
  soundEnabled,
  onFinishQuiz,
  onCancelQuiz
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [startTime] = useState<number>(Date.now());
  
  // AI Explanation state
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAiExp, setLoadingAiExp] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedOption = userAnswers[currentQuestion?.id];
  const hasAnswered = selectedOption !== undefined;

  const handleSelectOption = (optionIndex: number) => {
    if (userAnswers[currentQuestion.id] !== undefined && mode === 'practice') {
      return; // Freeze in practice mode after picking
    }

    const nextAnswers = { ...userAnswers, [currentQuestion.id]: optionIndex };
    setUserAnswers(nextAnswers);

    // Play audio
    if (soundEnabled) {
      if (optionIndex === currentQuestion.correctAnswer) {
        sounds.playCorrectSound();
      } else {
        sounds.playWrongSound();
      }
    }
  };

  const handleNext = () => {
    setAiExplanation(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    setAiExplanation(null);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = () => {
    const elapsedSecs = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    onFinishQuiz(userAnswers, elapsedSecs);
  };

  const handleAskAiExplanation = async () => {
    if (!currentQuestion) return;
    setLoadingAiExp(true);
    setAiExplanation(null);

    const prompt = `Giải thích ngắn gọn tại sao phương án "${currentQuestion.options[currentQuestion.correctAnswer]}" là đáp án đúng cho câu hỏi: "${currentQuestion.content}". Lý do các phương án khác chưa chính xác là gì?`;

    try {
      const res = await askAiTutor([], prompt);
      if (res.error) {
        setAiExplanation(`Lỗi: ${res.error}`);
      } else {
        setAiExplanation(res.text);
      }
    } catch (err: any) {
      setAiExplanation('Không thể lấy giải thích từ AI.');
    } finally {
      setLoadingAiExp(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">Không tìm thấy câu hỏi trong môn học này.</p>
        <button onClick={onCancelQuiz} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Quay Lại
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Quiz Top Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        
        {/* Subject Badge */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.color} text-white flex items-center justify-center font-bold text-lg shadow`}>
            <i className={subject.icon}></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{subject.name}</h3>
            <p className="text-xs text-slate-500 capitalize">{mode === 'exam' ? 'Thi thử có giới hạn thời gian' : 'Luyện tập không áp lực'}</p>
          </div>
        </div>

        {/* Timer or Counter */}
        <div className="flex items-center gap-3">
          {mode === 'exam' && (
            <TimerWidget
              initialSeconds={questions.length * 60} // 1 min per question
              onTimeExpired={handleComplete}
            />
          )}

          <button
            onClick={onCancelQuiz}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Thoát
          </button>
        </div>

      </div>

      {/* Question Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
          <span>Câu hỏi {currentIndex + 1} / {questions.length}</span>
          <span className="text-blue-600 dark:text-blue-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        
        {/* Difficulty Pill & Question Content */}
        <div className="space-y-3">
          <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
            currentQuestion.difficulty === 'easy'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              : currentQuestion.difficulty === 'medium'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
          }`}>
            Độ khó: {currentQuestion.difficulty}
          </span>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.content}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((optionText, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrect = optIdx === currentQuestion.correctAnswer;
            
            // In practice mode, reveal colors after answering
            let optionStyle = "border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200";

            if (mode === 'practice' && hasAnswered) {
              if (isCorrect) {
                optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 font-bold shadow";
              } else if (isSelected && !isCorrect) {
                optionStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 font-bold";
              }
            } else if (isSelected) {
              optionStyle = "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100 font-bold ring-2 ring-blue-500";
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-relaxed">{optionText}</span>
                </div>

                {mode === 'practice' && hasAnswered && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & AI Explanation in Practice mode */}
        {mode === 'practice' && hasAnswered && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              <span className="font-bold block mb-1">💡 Lời giải thích:</span>
              {currentQuestion.explanation}
            </div>

            {/* AI Tutor Explanation Request */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleAskAiExplanation}
                disabled={loadingAiExp}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {loadingAiExp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                Hỏi Gemini AI Giải Thích Chi Tiết Hơn
              </button>
            </div>

            {aiExplanation && (
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 leading-relaxed whitespace-pre-line animate-in fade-in">
                <span className="font-bold block mb-1">🤖 Phân tích nâng cao từ Trợ lý Gemini AI:</span>
                {aiExplanation}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Câu Trước
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleComplete}
            className="px-6 py-2.5 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-lg hover:shadow-xl transition transform active:scale-95"
          >
            Nộp Bài & Xem Kết Quả
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition flex items-center gap-1.5 active:scale-95"
          >
            Câu Tiếp Theo <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
