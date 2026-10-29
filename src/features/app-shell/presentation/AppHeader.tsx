import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppStackParamList } from "@/app/navigation/types";
import { appPalette, fontFamily, palette } from "@/shared/theme/tokens";

type AppHeaderProps = {
  onMenuPress: () => void;
};

type HeaderLeftMode = "menu" | "back";

type HeaderConfig = {
  title: string;
  leftMode: HeaderLeftMode;
};

const HEADER_BY_ROUTE: Record<string, HeaderConfig> = {
  Home: { title: "INICIO", leftMode: "menu" },
  Search: { title: "BÚSQUEDA", leftMode: "back" },
  Detail: { title: "DETALLE", leftMode: "back" },
};

const HEADER_DEFAULT: HeaderConfig = { title: "INICIO", leftMode: "menu" };

function resolveRouteName(
  navigation: NativeStackNavigationProp<AppStackParamList>,
): string {
  const state = navigation.getState();
  const route = state?.routes[state.index];
  return typeof route?.name === "string" ? route.name : "Home";
}

export function AppHeader({ onMenuPress }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [routeName, setRouteName] = useState<string>(() =>
    resolveRouteName(navigation),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      setRouteName(resolveRouteName(navigation));
    });
    return unsubscribe;
  }, [navigation]);

  const { title, leftMode } = HEADER_BY_ROUTE[routeName] ?? HEADER_DEFAULT;

  return (
    <View style={{ backgroundColor: appPalette.crema, paddingTop: insets.top }}>
      <StatusBar style="dark" />
      <View
        style={{
          height: 48,
          justifyContent: "center",
          paddingHorizontal: 16,
        }}
      >
        {leftMode === "back" ? (
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name="arrow-back" size={28} color={palette.texto} />
          </Pressable>
        ) : (
          <Pressable
            onPress={onMenuPress}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Abrir menú"
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name="menu" size={28} color={palette.texto} />
          </Pressable>
        )}
        <Text
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: fontFamily["lato-bold"],
            color: palette.texto,
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
