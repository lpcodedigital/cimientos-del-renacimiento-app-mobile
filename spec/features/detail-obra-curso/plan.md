# PLAN — detail-obra-curso (Fase 4)

> Fuente de verdad **técnica** de Fase 4. La `spec.md` manda en producto. Firmas **verbatim**: el Trabajador copia las declaraciones tal cual; puede completar cuerpos/estilos siguiendo spec §4.5/§4.6 y las skills.

## 1. Árbol destino

```
src/features/detail/
  domain/
    entities/ObraDetail.ts
    entities/CursoDetail.ts
    errors/DetailError.ts
    ports/ObraDetailRepository.ts
    ports/CursoDetailRepository.ts
  application/
    types.ts
    obraDetail.ts
    cursoDetail.ts
  infrastructure/
    dto.ts
    AxiosObraDetailApi.ts
    AxiosCursoDetailApi.ts
  presentation/
    DetailProvider.tsx
    useDetail.ts
    format.ts
    KpiCard.tsx
    DetailSectionHeading.tsx
    DetailInfoRows.tsx
    DetailMapCard.tsx
    EvidenceCarousel.tsx
    EvidenceViewerModal.tsx
    ObraDetailContent.tsx
    CursoDetailContent.tsx
    DetailScreen.tsx
src/features/app-shell/presentation/
    HeaderTitleProvider.tsx        (NUEVO)
    useHeaderTitle.ts              (NUEVO)
    AppHeader.tsx                  (EDIT: título dinámico)
    AppShell.tsx                   (EDIT: envuelve provider)
src/app/
    compositionRoot.ts             (EDIT: +createDetailUseCases)
    navigation/types.ts            (EDIT: +Detail route)
    navigation/RootNavigator.tsx   (EDIT: +Screen Detail)     [TASK-05]
App.tsx                            (EDIT: +DetailProvider)
src/features/home/presentation/
    HomeScreen.tsx                 (EDIT: set INICIO al foco) [TASK-05]
    MunicipioCallout.tsx           (EDIT: SHOW_SEE_MORE=false)[TASK-05]
src/features/search/presentation/
    SearchScreen.tsx               (EDIT: set BÚSQUEDA al foco + retirar Text título) [TASK-05]
    SearchResultCard.tsx           (EDIT: onPress navega)     [TASK-05]
global.css                         (EDIT: +tokens detail-*)
src/shared/theme/tokens.ts         (EDIT: +detailPalette)
```

## 2. Orden anti-rompimiento

TASK-01 (tokens) → TASK-02 (domain+application, sin consumidores) → TASK-03 (infra + providers + wiring, sin UI) → TASK-04 (componentes + ruta tipada, sin wire al navigator) → TASK-05 (wire + cambios en features cerradas) → TASK-06 (arnés). Cada TASK deja `npx tsc --noEmit` en verde.

## 3. Tokens (TASK-01 — verbatim)

`global.css`, dentro del `@theme` existente, tras los `search-*`:

```css
--color-detail-screen-bg: #e4e4d8;
--color-detail-card-bg: #f4f0e8;
--color-detail-accent: #bc803c;
--color-detail-kpi-label: #545454;
--color-detail-text-muted: #7c7c78;
```

`src/shared/theme/tokens.ts`, al final (sin tocar paletas existentes):

```ts
export const detailPalette = {
  screenBg: "#E4E4D8",
  cardBg: "#F4F0E8",
  accent: "#BC803C",
  kpiLabel: "#545454",
  textMuted: "#7C7C78",
} as const;
```

Cero dependencias nuevas. `git diff -- package.json app.json app.config.js` debe quedar VACÍO.

## 4. Domain (TASK-02 — verbatim)

### 4.1 `domain/entities/ObraDetail.ts`

```ts
export type ObraDetail = {
  id: number;
  name: string;
  municipality: string;
  locality: string;
  agency: string;
  investment: string;
  progress: number;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  galleryUrls: string[] | null;
};
```

### 4.2 `domain/entities/CursoDetail.ts`

```ts
export type CursoDetail = {
  id: number;
  title: string;
  description: string;
  municipality: string;
  courseDate: string;
  latitude: number;
  longitude: number;
  galleryUrls: string[] | null;
};
```

### 4.3 `domain/errors/DetailError.ts` (calco de `SearchError`)

