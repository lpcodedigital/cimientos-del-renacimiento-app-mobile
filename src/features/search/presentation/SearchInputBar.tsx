import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

import { fontFamily as font, palette, searchPalette } from "@/shared/theme/tokens";
import { useSearch } from "./useSearch";

export function SearchInputBar() {
  const { query, setQuery, clearQuery } = useSearch();

  return (
    <View
      style={{
        backgroundColor: searchPalette.surface,
        borderRadius: 24,
        paddingVertical: 4,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Ionicons name="search" size={20} color={palette["texto-suave"]} />
      <TextInput
        value={query}
        onChangeText={setQuery}
        autoFocus
        placeholder="Buscar municipio, localidad, obra o capacitación"
        placeholderTextColor={palette["texto-suave"]}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Buscar"
        style={{
          flex: 1,
          fontFamily: font.lato,
          fontSize: 15,
          color: palette.texto,
        }}
      />
      {query.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          hitSlop={12}
          onPress={clearQuery}
        >
          <Ionicons name="close" size={20} color={palette["texto-suave"]} />
        </Pressable>
      ) : null}
    </View>
  );
}
