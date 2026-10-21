import { Ionicons } from "@expo/vector-icons";
import { memo, type ComponentProps } from "react";
import { Text, View } from "react-native";

import {
  detailPalette,
  fontFamily as font,
  palette,
} from "@/shared/theme/tokens";

type KpiCardProps = {
  iconName: ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  sublabel: string;
  compact?: boolean;
};

const cardStyle = {
  flex: 1,
  backgroundColor: detailPalette.cardBg,
  borderRadius: 28,
  alignItems: "center",
  paddingVertical: 16,
  paddingHorizontal: 8,
  gap: 4,
} as const;

const labelStyle = {
  fontFamily: font.lato,
  fontSize: 13,
  color: detailPalette.kpiLabel,
  textAlign: "center",
} as const;

const valueStyle = {
  fontFamily: font["lato-bold"],
  fontSize: 18,
  color: palette.texto,
  textAlign: "center",
} as const;

const compactValueStyle = {
  fontFamily: font["lato-bold"],
  fontSize: 13,
  color: palette.texto,
  textAlign: "center",
} as const;

const sublabelStyle = {
  fontFamily: font.lato,
  fontSize: 11,
  color: detailPalette.textMuted,
  textAlign: "center",
} as const;

function KpiCardBase({
  iconName,
  label,
  value,
  sublabel,
  compact = false,
}: KpiCardProps) {
  return (
    <View style={cardStyle}>
      <Ionicons name={iconName} size={28} color={detailPalette.accent} />
      <Text style={labelStyle}>{label}</Text>
      <Text
        numberOfLines={compact ? 1 : undefined}
        style={compact ? compactValueStyle : valueStyle}
      >
        {value}
      </Text>
      <Text style={sublabelStyle}>{sublabel}</Text>
    </View>
  );
}

export const KpiCard = memo(KpiCardBase);