```ts
export type DetailErrorKind = "network" | "server" | "unexpected";

export type DetailError = {
  kind: DetailErrorKind;
  message: string;
};

export const DETAIL_ERROR_MESSAGES: Record<DetailErrorKind, string> = {
  network: "Sin conexión. Revisa tu red e inténtalo de nuevo.",
  server: "No se pudo cargar el detalle.",
  unexpected: "No se pudo cargar el detalle.",
};

export function detailError(kind: DetailErrorKind): DetailError {
  return { kind, message: DETAIL_ERROR_MESSAGES[kind] };
}

export function isDetailError(error: unknown): error is DetailError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    "message" in error
  );
}
```

### 4.4 `domain/ports/ObraDetailRepository.ts`

```ts
import type { ObraDetail } from "../entities/ObraDetail";

export interface ObraDetailRepository {
  getObraById(id: number, signal?: AbortSignal): Promise<ObraDetail>;
}
```

### 4.5 `domain/ports/CursoDetailRepository.ts`

```ts
import type { CursoDetail } from "../entities/CursoDetail";

export interface CursoDetailRepository {
  getCursoById(id: number, signal?: AbortSignal): Promise<CursoDetail>;
}
```

## 5. Application (TASK-02 — verbatim)

### 5.1 `application/types.ts`

```ts
import type { CursoDetail } from "../domain/entities/CursoDetail";
import type { ObraDetail } from "../domain/entities/ObraDetail";

export type DetailUseCases = {
  getObraDetail: (id: number, signal?: AbortSignal) => Promise<ObraDetail>;
  getCursoDetail: (id: number, signal?: AbortSignal) => Promise<CursoDetail>;
};
```

### 5.2 `application/obraDetail.ts`

```ts
import type { ObraDetailRepository } from "../domain/ports/ObraDetailRepository";
import type { DetailUseCases } from "./types";

export function createObraDetail(deps: {
  obraDetailRepository: ObraDetailRepository;
}): DetailUseCases["getObraDetail"] {
  return (id, signal) => deps.obraDetailRepository.getObraById(id, signal);
}
```

### 5.3 `application/cursoDetail.ts`

```ts
import type { CursoDetailRepository } from "../domain/ports/CursoDetailRepository";
import type { DetailUseCases } from "./types";

export function createCursoDetail(deps: {
  cursoDetailRepository: CursoDetailRepository;
}): DetailUseCases["getCursoDetail"] {
  return (id, signal) => deps.cursoDetailRepository.getCursoById(id, signal);
}
```

Los use cases dejan subir `DetailError` sin catch (patrón 2b/3). Imports solo relativos a `../domain` y `./types`.

## 6. Infrastructure (TASK-03 — verbatim)

### 6.1 `infrastructure/dto.ts` (espejo de spec §4.7; `galeryUrls` sic = typo del backend)

```ts
export type ObraDetailDTO = {
  id: number;
  name: string;
  municipality: string;
  locality: string;
  agency: string;
  investment: string;
  progress: number;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  galeryUrls?: string[];
};

export type CursoDetailDTO = {
  id: number;
  title: string;
  description: string;
  municipality: string;
  courseDate: string;
  latitude: number;
  longitude: number;
  coverImageUrl?: string; // Documentado; el mapper lo IGNORA (spec §2.3)
  galeryUrls?: string[];
};
```

### 6.2 `infrastructure/AxiosObraDetailApi.ts`

```ts
import { isAxiosError } from "axios";

import { axiosClient } from "@/shared/infrastructure/http/axiosClient";
import type { ObraDetail } from "../domain/entities/ObraDetail";
import { detailError, type DetailError } from "../domain/errors/DetailError";
import type { ObraDetailRepository } from "../domain/ports/ObraDetailRepository";
import type { ObraDetailDTO } from "./dto";

const OBRA_DETAIL_PATH = "/api/v1/app-mobile/obra"; // única aparición del path

function mapObra(dto: ObraDetailDTO): ObraDetail {
  return {
    id: dto.id,
    name: dto.name,
    municipality: dto.municipality,
    locality: dto.locality,
    agency: dto.agency,
    investment: dto.investment,
    progress: dto.progress,
    description: dto.description,
    latitude: dto.latitude,
    longitude: dto.longitude,
    status: dto.status,
    galleryUrls: dto.galeryUrls ?? null,
  };
}

export function createAxiosObraDetailApi(): ObraDetailRepository {
  return {
    async getObraById(id, signal) {
      try {
        const response = await axiosClient.get<ObraDetailDTO>(
          `${OBRA_DETAIL_PATH}/${id}`,
          { signal },
        );
        return mapObra(response.data);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.code === "ERR_CANCELED") {
            throw error; // cancelación de TanStack Query: re-lanzar intacta
          }
          const detail: DetailError =
            error.response !== undefined
              ? detailError("server")
              : detailError("network");
          throw detail;
        }
        throw detailError("unexpected");
      }
    },
  };
}
```

