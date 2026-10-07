# PLAN — radar-home

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 2b — Radar Territorial
**Feature:** `radar-home`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** LISTO PARA EL TRABAJADOR **solo cuando el Humano apruebe `spec.md` y autorice TASK-01**
**Fecha:** 2026-10-06

> Fuente de verdad técnica. Únicas dependencias nuevas: `react-native-maps` + `expo-location` (vía `npx expo install`). Cero código nativo a mano. Cero fixture de datos. DIP/fences 1.5b intactos.

---

## 1. Hallazgos de repositorio (baseline 2a)

Verificado por el Orquestador el 2026-10-06:

- `RootNavigator.tsx`: AppStack con `headerShown: false`, pantalla única `HomePlaceholder`, envuelto en `<AppShell>`. `NavigationContainer key={status}`.
- `HomePlaceholderScreen.tsx`: saludo + copy de radar aplazado, fondo `bg-app-crema`. Se **elimina** en TASK-05.
- `compositionRoot.ts`: solo cablea auth (`createAuthUseCases`). Se **extiende** con `createHomeUseCases` en TASK-03.
- `App.tsx`: `QueryClientProvider` → `AuthProvider` → `RootNavigator`. Se añade `HomeProvider` en TASK-03.
- Fences ESLint `no-restricted-imports`: domain / application / presentation+navigation+shared-ui. Se añaden `expo-location` y `react-native-maps` a los bans en TASK-03.
- `axiosClient` (shared/infrastructure/http) ya inyecta Bearer vía interceptor. `baseURL = EXPO_PUBLIC_API_URL`.
- `react-native-maps` y `expo-location` **no** están en `package.json` (se instalan en TASK-01).
- `react-native-reanimated@4.5.1` ya instalado (peer de NativeWind v5) — el ripple lo usa, **no** se añade nada.
- `@tanstack/react-query@^5.102.8` ya instalado y con `QueryClientProvider` activo.
- Context7 (2026-10-06): `Marker` soporta `pinColor` + `onPress`; `MapView` expone `animateToRegion`, `fitToCoordinates`, `pointForCoordinate`. `expo-location`: `getForegroundPermissionsAsync`, `requestForegroundPermissionsAsync`, `getCurrentPositionAsync`, `reverseGeocodeAsync`; config plugin con `locationWhenInUsePermission`.

---

## 2. Árbol destino (2b)

```
global.css                                              # + --color-radar-* (TASK-01)
src/shared/theme/tokens.ts                              # + radarPalette (TASK-01)
package.json / package-lock.json / app.json             # deps + plugins (TASK-01)

src/features/home/domain/entities/GeoPosition.ts        # TASK-02
src/features/home/domain/entities/MunicipioRadar.ts     # TASK-02
src/features/home/domain/errors/RadarError.ts           # TASK-02
src/features/home/domain/ports/RadarMapRepository.ts    # TASK-02
src/features/home/domain/ports/LocationGateway.ts       # TASK-02
src/features/home/application/types.ts                  # TASK-02
src/features/home/application/loadRadarMap.ts           # TASK-02
src/features/home/application/getCurrentLocation.ts     # TASK-02
src/features/home/application/requestLocationAccess.ts  # TASK-02
src/features/home/application/resolveDeviceMunicipio.ts # TASK-02

src/features/home/infrastructure/dto.ts                 # TASK-03
src/features/home/infrastructure/AxiosRadarMapApi.ts    # TASK-03
src/features/home/infrastructure/ExpoLocationGateway.ts # TASK-03
src/app/compositionRoot.ts                              # TASK-03 (+ createHomeUseCases)
src/features/home/presentation/HomeProvider.tsx         # TASK-03
App.tsx                                                 # TASK-03 (+ HomeProvider)
eslint.config.js                                        # TASK-03 (+ bans location/maps)

src/features/home/presentation/RadarSearchBar.tsx       # TASK-04
src/features/home/presentation/RadarChipRow.tsx         # TASK-04
src/features/home/presentation/DeviceMunicipioLabel.tsx # TASK-04
src/features/home/presentation/RadarMap.tsx             # TASK-04
src/features/home/presentation/RadarRipple.tsx          # TASK-04
src/features/home/presentation/MunicipioCallout.tsx     # TASK-04
src/features/home/presentation/HomeScreen.tsx           # TASK-04

src/app/navigation/types.ts                             # TASK-05 (Home)
src/app/navigation/RootNavigator.tsx                    # TASK-05 (HomeScreen)
src/features/home/presentation/HomePlaceholderScreen.tsx # TASK-05 (borrado)
```

