import { type ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authPalette } from "@/theme/tokens";

type AuthScaffoldProps = {
  children: ReactNode;
};

export function AuthScaffold({ children }: AuthScaffoldProps) {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={[
          authPalette.bgTop,
          authPalette.bgMid,
          authPalette.bgBottom,
        ]}
        locations={[0, 0.45, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="absolute inset-0"
      />
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">{children}</SafeAreaView>
    </View>
  );
}