### 6.3 `infrastructure/AxiosCursoDetailApi.ts`

Idéntica estructura con `CURSO_DETAIL_PATH = "/api/v1/app-mobile/curso"` (única aparición), `mapCurso(dto: CursoDetailDTO): CursoDetail` con `galleryUrls: dto.galeryUrls ?? null` y **`coverImageUrl` ignorado deliberadamente** (no aparece en la entidad). Ajustar el import del `axiosClient` a la ruta real usada por `AxiosGlobalSearchApi` (mismo módulo compartido de Fase 3).

> Nota al Trabajador: si el import real de `axiosClient` en `AxiosGlobalSearchApi.ts` difiere del mostrado arriba, copia **ese mismo** import (fuente de verdad = código de Fase 3). La cancelación se maneja con el mismo patrón usado en `AxiosGlobalSearchApi` (re-lanzar `ERR_CANCELED`/`axios.isCancel` intacta).

## 7. Providers y wiring (TASK-03 — verbatim)

### 7.1 `presentation/DetailProvider.tsx` (calco `SearchProvider`, sin estado propio)

```tsx
import { createContext, type ReactNode } from "react";

import type { DetailUseCases } from "../application/types";

type DetailContextValue = {
  useCases: DetailUseCases;
};

const DetailContext = createContext<DetailContextValue | null>(null);

type DetailProviderProps = {
  useCases: DetailUseCases;
  children: ReactNode;
};

export function DetailProvider({ useCases, children }: DetailProviderProps) {
  return (
    <DetailContext.Provider value={{ useCases }}>
      {children}
    </DetailContext.Provider>
  );
}

export { DetailContext };
export type { DetailContextValue };
```

### 7.2 `presentation/useDetail.ts`

```ts
import { useContext } from "react";

import { DetailContext, type DetailContextValue } from "./DetailProvider";

export function useDetail(): DetailContextValue {
  const context = useContext(DetailContext);
  if (context === null) {
    throw new Error("useDetail debe usarse dentro de DetailProvider");
  }
  return context;
}
```

### 7.3 `src/app/compositionRoot.ts` (EDIT — al final, sin tocar lo existente)

```ts
import { createCursoDetail } from "@/features/detail/application/cursoDetail";
import { createObraDetail } from "@/features/detail/application/obraDetail";
import type { DetailUseCases } from "@/features/detail/application/types";
import { createAxiosCursoDetailApi } from "@/features/detail/infrastructure/AxiosCursoDetailApi";
import { createAxiosObraDetailApi } from "@/features/detail/infrastructure/AxiosObraDetailApi";

export function createDetailUseCases(): DetailUseCases {
  const obraDetailRepository = createAxiosObraDetailApi();
  const cursoDetailRepository = createAxiosCursoDetailApi();
  return {
    getObraDetail: createObraDetail({ obraDetailRepository }),
    getCursoDetail: createCursoDetail({ cursoDetailRepository }),
  };
}
```

### 7.4 `App.tsx` (EDIT)

Añadir `createDetailUseCases` al import de `@/app/compositionRoot`, `const detailUseCases = createDetailUseCases();` a nivel de módulo, y envolver `<DetailProvider useCases={detailUseCases}>` **dentro** de `<SearchProvider>`, alrededor de `<RootNavigator />` + `<StatusBar />`.

### 7.5 Fences

`eslint.config.js`: **SIN CAMBIOS**. Verificar en el arnés que los bans existentes (`react-native-maps`, `@shopify/*`, `expo-image` en domain/application de `src/features/*`) aplican a `detail` por glob. Grep de evidencia: `react-native-maps` solo en `DetailMapCard.tsx`; `expo-image` solo en `EvidenceCarousel.tsx`/`EvidenceViewerModal.tsx`; `@shopify/flash-list` solo en `EvidenceCarousel.tsx`.

## 8. Componentes (TASK-04 — sin wire al navigator)

