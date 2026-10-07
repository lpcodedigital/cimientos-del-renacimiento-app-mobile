import type { LocationGateway } from "../domain/ports/LocationGateway";
import type { HomeUseCases } from "./types";

export function createGetCurrentLocation(deps: {
  locationGateway: LocationGateway;
}): HomeUseCases["getCurrentLocation"] {
  const { locationGateway } = deps;

  return async () => {
    const permission = await locationGateway.getForegroundPermission();
    if (permission !== "granted") {
      return null;
    }
    return locationGateway.getCurrentPosition();
  };
}
