import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { palette } from "@/shared/theme/tokens";

type DetailMapCardProps = {
  latitude: number;
  longitude: number;
};

const containerStyle = {
  borderRadius: 20,
  overflow: "hidden",
  height: 200,
} as const;

const mapStyle = {
  width: "100%",
  height: "100%",
} as const;

export function DetailMapCard({ latitude, longitude }: DetailMapCardProps) {
  return (
    <View style={containerStyle}>
      <MapView
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
    </View>
  );
}
