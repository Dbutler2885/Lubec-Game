import { useState, useEffect } from 'react';
import { Minus } from 'lucide-react';
import CharacterInfo from './CharacterInfo';

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

interface CharacterSheetState {
  isNarrowScreen: boolean;
  characterName: string;
  characterInfo: CharacterInfoState;
}

interface CharacterSheetProps {
  strengths: Strength[];
  onStrengthsChange: (strengths: Strength[]) => void;
  flaws: Flaw[];
  onFlawsChange: (flaws: Flaw[]) => void;
  spiritualModifiers: SpiritualModifier[];
  onSpiritualModifiersChange: (mods: SpiritualModifier[]) => void;
  backpack: BackpackItem[];
  onBackpackChange: (items: BackpackItem[]) => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({
  strengths,
  onStrengthsChange,
  flaws,
  onFlawsChange,
  spiritualModifiers,
  onSpiritualModifiersChange,
  backpack,
  onBackpackChange
}) => {
  const [state, setState] = useState<CharacterSheetState>({
    isNarrowScreen: false,
    characterName: 'Timmy',
    characterInfo: {
      name: 'Timmy',
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
  });

  // options (tweak freely)
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
  const spiritualOptions: SpiritualModifier[] = [
    { name: 'Conscience: Morally Upstanding', points: 3 },
    { name: 'Drive: Best and Brightest', points: 4 },
    { name: 'Loyalty: Friends', points: 2 },
  ];
  const backpackOptions: BackpackItem[] = [
    { name: 'Slingshot' },
    { name: 'BBs' },
    { name: 'Book' },
    { name: 'Flashlight' },
    { name: 'Binoculars' },
    { name: 'Parabolic listening device' },
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setState(prev => ({ ...prev, isNarrowScreen: window.innerWidth < 640 }));
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // helpers (avoid duplicates when selecting from the dropdowns)
  const pushUnique = <T,>(arr: T[], item: T, isSame: (a: T, b: T) => boolean) =>
    arr.some(a => isSame(a, item)) ? arr : [...arr, item];

  // Strengths/Flaws
  const addStrength = (strength: Strength | null) => {
    if (!strength) return;
    onStrengthsChange(pushUnique(strengths, strength, (a, b) => a.name === b.name));
  };
  const removeStrength = (index: number) => {
    onStrengthsChange(strengths.filter((_, i) => i !== index));
  };
  const addFlaw = (flaw: Flaw | null) => {
    if (!flaw) return;
    onFlawsChange(pushUnique(flaws, flaw, (a, b) => a.name === b.name));
  };
  const removeFlaw = (index: number) => {
    onFlawsChange(flaws.filter((_, i) => i !== index));
  };

  // Spiritual Modifiers
  const addSpiritual = (mod: SpiritualModifier | null) => {
    if (!mod) return;
    onSpiritualModifiersChange(
      pushUnique(spiritualModifiers, mod, (a, b) => a.name === b.name)
    );
  };
  const removeSpiritual = (index: number) => {
    onSpiritualModifiersChange(spiritualModifiers.filter((_, i) => i !== index));
  };

  // Backpack
  const addBackpackItem = (item: BackpackItem | null) => {
    if (!item) return;
    onBackpackChange(
      pushUnique(backpack, item, (a, b) => a.name === b.name)
    );
  };
  const removeBackpackItem = (index: number) => {
    onBackpackChange(backpack.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-100 p-4 font-mono text-gray-800 w-full md:w-[480px] border-0 md:border-4 border-gray-300 shadow-none md:shadow-lg h-full">
      <div className="bg-gray-800 mb-4 p-2">
        <h3 className="font-bold text-lg text-center text-white">
          {state.characterName.toUpperCase()}
        </h3>
      </div>

      <CharacterInfo
        initialInfo={state.characterInfo}
        onInfoChange={(newInfo) => {
          setState(prev => ({ ...prev, characterInfo: newInfo, characterName: newInfo.name || 'Unnamed' }));
        }}
      />

      {/* PANELS (no Stats section) */}
      <div className="space-y-4">
        {/* Strengths & Flaws Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <section>
            <h4 className="font-bold bg-gray-800 text-white p-2 mb-2 text-sm">STRENGTHS</h4>
            {strengths.map((strength, index) => (
              <div key={`${strength.name}-${index}`} className="flex items-center justify-between mb-1 bg-gray-200 p-2 text-sm">
                <span>{strength.name} (+{strength.modifier.value} {strength.modifier.ability})</span>
                <button onClick={() => removeStrength(index)} className="text-gray-600 hover:text-red-600" aria-label={`Remove ${strength.name}`}>
                  <Minus size={16} />
                </button>
              </div>
            ))}
            <select
              defaultValue=""
              onChange={(e) => {
                const val = e.target.value ? JSON.parse(e.target.value) as Strength : null;
                addStrength(val);
                e.currentTarget.value = '';
              }}
              className="w-full bg-white border-2 border-gray-300 p-2 text-sm mt-2"
            >
              <option value="">Add Strength</option>
              {strengthOptions.map((s, i) => (
                <option key={i} value={JSON.stringify(s)}>{s.name}</option>
              ))}
            </select>
          </section>

          {/* Flaws */}
          <section>
            <h4 className="font-bold bg-gray-800 text-white p-2 mb-2 text-sm">FLAWS</h4>
            {flaws.map((flaw, index) => (
              <div key={`${flaw.name}-${index}`} className="flex items-center justify-between mb-1 bg-gray-200 p-2 text-sm">
                <span>{flaw.name} ({flaw.modifier.value} {flaw.modifier.ability})</span>
                <button onClick={() => removeFlaw(index)} className="text-gray-600 hover:text-red-600" aria-label={`Remove ${flaw.name}`}>
                  <Minus size={16} />
                </button>
              </div>
            ))}
            <select
              defaultValue=""
              onChange={(e) => {
                const val = e.target.value ? JSON.parse(e.target.value) as Flaw : null;
                addFlaw(val);
                e.currentTarget.value = '';
              }}
              className="w-full bg-white border-2 border-gray-300 p-2 text-sm mt-2"
            >
              <option value="">Add Flaw</option>
              {flawOptions.map((f, i) => (
                <option key={i} value={JSON.stringify(f)}>{f.name}</option>
              ))}
            </select>
          </section>
        </div>

        {/* Spiritual Modifiers & Backpack Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Spiritual Modifiers */}
          <section>
            <h4 className="font-bold bg-gray-800 text-white p-2 mb-2 text-sm">SPIRITUAL MODIFIERS</h4>
            {spiritualModifiers.map((mod, index) => (
              <div key={`${mod.name}-${index}`} className="flex items-center justify-between mb-1 bg-gray-200 p-2 text-sm">
                <span>{mod.name} (+{mod.points} pts)</span>
                <button onClick={() => removeSpiritual(index)} className="text-gray-600 hover:text-red-600" aria-label={`Remove ${mod.name}`}>
                  <Minus size={16} />
                </button>
              </div>
            ))}
            <select
              defaultValue=""
              onChange={(e) => {
                const val = e.target.value ? JSON.parse(e.target.value) as SpiritualModifier : null;
                addSpiritual(val);
                e.currentTarget.value = '';
              }}
              className="w-full bg-white border-2 border-gray-300 p-2 text-sm mt-2"
            >
              <option value="">Add Spiritual Modifier</option>
              {spiritualOptions.map((m, i) => (
                <option key={i} value={JSON.stringify(m)}>{m.name} (+{m.points})</option>
              ))}
            </select>
          </section>

          {/* Backpack */}
          <section>
            <h4 className="font-bold bg-gray-800 text-white p-2 mb-2 text-sm">BACKPACK</h4>
            {backpack.map((item, index) => (
              <div key={`${item.name}-${index}`} className="flex items-center justify-between mb-1 bg-gray-200 p-2 text-sm">
                <span>{item.name}</span>
                <button onClick={() => removeBackpackItem(index)} className="text-gray-600 hover:text-red-600" aria-label={`Remove ${item.name}`}>
                  <Minus size={16} />
                </button>
              </div>
            ))}
            <select
              defaultValue=""
              onChange={(e) => {
                const val = e.target.value ? JSON.parse(e.target.value) as BackpackItem : null;
                addBackpackItem(val);
                e.currentTarget.value = '';
              }}
              className="w-full bg-white border-2 border-gray-300 p-2 text-sm mt-2"
            >
              <option value="">Add Backpack Item</option>
              {backpackOptions.map((b, i) => (
                <option key={i} value={JSON.stringify(b)}>{b.name}</option>
              ))}
            </select>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;