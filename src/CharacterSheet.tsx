import React, { useState, useEffect, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import { X, Minus } from 'lucide-react';
import { Action } from './ActionPanel';
import RollHistory from './RollHistory';

// Interfaces
interface Ability {
  die: string;
  label: string;
}

interface Modifier {
  ability: string;
  value: number;
}

interface Trait {
  name: string;
  modifier: Modifier;
}

type Strength = Trait;
type Flaw = Trait;

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

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelected?: boolean;
  className?: string;
  disabled?: boolean;
}

interface CharacterSheetState {
  selectedAbilities: (Ability | null)[];
  rollResult: RollResult | null;
  isNarrowScreen: boolean;
  characterName: string;
  strengths: Strength[];
  flaws: Flaw[];
  rollHistory: RollHistoryEntry[];
}

interface CharacterSheetProps {
  selectedAction: Action | null;
}

export interface CharacterSheetRef {
  executeAction: (action: Action) => void;
}

interface RollHistoryEntry {
  timestamp: Date;
  rolls: RollOutcome[];
  average: number;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, isSelected = false, className = "", disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      px-3 py-4 text-center
      font-mono text-sm font-bold
      ${isSelected 
        ? 'bg-gray-600 text-white border-t-gray-400 border-l-gray-400 border-b-gray-800 border-r-gray-800' 
        : 'bg-gray-300 text-gray-800 border-t-white border-l-white border-b-gray-600 border-r-gray-600 hover:bg-gray-400'}
      border-2
      transform active:translate-y-px active:translate-x-px
      active:border-t-gray-600 active:border-l-gray-600 active:border-b-gray-300 active:border-r-gray-300
      transition-all duration-50 shadow-md
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `}
    style={{
      boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.1)',
      minHeight: '60px'
    }}
  >
    {children}
  </button>
);

const CharacterSheet = forwardRef<CharacterSheetRef, CharacterSheetProps>(
  ({ selectedAction }, ref: ForwardedRef<CharacterSheetRef>) => {
    const [state, setState] = useState<CharacterSheetState>({
      selectedAbilities: [null, null],
      rollResult: null,
      isNarrowScreen: false,
      characterName: "Timmy",
      strengths: [],
      flaws: [],
      rollHistory: []
    });

    const abilities: Ability[] = [
      { die: 'D20', label: 'Brains' },
      { die: 'D12', label: 'Handle' },
      { die: 'D10', label: 'Grit' },
      { die: 'D8', label: 'Charm' },
      { die: 'D6', label: 'Flight' },
      { die: 'D4', label: 'Brawn' },
    ];

    const strengthOptions: Strength[] = [
      { name: 'Quick Reflexes', modifier: { ability: 'Flight', value: 2 } },
      { name: 'Sharp Mind', modifier: { ability: 'Brains', value: 2 } },
      { name: 'Iron Will', modifier: { ability: 'Grit', value: 2 } },
    ];

    const flawOptions: Flaw[] = [
      { name: 'Clumsy', modifier: { ability: 'Handle', value: -1 } },
      { name: 'Absent-minded', modifier: { ability: 'Brains', value: -1 } },
      { name: 'Weak Constitution', modifier: { ability: 'Grit', value: -1 } },
    ];

    useEffect(() => {
      const checkScreenSize = () => {
        setState(prev => ({ ...prev, isNarrowScreen: window.innerWidth < 640 }));
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleAbility = (ability: Ability) => {
      setState(prev => {
        const newSelectedAbilities = [...prev.selectedAbilities];
        const index = newSelectedAbilities.findIndex(a => a && a.die === ability.die);
        if (index !== -1) {
          newSelectedAbilities[index] = null;
        } else {
          const emptyIndex = newSelectedAbilities.findIndex(a => a === null);
          if (emptyIndex !== -1) {
            newSelectedAbilities[emptyIndex] = ability;
          }
        }
        return { ...prev, selectedAbilities: newSelectedAbilities, rollResult: null };
      });
    };

    const removeAbility = (index: number) => {
      setState(prev => ({
        ...prev,
        selectedAbilities: prev.selectedAbilities.map((a, i) => i === index ? null : a),
        rollResult: null
      }));
    };

    const clearAbilities = () => {
      setState(prev => ({ ...prev, selectedAbilities: [null, null], rollResult: null }));
    };

    const explodingDiceRoll = (max: number): number[] => {
      const rolls: number[] = [];
      let roll: number;
      do {
        roll = Math.floor(Math.random() * max) + 1;
        rolls.push(roll);
      } while (roll === max);
      return rolls;
    };

    const rollDice = () => {
      const rolls = state.selectedAbilities.filter((a): a is Ability => a !== null).map(ability => {
        const max = parseInt(ability.die.slice(1));
        const modifier = calculateModifier(ability.label);
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
        setState(prev => ({ ...prev, rollResult: null }));
        return;
      }

      const average = Math.ceil(rolls.reduce((a, b) => a + b.finalTotal, 0) / rolls.length);
      const newRollHistoryEntry: RollHistoryEntry = {
        timestamp: new Date(),
        rolls,
        average
      };

      setState(prev => ({
        ...prev,
        rollResult: { rolls, average },
        rollHistory: [newRollHistoryEntry, ...prev.rollHistory] // Remove the slice to keep all rolls
      }));
    };

    const calculateModifier = (ability: string): number => {
      let modifier = 0;
      state.strengths.forEach(strength => {
        if (strength.modifier.ability === ability) {
          modifier += strength.modifier.value;
        }
      });
      state.flaws.forEach(flaw => {
        if (flaw.modifier.ability === ability) {
          modifier += flaw.modifier.value;
        }
      });
      return modifier;
    };

    const addStrength = (strength: Strength) => {
      setState(prev => ({ ...prev, strengths: [...prev.strengths, strength] }));
    };

    const removeStrength = (index: number) => {
      setState(prev => ({ ...prev, strengths: prev.strengths.filter((_, i) => i !== index) }));
    };

    const addFlaw = (flaw: Flaw) => {
      setState(prev => ({ ...prev, flaws: [...prev.flaws, flaw] }));
    };

    const removeFlaw = (index: number) => {
      setState(prev => ({ ...prev, flaws: prev.flaws.filter((_, i) => i !== index) }));
    };

    const executeAction = (action: Action) => {
      // Set the selected abilities based on the selected action
      const newSelectedAbilities = action.abilities.map(abilityLabel => {
        return abilities.find(a => a.label === abilityLabel) || null;
      });

      setState(prev => ({
        ...prev,
        selectedAbilities: newSelectedAbilities,
      }));

      // Trigger the roll
      rollDice();
    };

    useImperativeHandle(ref, () => ({
      executeAction
    }));

    return (
      <div className="bg-gray-100 p-4 font-mono text-gray-800 w-[480px] mx-auto border-4 border-gray-300 shadow-lg">
        <div className="bg-gray-200 mb-2 p-1">
          <h3 className="font-bold text-lg text-center">{state.characterName.toUpperCase()}</h3>
        </div>
        
        <div className="bg-gray-900 text-green-400 p-2 mb-2 h-8 flex items-center justify-center">
          <p className="text-center text-sm">
            {state.rollResult ? `Result: ${state.rollResult.average}` : "Ready to roll"}
          </p>
        </div>
        <div className="bg-gray-300 p-2 mb-2 h-12 flex items-center">
    {state.rollResult ? (
      <div className="text-xs w-full whitespace-nowrap overflow-x-auto">
        <span className="font-bold">=</span>
        {state.rollResult.rolls.map((r, i) => (
          <span key={i} className="mr-2">
            {r.ability} {r.die}:{' '}
            {r.rollResults.length > 1 ? (
              <>
                {r.rollResults.join(' + ')} = {r.rollResults.reduce((sum, roll) => sum + roll, 0)}
              </>
            ) : (
              r.rollResults[0]
            )}
            {r.modifier !== 0 && (
              <span className={r.modifier > 0 ? 'text-green-600' : 'text-red-600'}>
                {' '}({r.modifier > 0 ? `+${r.modifier}` : r.modifier})
              </span>
            )}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-center w-full text-gray-600 text-sm">Roll results will appear here</p>
    )}
  </div>
        
        <div className="flex space-x-2 mb-2 bg-gray-200 p-2">
          {state.selectedAbilities.map((ability, index) => (
            <div key={index} className="flex-1 bg-white border border-gray-300 p-1 flex justify-between items-center h-10">
              {ability ? (
                <>
                  <span className="text-xs">{ability.label} ({ability.die})</span>
                  <button 
                    onClick={() => removeAbility(index)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <span className="text-gray-400 text-xs">Empty slot</span>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2 mb-2">
          <Button 
            onClick={rollDice} 
            className="bg-red-500 text-white flex-grow py-2"
            disabled={!state.selectedAbilities.some(Boolean)}
          >
            ROLL
          </Button>
          <Button onClick={clearAbilities} className="bg-gray-500 text-white px-4 py-2">
            <X size={16} />
          </Button>
        </div>
        
        <div className="grid grid-cols-6 gap-2 mb-2">
          {abilities.map((ability) => (
            <Button
              key={ability.die}
              isSelected={state.selectedAbilities.some(a => a && a.die === ability.die)}
              onClick={() => toggleAbility(ability)}
              className={state.selectedAbilities.some(a => a && a.die === ability.die) ? 'bg-gray-700 text-white' : 'bg-gray-300'}
            >
              <p className="text-sm">{ability.die}</p>
              <p className="text-xs">{ability.label}</p>
            </Button>
          ))}
        </div>
        
        <RollHistory history={state.rollHistory} />
        
        <div className="space-y-2">
          <div>
            <h4 className="font-bold bg-gray-800 text-white p-1 mb-1 text-sm">STRENGTHS</h4>
            {state.strengths.map((strength, index) => (
              <div key={index} className="flex items-center justify-between mb-1 bg-gray-200 p-1 text-xs">
                <span>{strength.name} (+{strength.modifier.value} {strength.modifier.ability})</span>
                <button onClick={() => removeStrength(index)} className="text-gray-600 hover:text-red-600">
                  <Minus size={12} />
                </button>
              </div>
            ))}
            <select 
              onChange={(e) => addStrength(JSON.parse(e.target.value))} 
              className="w-full bg-white border border-gray-300 p-1 text-sm"
            >
              <option value="">Add Strength</option>
              {strengthOptions.map((strength, index) => (
                <option key={index} value={JSON.stringify(strength)}>{strength.name}</option>
              ))}
            </select>
          </div>
          <div>
            <h4 className="font-bold bg-gray-800 text-white p-1 mb-1 text-sm">FLAWS</h4>
            {state.flaws.map((flaw, index) => (
              <div key={index} className="flex items-center justify-between mb-1 bg-gray-200 p-1 text-xs">
                <span>{flaw.name} ({flaw.modifier.value} {flaw.modifier.ability})</span>
                <button onClick={() => removeFlaw(index)} className="text-gray-600 hover:text-red-600">
                  <Minus size={12} />
                </button>
              </div>
            ))}
            <select 
              onChange={(e) => addFlaw(JSON.parse(e.target.value))} 
              className="w-full bg-white border border-gray-300 p-1 text-sm"
            >
              <option value="">Add Flaw</option>
              {flawOptions.map((flaw, index) => (
                <option key={index} value={JSON.stringify(flaw)}>{flaw.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {selectedAction && (
          <div className="bg-gray-200 mb-2 p-2">
            <h4 className="font-bold text-sm">Selected Action: {selectedAction.name}</h4>
            <p className="text-xs">{selectedAction.description}</p>
          </div>
        )}
      </div>
    );
  }
);

export default CharacterSheet;