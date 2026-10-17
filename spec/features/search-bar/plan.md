# PLAN — search-bar (Fase 3)

**Fuente de verdad técnica.** Producto: `spec.md`. Tareas: `task.md`.
**Regla:** el Trabajador copia las firmas **verbatim**. Cero improvisación, cero código fuera de este plan.

---

## 1. Árbol destino

```
src/features/search/
  domain/
    entities/SearchCard.ts
    entities/SearchPage.ts
    errors/SearchError.ts
    ports/SearchRepository.ts
  application/
    types.ts
    globalSearch.ts
  infrastructure/
    dto.ts
    AxiosGlobalSearchApi.ts
  presentation/
    SearchProvider.tsx
    useSearch.ts
    SearchScreen.tsx
    SearchInputBar.tsx
    SearchResultCard.tsx
    SearchEmptyState.tsx
    format.ts
```

**Editados fuera de la feature:** `global.css`, `src/shared/theme/tokens.ts` (TASK-01); `src/app/compositionRoot.ts`, `App.tsx`, `eslint.config.js` (TASK-03); `src/app/navigation/types.ts`, `src/app/navigation/RootNavigator.tsx`, `src/features/home/presentation/RadarSearchBar.tsx`, `src/features/app-shell/presentation/menuItems.ts`, `src/features/app-shell/presentation/AppDrawer.tsx` (TASK-05).

## 2. Orden de ejecución (anti-rompimiento)

TASK-01 tokens+deps → TASK-02 domain+application → TASK-03 infrastructure+wiring → TASK-04 componentes (sin wire) → TASK-05 wire navigator → TASK-06 arnés. Cada TASK deja `npx tsc --noEmit` en verde. Cero commits por parte del agente.

## 3. Tokens (TASK-01)

### 3.1 `global.css` — añadir dentro del `@theme` existente (verbatim)

```css
--color-search-tag-obra: #5c7a3f;
--color-search-tag-curso: #8b5e2f;
--color-search-card-bg: #f5f0e8;
--color-search-screen-bg: #e8e4d9;
--color-search-surface: #ffffff;
--color-search-text-muted: #777777;
--color-search-image-placeholder: #e4e0d5;
--color-search-accent: #c97c33;
```

### 3.2 `src/shared/theme/tokens.ts` — añadir al final (verbatim)

```ts
export const searchPalette = {
  tagObra: "#5C7A3F",
  tagCurso: "#8B5E2F",
  cardBg: "#F5F0E8",
  screenBg: "#E8E4D9",
  surface: "#FFFFFF",
  textMuted: "#777777",
  imagePlaceholder: "#E4E0D5",
  accent: "#C97C33",
} as const;
```

`palette`, `fontFamily`, `authPalette`, `appPalette`, `radarPalette` **sin tocar**. `accent` queda registrado pero **prohibido usarlo** en Fase 3 (spec §9).

### 3.3 Dependencias (gate del Humano)

```bash
npx expo install @shopify/flash-list expo-image
```

Solo esas dos. Cero cambios en `app.json` / `app.config.js` (ninguna requiere config plugin). Tras el install, el **Humano** hace rebuild nativo (`npx expo prebuild` + `run:ios`/`run:android`) — FlashList es módulo nativo.

## 4. Domain (TASK-02) — firmas verbatim

### 4.1 `domain/entities/SearchCard.ts`

```ts
export type SearchCardTipo = "OBRA" | "CURSO";

export type SearchCard = {
  id: number;
  tipo: SearchCardTipo;
  titulo: string;
  municipio: string;
  localidad: string | null;
  descripcionCorta: string | null;
  estatus: string | null;
  progreso: number | null;
  imagenUrl: string | null;
};
```

### 4.2 `domain/entities/SearchPage.ts`

```ts
import type { SearchCard } from "./SearchCard";

export type SearchPage = {
  cards: SearchCard[];
  totalElements: number;
  totalPages: number;
  page: number;
  isLast: boolean;
};
```

### 4.3 `domain/errors/SearchError.ts`

