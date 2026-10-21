import type { CursoDetail } from "../entities/CursoDetail";

export interface CursoDetailRepository {
  getCursoById(id: number, signal?: AbortSignal): Promise<CursoDetail>;
}
