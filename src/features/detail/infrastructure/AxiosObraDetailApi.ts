import { isAxiosError } from "axios";

import { axiosClient } from "@/shared/infrastructure/http/axiosClient";
import type { ObraDetail } from "../domain/entities/ObraDetail";
import { detailError, type DetailError } from "../domain/errors/DetailError";
import type { ObraDetailRepository } from "../domain/ports/ObraDetailRepository";
import type { ObraDetailDTO } from "./dto";

const OBRA_DETAIL_PATH = "/api/v1/app-mobile/obra"; // única aparición del path

function mapObra(dto: ObraDetailDTO): ObraDetail {
  return {
    id: dto.id,
    name: dto.name,
    municipality: dto.municipality,
    locality: dto.locality,
    agency: dto.agency,
    investment: dto.investment,
    progress: dto.progress,
    description: dto.description,
    latitude: dto.latitude,
    longitude: dto.longitude,
    status: dto.status,
    galleryUrls: dto.galeryUrls ?? null,
  };
}

export function createAxiosObraDetailApi(): ObraDetailRepository {
  return {
    async getObraById(id, signal) {
      try {
        const response = await axiosClient.get<ObraDetailDTO>(
          `${OBRA_DETAIL_PATH}/${id}`,
          { signal },
        );
        return mapObra(response.data);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.code === "ERR_CANCELED") {
            throw error; // cancelación de TanStack Query: re-lanzar intacta
          }
          const detail: DetailError =
            error.response !== undefined
              ? detailError("server")
              : detailError("network");
          throw detail;
        }
        throw detailError("unexpected");
      }
    },
  };
}
