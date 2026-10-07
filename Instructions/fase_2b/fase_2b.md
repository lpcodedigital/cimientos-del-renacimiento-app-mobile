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