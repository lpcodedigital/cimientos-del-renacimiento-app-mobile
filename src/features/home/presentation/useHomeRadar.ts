import type { HomeUseCases } from "../application/types";
import { useHomeRadar as useHomeRadarFromProvider } from "./HomeProvider";
import type { HomeRadarState } from "./HomeProvider";

export type { HomeRadarState };

export interface UseHomeRadarResult extends HomeRadarState {
  useCases: HomeUseCases;
}

export function useHomeRadar(): UseHomeRadarResult {
  return useHomeRadarFromProvider();
}
