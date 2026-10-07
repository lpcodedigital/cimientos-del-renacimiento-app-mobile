# TASK — radar-home

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 2b — Radar Territorial
**Feature:** `radar-home`
**Ejecutor:** Agente Trabajador
**Auditor:** Agente Revisor (tras TASK-06)
**Tester visual / `expo start`:** Humano — prohibido a agentes
**Fecha:** 2026-10-06

Leer antes de tocar código: `spec.md`, `plan.md`, `/spec/constitution/tech-stack.md` (§2.3, §2.4 y §5), `/spec/constitution/roadmap.md` (Fase 2b enmendada), `/AGENTS.md`.

Reglas absolutas del Trabajador:

- SOLO editar archivos listados en `allowed_files` de la task activa.
- Únicas dependencias nuevas: `react-native-maps` + `expo-location`, SOLO en TASK-01, SIEMPRE `npx expo install`, NUNCA `npm i`.
- Cero `.swift`, `.kt`, `.java`, `.pbxproj`, `Info.plist`, `AndroidManifest.xml` a mano. `app.json` solo en TASK-01.
- Cero Expo Router. Cero `any`. Cero `TouchableOpacity`. Cero `FlatList`. Cero emojis en UI. Cero fuentes ≠ Lato. Cero paleta `auth-*`. Cero labels de texto en pines.
- Cero lógica de búsqueda / FlashList / Fase 3. Cero detalle de municipio / Cloudflare / Fase 4.
- Cero cambios en `src/features/auth/**` y `src/features/app-shell/**` (chrome congelado, invariante CA-07).
- Transcribir copy/layout desde spec §4.5 y contrato desde spec §4.6. Prohibido releer/inventar del PNG. Prohibido replicar los artefactos de spec §4.7.
- Estilos **inline JS** con `radarPalette` / `appPalette` / `palette` / `fontFamily`. Cero `className` en archivos nuevos (NativeWind v5 iOS).
- Al terminar cada task: marcar `- [x]`, actualizar `progress/current-task.json` y `progress/history.md`.
- No correr `npx expo start`. El arnés lo corre el Trabajador solo en TASK-06.

**TASK-01 no inicia** hasta autorización explícita del Humano en nueva sesión tras aprobar `spec.md` **y entregar la API key de Google Maps Android**.

---

## TASK-01 — Tokens `radar-*` + dependencias + plugins

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** Registrar paleta del radar e instalar mapas/ubicación con sus plugins. Sin componentes.

**Gate del Humano:** entregar la API key de Google Maps Android antes de ejecutar el paso de `app.json`.

**Pasos**

- [ ] `global.css`: añadir los 5 `--color-radar-*` del plan §3.1 dentro de `@theme`. No tocar tokens Fase 1, `auth-*` ni `app-*`.
- [ ] `src/shared/theme/tokens.ts`: añadir `radarPalette` (plan §3.2, verbatim). No modificar `palette`, `fontFamily`, `authPalette`, `appPalette`.
- [ ] `npx expo install react-native-maps expo-location` (documentar versiones instaladas en `history.md`).
- [ ] `app.json`: añadir plugin `["expo-location", { "locationWhenInUsePermission": "El Gabinete Móvil usa tu ubicación para centrar el radar territorial y mostrar el municipio donde te encuentras." }]` y `android.config.googleMaps.apiKey` con la key del Humano. Cero otro cambio.
- [ ] `npx tsc --noEmit` debe pasar.
- [ ] `git diff -- app.json` muestra SOLO los dos cambios anteriores.

**allowed_files**

