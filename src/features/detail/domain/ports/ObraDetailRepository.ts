import type { ObraDetail } from "../entities/ObraDetail";

export interface ObraDetailRepository {
  getObraById(id: number, signal?: AbortSignal): Promise<ObraDetail>;
}
