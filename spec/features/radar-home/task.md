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

**Status:** COMPLETED
**assigned_role:** Trabajador

**Objetivo:** Registrar paleta del radar e instalar mapas/ubicación con sus plugins. Sin componentes.

**Aprobación del Humano:** validada y aprobada 2026-10-06 (diff de `app.json` y `package.json` revisados; rebuild nativo OK). TASK-02 NO se inicia en esta sesión.

**Gate del Humano:** entregar la API key de Google Maps Android antes de ejecutar el paso de `app.json`.

**Pasos**

- [x] `global.css`: añadir los 5 `--color-radar-*` del plan §3.1 dentro de `@theme`. No tocar tokens Fase 1, `auth-*` ni `app-*`.
- [x] `src/shared/theme/tokens.ts`: añadir `radarPalette` (plan §3.2, verbatim). No modificar `palette`, `fontFamily`, `authPalette`, `appPalette`.
- [x] `npx expo install react-native-maps expo-location` (documentar versiones instaladas en `history.md`).
- [x] `app.json`: añadir plugin `["expo-location", { "locationWhenInUsePermission": "El Gabinete Móvil usa tu ubicación para centrar el radar territorial y mostrar el municipio donde te encuentras." }]` y `android.config.googleMaps.apiKey` con la key del Humano. Cero otro cambio.
- [x] `npx tsc --noEmit` debe pasar.
- [x] `git diff -- app.json` muestra SOLO los dos cambios anteriores.

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

**Status:** COMPLETED
**assigned_role:** Trabajador

**Aprobación del Humano:** validada y aprobada 2026-10-06 (10 archivos, firmas verbatim de plan §4–§5, capas limpias; tsc exit 0). TASK-03 NO se inicia en esta sesión.

**Objetivo:** Capas internas de `home` con firmas verbatim de plan §4–§5. Sin consumidores.

**Pasos**

- [x] `domain/entities/GeoPosition.ts`, `domain/entities/MunicipioRadar.ts`, `domain/errors/RadarError.ts`, `domain/ports/RadarMapRepository.ts`, `domain/ports/LocationGateway.ts` (plan §4, verbatim).
- [x] `application/types.ts`, `application/loadRadarMap.ts`, `application/getCurrentLocation.ts`, `application/requestLocationAccess.ts`, `application/resolveDeviceMunicipio.ts` (plan §5, verbatim; closures, no clases).
- [x] Domain: cero imports de React/RN/Expo/Axios/Query/maps. Application: solo `../domain/...` + `./types`.
- [x] `getCurrentLocation` **sin prompt** (solo lee permiso); `requestLocationAccess` **con prompt**.
- [x] `npx tsc --noEmit` debe pasar.

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

**Status:** COMPLETED
**assigned_role:** Trabajador

**Aprobación del Humano:** validada y aprobada 2026-10-06 (5 archivos nuevos + 3 editados; firmas verbatim de plan §6–§7; mapper 1:1; mapeo `PermissionStatus`; DIP verificado; `tsc` + `eslint` exit 0). TASK-04 NO se inicia en esta sesión.

**Objetivo:** Adapters concretos + wiring DI + provider de presentation + fences ESLint. Sin componentes de mapa.

**Pasos**

- [x] `infrastructure/dto.ts` (`MunicipioResumenDTO` espejo 1:1, plan §6.1).
- [x] `infrastructure/AxiosRadarMapApi.ts` → `createAxiosRadarMapApi` (plan §6.2): `GET /api/v1/dashboard/mapa-home`, mapper 1:1 (`nombre: dto.municipio`), errores → `radarError("radar_unavailable")`.
- [x] `infrastructure/ExpoLocationGateway.ts` → `createExpoLocationGateway` (plan §6.3): permisos, posición y reverse geocode (`city ?? subregion ?? region ?? null`), `try/catch` → `null`.
- [x] `src/app/compositionRoot.ts`: añadir `createHomeUseCases()` (plan §6.4) **sin tocar** `createAuthUseCases`.
- [x] `src/features/home/presentation/HomeProvider.tsx` + `src/features/home/presentation/useHomeRadar.ts` (plan §7): estado UI del radar + `nonce` de cámara + `requestInitialCamera` con ref guard.
- [x] `App.tsx`: `createHomeUseCases()` + `<HomeProvider useCases={homeUseCases}>` dentro de `AuthProvider` (plan §6.6). Conservar fuentes, QueryClient, StatusBar.
- [x] `eslint.config.js`: añadir `expo-location` + `react-native-maps` a los bans de domain/application; `expo-location` al ban de presentation/navigation/shared-ui (plan §6.5).
- [x] `npx tsc --noEmit` y `npx eslint .` deben pasar.

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

