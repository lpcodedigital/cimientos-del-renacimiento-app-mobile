import { Pressable, Text, View } from "react-native";

import { useAuth } from "@/features/auth/useAuth";

export function BiometricUnlockScreen() {
  const { unlockWithBiometrics, signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-fondo px-8">
      <Text className="font-lato-bold text-guinda text-3xl">
        Gabinete Móvil
      </Text>
      <Text className="mt-2 font-lato text-texto-suave text-base">
        Desbloquea para continuar.
      </Text>
      <Pressable
        className="mt-8 rounded-xl bg-guinda px-6 py-3"
        accessibilityRole="button"
        accessibilityLabel="Desbloquear"
        onPress={() => {
          void unlockWithBiometrics();
        }}
      >
        <Text className="font-lato-bold text-superficie text-base">
          Desbloquear
        </Text>
      </Pressable>
      <Pressable
        className="mt-4"
        accessibilityRole="button"
        accessibilityLabel="Usar correo y contraseña"
        onPress={() => {
          void signOut();
        }}
      >
        <Text className="font-lato text-guinda text-base underline">
          Usar correo y contraseña
        </Text>
      </Pressable>
    </View>
  );
}
