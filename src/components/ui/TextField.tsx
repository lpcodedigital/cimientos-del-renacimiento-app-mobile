import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

type TextFieldProps = Omit<TextInputProps, "className"> & {
  label: string;
  errorLabel?: string;
  secureToggle?: boolean;
};

export function TextField({
  label,
  errorLabel,
  secureToggle = false,
  ...props
}: TextFieldProps) {
  const [isSecure, setIsSecure] = useState(true);
  const hasError = errorLabel !== undefined && errorLabel.length > 0;

  const toggleSecure = () => setIsSecure((current) => !current);

  return (
    <View className="gap-2">
      <Text className="font-lato-bold text-xs uppercase tracking-widest text-auth-taupe">
        {label}
      </Text>
      <View>
        <TextInput
          {...props}
          secureTextEntry={secureToggle && isSecure}
          placeholderTextColor="#A58571"
          accessibilityLabel={
            props.accessibilityLabel !== undefined ? props.accessibilityLabel : label
          }
          className={`h-14 w-full rounded-2xl border bg-auth-surface px-5 pr-12 font-lato text-base text-auth-crema focus:border-auth-dorado ${
            hasError ? "border-error" : "border-auth-surface-border"
          }`}
        />
        {secureToggle ? (
          <Pressable
            onPress={toggleSecure}
            accessibilityRole="button"
            accessibilityLabel={isSecure ? "Mostrar contraseña" : "Ocultar contraseña"}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
            hitSlop={8}
          >
            <Ionicons name={isSecure ? "eye" : "eye-off"} size={22} color="#A58571" />
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <Text className="font-lato text-xs text-error mt-1">{errorLabel}</Text>
      ) : null}
    </View>
  );
}
