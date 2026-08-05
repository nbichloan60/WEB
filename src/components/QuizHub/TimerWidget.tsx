import React, { useEffect, useState } from 'react';
import { Timer, Pause, Play } from 'lucide-react';

interface TimerWidgetProps {
  initialSeconds: number;
  onTimeExpired: () => void;
  onTimeUpdate?: (secondsLeft: number) => void;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({
  initialSeconds,
  onTimeExpired,
  onTimeUpdate
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      onTimeExpired();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (onTimeUpdate) onTimeUpdate(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, isPaused, onTimeExpired, onTimeUpdate]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsLeft < 60;

  return (
    <div
      className={`px-4 py-2 rounded-xl border flex items-center gap-3 transition shadow-sm ${
        isLowTime
          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
      }`}
    >
      <Timer className={`w-4 h-4 ${isLowTime ? 'text-rose-500' : 'text-blue-500'}`} />
      
      <div className="font-mono text-sm font-bold tracking-wider">
        {formatTime(secondsLeft)}
      </div>

      <button
        onClick={() => setIsPaused(!isPaused)}
        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition text-slate-500"
        title={isPaused ? 'Tiếp tục đồng hồ' : 'Tạm dừng đồng hồ'}
      >
        {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-500" /> : <Pause className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
