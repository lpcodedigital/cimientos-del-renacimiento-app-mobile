# PLAN — nav-back-mapa-tools (Fase 4.5)

> Fuente de verdad técnica. Snippets verbatim: el Trabajador los copia tal cual (salvo marcadores `/* … intacto … */`). Spec de producto: `spec.md`. Lista de archivos permitidos: `task.md`.

## 1. Árbol de archivos afectados

```
package.json                                            [EDIT TASK-01: +expo-dev-client]
app.json                                                [EDIT TASK-01: +ios.infoPlist.LSApplicationQueriesSchemes]
src/features/app-shell/presentation/
├── HeaderTitleProvider.tsx                             [EDIT TASK-02: +leftMode]
├── useHeaderTitle.ts                                   [EDIT TASK-02: docstring tipo; sin cambio real de firma]
└── AppHeader.tsx                                       [EDIT TASK-02: ternario back/menu]
src/features/home/presentation/HomeScreen.tsx           [EDIT TASK-02: +setLeftMode("menu")]
src/features/search/presentation/SearchScreen.tsx       [EDIT TASK-02: +setLeftMode("back"), −fila back del cuerpo]
src/features/detail/presentation/
├── DetailScreen.tsx                                    [EDIT TASK-02: +setLeftMode("back"), −fila back del cuerpo]
├── DetailMapCard.tsx                                   [EDIT TASK-03: +ref, +botón recentrar, +fila Abrir en Maps]
└── openExternalMap.ts                                  [NUEVO TASK-03]
```

**Invariantes (diff acotado):** todo lo demás intacto (spec §8). `git diff -- app.config.js eslint.config.js` VACÍO al final de la fase.

## 2. Orden anti-rompimiento

TASK-01 (config + deps, rebuild Humano) → TASK-02 (header back; compila en cada paso porque el provider extiende el tipo y las pantallas se actualizan en la MISMA task) → TASK-03 (mapa) → TASK-04 (arnés). **Prohibido** entregar TASK-02 a medias: si el contexto expone `leftMode` pero `AppHeader` no lo consume, el gate visual falla.

## 3. TASK-01 — Config iOS (fix cold start + queries schemes)

1. `npx expo install expo-dev-client` (NUNCA `npm i`). Verificar que `package.json` solo suma `"expo-dev-client"` y el lockfile correspondiente.
2. `app.json` — en `ios.infoPlist`, junto a `NSFaceIDUsageDescription` (intacta):

```json
"infoPlist": {
  "NSFaceIDUsageDescription": "…(intacta)…",
  "LSApplicationQueriesSchemes": ["comgooglemaps", "waze"]
}
```

3. **PARADA:** el Trabajador NO ejecuta `prebuild`/`run:*`. El Humano corre `npx expo prebuild` (o deja que `run:ios` regenere) + `npx expo run:ios` + `npx expo run:android` y valida CA-08. `git diff -- app.config.js` debe quedar VACÍO.

## 4. TASK-02 — Header con modo back (verbatim)

### 4.1 `app-shell/presentation/HeaderTitleProvider.tsx` (EDIT)

```tsx
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const HEADER_TITLE_DEFAULT = "INICIO";

export type HeaderLeftMode = "menu" | "back";

type HeaderTitleContextValue = {
  title: string;
  setTitle: (title: string) => void;
  leftMode: HeaderLeftMode;
  setLeftMode: (mode: HeaderLeftMode) => void;
};

const HeaderTitleContext = createContext<HeaderTitleContextValue | null>(null);

export function HeaderTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState<string>(HEADER_TITLE_DEFAULT);
  const [leftMode, setLeftModeState] = useState<HeaderLeftMode>("menu");

  const setTitle = useCallback((nextTitle: string) => {
    setTitleState(nextTitle);
  }, []);

  const setLeftMode = useCallback((nextMode: HeaderLeftMode) => {
    setLeftModeState(nextMode);
  }, []);

  const value = useMemo(
    () => ({ title, setTitle, leftMode, setLeftMode }),
    [title, setTitle, leftMode, setLeftMode],
  );

  return (
    <HeaderTitleContext.Provider value={value}>
      {children}
    </HeaderTitleContext.Provider>
  );
}

export { HeaderTitleContext };
export type { HeaderTitleContextValue };
```

### 4.2 `app-shell/presentation/useHeaderTitle.ts`

Sin cambio de código (el tipo ya viene del contexto). Verificar que el mensaje de error «useHeaderTitle debe usarse dentro de HeaderTitleProvider» queda intacto.

### 4.3 `app-shell/presentation/AppHeader.tsx` (EDIT)

Cambios: importar `useNavigation` y `NativeStackNavigationProp`, `AppStackParamList`, y el ternario. Cuerpo completo verbatim:

```tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppStackParamList } from "@/app/navigation/types";
import { appPalette, fontFamily, palette } from "@/shared/theme/tokens";

import { useHeaderTitle } from "./useHeaderTitle";

type AppHeaderProps = {
  onMenuPress: () => void;
};

export function AppHeader({ onMenuPress }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { title, leftMode } = useHeaderTitle();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <View style={{ backgroundColor: appPalette.crema, paddingTop: insets.top }}>
      <StatusBar style="dark" />
      <View
        style={{
          height: 48,
          justifyContent: "center",
          paddingHorizontal: 16,
        }}
      >
        {leftMode === "back" ? (
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name="arrow-back" size={28} color={palette.texto} />
          </Pressable>
        ) : (
          <Pressable
            onPress={onMenuPress}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Abrir menú"
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons name="menu" size={28} color={palette.texto} />
          </Pressable>
        )}
        <Text
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: fontFamily["lato-bold"],
            color: palette.texto,
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
```

### 4.4 Setters por pantalla (3 archivos — patrón verbatim)

**`home/presentation/HomeScreen.tsx` (EDIT):** el `useFocusEffect` vigente (`setTitle("INICIO")`) pasa a:

```tsx
const { setTitle, setLeftMode } = useHeaderTitle();
useFocusEffect(
  useCallback(() => {
    setTitle("INICIO");
    setLeftMode("menu");
  }, [setTitle, setLeftMode]),
);
```

**`search/presentation/SearchScreen.tsx` (EDIT):**

```tsx
const { setTitle, setLeftMode } = useHeaderTitle();
useFocusEffect(
  useCallback(() => {
    setTitle("BÚSQUEDA");
    setLeftMode("back");
  }, [setTitle, setLeftMode]),
);
```

Y se **elimina** la fila de back arrow del cuerpo (el `View` con `flexDirection: "row"…` que contiene el `Pressable` `accessibilityLabel="Volver"` con `Ionicons arrow-back`). Si `useNavigation`/`Ionicons`/`Pressable` quedan sin uso en el archivo, se eliminan sus imports (eslint `no-unused-vars` manda). El resto de la pantalla intacto; la barra de búsqueda queda como primer elemento del cuerpo (padding superior conservado).

**`detail/presentation/DetailScreen.tsx` (EDIT):**

```tsx
const { setTitle, setLeftMode } = useHeaderTitle();
useFocusEffect(
  useCallback(() => {
    setTitle("DETALLE");
    setLeftMode("back");
  }, [setTitle, setLeftMode]),
);
```

Y se **elimina** la fila de back arrow del cuerpo (`backRowStyle` y su `Pressable`/`Ionicons arrow-back`). Si `useNavigation` queda sin uso (era solo para `goBack`), se elimina; `route` y los dos `useQuery` quedan intactos.

## 5. TASK-03 — Herramientas del mapa de Detail (verbatim)

### 5.1 `detail/presentation/openExternalMap.ts` (NUEVO)

```ts
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
```

### 5.2 `detail/presentation/DetailMapCard.tsx` (EDIT — cuerpo completo verbatim)

```tsx
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
```

**Nota (verificada por el Orquestador 2026-10-28):** `palette.superficie` (`#FFFFFF`) y `fontFamily["lato-bold"]` existen en `src/shared/theme/tokens.ts` (líneas 8 y familia Lato Fase 1). Usarlos tal cual; prohibido inventar hex inline.

## 6. Skills obligatorias (`.agents/skills`)

- `vercel-react-native-skills`: `Pressable` con feedback (nunca `TouchableOpacity`); handlers con `useCallback` donde aplique; cero estilos inline recreados por render (hoisted `as const`, ya aplicado en §4–§5).
- Reglas de hooks: deps completas en `useFocusEffect`/`useCallback` (eslint `react-hooks/exhaustive-deps` debe quedar sin warnings).

## 7. Criterio de hecho técnico (por TASK)

- **TASK-01:** `package.json` solo suma `expo-dev-client`; `app.json` solo suma `LSApplicationQueriesSchemes`; `npx tsc --noEmit` exit 0; rebuild nativo del Humano OK; CA-08 validado por el Humano.
- **TASK-02:** `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 sin warnings; greps: `AppStackParamList` importado en `AppHeader.tsx`; cero `arrow-back` en cuerpos de Search/Detail; `setLeftMode` presente en los 3 screens; diff acotado a los 6 archivos de la task.
- **TASK-03:** `npx tsc --noEmit` exit 0; `npx eslint .` exit 0; greps: `react-native-maps` solo en `DetailMapCard.tsx` + `RadarMap.tsx` (preexistente); `Linking`/`Platform`/`Alert` solo en `openExternalMap.ts` dentro de detail; cero deps nuevas (`git diff -- package.json` sin cambios en esta task).
- **TASK-04:** arnés completo + bans + gates de deps/config + features congeladas (spec §8); reporte de solo lectura.

## 8. Prohibiciones recordatorio

Cero `any`; cero `TouchableOpacity`; cero `FlatList`; cero `expo-router`; cero `className` en archivos nuevos/editados; cero edición de `ios/**`/`android/**`; cero `npx expo start`/`prebuild`/`run:*` por agentes (Humano exclusivo); cero commit (solo si el Humano lo pide); cero rutas nuevas en el navigator; `AppDrawer`/`AppBrandBar`/`AppShell`/`menuItems` intactos; domain/application/infrastructure intactos.