Prohibido tocar `src/features/auth/**`, `src/features/app-shell/**`. Prohibido `index.ts` barrels.

---

## 3. Tokens (TASK-01)

### 3.1 `global.css` — añadir dentro de `@theme` existente (no borrar Fase 1 / auth / app)

```css
--color-radar-surface: #ffffff;
--color-radar-chip: #c3cec0;
--color-radar-chip-active: #c67e33;
--color-radar-popup-header: #d6ded1;
--color-radar-popup-body: #d8dac9;
```

`radar-pin` / `radar-pin-gps` reusan `--color-guinda` / `--color-dorado` existentes (no se duplican en CSS). `radar-ripple` es opacidad dinámica → inline JS (mismo precedente que `appPalette.overlay`).

### 3.2 `src/shared/theme/tokens.ts` — añadir **sin modificar** `palette`, `fontFamily`, `authPalette`, `appPalette`

```ts
export const radarPalette = {
  surface: "#FFFFFF",
  chip: "#C3CEC0",
  chipActive: "#C67E33",
  popupHeader: "#D6DED1",
  popupBody: "#D8DAC9",
  pin: "#6B142E",
  pinGps: "#C4A35A",
  ripple: "rgba(196,163,90,0.35)",
} as const;
```

### 3.3 Dependencias y `app.json` (TASK-01 — gate Humano)

- `npx expo install react-native-maps expo-location` (NUNCA `npm i`).
- `app.json` plugins += `["expo-location", { "locationWhenInUsePermission": "El Gabinete Móvil usa tu ubicación para centrar el radar territorial y mostrar el municipio donde te encuentras." }]`.
- `app.json` `android.config.googleMaps.apiKey` = **la key que el Humano entrega al autorizar TASK-01**. El agente la coloca; no inventa ni genera keys. iOS no lleva key (MapKit).
- Cero otro cambio en `app.json`. Rebuild nativo = Humano.

---

## 4. Domain (TASK-02) — firmas verbatim

### 4.1 `domain/entities/GeoPosition.ts`

```ts
export type GeoPosition = {
  latitude: number;
  longitude: number;
};
```

### 4.2 `domain/entities/MunicipioRadar.ts`

```ts
export type MunicipioRadar = {
  nombre: string;
  totalObras: number;
  totalCursos: number;
  totalInversion: number;
  obrasFinalizadas: number;
  obrasEnProceso: number;
  latitude: number | null;
  longitude: number | null;
};
```

### 4.3 `domain/errors/RadarError.ts`

```ts
export type RadarErrorKind = "radar_unavailable";

export type RadarError = {
  kind: RadarErrorKind;
  message: string;
};

export const RADAR_ERROR_MESSAGES: Record<RadarErrorKind, string> = {
  radar_unavailable: "No se pudo cargar el radar territorial.",
};

export function radarError(kind: RadarErrorKind): RadarError {
  return { kind, message: RADAR_ERROR_MESSAGES[kind] };
}
```

### 4.4 `domain/ports/RadarMapRepository.ts`

```ts
import type { MunicipioRadar } from "../entities/MunicipioRadar";

export interface RadarMapRepository {
  listMunicipios(): Promise<MunicipioRadar[]>;
}
```

### 4.5 `domain/ports/LocationGateway.ts`

```ts
import type { GeoPosition } from "../entities/GeoPosition";

export type LocationPermissionStatus = "granted" | "denied" | "undetermined";

export interface LocationGateway {
  getForegroundPermission(): Promise<LocationPermissionStatus>;
  requestForegroundPermission(): Promise<LocationPermissionStatus>;
  getCurrentPosition(): Promise<GeoPosition | null>;
  reverseGeocodeMunicipio(position: GeoPosition): Promise<string | null>;
}
```

