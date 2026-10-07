import type { MunicipioRadar } from "../entities/MunicipioRadar";

export interface RadarMapRepository {
  listMunicipios(): Promise<MunicipioRadar[]>;
}
