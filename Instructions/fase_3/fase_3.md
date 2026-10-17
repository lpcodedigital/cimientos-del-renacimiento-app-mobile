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
