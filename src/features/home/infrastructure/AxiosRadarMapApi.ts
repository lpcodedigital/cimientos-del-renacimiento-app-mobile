import { axiosClient } from "@/shared/infrastructure/http/axiosClient";
import type { MunicipioRadar } from "../domain/entities/MunicipioRadar";
import { radarError, type RadarError } from "../domain/errors/RadarError";
import type { RadarMapRepository } from "../domain/ports/RadarMapRepository";
import type { MunicipioResumenDTO } from "./dto";

function toMunicipioRadar(dto: MunicipioResumenDTO): MunicipioRadar {
  return {
    nombre: dto.municipio,
    totalObras: dto.totalObras,
    totalCursos: dto.totalCursos,
    totalInversion: dto.totalInversion,
    obrasFinalizadas: dto.obrasFinalizadas,
    obrasEnProceso: dto.obrasEnProceso,
    latitude: dto.latitude,
    longitude: dto.longitude,
  };
}

function isRadarError(error: unknown): error is RadarError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    typeof (error as RadarError).kind === "string"
  );
}

export function createAxiosRadarMapApi(): RadarMapRepository {
  return {
    async listMunicipios(): Promise<MunicipioRadar[]> {
      try {
        const response = await axiosClient.get<MunicipioResumenDTO[]>(
          "/api/v1/dashboard/mapa-home"
        );
        return response.data.map(toMunicipioRadar);
      } catch (error) {
        if (isRadarError(error)) {
          throw error;
        }
        throw radarError("radar_unavailable");
      }
    },
  };
}
