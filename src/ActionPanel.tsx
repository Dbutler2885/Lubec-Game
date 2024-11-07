import React, { useState, useCallback, useMemo } from 'react';
import Button from './Button';
import AbilitySelector from './AbilitySelector';
import RollHistory from './RollHistory';

export interface Action {
  name: string;
  abilities: [string, string];
  description: string;
  category: string;
}

interface Ability {
  die: string;
  label: string;
}

interface RollOutcome {
  ability: string;
  die: string;
  rollResults: number[];
  modifier: number;
  finalTotal: number;
}

interface RollResult {
  rolls: RollOutcome[];
  average: number;
}

interface RollHistoryEntry {
  timestamp: Date;
  rolls: RollOutcome[];
  average: number;
  action: string;
}

const actions: Action[] = [
  // Social
  { name: "Convince", abilities: ["Charm", "Brains"], description: "Average Roll vs TN", category: "Social" },
  { name: "Intimidate", abilities: ["Charm", "Brawn"], description: "Average Roll vs TN", category: "Social" },
  { name: "Lie", abilities: ["Charm", "Flight"], description: "Average Roll vs TN", category: "Social" },
  { name: "Act", abilities: ["Charm", "Handle"], description: "Average Roll vs TN", category: "Social" },
  
  // Athletics
  { name: "Move Heavy", abilities: ["Brawn", "Grit"], description: "Average Roll vs TN", category: "Athletics" },
  { name: "Sneak", abilities: ["Flight", "Grit"], description: "Average Roll vs opposing Notice Roll", category: "Athletics" },
  { name: "Hide", abilities: ["Flight", "Brains"], description: "Average Roll vs opposing Notice Roll", category: "Athletics" },
  { name: "Acrobatics", abilities: ["Flight", "Handle"], description: "Average Roll vs TN", category: "Athletics" },
  
  // Academics
  { name: "Study", abilities: ["Brains", "Grit"], description: "Average Roll vs TN", category: "Academics" },
  { name: "Technology", abilities: ["Brains", "Handle"], description: "Average Roll vs TN", category: "Academics" },
  { name: "Crafting", abilities: ["Charm", "Handle"], description: "Average Roll vs TN", category: "Academics" },
  
  // Perception
  { name: "Notice", abilities: ["Brains", "Handle"], description: "Average Roll vs TN", category: "Perception" },
  { name: "Investigate", abilities: ["Brains", "Grit"], description: "Average Roll vs TN", category: "Perception" },
];

const ActionPanel: React.FC = () => {
  const categories = useMemo(() => Array.from(new Set(actions.map(action => action.category))), []);
  const [rollHistory, setRollHistory] = useState<RollHistoryEntry[]>([]);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  const abilities = useMemo<Ability[]>(() => [
    { die: 'D20', label: 'Brains' },
    { die: 'D12', label: 'Handle' },
    { die: 'D10', label: 'Grit' },
    { die: 'D8', label: 'Charm' },
    { die: 'D6', label: 'Flight' },
    { die: 'D4', label: 'Brawn' },
  ], []);

  const handleRollResult = useCallback((result: RollResult) => {
    const newHistoryEntry: RollHistoryEntry = {
      timestamp: new Date(),
      rolls: result.rolls,
      average: result.average,
      action: selectedAction ? selectedAction.name : 'Manual Roll',
    };
    setRollHistory(prev => [newHistoryEntry, ...prev]);
  }, [selectedAction]);

  const executeAction = useCallback((action: Action) => {
    setSelectedAction(action);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-100 p-4 font-mono text-gray-800 w-[480px] border-4 border-gray-300 shadow-lg">
        <h1 className="font-bold bg-gray-800 text-white p-1 mb-4 text-lg text-center">ROLL CALCULATOR</h1>
        <AbilitySelector
          abilities={abilities}
          onRollResult={handleRollResult}
          action={selectedAction}
        />

        <RollHistory history={rollHistory} />

        <h2 className="font-bold bg-gray-800 text-white p-1 mb-4 text-sm">ACTIONS</h2>
        
        {categories.map(category => (
          <div key={category} className="mb-4">
            <h3 className="font-bold text-sm mb-2">{category}</h3>
            <div className="grid grid-cols-4 gap-2">
              {actions
                .filter(action => action.category === category)
                .map((action) => (
                  <ActionButton key={action.name} action={action} onActionSelect={executeAction} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ action: Action; onActionSelect: (action: Action) => void }> = ({ action, onActionSelect }) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowDescription(true)}
      onMouseLeave={() => setShowDescription(false)}
    >
      <Button
        onClick={() => onActionSelect(action)}
        className="action-button"
      >
        <div className="text-xs">{action.name}</div>
      </Button>
      {showDescription && (
        <div className="absolute z-10 bg-white border border-gray-300 p-2 rounded shadow-lg text-xs w-48 -mt-2 left-1/2 transform -translate-x-1/2">
          <p className="font-bold mb-1">{action.abilities.join(" + ")}</p>
          <p>{action.description}</p>
        </div>
      )}
    </div>
  );
};

export default ActionPanel;