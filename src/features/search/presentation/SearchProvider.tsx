import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { SearchUseCases } from "../application/types";

export const SEARCH_MIN_CHARS = 3;
export const SEARCH_DEBOUNCE_MS = 500;

export type SearchState = {
  query: string;
  debouncedQuery: string;
  isActive: boolean;
};

export type SearchContextValue = SearchState & {
  useCases: SearchUseCases;
  setQuery: (value: string) => void;
  clearQuery: () => void;
};

export const SearchContext = createContext<SearchContextValue | null>(null);

type Props = {
  useCases: SearchUseCases;
  children: ReactNode;
};

export function SearchProvider({ useCases, children }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [query]);

  const clearQuery = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  const value = useMemo<SearchContextValue>(
    () => ({
      query,
      debouncedQuery,
      isActive: debouncedQuery.length >= SEARCH_MIN_CHARS,
      useCases,
      setQuery,
      clearQuery,
    }),
    [query, debouncedQuery, useCases, clearQuery]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
