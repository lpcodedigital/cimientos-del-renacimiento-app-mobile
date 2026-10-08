## Prompt para iniciar TASK-01 en nueva sesión (Worker):

MODO: EJECUCIÓN. Proyecto: Cimientos del Renacimiento — Gabinete Móvil.
FASE 2b (radar-home). Ejecutar SOLO TASK-01. Cero TASK-02+. Cero componentes. Cero UI.
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEER ANTES DE TOCAR CÓDIGO (obligatorio):
- spec/features/radar-home/task.md  (TASK-01, allowed_files y reglas)
- spec/features/radar-home/plan.md  (§3.1, §3.2, §3.3)
- spec/features/radar-home/spec.md  (§2.11, §4)
- spec/constitution/tech-stack.md   (§2.3, §2.4, §5)
- progress/current-task.json
- AGENTS.md

OBJETIVO TASK-01: registrar la paleta radar-*, instalar mapas/ubicación y dejar app.json listo. Sin componentes.

PASOS:
1) global.css — dentro del @theme existente, AÑADIR (no borrar Fase 1 / auth-* / app-*):
   --color-radar-surface: #ffffff;
   --color-radar-chip: #c3cec0;
   --color-radar-chip-active: #c67e33;
   --color-radar-popup-header: #d6ded1;
   --color-radar-popup-body: #d8dac9;
2) src/shared/theme/tokens.ts — AÑADIR sin modificar palette/fontFamily/authPalette/appPalette:
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
3) npx expo install react-native-maps expo-location   (NUNCA npm i)
4) app.json — SOLO dos cambios:
   a) plugins += ["expo-location", { "locationWhenInUsePermission": "El Gabinete Móvil usa tu ubicación para centrar el radar territorial y mostrar el municipio donde te encuentras." }]
   b) android.config.googleMaps.apiKey = "AIzaSyDK7sYtxqsifCz17bM2QMMv_ok93A900JQ"
   No toques Info.plist, AndroidManifest.xml ni nada más.
5) Arnés: npx tsc --noEmit debe pasar. Verifica: git diff -- app.json muestra SOLO los dos cambios anteriores.