Reglas domain: cero imports de `react`, `react-native`, `expo-*`, `axios`, `@tanstack/*`, `react-native-maps`, `@/shared`, `@/app`, capas hermanas. Solo imports relativos. Cero comentarios.

---

## 5. Application (TASK-02) — firmas verbatim

### 5.1 `application/types.ts`

```ts
import type { GeoPosition } from "../domain/entities/GeoPosition";
import type { MunicipioRadar } from "../domain/entities/MunicipioRadar";

export interface HomeUseCases {
  loadRadarMap: () => Promise<MunicipioRadar[]>;
  getCurrentLocation: () => Promise<GeoPosition | null>;
  requestLocationAccess: () => Promise<GeoPosition | null>;
  resolveDeviceMunicipio: (position: GeoPosition) => Promise<string | null>;
}
```

### 5.2 Use cases (closures)

- `loadRadarMap.ts` → `createLoadRadarMap(deps: { radarMapRepository: RadarMapRepository }): HomeUseCases["loadRadarMap"]` → `return () => deps.radarMapRepository.listMunicipios();` (deja subir `RadarError` sin `catch`).
- `getCurrentLocation.ts` → `createGetCurrentLocation(deps: { locationGateway: LocationGateway })`: si `getForegroundPermission() !== "granted"` → `null` (**sin prompt**); si granted → `getCurrentPosition()`.
- `requestLocationAccess.ts` → `createRequestLocationAccess(deps: { locationGateway: LocationGateway })`: `requestForegroundPermission()`; si `"granted"` → `getCurrentPosition()`; en otro caso → `null`.
- `resolveDeviceMunicipio.ts` → `createResolveDeviceMunicipio(deps: { locationGateway: LocationGateway })` → `(position) => deps.locationGateway.reverseGeocodeMunicipio(position)`.

Reglas application: solo imports `../domain/...` y `./types`. Cero React/Expo/Axios/Query.

---

## 6. Infrastructure (TASK-03) — firmas verbatim

### 6.1 `infrastructure/dto.ts` (wire espejo, cero `any`)

```ts
export type MunicipioResumenDTO = {
  municipio: string;
  totalObras: number;
  totalCursos: number;
  totalInversion: number;
  obrasFinalizadas: number;
  obrasEnProceso: number;
  latitude: number | null;
  longitude: number | null;
};
```

### 6.2 `infrastructure/AxiosRadarMapApi.ts`

```ts
export function createAxiosRadarMapApi(): RadarMapRepository;
```

- `axiosClient.get<MunicipioResumenDTO[]>("/api/v1/dashboard/mapa-home")`.
- Mapper 1:1: `nombre: dto.municipio`; el resto de campos copia directa. Sin reconciliar sumas. Sin filtrar `VARIOS`.
- `catch`: si el error ya es `RadarError` → rethrow; cualquier `AxiosError`/red/timeout/5xx/4xx → `throw radarError("radar_unavailable")`. Cero logs de token/payload.

### 6.3 `infrastructure/ExpoLocationGateway.ts`

```ts
export function createExpoLocationGateway(): LocationGateway;
```

- `getForegroundPermission` → `Location.getForegroundPermissionsAsync()` → mapea `Location.PermissionStatus` a `LocationPermissionStatus` (`GRANTED`→`"granted"`, `DENIED`→`"denied"`, resto→`"undetermined"`).
- `requestForegroundPermission` → `Location.requestForegroundPermissionsAsync()` → mismo mapeo.
- `getCurrentPosition` → `Location.getCurrentPositionAsync({})` → `{ latitude: coords.latitude, longitude: coords.longitude }`; `try/catch` → `null`.
- `reverseGeocodeMunicipio` → `Location.reverseGeocodeAsync(position)` → primer resultado: `city ?? subregion ?? region ?? null`; `try/catch` → `null`.

### 6.4 `src/app/compositionRoot.ts` — añadir (conservar auth intacto)

