import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList, type ListRenderItem } from "@shopify/flash-list";
import {
  keepPreviousData,
  useInfiniteQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import type { AppStackParamList } from "@/app/navigation/types";
import { useHeaderTitle } from "@/features/app-shell/presentation/useHeaderTitle";
import { fontFamily as font, palette, searchPalette } from "@/shared/theme/tokens";
import type { SearchCard } from "../domain/entities/SearchCard";
import type { SearchPage } from "../domain/entities/SearchPage";
import type { SearchError } from "../domain/errors/SearchError";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchInputBar } from "./SearchInputBar";
import { SearchResultCard } from "./SearchResultCard";
import { useSearch } from "./useSearch";

const cardWrapperStyle = {
  flex: 1,
  paddingHorizontal: 6,
  paddingBottom: 12,
} as const;

const renderCard: ListRenderItem<SearchCard> = ({ item }) => (
  <View style={cardWrapperStyle}>
    <SearchResultCard card={item} />
  </View>
);

const keyExtractor = (item: SearchCard): string => `${item.tipo}-${item.id}`;

export function SearchScreen() {
  const { setTitle } = useHeaderTitle();

  useFocusEffect(
    useCallback(() => {
      setTitle("BÚSQUEDA");
    }, [setTitle]),
  );

  const { useCases, debouncedQuery, isActive } = useSearch();

  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const result = useInfiniteQuery<
    SearchPage,
    SearchError,
    InfiniteData<SearchPage>,
    readonly unknown[],
    number
  >({
    queryKey: ["search", "global", debouncedQuery],
    queryFn: ({ pageParam, signal }) =>
      useCases.globalSearch(debouncedQuery, pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isLast ? undefined : lastPage.page + 1,
    enabled: isActive,
    placeholderData: keepPreviousData,
  });

  const cards = result.data?.pages.flatMap((page) => page.cards) ?? [];
  const totalElements = result.data?.pages[0]?.totalElements ?? 0;

  const handleEndReached = useCallback(() => {
    if (result.hasNextPage && !result.isFetchingNextPage) {
      result.fetchNextPage();
    }
  }, [result.hasNextPage, result.isFetchingNextPage, result.fetchNextPage]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: searchPalette.screenBg,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={12}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={palette.texto} />
        </Pressable>
      </View>

      <SearchInputBar />

      <View style={{ flex: 1, marginHorizontal: -16 }}>
        {!isActive ? (
          <SearchEmptyState variant="initial" />
        ) : result.isPending ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" color={palette.guinda} />
          </View>
        ) : result.isError ? (
          <SearchEmptyState variant="error" />
        ) : result.isSuccess && cards.length === 0 ? (
          <SearchEmptyState variant="empty" query={debouncedQuery} />
        ) : (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
                paddingTop: 16,
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: font["lato-bold"],
                  fontSize: 18,
                  color: palette.texto,
                }}
              >
                Resultado de búsqueda
              </Text>
              <Text
                style={{
                  fontFamily: font.lato,
                  fontSize: 13,
                  color: searchPalette.textMuted,
                }}
              >
                {totalElements === 1
                  ? "1 resultado"
                  : `${totalElements} resultados`}
              </Text>
            </View>
            <FlashList
              data={cards}
              renderItem={renderCard}
              keyExtractor={keyExtractor}
              numColumns={2}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.4}
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingTop: 12,
                paddingBottom: 24,
              }}
              ListFooterComponent={
                result.isFetchingNextPage ? (
                  <ActivityIndicator
                    size="small"
                    color={palette.guinda}
                    style={{ paddingVertical: 16 }}
                  />
                ) : null
              }
            />
          </>
        )}
      </View>
    </View>
  );
}
