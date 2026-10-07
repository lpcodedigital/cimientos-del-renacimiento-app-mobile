import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { fontFamily as font, palette, radarPalette } from "@/shared/theme/tokens";

type DeviceMunicipioLabelProps = {
  deviceMunicipio: string | null;
};

export function DeviceMunicipioLabel({
  deviceMunicipio,
}: DeviceMunicipioLabelProps) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: radarPalette.surface,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 14,
        boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      <Ionicons name="location" size={18} color={radarPalette.pin} />
      <Text
        style={{
          fontFamily: font["lato-bold"],
          fontSize: 15,
          color: palette.texto,
        }}
      >
        {deviceMunicipio ?? "—"}
      </Text>
    </View>
  );
}
