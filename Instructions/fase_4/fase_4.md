MODO: ORQUESTACIÓN (Lead Planner). NO ejecutas código ni TASKs — solo lees,
planificas y escribes SDD (spec/plan/task), enmiendas constitucionales y
progress/*. El Trabajador (DeepSeek) ejecuta en sesiones aparte. El Humano
valida en físico.
Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN +
TS strict + NativeWind v5 + React Navigation + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés)
2. progress/current-task.json (estado vivo del proyecto)
3. progress/history.md — SOLO las entradas 2026-10-15…2026-10-17 (Fase 3;
   usa offset; están al final del archivo)
4. spec/constitution/roadmap.md (Fases 1–3 cerradas; Fase 4 = Ficha Final
   (Resumen Ejecutivo) y Evidencias)
5. spec/constitution/tech-stack.md (§2 deps y restricciones, §2.5 paleta
   search-*, §4 Backend & Cloudflare Images, §5 arquitectura)
6. spec/constitution/mission.md (read-only app, prohibido pedir reescritura
   del backend)
7. spec/features/search-bar/task.md — SOLO el cierre de TASK-06
8. spec/features/search-bar/spec.md — SOLO §4.6 (contrato global-search) y
   §8 (arquitectura; los no-op de Fase 4 que hoy activan el detalle)

ESTADO ACTUAL (sincronizado al 2026-10-17):
- Fase 1/1.5a/1.5b (auth + biometría + Clean Architecture), Fase 2a (chrome
  app-shell), Fase 2b (radar-home) y Fase 3 (search-bar) = CERRADAS y
  aprobadas por el Humano en físico.
- App hoy: login híbrido → chrome (header/drawer) → Radar (Google Maps
  homologado, pin guinda por municipio, chips, etiqueta dispositivo, popup
  KPI municipal con ripple, «Ver más» NO-OP = entrada Fase 4) → Search
  (pantalla propia estilo Uber/Rappi: falso input en Home, debounce 500 ms,
  MIN_CHARS 3, X que limpia, back arrow en cuerpo, FlashList v2 grid 2 col
  con pills Obra/Capacitación, fallback «Sin imagen», scroll infinito
  paginado contra GET /api/v1/app-mobile/global-search; tap en tarjeta =
  NO-OP = entrada Fase 4).
- Estructura: src/features/{auth,app-shell,home,search}/{domain,application,
  infrastructure,presentation}; compositionRoot.ts único importador de infra;
  fences ESLint no-restricted-imports; TanStack Query (useQuery /
  useInfiniteQuery) para server state; use cases = closures; providers con
  fachada única (useAuth / useHomeRadar / useSearch).
- Deps autorizadas acumuladas: expo-location + react-native-maps (2b),
  @shopify/flash-list@2.0.2 + expo-image@~57.0.5 (3), build plumbing 68cb002
  (whitelist CA-09 de radar-home). Keys Google Maps en .env vía app.config.js
  (prohibido hardcodear). security-keys CANCELADA (keys ya rotadas por el
  Humano 2026-10-15).
- Paletas vigentes: Fase 1 (guinda #6B142E, dorado #C4A35A), app-*, radar-*,
  search-* (search-accent #C97C33 RESERVADO para Fase 4 = color del monto
  muestreado de Busqueda.png).

COLA PENDIENTE (única):
FASE 4 — Ficha Final (Resumen Ejecutivo) y Evidencias (roadmap §4):
- Pantalla de detalle ejecutivo de la Obra/Capacitación (read-only).
- Tarjetas KPI: Finanzas ($ MDP), Avance (%) y Empleo Local (% Personal Local).
- Carrusel de evidencias cronológicas (Antes / En Proceso / Después)
  integradas nativamente vía Cloudflare Images (tech-stack §4: toda evidencia
  fotográfica se consume desde URL optimizada de Cloudflare).
- Puntos de entrada existentes (hoy no-op): tap en tarjeta del explorador
  (Search) y «Ver más» del popup KPI municipal (Radar).

TU TRABAJO EN ESTA SESIÓN (con el Humano, en modo plan/diálogo):
A. Desarrollar la ESTRATEGIA de Fase 4 (aún NO escribir spec/plan/task
   definitivos):
   - Preguntar al Humano: mockup del detalle (¿ruta/nombre del archivo? el
     Humano dice que YA LO TIENE — pedir que lo versione en
     spec/features/<feature>/mockups/ y darte la ruta exacta); endpoints
     reales de detalle de OBRA y de CURSO (paths completos, JSON de ejemplo
     reales y DTOs Java verbatim — el Humano dice que YA LOS TIENE);
     ¿un solo endpoint unificado o dos endpoints separados por tipo?;
     cómo se resuelve la navegación desde la tarjeta de Search (tenemos
     tipo + idOriginal) y desde «Ver más» del popup municipal (¿existe
     endpoint de detalle por municipio o esa entrada se descarta/aciota?);
     estructura de evidencias (¿URLs Cloudflare vienen en el DTO de detalle?
     ¿variantes/tamaños?); comportamiento del carrusel (swipe, indicadores,
     fullscreen?); header/back del detalle (patrón de Fase 3: chrome
     congelado, back + título en el cuerpo).
   - Recordar: el Worker NO lee imágenes → toda UI nueva requiere
     transcripción literal del mockup hecha por ti (como spec §4.5 de
     radar-home y search-bar), con muestreo de píxeles Python stdlib para
     nuevos tokens.
   - Cualquier dependencia nueva requiere gate del Humano + enmienda de
     tech-stack.md (expo-image YA está instalada y autorizada; evalúa si el
     carrusel se resuelve con FlashList/ScrollView horizontal + expo-image
     sin nueva dep).
   - Clean Architecture + SOLID + skills de performance (.agents/skills)
     desde la primera línea; feature nueva src/features/<nombre>/ en 4 capas;
     fences ESLint; compositionRoot único importador; TanStack Query para
     server state; cero cambio de píxel en chrome/radar/search (solo las
     acciones de navegación de los dos no-op existentes).
B. Entregar al final: orden de trabajo propuesto (Paso 0 SDD → TASK-01…N)
   + lista de insumos que el Humano debe traer (mockup versionado, contratos
   de detalle verbatim, decisiones de navegación/carrusel) antes del Paso 0
   SDD de Fase 4.

REGLAS: cero vibe coding; cero deps no autorizadas; Context7 solo para
consultas quirúrgicas (expo-image variants, patrones de carrusel con
FlashList, Expo SDK 57); actualiza progress/current-task.json y
progress/history.md al cerrar la sesión de planeación. NO arranques Fase 4
sin mockup + endpoints confirmados por el Humano.
Dos cosas que conviene que prepares antes de esa sesión (el prompt ya las exige, pero te las adelanto): (1) la ruta donde versionarás el mockup del detalle (sugiero spec/features/ficha-detalle/mockups/ o el nombre que prefieras), y (2) los JSON de ejemplo reales + DTOs Java de los endpoints de detalle de obra y curso, como hiciste con global-search. Con eso el Orquestador podrá hacer la adjudicación mockup↔contrato sin bloqueos.

## Prompt para la nueva sesión (TASK-01):

MODO: TRABAJADOR (Execution Agent). Ejecutas EXACTAMENTE UNA TASK: TASK-01 de la
feature detail-obra-curso (Fase 4). Código quirúrgico en React Native. SOLO tocas
los archivos listados en allowed_files. El Orquestador ya escribió la SDD; tú NO
planificas, NO improvisas y NO lees imágenes.

Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict
+ NativeWind v5 + React Navigation + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés)
2. progress/current-task.json (estado vivo: active_task = TASK-01, TODO desbloqueada)
3. progress/history.md — SOLO las 3 últimas entradas 2026-10-20 (planeación Fase 4,
   Paso 0 SDD y aprobación de la spec; están al final del archivo, usa offset)
4. spec/constitution/tech-stack.md — SOLO §2.6 (paleta detail-*) y §2.5 (nota de
   search-accent)
5. spec/features/detail-obra-curso/task.md — SOLO TASK-01
6. spec/features/detail-obra-curso/plan.md — SOLO §2 (orden) y §3 (tokens verbatim)
7. src/shared/theme/tokens.ts y global.css (estado actual de las paletas; verás
   palette/fontFamily/authPalette/appPalette/radarPalette/searchPalette — NO las toques)

CONTEXTO MÍNIMO (ya validado por el Orquestador, no re-verifiques):
- Fase 3 (search-bar) CERRADA y aprobada en físico. Fase 4 = pantalla de detalle
  Obra/Capacitación. spec.md APROBADA por el Humano (2026-10-20).
- Fase 4 = CERO dependencias nuevas. TASK-01 NO instala nada.

TU TRABAJO EN ESTA SESIÓN — TASK-01 (tokens detail-*):
1. Editar global.css: añadir los 5 tokens --color-detail-* dentro del @theme
   existente, INMEDIATAMENTE DESPUÉS de los --color-search-* (copia verbatim de
   plan §3):
   --color-detail-screen-bg: #e4e4d8;
   --color-detail-card-bg: #f4f0e8;
   --color-detail-accent: #bc803c;
   --color-detail-kpi-label: #545454;
   --color-detail-text-muted: #7c7c78;
2. Editar src/shared/theme/tokens.ts: añadir al FINAL del archivo (copia verbatim
   de plan §3), sin tocar las paletas existentes:
   export const detailPalette = {
     screenBg: "#E4E4D8",
     cardBg: "#F4F0E8",
     accent: "#BC803C",
     kpiLabel: "#545454",
     textMuted: "#7C7C78",
   } as const;
3. Arnés: npx tsc --noEmit → debe dar exit 0.
4. Gate de deps: git diff -- package.json app.json app.config.js → debe quedar
   VACÍO. PROHIBIDO npx expo install / npm i / cualquier instalación.
5. Cierre: marca TASK-01 como - [x] / Status: READY_FOR_REVIEW en
   spec/features/detail-obra-curso/task.md (NO COMPLETED — el cierre es del Humano).
   Actualiza progress/current-task.json (active_task: TASK-01 READY_FOR_REVIEW,
   harness_status.typecheck_passed: true, nota fase_4_task_01_run) y añade la
   entrada de TASK-01 en progress/history.md (formato calco de las entradas de
   Fase 3: alcance, diff de tokens, arnés, gate de deps, PARADA CONTROLADA).

REGLAS ESTRICTAS:
- allowed_files: global.css, src/shared/theme/tokens.ts,
  spec/features/detail-obra-curso/task.md, progress/current-task.json,
  progress/history.md. NINGÚN otro archivo.
- CERO componentes, cero src/features/detail/**, cero src/app/**, App.tsx,
  eslint.config.js, nativos, package.json/lock, app.json, app.config.js.
- CERO npx expo start / prebuild / run:* (reservado al Humano). CERO commit.
- CERO vibe coding: los tokens se copian verbatim de plan §3; no inventes hex ni
  nombres. detail-accent es #BC803C (NO uses #C97C33 — ese es search-accent,
  histórico prohibido).
- Si npx tsc --noEmit falla por algo ajeno a tus 2 archivos, NO arregles nada
  fuera de allowed_files: repórtalo como hallazgo en history.md y detente.

PARADA CONTROLADA (gate Humano): al terminar, TASK-01 queda READY_FOR_REVIEW. Le dices al humano lo que espera de la task ejecutada y que es lo que debe de validar.
El Humano valida el diff (solo tokens; configs vacías) y da el cierre COMPLETED.
TASK-02 NO se inicia en esta sesión.

## Prompt para la nueva sesión del Worker TASK-02:

MODO: TRABAJADOR (Execution Agent). Ejecutas EXACTAMENTE UNA TASK: TASK-02 de la
feature detail-obra-curso (Fase 4). Código quirúrgico en React Native. SOLO tocas
los archivos listados en allowed_files. El Orquestador ya escribió la SDD; tú NO
planificas, NO improvisas y NO lees imágenes.

Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict
+ NativeWind v5 + React Navigation + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés).
2. progress/current-task.json (estado vivo: active_task = TASK-02 TODO desbloqueada).
3. progress/history.md — SOLO las 3 últimas entradas 2026-10-20 (TASK-01 RUN,
   TASK-01 APROBADA/COMPLETED y cierre). Están al final del archivo (usa offset).
4. spec/features/detail-obra-curso/task.md — SOLO TASK-02 (incluye allowed_files).
5. spec/features/detail-obra-curso/plan.md — SOLO §4 (Domain, §4.1–§4.5) y §5
   (Application, §5.1–§5.3). Todo es VERBATIM.
6. Referencias de patrón (solo lectura): src/features/search/domain/ y
   src/features/search/application/ (calco de estilo/estructura de Fase 3).

CONTEXTO MÍNIMO (ya validado por el Orquestador, no re-verifiques):
- Fase 3 (search-bar) CERRADA. Fase 4 = pantalla detalle Obra/Capacitación;
  spec.md APROBADA (2026-10-20).
- TASK-01 COMPLETED (2026-10-20): tokens --color-detail-* y detailPalette ya
  registrados. NO los toques.
- TASK-02 = Domain + Application, CERO consumidores y CERO dependencias nuevas.
  NO se instala nada.
- En domain el campo es galleryUrls: string[] | null (el typo del backend
  "galeryUrls" es SOLO de infrastructure/dto.ts en TASK-03; NO lo uses aquí).
- TASK-03+ NO se inician en esta sesión.

TU TRABAJO EN ESTA SESIÓN — TASK-02 (8 archivos, verbatim plan §4–§5):
Crear EXACTAMENTE estos 8 archivos nuevos:
1. src/features/detail/domain/entities/ObraDetail.ts        (plan §4.1)
2. src/features/detail/domain/entities/CursoDetail.ts       (plan §4.2)
3. src/features/detail/domain/errors/DetailError.ts         (plan §4.3, calco SearchError)
4. src/features/detail/domain/ports/ObraDetailRepository.ts (plan §4.4)
5. src/features/detail/domain/ports/CursoDetailRepository.ts(plan §4.5)
6. src/features/detail/application/types.ts                 (plan §5.1)
7. src/features/detail/application/obraDetail.ts            (plan §5.2)
8. src/features/detail/application/cursoDetail.ts           (plan §5.3)

Puntos obligatorios:
- Copia las firmas y tipos EXACTAMENTE del plan (cero hex, cero nombres nuevos,
  cero campos añadidos, cero `any`).
- Imports SOLO relativos: domain importa sus entities/errors/ports relativos;
  application importa ../domain y ./types. PROHIBIDO react, react-native, axios,
  @tanstack, expo-*, react-native-maps, @shopify, expo-image, @/shared, @/app.
- Los use cases dejan subir DetailError sin catch (patrón 2b/3).
- NO crees infrastructure/, presentation/, componentes, navegación, providers ni wiring.

ARNÉS OBLIGATORIO:
- npx tsc --noEmit → exit 0.
- npx eslint . → exit 0.
- Grep de capas (evidencia para history): domain/application solo imports relativos;
  cero imports de framework/alias prohibidos.
- Gate de deps: git diff -- package.json app.json app.config.js → VACÍO.
  PROHIBIDO npx expo install / npm i / cualquier instalación.
- Si tsc/eslint fallan por algo ajeno a tus 8 archivos, NO arregles nada fuera de
  allowed_files: repórtalo como hallazgo en history.md y detente.

CIERRE:
- Marca TASK-02 como - [x] / Status: READY_FOR_REVIEW en
  spec/features/detail-obra-curso/task.md (NO COMPLETED — el cierre es del Humano;
  deja TASK-03 en TODO).
- Actualiza progress/current-task.json (active_task: TASK-02 READY_FOR_REVIEW,
  harness_status.typecheck_passed: true y nota fase_4_task_02_run con archivos,
  arnés, grep de capas y gate de deps).
- Añade la entrada de TASK-02 en progress/history.md (formato calco de Fase 3:
  alcance, 8 archivos, arnés, grep de capas, gate de deps, PARADA CONTROLADA).
- NO inicies TASK-03.

REGLAS ESTRICTAS:
- allowed_files: src/features/detail/domain/**, src/features/detail/application/**,
  spec/features/detail-obra-curso/task.md, progress/current-task.json,
  progress/history.md. NINGÚN otro archivo.
- CERO components/presentation/infrastructure, cero src/app/**, App.tsx,
  eslint.config.js, nativos, package.json/lock, app.json, app.config.js,
  global.css, tokens.ts.
- CERO npx expo start / prebuild / run:* (reservado al Humano). CERO commit.
- CERO vibe coding: todo verbatim del plan §4–§5.

PARADA CONTROLADA (gate Humano): al terminar, TASK-02 queda READY_FOR_REVIEW.
Informa al Humano qué esperar de esta task y validar: los 8 archivos domain/application, firmas verbatim,
cero imports de framework, tsc/eslint en verde y git diff de configs VACÍO.
El Humano da el cierre COMPLETED. TASK-03 NO se inicia en esa sesión.

## Prompt para la nueva sesión del Worker TASK-03:

MODO: TRABAJADOR (Execution Agent). Ejecutas EXACTAMENTE UNA TASK: TASK-03 de la
feature detail-obra-curso (Fase 4). Código quirúrgico en React Native. SOLO tocas
los archivos listados en allowed_files. El Orquestador ya escribió la SDD; tú NO
planificas, NO improvisas y NO lees imágenes.

Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict
+ NativeWind v5 + React Navigation + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés).
2. progress/current-task.json (estado vivo: active_task = TASK-03 TODO desbloqueada).
3. progress/history.md — SOLO las 4 últimas entradas 2026-10-20 (TASK-02 RUN,
   TASK-02 APROBADA/COMPLETED y cierre). Están al final del archivo (usa offset).
4. spec/features/detail-obra-curso/task.md — SOLO TASK-03 (incluye allowed_files).
5. spec/features/detail-obra-curso/plan.md — SOLO §6 (Infrastructure, §6.1–§6.3) y
   §7 (Providers y wiring, §7.1–§7.5). Todo es VERBATIM.
6. Referencias de patrón (solo lectura): src/features/search/infrastructure/
   (dto.ts, AxiosGlobalSearchApi.ts), src/features/search/presentation/
   (SearchProvider.tsx), src/app/compositionRoot.ts y App.tsx (estado actual).

CONTEXTO MÍNIMO (ya validado por el Orquestador, no re-verifiques):
- Fase 3 (search-bar) CERRADA. Fase 4 = pantalla detalle Obra/Capacitación;
  spec.md APROBADA (2026-10-20).
- TASK-01 COMPLETED: tokens --color-detail-* y detailPalette ya registrados. NO los toques.
- TASK-02 COMPLETED (Humano 2026-10-20): ya existen los 8 archivos verbatim de
  src/features/detail/domain/ y src/features/detail/application/ (contratos
  ObraDetail/CursoDetail con galleryUrls: string[] | null, DetailError,
  ObraDetailRepository.getObraById, CursoDetailRepository.getCursoById,
  DetailUseCases, createObraDetail, createCursoDetail). NO los toques.
- TASK-03 = Infrastructure + compositionRoot + DetailProvider. CERO dependencias
  nuevas. NO se instala nada.
- El typo del backend "galeryUrls" es SOLO de infrastructure/dto.ts (sin corregir);
  el dominio ya expone galleryUrls.
- TASK-04+ NO se inician en esta sesión.

TU TRABAJO EN ESTA SESIÓN — TASK-03 (verbatim plan §6–§7):
Crear EXACTAMENTE:
1. src/features/detail/infrastructure/dto.ts          (plan §6.1; galeryUrls sic)
2. src/features/detail/infrastructure/AxiosObraDetailApi.ts  (plan §6.2)
3. src/features/detail/infrastructure/AxiosCursoDetailApi.ts (plan §6.3)
4. src/features/detail/presentation/DetailProvider.tsx (plan §7.1, calco SearchProvider)
5. src/features/detail/presentation/useDetail.ts       (plan §7.2)

Editar SOLO:
6. src/app/compositionRoot.ts → añadir createDetailUseCases() al final, sin tocar las
   factories existentes (plan §7.3).
7. App.tsx → detailUseCases a nivel de módulo + <DetailProvider> dentro de
   <SearchProvider> (plan §7.4).

Puntos obligatorios:
- Copia firmas, DTOs, paths (/api/v1/app-mobile/obra, /api/v1/app-mobile/curso,
  únicos), mappers, cancelación (calco de AxiosGlobalSearchApi) y providers
  EXACTAMENTE del plan (cero hex, cero nombres nuevos, cero campos añadidos, cero any).
- dto.ts es espejo de spec §4.7; coverImageUrl se ignora en el mapper de curso;
  galeryUrls → galleryUrls en Obra.
- DIP: infrastructure solo la importa compositionRoot.ts; infrastructure importa
  axiosClient de @/shared/infrastructure/http/axiosClient.
- NO crees componentes de pantalla, navegación, format.ts, KpiCard, etc.
  (eso es TASK-04). NO toques domain/application.
- PROHIBIDO react-native-maps, FlashList, expo-image y cualquier UI en esta TASK.
- Verificar eslint.config.js SIN CAMBIOS.

ARNÉS OBLIGATORIO:
- npx tsc --noEmit → exit 0.
- npx eslint . → exit 0.
- Greps DIP (evidencia para history): detail/infrastructure importado SOLO por
  compositionRoot.ts; paths de endpoints únicos; @shopify/expo-image/
  react-native-maps ausentes de domain/application; cero any.
- Gate de deps: git diff -- package.json app.json app.config.js → VACÍO.
  PROHIBIDO npx expo install / npm i / cualquier instalación.
- Si tsc/eslint fallan por algo ajeno a esta TASK, NO arregles nada fuera de
  allowed_files: repórtalo como hallazgo en history.md y detente.

CIERRE:
- Marca TASK-03 como - [x] / Status: READY_FOR_REVIEW en
  spec/features/detail-obra-curso/task.md (NO COMPLETED — el cierre es del Humano;
  deja TASK-04 en TODO).
- Actualiza progress/current-task.json (active_task: TASK-03 READY_FOR_REVIEW,
  harness_status.typecheck_passed: true y nota fase_4_task_03_run con archivos,
  arnés, greps DIP y gate de deps).
- Añade la entrada de TASK-03 en progress/history.md (alcance, archivos, arnés,
  greps DIP/endpoints, gate de deps, PARADA CONTROLADA).
- NO inicies TASK-04.

REGLAS ESTRICTAS:
- allowed_files: src/features/detail/infrastructure/**,
  src/features/detail/presentation/DetailProvider.tsx,
  src/features/detail/presentation/useDetail.ts,
  src/app/compositionRoot.ts, App.tsx,
  spec/features/detail-obra-curso/task.md, progress/current-task.json,
  progress/history.md. NINGÚN otro archivo.
- CERO domain/application, componentes/pantalla, src/app/navigation/**,
  eslint.config.js, nativos, package.json/lock, app.json, app.config.js,
  global.css, tokens.ts.
- CERO npx expo start / prebuild / run:* (reservado al Humano). CERO commit.
- CERO vibe coding: todo verbatim del plan §6–§7.

PARADA CONTROLADA (gate Humano): al terminar, TASK-03 queda READY_FOR_REVIEW.
Informa al Humano qué validar: los 5 archivos nuevos + los 2 edits de wiring,
DTOs/paths verbatim, DIP (infrastructure solo en compositionRoot.ts), tsc/eslint
en verde, git diff de configs VACÍO y eslint.config.js intacto.
El Humano da el cierre COMPLETED. TASK-04 NO se inicia en esa sesión.

## Prompt para la nueva sesión del Worker (TASK-04):

MODO: TRABAJADOR (Execution Agent). Ejecutas EXACTAMENTE UNA TASK: TASK-04 de la
feature detail-obra-curso (Fase 4). Código quirúrgico en React Native. SOLO tocas
los archivos listados en allowed_files. El Orquestador ya escribió la SDD; tú NO
planificas, NO improvisas y NO lees imágenes.

Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict
+ NativeWind v5 + React Navigation + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés).
2. progress/current-task.json (estado vivo: active_task = TASK-04 TODO desbloqueada).
3. progress/history.md — SOLO las últimas entradas 2026-10-20 (TASK-03 RUN,
   TASK-03 APROBADA/COMPLETED y cierre). Están al final del archivo (usa offset).
4. spec/features/detail-obra-curso/task.md — SOLO TASK-04 (incluye allowed_files).
5. spec/features/detail-obra-curso/plan.md — SOLO §8 completo (§8.1–§8.11). Todo es
   VERBATIM.
6. Referencias de patrón (solo lectura): src/features/home/presentation/RadarMap.tsx
   (pin guinda + MapView), src/features/search/presentation/SearchScreen.tsx
   (useQuery/FlashList back arrow/estados), src/features/search/presentation/
   SearchResultCard.tsx (expo-image), src/features/detail/presentation/
   DetailProvider.tsx y useDetail.ts (ya creados), src/shared/theme/tokens.ts
   (detailPalette) y src/app/navigation/types.ts (estado actual).

CONTEXTO MÍNIMO (ya validado por el Orquestador, no re-verifiques):
- Fase 4 = pantalla detalle Obra/Capacitación; spec.md APROBADA (2026-10-20).
- TASK-01 COMPLETED: tokens --color-detail-* y detailPalette ya registrados. NO los toques.
- TASK-02 COMPLETED: domain/application ya existen (ObraDetail/CursoDetail con
  galleryUrls: string[] | null, DetailError, puertos, DetailUseCases,
  createObraDetail, createCursoDetail). NO los toques.
- TASK-03 COMPLETED: infrastructure (dto + 2 AxiosApi), DetailProvider/useDetail,
  compositionRoot y App.tsx ya cableados. NO los toques.
- TASK-04 = SOLO componentes presentation + la ruta en navigation/types.ts.
  RootNavigator INTACTO (el wire real es TASK-05). CERO dependencias nuevas;
  NO se instala nada. NO se hace prebuild ni compilación (eso es TASK-05/Humano).
- La pantalla aún NO se verá en la app (sin ruta montada).
- `coverImageUrl` NO se usa; el dominio expone `galleryUrls`.
- `progress: 0` es válido (ternario estricto, nunca `&&`).

TU TRABAJO EN ESTA SESIÓN — TASK-04 (verbatim plan §8):
Crear EXACTAMENTE estos 10 archivos nuevos:
1. src/features/detail/presentation/format.ts              (§8.1)
2. src/features/detail/presentation/KpiCard.tsx            (§8.2)
3. src/features/detail/presentation/DetailSectionHeading.tsx (§8.3)
4. src/features/detail/presentation/DetailInfoRows.tsx     (§8.4)
5. src/features/detail/presentation/DetailMapCard.tsx      (§8.5)
6. src/features/detail/presentation/EvidenceCarousel.tsx   (§8.6)
7. src/features/detail/presentation/EvidenceViewerModal.tsx (§8.7)
8. src/features/detail/presentation/ObraDetailContent.tsx  (§8.8)
9. src/features/detail/presentation/CursoDetailContent.tsx (§8.9)
10. src/features/detail/presentation/DetailScreen.tsx      (§8.10)

Editar SOLO:
11. src/app/navigation/types.ts → añadir `Detail: { tipo: "OBRA" | "CURSO"; id: number }`
    al AppStackParamList (§8.11 verbatim; literal inline, sin importar SearchCardTipo).
    RootNavigator NO se toca.

Puntos obligatorios:
- Copia firmas, copy, props, colores (detailPalette), tamaños de fuente, radios,
  iconos Ionicons y orden de secciones EXACTAMENTE del plan §8 (cero hex, cero
  nombres nuevos, cero campos añadidos, cero any, cero TouchableOpacity).
- format.ts: MONEY_FORMATTER y MESES hoisted; toTitleCase duplicado deliberado
  (prohibido importar entre features). formatInversion("10495378.41") →
  "$10,495,378.41"; formatFechaCurso("2026-07-04") → "4 de julio de 2026".
- DetailMapCard.tsx: ÚNICO archivo de detail con react-native-maps; copia el
  patrón de pin guinda de RadarMap.tsx (duplicado deliberado, prohibido importar
  entre features); PROVIDER_GOOGLE; pitch/rotate off; altura 200.
- EvidenceCarousel.tsx: ÚNICO con @shopify/flash-list; horizontal; PROHIBIDO
  estimatedItemSize; expo-image con recyclingKey y cachePolicy="memory-disk";
  caption "evidencia N"; vacío → "Sin evidencias fotográficas.".
- EvidenceViewerModal.tsx: Modal nativo RN, expo-image, ternario estricto para
  url (nunca `{url && ...}`), X con accessibilityLabel="Cerrar".
- DetailScreen.tsx: dos useQuery con enabled por tipo, queryKey ["detail","obra",id]
  / ["detail","curso",id], signal al use case; back arrow en el cuerpo con
  accessibilityLabel="Volver"; SIN useHeaderTitle (eso es TASK-05); spinner guinda;
  error "No se pudo cargar el detalle."; ScrollView + contenido por tipo;
  EvidenceViewerModal al final. Cero any (narrow por rama del ternario).
- ObraDetailContent: 3 KpiCard (Finanzas/Avance/Estatus compact), secciones
  Ubicación/Evidencias/Descripción, filas Municipio/Localidad/Dependencia/Estatus.
- CursoDetailContent: 2 KpiCard (Fecha/Municipio), mismas secciones, filas
  Municipio/"Fecha del curso"; título verbatim (sin Title Case).
- Estilos hoisted; memo donde el plan lo indique; claves estables.
- DIP: presentation NO importa @/features/*/infrastructure ni @/shared/infrastructure.
- NO crees navegación, providers, pantallas fuera de presentation, app-shell,
  home, search (eso es TASK-05). NO toques domain/application/infrastructure,
  eslint.config.js, nativos, package.json/lock, app.json, app.config.js,
  global.css ni tokens.ts.

