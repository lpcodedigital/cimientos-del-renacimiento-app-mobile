import { useMemo } from "react";
import { Text, View } from "react-native";

import {
  fontFamily as font,
  palette,
} from "@/shared/theme/tokens";
import type { ObraDetail } from "../domain/entities/ObraDetail";
import { DetailInfoRows, type DetailInfoRow } from "./DetailInfoRows";
import { DetailMapCard } from "./DetailMapCard";
import { DetailSectionHeading } from "./DetailSectionHeading";
import { EvidenceCarousel } from "./EvidenceCarousel";
import { formatInversion, toTitleCase } from "./format";
import { KpiCard } from "./KpiCard";

type ObraDetailContentProps = {
  obra: ObraDetail;
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

export function ObraDetailContent({
  obra,
  onPressEvidence,
}: ObraDetailContentProps) {
  const rows = useMemo<DetailInfoRow[]>(
    () => [
      { label: "Municipio", value: obra.municipality },
      { label: "Localidad", value: obra.locality },
      { label: "Dependencia", value: obra.agency },
      { label: "Estatus", value: obra.status },
    ],
    [obra.municipality, obra.locality, obra.agency, obra.status],
  );

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>{toTitleCase(obra.name)}</Text>

      <View style={kpiRowStyle}>
        <KpiCard
          iconName="cash-outline"
          label="Finanzas"
          value={formatInversion(obra.investment)}
          sublabel="Inversión"
        />
        <KpiCard
          iconName="pie-chart-outline"
          label="Avance"
          value={`${obra.progress}%`}
          sublabel="Completado"
        />
        <KpiCard
          iconName="flag-outline"
          label="Estatus"
          value={obra.status}
          sublabel="Estado de la obra"
          compact
        />
      </View>

      <DetailSectionHeading title="Ubicación" iconName="location-outline" />
      <DetailMapCard latitude={obra.latitude} longitude={obra.longitude} />

      <DetailSectionHeading title="Evidencias" />
      <EvidenceCarousel
        urls={obra.galleryUrls}
        onPressEvidence={onPressEvidence}
      />

      <DetailSectionHeading title="Descripción" />
      <Text style={descriptionStyle}>{obra.description}</Text>

      <DetailInfoRows rows={rows} />
    </View>
  );
}