### 8.1 `presentation/format.ts` (verbatim)

```ts
const MONEY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
});

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word,
    )
    .join(" ");
}

export function formatInversion(investment: string): string {
  const amount = Number.parseFloat(investment);
  if (Number.isNaN(amount)) {
    return investment;
  }
  return MONEY_FORMATTER.format(amount);
}

export function formatFechaCurso(courseDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(courseDate);
  if (match === null) {
    return courseDate;
  }
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  if (month < 1 || month > 12) {
    return courseDate;
  }
  return `${day} de ${MESES[month - 1]} de ${match[1]}`;
}
```

`toTitleCase` duplicado deliberadamente (prohibido importar entre features). `MONEY_FORMATTER` y `MESES` hoisted a nivel de módulo (skill `js-hoist-intl`). `formatInversion("10495378.41")` → `$10,495,378.41`. `formatFechaCurso("2026-07-04")` → `4 de julio de 2026`.

### 8.2 `presentation/KpiCard.tsx`

```tsx
type KpiCardProps = {
  iconName: ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  sublabel: string;
  compact?: boolean; // true en la KPI de Estatus (valor largo, una línea)
};
```

Card `detail-card-bg`, radio 28, centrada: icono 28 `detail-accent`; label Lato regular 13 `detail-kpi-label`; valor Lato Bold `texto` (fontSize 18; `compact` → 13, `numberOfLines={1}`); sublabel Lato regular 11 `detail-text-muted`. `memo` + estilos hoisted.

### 8.3 `presentation/DetailSectionHeading.tsx`

```tsx
type DetailSectionHeadingProps = {
  title: string;
  iconName?: ComponentProps<typeof Ionicons>["name"]; // solo «Ubicación» lo usa
};
```

Fila con icono 24 `detail-accent` (si aplica) + título Lato Bold 20 `texto`. Estilos hoisted.

### 8.4 `presentation/DetailInfoRows.tsx`

```tsx
export type DetailInfoRow = {
  label: string;
  value: string;
};

type DetailInfoRowsProps = {
  rows: DetailInfoRow[];
};
```

Pills apiladas (`detail-card-bg`, radio 30, paddingH 20, paddingV 16, gap 12): label izquierda Lato regular 14 `detail-text-muted`; valor derecha Lato Bold 14 `texto`, `numberOfLines={2}`, alineado a la derecha, `flexShrink` para no empujar el label. `keyExtractor` no aplica (map con `key={row.label}`; filas estáticas por tipo).

### 8.5 `presentation/DetailMapCard.tsx` (único archivo de detail con `react-native-maps`)

```tsx
type DetailMapCardProps = {
  latitude: number;
  longitude: number;
};
```

Contenedor `borderRadius: 20, overflow: "hidden", height: 200`. `MapView` con `provider={PROVIDER_GOOGLE}`, `initialRegion={{ latitude, longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }}`, `scrollEnabled`, `zoomEnabled`, `pitchEnabled={false}`, `rotateEnabled={false}`, estilo `width/height 100%`. `Marker` con `coordinate={{ latitude, longitude }}` y el mismo mecanismo de pin guinda `#6B142E` usado en 2b (`pinColor={palette.guinda}` o el componente de pin custom de `RadarMap` — **fuente de verdad: copiar el patrón de `home/presentation/RadarMap.tsx`**, duplicado deliberado, prohibido importar entre features).

### 8.6 `presentation/EvidenceCarousel.tsx` (único con `@shopify/flash-list`; `expo-image` compartido con 8.7)

```tsx
type EvidenceCarouselProps = {
  urls: string[] | null;
  onPressEvidence: (url: string) => void;
};
```

- `urls === null` o `urls.length === 0` → mensaje «Sin evidencias fotográficas.» (Lato 14 `detail-text-muted`, centrado, padding vertical 24).
- Si no: `FlashList<string>` **horizontal**, `showsHorizontalScrollIndicator={false}`, `data={urls}`, `keyExtractor` hoisted (`(url) => url`), `renderItem` hoisted: tarjeta `width: 240, aspectRatio: 4/3, borderRadius: 20, overflow: "hidden"` envuelta en `Pressable` (`accessibilityRole="button"`, `accessibilityLabel="Ver evidencia"`, pressed → opacity 0.9) con `Image` (`expo-image`) `contentFit="cover"`, `recyclingKey={url}`, `cachePolicy="memory-disk"`, `transition={0}`; caption `evidencia {index + 1}` (Lato 12 `detail-text-muted`, centrado, minúscula verbatim del mockup) bajo la tarjeta; separación por `paddingRight: 12` en el wrapper (sin `ItemSeparatorComponent`).
- **Prohibido `estimatedItemSize`** (FlashList v2). `contentContainerStyle={{ paddingVertical: 4 }}`.

