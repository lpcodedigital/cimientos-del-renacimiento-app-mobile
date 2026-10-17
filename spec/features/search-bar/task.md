# TASK — search-bar (Fase 3)

**Worker:** Agente Trabajador (ejecuta UNA task por sesión, solo con autorización del Humano)
**Auditor:** Agente Revisor (tras TASK-06)
**Tester:** Humano (dispositivo físico iOS + Android)

**Reglas globales (todas las TASK):**

- Cero `any`, `TouchableOpacity`, `FlatList`, `expo-router`, `estimatedItemSize`, `className`, comentarios, emojis, barrels `index.ts`.
- Cero código nativo (`.swift`/`.kt`/`.java`/`.pbxproj`/`Info.plist`/`AndroidManifest.xml`).
- Cero dependencias fuera de la whitelist del spec (CA-09). Installs solo con `npx expo install` (NUNCA `npm i`).
- Cero commit. Cero `npx expo start` / `prebuild` / `run:*` (reservado al Humano).
- Paleta `auth-*` prohibida. `searchPalette.accent` prohibido en Fase 3 (reservado Fase 4).
- Solo `Pressable`. Ternarios estrictos en JSX (cero `&&` con valores posiblemente falsy-numéricos).
- Firmas **verbatim** de `plan.md`. Copy **verbatim** de `spec.md` §4.5.
- `npx tsc --noEmit` en verde al cerrar cada TASK.
- No correr `npx expo start`. El arnés lo corre el Trabajador solo en TASK-06.

---

## TASK-01 — Tokens `search-*` + dependencias (FlashList + expo-image)

**Status:** COMPLETED
**assigned_role:** Trabajador
**Gate previo (Humano):** spec.md aprobada. El rebuild nativo posterior es del Humano.

**Pasos**

- [x] `global.css`: añadir los 8 tokens `--color-search-*` dentro del `@theme` existente (plan §3.1, verbatim). Tokens Fase 1, `auth-*`, `app-*`, `radar-*` intactos.
- [x] `src/shared/theme/tokens.ts`: añadir `searchPalette` (plan §3.2, verbatim) al final del archivo. Resto de paletas intactas.
- [x] `npx expo install @shopify/flash-list expo-image` (solo esas dos).
- [x] Verificar `git diff -- app.json app.config.js` → **vacío** (ninguna requiere plugin).
- [x] `npx tsc --noEmit` → exit 0.

**allowed_files**