```ts
export type SearchErrorKind = "search_unavailable";

export type SearchError = {
  kind: SearchErrorKind;
  message: string;
};

export const SEARCH_ERROR_MESSAGES: Record<SearchErrorKind, string> = {
  search_unavailable: "No se pudo completar la búsqueda.",
};

export function searchError(kind: SearchErrorKind): SearchError {
  return { kind, message: SEARCH_ERROR_MESSAGES[kind] };
}

export function isSearchError(error: unknown): error is SearchError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    (error as SearchError).kind === "search_unavailable"
  );
}
```

### 4.4 `domain/ports/SearchRepository.ts`

```ts
import type { SearchPage } from "../entities/SearchPage";

export type SearchRepository = {
  search(query: string, page: number, signal?: AbortSignal): Promise<SearchPage>;
};
```

## 5. Application (TASK-02) — firmas verbatim

### 5.1 `application/types.ts`

```ts
import type { SearchPage } from "../domain/entities/SearchPage";

export type SearchUseCases = {
  globalSearch(
    query: string,
    page: number,
    signal?: AbortSignal
  ): Promise<SearchPage>;
};
```

### 5.2 `application/globalSearch.ts`

```ts
import type { SearchRepository } from "../domain/ports/SearchRepository";
import type { SearchUseCases } from "./types";

type Deps = {
  searchRepository: SearchRepository;
};

export function createGlobalSearch(
  deps: Deps
): SearchUseCases["globalSearch"] {
  return (query, page, signal) =>
    deps.searchRepository.search(query, page, signal);
}
```

Dejar subir `SearchError` **sin catch** (patrón `loadRadarMap`).

## 6. Infrastructure + wiring (TASK-03)

### 6.1 `infrastructure/dto.ts` (wire espejo de spec §4.6, verbatim)

```ts
export type GlobalSearchCardDTO = {
  idOriginal: number;
  tipo: string;
  titulo: string;
  municipio: string;
  localidad?: string;
  descripcionCorta?: string;
  estatus?: string;
  progreso?: number;
  imagenUrl?: string;
};

export type GlobalSearchPageDTO = {
  content: GlobalSearchCardDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
  last: boolean;
};
```

### 6.2 `infrastructure/AxiosGlobalSearchApi.ts` (verbatim)

```ts
import axios from "axios";

import { axiosClient } from "@/shared/infrastructure/http/axiosClient";
import type { SearchCard, SearchCardTipo } from "../domain/entities/SearchCard";
import type { SearchPage } from "../domain/entities/SearchPage";
import { isSearchError, searchError } from "../domain/errors/SearchError";
import type { SearchRepository } from "../domain/ports/SearchRepository";
import type { GlobalSearchCardDTO, GlobalSearchPageDTO } from "./dto";

const PAGE_SIZE = 10;

function mapCard(dto: GlobalSearchCardDTO): SearchCard {
  const tipo: SearchCardTipo = dto.tipo === "CURSO" ? "CURSO" : "OBRA";
  return {
    id: dto.idOriginal,
    tipo,
    titulo: dto.titulo,
    municipio: dto.municipio,
    localidad: dto.localidad ?? null,
    descripcionCorta: dto.descripcionCorta ?? null,
    estatus: dto.estatus ?? null,
    progreso: dto.progreso ?? null,
    imagenUrl: dto.imagenUrl ?? null,
  };
}

export function createAxiosGlobalSearchApi(): SearchRepository {
  return {
    async search(query, page, signal) {
      try {
        const response = await axiosClient.get<GlobalSearchPageDTO>(
          "/api/v1/app-mobile/global-search",
          { params: { search: query, page, size: PAGE_SIZE }, signal }
        );
        const dto = response.data;
        const result: SearchPage = {
          cards: dto.content.map(mapCard),
          totalElements: dto.totalElements,
          totalPages: dto.totalPages,
          page: dto.number,
          isLast: dto.last,
        };
        return result;
      } catch (error) {
        if (axios.isCancel(error)) throw error;
        if (isSearchError(error)) throw error;
        throw searchError("search_unavailable");
      }
    },
  };
}
```

