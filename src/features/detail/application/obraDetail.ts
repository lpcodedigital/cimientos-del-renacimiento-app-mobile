import type { ObraDetailRepository } from "../domain/ports/ObraDetailRepository";
import type { DetailUseCases } from "./types";

export function createObraDetail(deps: {
  obraDetailRepository: ObraDetailRepository;
}): DetailUseCases["getObraDetail"] {
  return (id, signal) => deps.obraDetailRepository.getObraById(id, signal);
}
