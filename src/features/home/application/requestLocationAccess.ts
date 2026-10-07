import type { LocationGateway } from "../domain/ports/LocationGateway";
import type { HomeUseCases } from "./types";

export function createRequestLocationAccess(deps: {
  locationGateway: LocationGateway;
}): HomeUseCases["requestLocationAccess"] {
  const { locationGateway } = deps;

  return async () => {
    const permission = await locationGateway.requestForegroundPermission();
    if (permission !== "granted") {
      return null;
    }
    return locationGateway.getCurrentPosition();
  };
}