Reglas: path del endpoint **solo aquí** (CA-10); cero logs de token/payload; cancelación se re-lanza intacta (TanStack Query la trata como cancelación, no como error — CA-07).

### 6.3 `compositionRoot.ts` — añadir (verbatim; `createAuthUseCases`/`createHomeUseCases` intactos)

```ts
import { createGlobalSearch } from "@/features/search/application/globalSearch";
import type { SearchUseCases } from "@/features/search/application/types";
import { createAxiosGlobalSearchApi } from "@/features/search/infrastructure/AxiosGlobalSearchApi";

export function createSearchUseCases(): SearchUseCases {
  const searchRepository = createAxiosGlobalSearchApi();
  return {
    globalSearch: createGlobalSearch({ searchRepository }),
  };
}
```

### 6.4 `App.tsx` — añadir (verbatim)

```ts
const searchUseCases = createSearchUseCases();
```

a nivel de módulo (junto a `homeUseCases`), y envolver:

```tsx
<HomeProvider useCases={homeUseCases}>
  <SearchProvider useCases={searchUseCases}>
    <RootNavigator />
    <StatusBar style="light" />
  </SearchProvider>
</HomeProvider>
```

Importar `createSearchUseCases` en el import existente de `@/app/compositionRoot` y `SearchProvider` desde `@/features/search/presentation/SearchProvider`. Fuentes, `QueryClient`, `global.css` intactos.

### 6.5 `eslint.config.js` — fences (verbatim)

En el bloque `src/features/*/domain/**` añadir a `patterns`:

```js
"@shopify/*",
"expo-image",
```

En el bloque `src/features/*/application/**` añadir a `patterns`:

```js
"@shopify/*",
"expo-image",
```

El bloque `presentation`/`navigation`/`shared/ui` **no cambia** (`@shopify/flash-list` y `expo-image` son UI: permitidos solo en `presentation`). Sin paquete nuevo de ESLint.

## 7. `presentation/SearchProvider.tsx` + `useSearch.ts` (TASK-03, verbatim)

Fachada única: los componentes consumen estado + acciones + `useCases` **solo** por `useSearch()` (calco `useHomeRadar`/`useAuth`). Prohibido pasar use cases por props al screen.

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { SearchUseCases } from "../application/types";

export const SEARCH_MIN_CHARS = 3;
export const SEARCH_DEBOUNCE_MS = 500;

export type SearchState = {
  query: string;
  debouncedQuery: string;
  isActive: boolean;
};

export type SearchContextValue = SearchState & {
  useCases: SearchUseCases;
  setQuery: (value: string) => void;
  clearQuery: () => void;
};

export const SearchContext = createContext<SearchContextValue | null>(null);

type Props = {
  useCases: SearchUseCases;
  children: ReactNode;
};

export function SearchProvider({ useCases, children }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [query]);

  const clearQuery = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  const value = useMemo<SearchContextValue>(
    () => ({
      query,
      debouncedQuery,
      isActive: debouncedQuery.length >= SEARCH_MIN_CHARS,
      useCases,
      setQuery,
      clearQuery,
    }),
    [query, debouncedQuery, useCases, clearQuery]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
```

`presentation/useSearch.ts`:

```ts
import { useContext } from "react";

import { SearchContext, type SearchContextValue } from "./SearchProvider";

export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (context === null) {
    throw new Error("useSearch debe usarse dentro de SearchProvider");
  }
  return context;
}
```

## 8. Componentes (TASK-04) — sin wire al navigator

### 8.1 `presentation/format.ts` (verbatim)

```ts
export function toTitleCase(value: string): string {
  return value
    .toLocaleLowerCase("es-MX")
    .replace(/(^|\s)(\p{L})/gu, (match) =>
      match.toLocaleUpperCase("es-MX")
    );
}

export function formatProgreso(progreso: number, estatus: string): string {
  return `${progreso}% ${toTitleCase(estatus)}`;
}

