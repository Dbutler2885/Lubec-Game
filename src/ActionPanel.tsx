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

interface ActionPanelProps {
  onActionSelect: (action: Action | null) => void;
  selectedAction: Action | null;
  calculateModifier: (ability: string) => number;
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

const ActionPanel: React.FC<ActionPanelProps> = ({ onActionSelect, selectedAction, calculateModifier }) => {
  const [rollHistory, setRollHistory] = useState<RollHistoryEntry[]>([]);
  const categories = Array.from(new Set(actions.map(action => action.category)));

  const abilities = useMemo(() => [
    { die: 'D20', label: 'Brains' },
    { die: 'D12', label: 'Handle' },
    { die: 'D10', label: 'Grit' },
    { die: 'D8', label: 'Charm' },
    { die: 'D6', label: 'Flight' },
    { die: 'D4', label: 'Brawn' },
  ], []);


  const handleRollResult = useCallback((result: { rolls: RollOutcome[], average: number }) => {
    const newEntry: RollHistoryEntry = {
      timestamp: new Date(),
      rolls: result.rolls,
      average: result.average,
      action: selectedAction?.name || 'Manual Roll'
    };
    setRollHistory(prev => [newEntry, ...prev]);
  }, [selectedAction?.name]);

  const handleClearSelectedAction = useCallback(() => {
    const prevActionName = selectedAction?.name;
    onActionSelect(null); // unselect the action
    if (prevActionName) {
      setRollHistory(prev => prev.filter(e => e.action !== prevActionName)); // remove that action's entries
    }
  }, [onActionSelect, selectedAction]);
  

  return (
    <div className="bg-gray-100 p-4 font-mono text-gray-800 w-full lg:w-[480px] border-0 lg:border-4 border-gray-300 shadow-none lg:shadow-lg h-full">
      <h1 className="font-bold bg-gray-800 text-white p-1 mb-4 text-lg text-center">ROLL CALCULATOR</h1>
      <AbilitySelector
        abilities={abilities}
        onRollResult={handleRollResult}
        calculateModifier={calculateModifier}
        selectedAction={selectedAction}
        clearSelectedAction={handleClearSelectedAction} // NEW
      />

      {/* Selected Action Info and Roll History side by side on desktop, stacked on mobile */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <RollHistory history={rollHistory} />
        </div>
      </div>

      <h2 className="font-bold bg-gray-800 text-white p-1 mb-4 text-sm">ACTIONS</h2>
      
      {categories.map(category => (
        <div key={category} className="mb-4">
          <h3 className="font-bold text-sm mb-2">{category}</h3>
          <div className="grid grid-cols-4 gap-2">
            {actions
              .filter(action => action.category === category)
              .map((action) => (
                <ActionButton 
                  key={action.name} 
                  action={action} 
                  onActionSelect={onActionSelect}
                  isSelected={selectedAction?.name === action.name}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface ActionButtonProps {
  action: Action;
  onActionSelect: (action: Action | null) => void;
  isSelected: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, onActionSelect, isSelected }) => {
  const handleClick = () => {
    if (isSelected) {
      onActionSelect(null);
    } else {
      onActionSelect(action);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        className="action-button h-12 w-full"
        isSelected={isSelected}
      >
        <div className="text-[11px]">{action.name}</div>
      </Button>
    </div>
  );
};


export default ActionPanel;