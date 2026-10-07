import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  Text,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import type { MunicipioRadar } from "../domain/entities/MunicipioRadar";
import { fontFamily as font, palette, radarPalette } from "@/shared/theme/tokens";
import { toTitleCase } from "./format";

type RadarChipRowProps = {
  selectedChip: string | null;
  municipios: MunicipioRadar[];
  onSelectMyLocation: () => void;
  onSelectMunicipio: (nombre: string) => void;
};

const chipStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  borderRadius: 999,
  paddingVertical: 8,
  paddingHorizontal: 14,
};

const chipActiveStyle: ViewStyle = {
  backgroundColor: radarPalette.chipActive,
};

const chipInactiveStyle: ViewStyle = {
  backgroundColor: radarPalette.chip,
};

const chipPressedStyle: ViewStyle = {
  opacity: 0.8,
};

const chipTextStyle: TextStyle = {
  fontSize: 13,
};

const chipTextActiveStyle: TextStyle = {
  fontFamily: font["lato-bold"],
  color: "#FFFFFF",
};

const chipTextInactiveStyle: TextStyle = {
  fontFamily: font.lato,
  color: palette.texto,
};

export function RadarChipRow({
  selectedChip,
  municipios,
  onSelectMyLocation,
  onSelectMunicipio,
}: RadarChipRowProps) {
  const locationActive = selectedChip === "MI_UBICACION";

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="MI UBICACIÓN"
        onPress={onSelectMyLocation}
        style={({ pressed }) => [
          chipStyle,
          locationActive ? chipActiveStyle : chipInactiveStyle,
          pressed ? chipPressedStyle : null,
        ]}
      >
        <Ionicons name="location" size={14} color="#FFFFFF" />
        <Text
          style={[
            chipTextStyle,
            locationActive ? chipTextActiveStyle : chipTextInactiveStyle,
          ]}
        >
          MI UBICACIÓN
        </Text>
      </Pressable>

      {municipios.map((municipio) => {
        const active = selectedChip === municipio.nombre;
        return (
          <Pressable
            key={municipio.nombre}
            accessibilityRole="button"
            accessibilityLabel={toTitleCase(municipio.nombre)}
            onPress={() => onSelectMunicipio(municipio.nombre)}
            style={({ pressed }) => [
              chipStyle,
              active ? chipActiveStyle : chipInactiveStyle,
              pressed ? chipPressedStyle : null,
            ]}
          >
            <Text
              style={[
                chipTextStyle,
                active ? chipTextActiveStyle : chipTextInactiveStyle,
              ]}
            >
              {toTitleCase(municipio.nombre)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
