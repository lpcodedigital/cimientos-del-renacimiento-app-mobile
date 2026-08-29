import { Pressable, Text, View } from "react-native";

import { useAuth } from "@/features/auth/useAuth";
import { InstitutionalText } from "@/components/ui/InstitutionalText";

export function HomePlaceholderScreen() {
  const {
    user,
    signOut,
    shouldOfferBiometricOptIn,
    biometricEnrollHint,
    enableBiometricAfterLogin,
    declineBiometricOptIn,
  } = useAuth();

  if (shouldOfferBiometricOptIn) {
    return (
      <View className="flex-1 items-center justify-center bg-fondo px-8">
        <InstitutionalText variant="bold" className="text-guinda text-4xl">
          Gabinete Móvil
        </InstitutionalText>
        <InstitutionalText className="mt-4 text-center text-texto text-lg">
          ¿Desea desbloquear el Gabinete Móvil con Face ID / huella / pin en el
          próximo acceso?
        </InstitutionalText>
        <Pressable
          className="mt-8 w-full rounded-xl bg-guinda px-6 py-4"
          accessibilityRole="button"
          accessibilityLabel="Usar Face ID, huella o pin"
          onPress={() => {
            void enableBiometricAfterLogin();
          }}
        >
          <Text className="text-center font-lato-bold text-superficie text-base">
            Usar Face ID / huella / pin
          </Text>
        </Pressable>
        <Pressable
          className="mt-4 w-full rounded-xl border border-guinda bg-superficie px-6 py-4"
          accessibilityRole="button"
          accessibilityLabel="Ahora no"
          onPress={() => {
            void declineBiometricOptIn();
          }}
        >
          <Text className="text-center font-lato-bold text-guinda text-base">
            Ahora no
          </Text>
        </Pressable>
        <Pressable
          className="mt-4 py-2"
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
          onPress={() => {
            void signOut();
          }}
        >
          <Text className="font-lato text-texto-suave text-base underline">
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-fondo px-8">
      <Text className="font-lato-bold text-guinda text-3xl">
        Bienvenido, {user?.name}
      </Text>
      <Text className="mt-4 text-center font-lato text-texto text-base">
        Radar territorial disponible en la siguiente fase.
      </Text>

      {biometricEnrollHint !== null ? (
        <View className="mt-6 w-full rounded-lg border border-dorado bg-superficie p-4">
          <InstitutionalText className="text-texto-suave text-sm">
            {biometricEnrollHint}
          </InstitutionalText>
        </View>
      ) : null}

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
