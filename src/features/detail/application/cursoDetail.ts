import type { CursoDetailRepository } from "../domain/ports/CursoDetailRepository";
import type { DetailUseCases } from "./types";

export function createCursoDetail(deps: {
  cursoDetailRepository: CursoDetailRepository;
}): DetailUseCases["getCursoDetail"] {
  return (id, signal) => deps.cursoDetailRepository.getCursoById(id, signal);
}
