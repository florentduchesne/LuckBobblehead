import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type DiceSettingsContextType = {
  dicePerThrowInput: string;
  throwCountInput: string;
  setDicePerThrowInput: (value: string) => void;
  setThrowCountInput: (value: string) => void;
};

const DEFAULT_DICE_PER_THROW = '20';
const DEFAULT_THROW_COUNT = '5';

const DiceSettingsContext = createContext<DiceSettingsContextType | undefined>(undefined);

export function DiceSettingsProvider({ children }: { children: ReactNode }) {
  const [dicePerThrowInput, setDicePerThrowInput] = useState(DEFAULT_DICE_PER_THROW);
  const [throwCountInput, setThrowCountInput] = useState(DEFAULT_THROW_COUNT);

  const value = useMemo(
    () => ({
      dicePerThrowInput,
      throwCountInput,
      setDicePerThrowInput,
      setThrowCountInput,
    }),
    [dicePerThrowInput, throwCountInput]
  );

  return <DiceSettingsContext.Provider value={value}>{children}</DiceSettingsContext.Provider>;
}

export function useDiceSettings() {
  const context = useContext(DiceSettingsContext);

  if (!context) {
    throw new Error('useDiceSettings must be used within DiceSettingsProvider');
  }

  return context;
}
