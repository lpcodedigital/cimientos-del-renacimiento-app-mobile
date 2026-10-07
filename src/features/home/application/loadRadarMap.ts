import type { RadarMapRepository } from "../domain/ports/RadarMapRepository";
import type { HomeUseCases } from "./types";

export function createLoadRadarMap(deps: {
  radarMapRepository: RadarMapRepository;
}): HomeUseCases["loadRadarMap"] {
  const { radarMapRepository } = deps;

  return () => radarMapRepository.listMunicipios();
}
