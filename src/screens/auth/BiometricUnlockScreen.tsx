import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";

import { useAuth } from "@/features/auth/useAuth";
import { InstitutionalText } from "@/components/ui/InstitutionalText";

export function BiometricUnlockScreen() {
  const { unlockWithBiometrics, signOut } = useAuth();
  const autoPrompted = useRef(false);

  useEffect(() => {
    if (autoPrompted.current) {
      return;
    }
    autoPrompted.current = true;
    void unlockWithBiometrics();
  }, [unlockWithBiometrics]);

  return (
    <View className="flex-1 items-center justify-center bg-fondo px-8">
      <InstitutionalText variant="bold" className="text-guinda text-4xl">
        Gabinete Móvil
      </InstitutionalText>
      <InstitutionalText className="mt-2 text-texto-suave text-base">
        Desbloquea con Face ID / huella para continuar.
      </InstitutionalText>
      <Pressable
        className="mt-8 w-full rounded-xl bg-guinda px-6 py-4"
        accessibilityRole="button"
        accessibilityLabel="Desbloquear"
        onPress={() => {
          void unlockWithBiometrics();
        }}
      >
        <Text className="text-center font-lato-bold text-superficie text-base">
          Desbloquear
        </Text>
      </Pressable>
      <Pressable
        className="mt-4 py-2"
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
