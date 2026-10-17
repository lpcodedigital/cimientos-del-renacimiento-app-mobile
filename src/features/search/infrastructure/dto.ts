export type GlobalSearchCardDTO = {
  idOriginal: number;
  tipo: string;
  titulo: string;
  municipio: string;
  localidad?: string;
  descripcionCorta?: string;
  estatus?: string;
  progreso?: number;
  imagenUrl?: string;
};

export type GlobalSearchPageDTO = {
  content: GlobalSearchCardDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
  last: boolean;
};
