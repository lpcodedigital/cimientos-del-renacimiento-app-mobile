import type { GeoPosition } from "../entities/GeoPosition";

export type LocationPermissionStatus = "granted" | "denied" | "undetermined";

export interface LocationGateway {
  getForegroundPermission(): Promise<LocationPermissionStatus>;
  requestForegroundPermission(): Promise<LocationPermissionStatus>;
  getCurrentPosition(): Promise<GeoPosition | null>;
  reverseGeocodeMunicipio(position: GeoPosition): Promise<string | null>;
}