export function formatUbicacion(
  localidad: string | null,
  municipio: string
): string {
  return localidad !== null
    ? `${toTitleCase(localidad)}, ${toTitleCase(municipio)}`
    : toTitleCase(municipio);
}
```

`toTitleCase` es copia verbatim del helper de `home/presentation/format.ts` (prohibido importar entre features — la duplicación es deliberada).

### 8.2 `presentation/SearchInputBar.tsx`

Pill blanca (`searchPalette.surface`, radio 24, padding vertical 4, paddingHorizontal 16, `boxShadow` sutil calco de la pill del radar): lupa Ionicons `search` (20, `palette["texto-suave"]`), `TextInput` flexible y X.

Props: ninguna (consume `useSearch()`). Estructura y reglas:

- `TextInput`: `value={query}`, `onChangeText={setQuery}`, `autoFocus`, `placeholder` verbatim `Buscar municipio, localidad, obra o capacitación`, `placeholderTextColor={palette["texto-suave"]}`, `returnKeyType="search"`, `autoCorrect={false}`, `autoCapitalize="none"`, estilo `flex: 1`, `fontFamily.lato`, tamaño 15, `palette.texto`, `accessibilityLabel="Buscar"`.
- X: visible **solo** cuando `query.length > 0` (ternario estricto, cero `&&`). `Pressable` con Ionicons `close` (20, `palette["texto-suave"]`), `hitSlop` 12, `accessibilityLabel="Limpiar búsqueda"`, `onPress={clearQuery}` (el input conserva el foco: **no** llamar `blur()`).

### 8.3 `presentation/SearchResultCard.tsx`

Props: `{ card: SearchCard }`. Envolver en `memo` (regla `list-performance`). Estructura (estilos inline JS con `searchPalette`/`palette`/`fontFamily`; `StyleSheet` solo si un valor lo exige):

- Raíz: `Pressable` con `onPress` **no-op** tipado (`accessibilityLabel="Ver detalle (disponible en la siguiente fase)"`), feedback `pressed` → opacity 0.9. Fondo `searchPalette.cardBg`, `borderRadius: 20`, `overflow: "hidden"`, `flex: 1`.
- Bloque imagen (`aspectRatio: 4 / 3`, ancho 100%):
  - `card.imagenUrl !== null` → `Image` de **`expo-image`** con `source={{ uri: card.imagenUrl }}`, `style` fill del bloque, `contentFit="cover"`, `recyclingKey={card.imagenUrl}`, `cachePolicy="memory-disk"`, `transition={0}`.
  - `card.imagenUrl === null` → `View` fondo `searchPalette.imagePlaceholder`, centrado: Ionicons `image-outline` (28, `searchPalette.textMuted`) + `Text` `Sin imagen` (`fontFamily.lato`, 12, `searchPalette.textMuted`).
- Pill de tipo: `View` absoluta top 10 / left 10, radio 12, padding vertical 4 / horizontal 10, fondo `card.tipo === "OBRA" ? searchPalette.tagObra : searchPalette.tagCurso`; `Text` blanco `lato-bold` 11: `card.tipo === "OBRA" ? "Obra" : "Capacitación"`.
- Cuerpo (padding 12, gap 6):
  - Título: `toTitleCase(card.titulo)`, `lato-bold` 13, `palette.texto`, `numberOfLines={2}`.
  - Fila ubicación: Ionicons `location` (12, `palette.guinda`) + `Text` `formatUbicacion(card.localidad, card.municipio)`, `lato` 12, `searchPalette.textMuted`, `numberOfLines={1}`.
  - Avance: `card.progreso !== null && card.estatus !== null ? <Text ...>{formatProgreso(card.progreso, card.estatus)}</Text> : null` (`lato` 12, `searchPalette.textMuted`). **Ternario estricto por presencia** (regla `rendering-no-falsy-and`; `progreso: 0` se pinta).

### 8.4 `presentation/SearchEmptyState.tsx`

Props: `{ variant: "initial" | "empty" | "error"; query?: string }`. `View` centrada (padding 32, gap 8) con icono Ionicons según variante (`search-outline` para initial/empty, `alert-circle-outline` para error; 36, `searchPalette.textMuted`) + `Text` (`lato` 14, `searchPalette.textMuted`, centrado):

- `initial` → `Escribe al menos 3 caracteres para buscar obras y capacitaciones.`
- `empty` → `Sin resultados para "{query}".` (query de la prop)
- `error` → `No se pudo completar la búsqueda.`

### 8.5 `presentation/SearchScreen.tsx`

Estructura (todo el estado llega por `useSearch()`; **prohibido** recibir use cases por props):

```tsx
const { useCases, query, debouncedQuery, isActive, setQuery, clearQuery } =
  useSearch();

