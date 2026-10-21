import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { memo, useCallback } from "react";
import { Pressable, Text, View } from "react-native";

import type { AppStackParamList } from "@/app/navigation/types";
import { fontFamily as font, palette, searchPalette } from "@/shared/theme/tokens";
import type { SearchCard } from "../domain/entities/SearchCard";
import { formatProgreso, formatUbicacion, toTitleCase } from "./format";

type Props = {
  card: SearchCard;
};

function SearchResultCardBase({ card }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const handlePress = useCallback(() => {
    navigation.navigate("Detail", { tipo: card.tipo, id: card.id });
  }, [navigation, card.tipo, card.id]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ver detalle"
      onPress={handlePress}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: searchPalette.cardBg,
        borderRadius: 20,
        overflow: "hidden",
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View style={{ width: "100%", aspectRatio: 4 / 3 }}>
        {card.imagenUrl !== null ? (
          <Image
            source={{ uri: card.imagenUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            recyclingKey={card.imagenUrl}
            cachePolicy="memory-disk"
            transition={0}
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: searchPalette.imagePlaceholder,
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Ionicons
              name="image-outline"
              size={28}
              color={searchPalette.textMuted}
            />
            <Text
              style={{
                fontFamily: font.lato,
                fontSize: 12,
                color: searchPalette.textMuted,
              }}
            >
              Sin imagen
            </Text>
          </View>
        )}
        <View
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            borderRadius: 12,
            paddingVertical: 4,
            paddingHorizontal: 10,
            backgroundColor:
              card.tipo === "OBRA"
                ? searchPalette.tagObra
                : searchPalette.tagCurso,
          }}
        >
          <Text
            style={{
              fontFamily: font["lato-bold"],
              fontSize: 11,
              color: "#FFFFFF",
            }}
          >
            {card.tipo === "OBRA" ? "Obra" : "Capacitación"}
          </Text>
        </View>
      </View>

      <View style={{ padding: 12, gap: 6 }}>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: font["lato-bold"],
            fontSize: 13,
            color: palette.texto,
          }}
        >
          {toTitleCase(card.titulo)}
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <Ionicons name="location" size={12} color={palette.guinda} />
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontFamily: font.lato,
              fontSize: 12,
              color: searchPalette.textMuted,
            }}
          >
            {formatUbicacion(card.localidad, card.municipio)}
          </Text>
        </View>
        {card.progreso !== null && card.estatus !== null ? (
          <Text
            style={{
              fontFamily: font.lato,
              fontSize: 12,
              color: searchPalette.textMuted,
            }}
          >
            {formatProgreso(card.progreso, card.estatus)}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export const SearchResultCard = memo(SearchResultCardBase);
