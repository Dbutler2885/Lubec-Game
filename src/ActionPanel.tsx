import React, { useState } from 'react';
import { Button } from './CharacterSheet';

export interface Action {
  name: string;
  abilities: [string, string];
  description: string;
  category: string;
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

interface ActionPanelProps {
  onActionSelect: (action: Action) => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ onActionSelect }) => {
  const categories = Array.from(new Set(actions.map(action => action.category)));

  return (
    <div className="bg-gray-100 p-4 font-mono text-gray-800 w-[480px] border-4 border-gray-300 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Actions</h2>
      {categories.map(category => (
        <div key={category} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <div className="grid grid-cols-4 gap-2">
            {actions
              .filter(action => action.category === category)
              .map((action) => (
                <ActionButton key={action.name} action={action} onActionSelect={onActionSelect} />
              ))}
          </div>
        </div>
      ))}
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
        className="w-full text-center p-1 h-24 overflow-hidden flex flex-col justify-between items-center"
      >
        <div className="text-sm">{action.name}</div>
        <div className="text-xs">{action.abilities.join(" + ")}</div>
      </Button>
      {showDescription && (
        <div className="absolute z-10 bg-white border border-gray-300 p-2 rounded shadow-lg text-xs w-48 -mt-2 left-1/2 transform -translate-x-1/2">
          {action.description}
        </div>
      )}
    </div>
  );
};

export default ActionPanel;