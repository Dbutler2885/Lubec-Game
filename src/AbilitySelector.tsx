import React, { useState, useCallback, useEffect } from 'react';
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
  selectedAction?: Action | null;
  clearSelectedAction?: () => void; // NEW
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
  selectedAction,
  clearSelectedAction
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

  const rollDiceWithAbilities = useCallback((abilitiesToRoll: (Ability | null)[]) => {
    const rolls = abilitiesToRoll.filter((a): a is Ability => a !== null).map(ability => {
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
  }, [calculateModifier, explodingDiceRoll, onRollResult]);

    useEffect(() => {
    if (!selectedAction) return; // do nothing when action becomes null

    const actionAbilities = selectedAction.abilities
      .map(lbl => abilities.find(a => a.label === lbl))
      .filter((a): a is Ability => a !== undefined);

    if (actionAbilities.length === 2) {
      // Set order as [oldest, newest] from the action's array
      setSelectedAbilities([actionAbilities[0], actionAbilities[1]]);

      // Auto-roll inline
      const rolls = actionAbilities.map(ab => {
        const max = parseInt(ab.die.slice(1), 10);
        const modifier = calculateModifier ? calculateModifier(ab.label) : 0;
        const rollResults = explodingDiceRoll(max);
        const total = rollResults.reduce((s, r) => s + r, 0) + modifier;
        return { ability: ab.label, die: ab.die, rollResults, modifier, finalTotal: total };
      });

      const average = Math.ceil(rolls.reduce((a, b) => a + b.finalTotal, 0) / rolls.length);
      setRollResult(average);
      onRollResult({ rolls, average });
    }
  }, [selectedAction, abilities, calculateModifier, explodingDiceRoll, onRollResult]);

  const rollDice = useCallback(() => {
    rollDiceWithAbilities(selectedAbilities);
  }, [selectedAbilities, rollDiceWithAbilities]);

  const toggleAbility = (ability: Ability) => {
    // Unselect the action if one is active (but do NOT clear abilities/history here)
    if (selectedAction && clearSelectedAction) clearSelectedAction();

    setSelectedAbilities(([a0, a1]) => {
      const clicked = ability;

      // If clicked is already selected → deselect only that one
      if (a0?.die === clicked.die) {
        // a0 was oldest; shift newest to oldest, clear newest
        return [a1, null];
      }
      if (a1?.die === clicked.die) {
        // a1 was newest; keep oldest, clear newest
        return [a0, null];
      }

      // Not selected yet → select with FIFO capacity 2
      if (!a0 && !a1) {
        // none selected → clicked becomes oldest
        return [clicked, null];
      }
      if (a0 && !a1) {
        // one selected (oldest only) → clicked becomes newest
        return [a0, clicked];
      }
      if (!a0 && a1) {
        // (edge) newest is set but oldest is null → shift and add
        return [a1, clicked];
      }

      // two selected → drop oldest (a0), shift a1 to oldest, clicked becomes newest
      return [a1!, clicked];
    });
  };
  
  const clearAbilities = () => {
    if (selectedAction && clearSelectedAction) clearSelectedAction(); // unselect action upstream
    setRollResult(null); // keep current ability selections intact
  };
  
  
  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Button 
          onClick={rollDice} 
          className="bg-red-500 hover:bg-red-600 text-white flex-grow py-2"
          disabled={!selectedAbilities.some(Boolean)}
        >
          ROLL
        </Button>
  
        <div className="bg-gray-800 text-green-400 p-2 h-12 w-16 flex items-center justify-center rounded">
          <p className="text-xl font-bold">
            {rollResult !== null ? `${rollResult}` : "—"}
          </p>
        </div>
  
        <Button 
          onClick={clearAbilities} 
          className="bg-gray-500 hover:bg-gray-600 text-white h-12 w-12 flex items-center justify-center"
        >
          <X size={16} />
        </Button>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
        {abilities.map((ability) => (
          <Button
            key={ability.die}
            isSelected={selectedAbilities.some(a => a && a.die === ability.die)}
            onClick={() => toggleAbility(ability)}
            className={
              selectedAbilities.some(a => a && a.die === ability.die)
                ? 'bg-gray-700 text-white'
                : 'bg-gray-300'
            }
          >
            <p className="text-sm">{ability.die}</p>
            <p className="text-xs">{ability.label}</p>
          </Button>
        ))}
      </div>
    </div>
  );  
};

export default AbilitySelector;