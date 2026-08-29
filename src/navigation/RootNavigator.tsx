import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAuth, type AuthStatus } from "@/features/auth/useAuth";
import { palette, fontFamily } from "@/theme/tokens";
import type {
  AppStackParamList,
  AuthStackParamList,
} from "@/navigation/types";

import { LoginScreen } from "@/screens/auth/LoginScreen";
import { BiometricUnlockScreen } from "@/screens/auth/BiometricUnlockScreen";
import { HomePlaceholderScreen } from "@/screens/app/HomePlaceholderScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.fondo,
  },
};

const AUTH_INITIAL_ROUTE: Record<
  Extract<AuthStatus, "unauthenticated" | "needs_biometric">,
  keyof AuthStackParamList
> = {
  unauthenticated: "Login",
  needs_biometric: "BiometricUnlock",
};

function AuthStackNavigator({ status }: { status: AuthStatus }) {
  const initialRouteName =
    status === "needs_biometric"
      ? AUTH_INITIAL_ROUTE.needs_biometric
      : AUTH_INITIAL_ROUTE.unauthenticated;

  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen
        name="BiometricUnlock"
        component={BiometricUnlockScreen}
      />
    </AuthStack.Navigator>
  );
}

function AppStackNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: palette.guinda },
        headerTintColor: palette.superficie,
        headerTitleStyle: {
          fontFamily: fontFamily["lato-bold"],
          fontSize: 18,
        },
      }}
    >
      <AppStack.Screen
        name="HomePlaceholder"
        component={HomePlaceholderScreen}
        options={{ title: "INICIO" }}
      />
    </AppStack.Navigator>
  );
}

export function RootNavigator() {
  const { status } = useAuth();

  if (status === "bootstrapping") {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={appTheme}>
        {status === "authenticated" ? (
          <AppStackNavigator />
        ) : (
          <AuthStackNavigator status={status} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
