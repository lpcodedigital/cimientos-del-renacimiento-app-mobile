import type { GeoPosition } from "../domain/entities/GeoPosition";
import type { MunicipioRadar } from "../domain/entities/MunicipioRadar";

export interface HomeUseCases {
  loadRadarMap: () => Promise<MunicipioRadar[]>;
  getCurrentLocation: () => Promise<GeoPosition | null>;
  requestLocationAccess: () => Promise<GeoPosition | null>;
  resolveDeviceMunicipio: (position: GeoPosition) => Promise<string | null>;
}
