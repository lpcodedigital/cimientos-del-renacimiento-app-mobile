import { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { AuthScaffold } from "@/components/ui/AuthScaffold";
import { GoldButton, GoldButtonText } from "@/components/ui/GoldButton";
import { useAuth } from "@/features/auth/useAuth";
import { fontFamily as font } from "@/theme/tokens";

const COLOR = {
  crema: "#EDD6A8",
  taupe: "#A58571",
  error: "#8B1E1E",
} as const;

function errorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "No fue posible desbloquear. Inténtalo de nuevo.";
}

export function BiometricUnlockScreen() {
  const { biometricUnlockMode, unlockWithBiometrics, signOut } = useAuth();
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const autoPrompted = useRef(false);

  async function handleUnlock() {
    if (pending) {
      return;
    }
    setUnlockError(null);
    setPending(true);
    try {
      await unlockWithBiometrics();
    } catch (error) {
      setUnlockError(errorMessage(error));
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    if (autoPrompted.current || biometricUnlockMode === "manual") {
      return;
    }
    autoPrompted.current = true;
    const timer = setTimeout(() => {
      void handleUnlock();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [biometricUnlockMode]);

  return (
    <AuthScaffold>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 32,
          paddingVertical: 16,
        }}
      >
        <Pressable
          onPress={() => {
            void signOut();
          }}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          disabled={pending}
          hitSlop={8}
          style={{ alignSelf: "flex-start", paddingVertical: 4 }}
        >
          <Text style={{ fontFamily: font.lato, fontSize: 16, color: COLOR.taupe }}>
            {"< Volver"}
          </Text>
        </Pressable>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          <Text
            style={{
              fontFamily: font["lato-bold"],
              fontSize: 28,
              lineHeight: 34,
              color: COLOR.crema,
              textAlign: "center",
            }}
          >
            Cimientos del Renacimiento
          </Text>

          <Image
            source={require("../../../assets/images/escudo-yucatan.png")}
            resizeMode="contain"
            accessibilityLabel="Escudo del Gobierno del Estado de Yucatán"
            style={{ width: 160, height: 160 }}
          />

          <Text
            style={{
              fontFamily: font.lato,
              fontSize: 16,
              lineHeight: 24,
              color: COLOR.taupe,
              textAlign: "center",
            }}
          >
            Utilice su método biométrico para acceder
          </Text>

          {unlockError !== null ? (
            <Text
              style={{
                fontFamily: font.lato,
                fontSize: 14,
                color: COLOR.error,
                textAlign: "center",
              }}
            >
              {unlockError}
            </Text>
          ) : null}
        </View>

        <View style={{ gap: 12 }}>
          <GoldButton
            loading={pending}
            disabled={pending}
            onPress={() => {
              void handleUnlock();
            }}
          >
            <GoldButtonText>INICIAR SESIÓN</GoldButtonText>
          </GoldButton>
        </View>
      </View>
    </AuthScaffold>
  );
}
