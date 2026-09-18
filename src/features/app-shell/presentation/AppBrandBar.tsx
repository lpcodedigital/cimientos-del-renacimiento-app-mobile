import { Text, View } from "react-native";

import { appPalette, fontFamily } from "@/shared/theme/tokens";

export function AppBrandBar() {
  return (
    <View
      style={{
        backgroundColor: appPalette.guinda,
        paddingVertical: 28,
        paddingHorizontal: 16,
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily["lato-bold"],
          color: appPalette.goldWordmark,
          textAlign: "center",
        }}
      >
        Cimientos del Renacimiento
      </Text>
    </View>
  );
}
