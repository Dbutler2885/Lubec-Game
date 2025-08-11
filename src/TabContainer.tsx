import React, { useState, useRef, useEffect } from 'react';

interface TabContainerProps {
  children: [React.ReactElement, React.ReactElement]; // Exactly 2 tabs
}

const TabContainer: React.FC<TabContainerProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = ['Character', 'Roll'];

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX.current);
      const diffY = Math.abs(currentY - startY.current);
      
      // Only prevent default if horizontal movement is greater than vertical
      if (diffX > diffY && diffX > 10) {
        e.preventDefault(); // Prevent scrolling only during horizontal swipes
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
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

    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, tabs.length]);

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
        ref={containerRef}
        className="flex-1 overflow-hidden flex justify-center"
        onTouchStart={handleTouchStart}
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