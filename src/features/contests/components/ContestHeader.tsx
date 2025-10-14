import { useState, useEffect } from 'react';

interface ContestHeaderProps {
  contestName?: string;
  totalTime?: number;
}

export const ContestHeader = ({ 
  totalTime = 180    
}: ContestHeaderProps) => {
  const [timeRemaining, setTimeRemaining] = useState(totalTime * 60);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const totalSeconds = totalTime * 60;
    const elapsed = totalSeconds - timeRemaining;
    const progressPercentage = (elapsed / totalSeconds) * 100;
    setProgress(Math.min(progressPercentage, 100));
  }, [timeRemaining, totalTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-400'; //5 minutes
    if (timeRemaining <= 900) return 'text-yellow-400'; // 15 minutes
    return 'text-green-400';
  };

  return (
    <div className="w-full bg-black border-b border-gray-700 sticky top-0 z-50">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-white font-['DM_Sans']">Point Blank Recruitment Test 2025</h1>
            <div className="text-right">
              <div className="text-s text-gray-400 font-['DM_Sans']">Time remaining</div>
              <div className={`text-xl font-['DM_Sans'] font-mono ${getTimeColor()}`}>
                {timeRemaining > 0 ? formatTime(timeRemaining) : 'Time Up!'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full bg-green h-1">
          <div 
            className="bg-white h-1 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
  );
};
