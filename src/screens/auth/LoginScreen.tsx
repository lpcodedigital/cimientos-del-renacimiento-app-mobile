import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/features/auth/useAuth";
import { AuthScaffold } from "@/components/ui/AuthScaffold";
import { GoldButton, GoldButtonText } from "@/components/ui/GoldButton";
import { TextField } from "@/components/ui/TextField";
import { imageAssets } from "@/assets/images";
import type { AuthStackParamList } from "@/navigation/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormPhase = "idle" | "submitting";

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { signIn, canUseBiometricLogin } = useAuth();

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

  function handleForgotPassword() {
    Alert.alert(
      "Recuperación de acceso",
      "La recuperación de acceso se gestiona en la plataforma web institucional. Contacte al administrador."
    );
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
    <AuthScaffold>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-10">
            <View className="items-center gap-8">
              <Text className="text-center font-lato-bold text-3xl leading-tight text-auth-crema">
                Cimientos del Renacimiento
              </Text>

              <Image
                source={imageAssets.escudoYucatan}
                resizeMode="contain"
                accessibilityLabel="Escudo del Gobierno del Estado de Yucatán"
                className="h-32 w-28"
              />
            </View>

            <View className="gap-6">
              <TextField
                label="CORREO ELECTRÓNICO"
                value={email}
                onChangeText={setEmail}
                placeholder="usuario@yucatan.gob.mx"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                editable={!isPending}
                errorLabel={
                  emailError !== null ? emailError : undefined
                }
              />

              <View className="gap-1">
                <TextField
                  label="CONTRASEÑA"
                  value={password}
                  onChangeText={setPassword}
                  secureToggle
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  editable={!isPending}
                />
                <View className="items-end">
                  <Pressable
                    onPress={handleForgotPassword}
                    accessibilityRole="button"
                    accessibilityLabel="¿Olvidaste tu contraseña?"
                    className="py-2"
                    hitSlop={8}
                  >
                    <Text className="font-lato text-sm text-auth-dorado-tenue">
                      ¿Olvidaste tu contraseña?
                    </Text>
                  </Pressable>
                </View>
              </View>

              {domainError !== null ? (
                <Text className="font-lato text-xs text-error">{domainError}</Text>
              ) : null}

              <GoldButton
                loading={isPending}
                disabled={!canSubmit}
                onPress={() => {
                  void handleSubmit();
                }}
              >
                <GoldButtonText>
                  {isPending ? "INGRESANDO…" : "INICIAR SESIÓN"}
                </GoldButtonText>
              </GoldButton>

              {canUseBiometricLogin ? (
                <View className="gap-6">
                  <View className="flex-row items-center gap-4">
                    <View className="h-px flex-1 bg-auth-taupe-dim" />
                    <Text className="font-lato text-sm text-auth-taupe-dim">
                      o continúa con
                    </Text>
                    <View className="h-px flex-1 bg-auth-taupe-dim" />
                  </View>

                  <Pressable
                    onPress={() => navigation.navigate("BiometricUnlock")}
                    accessibilityRole="button"
                    accessibilityLabel="Acceso biométrico"
                    className="h-12 w-full flex-row items-center justify-center gap-2 rounded-full border border-auth-dorado"
                  >
                    <Ionicons name="scan" size={20} color="#C9A854" />
                    <Text className="font-lato text-base text-auth-taupe">
                      Acceso biométrico
                    </Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScaffold>
  );
}