**Status:** COMPLETED
**assigned_role:** Trabajador

**Aprobación del Humano:** validada y aprobada 2026-10-06 (8 archivos de UI con firmas/layout verbatim de plan §8 y copy de spec §4.5; estilos inline JS con `radar-*`/`app-*`/`palette`; solo `Pressable`; `tsc` + `eslint` exit 0; nadie importa `HomeScreen`, el placeholder sigue montado). Comportamiento verificado en dispositivo: la app se ve idéntica tras login, que es lo esperado al no estar cableada la pantalla. TASK-05 NO se inicia en esta sesión; la autoriza el Humano en nueva sesión.

**Objetivo:** UI completa del radar según plan §8 y spec §4.5. `RootNavigator`/`types.ts` no se tocan; el placeholder sigue montado.

**Pasos**

- [x] `presentation/format.ts` (plan §8.7): `formatMdp`, `toTitleCase`, formatter hoisted.
- [x] `RadarSearchBar.tsx` (plan §8.1): pill verbatim spec §4.5, **View + Text, no interactiva**.
- [x] `RadarChipRow.tsx` (plan §8.2): «MI UBICACIÓN» fijo primero + chips del array en orden; activo `chipActive`; `Pressable`.
- [x] `DeviceMunicipioLabel.tsx` (plan §8.3): pill blanca + pin guinda + `deviceMunicipio ?? "—"`.
- [x] `RadarMap.tsx` (plan §8.4): `MapView` + `Marker pinColor` (guinda municipios / dorado GPS), efecto de cámara por `cameraRequest`, `useImperativeHandle` con `getPointForCoordinate`.
- [x] `RadarRipple.tsx` (plan §8.5): 3 anillos Reanimated (`withRepeat`, scale+opacity, delays 0/220/440). Solo transform/opacity.
- [x] `MunicipioCallout.tsx` (plan §8.6): header + X, 3 columnas KPI, cola, `Ver más` no-op.
- [x] `HomeScreen.tsx` (plan §8.8): `useQuery(["radar","mapa-home"])`, layout overlay, loading/error/empty, `requestInitialCamera` una vez, ripple al abrir popup.
- [x] `npx tsc --noEmit` y `npx eslint .` deben pasar.

**Notas de implementación (desviaciones menores):**

- `format.ts` se creó como módulo propio (plan §8.7 lo permitía en `HomeScreen.tsx` o módulo aparte).
- `MunicipioCallout` se compone dentro de la columna overlay superior, justo después de `DeviceMunicipioLabel`, para quedar ~16 px bajo la etiqueta de dispositivo (plan §8.6: «`top` ≈ 16 bajo la etiqueta»). El root del componente es `alignSelf: "center"` + `width: "88%"` + `maxWidth: 340` + `zIndex: 20` (no `position: absolute` propio, porque el anclaje es la etiqueta anterior). La cola es el último hijo del cuerpo con `marginBottom: -8` verbatim.
- `RadarMap`: el efecto de cámara usa deps `[cameraRequest]` según plan §8.4; los municipios se leen del render vigente al cambiar la petición.
- `HomeScreen`: `RadarChipRow` se envuelve en un `View` con `marginHorizontal: -16` para que el scroll lateral sea full-bleed mientras la columna overlay conserva `paddingHorizontal: 16` (plan §8.8) y el `contentContainerStyle` del chip row conserva su padding de 16 (plan §8.2).
- Sin `any`, sin `TouchableOpacity`, sin `FlatList`, sin `expo-router`, sin `className`, sin comentarios, sin emojis. Nadie importa `HomeScreen` aún (placeholder sigue montado).

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

