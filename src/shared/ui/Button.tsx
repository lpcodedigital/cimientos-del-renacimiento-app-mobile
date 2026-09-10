import {
  Pressable,
  Text,
  type PressableProps,
  type TextProps,
} from "react-native";

type ButtonProps = Omit<PressableProps, "className"> & {
  variant?: "primary" | "secondary";
};

export function Button({
  variant = "primary",
  disabled = false,
  accessibilityRole = "button",
  ...props
}: ButtonProps) {
  const primaryClasses =
    "bg-guinda active:bg-dorado disabled:opacity-40";
  const secondaryClasses = "bg-superficie border border-guinda";

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      disabled={disabled}
      className={`min-h-11 items-center justify-center rounded-lg px-6 py-3 ${
        variant === "primary" ? primaryClasses : secondaryClasses
      }`}
      {...props}
    />
  );
}

type ButtonTextProps = TextProps & {
  variant?: "primary" | "secondary";
};

export function ButtonText({
  variant = "primary",
  ...props
}: ButtonTextProps) {
  const colorClass = variant === "primary" ? "text-superficie" : "text-guinda";
  return (
    <Text className={`font-lato-bold text-base ${colorClass}`} {...props} />
  );
}
