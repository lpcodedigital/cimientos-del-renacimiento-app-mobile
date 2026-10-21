import type { CursoDetail } from "../domain/entities/CursoDetail";
import type { ObraDetail } from "../domain/entities/ObraDetail";

export type DetailUseCases = {
  getObraDetail: (id: number, signal?: AbortSignal) => Promise<ObraDetail>;
  getCursoDetail: (id: number, signal?: AbortSignal) => Promise<CursoDetail>;
};
