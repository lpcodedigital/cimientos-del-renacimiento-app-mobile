import axios from "axios";

import { axiosClient } from "@/shared/infrastructure/http/axiosClient";
import type { SearchCard, SearchCardTipo } from "../domain/entities/SearchCard";
import type { SearchPage } from "../domain/entities/SearchPage";
import { isSearchError, searchError } from "../domain/errors/SearchError";
import type { SearchRepository } from "../domain/ports/SearchRepository";
import type { GlobalSearchCardDTO, GlobalSearchPageDTO } from "./dto";

const PAGE_SIZE = 10;

function mapCard(dto: GlobalSearchCardDTO): SearchCard {
  const tipo: SearchCardTipo = dto.tipo === "CURSO" ? "CURSO" : "OBRA";
  return {
    id: dto.idOriginal,
    tipo,
    titulo: dto.titulo,
    municipio: dto.municipio,
    localidad: dto.localidad ?? null,
    descripcionCorta: dto.descripcionCorta ?? null,
    estatus: dto.estatus ?? null,
    progreso: dto.progreso ?? null,
    imagenUrl: dto.imagenUrl ?? null,
  };
}

export function createAxiosGlobalSearchApi(): SearchRepository {
  return {
    async search(query, page, signal) {
      try {
        const response = await axiosClient.get<GlobalSearchPageDTO>(
          "/api/v1/app-mobile/global-search",
          { params: { search: query, page, size: PAGE_SIZE }, signal }
        );
        const dto = response.data;
        const result: SearchPage = {
          cards: dto.content.map(mapCard),
          totalElements: dto.totalElements,
          totalPages: dto.totalPages,
          page: dto.number,
          isLast: dto.last,
        };
        return result;
      } catch (error) {
        if (axios.isCancel(error)) throw error;
        if (isSearchError(error)) throw error;
        throw searchError("search_unavailable");
      }
    },
  };
}