### 8.7 `presentation/EvidenceViewerModal.tsx`

```tsx
type EvidenceViewerModalProps = {
  url: string | null;
  onClose: () => void;
};
```

`Modal` nativo RN `visible={url !== null}` `animationType="fade"` `onRequestClose={onClose}`; fondo `rgba(0,0,0,0.92)`; `Image` (`expo-image`) `source={{ uri: url ?? "" }}` `contentFit="contain"` ocupando la pantalla (safe area); botón X (`close`, 28, `superficie #FFFFFF`) top-right con `accessibilityLabel="Cerrar"`, `hitSlop={12}`, `onPress={onClose}`. Ternario estricto para `url` (skill `rendering-no-falsy-and`: `url` es `string | null`, nunca renderizar `{url && ...}`).

### 8.8 `presentation/ObraDetailContent.tsx`

```tsx
type ObraDetailContentProps = {
  obra: ObraDetail;
  onPressEvidence: (url: string) => void;
};
```

Composición en orden (spec §4.5): título `toTitleCase(obra.name)` (Lato Bold 24 `texto`); fila de 3 `KpiCard` (Finanzas `cash-outline`/`formatInversion(obra.investment)`/«Inversión»; Avance `pie-chart-outline`/`{obra.progress}%` (ternario estricto — `progress: 0` se pinta)/«Completado»; Estatus `flag-outline`/`obra.status`/«Estado de la obra» con `compact`); `DetailSectionHeading` «Ubicación» con `location-outline`; `DetailMapCard`; `DetailSectionHeading` «Evidencias»; `EvidenceCarousel`; `DetailSectionHeading` «Descripción»; párrafo `obra.description` **verbatim** (Lato regular 14 `texto`); `DetailInfoRows` con filas verbatim: Municipio/`obra.municipality`, Localidad/`obra.locality`, Dependencia/`obra.agency`, Estatus/`obra.status`. `rows` hoisted por render vía `useMemo` o construcción fuera del JSX.

### 8.9 `presentation/CursoDetailContent.tsx`

```tsx
type CursoDetailContentProps = {
  curso: CursoDetail;
  onPressEvidence: (url: string) => void;
};
```

Composición (spec §4.6): título `curso.title` **verbatim**; fila de 2 `KpiCard` (Fecha `calendar-outline`/`formatFechaCurso(curso.courseDate)`/«Fecha del curso»; Municipio `location-outline`/`curso.municipality` verbatim/«Sede»); mismas secciones Ubicación/Evidencias/Descripción; `DetailInfoRows`: Municipio/`curso.municipality`, «Fecha del curso»/`formatFechaCurso(curso.courseDate)`.

### 8.10 `presentation/DetailScreen.tsx`

```tsx
export function DetailScreen() {
  const { useCases } = useDetail();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, "Detail">>();
  const { tipo, id } = route.params;

  const obraQuery = useQuery<ObraDetail, DetailError>({
    queryKey: ["detail", "obra", id],
    queryFn: ({ signal }) => useCases.getObraDetail(id, signal),
    enabled: tipo === "OBRA",
  });

  const cursoQuery = useQuery<CursoDetail, DetailError>({
    queryKey: ["detail", "curso", id],
    queryFn: ({ signal }) => useCases.getCursoDetail(id, signal),
    enabled: tipo === "CURSO",
  });

  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null);
  // ...
}
```

