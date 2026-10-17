export type SearchErrorKind = "search_unavailable";

export type SearchError = {
  kind: SearchErrorKind;
  message: string;
};

export const SEARCH_ERROR_MESSAGES: Record<SearchErrorKind, string> = {
  search_unavailable: "No se pudo completar la búsqueda.",
};

export function searchError(kind: SearchErrorKind): SearchError {
  return { kind, message: SEARCH_ERROR_MESSAGES[kind] };
}

export function isSearchError(error: unknown): error is SearchError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    (error as SearchError).kind === "search_unavailable"
  );
}