PROHIBIDO:
- TASK-02+, crear componentes, tocar src/features/auth/**, src/features/app-shell/**, src/app/**.
- npm i. Dependencias fuera de react-native-maps y expo-location. npx expo start.
- Editar .swift/.kt/.java/.pbxproj/Info.plist/AndroidManifest.xml a mano.
- any, TouchableOpacity, FlatList, expo-router, emojis, fuentes ≠ Lato, paleta auth-*, className en archivos nuevos.
- Inventar la API key (la entrega el Humano).

ALLOWED_FILES (solo estos):
- global.css
- src/shared/theme/tokens.ts
- package.json
- package-lock.json
- app.json
- spec/features/radar-home/task.md
- progress/current-task.json
- progress/history.md

AL TERMINAR (obligatorio):
- Marcar [x] los pasos de TASK-01 en task.md y poner su Status. Como los pasos quedan ejecutados pero pendientes de validación Humana, deja Status: READY_FOR_REVIEW (NO lo pongas COMPLETED).
- Actualizar progress/current-task.json (active_task TASK-01 status READY_FOR_REVIEW; harness_status.typecheck_passed true; notas).
- Añadir entrada en progress/history.md con versiones exactas instaladas por expo install.
- NO hagas commit salvo que el Humano lo pida.
- NO ejecutes npx expo start.

REPORTA al final: versiones instaladas, resultado de tsc, y el diff exacto de app.json y qué debo validar yo como Humano antes de autorizar TASK-01.

## Prompt para la nueva sesión (TASK-02):

MODO: EJECUCIÓN. Proyecto: Cimientos del Renacimiento — Gabinete Móvil.
FASE 2b (radar-home). Ejecutar SOLO TASK-02. Cero TASK-03+. Cero UI. Cero infraestructura. Cero consumidores.

LEER ANTES DE TOCAR CÓDIGO (obligatorio):
- spec/features/radar-home/task.md  (TASK-02, allowed_files y reglas)
- spec/features/radar-home/plan.md  (§4.1–§4.5, §5.1–§5.2)
- spec/features/radar-home/spec.md  (§8)
- spec/constitution/tech-stack.md   (§5 Clean Architecture / DIP)
- progress/current-task.json
- AGENTS.md

OBJETIVO TASK-02: crear el kernel de `home` (domain + application) con firmas VERBATIM del plan. Sin consumidores, sin UI, sin infraestructura, sin dependencias nuevas.

CREAR EXACTAMENTE 9 ARCHIVOS (verbatim plan §4–§5):
1) src/features/home/domain/entities/GeoPosition.ts            (plan §4.1)
2) src/features/home/domain/entities/MunicipioRadar.ts         (plan §4.2)
3) src/features/home/domain/errors/RadarError.ts               (plan §4.3)
4) src/features/home/domain/ports/RadarMapRepository.ts        (plan §4.4)
5) src/features/home/domain/ports/LocationGateway.ts           (plan §4.5)
6) src/features/home/application/types.ts                      (plan §5.1)
7) src/features/home/application/loadRadarMap.ts               (plan §5.2 → createLoadRadarMap)
8) src/features/home/application/getCurrentLocation.ts         (plan §5.2 → createGetCurrentLocation; SIN prompt: si getForegroundPermission() !== "granted" → null)
9) src/features/home/application/requestLocationAccess.ts      (plan §5.2 → createRequestLocationAccess; CON prompt via requestForegroundPermission)
   + src/features/home/application/resolveDeviceMunicipio.ts   (plan §5.2 → createResolveDeviceMunicipio)
   (son 10 archivos en total: 5 domain + 5 application)
NOTA: la TASK lista 5 domain + 5 application; respétalos todos, closures (no clases), cero comentarios.

REGLAS DE CAPA (verificar por grep):
- domain: CERO imports de react/react-native/expo-*/axios/@tanstack/react-native-maps/@/shared/@/app/capas hermanas. Solo imports relativos.
- application: SOLO ../domain/... y ./types. Cero React/Expo/Axios/Query/infrastructure.
- `loadRadarMap` deja subir `RadarError` sin catch. `signIn`-style: factories = closures.
- Cero `any`, cero `TouchableOpacity`, cero `FlatList`, cero `expo-router`, cero barrels `index.ts`, cero emojis, cero comentarios.

