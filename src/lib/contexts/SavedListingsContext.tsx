'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const STORAGE_KEY = 'riwaq_saved_listings';
const MAX_SAVED = 50;

interface SavedListingsContextType {
  savedIds: string[];
  addListing: (id: string) => void;
  removeListing: (id: string) => void;
  isListingSaved: (id: string) => boolean;
  clearAll: () => void;
  count: number;
  hydrated: boolean;
}

const SavedListingsContext = createContext<SavedListingsContextType>({
  savedIds: [],
  addListing: () => {},
  removeListing: () => {},
  isListingSaved: () => false,
  clearAll: () => {},
  count: 0,
  hydrated: false,
});

export function useSavedListings() {
  return useContext(SavedListingsContext);
}

function readFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage full or unavailable
  }
}

export function SavedListingsProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setSavedIds(readFromStorage());
    setHydrated(true);
  }, []);

  const addListing = useCallback((id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [id, ...prev].slice(0, MAX_SAVED);
      writeToStorage(next);
      return next;
    });
  }, []);

  const removeListing = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.filter((savedId) => savedId !== id);
      writeToStorage(next);
      return next;
    });
  }, []);

  const isListingSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds]
  );

  const clearAll = useCallback(() => {
    setSavedIds([]);
    writeToStorage([]);
  }, []);

  return (
    <SavedListingsContext.Provider
      value={{
        savedIds,
        addListing,
        removeListing,
        isListingSaved,
        clearAll,
        count: savedIds.length,
        hydrated,
      }}
    >
      {children}
    </SavedListingsContext.Provider>
  );
}