**Status:** COMPLETED
**assigned_role:** Trabajador

**Nota honesta del Humano (2026-10-07):** sus 4 pasos quedaron ejecutados correctamente; la validación física detectó 3 defectos visuales en componentes de TASK-04, que se atienden en **TASK-05R** (será una nueva task que el Orquestador creará) antes del arnés. Defectos observados en dispositivo: (1) pill de búsqueda recortada por el contenedor de pantalla al solapar la franja (`RadarSearchBar`, `marginTop: -28`); (2) ripple que se desplaza al panear el mapa con el popup abierto (`RadarRipple`); (3) popup KPI que tapa el pin / posición no óptima (`MunicipioCallout`). Chrome 2a y auth intactos (CA-07). El crash Android (`API key not found`) y el permiso iOS (`NSLocation*UsageDescription`) los resolvió el Humano con `npx expo prebuild` + key Android (package+SHA1); no eran defectos de código.

**Objetivo:** `Home` (radar) como pantalla autenticada. Chrome 2a intacto.

**Pasos**

- [x] `navigation/types.ts`: `AppStackParamList = { Home: undefined }`.
- [x] `RootNavigator.tsx`: `HomeScreen` en `AppStack.Screen name="Home"`. `AppShell`, `NavigationContainer key={status}`, Auth stack **intactos**.
- [x] `git rm src/features/home/presentation/HomePlaceholderScreen.tsx`.
- [x] `npx tsc --noEmit` y `npx eslint .` deben pasar.

**allowed_files**

