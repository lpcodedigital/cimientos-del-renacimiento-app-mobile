import type { SearchPage } from "../domain/entities/SearchPage";

export type SearchUseCases = {
  globalSearch(
    query: string,
    page: number,
    signal?: AbortSignal
  ): Promise<SearchPage>;
};
