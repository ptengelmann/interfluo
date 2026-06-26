'use client';

import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';
import { createInterfluoClient, type InterfluoClient } from '@interfluo/sdk';

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const API_BASE_URL = baseUrl;

export function useApi(): InterfluoClient {
  const { getToken, isLoaded } = useAuth();
  return useMemo(
    () =>
      createInterfluoClient({
        baseUrl,
        fetch: async (input, init) => {
          if (!isLoaded) return fetch(input, init);
          const token = await getToken();
          const headers = new Headers(init?.headers);
          if (token) headers.set('Authorization', `Bearer ${token}`);
          return fetch(input, { ...init, headers });
        },
      }),
    [getToken, isLoaded],
  );
}