- `src/app/navigation/types.ts`
- `src/app/navigation/RootNavigator.tsx`
- `src/features/home/presentation/HomePlaceholderScreen.tsx` (borrado)
- `spec/features/radar-home/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** App autenticada muestra el radar dentro del chrome 2a. Placeholder eliminado. tsc + eslint verdes.

---

## TASK-05R — Rework visual post-QA físico (barra, ripple, offset de cámara)

**Status:** COMPLETED
**assigned_role:** Trabajador

**Aprobación del Humano:** validada y aprobada 2026-10-07 (validación física en dispositivos Android + iOS): barra de búsqueda íntegra, modal/card correcta, ondas expansivas del ripple correctas; los 3 defectos del QA quedaron resueltos. TASK-06 NO se inicia en esta sesión.

**Origen:** nota honesta de TASK-05 (QA físico del Humano, 2026-10-07). Corrige 3 defectos visuales en componentes de TASK-04. Fundamento: spec §6.8–§6.9 y plan §8.1/§8.4/§8.5/§8.8 (ya enmendados por el Orquestador). Cero dependencias nuevas. Cero cambios en auth/`app-shell`/`navigation`/`HomeProvider`/infra. Cero `className`. Solo los 3 archivos de `allowed_files`.

**Pasos**

- [x] **FIX-1 (pill íntegra):** `RadarSearchBar.tsx`: `marginTop: -28` → `marginTop: 12` (spec §6.8, plan §8.1). Cero otro cambio en el archivo.
- [x] **FIX-2 (re-anclaje del ripple):** `RadarMap.tsx`: añadir prop `onRegionChangeComplete?: () => void` y reenviarla al `MapView`. `HomeScreen.tsx`: extraer el recompute del punto del ripple a un `useCallback` (`recomputeRipple`, deps `[data, popupMunicipio]`): si `popupMunicipio === null` → `setRipplePoint(null)`; si el municipio tiene coords → `getPointForCoordinate` → `setRipplePoint`. Pasarla como `onRegionChangeComplete` al `RadarMap` (spec §6.9, plan §8.4/§8.8).
- [x] **FIX-3 (offset de cámara al tap de pin):** `RadarMap.tsx`: añadir al `RadarMapHandle` el método `focusOnPosition(position: GeoPosition): void` con las constantes verbatim de plan §8.4 (`FOCUS_LATITUDE_DELTA 0.09`, `FOCUS_LONGITUDE_DELTA 0.09`, `FOCUS_CENTER_OFFSET 0.025`, duración 600; centro = `latitude + FOCUS_CENTER_OFFSET`). `HomeScreen.tsx` (`handleMarkerPress`): `openPopup(nombre)` → `setRipplePoint(null)` → si el municipio tiene coords → `map.focusOnPosition(position)`. Eliminar el `getPointForCoordinate` inmediato del press (el recompute llega vía `onRegionChangeComplete` tras la animación). Guard intacto para municipio sin coords (solo `openPopup`, ripple `null`).
- [x] `npx tsc --noEmit` y `npx eslint .` deben pasar (ambos exit 0).
- [x] Documentar en este `task.md` (notas de implementación) cualquier ajuste fino de `FOCUS_CENTER_OFFSET` si el Humano lo pide tras validar.

**Notas de implementación (el Trabajador documenta aquí desviaciones):**

- FIX-1/FIX-2/FIX-3 aplicados exactamente como pedía la task; sin desviaciones de firmas ni constantes. `FOCUS_CENTER_OFFSET` queda en `0.025` (verbatim plan §8.4), pendiente de ajuste fino solo si el Humano lo pide tras la validación física.
- `recomputeRipple` (deps `[data, popupMunicipio]`) pasa también a `setRipplePoint(null)` cuando el municipio del popup no tiene coords (mismo guard que el press), para que nunca quede un ripple huérfano.
- `handleMarkerPress` ya no llama a `getPointForCoordinate`; el punto llega tras `focusOnPosition` vía `onRegionChangeComplete`. El guard de municipio sin coords conserva `openPopup` + `setRipplePoint(null)`.
- `RadarMapHandle` añade `focusOnPosition` con las constantes a module scope; `useImperativeHandle` mantiene deps `[]` (solo refs + constantes). `RadarRipple.tsx` y `MunicipioCallout.tsx` sin cambios (diff vacío).

**allowed_files**

- `src/features/home/presentation/RadarSearchBar.tsx`
- `src/features/home/presentation/RadarMap.tsx`
- `src/features/home/presentation/HomeScreen.tsx`
- `spec/features/radar-home/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** Pill de búsqueda visible íntegra bajo la franja. Al panear con popup abierto los anillos permanecen anclados al pin. Al hacer tap en un pin la cámara deja el pin en el tercio inferior (card + ripple visibles, igual en Android e iOS). tsc + eslint verdes. `RadarRipple.tsx` y `MunicipioCallout.tsx` sin cambios. Chrome 2a y auth con diff vacío.

**Validación:** **APROBADA** por el Humano en dispositivos físicos Android + iOS (2026-10-07): pill de búsqueda íntegra, card/modal correcto y ondas expansivas del ripple correctas. TASK-05R → **COMPLETED**. Se autoriza TASK-06 (arnés) en nueva sesión.

---

## TASK-05G — Homologación Google Maps en iOS

**Status:** COMPLETED
**assigned_role:** Trabajador

**Aprobación del Humano:** validada y aprobada 2026-10-12 (validación física en **Android + iOS**: Google Maps aplicado correctamente en ambas plataformas tras el fix de la regresión Android). TASK-06 NO se inicia en esta sesión.

**Origen:** decisión del Humano (2026-10-12): homologar el mapa a Google Maps en ambas plataformas antes del arnés. Fundamento: spec §4.2/§6.10/CA-09, plan §8.4, `tech-stack.md` §2.3 (ya enmendados por el Orquestador). Cero dependencias nuevas (`package.json` intacto; el SDK de Google iOS llega por CocoaPods en el prebuild del Humano). Cero keys hardcodeadas.

**Gate del Humano:** la key iOS ya fue entregada y colocada en `.env` como `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS` (gitignored). El Trabajador NO necesita conocer su valor y NO toca `.env`.