```ts
export function createHomeUseCases(): HomeUseCases {
  const radarMapRepository = createAxiosRadarMapApi();
  const locationGateway = createExpoLocationGateway();
  return {
    loadRadarMap: createLoadRadarMap({ radarMapRepository }),
    getCurrentLocation: createGetCurrentLocation({ locationGateway }),
    requestLocationAccess: createRequestLocationAccess({ locationGateway }),
    resolveDeviceMunicipio: createResolveDeviceMunicipio({ locationGateway }),
  };
}
```

### 6.5 `eslint.config.js` — añadir a los patrones existentes (sin paquete nuevo)

- Bloque `domain/**`: += `"expo-location"`, `"react-native-maps"`.
- Bloque `application/**`: += `"expo-location"`, `"react-native-maps"`.
- Bloque `presentation/**` + `navigation/**` + `shared/ui/**`: += `"expo-location"`. (`react-native-maps` **permitido** aquí: es UI.)

### 6.6 `App.tsx` — wiring

```tsx
const homeUseCases = createHomeUseCases();
// ...
<AuthProvider useCases={authUseCases}>
  <HomeProvider useCases={homeUseCases}>
    <RootNavigator />
    <StatusBar style="light" />
  </HomeProvider>
</AuthProvider>
```

---

## 7. `HomeProvider.tsx` (TASK-03) — presentation, use cases por props

Estado UI del radar (cero estado de servidor; eso es TanStack Query en `HomeScreen`):

```ts
export type RadarCameraRequest =
  | { kind: "fit"; nonce: number }
  | { kind: "gps"; position: GeoPosition; nonce: number }
  | { kind: "municipio"; nombre: string; nonce: number };

export type HomeRadarState = {
  selectedChip: string | null;        // "MI_UBICACION" | nombre de municipio | null
  popupMunicipio: string | null;      // nombre del municipio con popup abierto
  cameraRequest: RadarCameraRequest | null;
  gpsPosition: GeoPosition | null;
  deviceMunicipio: string | null;     // null = "—"
  requestMyLocation: () => Promise<void>;
  selectMunicipioChip: (nombre: string) => void;
  openPopup: (nombre: string) => void;
  closePopup: () => void;
  requestInitialCamera: (hasCoordinates: boolean) => Promise<void>;
};
```

- `requestInitialCamera(hasCoordinates)`: `getCurrentLocation()`; si posición → `cameraRequest {kind:"gps"}` + `gpsPosition` + `deviceMunicipio` (vía `resolveDeviceMunicipio`); si `null` y `hasCoordinates` → `cameraRequest {kind:"fit"}`. Se invoca una sola vez tras el primer `data` del query (guard con `useRef`).
- `requestMyLocation()`: `requestLocationAccess()`; si posición → chip `"MI_UBICACION"` seleccionado + `cameraRequest {kind:"gps"}` + `gpsPosition` + `deviceMunicipio`; si `null` → nada (chip queda sin seleccionar).
- `selectMunicipioChip(nombre)`: `selectedChip = nombre` + `cameraRequest {kind:"municipio"}`. **No** toca popup.
- `openPopup(nombre)` / `closePopup()`: solo popup. No toca chips.
- `nonce` incremental para re-disparar el efecto de cámara con el mismo destino.
- `HomeProvider` recibe `useCases: HomeUseCases` por props (mismo patrón que `AuthProvider`). Hook consumidor: `useHomeRadar()` en `presentation/useHomeRadar.ts`, que reexpone el estado, las acciones **y** `useCases` (fachada única — calco de `useAuth` en 1.5b; los componentes de presentation jamás reciben use cases por otro camino).

---

## 8. Componentes UI (TASK-04)

Estilos **inline JS** con `radarPalette` / `appPalette` / `palette` / `fontFamily` (precedente NativeWind v5 iOS). Solo `Pressable`. `StyleSheet` solo para `absoluteFill`/hairline justificados. Cero `className` en archivos nuevos. Ternarios/`!!`, nunca `&&` con strings/números. Cero emojis.

### 8.1 `RadarSearchBar.tsx`

