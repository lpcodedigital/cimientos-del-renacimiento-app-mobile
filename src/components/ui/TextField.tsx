import { TextInput, View, type TextInputProps } from "react-native";
import { InstitutionalText } from "./InstitutionalText";

type TextFieldProps = Omit<TextInputProps, "className"> & {
  label: string;
  errorLabel?: string;
};

export function TextField({ label, errorLabel, ...props }: TextFieldProps) {
  const hasError = errorLabel !== undefined && errorLabel.length > 0;

  return (
    <View className="gap-2">
      <InstitutionalText
        variant="bold"
        className="font-lato-bold text-texto text-sm"
      >
        {label}
      </InstitutionalText>
      <TextInput
        className="rounded-lg border border-texto-suave bg-superficie px-4 py-3 font-lato text-texto text-base focus:border-guinda"
        placeholderTextColor="#5C534C"
        accessibilityLabel={label}
        {...props}
      />
      {hasError ? (
        <InstitutionalText className="font-lato text-error text-sm">
          {errorLabel}
        </InstitutionalText>
      ) : null}
    </View>
  );
}
