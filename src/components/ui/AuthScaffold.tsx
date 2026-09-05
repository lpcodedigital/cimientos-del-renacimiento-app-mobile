import { type ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { authPalette } from "@/theme/tokens";

type AuthScaffoldProps = {
  children: ReactNode;
};

export function AuthScaffold({ children }: AuthScaffoldProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: authPalette.bgTop }}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={[
            authPalette.bgTop,
            authPalette.bgMid,
            authPalette.bgBottom,
          ]}
          locations={[0, 0.45, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <StatusBar style="light" />
      <View
        style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        {children}
      </View>
    </View>
  );
}
