import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";

import type { AppStackParamList } from "@/app/navigation/types";
import {
  fontFamily as font,
  palette,
  radarPalette,
} from "@/shared/theme/tokens";

export function RadarSearchBar() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <Pressable
      onPress={() => navigation.navigate("Search")}
      accessibilityRole="button"
      accessibilityLabel="Buscar"
      accessible
      style={({ pressed }) => ({
        backgroundColor: radarPalette.surface,
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
        opacity: pressed ? 0.9 : 1,
      })}
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
    </Pressable>
  );
}
