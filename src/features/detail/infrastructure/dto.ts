export type ObraDetailDTO = {
  id: number;
  name: string;
  municipality: string;
  locality: string;
  agency: string;
  investment: string;
  progress: number;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  galeryUrls?: string[];
};

export type CursoDetailDTO = {
  id: number;
  title: string;
  description: string;
  municipality: string;
  courseDate: string;
  latitude: number;
  longitude: number;
  coverImageUrl?: string; // Documentado; el mapper lo IGNORA (spec §2.3)
  galeryUrls?: string[];
};
