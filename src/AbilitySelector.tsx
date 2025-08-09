import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface Ability {
  die: string;
  label: string;
}

interface Action {
  name: string;
  abilities: [string, string];
  description: string;
  category: string;
}

interface AbilitySelectorProps {
  abilities: Ability[];
  onRollResult: (result: RollResult) => void;
  calculateModifier?: (ability: string) => number;
  action?: Action | null;
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

const AbilitySelector: React.FC<AbilitySelectorProps> = ({
  abilities,
  onRollResult,
  calculateModifier,
  action
}) => {
  const [selectedAbilities, setSelectedAbilities] = useState<(Ability | null)[]>([null, null]);
  const [rollResult, setRollResult] = useState<number | null>(null);

  const explodingDiceRoll = useCallback((max: number): number[] => {
    const rolls: number[] = [];
    let roll: number;
    do {
      roll = Math.floor(Math.random() * max) + 1;
      rolls.push(roll);
    } while (roll === max);
    return rolls;
  }, []);

  const rollDice = useCallback(() => {
    const rolls = selectedAbilities.filter((a): a is Ability => a !== null).map(ability => {
      const max = parseInt(ability.die.slice(1));
      const modifier = calculateModifier ? calculateModifier(ability.label) : 0;
      const rollResults = explodingDiceRoll(max);
      const total = rollResults.reduce((sum, roll) => sum + roll, 0) + modifier;
      return {
        ability: ability.label,
        die: ability.die,
        rollResults,
        modifier,
        finalTotal: total
      };
    });

    if (rolls.length === 0) {
      setRollResult(null);
      return;
    }

    const average = Math.ceil(rolls.reduce((a, b) => a + b.finalTotal, 0) / rolls.length);
    setRollResult(average);
    onRollResult({ rolls, average });
  }, [selectedAbilities, calculateModifier, explodingDiceRoll, onRollResult]);

  const toggleAbility = (ability: Ability) => {
    setSelectedAbilities(prev => {
      const newSelectedAbilities = [...prev];
      const index = newSelectedAbilities.findIndex(a => a && a.die === ability.die);
      if (index !== -1) {
        newSelectedAbilities[index] = null;
      } else {
        const emptyIndex = newSelectedAbilities.findIndex(a => a === null);
        if (emptyIndex !== -1) {
          newSelectedAbilities[emptyIndex] = ability;
        }
      }
      return newSelectedAbilities;
    });
  };

  const removeAbility = (index: number) => {
    setSelectedAbilities(prev => prev.map((a, i) => i === index ? null : a));
  };

  const clearAbilities = () => {
    setSelectedAbilities([null, null]);
    setRollResult(null);
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex-grow flex space-x-2">
          {selectedAbilities.map((ability, index) => (
            <div key={index} className="flex-1 bg-white border-2 border-gray-300 p-2 flex justify-between items-center h-12">
              {ability ? (
                <>
                  <span className="text-sm font-bold">{ability.label} ({ability.die})</span>
                  <Button 
                    onClick={() => removeAbility(index)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <X size={16} />
                  </Button>
                </>
              ) : (
                <span className="text-gray-400 text-sm">Empty slot</span>
              )}
            </div>
          ))}
        </div>
        <div className="bg-gray-800 text-green-400 p-2 h-12 w-16 flex items-center justify-center">
          <p className="text-xl font-bold">
            {rollResult !== null ? `${rollResult}` : "Ready"}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <Button 
          onClick={rollDice} 
          className="bg-red-500 hover:bg-red-600 text-white flex-grow py-2"
          disabled={!selectedAbilities.some(Boolean)}
        >
          ROLL
        </Button>
        <Button onClick={clearAbilities} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2">
          <X size={16} />
        </Button>
      </div>
      
      <div className="grid grid-cols-6 gap-2 mb-4">
        {abilities.map((ability) => (
          <Button
            key={ability.die}
            isSelected={selectedAbilities.some(a => a && a.die === ability.die)}
            onClick={() => toggleAbility(ability)}
            className={selectedAbilities.some(a => a && a.die === ability.die) ? 'bg-gray-700 text-white' : 'bg-gray-300'}
          >
            <p className="text-sm">{ability.die}</p>
            <p className="text-xs">{ability.label}</p>
          </Button>
        ))}
      </div>

      {action && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h3 className="font-bold text-sm mb-2">Selected Action: {action.name}</h3>
          <p className="text-xs mb-2">{action.description}</p>
          <p className="text-xs">Abilities: {action.abilities.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default AbilitySelector;