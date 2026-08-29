import "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    Lato: require("./assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
  });

  const isReady = loaded || error;
  if (isReady) {
    SplashScreen.hideAsync();
  }

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View className="flex-1 items-center justify-center bg-fondo">
        <Text className="font-lato-bold text-guinda text-3xl">
          Gabinete Móvil
        </Text>
        <Text className="mt-2 font-lato text-texto-suave text-base">
          Gobierno del Estado de Yucatán
        </Text>
      </View>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
