import { Pressable, Text, View } from "react-native";

import { useAuth } from "@/features/auth/useAuth";

export function HomePlaceholderScreen() {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-fondo px-8">
      <Text className="font-lato-bold text-guinda text-3xl">
        Bienvenido, {user?.name}
      </Text>
      <Text className="mt-4 text-center font-lato text-texto text-base">
        Radar territorial disponible en la siguiente fase.
      </Text>

      <Pressable
        className="mt-8 rounded-xl bg-guinda px-6 py-3"
        accessibilityRole="button"
        accessibilityLabel="Cerrar sesión"
        onPress={() => {
          void signOut();
        }}
      >
        <Text className="font-lato-bold text-superficie text-base">
          Cerrar sesión
        </Text>
      </Pressable>
    </View>
  );
}