- `global.css`
- `src/shared/theme/tokens.ts`
- `package.json`
- `package-lock.json`
- `app.json`
- `spec/features/radar-home/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** Tokens `radar-*` disponibles. Deps instaladas. `app.json` con plugin location + key Android del Humano. TypeCheck verde. Cero componentes creados.

---

## TASK-02 — Domain + Application (cero UI)

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** Capas internas de `home` con firmas verbatim de plan §4–§5. Sin consumidores.

**Pasos**

- [ ] `domain/entities/GeoPosition.ts`, `domain/entities/MunicipioRadar.ts`, `domain/errors/RadarError.ts`, `domain/ports/RadarMapRepository.ts`, `domain/ports/LocationGateway.ts` (plan §4, verbatim).
- [ ] `application/types.ts`, `application/loadRadarMap.ts`, `application/getCurrentLocation.ts`, `application/requestLocationAccess.ts`, `application/resolveDeviceMunicipio.ts` (plan §5, verbatim; closures, no clases).
- [ ] Domain: cero imports de React/RN/Expo/Axios/Query/maps. Application: solo `../domain/...` + `./types`.
- [ ] `getCurrentLocation` **sin prompt** (solo lee permiso); `requestLocationAccess` **con prompt**.
- [ ] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `src/features/home/domain/entities/GeoPosition.ts`
- `src/features/home/domain/entities/MunicipioRadar.ts`
- `src/features/home/domain/errors/RadarError.ts`
- `src/features/home/domain/ports/RadarMapRepository.ts`
- `src/features/home/domain/ports/LocationGateway.ts`
- `src/features/home/application/types.ts`
- `src/features/home/application/loadRadarMap.ts`
- `src/features/home/application/getCurrentLocation.ts`
- `src/features/home/application/requestLocationAccess.ts`
- `src/features/home/application/resolveDeviceMunicipio.ts`
- `spec/features/radar-home/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** 9 archivos, cero UI, cero infra, cero consumidores. TypeCheck verde. Cero `any`, cero comentarios, cero barrels.

---

## TASK-03 — Infrastructure + compositionRoot + HomeProvider + fences

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** Adapters concretos + wiring DI + provider de presentation + fences ESLint. Sin componentes de mapa.

**Pasos**

- [ ] `infrastructure/dto.ts` (`MunicipioResumenDTO` espejo 1:1, plan §6.1).
- [ ] `infrastructure/AxiosRadarMapApi.ts` → `createAxiosRadarMapApi` (plan §6.2): `GET /api/v1/dashboard/mapa-home`, mapper 1:1 (`nombre: dto.municipio`), errores → `radarError("radar_unavailable")`.
- [ ] `infrastructure/ExpoLocationGateway.ts` → `createExpoLocationGateway` (plan §6.3): permisos, posición y reverse geocode (`city ?? subregion ?? region ?? null`), `try/catch` → `null`.
- [ ] `src/app/compositionRoot.ts`: añadir `createHomeUseCases()` (plan §6.4) **sin tocar** `createAuthUseCases`.
- [ ] `src/features/home/presentation/HomeProvider.tsx` + `src/features/home/presentation/useHomeRadar.ts` (plan §7): estado UI del radar + `nonce` de cámara + `requestInitialCamera` con ref guard.
- [ ] `App.tsx`: `createHomeUseCases()` + `<HomeProvider useCases={homeUseCases}>` dentro de `AuthProvider` (plan §6.6). Conservar fuentes, QueryClient, StatusBar.
- [ ] `eslint.config.js`: añadir `expo-location` + `react-native-maps` a los bans de domain/application; `expo-location` al ban de presentation/navigation/shared-ui (plan §6.5).
- [ ] `npx tsc --noEmit` y `npx eslint .` deben pasar.

**allowed_files**

