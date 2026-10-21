import { FlashList, type ListRenderItem } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

import { detailPalette, fontFamily as font } from "@/shared/theme/tokens";

type EvidenceCarouselProps = {
  urls: string[] | null;
  onPressEvidence: (url: string) => void;
};

const keyExtractor = (url: string): string => url;

const wrapperStyle = {
  paddingRight: 12,
} as const;

const cardStyle = {
  width: 240,
  aspectRatio: 4 / 3,
  borderRadius: 20,
  overflow: "hidden",
} as const;

const imageStyle = {
  width: "100%",
  height: "100%",
} as const;

const captionStyle = {
  fontFamily: font.lato,
  fontSize: 12,
  color: detailPalette.textMuted,
  textAlign: "center",
} as const;

const emptyStyle = {
  fontFamily: font.lato,
  fontSize: 14,
  color: detailPalette.textMuted,
  textAlign: "center",
  paddingVertical: 24,
} as const;

const contentContainerStyle = {
  paddingVertical: 4,
} as const;

export function EvidenceCarousel({
  urls,
  onPressEvidence,
}: EvidenceCarouselProps) {
  const renderItem: ListRenderItem<string> = useCallback(
    ({ item, index }) => (
      <View style={wrapperStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver evidencia"
          onPress={() => onPressEvidence(item)}
          style={({ pressed }) => ({
            ...cardStyle,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Image
            source={{ uri: item }}
            style={imageStyle}
            contentFit="cover"
            recyclingKey={item}
            cachePolicy="memory-disk"
            transition={0}
          />
        </Pressable>
        <Text style={captionStyle}>evidencia {index + 1}</Text>
      </View>
    ),
    [onPressEvidence],
  );

  if (urls === null || urls.length === 0) {
    return <Text style={emptyStyle}>Sin evidencias fotográficas.</Text>;
  }

  return (
    <FlashList
      data={urls}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
    />
  );
}