- `isPending` / `isError` / `data` se derivan por ternario estricto sobre `tipo` (hooks siempre ejecutados; `enabled` evita el fetch del tipo no elegido).
- Layout: `View` raíz fondo `detail-screen-bg` paddingH 16; fila 1 = back arrow (`arrow-back`, 24, `texto`, `accessibilityLabel="Volver"`, `onPress={() => navigation.goBack()}`) con padding vertical 12 — **sin título de texto** (el header muestra `DETALLE`, spec §2.6).
- `isPending` → spinner central grande guinda. `isError` → mensaje «No se pudo cargar el detalle.» (Lato 14 `detail-text-muted`, centrado).
- `isSuccess` → `ScrollView` (`showsVerticalScrollIndicator={false}`) con `ObraDetailContent` o `CursoDetailContent` según `tipo` (narrow por el ternario de queries; TS: castear por rama con los tipos de cada query, cero `any` — usar el `data` de la query correspondiente en cada rama del ternario sobre `tipo`).
- `EvidenceViewerModal url={evidenceUrl} onClose={() => setEvidenceUrl(null)}` montado al final; `onPressEvidence={setEvidenceUrl}` estable (hoisted con `useCallback` o setter directo).
- **El título del header se setea en TASK-05** (`useFocusEffect` → `DETALLE`); TASK-04 deja el `useHeaderTitle` ya consumido pero el mecanismo se crea en TASK-05 → **no**: para que TASK-04 compile sin tocar app-shell, `DetailScreen` NO usa `useHeaderTitle` en TASK-04; esa línea se añade en TASK-05 junto con el provider de app-shell.

### 8.11 `src/app/navigation/types.ts` (EDIT — TASK-04)

```ts
export type AppStackParamList = {
  Home: undefined;
  Search: undefined;
  Detail: { tipo: "OBRA" | "CURSO"; id: number };
};
```

Literal inline deliberado (prohibido importar `SearchCardTipo` de `search` — regla de cero imports entre features).

## 9. Wire + features congeladas (TASK-05 — verbatim)

### 9.1 `app-shell/presentation/HeaderTitleProvider.tsx` (NUEVO)

```tsx
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const HEADER_TITLE_DEFAULT = "INICIO";

type HeaderTitleContextValue = {
  title: string;
  setTitle: (title: string) => void;
};

const HeaderTitleContext = createContext<HeaderTitleContextValue | null>(null);

export function HeaderTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState<string>(HEADER_TITLE_DEFAULT);

  const setTitle = useCallback((nextTitle: string) => {
    setTitleState(nextTitle);
  }, []);

  const value = useMemo(() => ({ title, setTitle }), [title, setTitle]);

  return (
    <HeaderTitleContext.Provider value={value}>
      {children}
    </HeaderTitleContext.Provider>
  );
}

export { HeaderTitleContext };
export type { HeaderTitleContextValue };
```

### 9.2 `app-shell/presentation/useHeaderTitle.ts` (NUEVO)

```ts
import { useContext } from "react";

import {
  HeaderTitleContext,
  type HeaderTitleContextValue,
} from "./HeaderTitleProvider";

export function useHeaderTitle(): HeaderTitleContextValue {
  const context = useContext(HeaderTitleContext);
  if (context === null) {
    throw new Error("useHeaderTitle debe usarse dentro de HeaderTitleProvider");
  }
  return context;
}
```

### 9.3 `app-shell/presentation/AppHeader.tsx` (EDIT)

- Añadir `const { title } = useHeaderTitle();` y reemplazar el literal `INICIO` del `<Text>` por `{title}`. Cero otro cambio (mismo estilo, misma hamburguesa, mismo `pointerEvents="none"`).

### 9.4 `app-shell/presentation/AppShell.tsx` (EDIT)

- Envolver el contenido con `<HeaderTitleProvider>` (alrededor de `AppHeader` + `AppBrandBar` + `children` + `AppDrawer`, dentro del `View` raíz). Cero otro cambio.

### 9.5 Setters de título por pantalla (patrón verbatim — 3 archivos)

En `home/presentation/HomeScreen.tsx` (título `"INICIO"`), `search/presentation/SearchScreen.tsx` (título `"BÚSQUEDA"`) y `detail/presentation/DetailScreen.tsx` (título `"DETALLE"`):

```tsx
const { setTitle } = useHeaderTitle();

useFocusEffect(
  useCallback(() => {
    setTitle("DETALLE"); // "INICIO" en HomeScreen, "BÚSQUEDA" en SearchScreen
  }, [setTitle]),
);
```

`useFocusEffect` de `@react-navigation/native`. El literal de cada pantalla vive en su propio archivo (cero imports entre features; `HEADER_TITLE_DEFAULT` solo lo usa el provider). Razonamiento: con native-stack las pantallas de abajo permanecen montadas; el foco es el evento correcto (goBack de Detail → Search re-setea `BÚSQUEDA`; goBack → Home re-setea `INICIO`).

### 9.6 `search/presentation/SearchScreen.tsx` (EDIT adicional)

