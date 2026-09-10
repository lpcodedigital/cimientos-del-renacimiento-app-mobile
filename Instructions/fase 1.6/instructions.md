## FASE 1.5b ##

## Instrucciones lead planner GROK 4.6 Fase1.5b (reasoning effort default)
Prompt para pegar en una sesión nueva del Orquestador (Lead Planner). 1.5b aún no tiene spec.md/plan.md/task.md; primero se planifica, no se escribe código.
Rol: Agente Orquestador (Lead Planner & Auditor). Proyecto: Cimientos del Renacimiento — Gabinete Móvil.

MODO: PLANIFICACIÓN SDD. Cero código de producto. Cero `npx expo start`. No instales paquetes. No toques pantallas ni lógica de auth.

CONTEXTO OBLIGATORIO (lee en este orden, sin excepción; evita node_modules, android, ios, build):
1. /AGENTS.md
2. /spec/constitution/mission.md
3. /spec/constitution/tech-stack.md (especialmente §5 Arquitectura de Software — entra en vigor en esta fase)
4. /spec/constitution/roadmap.md (Fase 1.5b — core-arch-refactor)
5. /progress/current-task.json
6. /progress/history.md (cierre de Fase 1.5a)
7. /spec/features/auth-ui-polish/spec.md  (baseline visual y de flujo CONGELADA)
8. /spec/features/auth-ui-polish/plan.md  (máquina de estados y árbol actual)
9. Inventario real de /src (solo archivos de producto: features/auth, screens, components/ui, navigation, lib, theme)

PREMISAS CERRADAS (no reabrir):
- Fase 1 y Fase 1.5a están APROBADAS por el Humano. No las reabras ni reescribas su historia.
- Feature a crear: spec/features/core-arch-refactor/ con spec.md + plan.md + task.md.
- Objetivo: refactor a Clean Architecture por features (capas domain / application / infrastructure / presentation) + SOLID en todo /src.
- INVARIANTE ESTRICTA: cero cambio visual y cero cambio funcional vs 1.5a. Misma paleta, mismos flujos (Login → Opt-In → Unlock manual/auto → Home), mismos contratos POST /api/auth/login, mismos DTOs, mismas claves SecureStore (jwt, expires_at, user_snapshot, biometric_enabled), mismas raíces Auth | App.
- Prohibido añadir dependencias. Prohibido código nativo. Prohibido Expo Router. Prohibido any / TouchableOpacity / FlatList.
- tech-stack.md §5 ya define las capas y DIP; el spec de 1.5b las operacionaliza. No cambies mission.md ni AGENTS.md salvo que detectes un hueco constitucional real y lo propongas (no lo apliques sin preguntarme).
- Fase 2 sigue bloqueada hasta que 1.5b esté auditada y yo la apruebe en dispositivo.

QUÉ DEBES ENTREGAR EN ESTA SESIÓN (Paso 0 de orquestación):
1. Inventario del árbol actual de /src y mapeo propuesto al árbol destino (por archivo: origen → capa destino). No muevas nada todavía.
2. spec/features/core-arch-refactor/spec.md: propósito, invariantes congeladas, CAs de regresión (visual + flujos CA-04…08 de 1.5a intactos + arnés), límites (qué NO se toca).
3. spec/features/core-arch-refactor/plan.md: composition root, puertos (SessionRepository, BiometricGateway, AuthApi), casos de uso (SignIn, UnlockWithBiometrics, EnableBiometric, DeclineBiometricOptIn, SignOut, BootstrapSession), DI manual, orden de movimiento de archivos. Cero “vibe architecture”.
4. spec/features/core-arch-refactor/task.md: tasks atómicas con allowed_files estrictos. Cada task debe poder validarse por separado.
5. Actualiza progress/current-task.json (feature core-arch-refactor, primera task en TODO, NO IN_PROGRESS de código) y añade entrada en progress/history.md.

CONTROL DE FLUJO (INNEGOCIABLE):
- Al terminar el Paso 0, DETENTE. No inicies implementación. No pases el batón al Trabajador.
- No adelantes TASK-02 ni ninguna task de código.
- Al final respóndeme con: (1) árbol destino propuesto, (2) lista de tasks y qué valida cada una, (3) riesgos de regresión visual/funcional, (4) qué debo aprobar yo antes de autorizar al Trabajador a ejecutar TASK-01.

Si hay ambigüedad (p. ej. dónde vive AuthProvider, si presentation puede importar application pero no infrastructure, si App.tsx es el composition root), pregunta ANTES de escribir el spec. No asumas.
Esa sesión solo debe producir SDD + progress. Cuando te entregue el plan, pégalo aquí o autorízalo, y te armo el prompt del Trabajador para TASK-01 (una task, parar hasta que valides).

## Autorizacion  para proceder al plan

"¡Totalmente autorizado!

El plan es excepcional. Me parece brillante la inclusión del AuthTokenHolder para proteger la inyección del token, el uso de funciones (closures) para los casos de uso y la creación temprana de features/home.

Procede a escribir exactamente los 3 archivos SDD (spec.md, plan.md, task.md) en spec/features/core-arch-refactor/ y actualiza la carpeta progress/.

Una vez que termines de escribir, detente y confírmame para que yo pueda abrir la nueva sesión con el Trabajador para la TASK-01."