- `global.css`
- `src/shared/theme/tokens.ts`
- `package.json` / `package-lock.json` (solo vía `npx expo install`)
- `spec/features/search-bar/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Validación (Humano):** revisar diff de tokens y `package.json` (solo las 2 deps nuevas). Rebuild nativo (`npx expo prebuild` + `run:ios`/`run:android`) — FlashList es módulo nativo; sin rebuild la app no compila los módulos nuevos. Tras aprobarla, TASK-01 → COMPLETED y se autoriza TASK-02 en nueva sesión.

---

## TASK-02 — Domain + Application de search

**Status:** COMPLETED
**assigned_role:** Trabajador

**Pasos (6 archivos nuevos, firmas verbatim de plan §4–§5; cero consumidores)**

- [x] `src/features/search/domain/entities/SearchCard.ts` (plan §4.1).
- [x] `src/features/search/domain/entities/SearchPage.ts` (plan §4.2).
- [x] `src/features/search/domain/errors/SearchError.ts` (plan §4.3, incluye `isSearchError`).
- [x] `src/features/search/domain/ports/SearchRepository.ts` (plan §4.4).
- [x] `src/features/search/application/types.ts` (plan §5.1).
- [x] `src/features/search/application/globalSearch.ts` (plan §5.2; deja subir `SearchError` sin catch).
- [x] Grep de capas: `domain/` solo imports relativos; `application/` solo `../domain/...` + `./types`; cero React/Expo/Axios/TanStack/FlashList/expo-image.
- [x] `npx tsc --noEmit` → exit 0.

**allowed_files**

- `src/features/search/domain/**` (los 4 archivos)
- `src/features/search/application/**` (los 2 archivos)
- `spec/features/search-bar/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Validación (Humano):** revisar los 6 archivos (firmas verbatim, capas limpias). Tras aprobarla, TASK-02 → COMPLETED y se autoriza TASK-03 en nueva sesión.

---

## TASK-03 — Infrastructure + compositionRoot + SearchProvider + fences

**Status:** COMPLETED
**assigned_role:** Trabajador

**Pasos (4 archivos nuevos + 3 editados, verbatim de plan §6–§7)**

- [x] `src/features/search/infrastructure/dto.ts` (plan §6.1).
- [x] `src/features/search/infrastructure/AxiosGlobalSearchApi.ts` (plan §6.2; path del endpoint solo aquí; cancelación re-lanzada intacta).
- [x] `src/features/search/presentation/SearchProvider.tsx` (plan §7, verbatim con `SEARCH_MIN_CHARS`/`SEARCH_DEBOUNCE_MS`).
- [x] `src/features/search/presentation/useSearch.ts` (plan §7).
- [x] `src/app/compositionRoot.ts`: añadir `createSearchUseCases()` (plan §6.3; `createAuthUseCases`/`createHomeUseCases` intactos — solo adiciones).
- [x] `App.tsx`: `searchUseCases` a nivel de módulo + `<SearchProvider>` dentro de `<HomeProvider>` (plan §6.4).
- [x] `eslint.config.js`: `@shopify/*` + `expo-image` añadidos a los bans de `domain/**` y `application/**` (plan §6.5). Bloque presentation/navigation sin cambios.
- [x] Grep DIP: único importador de `search/infrastructure` = `compositionRoot.ts`; `@shopify/*`/`expo-image` ausentes de `domain`/`application`.
- [x] `npx tsc --noEmit` → exit 0. `git diff -- package.json app.json app.config.js` → vacío.

**allowed_files**

- `src/features/search/infrastructure/**` (los 2 archivos)
- `src/features/search/presentation/SearchProvider.tsx`
- `src/features/search/presentation/useSearch.ts`
- `src/app/compositionRoot.ts`
- `App.tsx`
- `eslint.config.js`
- `spec/features/search-bar/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Validación (Humano):** revisar firmas verbatim, mapper 1:1 (campos opcionales → `null`), DIP y fences. Aprobada por el Humano el 2026-10-16: TASK-03 → COMPLETED. TASK-04 se autoriza en nueva sesión con prompt de ejecución.

---

## TASK-04 — Componentes de búsqueda (sin wire al navigator)

**Status:** COMPLETED
**assigned_role:** Trabajador

**Pasos (5 archivos nuevos, plan §8 + spec §4.5; nadie importa `SearchScreen` todavía)**

- [x] `src/features/search/presentation/format.ts` (plan §8.1, verbatim; `toTitleCase` duplicado deliberadamente — prohibido importar de `home`).
- [x] `src/features/search/presentation/SearchInputBar.tsx` (plan §8.2: pill blanca, lupa, `TextInput` autoFocus con placeholder verbatim, X solo con texto que llama `clearQuery` sin quitar foco).
- [x] `src/features/search/presentation/SearchResultCard.tsx` (plan §8.3: `memo`, imagen `expo-image` 4:3 con `recyclingKey`/`memory-disk` o fallback «Sin imagen», pill de tipo, título Title Case 2 líneas, ubicación, avance solo con campos presentes — `0%` se pinta).
- [x] `src/features/search/presentation/SearchEmptyState.tsx` (plan §8.4: variantes `initial`/`empty`/`error`, copy verbatim).
- [x] `src/features/search/presentation/SearchScreen.tsx` (plan §8.5: `useInfiniteQuery` con `queryKey` debounced + `keepPreviousData` + `enabled: isActive`; `renderCard`/`keyExtractor` hoisted; FlashList `numColumns={2}` sin `estimatedItemSize`; heading + contador; spinner central/footer; back arrow con `navigation.goBack()`).
- [x] Grep: `expo-image` y `@shopify/flash-list` solo en estos archivos; cero imports de `infrastructure`; cero `FlatList`/`estimatedItemSize`/`any`/`TouchableOpacity`.
- [x] `npx tsc --noEmit` → exit 0; `npx eslint .` → exit 0. `git diff -- package.json app.json` → vacío.

**Nota:** el screen referencia `AppStackParamList` con la ruta `Search` (type-only import). Si `types.ts` aún no la declara (se añade en TASK-05), añadirla **en esta TASK** como excepción tipada: `Search: undefined` en `AppStackParamList` (archivo permitido abajo). RootNavigator NO se toca en esta TASK.

**allowed_files**

- `src/features/search/presentation/format.ts`
- `src/features/search/presentation/SearchInputBar.tsx`
- `src/features/search/presentation/SearchResultCard.tsx`
- `src/features/search/presentation/SearchEmptyState.tsx`
- `src/features/search/presentation/SearchScreen.tsx`
- `src/app/navigation/types.ts` (solo añadir `Search: undefined`)
- `spec/features/search-bar/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Validación (Humano):** revisión de código (la pantalla aún no se ve: no hay ruta montada). Aprobada por el Humano el 2026-10-17: TASK-04 → COMPLETED. TASK-05 se autoriza en nueva sesión con prompt de ejecución.

---

## TASK-05 — Wire navigator + entradas de navegación (cero cambio de píxel)

**Status:** TODO
**assigned_role:** Trabajador

**Pasos (4 archivos editados, plan §9; `types.ts` ya trae `Search` de TASK-04)**

- [ ] `src/app/navigation/RootNavigator.tsx`: import de `SearchScreen` + `<AppStack.Screen name="Search" component={SearchScreen} />` tras `Home` (plan §9.2). `AppShell`/`NavigationContainer key={status}`/`AuthStackNavigator` intactos.
- [ ] `src/features/home/presentation/RadarSearchBar.tsx`: envolver en `Pressable` que navega a `Search` (plan §9.3). Cero cambio visual; sustituir `accessibilityLabel` por `Buscar`.
- [ ] `src/features/app-shell/presentation/menuItems.ts`: `AppMenuAction` añade `"search"`; ítem `search` con `action: "search"` (plan §9.4). Labels/iconos intactos.
- [ ] `src/features/app-shell/presentation/AppDrawer.tsx`: `action === "search"` → `onClose()` + `navigation.navigate("Search")` (plan §9.5). Cero cambio visual.
- [ ] Grep: `git diff -- src/features/app-shell src/features/home` muestra **solo** los 3 archivos anteriores (acciones, cero píxel).
- [ ] `npx tsc --noEmit` → exit 0; `npx eslint .` → exit 0. `git diff -- package.json app.json app.config.js` → vacío.

**allowed_files**

- `src/app/navigation/RootNavigator.tsx`
- `src/features/home/presentation/RadarSearchBar.tsx`
- `src/features/app-shell/presentation/menuItems.ts`
- `src/features/app-shell/presentation/AppDrawer.tsx`
- `spec/features/search-bar/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Validación (Humano, dispositivos Android + iOS):** checklist CA-01…07 — entrada desde la barra del Home y desde el drawer (el drawer se cierra); `autoFocus` + teclado; back arrow vuelve al radar; búsqueda real (ej. `merida`, `temozon`); spinner central en 1ª carga; contador; grid 2 columnas con pills `Obra`/`Capacitación`; fallback «Sin imagen» en tarjetas sin `imagenUrl`; avance solo en obras; scroll infinito con spinner al pie; X limpia todo y conserva foco; empty state con query sin resultados; radar y chrome pixel-idénticos (pines, chips, popup, ripple, drawer, logout). Tras aprobarla, TASK-05 → COMPLETED y se autoriza TASK-06 en nueva sesión.

---

## TASK-06 — Arnés

**Status:** TODO
**assigned_role:** Trabajador + Revisor

**Pasos**

- [ ] `npx tsc --noEmit` → exit 0.
- [ ] `npx eslint .` → exit 0 (cero warnings).
- [ ] Grep `src/**/*.ts(x)` + `App.tsx`: cero `any`, `TouchableOpacity`, `FlatList`, `expo-router`, `estimatedItemSize`, paleta `auth-*` fuera de auth, `searchPalette.accent` fuera de `tokens.ts`.
- [ ] DIP: único importador de `search/infrastructure` = `compositionRoot.ts`; `@shopify/*`/`expo-image` ausentes de `domain`/`application`; `@shopify/flash-list` y `expo-image` solo en `search/presentation`.
- [ ] Deps: `git diff` de `package.json` contra baseline pre-Fase-3 muestra SOLO `@shopify/flash-list` + `expo-image`; `app.json`/`app.config.js` sin cambios por la feature.
- [ ] Contrato: grep del path `/api/v1/app-mobile/global-search` único en `AxiosGlobalSearchApi.ts`; `infrastructure/dto.ts` espejo de spec §4.6.
- [ ] Chrome/radar: `git diff` de `src/features/app-shell/**` y `src/features/home/**` muestra solo los 3 archivos de acciones de TASK-05 (más `RadarSearchBar` ya listado); cero otro cambio.

**allowed_files**

- `spec/features/search-bar/task.md`
- `progress/current-task.json`
- `progress/history.md`

Si el arnés falla, correcciones **solo** en archivos de TASK-01…05 (el Humano/Revisor autoriza el allowed_files extra). No "arreglar" auth, chrome ni radar.

**Definition of done:** CA-08, CA-09 y CA-10 listos; TASK-06 COMPLETED (cierre formal del Humano). Fase 4 no abierta.

---

Prohibido planificar Fase 4 (ficha/detalle) hasta que el Revisor audite y el Humano apruebe visualmente la Fase 3 (`roadmap.md`).