- **Eliminar** el `<Text>` con `BÚSQUEDA` de la fila 1 (conservar el `Pressable` del back arrow y la fila contenedora con su padding). Cero otro cambio visual.

### 9.7 `search/presentation/SearchResultCard.tsx` (EDIT)

- Eliminar `const handleCardPress = (): void => {};`.
- Dentro de `SearchResultCardBase`: `const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();` y `const handlePress = useCallback(() => { navigation.navigate("Detail", { tipo: card.tipo, id: card.id }); }, [navigation, card.tipo, card.id]);` → `onPress={handlePress}`.
- `accessibilityLabel` pasa a `"Ver detalle"`.
- Cero otro cambio visual (mismo `memo`, mismos estilos).

### 9.8 `home/presentation/MunicipioCallout.tsx` (EDIT)

- Añadir a nivel de módulo: `const SHOW_SEE_MORE = false;` (con comentario: «Fase 4: oculto por decisión del Humano 2026-10-20; su flujo = Fase 5 Detalle Municipal»).
- Envolver el `<View style={footerStyle}>…</View>` del botón «Ver más» en un ternario estricto: `{SHOW_SEE_MORE ? (<View style={footerStyle}>…</View>) : null}`. Código del botón **intacto** (no se elimina).
- Los estilos `footerStyle`/`seeMoreStyle`/`seeMoreTextStyle` quedan definidos (usados por el código oculto); si ESLint marca unused, mantenerlos referenciados dentro del ternario (lo están — el branch existe).

### 9.9 `src/app/navigation/RootNavigator.tsx` (EDIT)

- `import { DetailScreen } from "@/features/detail/presentation/DetailScreen";` + `<AppStack.Screen name="Detail" component={DetailScreen} />` tras `Search`. `AppShell`/`NavigationContainer key={status}`/`AuthStackNavigator` intactos.

## 10. Skills obligatorias (`.agents/skills`)

- `list-performance` (FlashList horizontal: `renderItem`/`keyExtractor` hoisted, sin `estimatedItemSize`, `recyclingKey`).
- `js-hoist-intl` (`MONEY_FORMATTER`, `MESES`, formatos hoisted a nivel de módulo).
- `ui-pressable` (todo `Pressable` con feedback; prohibido `TouchableOpacity`).
- `rendering-no-falsy-and` (`progress: 0` se pinta; `url: string | null` con ternarios estrictos).
- `react-state-minimize` (el visor de evidencia es el único estado UI local; el server state vive en TanStack Query).

## 11. Criterio de hecho técnico (por TASK)

- **TASK-01:** 5 tokens en `global.css` + `detailPalette` en `tokens.ts`; `npx tsc --noEmit` exit 0; `git diff -- package.json app.json app.config.js` VACÍO.
- **TASK-02:** 8 archivos (§4–§5) con firmas verbatim; tsc + eslint exit 0; grep de capas: domain/application solo imports relativos; cero react/expo/axios/tanstack/shopify/maps/expo-image.
- **TASK-03:** §6–§7 completos; tsc + eslint exit 0; DIP: único importador de `detail/infrastructure` = `compositionRoot.ts`; paths únicos por Axios*Api; `git diff -- package.json app.json app.config.js` VACÍO.
- **TASK-04:** §8 completo (11 archivos + `types.ts`); tsc + eslint exit 0; greps: `react-native-maps` solo en `DetailMapCard.tsx`, `expo-image` solo en `Evidence*` (2 archivos), `@shopify/flash-list` solo en `EvidenceCarousel.tsx`; cero `estimatedItemSize`/`FlatList`/`any`/`TouchableOpacity`; pantalla aún no montada en el navigator.
- **TASK-05:** §9 completo; tsc + eslint exit 0; `git diff --stat` sobre features congeladas muestra **solo** los archivos listados en §9; checklist físico Humano CA-01…09 en Android + iOS.
- **TASK-06:** arnés completo (CA-10): tsc/eslint en verde, bans cero, DIP, deps VACÍO, contratos únicos, regresión chrome/radar/search por diff contra baseline pre-Fase-4.

## 12. Prohibiciones recordatorio

Cero deps nuevas; cero `npx expo start`/`prebuild`/`run:*` (Humano); cero commit (Humano decide); cero código nativo; cero imports entre features (duplicados deliberados documentados: `toTitleCase`, patrón de pin guinda); cero barrels; cero `any`.
