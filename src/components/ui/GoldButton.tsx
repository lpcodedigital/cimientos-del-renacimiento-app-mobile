import { LinearGradient } from "expo-linear-gradient";
import { useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
  type TextProps,
} from "react-native";

import { authPalette } from "@/theme/tokens";

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
  const [pressed, setPressed] = useState(false);

  const opacityClass = disabled
    ? "opacity-40"
    : pressed
      ? "opacity-80"
      : "opacity-100";

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={`h-14 w-full items-center justify-center rounded-full ${opacityClass}`}
      {...props}
    >
      <LinearGradient
        colors={[authPalette.goldGradStart, authPalette.goldGradEnd]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        className="absolute inset-0 rounded-full"
      />
      {loading ? (
        <ActivityIndicator color={authPalette.btnText} />
      ) : (
        children
      )}
    </Pressable>
  );
}

export function GoldButtonText({ ...props }: TextProps) {
  return (
    <Text
      className="font-lato-bold text-base uppercase tracking-widest text-auth-btn-text"
      {...props}
    />
  );
}
