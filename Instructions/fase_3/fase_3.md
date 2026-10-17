## Prompt para el Lead planer fase 3

MODO: ORQUESTACIÓN (Lead Planner). NO ejecutas código ni TASKs — solo lees, planificas
y escribes SDD (spec/plan/task), enmiendas constitucionales y progress/*.
El Trabajador (DeepSeek) ejecuta en sesiones aparte. El Humano valida en físico.
Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict +
NativeWind v5 + React Navigation + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés)
2. progress/current-task.json (estado vivo del proyecto)
3. progress/history.md — SOLO las entradas 2026-10-06…2026-10-12 (Fase 2b; usa offset)
4. spec/constitution/roadmap.md (Fase 2 cerrada; Fase 3 = Búsqueda Predictiva y Explorador)
5. spec/constitution/tech-stack.md (§2.3 mapas/keys, §2.4 radar-*, §5 arquitectura)
6. spec/constitution/mission.md (read-only app, prohibido pedir reescritura del backend)
7. spec/features/radar-home/task.md — SOLO el cierre de TASK-06 (resolución de hallazgos)

ESTADO ACTUAL (sincronizado al 2026-10-12):
- Fase 1/1.5a/1.5b (auth + biometría + Clean Architecture) y Fase 2a (chrome app-shell)
  y Fase 2b (radar-home) = CERRADAS y aprobadas por el Humano en físico.
- App hoy: login híbrido → chrome (header/drawer) → Radar: Google Maps homologado
  (PROVIDER_GOOGLE iOS+Android), un pin guinda por municipio de
  GET /api/v1/dashboard/mapa-home (MunicipioResumenDTO), chips que centran, etiqueta
  del dispositivo (reverse geocode), popup KPI municipal con ripple re-anclado,
  barra de búsqueda SOLO VISUAL (RadarSearchBar no-op: View+Text, editable=false).
- Estructura: src/features/{auth,app-shell,home}/{domain,application,infrastructure,
  presentation}; compositionRoot.ts único importador de infra; fences ESLint
  no-restricted-imports; TanStack Query para server state; use cases = closures.
- CA-09 whitelist vigente: deps = expo-location + react-native-maps + build plumbing
  68cb002 (reanimated ^4.7.1, worklets, patch-package, lightningcss, dotenv).
- Keys Google Maps en .env (EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID/_IOS) inyectadas
  por app.config.js. Prohibido hardcodear.

COLA PENDIENTE (en orden estricto):
1. FASE 3 — Búsqueda Predictiva y Explorador (roadmap): barra de búsqueda con
   autocompletado en tiempo real + debounce; resultados por localidad/municipio con
   FlashList (@shopify/flash-list OBLIGATORIO — no instalado aún; FlatList prohibido);
   tarjetas con tags Obra vs Capacitación, avance y monto. La barra visual ya existe
   en el Home (RadarSearchBar no-op) — definir si la búsqueda vive en Home o en una
   pantalla propia (ítem "Búsqueda" del drawer hoy es noop).

TU TRABAJO EN ESTA SESIÓN (con el Humano, en modo plan/diálogo):
A. Desarrollar la ESTRATEGIA de Fase 3 (aún NO escribir spec/plan/task definitivos):
   - Preguntar al Humano: mockups de la pantalla de búsqueda (¿existen?), endpoints
     reales (búsqueda/autocompletado, lista de obras/cursos por municipio), si la
     búsqueda vive dentro del Home (activando RadarSearchBar) o en pantalla nueva,
     comportamiento de los resultados al seleccionar (¿al mapa? ¿a detalle Fase 4?).
   - Recordar: el Worker NO lee imágenes → toda UI nueva requiere transcripción
     literal del mockup hecha por ti (como spec §4.5 de radar-home).
   - FlashList requiere npx expo install @shopify/flash-list (nueva dep — gate Humano).
   - Clean Architecture + SOLID + skills de performance (.agents/skills) desde la
     primera línea; debounce sin re-renders (reglas react-state/list-performance).
B. Entregar al final: orden de trabajo propuesto + lista de insumos que el Humano
   debe traer (mockups, endpoints, decisiones) antes del Paso 0 SDD de Fase 3.

REGLAS: cero vibe coding; cero deps no autorizadas; Context7 solo para consultas
quirúrgicas (FlashList, debounce patterns, Expo SDK 57); actualiza
progress/current-task.json y progress/history.md al cerrar la sesión de planeación.
NO arrancues Fase 3 sin mockups + endpoints confirmados por el Humano.

## Prompt para el Worker (DeepSeek) — TASK-01 de search-bar

MODO: EJECUCIÓN (Trabajador). Ejecutas ÚNICAMENTE la TASK-01 de la feature
search-bar (Fase 3). No planeas, no orquestas, no ejecutas ninguna otra TASK.
Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (leyes absolutas y arnés)
2. progress/current-task.json (estado vivo; active_task = TASK-01)
3. spec/features/search-bar/task.md — SOLO la sección TASK-01
4. spec/features/search-bar/plan.md — SOLO §3 (tokens verbatim) y §3.3 (deps)
5. spec/features/search-bar/spec.md — SOLO §9 (límites) y CA-09
6. spec/constitution/tech-stack.md — SOLO §2 (FlashList v2 / expo-image) y §2.5

CONTEXTO (ya aprobado por el Humano, no re-debatir):
- spec.md de search-bar APROBADA (2026-10-15). Fase 2b (radar-home) CERRADA.
- Las ÚNICAS 2 dependencias autorizadas son @shopify/flash-list y expo-image.

EJECUTA EXACTAMENTE (plan §3, verbatim):
1. global.css: añade los 8 tokens --color-search-* dentro del @theme existente,
   copiando plan §3.1 verbatim (tag-obra #5c7a3f, tag-curso #8b5e2f,
   card-bg #f5f0e8, screen-bg #e8e4d9, surface #ffffff, text-muted #777777,
   image-placeholder #e4e0d5, accent #c97c33). NO toques los tokens Fase 1,
   auth-*, app-* ni radar-*.
2. src/shared/theme/tokens.ts: añade searchPalette al final del archivo,
   copiando plan §3.2 verbatim. NO toques palette, fontFamily, authPalette,
   appPalette ni radarPalette.
3. Instala SOLO estas dos dependencias:
   npx expo install @shopify/flash-list expo-image
   (NUNCA npm i; cero otras dependencias).
4. Verifica con git diff que app.json y app.config.js quedaron SIN CAMBIOS
   (ninguna de las dos deps requiere config plugin).

ARCHIVOS PERMITIDOS (allowed_files — prohibido tocar cualquier otro):
- global.css
- src/shared/theme/tokens.ts
- package.json / package-lock.json (solo vía npx expo install)
- spec/features/search-bar/task.md (marcar pasos - [x] y Status: READY_FOR_REVIEW)
- progress/current-task.json
- progress/history.md

PROHIBIDO: crear componentes o cualquier archivo bajo src/features/**; tocar
src/app/**, App.tsx, eslint.config.js, app.json, app.config.js; escribir código
nativo; hacer commit; correr npx expo start / prebuild / run:* (el rebuild
nativo es EXCLUSIVO del Humano); usar estimatedItemSize en cualquier lado.

ARNÉS OBLIGATORIO AL CERRAR:
- npx tsc --noEmit → debe dar exit 0.
- git diff -- app.json app.config.js → debe quedar vacío.
- git diff -- package.json → solo @shopify/flash-list + expo-image añadidas.

CIERRE: marca en spec/features/search-bar/task.md los pasos de TASK-01 como
- [x] y Status: READY_FOR_REVIEW (NO COMPLETED — la cierra el Humano tras
validar el diff y hacer el rebuild nativo). Actualiza progress/current-task.json
(active_task TASK-01 READY_FOR_REVIEW, harness_status.typecheck_passed: true,
package_json_sin_cambios: false con nota de las 2 deps, app_json_sin_cambios:
true) y añade la entrada en progress/history.md con la evidencia literal
(versiones instaladas, salida del tsc, diffs). NO inicies TASK-02.
PARADA CONTROLADA al terminar: reporta al Humanoque revisar para rebuild nativo.

## Prompt para el Worker (DeepSeek) — TASK-02 de search-bar

MODO: EJECUCIÓN (Trabajador). Ejecutas ÚNICAMENTE la TASK-02 de la feature
search-bar (Fase 3). No planeas, no orquestas, no ejecutas ninguna otra TASK.
Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (leyes absolutas y arnés)
2. progress/current-task.json (estado vivo; active_task = TASK-01 COMPLETED)
3. spec/features/search-bar/task.md — SOLO la sección TASK-02
4. spec/features/search-bar/plan.md — SOLO §4.1–§4.4 y §5.1–§5.2
5. spec/constitution/tech-stack.md — SOLO §5 (Clean Architecture / SOLID)
6. progress/history.md — SOLO la entrada 2026-10-16 de TASK-01 (contexto inmediato)

CONTEXTO (ya cerrado por el Humano, no re-debatir):
- TASK-01 COMPLETED (2026-10-16): tokens search-* registrados y
  @shopify/flash-list@2.0.2 + expo-image@~57.0.5 instaladas; rebuild nativo OK
  en Android e iOS. NO reinstales nada.
- TASK-02 crea SOLO domain + application, sin consumidores. Nadie los importa aún.

EJECUTA EXACTAMENTE (plan §4–§5, firmas verbatim, cero desviaciones):
1. src/features/search/domain/entities/SearchCard.ts        (plan §4.1)
2. src/features/search/domain/entities/SearchPage.ts        (plan §4.2)
3. src/features/search/domain/errors/SearchError.ts         (plan §4.3, incluye isSearchError)
4. src/features/search/domain/ports/SearchRepository.ts     (plan §4.4)
5. src/features/search/application/types.ts                 (plan §5.1)
6. src/features/search/application/globalSearch.ts          (plan §5.2; deja subir SearchError sin catch)

REGLAS DE CAPAS (verificar con grep al cerrar):
- domain/: solo imports relativos entre archivos de domain.
- application/: solo imports "../domain/..." y "./types".
- Cero imports de react, react-native, expo-*, axios, @tanstack, @shopify,
  expo-image, @/shared, @/app.
- Cero any, cero comentarios, cero barrels index.ts, cero clases para use cases
  (factories closure).

ARCHIVOS PERMITIDOS (allowed_files — prohibido tocar cualquier otro):
- src/features/search/domain/** (los 4 archivos)
- src/features/search/application/** (los 2 archivos)
- spec/features/search-bar/task.md (marcar pasos - [x] y Status: READY_FOR_REVIEW)
- progress/current-task.json
- progress/history.md

PROHIBIDO: crear infrastructure/presentation o cualquier otro archivo bajo
src/features/**; tocar src/app/**, App.tsx, eslint.config.js, app.json,
app.config.js, global.css, src/shared/theme/tokens.ts, package.json/lock;
instalar dependencias; escribir código nativo; hacer commit; correr
npx expo start / prebuild / run:* (exclusivo del Humano).

ARNÉS OBLIGATORIO AL CERRAR:
- npx tsc --noEmit → exit 0.
- Grep de capas: domain sin imports no relativos; application solo
  ../domain + ./types; cero React/Expo/Axios/TanStack/FlashList/expo-image.
- npx eslint . → exit 0 (si el lint falla, corrige SOLO en estos 6 archivos).
- git diff -- package.json app.json app.config.js → VACÍO.

CIERRE: marca en spec/features/search-bar/task.md los pasos de TASK-02 como
- [x] y Status: READY_FOR_REVIEW (NO COMPLETED — la cierra el Humano tras
validar los 6 archivos). Actualiza progress/current-task.json (active_task
TASK-02 READY_FOR_REVIEW, harness_status.typecheck_passed: true y nota de los
6 archivos creados) y añade la entrada en progress/history.md con la evidencia
literal (salida del tsc/eslint, resultado del grep de capas, cero deps).
NO inicies TASK-03.
PARADA CONTROLADA al terminar: reporta al Humano que revisar y los 6 archivos para revisión.

## Prompt para el Worker (DeepSeek) — TASK-03 de search-bar

MODO: EJECUCIÓN (Trabajador). Ejecutas ÚNICAMENTE la TASK-03 de la feature
search-bar (Fase 3). No planeas, no orquestas, no ejecutas ninguna otra TASK.
Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (leyes absolutas y arnés)
2. progress/current-task.json (estado vivo; active_task = TASK-02 COMPLETED)
3. spec/features/search-bar/task.md — SOLO la sección TASK-03
4. spec/features/search-bar/plan.md — SOLO §6.1–§6.5 y §7
5. spec/constitution/tech-stack.md — SOLO §5 (Clean Architecture / SOLID)
6. progress/history.md — SOLO las entradas 2026-10-16 de TASK-02 (contexto inmediato)

CONTEXTO (ya cerrado por el Humano, no re-debatir):
- TASK-01 COMPLETED: tokens search-* registrados y @shopify/flash-list@2.0.2 +
  expo-image@~57.0.5 instaladas; rebuild nativo OK en Android e iOS.
  NO reinstales nada y NO toques package.json/lock.
- TASK-02 COMPLETED: 6 archivos de domain + application creados y aprobados.
  Están CONGELADOS: no los modifiques salvo que el plan §6–§7 lo exija
  explícitamente (no lo exige).
- TASK-03 crea infrastructure + SearchProvider/useSearch + wiring, con firmas
  verbatim. NO crea componentes de UI ni toca navegación (eso es TASK-04/05).

EJECUTA EXACTAMENTE (plan §6–§7, firmas verbatim, cero desviaciones):
1. src/features/search/infrastructure/dto.ts                          (§6.1)
2. src/features/search/infrastructure/AxiosGlobalSearchApi.ts         (§6.2;
   path del endpoint solo aquí; cancelación re-lanzada intacta)
3. src/features/search/presentation/SearchProvider.tsx                (§7,
   verbatim con SEARCH_MIN_CHARS / SEARCH_DEBOUNCE_MS)
4. src/features/search/presentation/useSearch.ts                      (§7)
5. src/app/compositionRoot.ts: añadir createSearchUseCases()          (§6.3;
   createAuthUseCases/createHomeUseCases intactos, solo adiciones)
6. App.tsx: searchUseCases a nivel de módulo + <SearchProvider> dentro de
   <HomeProvider>                                                 (§6.4)
7. eslint.config.js: añadir @shopify/* + expo-image a los bans de
   domain/** y application/**                                   (§6.5; bloque
   presentation/navigation sin cambios)

CONTRATO HTTP (verbatim en plan §6.1–§6.2, no inventar):
GET /api/v1/app-mobile/global-search?search={q}&page={n}&size=10
→ Spring Page<AppMobileGlobalSearchCardDTO>. El mapper es 1:1; campos
opcionales ausentes → null.

REGLAS DE CAPAS / DIP (verificar con grep al cerrar):
- domain/** y application/**: cero imports de infraestructura, React, Expo,
  Axios, TanStack, @shopify, expo-image, @/shared, @/app (TASK-02 ya cumple;
  no romperlo).
- infrastructure/**: implementa el puerto SearchRepository; puede usar Axios.
- presentation/**: consume casos de uso vía SearchProvider; nunca infraestructura.
- Único importador de search/infrastructure = src/app/compositionRoot.ts.
- Cero any, cero comentarios, cero barrels index.ts, cero clases para use cases.

ARCHIVOS PERMITIDOS (prohibido tocar cualquier otro):
- src/features/search/infrastructure/** (los 2 archivos)
- src/features/search/presentation/SearchProvider.tsx
- src/features/search/presentation/useSearch.ts
- src/app/compositionRoot.ts
- App.tsx
- eslint.config.js
- spec/features/search-bar/task.md (marcar pasos - [x] y Status: READY_FOR_REVIEW)
- progress/current-task.json
- progress/history.md

PROHIBIDO: tocar src/features/search/domain/** y application/**; crear
componentes de UI o SearchScreen (TASK-04); tocar navegación (TASK-05);
tocar nativos, package.json/lock, app.json, app.config.js, global.css,
src/shared/theme/tokens.ts; instalar dependencias; hacer commit; correr
npx expo start / prebuild / run:* (exclusivo del Humano).

ARNÉS OBLIGATORIO AL CERRAR:
- npx tsc --noEmit → exit 0.
- npx eslint . → exit 0 (si falla, corrige SOLO en los archivos permitidos).
- Grep DIP: único importador de search/infrastructure = compositionRoot.ts;
  @shopify/* y expo-image ausentes de domain/** y application/**.
- git diff -- package.json app.json app.config.js → VACÍO.
- Confirmar que app.json/app.config.js y domain/application no cambiaron.

CIERRE: marca en spec/features/search-bar/task.md los pasos de TASK-03 como
- [x] y Status: READY_FOR_REVIEW (NO COMPLETED — la cierra el Humano tras
validar firmas, mapper 1:1, DIP y fences). Actualiza
progress/current-task.json (active_task TASK-03 READY_FOR_REVIEW,
harness_status.typecheck_passed: true y nota de los archivos creados/editados)
y añade la entrada en progress/history.md con la evidencia literal (salida de
tsc/eslint, grep DIP, gate de deps). NO inicies TASK-04.
PARADA CONTROLADA al terminar: reporta al Humano qué revisar y los archivos
creados/editados.

## Prompt para la nueva sesión (TASK-04):

MODO: EJECUCIÓN (Trabajador). Ejecutas ÚNICAMENTE la TASK-04 de la feature
search-bar (Fase 3). No planeas, no orquestas, no ejecutas ninguna otra TASK.
Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (leyes absolutas y arnés)
2. progress/current-task.json (estado vivo; active_task = TASK-03 COMPLETED)
3. spec/features/search-bar/task.md — SOLO la sección TASK-04
4. spec/features/search-bar/plan.md — SOLO §8.1–§8.5
5. progress/history.md — SOLO la entrada 2026-10-16 de TASK-03

CONTEXTO (ya cerrado por el Humano, no re-debatir):
- TASK-01 COMPLETED: tokens search-* + @shopify/flash-list@2.0.2 +
  expo-image@~57.0.5 instalados; rebuild nativo OK. NO reinstales nada y NO
  toques package.json/lock.
- TASK-02 COMPLETED: 6 archivos de domain + application, CONGELADOS.
- TASK-03 COMPLETED: infrastructure + SearchProvider/useSearch + wiring +
  fences, CONGELADOS. Consume la búsqueda SOLO por useSearch().
- TASK-04 crea los 5 componentes de UI, SIN wire al navigator (RootNavigator
  no se toca; SearchScreen aún no se ve). NO toques navegación, App.tsx,
  compositionRoot, eslint.config.js ni nada de infrastructure/domain/application.
- `src/app/navigation/types.ts` aún NO declara `Search`: añade SOLO
  `Search: undefined` en `AppStackParamList` (excepción tipada autorizada).

EJECUTA EXACTAMENTE (plan §8, firmas/estructura verbatim, cero desviaciones):
1. src/features/search/presentation/format.ts                (§8.1; toTitleCase
   duplicado deliberadamente — prohibido importar de home)
2. src/features/search/presentation/SearchInputBar.tsx       (§8.2; pill blanca,
   lupa, TextInput autoFocus con placeholder verbatim, X solo con texto que
   llama clearQuery sin quitar foco)
3. src/features/search/presentation/SearchResultCard.tsx     (§8.3; memo,
   expo-image 4:3 con recyclingKey/memory-disk o fallback «Sin imagen», pill
   Obra/Capacitación, título Title Case 2 líneas, ubicación, avance solo con
   progreso+estatus presentes — 0% se pinta; ternario estricto)
4. src/features/search/presentation/SearchEmptyState.tsx     (§8.4; variantes
   initial/empty/error, copy verbatim)
5. src/features/search/presentation/SearchScreen.tsx         (§8.5;
   useInfiniteQuery con queryKey ["search","global",debouncedQuery],
   initialPageParam 0, getNextPageParam por isLast/page+1, enabled: isActive,
   placeholderData: keepPreviousData; renderCard/keyExtractor hoisted;
   FlashList numColumns={2} SIN estimatedItemSize; heading + contador;
   spinner central/footer; back arrow con navigation.goBack())
6. src/app/navigation/types.ts: añadir SOLO `Search: undefined` en
   AppStackParamList (RootNavigator NO se toca en esta TASK).

REGLAS DE CAPAS / UI (verificar con grep al cerrar):
- presentation/** consume casos de uso SOLO vía useSearch(); cero imports de
  infrastructure, @/shared/infrastructure, axios, SecureStore.
- expo-image y @shopify/flash-list SOLO en search/presentation.
- Solo Pressable; cero FlatList/estimatedItemSize/className/any/comentarios/
  barrels index.ts; ternarios estrictos en JSX (cero && con valores falsy).
- Paleta search-* + tokens existentes; prohibida auth-* y
  searchPalette.accent.
- Cero toques a domain/**, application/**, infrastructure/**, SearchProvider,
  useSearch, App.tsx, compositionRoot, eslint.config.js, nativos,
  package.json/lock, app.json/app.config.js, global.css, tokens.ts.

ARCHIVOS PERMITIDOS (prohibido tocar cualquier otro):
- src/features/search/presentation/format.ts
- src/features/search/presentation/SearchInputBar.tsx
- src/features/search/presentation/SearchResultCard.tsx
- src/features/search/presentation/SearchEmptyState.tsx
- src/features/search/presentation/SearchScreen.tsx
- src/app/navigation/types.ts (solo `Search: undefined`)
- spec/features/search-bar/task.md (marcar pasos - [x] y Status: READY_FOR_REVIEW)
- progress/current-task.json
- progress/history.md

PROHIBIDO: wire del RootNavigator, RadarSearchBar/menuItems/AppDrawer
(TASK-05); instalar dependencias; npx expo start/prebuild/run:* (exclusivo del
Humano); hacer commit.

ARNÉS OBLIGATORIO AL CERRAR:
- npx tsc --noEmit → exit 0.
- npx eslint . → exit 0 (si falla, corrige SOLO en los archivos permitidos).
- Grep: expo-image/@shopify solo en search/presentation; cero imports de
  infrastructure en presentation; cero FlatList/estimatedItemSize/any/
  TouchableOpacity en search/presentation.
- git diff -- package.json app.json app.config.js → VACÍO.
- Confirmar que domain/application e infrastructure no cambiaron.

CIERRE: marca en spec/features/search-bar/task.md los pasos de TASK-04 como
- [x] y Status: READY_FOR_REVIEW (NO COMPLETED — la cierra el Humano tras
revisar componentes). Actualiza progress/current-task.json (active_task
TASK-04 READY_FOR_REVIEW, harness_status.typecheck_passed: true y nota de los
archivos creados/editados) y añade la entrada en progress/history.md con la
evidencia literal (salida de tsc/eslint, greps, gate de deps). NO inicies
TASK-05. PARADA CONTROLADA al terminar: reporta qué revisar y los archivos
creados/editados.

## Prompt para la nueva sesión (TASK-05):

MODO: EJECUCIÓN (Trabajador). Ejecutas ÚNICAMENTE la TASK-05 de la feature
search-bar (Fase 3). No planeas, no orquestas, no ejecutas ninguna otra TASK.
Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (leyes absolutas y arnés)
2. progress/current-task.json (active_task = TASK-04 COMPLETED)
3. spec/features/search-bar/task.md — SOLO la sección TASK-05
4. spec/features/search-bar/plan.md — SOLO §9.1–§9.5
5. progress/history.md — SOLO la entrada 2026-10-17 de TASK-04

CONTEXTO (ya cerrado por el Humano, no re-debatir):
- TASK-01 COMPLETED: tokens search-* + @shopify/flash-list@2.0.2 +
  expo-image@~57.0.5; rebuild nativo OK. NO reinstales nada y NO toques
  package.json/lock.
- TASK-02, TASK-03 y TASK-04 COMPLETED y CONGELADOS. La búsqueda se consume
  SOLO por useSearch(). SearchScreen, SearchInputBar, SearchResultCard,
  SearchEmptyState y format.ts ya existen y fueron aprobados.
- `src/app/navigation/types.ts` YA declara `Search: undefined`. NO lo toques.
- TASK-05 = wire del navigator + entradas de navegación. Cero cambio visual.

EJECUTA EXACTAMENTE (plan §9, verbatim, cero desviaciones):
1. src/app/navigation/RootNavigator.tsx (plan §9.2): añade
   `import { SearchScreen } from "@/features/search/presentation/SearchScreen";`
   y `<AppStack.Screen name="Search" component={SearchScreen} />` tras la
   screen `Home`. `AppShell`, `NavigationContainer key={status}` y
   `AuthStackNavigator` INTACTOS.
2. src/features/home/presentation/RadarSearchBar.tsx (plan §9.3; cero cambio
   de píxel): envuelve/convierte el contenedor raíz en `Pressable` conservando
   TODOS los estilos y el contenido actual (surface, radio 24, paddings,
   marginTop, gap, boxShadow, lupa y textos). Añade
   `onPress={() => navigation.navigate("Search")}` con `useNavigation`
   tipado como plan §8.5 (`NativeStackNavigationProp<AppStackParamList>`),
   `accessibilityRole="button"`, `accessibilityLabel="Buscar"` (sustituye el
   label anterior) y feedback `pressed` → opacity 0.9. Cero otro cambio visual.
3. src/features/app-shell/presentation/menuItems.ts (plan §9.4; cero píxel):
   `AppMenuAction` pasa a `"home" | "search" | "noop" | "sign-out"`; el ítem
   `search` cambia su `action` de `"noop"` a `"search"`. Labels e iconos
   intactos.
4. src/features/app-shell/presentation/AppDrawer.tsx (plan §9.5; cero píxel):
   añade `useNavigation` tipado como plan §8.5. En el handler de ítems:
   `action === "search"` → `onClose()` + `navigation.navigate("Search")`.
   `home`/`noop`/`sign-out` y todo el layout intactos. Cero cambio visual.

REGLAS:
- Solo Pressable; cero TouchableOpacity/FlatList/any/className/comentarios.
- Ternarios estrictos en JSX (cero && con valores falsy).
- NO toques SearchScreen ni ningún archivo de search/domain/application/
  infrastructure/presentation, SearchProvider, useSearch, App.tsx,
  compositionRoot, eslint.config.js, package.json/lock, app.json/app.config.js,
  global.css, tokens.ts, nativos.
- NO ejecutes npx expo start/prebuild/run:* (exclusivo del Humano). Sin commit.

ARCHIVOS PERMITIDOS (prohibido tocar cualquier otro):
- src/app/navigation/RootNavigator.tsx
- src/features/home/presentation/RadarSearchBar.tsx
- src/features/app-shell/presentation/menuItems.ts
- src/features/app-shell/presentation/AppDrawer.tsx
- spec/features/search-bar/task.md
- progress/current-task.json
- progress/history.md

ARNÉS OBLIGATORIO AL CERRAR:
- npx tsc --noEmit → exit 0.
- npx eslint . → exit 0 (se acepta únicamente el warning preexistente de
  TASK-03: useContext sin usar en SearchProvider.tsx; no introduzcas warnings
  nuevos). Si falla, corrige SOLO en los archivos permitidos.
- Grep: `git diff -- src/features/app-shell src/features/home` muestra SOLO
  RadarSearchBar + menuItems + AppDrawer (acciones, cero píxel).
- Grep: cero imports de search/infrastructure fuera de compositionRoot;
  cero any/TouchableOpacity/FlatList/estimatedItemSize/expo-router nuevos.
- git diff -- package.json app.json app.config.js → VACÍO.

CIERRE: marca en spec/features/search-bar/task.md los pasos de TASK-05 como
- [x] y Status: READY_FOR_REVIEW (NO COMPLETED: la validación visual Android +
iOS la hace el Humano con el checklist CA-01…07). Actualiza
progress/current-task.json (active_task TASK-05 READY_FOR_REVIEW,
harness_status.typecheck_passed: true, nota con archivos editados) y añade la
entrada en progress/history.md con la evidencia literal (tsc/eslint, greps,
gate de deps). NO inicies TASK-06. PARADA CONTROLADA: reporta qué revisar y
los archivos editados.

## Prompt para la nueva sesión (TASK-06):

MODO: EJECUCIÓN / AUDITORÍA (Trabajador + Revisor). Ejecutas ÚNICAMENTE la
TASK-06 de la feature search-bar (Fase 3). No planeas, no orquestas, no
ejecutas ninguna otra TASK y NO abres Fase 4.
Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (leyes absolutas y arnés)
2. progress/current-task.json (active_task = TASK-05 COMPLETED)
3. spec/features/search-bar/task.md — SOLO la sección TASK-06
4. spec/features/search-bar/plan.md — SOLO §10 (skills) y §11 (criterio de
   hecho técnico); usa §1 si necesitas el árbol destino
5. progress/history.md — SOLO las entradas 2026-10-17 de TASK-04 y TASK-05
   (incluida la aprobación Humana)

CONTEXTO (ya cerrado por el Humano, no re-debatir):
- TASK-01…TASK-05 COMPLETED. TASK-05 validada por el Humano en Android + iOS
  con el checklist CA-01…07: funciona correctamente.
- package.json/lock ya contienen @shopify/flash-list@2.0.2 y
  expo-image@~57.0.5 desde TASK-01. NO reinstales ni toques package.json/lock.
- app.json/app.config.js no cambiaron por la feature. NO toques config nativa
  ni archivos nativos.
- TASK-06 es SOLO auditoría/arnés: no añade features, no cambia UI.

EJECUTA EXACTAMENTE (task.md TASK-06, verbatim):
1. npx tsc --noEmit → exit 0.
2. npx eslint . → exit 0 y cero warnings. Desviación conocida: 1 warning
   preexistente de TASK-03 en src/features/search/presentation/SearchProvider.tsx
   (useContext importado y sin usar). NO edites ese archivo sin autorización
   explícita del Humano; si persiste, documéntalo como desviación y solicita
   autorización (es un archivo de TASK-03, fuera del allowed_files de TASK-06).
3. Greps src/**/*.ts(x) + App.tsx: cero any, TouchableOpacity, FlatList,
   expo-router, estimatedItemSize; auth-* fuera de auth = 0 (salvo el ACEPTADO
   preexistente de 1.5b en src/shared/ui/* y tokens.ts, documentado en
   harness_status); searchPalette.accent fuera de tokens.ts = 0.
4. DIP: único importador de search/infrastructure = src/app/compositionRoot.ts;
   @shopify/* y expo-image ausentes de domain/application;
   @shopify/flash-list y expo-image solo en search/presentation.
5. Deps: git diff de package.json contra baseline pre-Fase-3 muestra SOLO
   @shopify/flash-list + expo-image; git diff -- app.json app.config.js VACÍO.
6. Contrato: path /api/v1/app-mobile/global-search una sola vez en código
   (AxiosGlobalSearchApi.ts); infrastructure/dto.ts espejo de spec §4.6.
7. Chrome/radar: git diff de src/features/app-shell/** y src/features/home/**
   limitado a los 3 archivos de acciones de TASK-05 (AppDrawer.tsx,
   menuItems.ts, RadarSearchBar.tsx); cero otro cambio.

REGLAS:
- Solo Pressable; cero TouchableOpacity/FlatList/any/className/comentarios nuevos.
- Ternarios estrictos en JSX (cero && con valores falsy).
- NO toques SearchScreen ni search/domain|application|infrastructure|presentation,
  SearchProvider, useSearch, App.tsx, compositionRoot, eslint.config.js,
  package.json/lock, app.json/app.config.js, global.css, tokens.ts ni nativos.
- Instructions/** está fuera de alcance (hay una modificación preexistente en
  Instructions/fase_3/fase_3.md; no la toques).
- NO ejecutes npx expo start/prebuild/run:*. Sin commit. Sin dependencias nuevas.
- Correcciones: SOLO en archivos de TASK-01…05 y SOLO si el Humano/Revisor
  autoriza el allowed_files extra. No "arregles" auth, chrome ni radar.

ARCHIVOS PERMITIDOS (prohibido tocar cualquier otro sin autorización):
- spec/features/search-bar/task.md
- progress/current-task.json
- progress/history.md

ARNÉS OBLIGATORIO AL CERRAR:
- Reproduce y reporta literalmente tsc/eslint, los greps y el gate de deps.
- git diff -- package.json app.json app.config.js → VACÍO.
- Verifica que TASK-06 no introduce cambios de código en src/.

CIERRE:
- Marca en spec/features/search-bar/task.md los pasos de TASK-06 como - [x] y
  Status: READY_FOR_REVIEW (NO COMPLETED: el cierre formal lo hace el Humano).
- Actualiza progress/current-task.json (active_task TASK-06 READY_FOR_REVIEW,
  harness_status con la evidencia y desviaciones) y añade la entrada en
  progress/history.md con la evidencia literal.
- NO inicies Fase 4. PARADA CONTROLADA: reporta el resultado del arnés,
  desviaciones y qué debe revisar el Humano.