- `View` pill: fondo `radarPalette.surface`, `borderRadius 24`, padding vertical 12 / horizontal 16, sombra CSS `boxShadow` sutil, `marginTop` negativo para solapar la franja guinda (ajuste fino en validación visual; punto de partida `-28`).
- Fila: Ionicons `search` (20, `palette["texto-suave"]`) + `Text` 2 líneas verbatim spec §4.5 (`fontFamily["lato-bold"]`, 13, `palette.texto`, `textTransform: "uppercase"`).
- **No editable, no interactivo:** es `View` + `Text`, cero `TextInput`, cero `Pressable`. `accessibilityLabel="Buscar (disponible en la siguiente fase)"`.

### 8.2 `RadarChipRow.tsx`

- `ScrollView horizontal` `showsHorizontalScrollIndicator={false}`, `contentContainerStyle` con padding horizontal 16 + `gap 8`.
- Primer chip fijo «MI UBICACIÓN»: icono Ionicons `location` (14, blanco) + label `MI UBICACIÓN`. Activo si `selectedChip === "MI_UBICACION"`.
- Chips de municipios en el orden del array del query. Label = Title Case (helper §8.7). Activo si `selectedChip === nombre` (comparación contra el nombre crudo del DTO).
- Chip activo: fondo `radarPalette.chipActive`, texto `#FFFFFF` bold. Inactivo: fondo `radarPalette.chip`, texto `palette.texto` `fontFamily.lato`. `Pressable` con `pressed` → `opacity 0.8`. `accessibilityRole="button"`.

### 8.3 `DeviceMunicipioLabel.tsx`

- Pill `radarPalette.surface` (radio 20, padding 10/14, sombra sutil), fila: Ionicons `location` (18, `radarPalette.pin`) + `Text` (`fontFamily["lato-bold"]`, 15, `palette.texto`): `deviceMunicipio ?? "—"`.

### 8.4 `RadarMap.tsx`

- `MapView` con `ref`, `style` `flex: 1`, `provider` por defecto (iOS MapKit; Android Google vía key de `app.json`). `showsUserLocation={false}` (el pin dorado es propio), `showsCompass={false}`, `toolbarEnabled={false}`.
- Props: `municipios: MunicipioRadar[]`, `gpsPosition: GeoPosition | null`, `cameraRequest`, `onMarkerPress(nombre)`.
- Pines: `Marker` nativo con `pinColor={radarPalette.pin}` (cero children custom → cero `tracksViewChanges`). `key = nombre`, `coordinate` de lat/lng, `onPress={() => onMarkerPress(nombre)}`. Municipios con `latitude/longitude === null` **no** pintan pin.
- Pin GPS: si `gpsPosition` → `Marker` `pinColor={radarPalette.pinGps}`, `zIndex` alto, sin `onPress`.
- Efecto de cámara sobre `cameraRequest` (deps `[cameraRequest]`):
  - `"fit"` → `ref.current?.fitToCoordinates(coords, { edgePadding: {top:120,right:60,bottom:120,left:60}, animated: true })`.
  - `"gps"` / `"municipio"` → `animateToRegion({ latitude, longitude, latitudeDelta: 0.12, longitudeDelta: 0.12 }, 600)`.
  - `"municipio"` sin coordenadas (lat/lng null) → no-op.
- Expone `getPointForCoordinate(position: GeoPosition): Promise<{x:number;y:number} | null>` vía `ref` al padre (para el ripple) mediante `useImperativeHandle` + `pointForCoordinate`, `try/catch` → `null`.

### 8.5 `RadarRipple.tsx`

- Overlay absoluto (hermano del mapa, `pointerEvents="none"`). Al abrir popup: el padre obtiene el punto de pantalla vía `getPointForCoordinate` y lo pasa como prop `point: {x,y} | null`.
- 3 `Animated.View` (Reanimated) círculos (tamaño base 48/88/128, `borderRadius` mitad, `borderWidth 2`, `borderColor radarPalette.ripple`), centrados en `point`.
- Animación con shared values: `scale` 0.3→1 y `opacity` 0.9→0, `withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.ease) }), -1, false)`, delays escalonados 0/220/440 ms. Solo `transform`/`opacity` (regla `animation-gpu-properties`). `.get()/.set()` no aplica (sin React Compiler); usar API estándar de Reanimated 4.
- Se monta solo cuando hay popup abierto y `point !== null`; al cerrar popup se desmonta. Si el usuario mueve el mapa con el popup abierto, el anillo queda en el último punto (desviación aceptada y documentada en task.md; el ripple se reproduce al seleccionar).

