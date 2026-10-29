import { Alert, Linking, Platform } from "react-native";

const MAPS_ERROR_TITLE = "Mapas";
const MAPS_ERROR_MESSAGE = "No se encontró una aplicación de mapas disponible.";
const LABEL = "Ubicación";

async function canOpen(url: string): Promise<boolean> {
  try {
    return await Linking.canOpenURL(url);
  } catch {
    return false;
  }
}

function open(url: string): void {
  Linking.openURL(url).catch(() => {
    Alert.alert(MAPS_ERROR_TITLE, MAPS_ERROR_MESSAGE);
  });
}

export async function openExternalMap(
  latitude: number,
  longitude: number,
): Promise<void> {
  const label = encodeURIComponent(LABEL);

  if (Platform.OS === "android") {
    open(`geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`);
    return;
  }

  const canGoogle = await canOpen("comgooglemaps://");
  const canWaze = await canOpen("waze://");

  const buttons: Parameters<typeof Alert.alert>[2] = [
    {
      text: "Apple Maps",
      onPress: () =>
        open(`https://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`),
    },
  ];

  if (canGoogle) {
    buttons.push({
      text: "Google Maps",
      onPress: () =>
        open(
          `https://www.google.com/maps/search/?api=1&query=${latitude}%2C${longitude}`,
        ),
    });
  }

  if (canWaze) {
    buttons.push({
      text: "Waze",
      onPress: () =>
        open(`waze://?ll=${latitude},${longitude}&navigate=yes`),
    });
  }

  buttons.push({ text: "Cancelar", style: "cancel" });

  Alert.alert("Abrir en Maps", undefined, buttons);
}
