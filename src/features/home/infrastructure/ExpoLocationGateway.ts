import * as Location from "expo-location";
import type { GeoPosition } from "../domain/entities/GeoPosition";
import type {
  LocationGateway,
  LocationPermissionStatus,
} from "../domain/ports/LocationGateway";

function toPermissionStatus(
  status: Location.PermissionStatus
): LocationPermissionStatus {
  if (status === Location.PermissionStatus.GRANTED) {
    return "granted";
  }
  if (status === Location.PermissionStatus.DENIED) {
    return "denied";
  }
  return "undetermined";
}

export function createExpoLocationGateway(): LocationGateway {
  return {
    async getForegroundPermission(): Promise<LocationPermissionStatus> {
      const response = await Location.getForegroundPermissionsAsync();
      return toPermissionStatus(response.status);
    },
    async requestForegroundPermission(): Promise<LocationPermissionStatus> {
      const response = await Location.requestForegroundPermissionsAsync();
      return toPermissionStatus(response.status);
    },
    async getCurrentPosition(): Promise<GeoPosition | null> {
      try {
        const position = await Location.getCurrentPositionAsync({});
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch {
        return null;
      }
    },
    async reverseGeocodeMunicipio(
      position: GeoPosition
    ): Promise<string | null> {
      try {
        const results = await Location.reverseGeocodeAsync(position);
        const first = results[0];
        if (first === undefined) {
          return null;
        }
        return first.city ?? first.subregion ?? first.region ?? null;
      } catch {
        return null;
      }
    },
  };
}
