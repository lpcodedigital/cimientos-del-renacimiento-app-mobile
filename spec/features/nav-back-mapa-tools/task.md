# TASKS — nav-back-mapa-tools (Fase 4.5)

> **Estado global:** spec.md **APROBADA por el Humano (2026-10-28)** → TASK-01 **COMPLETED (2026-10-28)** (rebuild nativo + CA-08 validados por el Humano) → TASK-02 **COMPLETED (2026-10-28)** (header back implementado; arnés verde; CA-01…CA-05 validados en Android + iOS; limitación de timing Android detectada → originó TASK-02b) → **TASK-02b (hotfix, ENMIENDA 2026-10-28 aprobada por el Humano): header derivado por ruta activa — DESBLOQUEADA, pendiente de ejecución por el Worker en nueva sesión** → TASK-03 **BLOQUEADA** hasta cerrar TASK-02b. El Trabajador SOLO puede tocar los `allowed_files` de la TASK activa. El Revisor ejecuta el arnés al cierre de cada TASK (tsc + eslint) y la auditoría completa en TASK-04. El rebuild nativo y la validación visual/funcional en físico son EXCLUSIVOS del Humano.

## TASK-01 — Config iOS: expo-dev-client + LSApplicationQueriesSchemes

- **Objetivo:** corregir el «No script URL provided» del cold start iOS instalando `expo-dev-client` y habilitar la detección de apps de mapas (TASK-03) vía `LSApplicationQueriesSchemes`. Cero código de producto.
- **Secuencia:**
  1. [x] `npx expo install expo-dev-client` (NUNCA `npm i`).
  2. [x] Editar `app.json`: en `ios.infoPlist` añadir `"LSApplicationQueriesSchemes": ["comgooglemaps", "waze"]` (junto a `NSFaceIDUsageDescription`, intacta). Plan §3.
  3. [x] `npx tsc --noEmit` → exit 0.
  4. [x] Verificar gates: `git diff -- app.config.js` VACÍO; `git diff -- package.json` = SOLO `expo-dev-client` (+ lockfile).
  5. [x] **PARADA Y HANDOFF AL HUMANO:** el Humano ejecuta `npx expo prebuild` + `npx expo run:ios` + `npx expo run:android` y valida CA-08 (instalación limpia → primer arranque en frío sin pantalla roja; Android sin regresión).
- **allowed_files_to_edit:** `package.json`, `app.json` (+ lockfile vía expo install).
- **Status:** COMPLETED (2026-10-28) — rebuild nativo iOS/Android OK y CA-08 validado por el Humano (cold start iOS sin pantalla roja; Android sin regresión).

## TASK-02 — Header con modo back (app-shell + 3 screens)

- **Objetivo:** extender `HeaderTitleProvider` con `leftMode "menu" | "back"`, renderizar el back arrow en `AppHeader` cuando `leftMode === "back"`, y actualizar los setters de Home/Search/Detail eliminando las flechas del cuerpo. Verbatim: plan §4.
- **Secuencia:**
  1. [x] `HeaderTitleProvider.tsx`: añadir `HeaderLeftMode`, `leftMode`, `setLeftMode` (plan §4.1 verbatim).
  2. [x] `AppHeader.tsx`: ternario back/hamburguesa + `useNavigation` tipado (plan §4.3 verbatim).
  3. [x] `HomeScreen.tsx`: `useFocusEffect` setea `setTitle("INICIO")` + `setLeftMode("menu")` (plan §4.4).
  4. [x] `SearchScreen.tsx`: setea `setTitle("BÚSQUEDA")` + `setLeftMode("back")`; elimina la fila de back arrow del cuerpo y los imports huérfanos (plan §4.4).
  5. [x] `DetailScreen.tsx`: setea `setTitle("DETALLE")` + `setLeftMode("back")`; elimina la fila de back arrow del cuerpo y los imports huérfanos (plan §4.4).
  6. [x] Arnés: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 sin warnings (cero `no-unused-vars` por imports huérfanos).
  7. [x] Verificación: `git diff --stat -- src/features` = SOLO los 5 archivos de código de esta task; greps: cero `arrow-back` en cuerpos de Search/Detail; `AppStackParamList` importado solo en `AppHeader.tsx` (app-shell) y preexistentes.