ARNÉS OBLIGATORIO:
- npx tsc --noEmit → exit 0.
- npx eslint . → exit 0.
- Greps (evidencia para history): react-native-maps solo en DetailMapCard.tsx;
  expo-image solo en EvidenceCarousel.tsx/EvidenceViewerModal.tsx; @shopify/flash-list
  solo en EvidenceCarousel.tsx; cero FlatList/estimatedItemSize/any/TouchableOpacity/
  className en detail/presentation; cero search-accent/auth-* en detail/**;
  cero infrastructure/@/shared/infrastructure/axios en detail/presentation.
- Gate de deps: git diff -- package.json app.json app.config.js → VACÍO.
  PROHIBIDO npx expo install / npm i / cualquier instalación.
- Si tsc/eslint fallan por algo ajeno a esta TASK, NO arregles nada fuera de
  allowed_files: repórtalo como hallazgo en history.md y detente.

CIERRE:
- Marca TASK-04 como - [x] / Status: READY_FOR_REVIEW en
  spec/features/detail-obra-curso/task.md (NO COMPLETED — el cierre es del Humano;
  deja TASK-05 en TODO).
- Actualiza progress/current-task.json (active_task: TASK-04 READY_FOR_REVIEW,
  harness_status.typecheck_passed: true y nota fase_4_task_04_run con archivos,
  arnés, greps y gate de deps).
- Añade la entrada de TASK-04 en progress/history.md (alcance, archivos, arnés,
  greps, gate de deps, PARADA CONTROLADA).
- NO inicies TASK-05.

REGLAS ESTRICTAS:
- allowed_files: src/features/detail/presentation/** (excepto DetailProvider.tsx y
  useDetail.ts, ya creados), src/app/navigation/types.ts,
  spec/features/detail-obra-curso/task.md, progress/current-task.json,
  progress/history.md. NINGÚN otro archivo.
- CERO domain/application, components fuera de detail/presentation,
  src/app/navigation/RootNavigator.tsx, eslint.config.js, nativos,
  package.json/lock, app.json, app.config.js, global.css, tokens.ts.
- CERO npx expo start / prebuild / run:* (reservado al Humano). CERO commit.
- CERO vibe coding: todo verbatim del plan §8.

PARADA CONTROLADA (gate Humano): al terminar, TASK-04 queda READY_FOR_REVIEW.
Informa al Humano qué validar: los 10 archivos nuevos + el edit de
navigation/types.ts, firmas/copy/orden de secciones verbatim, RootNavigator
intacto, la pantalla aún NO visible, tsc/eslint en verde, greps de UI/deps y
git diff de configs VACÍO. El Humano da el cierre COMPLETED. TASK-05 NO se
inicia en esa sesión.

## Prompt para la nueva sesión del Worker (TASK-05):

MODO: TRABAJADOR (Execution Agent). Ejecutas EXACTAMENTE UNA TASK: TASK-05 de la
feature detail-obra-curso (Fase 4). Código quirúrgico en React Native. SOLO tocas
los archivos listados en allowed_files. El Orquestador ya escribió la SDD; tú NO
planificas, NO improvisas y NO lees imágenes.

Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN + TS strict
+ NativeWind v5 + React Navigation + Clean Architecture por features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés).
2. progress/current-task.json (estado vivo: active_task = TASK-05 TODO desbloqueada).
3. progress/history.md — SOLO las últimas entradas 2026-10-20 (TASK-03 RUN/APROBADA,
   TASK-04 RUN/APROBADA y cierre). Están al final del archivo (usa offset).
4. spec/features/detail-obra-curso/task.md — SOLO TASK-05 (incluye allowed_files).
5. spec/features/detail-obra-curso/plan.md — SOLO §9 completo (§9.1–§9.9). VERBATIM.
6. Referencias de patrón (solo lectura): src/features/app-shell/presentation/AppShell.tsx,
   AppHeader.tsx y AppDrawer.tsx; src/features/home/presentation/HomeScreen.tsx y
   MunicipioCallout.tsx; src/features/search/presentation/SearchScreen.tsx y
   SearchResultCard.tsx; src/features/detail/presentation/DetailScreen.tsx (creado en
   TASK-04); src/app/navigation/RootNavigator.tsx y types.ts; src/features/detail/
   presentation/DetailProvider.tsx y useDetail.ts; src/shared/theme/tokens.ts.

CONTEXTO MÍNIMO (ya validado, no re-verifiques):
- Fase 4 = detalle de Obra/Capacitación; spec.md APROBADA (2026-10-20).
- TASK-01 COMPLETED: tokens --color-detail-* + detailPalette. NO los toques.
- TASK-02 COMPLETED: domain/application de detail. NO los toques.
- TASK-03 COMPLETED: infrastructure + compositionRoot + DetailProvider/useDetail
  (DetailProvider YA envuelve RootNavigator en App.tsx). NO los toques.
- TASK-04 COMPLETED: 10 archivos de presentation + `Detail: { tipo: "OBRA" | "CURSO";
  id: number }` en navigation/types.ts. La pantalla existe pero AÚN NO está montada.
- TASK-05 = wire real: header dinámico + navegación Search→Detail + montar la ruta.
  CERO dependencias nuevas; NO se instala nada. NO prebuild ni compilación ni
  `npx expo start` (eso es Humano). CERO commit (los cambios de TASK-04 siguen en el
  working tree sin commitear: NO los revviertas ni los commitees).

TU TRABAJO EN ESTA SESIÓN — TASK-05 (verbatim plan §9):
Crear EXACTAMENTE 2 archivos nuevos:
1. src/features/app-shell/presentation/HeaderTitleProvider.tsx   (§9.1)
2. src/features/app-shell/presentation/useHeaderTitle.ts          (§9.2)

Editar EXACTAMENTE 8 archivos:
3. src/features/app-shell/presentation/AppHeader.tsx      (§9.3)
4. src/features/app-shell/presentation/AppShell.tsx       (§9.4)
5. src/features/home/presentation/HomeScreen.tsx          (§9.5: set "INICIO")
6. src/features/home/presentation/MunicipioCallout.tsx    (§9.8)
7. src/features/search/presentation/SearchScreen.tsx      (§9.5 "BÚSQUEDA" + §9.6)
8. src/features/search/presentation/SearchResultCard.tsx  (§9.7)
9. src/features/detail/presentation/DetailScreen.tsx      (§9.5: set "DETALLE")
10. src/app/navigation/RootNavigator.tsx                  (§9.9)

Puntos obligatorios:
- HeaderTitleProvider: copia VERBATIM §9.1 (HEADER_TITLE_DEFAULT = "INICIO",
  context, useCallback/useMemo, exports HeaderTitleContext y HeaderTitleContextValue).
- useHeaderTitle: VERBATIM §9.2 (useContext + throw "useHeaderTitle debe usarse dentro
  de HeaderTitleProvider").
- AppHeader: añade `const { title } = useHeaderTitle();` y reemplaza el literal INICIO
  del <Text> por `{title}`. CERO otro cambio (mismo estilo, hamburguesa, pointerEvents).
- AppShell: envuelve con <HeaderTitleProvider> el contenido (AppHeader + AppBrandBar +
  children + AppDrawer) dentro del View raíz. CERO otro cambio.
- Setters §9.5 en HomeScreen/SearchScreen/DetailScreen con useFocusEffect de
  @react-navigation/native + useCallback([setTitle]); literal local por archivo:
  "INICIO" / "BÚSQUEDA" / "DETALLE" (cero imports entre features; HEADER_TITLE_DEFAULT
  solo lo usa el provider).
- SearchScreen: añade el setter y ELIMINA el <Text> con BÚSQUEDA de la fila 1
  (conserva el Pressable del back arrow y la fila con su padding). Cero otro cambio.
- SearchResultCard: elimina `const handleCardPress = (): void => {};`; dentro de
  SearchResultCardBase usa `useNavigation<NativeStackNavigationProp<AppStackParamList>>()`
  y `const handlePress = useCallback(() => { navigation.navigate("Detail", { tipo:
  card.tipo, id: card.id }); }, [navigation, card.tipo, card.id]);` → `onPress={handlePress}`.
  accessibilityLabel pasa a "Ver detalle". Cero otro cambio visual (mismo memo/estilos).
- MunicipioCallout: añade a nivel de módulo `const SHOW_SEE_MORE = false;` con el
  comentario «Fase 4: oculto por decisión del Humano 2026-10-20; su flujo = Fase 5
  Detalle Municipal»; envuelve el <View style={footerStyle}> del botón «Ver más» en
  ternario estricto `{SHOW_SEE_MORE ? (<View style={footerStyle}>…</View>) : null}`.
  Código del botón INTACTO (no se elimina); footerStyle/seeMoreStyle/seeMoreTextStyle
  permanecen referenciados dentro del branch.
- DetailScreen: SOLO añade el setter "DETALLE" al foco. Cero otro cambio.
- RootNavigator: import { DetailScreen } y <AppStack.Screen name="Detail"
  component={DetailScreen} /> tras Search. AppShell/NavigationContainer key={status}/
  AuthStackNavigator INTACTOS.
- Cero any, cero TouchableOpacity, cero FlatList, cero estimatedItemSize, cero
  className, cero imports entre features, cero barrels. Estilos/orden de imports
  siguiendo el estilo existente.

allowed_files: src/features/app-shell/presentation/HeaderTitleProvider.tsx,
src/features/app-shell/presentation/useHeaderTitle.ts,
src/features/app-shell/presentation/AppHeader.tsx,
src/features/app-shell/presentation/AppShell.tsx,
src/features/home/presentation/HomeScreen.tsx,
src/features/home/presentation/MunicipioCallout.tsx,
src/features/search/presentation/SearchScreen.tsx,
src/features/search/presentation/SearchResultCard.tsx,
src/features/detail/presentation/DetailScreen.tsx,
src/app/navigation/RootNavigator.tsx,
spec/features/detail-obra-curso/task.md, progress/current-task.json, progress/history.md.
NINGÚN otro archivo.

CERO: domain/application/infrastructure, DetailProvider/useDetail, App.tsx,
compositionRoot.ts, tokens.ts, global.css, eslint.config.js, app.json,
app.config.js, package.json/lock, nativos. CERO npx expo install / npm i /
npx expo start / prebuild / run:* / commit.

ARNÉS OBLIGATORIO:
- npx tsc --noEmit → exit 0.
- npx eslint . → exit 0 (cero warnings).
- git diff --stat -- src/features/app-shell src/features/home src/features/search →
  SOLO los archivos de TASK-05 listados (HeaderTitleProvider, useHeaderTitle,
  AppHeader, AppShell, HomeScreen, MunicipioCallout, SearchScreen, SearchResultCard);
  ningún otro cambio en features congeladas.
- git diff --stat -- src/app/navigation → SOLO RootNavigator.tsx (y types.ts de TASK-04
  ya existente, sin tocarlo).
- Gate de deps: git diff -- package.json app.json app.config.js → VACÍO.
- Greps: cero any/TouchableOpacity/FlatList/estimatedItemSize/expo-router/className en
  los archivos editados; cero imports entre features; `DetailScreen` importado solo en
  RootNavigator.tsx.
- Si tsc/eslint fallan por algo ajeno a esta TASK, NO arregles nada fuera de
  allowed_files: repórtalo como hallazgo en history.md y detente.

CIERRE:
- Marca TASK-05 como - [x] / Status: READY_FOR_REVIEW en
  spec/features/detail-obra-curso/task.md (NO COMPLETED — el cierre y el checklist
  visual CA-01…09 en Android + iOS son del Humano; deja TASK-06 en TODO).
- Actualiza progress/current-task.json (active_task: TASK-05 READY_FOR_REVIEW,
  harness_status.typecheck_passed: true y nota fase_4_task_05_run con archivos, arnés,
  diff acotado, greps y gate de deps).
- Añade la entrada de TASK-05 en progress/history.md (alcance, archivos, arnés, diff de
  features congeladas, gate de deps, PARADA CONTROLADA).
- NO inicies TASK-06.

PARADA CONTROLADA (gate Humano): al terminar, TASK-05 queda READY_FOR_REVIEW. Informa
al Humano qué validar: los 2 archivos nuevos + 8 edits, HeaderTitleProvider verbatim,
título dinámico INICIO/BÚSQUEDA/DETALLE, navegación Search→Detail por tipo, «Ver más»
oculto, RootNavigator con Detail montado, features congeladas sin cambios extra,
tsc/eslint en verde y git diff de configs VACÍO. El Humano ejecuta el checklist visual
CA-01…09 en Android + iOS (con el binario/dev client existente basta `npx expo start`
+ reload; NO se requiere prebuild: cerá deps ni config nativa) y da el cierre COMPLETED.
TASK-06 NO se inicia en esa sesión.

## Prompt para la nueva sesión (TASK-06):

MODO: TRABAJADOR + REVISOR (Arnés). Ejecutas EXACTAMENTE UNA TASK: TASK-06
de la feature detail-obra-curso (Fase 4). Es una auditoría/arnés de solo
lectura de código: NO escribes código de producto, NO instalas nada, NO
compilas, NO haces commit y NO abres Fase 5.

Proyecto: Cimientos del Renacimiento — Gabinete Móvil (Expo SDK 57 + RN +
TS strict + NativeWind v5 + React Navigation + Clean Architecture por
features).
Raíz: /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE

LEE EN ESTE ORDEN (obligatorio, nada más al inicio):
1. AGENTS.md (roles, leyes absolutas, arnés).
2. progress/current-task.json (estado vivo: TASK-05 COMPLETED, TASK-06
   TODO desbloqueada).
3. progress/history.md — SOLO las últimas entradas 2026-10-20 (TASK-01…
   TASK-05 y cierres). Están al final (usa offset).
4. spec/features/detail-obra-curso/task.md — SOLO TASK-06.
5. spec/features/detail-obra-curso/plan.md — §10, §11 y §12.
6. spec/features/detail-obra-curso/spec.md — §4.7 (contratos verbatim) y
   §4.8 (artefactos), solo como referencia.
7. Referencias de código (solo lectura): src/features/detail/** completo
   (domain, application, infrastructure, presentation), src/app/
   compositionRoot.ts, App.tsx, src/app/navigation/RootNavigator.tsx y
   types.ts, src/shared/theme/tokens.ts, global.css, eslint.config.js,
   src/features/app-shell/**, src/features/home/**, src/features/search/**.

CONTEXTO YA VALIDADO (no re-planifiques):
- Fase 4 = detalle de Obra/Capacitación. spec.md APROBADA (2026-10-20).
- TASK-01…05 COMPLETED (2026-10-20). TASK-05 validada visualmente por el
  Humano (CA-01…09 en Android + iOS).
- Baseline pre-Fase-4 = commit 2dd697c (el inmediatamente anterior a
  TASK-01). Verifícalo con `git log --oneline -8` antes de usarlo.
- Los cambios de TASK-05 pueden estar commiteados o en el working tree:
  usa `git status --porcelain -uall` y `git diff 2dd697c -- …` (recuerda
  que `git diff` no muestra archivos untracked; para esos usa git status).

TU TRABAJO EN ESTA SESIÓN — TASK-06 (verbatim de task.md):
1. Arnés:
   - `npx tsc --noEmit` → exit 0.
   - `npx eslint .` → exit 0, CERO warnings.
2. Bans (`git grep -nE` sobre `src/**/*.ts`, `src/**/*.tsx` y `App.tsx`):
   - `any` (ojo: `@typescript-eslint/no-explicit-any` ya lo cubre), 
     `TouchableOpacity`, `FlatList`, `expo-router`, `estimatedItemSize`.
   - `className` en features (solo coincidencias preexistentes en auth y
     shared/ui son aceptadas; cero en detail/search/home/app-shell).
   - `auth-*` fuera de auth: ACEPTADO preexistente 1.5b en
     src/shared/ui/* y tokens.ts (falso positivo del arnés); cero en
     detail/**/search/**/home/**.
   - `searchPalette.accent` fuera de tokens.ts → 0.
   - `detailPalette` solo en `src/features/detail/**` + tokens.ts → 0
     fuera.
3. DIP:
   - Único importador de `detail/infrastructure` = src/app/
     compositionRoot.ts (grep global; incluye imports relativos).
   - `react-native-maps`/`@shopify/*`/`expo-image` ausentes de
     detail/domain y detail/application.
   - `react-native-maps` solo en `DetailMapCard.tsx`.
   - `expo-image` solo en `EvidenceCarousel.tsx` y
     `EvidenceViewerModal.tsx`.
   - `@shopify/flash-list` solo en `EvidenceCarousel.tsx`.
4. Deps/config:
   - `git diff 2dd697c -- package.json app.json app.config.js` → VACÍO
     (Fase 4 = cero deps).
   - `git diff 2dd697c -- eslint.config.js` → VACÍO.
5. Contratos:
   - `/api/v1/app-mobile/obra` aparece una sola vez en código:
     AxiosObraDetailApi.ts.
   - `/api/v1/app-mobile/curso` una sola vez: AxiosCursoDetailApi.ts.
   - `infrastructure/dto.ts` espejo de spec §4.7 (`galeryUrls` sic
     opcional, `coverImageUrl` documentado e ignorado).
   - `coverImageUrl` NO aparece en entidades de dominio.
6. Features congeladas:
   - `git diff --stat 2dd697c -- src/features/app-shell src/features/home
     src/features/search` → SOLO los archivos de TASK-05
     (AppHeader.tsx, AppShell.tsx, HomeScreen.tsx, MunicipioCallout.tsx,
     SearchScreen.tsx, SearchResultCard.tsx + los nuevos
     HeaderTitleProvider.tsx y useHeaderTitle.ts).
   - Cualquier otro cambio en esas features = hallazgo bloqueante.

REGLAS:
- allowed_files SOLO: spec/features/detail-obra-curso/task.md,
  progress/current-task.json, progress/history.md.
- NO toques código, domain/application/infrastructure, DetailProvider/
  useDetail, App.tsx, compositionRoot.ts, tokens.ts, global.css,
  eslint.config.js, app.json, app.config.js, package.json/lock ni nativos.
- CERO: npx expo install, npm i, npx expo start, prebuild, run:*,
  commit.
- Si tsc/eslint fallan por algo ajeno o aparece un hallazgo: NO arregles
  fuera de allowed_files; repórtalo en history.md, deja el estado
  READY_FOR_REVIEW con el bloqueo documentado y DETENTE. Solo si el
  Humano autoriza expresamente, corrige en archivos de TASK-01…05.

CIERRE:
- Marca los pasos de TASK-06 como `- [x]` y `Status: READY_FOR_REVIEW`
  en task.md (NO COMPLETED: el cierre formal es del Humano).
- Actualiza progress/current-task.json: active_task TASK-06
  READY_FOR_REVIEW, harness_status.typecheck_passed/linter_passed,
  nota `fase_4_task_06_run` con evidencia (comandos, greps, DIP, deps,
  contratos, diff de features congeladas) y last_run.
- Añade la entrada de TASK-06 en progress/history.md (alcance, evidencia,
  hallazgos, PARADA CONTROLADA).
- NO inicies Fase 5 ni ninguna otra TASK. Detente en el gate Humano.