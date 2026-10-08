import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import {
  fontFamily as font,
  palette,
  radarPalette,
} from "@/shared/theme/tokens";

export function RadarSearchBar() {
  return (
    <View
      accessibilityLabel="Buscar (disponible en la siguiente fase)"
      accessible
      style={{
        backgroundColor: radarPalette.surface,
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Ionicons name="search" size={20} color={palette["texto-suave"]} />
      <Text
        style={{
          flex: 1,
          fontFamily: font["lato-bold"],
          fontSize: 13,
          lineHeight: 17,
          color: palette.texto,
          textTransform: "uppercase",
        }}
      >
        {"BUSCAR MUNICIPIO, LOCALIDAD,\nOBRA O CAPACITACION"}
      </Text>
    </View>
  );
}
