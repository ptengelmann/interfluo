'use client';

import { type ReactNode, createContext, useContext } from 'react';

interface MatterScope {
  matterId: string;
}

const MatterContext = createContext<MatterScope | null>(null);

export function MatterProvider({ matterId, children }: MatterScope & { children: ReactNode }) {
  return <MatterContext.Provider value={{ matterId }}>{children}</MatterContext.Provider>;
}

export function useCurrentMatterId(): string | null {
  const ctx = useContext(MatterContext);
  return ctx?.matterId ?? null;
}