- **allowed_files_to_edit:**
  - `src/features/app-shell/presentation/HeaderTitleProvider.tsx`
  - `src/features/app-shell/presentation/AppHeader.tsx`
  - `src/features/home/presentation/HomeScreen.tsx`
  - `src/features/search/presentation/SearchScreen.tsx`
  - `src/features/detail/presentation/DetailScreen.tsx`
- **Status:** COMPLETED (2026-10-28) — 7/7 pasos ejecutados; tsc/eslint exit 0 sin warnings; diff acotado a los 5 archivos. Humano validó CA-01…CA-05 en Android + iOS. **Limitación conocida detectada por el Humano (2026-10-28):** en Android el header muestra por unos ms el estado anterior (hamburguesa + «INICIO») al entrar a Search/Detail y la flecha de volver se percibe lenta / requiere varios toques (causa: setters por `useFocusEffect` post-foco + transición nativa Android; iOS fluido). **SUPERSEDED por TASK-02b (enmienda aprobada por el Humano 2026-10-28):** el mecanismo cambia a derivación por ruta activa (plan §4b); la limitación queda como motivo documentado del hotfix.

## TASK-02b — Hotfix: header derivado por ruta activa (ENMIENDA 2026-10-28)

- **Objetivo:** eliminar el flash del estado previo del header en Android cambiando el mecanismo de «setters por foco» a **derivación por ruta activa** (evento `"state"` del container raíz + mapa `HEADER_BY_ROUTE`), y eliminar `HeaderTitleProvider`/`useHeaderTitle`. Verbatim: plan §4b. Spec §4.1 enmendado. Cero dependencias nuevas.
- **Secuencia:**
  1. [ ] `AppHeader.tsx`: reescribir con derivación por ruta (plan §4.1b verbatim — mapa `HEADER_BY_ROUTE` hoisted, `resolveRouteName`, `useState` inicial + `addListener("state")`). **PROHIBIDO `useNavigationState`** (crashea fuera del navigator — spec §3).
  2. [ ] `AppShell.tsx`: eliminar import y wrapper `<HeaderTitleProvider>` (plan §4b.2 verbatim).
  3. [ ] `HomeScreen.tsx`: eliminar el `useFocusEffect` de título/modo + imports huérfanos (`useHeaderTitle`, `useFocusEffect`, `useCallback` si queda sin uso).
  4. [ ] `SearchScreen.tsx`: idem. NO reaparecer la fila de back del cuerpo.
  5. [ ] `DetailScreen.tsx`: idem. `route`, queries y contenido intactos.
  6. [ ] Borrar `HeaderTitleProvider.tsx` y `useHeaderTitle.ts` (`rm`; sin shims ni re-exports).
  7. [ ] Arnés: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 sin warnings.
  8. [ ] Verificación: greps = 0 para `useHeaderTitle` / `HeaderTitleProvider` / `setLeftMode` en `src/`; `git diff --stat -- src/` = SOLO los 5 editados + 2 eliminados; `git diff -- package.json app.json app.config.js` VACÍO.
  9. [ ] **HANDOFF AL HUMANO:** validación física — Android: al entrar a Search/Detail el header muestra `←` + título correcto DESDE el inicio de la transición (sin flash de `INICIO`/hamburguesa) y el back responde al primer toque; iOS: sin regresión; drawer operativo en Home.
- **allowed_files_to_edit:**
  - `src/features/app-shell/presentation/AppHeader.tsx`
  - `src/features/app-shell/presentation/AppShell.tsx`
  - `src/features/home/presentation/HomeScreen.tsx`
  - `src/features/search/presentation/SearchScreen.tsx`
  - `src/features/detail/presentation/DetailScreen.tsx`
  - `src/features/app-shell/presentation/HeaderTitleProvider.tsx` (ELIMINAR)
  - `src/features/app-shell/presentation/useHeaderTitle.ts` (ELIMINAR)
