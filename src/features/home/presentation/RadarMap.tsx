import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import type { GeoPosition } from "../domain/entities/GeoPosition";
import type { MunicipioRadar } from "../domain/entities/MunicipioRadar";
import { radarPalette } from "@/shared/theme/tokens";
import type { RadarCameraRequest } from "./HomeProvider";

const FOCUS_LATITUDE_DELTA = 0.09;
const FOCUS_LONGITUDE_DELTA = 0.09;
const FOCUS_CENTER_OFFSET = 0.025;

export type RadarMapHandle = {
  getPointForCoordinate: (
    position: GeoPosition
  ) => Promise<{ x: number; y: number } | null>;
  focusOnPosition: (position: GeoPosition) => void;
};

type RadarMapProps = {
  municipios: MunicipioRadar[];
  gpsPosition: GeoPosition | null;
  cameraRequest: RadarCameraRequest | null;
  onMarkerPress: (nombre: string) => void;
  onRegionChangeComplete?: () => void;
};

function hasCoordinates(
  municipio: MunicipioRadar
): municipio is MunicipioRadar & { latitude: number; longitude: number } {
  return municipio.latitude !== null && municipio.longitude !== null;
}

export const RadarMap = forwardRef<RadarMapHandle, RadarMapProps>(
  function RadarMap(
    {
      municipios,
      gpsPosition,
      cameraRequest,
      onMarkerPress,
      onRegionChangeComplete,
    },
    ref
  ) {
    const mapRef = useRef<MapView | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        getPointForCoordinate: async (position) => {
          try {
            const point = await mapRef.current?.pointForCoordinate(position);
            return point ?? null;
          } catch {
            return null;
          }
        },
        focusOnPosition: (position) => {
          mapRef.current?.animateToRegion(
            {
              latitude: position.latitude + FOCUS_CENTER_OFFSET,
              longitude: position.longitude,
              latitudeDelta: FOCUS_LATITUDE_DELTA,
              longitudeDelta: FOCUS_LONGITUDE_DELTA,
            },
            600
          );
        },
      }),
      []
    );

    useEffect(() => {
      const map = mapRef.current;
      if (map === null || cameraRequest === null) {
        return;
      }

      if (cameraRequest.kind === "fit") {
        const coordinates = municipios.filter(hasCoordinates).map((m) => ({
          latitude: m.latitude,
          longitude: m.longitude,
        }));
        if (coordinates.length > 0) {
          map.fitToCoordinates(coordinates, {
            edgePadding: { top: 120, right: 60, bottom: 120, left: 60 },
            animated: true,
          });
        }
        return;
      }

      if (cameraRequest.kind === "gps") {
        map.animateToRegion(
          {
            latitude: cameraRequest.position.latitude,
            longitude: cameraRequest.position.longitude,
            latitudeDelta: 0.12,
            longitudeDelta: 0.12,
          },
          600
        );
        return;
      }

      const target = municipios.find((m) => m.nombre === cameraRequest.nombre);
      if (target !== undefined && hasCoordinates(target)) {
        map.animateToRegion(
          {
            latitude: target.latitude,
            longitude: target.longitude,
            latitudeDelta: 0.12,
            longitudeDelta: 0.12,
          },
          600
        );
      }
    }, [cameraRequest]);

    return (
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={false}
        showsCompass={false}
        toolbarEnabled={false}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {municipios.map((municipio) =>
          hasCoordinates(municipio) ? (
            <Marker
              key={municipio.nombre}
              coordinate={{
                latitude: municipio.latitude,
                longitude: municipio.longitude,
              }}
              pinColor={radarPalette.pin}
              onPress={() => onMarkerPress(municipio.nombre)}
            />
          ) : null
        )}
        {gpsPosition !== null ? (
          <Marker
            coordinate={gpsPosition}
            pinColor={radarPalette.pinGps}
            zIndex={1000}
          />
        ) : null}
      </MapView>
    );
  }
);
