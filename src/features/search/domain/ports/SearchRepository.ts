import type { SearchPage } from "../entities/SearchPage";

export type SearchRepository = {
  search(query: string, page: number, signal?: AbortSignal): Promise<SearchPage>;
};
