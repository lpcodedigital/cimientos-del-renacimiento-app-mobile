import { Text, View } from "react-native";

export function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-fondo px-8">
      <Text className="font-lato-bold text-guinda text-3xl">
        Gabinete Móvil
      </Text>
      <Text className="mt-2 font-lato text-texto-suave text-base">
        Gobierno del Estado de Yucatán
      </Text>
    </View>
  );
}
