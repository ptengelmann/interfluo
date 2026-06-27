'use client';

import type { Citation } from '@interfluo/core';
import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface ViewerRequest {
  matterId: string;
  citation: Citation;
}

interface ViewerApi {
  request: ViewerRequest | null;
  open: (req: ViewerRequest) => void;
  close: () => void;
}

const ViewerContext = createContext<ViewerApi | null>(null);

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ViewerRequest | null>(null);

  const open = useCallback((req: ViewerRequest) => setRequest(req), []);
  const close = useCallback(() => setRequest(null), []);

  const value = useMemo<ViewerApi>(() => ({ request, open, close }), [request, open, close]);

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
}

export function useViewer(): ViewerApi {
  const ctx = useContext(ViewerContext);
  if (!ctx) {
    throw new Error('useViewer must be used inside a ViewerProvider');
  }
  return ctx;
}
