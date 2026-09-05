import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type TextProps,
} from "react-native";

import { authPalette, fontFamily as font } from "@/theme/tokens";

type GoldButtonProps = Omit<PressableProps, "className" | "children"> & {
  loading?: boolean;
  children: ReactNode;
};

export function GoldButton({
  loading = false,
  disabled = false,
  accessibilityRole = "button",
  onPress,
  children,
  ...props
}: GoldButtonProps) {
  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: 56,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          overflow: "hidden",
          opacity: disabled ? 0.4 : pressed ? 0.8 : loading ? 0.8 : 1,
        },
      ]}
      {...props}
    >
      <LinearGradient
        colors={[authPalette.goldGradStart, authPalette.goldGradEnd]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
      />
      {loading ? (
        <ActivityIndicator color={authPalette.btnText} />
      ) : (
        children
      )}
    </Pressable>
  );
}

export function GoldButtonText({ style, ...props }: TextProps) {
  return (
    <Text
      style={[
        {
          fontSize: 16,
          color: authPalette.btnText,
          fontFamily: font["lato-bold"],
          textTransform: "uppercase",
          letterSpacing: 1,
        },
        style,
      ]}
      {...props}
    />
  );
}
