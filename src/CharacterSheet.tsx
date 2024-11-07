import React, { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import { Minus } from 'lucide-react';
import { Action } from './ActionPanel';
import RollHistory from './RollHistory';
import CharacterInfo from './CharacterInfo';
import AbilitySelector from './AbilitySelector';

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

interface CharacterSheetState {
  isNarrowScreen: boolean;
  characterName: string;
  strengths: Strength[];
  flaws: Flaw[];
  rollHistory: RollHistoryEntry[];
  characterInfo: CharacterInfoState;
  selectedAction: Action | null;
}

export interface CharacterSheetRef {
  executeAction: (action: Action) => void;
}

interface RollHistoryEntry {
  timestamp: Date;
  rolls: RollOutcome[];
  average: number;
  action: string;
}

interface CharacterInfoState {
  name: string;
  age: string;
  height: string;
  weight: string;
  mother: string;
  motherJob: string;
  father: string;
  fatherJob: string;
  siblings: string;
  significantOther1: string;
  significantOther2: string;
}

const CharacterSheet = forwardRef<CharacterSheetRef>(
  (_, ref: ForwardedRef<CharacterSheetRef>) => {
    const [state, setState] = useState<CharacterSheetState>({
      isNarrowScreen: false,
      characterName: "Timmy",
      strengths: [],
      flaws: [],
      rollHistory: [],
      characterInfo: {
        name: "Timmy",
        age: '',
        height: '',
        weight: '',
        mother: '',
        motherJob: '',
        father: '',
        fatherJob: '',
        siblings: '',
        significantOther1: '',
        significantOther2: '',
      },
      selectedAction: null,
    });

    const abilities = useMemo<Ability[]>(() => [
      { die: 'D20', label: 'Brains' },
      { die: 'D12', label: 'Handle' },
      { die: 'D10', label: 'Grit' },
      { die: 'D8', label: 'Charm' },
      { die: 'D6', label: 'Flight' },
      { die: 'D4', label: 'Brawn' },
    ], []);

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

    const calculateModifier = useCallback((ability: string): number => {
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
    }, [state.strengths, state.flaws]);

    const handleRollResult = useCallback((result: RollResult) => {
      const newRollHistoryEntry: RollHistoryEntry = {
        timestamp: new Date(),
        rolls: result.rolls,
        average: result.average,
        action: state.selectedAction ? state.selectedAction.name : 'N/A'
      };

      setState(prev => ({
        ...prev,
        rollHistory: [newRollHistoryEntry, ...prev.rollHistory]
      }));
    }, [state.selectedAction]);

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

    const executeAction = useCallback((action: Action) => {
      setState(prev => ({
        ...prev,
        selectedAction: action,
        rollHistory: [{
          timestamp: new Date(),
          rolls: [],
          average: 0,
          action: action.name
        }, ...prev.rollHistory]
      }));
    }, []);

    useImperativeHandle(ref, () => ({
      executeAction
    }), [executeAction]);

    return (
      <div className="bg-gray-100 p-4 font-mono text-gray-800 w-[480px] mx-auto border-4 border-gray-300 shadow-lg">
        <div className="bg-gray-800 mb-4 p-2">
          <h3 className="font-bold text-lg text-center text-white">{state.characterName.toUpperCase()}</h3>
        </div>
        <CharacterInfo
          initialInfo={state.characterInfo}
          onInfoChange={(newInfo) => {
            setState(prev => ({ ...prev, characterInfo: newInfo, characterName: newInfo.name }));
          }}
        />
        
        <AbilitySelector
          abilities={abilities}
          onRollResult={handleRollResult}
          calculateModifier={calculateModifier}
          action={state.selectedAction}
        />
        
        <RollHistory history={state.rollHistory} />
        
        <div className="space-y-4">
          <div>
            <h4 className="font-bold bg-gray-800 text-white p-2 mb-2 text-sm">STRENGTHS</h4>
            {state.strengths.map((strength, index) => (
              <div key={index} className="flex items-center justify-between mb-1 bg-gray-200 p-2 text-sm">
                <span>{strength.name} (+{strength.modifier.value} {strength.modifier.ability})</span>
                <button onClick={() => removeStrength(index)} className="text-gray-600 hover:text-red-600">
                  <Minus size={16} />
                </button>
              </div>
            ))}
            <select 
              onChange={(e) => addStrength(JSON.parse(e.target.value))} 
              className="w-full bg-white border-2 border-gray-300 p-2 text-sm mt-2"
            >
              <option value="">Add Strength</option>
              {strengthOptions.map((strength, index) => (
                <option key={index} value={JSON.stringify(strength)}>{strength.name}</option>
              ))}
            </select>
          </div>
          <div>
            <h4 className="font-bold bg-gray-800 text-white p-2 mb-2 text-sm">FLAWS</h4>
            {state.flaws.map((flaw, index) => (
              <div key={index} className="flex items-center justify-between mb-1 bg-gray-200 p-2 text-sm">
                <span>{flaw.name} ({flaw.modifier.value} {flaw.modifier.ability})</span>
                <button onClick={() => removeFlaw(index)} className="text-gray-600 hover:text-red-600">
                  <Minus size={16} />
                </button>
              </div>
            ))}
            <select 
              onChange={(e) => addFlaw(JSON.parse(e.target.value))} 
              className="w-full bg-white border-2 border-gray-300 p-2 text-sm mt-2"
            >
              <option value="">Add Flaw</option>
              {flawOptions.map((flaw, index) => (
                <option key={index} value={JSON.stringify(flaw)}>{flaw.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
);

export default CharacterSheet;