### 8.6 `MunicipioCallout.tsx`

- Overlay absoluto centrado horizontalmente, `top` ≈ 16 bajo la etiqueta dispositivo, ancho ~88% (máx 340), zIndex sobre el mapa.
- Card: cabecera `radarPalette.popupHeader` (fila: Ionicons `location-outline` 22 `palette.texto` + nombre **en mayúsculas del DTO** `fontFamily["lato-bold"]` 20 + `Pressable` `X` Ionicons `close` 20 `palette.texto` a la derecha, hitSlop 12, `accessibilityLabel="Cerrar"`).
- Cuerpo `radarPalette.popupBody`: fila de 3 columnas flex 1 con hairlines verticales (`borderLeftWidth: StyleSheet.hairlineWidth`, color `rgba(0,0,0,0.12)` en columnas 2 y 3):
  - Col 1: `{formatMdp(totalInversion)}` bold 18 + `Inversión total` 11.
  - Col 2: `{totalObras}` bold 18 + `Obras ({obrasEnProceso} en proceso, {obrasFinalizadas} concluidas)` 11.
  - Col 3: `{totalCursos}` bold 18 + `Capacitaciones` 11.
- Cola: triángulo centrado abajo (view con `transform rotate 45deg`, fondo `popupBody`, 16×16, marginBottom -8).
- Botón `Ver más`: `Pressable` outline (borde `palette.guinda`, texto `fontFamily["lato-bold"]` guinda, radio 999, padding 10), `pressed` → opacity 0.8, **no-op** (`onPress` vacío tipado), `accessibilityLabel="Ver más (disponible en la siguiente fase)"`.
- Datos: el componente recibe `municipio: MunicipioRadar` (objeto estable del array del query; cero cómputo de datos dentro salvo formatos puros).

### 8.7 Helpers de presentation (en `HomeScreen.tsx` o módulo propio `presentation/format.ts`)

```ts
const mdpFormatter = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 });

export function formatMdp(totalInversion: number): string {
  return `${mdpFormatter.format(totalInversion / 1_000_000)} MDP`;
}

export function toTitleCase(nombre: string): string {
  return nombre
    .toLocaleLowerCase("es-MX")
    .replace(/(^|\s)(\p{L})/gu, (match) => match.toLocaleUpperCase("es-MX"));
}
```

### 8.8 `HomeScreen.tsx`

- `const { useCases } = useHomeRadar()` → `useQuery({ queryKey: ["radar", "mapa-home"], queryFn: () => useCases.loadRadarMap(), staleTime: 60_000 })`. Fachada única: los use cases llegan **solo** por `useHomeRadar()` (plan §7); prohibido pasarlos por props al screen.
- Layout: `View flex:1` (fondo `appPalette.crema` detrás por si el mapa tarda) → `RadarMap` (flex 1) → overlay absoluto superior: `RadarSearchBar`, `RadarChipRow`, `DeviceMunicipioLabel` (columna con gap 10, padding horizontal 16) → `MunicipioCallout` si `popupMunicipio` (lookup por nombre en `data`) → `RadarRipple` si popup abierto.
- `requestInitialCamera(data.length > 0)` una vez cuando `data` llega por primera vez (ref guard).
- Estados: `isLoading` → mapa + `ActivityIndicator` guinda centrado; `isError` → mapa vacío + `Text` `error.message` (del `RadarError`, fallback `RADAR_ERROR_MESSAGES.radar_unavailable`) centrado sobre el mapa; `data` vacío → mapa con mensaje «Sin municipios con obras o capacitaciones.» (copy institucional, `font-lato`, `texto-suave`).
- Al `openPopup(nombre)`: resolver punto de pantalla para el ripple vía ref del mapa (async; si `null`, popup abre igual sin anillos).

---

## 9. Wire navegación (TASK-05)

