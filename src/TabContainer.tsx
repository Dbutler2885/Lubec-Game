import React, { useState, useRef } from 'react';

interface TabContainerProps {
  children: [React.ReactElement, React.ReactElement]; // Exactly 2 tabs
}

const TabContainer: React.FC<TabContainerProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const startX = useRef<number>(0);

  const tabs = ['Character', 'Roll'];

  // Simple touch handlers for tab switching
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = startX.current - endX;
    const threshold = 100; // Larger threshold for more intentional swipes
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && activeTab < tabs.length - 1) {
        // Swipe left - go to next tab
        setActiveTab(activeTab + 1);
      } else if (diffX < 0 && activeTab > 0) {
        // Swipe right - go to previous tab
        setActiveTab(activeTab - 1);
      }
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      {/* Tab Navigation */}
      <div className="flex bg-gray-200 border-b border-gray-300 flex-shrink-0">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`flex-1 py-3 px-4 text-sm font-bold transition-colors ${
              activeTab === index
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content with Swipe Support */}
      <div 
        className="flex-1 overflow-hidden flex justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab === 0 && (
          <div className="h-full overflow-auto w-full">
            {children[0]}
          </div>
        )}
        {activeTab === 1 && (
          <div className="h-full overflow-auto w-full">
            {children[1]}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabContainer;