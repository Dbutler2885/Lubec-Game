import React, { useState, useCallback } from 'react';
import CharacterSheet from './CharacterSheet';
import ActionPanel, { Action } from './ActionPanel';
import TabContainer from './TabContainer';

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

interface SpiritualModifier {
  name: string;   // e.g., "Conscience: Morally Upstanding"
  points: number; // e.g., 3
}

interface BackpackItem {
  name: string;   // e.g., "Slingshot"
  qty?: number;   // optional if you decide to support quantities later
  notes?: string; // optional notes
}

const App: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [strengths, setStrengths] = useState<Strength[]>([]);
  const [flaws, setFlaws] = useState<Flaw[]>([]);
  const [spiritualModifiers, setSpiritualModifiers] = useState<SpiritualModifier[]>([]);
  const [backpack, setBackpack] = useState<BackpackItem[]>([]);

  const calculateModifier = useCallback((ability: string): number => {
    let modifier = 0;
    strengths.forEach(strength => {
      if (strength.modifier.ability === ability) {
        modifier += strength.modifier.value;
      }
    });
    flaws.forEach(flaw => {
      if (flaw.modifier.ability === ability) {
        modifier += flaw.modifier.value;
      }
    });
    return modifier;
  }, [strengths, flaws]);

  return (
    <div className="App w-screen h-screen">
      {/* Desktop Layout */}
      <main className="hidden md:block h-full">
        <div className="container mx-auto p-4 flex justify-center space-x-4 h-full">
          <CharacterSheet 
            strengths={strengths}
            onStrengthsChange={setStrengths}
            flaws={flaws}
            onFlawsChange={setFlaws}
            spiritualModifiers={spiritualModifiers}
            onSpiritualModifiersChange={setSpiritualModifiers}
            backpack={backpack}
            onBackpackChange={setBackpack}
          />
          <ActionPanel 
            onActionSelect={setSelectedAction} 
            selectedAction={selectedAction}
            calculateModifier={calculateModifier}
          />
        </div>
      </main>

      {/* Mobile Layout */}
      <div className="md:hidden w-screen h-full">
        <TabContainer>
          <CharacterSheet 
            strengths={strengths}
            onStrengthsChange={setStrengths}
            flaws={flaws}
            onFlawsChange={setFlaws}
            spiritualModifiers={spiritualModifiers}
            onSpiritualModifiersChange={setSpiritualModifiers}
            backpack={backpack}
            onBackpackChange={setBackpack}
          />
          <ActionPanel 
            onActionSelect={setSelectedAction} 
            selectedAction={selectedAction}
            calculateModifier={calculateModifier}
          />
        </TabContainer>
      </div>
    </div>
  );
};

export default App;