import React, { useState, useRef } from 'react';
import CharacterSheet from './CharacterSheet';
import ActionPanel, { Action } from './ActionPanel';

const App: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const characterSheetRef = useRef<{ executeAction: (action: Action) => void } | null>(null);

  const handleActionSelect = (action: Action) => {
    setSelectedAction(action);
    characterSheetRef.current?.executeAction(action);
  };

  return (
    <div className="App">
      <main className="container mx-auto p-4 flex justify-center space-x-4">
        <CharacterSheet ref={characterSheetRef} selectedAction={selectedAction} />
        <ActionPanel onActionSelect={handleActionSelect} />
      </main>
    </div>
  );
}

export default App;