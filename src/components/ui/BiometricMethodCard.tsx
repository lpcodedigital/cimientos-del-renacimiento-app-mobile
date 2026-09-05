import { Ionicons } from "@expo/vector-icons";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

type BiometricMethodCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
};

export function BiometricMethodCard({
  icon,
  title,
  subtitle,
  selected,
}: BiometricMethodCardProps) {
  const surfaceClass = selected
    ? "bg-auth-card-active border-auth-dorado"
    : "bg-auth-card-inactive border-transparent";

  return (
    <View
      accessibilityState={{ selected }}
      className={`rounded-3xl border p-6 items-center gap-2 ${surfaceClass}`}
    >
      {icon}
      {selected ? (
        <Ionicons
          name="checkmark-circle"
          size={18}
          color="#C9A854"
          accessibilityLabel="Seleccionado"
        />
      ) : null}
      <Text className="font-lato-bold text-auth-crema uppercase">{title}</Text>
      <Text className="font-lato text-sm text-auth-taupe-dim text-center">
        {subtitle}
      </Text>
    </View>
  );
}
