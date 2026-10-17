import { useContext } from "react";

import { SearchContext, type SearchContextValue } from "./SearchProvider";

export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (context === null) {
    throw new Error("useSearch debe usarse dentro de SearchProvider");
  }
  return context;
}
