import { useMemo } from "react";
import { Text, View } from "react-native";

import {
  fontFamily as font,
  palette,
} from "@/shared/theme/tokens";
import type { CursoDetail } from "../domain/entities/CursoDetail";
import { DetailInfoRows, type DetailInfoRow } from "./DetailInfoRows";
import { DetailMapCard } from "./DetailMapCard";
import { DetailSectionHeading } from "./DetailSectionHeading";
import { EvidenceCarousel } from "./EvidenceCarousel";
import { formatFechaCurso } from "./format";
import { KpiCard } from "./KpiCard";

type CursoDetailContentProps = {
  curso: CursoDetail;
  onPressEvidence: (url: string) => void;
};

const containerStyle = {
  gap: 16,
} as const;

const titleStyle = {
  fontFamily: font["lato-bold"],
  fontSize: 24,
  color: palette.texto,
} as const;

const kpiRowStyle = {
  flexDirection: "row",
  gap: 12,
} as const;

const descriptionStyle = {
  fontFamily: font.lato,
  fontSize: 14,
  color: palette.texto,
} as const;

export function CursoDetailContent({
  curso,
  onPressEvidence,
}: CursoDetailContentProps) {
  const rows = useMemo<DetailInfoRow[]>(
    () => [
      { label: "Municipio", value: curso.municipality },
      { label: "Fecha del curso", value: formatFechaCurso(curso.courseDate) },
    ],
    [curso.municipality, curso.courseDate],
  );

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>{curso.title}</Text>

      <View style={kpiRowStyle}>
        <KpiCard
          iconName="calendar-outline"
          label="Fecha"
          value={formatFechaCurso(curso.courseDate)}
          sublabel="Fecha del curso"
        />
        <KpiCard
          iconName="location-outline"
          label="Municipio"
          value={curso.municipality}
          sublabel="Sede"
        />
      </View>

      <DetailSectionHeading title="Ubicación" iconName="location-outline" />
      <DetailMapCard latitude={curso.latitude} longitude={curso.longitude} />

      <DetailSectionHeading title="Evidencias" />
      <EvidenceCarousel
        urls={curso.galleryUrls}
        onPressEvidence={onPressEvidence}
      />

      <DetailSectionHeading title="Descripción" />
      <Text style={descriptionStyle}>{curso.description}</Text>

      <DetailInfoRows rows={rows} />
    </View>
  );
}
