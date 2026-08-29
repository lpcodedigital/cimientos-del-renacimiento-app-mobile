import { useState, useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";import { useAuth } from "@/features/auth/useAuth";
import { InstitutionalText } from "@/components/ui/InstitutionalText";

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
  const { unlockWithBiometrics, signOut } = useAuth();
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
    if (autoPrompted.current) {
      return;
    }
    autoPrompted.current = true;
    const timer = setTimeout(() => {
      void handleUnlock();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-fondo px-8">
      <InstitutionalText variant="bold" className="text-guinda text-4xl">
        Gabinete Móvil
      </InstitutionalText>
      <InstitutionalText className="mt-2 text-texto-suave text-base">
        Desbloquea con Face ID / huella / pin para continuar.
      </InstitutionalText>

      {unlockError !== null ? (
        <InstitutionalText className="mt-4 text-center text-error text-sm">
          {unlockError}
        </InstitutionalText>
      ) : null}

      <Pressable
        className="mt-8 w-full rounded-xl bg-guinda px-6 py-4"
        accessibilityRole="button"
        accessibilityLabel="Desbloquear"
        disabled={pending}
        onPress={() => {
          void handleUnlock();
        }}
      >
        <Text className="text-center font-lato-bold text-superficie text-base">
          {pending ? "Desbloqueando…" : "Desbloquear"}
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