**Pasos**

- [x] `app.config.js`: conservar la inyección Android existente y añadir al final del objeto retornado el plugin `["react-native-maps", { "iosGoogleMapsApiKey": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS }]` (spread de `config.plugins` existente primero). `app.json` **no se toca** (la inyección es dinámica).
- [x] `src/features/home/presentation/RadarMap.tsx`: `import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"` (ajustar el import existente) y `provider={PROVIDER_GOOGLE}` en el `MapView`. Cero otro cambio (props, handle, markers, efecto de cámara intactos).
- [x] `npx tsc --noEmit` y `npx eslint .` deben pasar.
- [x] Verificar `git diff -- app.json package.json` **vacío** y `git status -- .env` sin cambios trackeados (`.env` está en `.gitignore`).

**Notas de implementación (el Trabajador documenta aquí desviaciones):**

- `app.config.js`: se añadió `plugins` como última clave del objeto retornado con el spread `...(config.plugins || [])` primero y el plugin `react-native-maps`; la inyección Android existente (`android.config.googleMaps.apiKey`) quedó intacta. `app.json` no se tocó (inyección dinámica desde `.env`).
- `RadarMap.tsx`: import ampliado con `PROVIDER_GOOGLE` y `provider={PROVIDER_GOOGLE}` en el `MapView`; resto (props, `RadarMapHandle`, markers, efecto de cámara, `onRegionChangeComplete`) intacto.
- Arnés: `npx tsc --noEmit` → exit 0; `npx eslint .` → exit 0. `git diff -- app.json package.json` → vacío. `.env` ignorado por `.gitignore` (no aparece en `git status`). Cero keys hardcodeadas en los archivos tocados (cero coincidencias `AIza` en `app.config.js`/`RadarMap.tsx`). Cero `npx expo start`/`prebuild`/`run:*`, cero commit.

**Corrección post-QA físico (2026-10-12) — regresión Android `API key not found`:**

- **Síntoma:** tras el `npx expo prebuild` del Humano, iOS validó Google Maps correctamente, pero Android falló con `addViewAt ... API key not found`; `AndroidManifest.xml` quedó **sin** el `<meta-data android:name="com.google.android.geo.API_KEY" .../>`.
- **Causa raíz (no fue borrado manual):** el plugin de `react-native-maps@1.27.2` (`node_modules/react-native-maps/plugin/build/android.js:47-52`) **elimina** el meta-data `com.google.android.geo.API_KEY` si se le pasa sin la prop `androidGoogleMapsApiKey`:
  ```js
  if (props?.androidGoogleMapsApiKey) { addMetaDataItemToMainApplication(mainApplication, 'com.google.android.geo.API_KEY', props.androidGoogleMapsApiKey); }
  else { removeMetaDataItemFromMainApplication(mainApplication, 'com.google.android.geo.API_KEY'); }
  ```
  Al añadir el plugin solo con `iosGoogleMapsApiKey`, el mod de Android borraba la key que exponía `android.config.googleMaps.apiKey`.
- **Fix (config-level, cero edición nativa):** `app.config.js` pasa **ambas** props al plugin — `iosGoogleMapsApiKey` y `androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID` — de modo que el plugin re-inyecta el meta-data de Android en el próximo `prebuild`. Se conserva además `android.config.googleMaps.apiKey` (misma key). Verificado con `node --env-file=.env`: ambas props resuelven a valor no vacío.
- **Acción del Humano:** re-ejecutar `npx expo prebuild --platform android` (o `npx expo prebuild`) + `npx expo run:android --device` y validar Android. **TASK-05G permanece `READY_FOR_REVIEW`** hasta que Android quede validado en físico.

**Validación (Humano, 2026-10-12):** **APROBADA** en dispositivos físicos **Android + iOS**. iOS: Google Maps aplicado correctamente. Android: tras re-ejecutar `npx expo prebuild --platform android` + `run:android`, la key se re-inyectó y Google Maps funcionó. TASK-05G → **COMPLETED**. Se autoriza TASK-06 (arnés) en nueva sesión.

