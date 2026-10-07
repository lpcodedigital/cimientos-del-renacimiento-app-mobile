import type { LocationGateway } from "../domain/ports/LocationGateway";
import type { HomeUseCases } from "./types";

export function createResolveDeviceMunicipio(deps: {
  locationGateway: LocationGateway;
}): HomeUseCases["resolveDeviceMunicipio"] {
  const { locationGateway } = deps;

  return (position) => locationGateway.reverseGeocodeMunicipio(position);
}
