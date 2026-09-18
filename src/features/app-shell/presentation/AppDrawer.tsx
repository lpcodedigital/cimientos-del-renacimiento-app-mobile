import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/features/auth/presentation/useAuth";
import { appPalette, fontFamily } from "@/shared/theme/tokens";

import { menuItems } from "./menuItems";

type AppDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSignOut: () => void;
};

export function AppDrawer({ open, onClose, onSignOut }: AppDrawerProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  useEffect(() => {
    if (!open) {
      return;
    }

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]}>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Cerrar menú"
        style={({ pressed }) => ({
          flex: 1,
          backgroundColor: appPalette.overlay,
          opacity: pressed ? 0.95 : 1,
        })}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "72%",
          backgroundColor: appPalette.crema,
        }}
      >
        <View
          style={{
            backgroundColor: appPalette.guinda,
            paddingTop: insets.top + 20,
            paddingBottom: 20,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: appPalette.goldWordmark,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="person-outline"
              size={26}
              color={appPalette.goldWordmark}
            />
          </View>
          <View style={{ flexShrink: 1 }}>
            {user?.name ? (
              <Text
                style={{
                  fontFamily: fontFamily["lato-bold"],
                  color: appPalette.goldWordmark,
                }}
              >
                {user.name}
              </Text>
            ) : null}
            {user?.email ? (
              <Text
                style={{
                  fontFamily: fontFamily.lato,
                  fontSize: 12,
                  color: appPalette.goldWordmark,
                }}
              >
                {user.email}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={{ flex: 1, paddingVertical: 8 }}>
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                if (item.action === "home") {
                  onClose();
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 14,
                paddingHorizontal: 20,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons
                name={item.ionicon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={appPalette.itemIcon}
              />
              <Text
                style={{
                  fontFamily: fontFamily.lato,
                  fontSize: 16,
                  color: appPalette.item,
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: appPalette.itemIcon,
            paddingBottom: insets.bottom + 8,
          }}
        >
          <Pressable
            onPress={onSignOut}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingVertical: 16,
              paddingHorizontal: 20,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color={appPalette.logout}
            />
            <Text
              style={{
                fontFamily: fontFamily["lato-bold"],
                color: appPalette.logout,
              }}
            >
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
