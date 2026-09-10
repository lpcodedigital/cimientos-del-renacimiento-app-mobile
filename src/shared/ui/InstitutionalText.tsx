import { Text, type TextProps } from "react-native";

type InstitutionalTextProps = TextProps & {
  variant?: "regular" | "bold";
};

export function InstitutionalText({
  variant = "regular",
  style,
  ...props
}: InstitutionalTextProps) {
  const fontClass = variant === "bold" ? "font-lato-bold" : "font-lato";
  return <Text className={fontClass} style={style} {...props} />;
}
