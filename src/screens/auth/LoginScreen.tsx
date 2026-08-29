import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { useAuth } from "@/features/auth/useAuth";
import { InstitutionalText } from "@/components/ui/InstitutionalText";
import { Button, ButtonText } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormPhase = "idle" | "submitting";

const DEMO_EMAIL = "demo@cdr.mx";
const DEMO_PASSWORD = "demo1234";

export function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [domainError, setDomainError] = useState<string | null>(null);
  const [phase, setPhase] = useState<FormPhase>("idle");

  const canSubmit =
    EMAIL_PATTERN.test(email.trim()) && password.trim().length > 0;

  const isPending = phase === "submitting";

  async function handleSubmit() {
    if (!canSubmit || isPending) {
      return;
    }

    setDomainError(null);
    setPhase("submitting");

    try {
      await signIn(email.trim(), password);
    } catch (error) {
      setPhase("idle");
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
          ? (error as { message: string }).message
          : null;
      setDomainError(
        message !== null
          ? message
          : "No fue posible contactar al servidor. Inténtalo de nuevo."
      );
    }
  }

  const emailError = useMemo<string | null>(() => {
    if (email.trim().length === 0) {
      return null;
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return "Ingresa un correo electrónico válido.";
    }
    return null;
  }, [email]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-fondo"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <InstitutionalText variant="bold" className="text-guinda text-4xl">
          Gabinete Móvil
        </InstitutionalText>
        <InstitutionalText className="mt-2 text-texto-suave text-base">
          Gobierno del Estado de Yucatán
        </InstitutionalText>

        <View className="mt-8 gap-6">
          <TextField
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            errorLabel={
              emailError !== null
                ? emailError
                : domainError !== null
                ? domainError
                : undefined
            }
          />

          <TextField
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
          />

          <View className="rounded-lg border border-dorado bg-superficie p-4">
            <InstitutionalText className="text-texto-suave text-sm">
              Prueba local: {DEMO_EMAIL} / {DEMO_PASSWORD}
            </InstitutionalText>
          </View>

          {domainError !== null && emailError === null ? (
            <InstitutionalText className="text-error text-sm">
              {domainError}
            </InstitutionalText>
          ) : null}

          <Button
            variant="primary"
            disabled={!canSubmit || isPending}
            onPress={() => {
              void handleSubmit();
            }}
          >
            <ButtonText variant="primary">
              {isPending ? "Ingresando…" : "Ingresar"}
            </ButtonText>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
