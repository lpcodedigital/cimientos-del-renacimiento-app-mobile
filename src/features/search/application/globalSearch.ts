import type { SearchRepository } from "../domain/ports/SearchRepository";
import type { SearchUseCases } from "./types";

type Deps = {
  searchRepository: SearchRepository;
};

export function createGlobalSearch(
  deps: Deps
): SearchUseCases["globalSearch"] {
  return (query, page, signal) =>
    deps.searchRepository.search(query, page, signal);
}
