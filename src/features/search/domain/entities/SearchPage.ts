import type { SearchCard } from "./SearchCard";

export type SearchPage = {
  cards: SearchCard[];
  totalElements: number;
  totalPages: number;
  page: number;
  isLast: boolean;
};