const result = useInfiniteQuery<
  SearchPage,
  SearchError,
  InfiniteData<SearchPage>,
  readonly unknown[],
  number
>({
  queryKey: ["search", "global", debouncedQuery],
  queryFn: ({ pageParam, signal }) =>
    useCases.globalSearch(debouncedQuery, pageParam, signal),
  initialPageParam: 0,
  getNextPageParam: (lastPage) =>
    lastPage.isLast ? undefined : lastPage.page + 1,
  enabled: isActive,
  placeholderData: keepPreviousData,
});
```

Imports de query: `import { keepPreviousData, useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";`

Derivados:

```tsx
const cards = result.data?.pages.flatMap((page) => page.cards) ?? [];
const totalElements = result.data?.pages[0]?.totalElements ?? 0;
```

Hoisted a **module scope** (regla `list-performance`):

```tsx
const renderCard: ListRenderItem<SearchCard> = ({ item }) => (
  <View style={cardWrapperStyle}>
    <SearchResultCard card={item} />
  </View>
);

const keyExtractor = (item: SearchCard): string => `${item.tipo}-${item.id}`;
```

`import { FlashList, type ListRenderItem } from "@shopify/flash-list";` — **prohibido** `estimatedItemSize` (no existe en v2). `cardWrapperStyle`: `{ flex: 1, paddingHorizontal: 6, paddingBottom: 12 }` (hoisted en module scope o inline constante fuera del componente).

Layout del screen (`View flex: 1`, fondo `searchPalette.screenBg`, `paddingTop` con `useSafeAreaInsets` no necesario — el chrome ya lo maneja; padding horizontal 16):

1. **Fila título** (paddingTop 12, paddingBottom 12, gap 12, `alignItems: "center"`): `Pressable` back (Ionicons `arrow-back`, 24, `palette.texto`, `hitSlop` 12, `accessibilityLabel="Volver"`, `onPress={() => navigation.goBack()}`) + `Text` `BÚSQUEDA` (`lato-bold` 20, `palette.texto`).
2. `SearchInputBar`.
3. Área de resultados (`flex: 1`, `marginHorizontal: -16` en el wrapper de la lista para que el padding del grid lo controle `contentContainerStyle`):
   - `!isActive` → `SearchEmptyState variant="initial"`.
   - `isActive && result.isPending` → `ActivityIndicator` grande `palette.guinda` centrado (`View flex: 1`, centrado).
   - `isActive && result.isError` → `SearchEmptyState variant="error"`.
   - `isActive && result.isSuccess && cards.length === 0` → `SearchEmptyState variant="empty" query={debouncedQuery}`.
   - `cards.length > 0` → heading row (paddingTop 16, paddingHorizontal 16): `Text` `Resultado de búsqueda` (`lato-bold` 18, `palette.texto`) + `Text` contador (`lato` 13, `searchPalette.textMuted`): `totalElements === 1 ? "1 resultado" : \`${totalElements} resultados\``; y debajo:

```tsx
<FlashList
  data={cards}
  renderItem={renderCard}
  keyExtractor={keyExtractor}
  numColumns={2}
  onEndReached={handleEndReached}
  onEndReachedThreshold={0.4}
  contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 12, paddingBottom: 24 }}
  ListFooterComponent={
    result.isFetchingNextPage ? (
      <ActivityIndicator size="small" color={palette.guinda} style={{ paddingVertical: 16 }} />
    ) : null
  }
/>
```

`handleEndReached` (`useCallback`, deps estables): `if (result.hasNextPage && !result.isFetchingNextPage) { result.fetchNextPage(); }`.

Navegación: `const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();` con `import type { AppStackParamList } from "@/app/navigation/types";` (type-only: sin ciclo de imports en runtime) y `import { useNavigation } from "@react-navigation/native";` + `import type { NativeStackNavigationProp } from "@react-navigation/native-stack";`.

Reglas presentation: solo `Pressable`; ternarios estrictos (cero `&&` en JSX); cero `className`; cero `any`; `expo-image` y `@shopify/flash-list` **solo** aquí; cero imports de `infrastructure` ni `@/shared/infrastructure/**`.

## 9. Wire (TASK-05)

### 9.1 `src/app/navigation/types.ts`

`AppStackParamList` pasa a `{ Home: undefined; Search: undefined }`. `AuthStackParamList` y `RootStackParamList` intactos.

### 9.2 `src/app/navigation/RootNavigator.tsx`

Añadir `import { SearchScreen } from "@/features/search/presentation/SearchScreen";` y `<AppStack.Screen name="Search" component={SearchScreen} />` tras la screen `Home`. `AppShell`, `NavigationContainer key={status}`, `AuthStackNavigator` intactos.

### 9.3 `src/features/home/presentation/RadarSearchBar.tsx` (cero cambio de píxel)

Envolver el contenido actual en `Pressable` con `onPress={() => navigation.navigate("Search")}` (`useNavigation` tipado como §8.5), `accessibilityRole="button"`, `accessibilityLabel="Buscar"`, feedback `pressed` → opacity 0.9. Sustituir el `accessibilityLabel` anterior. **Cero** cambio visual.

### 9.4 `src/features/app-shell/presentation/menuItems.ts` (cero cambio de píxel)

`AppMenuAction` pasa a `"home" | "search" | "noop" | "sign-out"`; el ítem `search` cambia su `action` de `"noop"` a `"search"`. Labels e iconos intactos.

### 9.5 `src/features/app-shell/presentation/AppDrawer.tsx` (cero cambio de píxel)

En el handler de ítems: `action === "search"` → `onClose()` + `navigation.navigate("Search")` (`useNavigation` tipado como §8.5). `home`/`noop`/`sign-out` intactos. Cero cambio visual.

## 10. Skills aplicables (obligatorias)

- `list-performance` — FlashList: `renderItem`/`keyExtractor` hoisted, `recyclingKey` en `expo-image`, card en `memo`, cero funciones inline por celda.
- `react-state-minimize` — texto crudo y debounce en `SearchProvider`; el grid solo se re-renderiza cuando cambia `debouncedQuery` o las páginas.
- `rendering-no-falsy-and` — ternarios estrictos; `progreso: 0` y `totalElements: 0` se manejan por presencia/comparación, nunca truthiness.
- `js-hoist-intl` — helpers de formato en module scope (`format.ts`).
- `ui-pressable` — todo interactivo es `Pressable` con feedback.
- `navigation-native-navigators` — native stack; `goBack()` estándar.

## 11. Criterio de hecho técnico

- Arnés verde: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0.
- `git diff -- app.json app.config.js` vacío; `package.json` suma solo `@shopify/flash-list` + `expo-image` (CA-09).
- Bans: cero `any`/`TouchableOpacity`/`FlatList`/`expo-router`/`estimatedItemSize` en `src/**`.
- DIP: único importador de `search/infrastructure` = `compositionRoot.ts`; `@shopify/*`/`expo-image` ausentes de `domain`/`application`.
- Contrato: `/api/v1/app-mobile/global-search` aparece una sola vez en código (`AxiosGlobalSearchApi.ts`); `dto.ts` espejo de spec §4.6.
- Chrome/radar: `git diff` de `src/features/app-shell/**` y `src/features/home/**` limitado a los 4 archivos de §9.3–§9.5 (cero cambio visual).
- Árbol §1 poblado; `SearchScreen` montada en la ruta `Search`; TASK-06 `READY_FOR_REVIEW`; Fase 4 no iniciada.