**allowed_files**

- `app.config.js`
- `src/features/home/presentation/RadarMap.tsx`
- `spec/features/radar-home/task.md`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** `provider={PROVIDER_GOOGLE}` activo; key iOS inyectada vía `app.config.js` desde `.env`; `app.json` y `package.json` sin cambios; tsc + eslint verdes. Cero keys en archivos trackeados.

**Validación (Humano):** `npx expo prebuild` + `npx expo run:ios --device` (instala pods de Google Maps) y `npx expo run:android --device`. Checklist lado a lado: misma cartografía en iOS y Android (estilo Google), pines guinda/dorado idénticos, chips centran, tap de pin → offset + popup + ripple igual en ambas plataformas, etiqueta del dispositivo resuelve, drawer/logout intactos. Tras aprobarla, TASK-05G → COMPLETED y se autoriza TASK-06 en nueva sesión.

---

## TASK-06 — Arnés

**Status:** COMPLETED
**assigned_role:** Trabajador + Revisor

**Cierre del Humano (2026-10-12):** hallazgos adjudicados (ver "Resolución de hallazgos" abajo): (1) deps extra de `68cb002` ACEPTADAS como build plumbing documentado (whitelist en spec CA-09) → CA-09 listo; (2) `auth-*` en `src/shared/ui/*` ACEPTABLE (estructura congelada 1.5b; falso positivo del arnés, ban scoped a `src/features/home/**`); (3) keys `AIza` en trackeados → task de higiene `security-keys` POST-2B, antes de Fase 3. **CA-08, CA-09 y CA-10 listos. TASK-06 → COMPLETED. Fase 2b (radar-home) CERRADA.**

**Pasos**

- [x] `npx tsc --noEmit` → exit 0.
- [x] `npx eslint .` → exit 0 (cero warnings).
- [x] Grep `src/**/*.ts(x)` + `App.tsx`: cero `any`, `TouchableOpacity`, `FlatList`, `expo-router`, paleta `auth-*` fuera de auth.
- [x] DIP: único importador de `home/infrastructure` = `compositionRoot.ts`; `expo-location`/`react-native-maps` ausentes de domain/application; `expo-location` ausente de presentation.
- [x] `git diff HEAD -- package.json` muestra SOLO `react-native-maps` + `expo-location`; `app.json` SOLO el plugin `expo-location` (keys de Google Maps inyectadas vía `app.config.js` desde `.env`; cero keys hardcodeadas en archivos trackeados — verificar con grep `AIza` sobre el tree).
- [x] Contrato: grep del path `/api/v1/dashboard/mapa-home` único en `AxiosRadarMapApi.ts`; wire DTO espejo de spec §4.6.
- [x] Chrome: `git diff` de `src/features/app-shell/**` y `src/features/auth/**` vacío.

**Ejecución (Trabajador, 2026-10-12) — evidencia literal:**

- `npx tsc --noEmit` → **exit 0**; `npx eslint .` → **exit 0** (cero errores, cero warnings).
- Bans (git grep sobre `src/**/*.ts(x)` + `App.tsx`): `any` 0, `TouchableOpacity` 0, `FlatList` 0, `expo-router` 0. `auth-*`/`authPalette` 0 en `src/features/home/**` y `App.tsx`.
- DIP: único importador de `home/infrastructure` = `src/app/compositionRoot.ts:18-19`; `react-native-maps` solo en `presentation/RadarMap.tsx:2`; `expo-location` solo en `infrastructure/ExpoLocationGateway.ts:1`.
- Contrato: `/api/v1/dashboard/mapa-home` único en código = `src/features/home/infrastructure/AxiosRadarMapApi.ts:34`; `infrastructure/dto.ts` espejo 1:1 de spec §4.6.
- Chrome: `git diff` de `src/features/app-shell/**` y `src/features/auth/**` **vacío** (worktree y delta vs baseline 2b `333b62f`).

**Hallazgos (reportados al Revisor/Humano — NO corregidos):**

