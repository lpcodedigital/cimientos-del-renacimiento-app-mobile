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