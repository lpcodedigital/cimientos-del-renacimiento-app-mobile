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