1. **Deps extra fuera de alcance (commit humano `68cb002`, no radar):** `git diff HEAD -- package.json` es **vacío** (todo commiteado por el Humano). Contra el baseline 2b (`333b62f..HEAD`), aparte de `expo-location` + `react-native-maps` (TASK-01), el Humano añadió `dotenv`, `lightningcss`, `react-native-worklets`, `react-native-worklets-core`, `patch-package`, script `postinstall` y subió `react-native-reanimated` `4.5.1 → ^4.7.1`. Son del build nativo/Google Maps, ajenos al alcance de la feature. **CA-09 con hallazgo.**
2. **`auth-*` fuera de `src/features/auth/**` (preexistente Fase 1.5a/1.5b):** coincidencias en `src/shared/ui/TextField.tsx`, `src/shared/ui/BiometricMethodCard.tsx`, `src/shared/ui/AuthScaffold.tsx`, `src/shared/ui/GoldButton.tsx` y `src/shared/theme/tokens.ts`. No introducidas por el radar; el radar tiene cero. No se toca auth/shared-ui (congelado).
3. **AIza preexistente (ver `git grep "AIza"`):** `android/app/src/main/AndroidManifest.xml:19`, `ios/GabineteMvil/AppDelegate.swift:38`, `ios/GabineteMvil/Info.plist:37` (nativos, prohibido editar), `progress/history.md:552` (key `AIzaSy…900JQ` en archivo permitido — **no borrada**, se reporta), `Instructions/fase_2b/fase_2b.md:38`.
4. **`git diff HEAD` no es la comparación útil:** el working tree está limpio (cambios commiteados). La verificación real se hizo contra el baseline `333b62f`.

**allowed_files**

- `spec/features/radar-home/task.md`
- `progress/current-task.json`
- `progress/history.md`

Si el arnés falla, correcciones **solo** en archivos de TASK-01…05 (el Humano/Revisor autoriza el allowed_files extra). No "arreglar" auth ni chrome.

**Resolución de hallazgos (Humano + Orquestador, 2026-10-12):**

1. **Deps extra `68cb002` → ACEPTADAS con whitelist.** El Humano las aprueba como build plumbing documentado: `react-native-reanimated ^4.7.1` + `react-native-worklets` + `react-native-worklets-core` (peer del árbol de pods de Google Maps iOS), `patch-package` + `postinstall` + `patches/expo-modules-jsi` (fix de build nativo iOS), `lightningcss` directa (redundante con `overrides`, inofensiva), `dotenv` (sin uso actual; **candidata a limpieza futura**). CA-09 enmendado en `spec.md` con esta whitelist. **CA-09 → listo.**
2. **`auth-*` en `src/shared/ui/*` → ACEPTABLE (congelado).** Falso positivo del paso de arnés (mal scopeado por el Orquestador): esos componentes viven en `shared/ui` por diseño de 1.5b. El ban `auth-*` queda scoped al código nuevo de la feature (`src/features/home/**`), donde el radar tiene **cero** incidencias. El paso de arriba queda interpretado con este alcance.
3. **Keys `AIza` en trackeados → task de higiene POST-2b.** Se planifica mini-task `security-keys` **antes de Fase 3**: rotar/revocar keys en Google Cloud (la `AIzaSy…900JQ` de `history.md:552` está superseded por la actual → revocar), restringir la key iOS por bundle id, limpiar `progress/history.md` e `Instructions/fase_2b/fase_2b.md`, y decidir si `android/` e `ios/` se gitignorean (regenerables vía CNG).
4. Anotado: la comparación de deps se hace contra el baseline `333b62f`, no `HEAD`.

**Definition of done:** CA-08, CA-09 (con whitelist) y CA-10 listos. TASK-06 **COMPLETED** (cierre formal del Humano, 2026-10-12). Fase 3 no abierta — antes se ejecuta la task de higiene `security-keys`.

---

Prohibido planificar Fase 3 (búsqueda predictiva) hasta que el Revisor audite y el Humano apruebe visualmente la Fase 2b (`roadmap.md`).
