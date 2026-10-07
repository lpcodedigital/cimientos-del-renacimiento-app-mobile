export type MunicipioResumenDTO = {
  municipio: string;
  totalObras: number;
  totalCursos: number;
  totalInversion: number;
  obrasFinalizadas: number;
  obrasEnProceso: number;
  latitude: number | null;
  longitude: number | null;
};
