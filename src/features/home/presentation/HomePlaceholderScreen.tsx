import { Text, View } from "react-native";

import { useAuth } from "@/features/auth/presentation/useAuth";

export function HomePlaceholderScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-app-crema px-8">
      <Text className="font-lato-bold text-guinda text-3xl">
        Bienvenido, {user?.name}
      </Text>
      <Text className="mt-4 text-center font-lato text-texto text-base">
        Radar territorial disponible en la siguiente fase.
      </Text>
    </View>
  );
}
