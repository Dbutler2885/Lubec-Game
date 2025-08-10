import React, { useState, useRef } from 'react';

interface TabContainerProps {
  children: [React.ReactElement, React.ReactElement]; // Exactly 2 tabs
}

const TabContainer: React.FC<TabContainerProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const startX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const tabs = ['Character', 'Roll'];

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while swiping
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX.current - endX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && activeTab < tabs.length - 1) {
        // Swipe left - go to next tab
        setActiveTab(activeTab + 1);
      } else if (diffX < 0 && activeTab > 0) {
        // Swipe right - go to previous tab
        setActiveTab(activeTab - 1);
      }
    }
    
    isDragging.current = false;
  };

  return (
    <div className="w-screen h-full bg-white flex flex-col">
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
        className="flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab === 0 && (
          <div className="h-full overflow-auto">
            {children[0]}
          </div>
        )}
        {activeTab === 1 && (
          <div className="h-full overflow-auto">
            {children[1]}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabContainer;