import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

import {
  detailPalette,
  fontFamily as font,
  palette,
} from "@/shared/theme/tokens";

type DetailSectionHeadingProps = {
  title: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
};

const rowStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
} as const;

const titleStyle = {
  fontFamily: font["lato-bold"],
  fontSize: 20,
  color: palette.texto,
} as const;

export function DetailSectionHeading({
  title,
  iconName,
}: DetailSectionHeadingProps) {
  return (
    <View style={rowStyle}>
      {iconName !== undefined ? (
        <Ionicons name={iconName} size={24} color={detailPalette.accent} />
      ) : null}
      <Text style={titleStyle}>{title}</Text>
    </View>
  );
}
