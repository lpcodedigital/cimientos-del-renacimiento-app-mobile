export type SearchCardTipo = "OBRA" | "CURSO";

export type SearchCard = {
  id: number;
  tipo: SearchCardTipo;
  titulo: string;
  municipio: string;
  localidad: string | null;
  descripcionCorta: string | null;
  estatus: string | null;
  progreso: number | null;
  imagenUrl: string | null;
};
