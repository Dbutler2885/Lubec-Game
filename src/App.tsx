import React, { useState } from 'react';
import CharacterSheet from './CharacterSheet';
import ActionPanel, { Action } from './ActionPanel';

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

const App: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [rollHistory, setRollHistory] = useState<RollHistoryEntry[]>([]);

  const handleRollResult = (rolls: RollOutcome[], average: number) => {
    const newEntry: RollHistoryEntry = {
      timestamp: new Date(),
      rolls,
      average,
      action: selectedAction?.name || 'Manual Roll'
    };
    setRollHistory(prev => [newEntry, ...prev]);
  };

  return (
    <div className="App">
      <main className="container mx-auto p-4 flex justify-center space-x-4">
        <CharacterSheet 
          selectedAction={selectedAction}
          onRollResult={handleRollResult}
          rollHistory={rollHistory}
        />
        <ActionPanel 
          onActionSelect={setSelectedAction} 
          selectedAction={selectedAction}
        />
      </main>
    </div>
  );
};

export default App;