import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import {
  RADAR_ERROR_MESSAGES,
  type RadarError,
} from "../domain/errors/RadarError";
import type { GeoPosition } from "../domain/entities/GeoPosition";
import type { MunicipioRadar } from "../domain/entities/MunicipioRadar";
import { appPalette, fontFamily as font, palette } from "@/shared/theme/tokens";
import { DeviceMunicipioLabel } from "./DeviceMunicipioLabel";
import { MunicipioCallout } from "./MunicipioCallout";
import { RadarChipRow } from "./RadarChipRow";
import { RadarMap, type RadarMapHandle } from "./RadarMap";
import { RadarRipple } from "./RadarRipple";
import { RadarSearchBar } from "./RadarSearchBar";
import { useHomeRadar } from "./useHomeRadar";

const centeredOverlay = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  paddingHorizontal: 32,
};

const messageStyle = {
  fontFamily: font.lato,
  fontSize: 15,
  color: palette["texto-suave"],
  textAlign: "center" as const,
};

export function HomeScreen() {
  const {
    useCases,
    selectedChip,
    popupMunicipio,
    cameraRequest,
    gpsPosition,
    deviceMunicipio,
    requestMyLocation,
    selectMunicipioChip,
    openPopup,
    closePopup,
    requestInitialCamera,
  } = useHomeRadar();

  const mapRef = useRef<RadarMapHandle | null>(null);
  const [ripplePoint, setRipplePoint] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const { data, isLoading, isError, error } = useQuery<
    MunicipioRadar[],
    RadarError
  >({
    queryKey: ["radar", "mapa-home"],
    queryFn: () => useCases.loadRadarMap(),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (data === undefined) {
      return;
    }
    void requestInitialCamera(data.length > 0);
  }, [data, requestInitialCamera]);

  const handleMarkerPress = useCallback(
    (nombre: string) => {
      openPopup(nombre);
      const municipio = data?.find((m) => m.nombre === nombre);
      const map = mapRef.current;
      if (
        municipio === undefined ||
        municipio.latitude === null ||
        municipio.longitude === null ||
        map === null
      ) {
        setRipplePoint(null);
        return;
      }
      const position: GeoPosition = {
        latitude: municipio.latitude,
        longitude: municipio.longitude,
      };
      void map.getPointForCoordinate(position).then((point) => {
        setRipplePoint(point);
      });
    },
    [data, openPopup]
  );

  const handleClosePopup = useCallback(() => {
    closePopup();
    setRipplePoint(null);
  }, [closePopup]);

  const municipios = data ?? [];
  const popupData =
    popupMunicipio !== null
      ? municipios.find((m) => m.nombre === popupMunicipio)
      : undefined;
  const showEmpty =
    !isLoading && !isError && data !== undefined && data.length === 0;
  const errorMessage = error?.message ?? RADAR_ERROR_MESSAGES.radar_unavailable;

  return (
    <View style={{ flex: 1, backgroundColor: appPalette.crema }}>
      <RadarMap
        ref={mapRef}
        municipios={municipios}
        gpsPosition={gpsPosition}
        cameraRequest={cameraRequest}
        onMarkerPress={handleMarkerPress}
      />

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          gap: 10,
        }}
      >
        <RadarSearchBar />
        <View style={{ marginHorizontal: -16 }}>
          <RadarChipRow
            selectedChip={selectedChip}
            municipios={municipios}
            onSelectMyLocation={requestMyLocation}
            onSelectMunicipio={selectMunicipioChip}
          />
        </View>
        <DeviceMunicipioLabel deviceMunicipio={deviceMunicipio} />
        {popupData !== undefined ? (
          <MunicipioCallout municipio={popupData} onClose={handleClosePopup} />
        ) : null}
      </View>

      {popupMunicipio !== null && ripplePoint !== null ? (
        <RadarRipple point={ripplePoint} />
      ) : null}

      {isLoading ? (
        <View pointerEvents="none" style={centeredOverlay}>
          <ActivityIndicator color={palette.guinda} />
        </View>
      ) : null}

      {isError ? (
        <View pointerEvents="none" style={centeredOverlay}>
          <Text style={messageStyle}>{errorMessage}</Text>
        </View>
      ) : null}

      {showEmpty ? (
        <View pointerEvents="none" style={centeredOverlay}>
          <Text style={messageStyle}>
            Sin municipios con obras o capacitaciones.
          </Text>
        </View>
      ) : null}
    </View>
  );
}
