import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { fontFamily, palette } from "@/shared/theme/tokens";

import { openExternalMap } from "./openExternalMap";

type DetailMapCardProps = {
  latitude: number;
  longitude: number;
};

const mapContainerStyle = {
  borderRadius: 20,
  overflow: "hidden",
  height: 200,
} as const;

const mapStyle = {
  width: "100%",
  height: "100%",
} as const;

const recenterButtonStyle = {
  position: "absolute",
  right: 12,
  bottom: 12,
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: palette.superficie,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
} as const;

const openMapsRowStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  paddingVertical: 10,
} as const;

const openMapsTextStyle = {
  fontFamily: fontFamily["lato-bold"],
  color: palette.guinda,
  fontSize: 15,
} as const;

export function DetailMapCard({ latitude, longitude }: DetailMapCardProps) {
  const mapRef = useRef<MapView>(null);

  const handleRecenter = () => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      600,
    );
  };

  const handleOpenMaps = () => {
    void openExternalMap(latitude, longitude);
  };

  return (
    <View>
      <View style={mapContainerStyle}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          scrollEnabled
          zoomEnabled
          pitchEnabled={false}
          rotateEnabled={false}
          style={mapStyle}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            pinColor={palette.guinda}
          />
        </MapView>
        <Pressable
          onPress={handleRecenter}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Centrar ubicación"
          style={({ pressed }) => [
            recenterButtonStyle,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="locate" size={20} color={palette.guinda} />
        </Pressable>
      </View>
      <Pressable
        onPress={handleOpenMaps}
        accessibilityRole="button"
        accessibilityLabel="Abrir en Maps"
        style={({ pressed }) => [
          openMapsRowStyle,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Ionicons name="navigate-outline" size={20} color={palette.guinda} />
        <Text style={openMapsTextStyle}>Abrir en Maps</Text>
      </Pressable>
    </View>
  );
}
