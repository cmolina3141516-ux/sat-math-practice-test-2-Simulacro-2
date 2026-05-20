import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface TimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export function Timer({ initialSeconds, onTimeUp, isActive }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    setTimeRemaining(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  useEffect(() => {
    setIsWarning(timeRemaining <= 300);
  }, [timeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const formatTime = () => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold ${
        isWarning
          ? 'bg-red-100 text-red-700 animate-pulse'
          : 'bg-blue-100 text-blue-700'
      }`}
    >
      {isWarning && <AlertCircle className="w-5 h-5" />}
      <Clock className="w-5 h-5" />
      <span>{formatTime()}</span>
    </div>
  );
}
