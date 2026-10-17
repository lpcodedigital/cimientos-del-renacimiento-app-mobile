import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { fontFamily as font, searchPalette } from "@/shared/theme/tokens";

type Props = {
  variant: "initial" | "empty" | "error";
  query?: string;
};

export function SearchEmptyState({ variant, query }: Props) {
  const message =
    variant === "initial"
      ? "Escribe al menos 3 caracteres para buscar obras y capacitaciones."
      : variant === "empty"
        ? `Sin resultados para "${query ?? ""}".`
        : "No se pudo completar la búsqueda.";

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        gap: 8,
      }}
    >
      <Ionicons
        name={
          variant === "error" ? "alert-circle-outline" : "search-outline"
        }
        size={36}
        color={searchPalette.textMuted}
      />
      <Text
        style={{
          fontFamily: font.lato,
          fontSize: 14,
          color: searchPalette.textMuted,
          textAlign: "center",
        }}
      >
        {message}
      </Text>
    </View>
  );
}