- `src/features/home/infrastructure/dto.ts`
- `src/features/home/infrastructure/AxiosRadarMapApi.ts`
- `src/features/home/infrastructure/ExpoLocationGateway.ts`
- `src/app/compositionRoot.ts`
- `src/features/home/presentation/HomeProvider.tsx`
- `src/features/home/presentation/useHomeRadar.ts`
- `App.tsx`
- `eslint.config.js`
- `spec/features/radar-home/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** Infra implementada y cableada; provider activo en el árbol; fences actualizados; tsc + eslint verdes. Cero componente de mapa todavía. `createAuthUseCases` y auth intactos por diff.

---

## TASK-04 — Componentes del radar (sin wire al navigator)

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** UI completa del radar según plan §8 y spec §4.5. `RootNavigator`/`types.ts` no se tocan; el placeholder sigue montado.

**Pasos**

- [ ] `presentation/format.ts` (plan §8.7): `formatMdp`, `toTitleCase`, formatter hoisted.
- [ ] `RadarSearchBar.tsx` (plan §8.1): pill verbatim spec §4.5, **View + Text, no interactiva**.
- [ ] `RadarChipRow.tsx` (plan §8.2): «MI UBICACIÓN» fijo primero + chips del array en orden; activo `chipActive`; `Pressable`.
- [ ] `DeviceMunicipioLabel.tsx` (plan §8.3): pill blanca + pin guinda + `deviceMunicipio ?? "—"`.
- [ ] `RadarMap.tsx` (plan §8.4): `MapView` + `Marker pinColor` (guinda municipios / dorado GPS), efecto de cámara por `cameraRequest`, `useImperativeHandle` con `getPointForCoordinate`.
- [ ] `RadarRipple.tsx` (plan §8.5): 3 anillos Reanimated (`withRepeat`, scale+opacity, delays 0/220/440). Solo transform/opacity.
- [ ] `MunicipioCallout.tsx` (plan §8.6): header + X, 3 columnas KPI, cola, `Ver más` no-op.
- [ ] `HomeScreen.tsx` (plan §8.8): `useQuery(["radar","mapa-home"])`, layout overlay, loading/error/empty, `requestInitialCamera` una vez, ripple al abrir popup.
- [ ] `npx tsc --noEmit` y `npx eslint .` deben pasar.

**Notas de implementación (el Trabajador documenta aquí desviaciones):**

- _(pendiente)_

**allowed_files**

- `src/features/home/presentation/format.ts`
- `src/features/home/presentation/RadarSearchBar.tsx`
- `src/features/home/presentation/RadarChipRow.tsx`
- `src/features/home/presentation/DeviceMunicipioLabel.tsx`
- `src/features/home/presentation/RadarMap.tsx`
- `src/features/home/presentation/RadarRipple.tsx`
- `src/features/home/presentation/MunicipioCallout.tsx`
- `src/features/home/presentation/HomeScreen.tsx`
- `spec/features/radar-home/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** 8 archivos de UI creados. Nadie importa `HomeScreen` aún. tsc + eslint verdes. Cero `className`, cero `any`, solo `Pressable`, solo tokens `radar-*`/`app-*`/Fase 1.

---

## TASK-05 — Wire navigator + borrado del placeholder

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** `Home` (radar) como pantalla autenticada. Chrome 2a intacto.

**Pasos**

- [ ] `navigation/types.ts`: `AppStackParamList = { Home: undefined }`.
- [ ] `RootNavigator.tsx`: `HomeScreen` en `AppStack.Screen name="Home"`. `AppShell`, `NavigationContainer key={status}`, Auth stack **intactos**.
- [ ] `git rm src/features/home/presentation/HomePlaceholderScreen.tsx`.
- [ ] `npx tsc --noEmit` y `npx eslint .` deben pasar.

**allowed_files**

- `src/app/navigation/types.ts`
- `src/app/navigation/RootNavigator.tsx`
- `src/features/home/presentation/HomePlaceholderScreen.tsx` (borrado)
- `spec/features/radar-home/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** App autenticada muestra el radar dentro del chrome 2a. Placeholder eliminado. tsc + eslint verdes.

---

## TASK-06 — Arnés

**Status:** TODO
**assigned_role:** Trabajador + Revisor

**Pasos**

- [ ] `npx tsc --noEmit` → exit 0.
- [ ] `npx eslint .` → exit 0 (cero warnings).
- [ ] Grep `src/**/*.ts(x)` + `App.tsx`: cero `any`, `TouchableOpacity`, `FlatList`, `expo-router`, paleta `auth-*` fuera de auth.
- [ ] DIP: único importador de `home/infrastructure` = `compositionRoot.ts`; `expo-location`/`react-native-maps` ausentes de domain/application; `expo-location` ausente de presentation.
- [ ] `git diff HEAD -- package.json` muestra SOLO `react-native-maps` + `expo-location`; `app.json` SOLO plugin location + key Android.
- [ ] Contrato: grep del path `/api/v1/dashboard/mapa-home` único en `AxiosRadarMapApi.ts`; wire DTO espejo de spec §4.6.
- [ ] Chrome: `git diff` de `src/features/app-shell/**` y `src/features/auth/**` vacío.

**allowed_files**

- `spec/features/radar-home/task.md`
- `progress/current-task.json`
- `progress/history.md`

Si el arnés falla, correcciones **solo** en archivos de TASK-01…05 (el Humano/Revisor autoriza el allowed_files extra). No "arreglar" auth ni chrome.

**Definition of done:** CA-08, CA-09 y CA-10 listos. TASK-06 `READY_FOR_REVIEW`. Fase 3 no abierta.

---

Prohibido planificar Fase 3 (búsqueda predictiva) hasta que el Revisor audite y el Humano apruebe visualmente la Fase 2b (`roadmap.md`).
