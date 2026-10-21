import { isAxiosError } from "axios";

import { axiosClient } from "@/shared/infrastructure/http/axiosClient";
import type { CursoDetail } from "../domain/entities/CursoDetail";
import { detailError, type DetailError } from "../domain/errors/DetailError";
import type { CursoDetailRepository } from "../domain/ports/CursoDetailRepository";
import type { CursoDetailDTO } from "./dto";

const CURSO_DETAIL_PATH = "/api/v1/app-mobile/curso"; // única aparición del path

function mapCurso(dto: CursoDetailDTO): CursoDetail {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    municipality: dto.municipality,
    courseDate: dto.courseDate,
    latitude: dto.latitude,
    longitude: dto.longitude,
    galleryUrls: dto.galeryUrls ?? null,
  };
}

export function createAxiosCursoDetailApi(): CursoDetailRepository {
  return {
    async getCursoById(id, signal) {
      try {
        const response = await axiosClient.get<CursoDetailDTO>(
          `${CURSO_DETAIL_PATH}/${id}`,
          { signal },
        );
        return mapCurso(response.data);
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