- **Status:** TODO — DESBLOQUEADA (enmienda aprobada por el Humano 2026-10-28; pendiente de ejecución por el Worker en nueva sesión).

## TASK-03 — Herramientas del mapa de Detail (recentrar + Abrir en Maps)

- **Objetivo:** dotar a `DetailMapCard` de botón flotante de recentrado y fila «Abrir en Maps» con `openExternalMap.ts`. Verbatim: plan §5. Cero dependencias nuevas (`Linking`/`Alert`/`Platform` son RN core; `Ionicons` ya autorizado).
- **Secuencia:**
  1. [ ] Crear `src/features/detail/presentation/openExternalMap.ts` (plan §5.1 verbatim).
  2. [ ] Reescribir `src/features/detail/presentation/DetailMapCard.tsx` (plan §5.2 verbatim): `ref` de MapView + `handleRecenter` (`animateToRegion`, deltas 0.02, 600 ms) + botón flotante `locate` + fila «Abrir en Maps» (`navigate-outline` + Lato Bold guinda).
  3. [ ] Arnés: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 sin warnings.
  4. [ ] Verificación: greps — `react-native-maps` solo en `DetailMapCard.tsx` (+ `RadarMap.tsx` preexistente); `Linking`/`Platform`/`Alert` de detail solo en `openExternalMap.ts`; `git diff -- package.json app.json app.config.js` VACÍO en esta task.
  5. [ ] **HANDOFF AL HUMANO:** validación física CA-06 (recentrar anima al pin) y CA-07 (iOS: selector con apps instaladas; Android: chooser nativo; cancelar no crashea).
- **allowed_files_to_edit:**
  - `src/features/detail/presentation/openExternalMap.ts` (nuevo)
  - `src/features/detail/presentation/DetailMapCard.tsx`
- **Status:** TODO — BLOQUEADA (gate: TASK-02b COMPLETED + aprobación del Humano).

## TASK-04 — Arnés / auditoría (solo lectura)

- **Objetivo:** auditoría completa de la fase, cero cambios de código de producto. Criterios: spec §9 (CA-01…CA-10) y plan §7.
- **Secuencia:**
  1. [ ] `npx tsc --noEmit` → exit 0; `npx eslint .` → exit 0 sin warnings.
  2. [ ] Bans (git grep sobre `src/**/*.ts(x)` + `App.tsx`): `any` = 0, `TouchableOpacity` = 0, `FlatList` = 0, `expo-router` = 0, `estimatedItemSize` = 0, `className` en archivos tocados = 0.
  3. [ ] Gates deps/config vs baseline pre-Fase-4.5: `package.json` = SOLO `expo-dev-client`; `app.json` = SOLO `LSApplicationQueriesSchemes`; `app.config.js`/`eslint.config.js`/`metro.config.js`/`babel.config.js` VACÍO.
  4. [ ] Features congeladas: diff acotado EXACTO a los allowed_files de TASK-01…03 (incluyendo las 2 eliminaciones de TASK-02b); `AppDrawer.tsx`, `AppBrandBar.tsx`, `menuItems.ts`, `RootNavigator.tsx`, `navigation/types.ts`, radar, contenidos de detail, componentes de search, domain/application/infrastructure, `compositionRoot.ts`, `App.tsx` SIN CAMBIOS. `AppShell.tsx` solo con el cambio de TASK-02b (retiro del wrapper).
  5. [ ] Confirmar CA-01…CA-05 por inspección de código; CA-06…CA-08 quedan firmados por el Humano en físico.
  6. [ ] Actualizar `progress/current-task.json` + `progress/history.md` con el resultado de la auditoría.
- **allowed_files_to_edit:** `spec/features/nav-back-mapa-tools/task.md`, `progress/current-task.json`, `progress/history.md`.
- **Status:** TODO — BLOQUEADA (gate: TASK-03 COMPLETED + aprobación del Humano).