- `navigation/types.ts`: `AppStackParamList = { Home: undefined }` (eliminar `HomePlaceholder`).
- `RootNavigator.tsx`: `import { HomeScreen } from "@/features/home/presentation/HomeScreen";` → `<AppStack.Screen name="Home" component={HomeScreen} />`. `AppShell`, `NavigationContainer key={status}`, Auth stack **intactos**.
- Borrar `HomePlaceholderScreen.tsx` (`git rm`).
- Chrome 2a: cero cambios (CA-07).

---

## 10. Apéndice — JSON de referencia del backend (para el Revisor; NO es fixture de código)

Respuesta real de muestra `GET /api/v1/dashboard/mapa-home` (2026-10-06, 22 municipios): CHANKOM (1 obra, $1,909,998.42, 20.4833/-88.6667), UMÁN (1 curso), DZAN (1 obra, $4,196,344.65), HOMUN (1 obra, $1,469,615.36), CONKAL (1 obra, $2,008,632.74), KANASIN (3 obras, $30,316,028.91, 1 fin + 1 proc), DZONCAUICH (1 obra, $3,771,668.10), CANSAHCAB (1 curso), CHIKINDZONOT (1 obra, $2,351,923.78), VALLADOLID (1 obra, $1,352,927.49), MÉRIDA (9 obras, $52,099,566.74), IZAMAL (11 cursos), MOCOCHÁ (1 obra, $2,253,893.21), TEMOZÓN (1 obra, $3,233,131.13), TIXPÉHUAL (1 curso), SUCILÁ (1 obra, $7,097,840.11), TINUM (1 obra, $2,350,321.65), PROGRESO (1 obra, $1,861,766.55), HALACHÓ (1 obra, $2,154,466.41), TELCHAC PUEBLO (1 obra, $1,420,867.97), VARIOS (2 obras, $22,711,500.00), PANABÁ (1 obra, $3,942,956.01). El JSON íntegro está en la conversación de orquestación 2026-10-06; el Revisor valida el mapeo DTO→UI contra él (p. ej. MÉRIDA → `52.1 MDP`).

Casos borde a verificar en QA: `totalInversion: 0` → `0 MDP`; `totalObras ≠ obrasEnProceso + obrasFinalizadas` (KANASIN, MÉRIDA, VALLADOLID, VARIOS) → se muestra tal cual; municipio solo con cursos (UMÁN, IZAMAL) → pin guinda igual.

---

## 11. Fuera de alcance (Fase 3 / 4)

Búsqueda funcional, autocompletado, FlashList, explorador. Detalle de municipio (`Ver más` real), ficha de obra/curso, Cloudflare Images, colores de pin por tipo. No se redacta plan de Fase 3 aquí.

---

## 12. Skills aplicables (`.agents/skills/vercel-react-native-skills`)

| Skill | Aplicación en 2b |
| --- | --- |
| `ui-pressable` | Chips, `X`, `Ver más`: solo `Pressable` con feedback `pressed` |
| `rendering-no-falsy-and` | Ternarios/`!!` en todo el radar (popup, etiqueta `—`, pin GPS, estados del query) |
| `animation-gpu-properties` | Ripple: solo `transform` (scale) + `opacity`; prohibido animar width/height/radius |
| `js-hoist-intl` | `mdpFormatter` en module scope de `format.ts` |
| `react-state-minimize` | `HomeProvider` solo estado UI; servidor = TanStack Query; cero duplicados |
| `navigation-native-navigators` | AppStack native-stack intacto; cero navegadores JS nuevos |
| `ui-measure-views` | `onLayout`/ref del mapa si hiciera falta medir; nunca `measure()` en render |

## 13. Criterio de "hecho" técnico

Fase 2b lista para el Tester Visual Humano cuando:

1. CA-08…10 del spec en verde (agente: arnés, deps, contrato).
2. Árbol destino §2 poblado; `HomePlaceholderScreen.tsx` eliminado; chrome 2a y auth con diff vacío.
3. Firmas §4–§7 y contrato spec §4.6 intactos por inspección.
4. `progress/current-task.json` → TASK-06 `READY_FOR_REVIEW`.
5. Fase 3 **no** iniciada.
