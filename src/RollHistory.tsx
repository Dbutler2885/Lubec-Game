import React, { useState, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface RollOutcome {
  ability: string;
  die: string;
  rollResults: number[];
  modifier: number;
  finalTotal: number;
}

interface RollHistoryEntry {
  timestamp: Date;
  rolls: RollOutcome[];
  average: number;
  action: string;
}

interface RollHistoryProps {
  history: RollHistoryEntry[];
}

const RollHistory: React.FC<RollHistoryProps> = ({ history }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [history]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex < history.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const goToNext = () => {  
    setCurrentIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  if (history.length === 0) {
    return (
      <div className="mb-4">
        <h4 className="font-bold bg-gray-800 text-white p-1 mb-1 text-sm">ROLL HISTORY</h4>
        <div className="bg-gray-200 flex items-center justify-center text-gray-500 py-4">
          No rolls yet
        </div>
      </div>
    );
  }

  const currentEntry = history[currentIndex];
  const rollNumber = history.length - currentIndex;

  const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const rollLabel = `${rollNumber}${getOrdinalSuffix(rollNumber)}`;

  return (
    <div className="mb-4">
      <h4 className="font-bold bg-gray-800 text-white p-1 mb-1 text-sm">ROLL HISTORY</h4>
      <div className="bg-gray-200 relative">
        <div className="p-2 pr-8 text-xs flex flex-col justify-start">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xs">{rollLabel} Roll</span>
            <span className="text-gray-600 flex items-center text-[10px]">
              <Clock size={10} className="mr-1" />
              {currentEntry.timestamp.toLocaleTimeString([], {timeStyle: 'short'})}
            </span>
          </div>
          <div className="font-bold text-xs">
            Result: {currentEntry.average}
          </div>
          <div className="text-[10px] mb-1">
            Action: {currentEntry.action}
          </div>
          <div className="space-y-0">
            {currentEntry.rolls.map((roll, rollIndex) => (
              <div key={rollIndex} className="text-[9px] leading-tight">
                <span>{roll.ability} ({roll.die}): </span>
                <span>{roll.rollResults.join('+')}</span>
                {roll.modifier !== 0 && (
                  <span className={roll.modifier > 0 ? 'text-green-600' : 'text-red-600'}>
                    {roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier}
                  </span>
                )}
                <span> = {roll.finalTotal}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col">
          <button 
            onClick={goToNext}
            className="bg-gray-300 p-1 rounded-t"
            disabled={currentIndex === 0}
          >
            <ChevronUp size={20} />
          </button>
          <button 
            onClick={goToPrevious}
            className="bg-gray-300 p-1 rounded-b"
            disabled={currentIndex === history.length - 1}
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RollHistory;