PROHIBIDO:
- TASK-03+, tocar src/features/auth/**, src/features/app-shell/**, src/app/**, App.tsx, eslint.config.js, app.json, global.css, tokens.ts.
- Crear infraestructura/UI/consumidores. Instalar dependencias. `npx expo start`. Cualquier archivo fuera del allowed_files.

ALLOWED_FILES (solo estos):
- src/features/home/domain/entities/GeoPosition.ts
- src/features/home/domain/entities/MunicipioRadar.ts
- src/features/home/domain/errors/RadarError.ts
- src/features/home/domain/ports/RadarMapRepository.ts
- src/features/home/domain/ports/LocationGateway.ts
- src/features/home/application/types.ts
- src/features/home/application/loadRadarMap.ts
- src/features/home/application/getCurrentLocation.ts
- src/features/home/application/requestLocationAccess.ts
- src/features/home/application/resolveDeviceMunicipio.ts
- spec/features/radar-home/task.md
- progress/current-task.json
- progress/history.md

ARNÉS: npx tsc --noEmit debe pasar. Verificar con grep que domain/application no importan framework ni capas prohibidas.

AL TERMINAR (obligatorio):
- Marcar [x] los pasos de TASK-02 en task.md y poner Status: READY_FOR_REVIEW (NO COMPLETED).
- progress/current-task.json → active_task TASK-02 status READY_FOR_REVIEW; harness_status.typecheck_passed true; notas.
- Añadir entrada en progress/history.md.
- NO commit. NO npx expo start.

REPORTA: archivos creados, resultado de tsc, y verificación de imports de capa y qué debo validar yo como Humano antes de autorizar TASK-02.

## TASK-03 no iniciada. Prompt listo para pegar en nueva sesión:

MODO: EJECUCIÓN. Proyecto: Cimientos del Renacimiento — Gabinete Móvil.
FASE 2b (radar-home). Ejecutar SOLO TASK-03. Cero TASK-04+. Cero componentes de mapa/UI. Cero dependencias nuevas. Cero código nativo.

LEER ANTES DE TOCAR CÓDIGO (obligatorio):
- spec/features/radar-home/task.md  (TASK-03, allowed_files y reglas)
- spec/features/radar-home/plan.md  (§6.1–§6.6 y §7)
- spec/features/radar-home/spec.md  (§4.6 contrato, §8 arquitectura)
- spec/constitution/tech-stack.md   (§2.3, §2.4, §5 Clean Architecture / DIP)
- progress/current-task.json
- AGENTS.md

CONTEXTO: TASK-02 (domain + application de home) COMPLETED y APROBADA. Existen ya:
- src/features/home/domain/{entities/GeoPosition,entities/MunicipioRadar,errors/RadarError,ports/RadarMapRepository,ports/LocationGateway}.ts
- src/features/home/application/{types,loadRadarMap,getCurrentLocation,requestLocationAccess,resolveDeviceMunicipio}.ts
NO modificar esos 10 archivos salvo que el contrato de TASK-03 lo exija (no lo exige: usa sus firmas).

OBJETIVO TASK-03: adapters concretos de infraestructura + wiring DIP + provider de presentation + fences ESLint. Sin componentes de mapa todavía. Firmas verbatim del plan §6–§7.

CREAR/EDITAR EXACTAMENTE estos archivos (verbatim plan §6–§7):
1) src/features/home/infrastructure/dto.ts                 (plan §6.1: MunicipioResumenDTO espejo 1:1)
2) src/features/home/infrastructure/AxiosRadarMapApi.ts     (plan §6.2: createAxiosRadarMapApi → RadarMapRepository; GET /api/v1/dashboard/mapa-home; mapper nombre: dto.municipio; errores → radarError("radar_unavailable"))
3) src/features/home/infrastructure/ExpoLocationGateway.ts  (plan §6.3: createExpoLocationGateway → LocationGateway; permisos, posición y reverseGeocode city ?? subregion ?? region ?? null; try/catch → null)
4) src/app/compositionRoot.ts                               (plan §6.4: AÑADIR createHomeUseCases(); NO tocar createAuthUseCases)
5) src/features/home/presentation/HomeProvider.tsx          (plan §7: estado UI del radar + nonce de cámara + requestInitialCamera con ref guard; useCases por props)
6) src/features/home/presentation/useHomeRadar.ts           (plan §7: fachada única que reexpone estado + acciones + useCases)
7) App.tsx                                                  (plan §6.6: createHomeUseCases() + <HomeProvider useCases={homeUseCases}> dentro de AuthProvider; conservar fuentes, QueryClient, StatusBar)
8) eslint.config.js                                         (plan §6.5: + expo-location + react-native-maps a domain/application; + expo-location a presentation/navigation/shared-ui)

REGLAS DE CAPA (verificar por grep):
- infrastructure: implementa puertos de domain; puede importar axiosClient de @/shared/infrastructure/http y expo-location. Cero imports de application/presentation.
- Único importador de home/infrastructure = src/app/compositionRoot.ts (DIP).
- HomeProvider recibe HomeUseCases por props (mismo patrón que AuthProvider); los componentes nunca reciben use cases por otro camino.
- react-native-maps permitido SOLO en presentation (es UI). expo-location prohibido en presentation.
- Cero `any`, cero TouchableOpacity, cero FlatList, cero expo-router, cero barrels index.ts, cero emojis, cero comentarios.

PROHIBIDO:
- TASK-04+ (ningún componente de mapa/UI, nada de RadarMap/HomeScreen/etc.).
- Tocar src/features/auth/**, src/features/app-shell/** (chrome congelado CA-07), src/app/navigation/**, src/shared/** (salvo nada), app.json, global.css, tokens.ts, package.json.
- Instalar dependencias (ya están expo-location + react-native-maps desde TASK-01). `npx expo start`. Cualquier archivo fuera del allowed_files.

ALLOWED_FILES (solo estos):
- src/features/home/infrastructure/dto.ts
- src/features/home/infrastructure/AxiosRadarMapApi.ts
- src/features/home/infrastructure/ExpoLocationGateway.ts
- src/app/compositionRoot.ts
- src/features/home/presentation/HomeProvider.tsx
- src/features/home/presentation/useHomeRadar.ts
- App.tsx
- eslint.config.js
- spec/features/radar-home/task.md
- progress/current-task.json
- progress/history.md

ARNÉS: `npx tsc --noEmit` y `npx eslint .` deben pasar. Verificar: único importador de home/infrastructure = compositionRoot; getForegroundPermission mapea PermissionStatus (GRANTED→granted, DENIED→denied, resto→undetermined); mapper 1:1 y error tipado; createAuthUseCases y chrome/auth con diff vacío; package.json/app.json sin cambios.

AL TERMINAR (obligatorio):
- Marcar [x] los pasos de TASK-03 en task.md y poner Status: READY_FOR_REVIEW (NO COMPLETED).
- progress/current-task.json → active_task TASK-03 status READY_FOR_REVIEW; harness_status linter_passed true, typecheck_passed true; notas.
- Añadir entrada en progress/history.md.
- NO commit. NO npx expo start.

REPORTA: archivos creados/editados, resultado de tsc y eslint, verificación de DIP/fences, y qué debo validar yo como Humano antes de autorizar TASK-04.

## TASK-04 no iniciada. Prompt listo para pegar en nueva sesión:

MODO: EJECUCIÓN. Proyecto: Cimientos del Renacimiento — Gabinete Móvil.
FASE 2b (radar-home). Ejecutar SOLO TASK-04. Cero TASK-05+. Cero wire al navigator. Cero dependencias nuevas. Cero código nativo. Cero commit. Cero `npx expo start`.

LEER ANTES DE TOCAR CÓDIGO (obligatorio):
- spec/features/radar-home/task.md  (TASK-04, allowed_files y reglas)
- spec/features/radar-home/plan.md  (§8.1–§8.8, §7, §12 skills, §13)
- spec/features/radar-home/spec.md  (§4.1–§4.5 copy/tokens, §4.7 artefactos prohibidos, §8)
- spec/constitution/tech-stack.md   (§2.3, §2.4 radar-*, §5 Clean Architecture / DIP)
- progress/current-task.json
- AGENTS.md

CONTEXTO: TASK-01/02/03 COMPLETED y APROBADAS. Ya existen y NO se modifican (usar sus firmas):
- src/features/home/{domain/**, application/**} (10 archivos)
- src/features/home/infrastructure/{dto,AxiosRadarMapApi,ExpoLocationGateway}.ts
- src/features/home/presentation/{HomeProvider.tsx,useHomeRadar.ts}  (fachada única: useHomeRadar() reexpone estado + acciones + useCases)
- src/app/compositionRoot.ts (createHomeUseCases) y App.tsx (HomeProvider dentro de AuthProvider)

OBJETIVO TASK-04: crear la UI completa del radar SIN cablearla al navigator. El placeholder (`HomePlaceholderScreen.tsx`) sigue montado y NADIE importa aún `HomeScreen`. Firmas/layout verbatim de plan §8 y copy de spec §4.5.

CREAR EXACTAMENTE estos archivos (verbatim plan §8):
1) src/features/home/presentation/format.ts            (§8.7: mdpFormatter hoisted en module scope; formatMdp(totalInversion) => `${n} MDP` con Intl.NumberFormat("es-MX",{maximumFractionDigits:1}) sobre totalInversion/1e6; toTitleCase(nombre))
2) src/features/home/presentation/RadarSearchBar.tsx   (§8.1: pill blanca View + Text NO interactiva (cero TextInput/Pressable), lupa Ionicons `search`, texto 2 líneas verbatim spec §4.5, lato-bold, mayúsculas; accessibilityLabel="Buscar (disponible en la siguiente fase)")
3) src/features/home/presentation/RadarChipRow.tsx     (§8.2: ScrollView horizontal sin scrollbar; chip fijo «MI UBICACIÓN» primero (icono location blanco) + chips del array en orden con label Title Case; activo = radarPalette.chipActive + texto blanco bold; inactivo = radarPalette.chip + palette.texto; Pressable con pressed opacity 0.8; accessibilityRole="button")
4) src/features/home/presentation/DeviceMunicipioLabel.tsx (§8.3: pill blanca + pin guinda + deviceMunicipio ?? "—", lato-bold)
5) src/features/home/presentation/RadarMap.tsx         (§8.4: MapView ref flex:1, provider default, showsUserLocation={false}, showsCompass={false}, toolbarEnabled={false}; Marker nativo pinColor guinda por municipio con lat/lng != null y onMarkerPress(nombre), key=nombre; Marker GPS dorado zIndex alto sin onPress; efecto de cámara sobre cameraRequest ["fit"→fitToCoordinates, "gps"/"municipio"→animateToRegion delta 0.12 duración 600, "municipio" sin coords → no-op]; useImperativeHandle expone getPointForCoordinate(position) via pointForCoordinate con try/catch→null)
6) src/features/home/presentation/RadarRipple.tsx      (§8.5: overlay absoluto pointerEvents="none", 3 Animated.View Reanimated, tamaños 48/88/128, borde radarPalette.ripple, scale 0.3→1 y opacity 0.9→0, withRepeat(withTiming(1,{duration:1400,easing:Easing.out(Easing.ease)}),-1,false), delays 0/220/440; SOLO transform/opacity; se monta solo con popup y point != null)
7) src/features/home/presentation/MunicipioCallout.tsx (§8.6: card overlay top ~16 ancho ~88% máx 340; header radarPalette.popupHeader con location-outline + nombre en mayúsculas del DTO (lato-bold) + X (Ionicons close) Pressable hitSlop 12 accessibilityLabel="Cerrar"; cuerpo radarPalette.popupBody con 3 columnas flex 1 y hairlines (StyleSheet.hairlineWidth) — Col1 formatMdp(totalInversion)+"Inversión total", Col2 totalObras+"Obras (X en proceso, Y concluidas)", Col3 totalCursos+"Capacitaciones"; cola triangular abajo-centro (rotate 45deg, fondo popupBody); «Ver más» Pressable outline guinda NO-OP tipado accessibilityLabel="Ver más (disponible en la siguiente fase)"; recibe municipio: MunicipioRadar)
8) src/features/home/presentation/HomeScreen.tsx       (§8.8: const { useCases, ...estado } = useHomeRadar(); useQuery({ queryKey:["radar","mapa-home"], queryFn:()=>useCases.loadRadarMap(), staleTime:60_000 }); layout View flex:1 fondo appPalette.crema → RadarMap flex:1 → overlay superior (RadarSearchBar + RadarChipRow + DeviceMunicipioLabel columna gap 10 padding horizontal 16) → MunicipioCallout si popupMunicipio (lookup por nombre en data) → RadarRipple si popup abierto; requestInitialCamera(data.length>0) UNA sola vez con ref guard cuando data llega; isLoading→mapa+ActivityIndicator guinda; isError→mapa+Text error.message (RadarError, fallback RADAR_ERROR_MESSAGES.radar_unavailable); data vacío→«Sin municipios con obras o capacitaciones.»; openPopup resuelve el punto de pantalla vía ref del mapa (si null, popup abre igual sin anillos))

REGLAS DE CAPA (verificar por grep):
- presentation puede importar react-native-maps (es UI). expo-location PROHIBIDO en presentation.
- Los use cases llegan SOLO por useHomeRadar() (fachada). Prohibido pasarlos por props al screen.
- No importar infrastructure ni "@/shared/infrastructure/**" desde presentation.
- Estilos INLINE JS con radarPalette/appPalette/palette/fontFamily. StyleSheet solo para absoluteFill/hairline justificados. Cero className en archivos nuevos.
- Solo Pressable. Ternarios/!! (nunca && con strings/números). Cero emojis. Cero labels de texto en pines.
- Skills plan §12: ui-pressable, rendering-no-falsy-and, animation-gpu-properties, js-hoist-intl, react-state-minimize, ui-measure-views.
- react-native-reanimated@4.5.1 ya instalado (peer NativeWind) — NO instalar nada.

PROHIBIDO:
- TASK-05+ (no tocar src/app/navigation/**, no borrar HomePlaceholderScreen, no wire al navigator).
- Tocar auth/**, app-shell/**, src/features/home/{domain,application,infrastructure}/**, HomeProvider.tsx, useHomeRadar.ts, compositionRoot.ts, App.tsx, app.json, global.css, tokens.ts, package.json, eslint.config.js.
- Instalar dependencias. `npx expo start`. Cualquier archivo fuera del allowed_files.

ALLOWED_FILES (solo estos):
- src/features/home/presentation/format.ts
- src/features/home/presentation/RadarSearchBar.tsx
- src/features/home/presentation/RadarChipRow.tsx
- src/features/home/presentation/DeviceMunicipioLabel.tsx
- src/features/home/presentation/RadarMap.tsx
- src/features/home/presentation/RadarRipple.tsx
- src/features/home/presentation/MunicipioCallout.tsx
- src/features/home/presentation/HomeScreen.tsx
- spec/features/radar-home/task.md
- progress/current-task.json
- progress/history.md

ARNÉS: `npx tsc --noEmit` y `npx eslint .` deben pasar (exit 0, cero warnings). Verificar: Nadie importa HomeScreen (grep); expo-location ausente de presentation; react-native-maps solo en presentation; cero any/TouchableOpacity/FlatList/expo-router/className/barrels/comentarios/emojis; package.json/app.json sin cambios; auth/app-shell/navigation con diff vacío.

AL TERMINAR (obligatorio):
- Marcar [x] los pasos de TASK-04 en task.md y poner Status: READY_FOR_REVIEW (NO COMPLETED).
- progress/current-task.json → active_task TASK-04 status READY_FOR_REVIEW; harness_status linter_passed true, typecheck_passed true; notas.
- Añadir entrada en progress/history.md.
- NO commit. NO npx expo start.

REPORTA: archivos creados, resultado de tsc y eslint, verificación de fences/DIP (nadie importa HomeScreen aún), y qué debe validar el Humano antes de autorizar TASK-05.

## Prompt para iniciar TASK-05 en una sesión nueva

MODO: EJECUCIÓN. Proyecto: Cimientos del Renacimiento — Gabinete Móvil.
FASE 2b (radar-home). Ejecutar SOLO TASK-05. Cero TASK-06+. Cero dependencias nuevas.
Cero código nativo. Cero commit. Cero `npx expo start`.

LEER ANTES DE TOCAR CÓDIGO (obligatorio):
- spec/features/radar-home/task.md   (TASK-05, allowed_files y reglas)
- spec/features/radar-home/plan.md   (§9 wire navegación, §1 hallazgos, §13)
- spec/features/radar-home/spec.md   (§5 flujo, §8 arquitectura, §9 límites, §10 CA)
- spec/constitution/tech-stack.md    (§1 navegación native-stack, §5 DIP)
- progress/current-task.json
- AGENTS.md

CONTEXTO: TASK-01/02/03/04 COMPLETED y APROBADAS. Ya existen y NO se modifican:
- src/features/home/{domain,application,infrastructure,presentation/**} completo
  (incluye HomeScreen.tsx y los 7 componentes del radar, aún sin cablear).
- src/app/navigation/{types.ts,RootNavigator.tsx} (con HomePlaceholder actual).
- src/features/home/presentation/HomePlaceholderScreen.tsx (sigue montado).
- src/app/compositionRoot.ts, App.tsx (HomeProvider dentro de AuthProvider).

OBJETIVO TASK-05: montar `HomeScreen` (radar) como pantalla autenticada y eliminar
el placeholder. Chrome 2a (AppShell/header/franja/drawer) intacto al píxel (CA-07).

PASOS (verbatim plan §9 / TASK-05):
1) src/app/navigation/types.ts: `AppStackParamList = { Home: undefined }`
   (eliminar `HomePlaceholder`).
2) src/app/navigation/RootNavigator.tsx:
   `import { HomeScreen } from "@/features/home/presentation/HomeScreen";`
   → `<AppStack.Screen name="Home" component={HomeScreen} />`.
   AppShell, `<NavigationContainer key={status}>` y el Auth stack INTACTOS.
3) `git rm src/features/home/presentation/HomePlaceholderScreen.tsx`.
4) `npx tsc --noEmit` y `npx eslint .` deben pasar (exit 0, cero warnings).

REGLAS DE CAPA (verificar por grep):
- Presentation no importa infrastructure ni "@/shared/infrastructure/**"; los use cases
  llegan SOLO por useHomeRadar() (ya resuelto en TASK-04, no tocar).
- Cero `any`, `TouchableOpacity`, `FlatList`, `expo-router`, paleta `auth-*` fuera de auth.
- Cero barrels `index.ts`. Cero comentarios nuevos. Cero emojis.

PROHIBIDO:
- TASK-06 (no correr el arnés global más allá de tsc+eslint).
- Tocar src/features/home/**, auth/**, app-shell/**, compositionRoot.ts, App.tsx,
  app.json, global.css, tokens.ts, package.json, eslint.config.js.
- Instalar dependencias. `npx expo start`. Cualquier archivo fuera del allowed_files.

ALLOWED_FILES (solo estos):
- src/app/navigation/types.ts
- src/app/navigation/RootNavigator.tsx
- src/features/home/presentation/HomePlaceholderScreen.tsx   (borrado con git rm)
- spec/features/radar-home/task.md
- progress/current-task.json
- progress/history.md

ARNÉS: `npx tsc --noEmit` y `npx eslint .` exit 0. Verificar por grep:
- `HomeScreen` importado únicamente por RootNavigator.
- `HomePlaceholder` ausente de src/ y de App.tsx.
- `git diff -- src/features/app-shell src/features/auth` vacío (CA-07).
- `package.json`/`app.json` sin cambios.

AL TERMINAR (obligatorio):
- Marcar [x] los pasos de TASK-05 en task.md y poner Status: READY_FOR_REVIEW (NO COMPLETED).
- progress/current-task.json → active_task TASK-05 status READY_FOR_REVIEW;
  harness_status linter_passed true, typecheck_passed true; notas.
- Añadir entrada en progress/history.md.
- NO commit. NO npx expo start.

REPORTA: archivos editados/borrado, resultado de tsc y eslint, verificación
HomePlaceholder eliminado + HomeScreen cableado, diff vacío de chrome/auth, y qué
debe validar el Humano (radar dentro del chrome 2a, CA-01…07) antes de autorizar TASK-06.