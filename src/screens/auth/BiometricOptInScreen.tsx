import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/features/auth/useAuth";
import {
  getSupportedBiometricMethods,
  type BiometricMethodKind,
} from "@/features/auth/biometricService";
import { AuthScaffold } from "@/components/ui/AuthScaffold";
import { GoldButton, GoldButtonText } from "@/components/ui/GoldButton";
import { fontFamily as font } from "@/theme/tokens";

const COLOR = {
  crema: "#EDD6A8",
  taupe: "#A58571",
  taupeDim: "#6C4A44",
  dorado: "#C9A854",
  doradoTenue: "#8F693B",
  cardActive: "#45201B",
  cardInactive: "#331016",
  borderActive: "#C9A854",
  cardBorder: "#7A3B48",
} as const;

type MethodOption = {
  key: BiometricMethodKind;
  title: string;
  subtitle: string;
  iconName: "scan" | "finger-print" | "finger-print-outline";
};

const METHOD_OPTIONS: MethodOption[] = [
  {
    key: "facial",
    title: "FACE ID",
    subtitle: "Reconocimiento facial",
    iconName: "scan",
  },
  {
    key: "fingerprint",
    title: "HUELLA",
    subtitle: "Sensor biométrico",
    iconName: "finger-print",
  },
];

type BenefitRow = {
  iconName: "lock-closed" | "flash" | "refresh";
  text: string;
};

const BENEFITS: BenefitRow[] = [
  {
    iconName: "lock-closed",
    text: "Sus datos nunca salen del dispositivo",
  },
  { iconName: "flash", text: "Acceso en menos de un segundo" },
  { iconName: "refresh", text: "Puede desactivarlo en cualquier momento" },
];

export function BiometricOptInScreen() {
  const { declineBiometricOptIn, enableBiometricAfterLogin } = useAuth();
  const [methods, setMethods] = useState<BiometricMethodKind[]>([]);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    let active = true;
    void getSupportedBiometricMethods().then((result) => {
      if (active) {
        setMethods(result);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleActivate() {
    if (activating) {
      return;
    }
    setActivating(true);
    try {
      await enableBiometricAfterLogin();
    } finally {
      setActivating(false);
    }
  }

  async function handleDecline() {
    if (activating) {
      return;
    }
    await declineBiometricOptIn();
  }

  function goBack() {
    if (activating) {
      return;
    }
    void declineBiometricOptIn();
  }

  const isSupported = (kind: BiometricMethodKind) => methods.includes(kind);

  return (
    <AuthScaffold>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 32,
            paddingVertical: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={goBack}
              accessibilityRole="button"
              accessibilityLabel="Volver"
              disabled={activating}
              hitSlop={8}
              style={{ alignSelf: "flex-start", paddingVertical: 4 }}
            >
              <Text style={{ fontFamily: font.lato, fontSize: 16, color: COLOR.taupe }}>
                {"< Volver"}
              </Text>
            </Pressable>

            <View style={{ flex: 1, justifyContent: "center", gap: 24 }}>
              <View style={{ alignItems: "center", gap: 20 }}>
                <View
                  accessibilityLabel="Escudo del Gobierno del Estado de Yucatán"
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    borderWidth: 1,
                    borderColor: "rgba(201,168,84,0.3)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={64}
                    color={COLOR.dorado}
                  />
                </View>

                <Text
                  style={{
                    fontFamily: font["lato-bold"],
                    fontSize: 28,
                    lineHeight: 34,
                    color: COLOR.crema,
                    textAlign: "center",
                  }}
                >
                  Acceso rápido y seguro
                </Text>

                <Text
                  style={{
                    fontFamily: font.lato,
                    fontSize: 16,
                    lineHeight: 24,
                    color: COLOR.taupe,
                    textAlign: "center",
                  }}
                >
                  Active el acceso biométrico para ingresar a la app sin
                  contraseña, de forma segura cada vez.
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 16 }}>
                {METHOD_OPTIONS.map((option) => {
                  const supported = isSupported(option.key);
                  const selected = supported;
                  return (
                    <View
                      key={option.key}
                      style={[
                        {
                          flex: 1,
                          borderRadius: 24,
                          borderWidth: 1,
                          padding: 24,
                          alignItems: "center",
                          gap: 8,
                        },
                        selected
                          ? {
                              backgroundColor: COLOR.cardActive,
                              borderColor: COLOR.borderActive,
                            }
                          : {
                              backgroundColor: COLOR.cardInactive,
                              borderColor: "transparent",
                              opacity: 0.5,
                            },
                      ]}
                    >
                      <View style={{ alignItems: "center", gap: 6 }}>
                        <Ionicons
                          name={option.iconName}
                          size={48}
                          color={COLOR.dorado}
                        />
                        {selected ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color={COLOR.dorado}
                          />
                        ) : null}
                      </View>
                      <Text
                        style={{
                          fontFamily: font["lato-bold"],
                          fontSize: 16,
                          color: COLOR.crema,
                          textAlign: "center",
                        }}
                      >
                        {option.title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: font.lato,
                          fontSize: 14,
                          color: COLOR.taupeDim,
                          textAlign: "center",
                        }}
                      >
                        {option.subtitle}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={{ gap: 16 }}>
                {BENEFITS.map((benefit, index) => (
                  <View
                    key={`${benefit.iconName}-${index}`}
                    style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
                  >
                    <Ionicons name={benefit.iconName} size={20} color={COLOR.dorado} />
                    <Text
                      style={{
                        fontFamily: font.lato,
                        fontSize: 16,
                        color: COLOR.taupe,
                        flexShrink: 1,
                      }}
                    >
                      {benefit.text}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={{ gap: 12 }}>
                <GoldButton
                  loading={activating}
                  onPress={() => {
                    void handleActivate();
                  }}
                >
                  <GoldButtonText>ACTIVAR BIOMÉTRICO</GoldButtonText>
                </GoldButton>

                <Pressable
                  onPress={() => {
                    void handleDecline();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Ahora no"
                  disabled={activating}
                  style={{ paddingVertical: 8 }}
                >
                  <Text
                    style={{
                      fontFamily: font.lato,
                      fontSize: 16,
                      color: COLOR.taupe,
                      textAlign: "center",
                    }}
                  >
                    Ahora no
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthScaffold>
  );
}
