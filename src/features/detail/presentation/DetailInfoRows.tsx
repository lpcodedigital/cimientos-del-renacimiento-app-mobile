import { Text, View } from "react-native";

import {
  detailPalette,
  fontFamily as font,
  palette,
} from "@/shared/theme/tokens";

export type DetailInfoRow = {
  label: string;
  value: string;
};

type DetailInfoRowsProps = {
  rows: DetailInfoRow[];
};

const listStyle = {
  gap: 12,
} as const;

const rowStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: detailPalette.cardBg,
  borderRadius: 30,
  paddingHorizontal: 20,
  paddingVertical: 16,
  gap: 12,
} as const;

const labelStyle = {
  fontFamily: font.lato,
  fontSize: 14,
  color: detailPalette.textMuted,
} as const;

const valueStyle = {
  flexShrink: 1,
  fontFamily: font["lato-bold"],
  fontSize: 14,
  color: palette.texto,
  textAlign: "right",
} as const;

export function DetailInfoRows({ rows }: DetailInfoRowsProps) {
  return (
    <View style={listStyle}>
      {rows.map((row) => (
        <View key={row.label} style={rowStyle}>
          <Text style={labelStyle}>{row.label}</Text>
          <Text numberOfLines={2} style={valueStyle}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
