import "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./global.css";

import { createAuthUseCases } from "@/app/compositionRoot";
import { AuthProvider } from "@/features/auth/presentation/AuthProvider";
import { RootNavigator } from "@/app/navigation/RootNavigator";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const authUseCases = createAuthUseCases();

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider useCases={authUseCases}>
        <RootNavigator />
        <StatusBar style="light" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
