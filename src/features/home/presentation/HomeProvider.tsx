import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import type { HomeUseCases } from "../application/types";
import type { GeoPosition } from "../domain/entities/GeoPosition";

export type RadarCameraRequest =
  | { kind: "fit"; nonce: number }
  | { kind: "gps"; position: GeoPosition; nonce: number }
  | { kind: "municipio"; nombre: string; nonce: number };

export type HomeRadarState = {
  selectedChip: string | null;
  popupMunicipio: string | null;
  cameraRequest: RadarCameraRequest | null;
  gpsPosition: GeoPosition | null;
  deviceMunicipio: string | null;
  requestMyLocation: () => Promise<void>;
  selectMunicipioChip: (nombre: string) => void;
  openPopup: (nombre: string) => void;
  closePopup: () => void;
  requestInitialCamera: (hasCoordinates: boolean) => Promise<void>;
};

interface HomeContextValue extends HomeRadarState {
  useCases: HomeUseCases;
}

const HomeContext = createContext<HomeContextValue | undefined>(undefined);

export function HomeProvider({
  children,
  useCases,
}: PropsWithChildren<{ useCases: HomeUseCases }>) {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [popupMunicipio, setPopupMunicipio] = useState<string | null>(null);
  const [cameraRequest, setCameraRequest] =
    useState<RadarCameraRequest | null>(null);
  const [gpsPosition, setGpsPosition] = useState<GeoPosition | null>(null);
  const [deviceMunicipio, setDeviceMunicipio] = useState<string | null>(null);
  const nonceRef = useRef(0);
  const initialCameraRequested = useRef(false);

  const nextNonce = useCallback(() => {
    nonceRef.current += 1;
    return nonceRef.current;
  }, []);

  const focusOnGps = useCallback(
    async (position: GeoPosition) => {
      setGpsPosition(position);
      setCameraRequest({ kind: "gps", position, nonce: nextNonce() });
      const municipio = await useCases.resolveDeviceMunicipio(position);
      setDeviceMunicipio(municipio);
    },
    [useCases, nextNonce]
  );

  const requestMyLocation = useCallback(async () => {
    const position = await useCases.requestLocationAccess();
    if (position === null) {
      return;
    }
    setSelectedChip("MI_UBICACION");
    await focusOnGps(position);
  }, [useCases, focusOnGps]);

  const selectMunicipioChip = useCallback(
    (nombre: string) => {
      setSelectedChip(nombre);
      setCameraRequest({ kind: "municipio", nombre, nonce: nextNonce() });
    },
    [nextNonce]
  );

  const openPopup = useCallback((nombre: string) => {
    setPopupMunicipio(nombre);
  }, []);

  const closePopup = useCallback(() => {
    setPopupMunicipio(null);
  }, []);

  const requestInitialCamera = useCallback(
    async (hasCoordinates: boolean) => {
      if (initialCameraRequested.current) {
        return;
      }
      initialCameraRequested.current = true;
      const position = await useCases.getCurrentLocation();
      if (position !== null) {
        await focusOnGps(position);
        return;
      }
      if (hasCoordinates) {
        setCameraRequest({ kind: "fit", nonce: nextNonce() });
      }
    },
    [useCases, focusOnGps, nextNonce]
  );

  const value = useMemo<HomeContextValue>(
    () => ({
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
    }),
    [
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
    ]
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}

export function useHomeRadar(): HomeContextValue {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useHomeRadar debe usarse dentro de un HomeProvider.");
  }
  return context;
}
