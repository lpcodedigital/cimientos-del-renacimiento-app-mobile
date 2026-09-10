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

## Instrucciones worker DeepSeel V4 flash task01

Rol: Agente Trabajador. Proyecto: Cimientos del Renacimiento — Gabinete Móvil. Feature: core-arch-refactor (Fase 1.5b).
MODO: EJECUCIÓN. Solo TASK-01. Cero TASK-02+. Cero UI. Cero moves. Cero dependencias. Cero npx expo start. Cero npm i / npx expo install. Cero nativo (app.json, .swift, .kt, .pbxproj).
ANTES DE ESCRIBIR:
1. Lee /AGENTS.md
2. Lee /spec/constitution/tech-stack.md §5
3. Lee /spec/features/core-arch-refactor/spec.md
4. Lee /spec/features/core-arch-refactor/plan.md §4 completo (firmas verbatim)
5. Lee /spec/features/core-arch-refactor/task.md TASK-01
6. Lee /progress/current-task.json
OBJETIVO TASK-01: crear el kernel de dominio auth. Nadie lo consume aún. No toques pantallas, Provider, api, tokenStore, biometricService, App.tsx ni infra.
Crea EXACTAMENTE estos 8 archivos, firmas verbatim de plan.md §4:
- src/features/auth/domain/entities/User.ts
- src/features/auth/domain/entities/Session.ts
- src/features/auth/domain/errors/AuthError.ts
- src/features/auth/domain/sessionLifecycle.ts
- src/features/auth/domain/ports/SessionRepository.ts
- src/features/auth/domain/ports/BiometricGateway.ts
- src/features/auth/domain/ports/AuthApi.ts
- src/features/auth/domain/ports/AuthTokenHolder.ts
REGLAS:
- SOLO allowed_files de TASK-01 (+ progress/current-task.json, progress/history.md).
- Domain: cero imports de react, react-native, expo-*, axios, application, infrastructure, presentation, @/shared, @/app.
- Cero any. Cero clases de use case. Cero barrels index.ts. Cero comentarios salvo que el plan los exija (no los exige).
- No “mejores” el dominio. No inventes puertos extra.
CIERRE:
1. npx tsc --noEmit debe pasar.
2. No Marca checkboxes TASK-01 en task.md y Status TASK-01: COMPLETED hasta que el humano de por completada la TASK actual.
3. No actulizar el progress/current-task.json: TASK-01 COMPLETED; active_task siguiente = TASK-02 con status TODO (no IN_PROGRESS) hasta que el humano de por completada la TASK actual.
4. No añadas entrada breve en progress/history.md hasta que el humano de por completada la TASK actual..
5. DETENTE. No inicies TASK-02. No pases el batón. Reporta archivos creados + resultado de tsc.

## Prompt correcto para iniciar TASK-02 en una nueva sesión:

Rol: Agente Trabajador. Proyecto: Cimientos del Renacimiento — Gabinete Móvil. Feature: core-arch-refactor (Fase 1.5b).
MODO: EJECUCIÓN. Solo TASK-02. Cero TASK-03+. Cero UI. Cero moves. Cero dependencias. Cero npx expo start. Cero npm i / npx expo install. Cero nativo (app.json, .swift, .kt, .pbxproj).

ANTES DE ESCRIBIR:
1. Lee /AGENTS.md
2. Lee /spec/constitution/tech-stack.md §5
3. Lee /spec/features/core-arch-refactor/spec.md
4. Lee /spec/features/core-arch-refactor/plan.md §5 completo (firmas y tabla §5.2 verbatim)
5. Lee /spec/features/core-arch-refactor/task.md TASK-02
6. Lee /progress/current-task.json

OBJETIVO TASK-02: crear la capa application (aún sin consumidores). No toques pantallas, Provider, api, tokenStore, biometricService, App.tsx ni infra.
Crea EXACTAMENTE estos 8 archivos, firmas verbatim de plan.md §5:
- src/features/auth/application/types.ts (SessionSnapshot, EMPTY_UNAUTHENTICATED, AuthUseCases)
- src/features/auth/application/bootstrapSession.ts → createBootstrapSession
- src/features/auth/application/signIn.ts → createSignIn
- src/features/auth/application/unlockWithBiometrics.ts → createUnlockWithBiometrics
- src/features/auth/application/enableBiometric.ts → createEnableBiometric
- src/features/auth/application/declineBiometricOptIn.ts → createDeclineBiometricOptIn
- src/features/auth/application/signOut.ts → createSignOut
- src/features/auth/application/listBiometricMethods.ts → createListBiometricMethods

REGLAS:
- SOLO allowed_files de TASK-02 (+ progress/current-task.json, progress/history.md).
- Application: imports SOLO de ../domain/... (cero react, react-native, expo-*, axios, infrastructure, presentation, @/shared, @/app).
- Use cases = factories (closures), NO clases. Cero any. Cero barrels index.ts. Cero comentarios salvo que el plan los exija.
- Respeta la tabla §5.2 al pie de la letra: signIn NO setea canUseBiometricLogin:true (siempre false); unlockWithBiometrics throws new Error(reason) con los 3 mensajes exactos y NO throw si la sesión está ausente/expirada; decline/enable reexponen token/user/expiresAt vigentes; signOut = setToken(null) + Promise.allSettled([clear(), setBiometricEnabled(false)]) + EMPTY_UNAUTHENTICATED.
- No "mejores" el dominio. No inventes puertos ni factories extra.

CIERRE:
1. npx tsc --noEmit debe pasar.
2. No marques checkboxes TASK-02 ni Status COMPLETED hasta que el humano la dé por completada.
3. No actualices current-task.json a TASK-02 COMPLETED ni avances el puntero a TASK-03 hasta aprobación humana.
4. No añadas entrada en history.md hasta aprobación humana.
5. DETENTE. No inicies TASK-03. Reporta: (1) archivos creados / archivos modificados (2) salida del tsc, (3) qué debo validar yo como Humano

## Prompt correcto para TASK-03 (nueva sesión)

Rol: Agente Trabajador. Proyecto: Cimientos del Renacimiento — Gabinete Móvil.
Feature: core-arch-refactor (Fase 1.5b).
MODO: EJECUCIÓN. Solo TASK-03. Cero TASK-04+. Cero UI nueva. Cero movimientos de
presentation. Cero dependencias. Cero npx expo start. Cero npm i / npx expo install.
Cero nativo (app.json, Info.plist, .swift, .kt, .pbxproj).

CONTEXTO: TASK-02 (application use cases) ya fue EJECUTADA por el Trabajador y ha
sido aprobada por el humana (COMPLETED). Antes
de iniciar TASK-03. Verifica en progress/current-task.json y progress/history.md.

ANTES DE ESCRIBIR:
1. Lee /AGENTS.md
2. Lee /spec/constitution/tech-stack.md §5 (arquitectura de capas)
3. Lee /spec/features/core-arch-refactor/spec.md
4. Lee /spec/features/core-arch-refactor/plan.md §2 (árbol), §3 (mapping origen→destino),
   §6 (infrastructure, firmas verbatim) y §8 (orden anti-rompimiento)
5. Lee /spec/features/core-arch-refactor/task.md TASK-03 (pasos y allowed_files)
6. Lee /progress/current-task.json y /progress/history.md

OBJETIVO TASK-03: crear los adapters canónicos que implementan los puertos del domain,
y convertir los paths 1.5a de auth/http en SHIMS de reexport sin lógica, para que la app
1.5a siga compilando hasta TASK-04/06. No toques pantallas, Provider, ni compositionRoot.
Crea EXACTAMENTE estos archivos (firmas/factories verbatim de plan.md §6):
- src/features/auth/infrastructure/dto.ts (verbatim de src/features/auth/dto.ts)
- src/features/auth/infrastructure/AxiosAuthApi.ts → createAxiosAuthApi
- src/features/auth/infrastructure/SecureStoreSessionRepository.ts → createSecureStoreSessionRepository
- src/features/auth/infrastructure/ExpoBiometricGateway.ts → createExpoBiometricGateway
- src/features/auth/infrastructure/AxiosAuthTokenHolder.ts → createAxiosAuthTokenHolder
- src/shared/infrastructure/http/axiosClient.ts (contenido actual de src/lib/http/axiosClient.ts)
Y convierte en shims de reexport SIN lógica:
- src/features/auth/dto.ts
- src/features/auth/api.ts (loginRequest debe seguir exportándose)
- src/features/auth/tokenStore.ts (mismos nombres: saveSession, loadSession, clearSession,
  setBiometricEnabled, getBiometricEnabled, tipo PersistedSession)
- src/features/auth/biometricService.ts (mismos nombres: getBiometricAvailability,
  authenticateWithResult, confirmBiometricOptIn, getSupportedBiometricMethods, tipos)
- src/lib/http/axiosClient.ts → reexport de @/shared/infrastructure/http/axiosClient

REGLAS:
- SOLO allowed_files de TASK-03 (+ progress/current-task.json, progress/history.md).
- Adapters = factories (closures), no clases. Cero any. Cero barrels index.ts. Cero comentarios
  salvo que el plan los exija.
- NO cambies semántica: demo login (demo@cdr.mx / demo1234), mapeo de errores 400/401/403/
  5xx/MFA/inactive, claves SecureStore (jwt, expires_at, user_snapshot, biometric_enabled),
  opciones { keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY }, prompts biométricos iOS/
  Android y branches Platform.OS = intactos.
- clear() NO borra biometric_enabled. No "mejores" el dominio ni inventes puertos/factories.
- Infrastructure implementa los puertos de domain; no importa application/presentation.

CIERRE:
1. npx tsc --noEmit debe pasar (exit 0). La app 1.5a debe seguir compilando contra los shims.
2. No marques checkboxes TASK-03 ni Status COMPLETED hasta que el humano la dé por completada.
3. No actualices current-task.json a TASK-03 COMPLETED ni avances el puntero a TASK-04.
4. No añadas entrada en history.md hasta aprobación humana (sí actualiza current-task.json
   a READY_FOR_HUMAN_REVIEW y registra la ejecución, sin COMPLETED).
5. DETENTE. No inicies TASK-04. Reporta: (1) archivos creados / modificados
   (2) salida del tsc, (3) qué debo validar yo como Humano.

## Prompt para iniciar TASK-04 en nueva sesión (worker)
Rol: Agente Trabajador. Proyecto: Cimientos del Renacimiento — Gabinete Móvil.
Feature: core-arch-refactor (Fase 1.5b).
MODO: EJECUCIÓN. Solo TASK-04. Cero TASK-05+. Cero dependencias. Cero código nativo
(app.json, Info.plist, .swift, .kt, .pbxproj). Cero npx expo start. Cero npm i /
npx expo install.

CONTEXTO: TASK-03 (infrastructure adapters + shims 1.5a) ya fue EJECUTADA y aprobada
por el humano (COMPLETED, build Android/iOS OK, login funcional). Antes de iniciar
TASK-04, verifica en progress/current-task.json y progress/history.md.

ANTES DE ESCRIBIR:
1. Lee /AGENTS.md
2. Lee /spec/constitution/tech-stack.md §5 (arquitectura de capas, DIP)
3. Lee /spec/features/core-arch-refactor/spec.md (§2 decisiones, §3 invariantes, §5 límites)
4. Lee /spec/features/core-arch-refactor/plan.md §7 (composition root, AuthProvider,
   useAuth, pantallas, navegación) y §5 (AuthUseCases / SessionSnapshot)
5. Lee /spec/features/core-arch-refactor/task.md TASK-04 (pasos y allowed_files)
6. Lee /progress/current-task.json y /progress/history.md
7. Inspecciona: src/features/auth/application/*, src/features/auth/domain/*,
   src/features/auth/infrastructure/*, src/features/auth/AuthProvider.tsx,
   src/features/auth/useAuth.ts, src/screens/auth/BiometricOptInScreen.tsx, App.tsx

OBJETIVO TASK-04: cablear DIP con composition root. Crear/editar EXACTAMENTE:
- src/app/compositionRoot.ts → createAuthUseCases() según plan §7.1 (ÚNICO importador
  de infrastructure)
- src/features/auth/AuthProvider.tsx → recibir `useCases: AuthUseCases` por props;
  aplicar snapshots; CERO imports de api/tokenStore/biometricService/axiosClient;
  conservar nombres públicos (enableBiometricAfterLogin, etc.); unlock re-lanza el
  Error del use case
- src/features/auth/useAuth.ts → misma fachada + listBiometricMethods
- App.tsx → const authUseCases = createAuthUseCases() a nivel módulo;
  <AuthProvider useCases={authUseCases}>; no tocar fonts/Splash/QueryClient/StatusBar/css
- src/screens/auth/BiometricOptInScreen.tsx → quitar import de biometricService; usar
  listBiometricMethods de useAuth; CERO cambios de estilo/JSX de layout

REGLAS:
- SOLO allowed_files de TASK-04 (+ progress/current-task.json, progress/history.md).
- Cero cambio visual/funcional vs 1.5a. Máquina §5.2 de plan.md intacta.
- Conservar NavigationContainer key={status}, header «INICIO», estilos inline de
  AuthScaffold/GoldButton.
- Cero any / TouchableOpacity / FlatList / Expo Router / emojis. Cero barrels index.ts.
- No tocar los shims de TASK-03 (se borran en TASK-06).

CIERRE:
1. npx tsc --noEmit debe pasar (exit 0).
2. No marques TASK-04 COMPLETED ni avances el puntero a TASK-05 hasta aprobación humana.
3. Actualiza progress/current-task.json a TASK-04 READY_FOR_HUMAN_REVIEW (sin COMPLETED)
   y registra la ejecución; no añadas entrada a history.md hasta aprobación humana.
4. DETENTE. No inicies TASK-05. Reporta: (1) archivos creados/modificados,
   (2) salida del tsc, (3) qué debe validar el Humano

## Prompt para la nueva sesión (TASK-05)
Rol: Agente Trabajador. Proyecto: Cimientos del Renacimiento — Gabinete Móvil.
Feature: core-arch-refactor (Fase 1.5b).
MODO: EJECUCIÓN. Solo TASK-05. Cero TASK-06+. Cero dependencias. Cero código nativo
(app.json, Info.plist, .swift, .kt, .pbxproj). Cero npx expo start. Cero npm i /
npx expo install.

CONTEXTO: TASK-04 (composition root + AuthProvider DIP + OptIn) ya fue EJECUTADA y
aprobada por el humano (COMPLETED, build Android/iOS OK, sin pérdida de características).
Antes de iniciar TASK-05, verifica en progress/current-task.json y progress/history.md.

ANTES DE ESCRIBIR:
1. Lee /AGENTS.md
2. Lee /spec/constitution/tech-stack.md §5 (arquitectura de capas, DIP)
3. Lee /spec/features/core-arch-refactor/spec.md (§2 decisiones, §3 invariantes, §5 límites)
4. Lee /spec/features/core-arch-refactor/plan.md §2 (árbol destino), §3 (mapping origen→
   destino), §7.3–§7.4 (pantallas, navegación/shared UI) y §8 (orden de movimiento)
5. Lee /spec/features/core-arch-refactor/task.md TASK-05 (pasos y allowed_files)
6. Lee /progress/current-task.json y /progress/history.md
7. Inspecciona todo el árbol actual: src/features/auth/{AuthProvider.tsx,useAuth.ts},
   src/screens/auth/*, src/screens/app/HomePlaceholderScreen.tsx, src/navigation/*,
   src/components/ui/*, src/theme/tokens.ts, src/assets/images.ts, App.tsx,
   src/app/compositionRoot.ts

OBJETIVO TASK-05: mover presentation/shared/navigation/home al árbol destino. Diff
permitido = SOLO rutas de import y reloc. CERO cambios de JSX, estilos, copy o keys de
navegación.

MOVIMIENTOS (plan §2–§3):
- src/features/auth/AuthProvider.tsx + useAuth.ts → src/features/auth/presentation/
- src/screens/auth/{LoginScreen,BiometricOptInScreen,BiometricUnlockScreen}.tsx →
  src/features/auth/presentation/screens/
- src/screens/app/HomePlaceholderScreen.tsx → src/features/home/presentation/
- src/navigation/{types.ts,RootNavigator.tsx} → src/app/navigation/
- src/components/ui/* → src/shared/ui/
- src/theme/tokens.ts → src/shared/theme/tokens.ts
- src/assets/images.ts → src/shared/assets/images.ts (ajustar relative path del PNG:
  desde src/shared/assets/ hacia ../../../assets/images/escudo-yucatan.png)

REGLAS:
- SOLO allowed_files de TASK-05.
- Actualizar TODOS los imports afectados (App.tsx, compositionRoot si aplica,
  RootNavigator, pantallas, shims). App.tsx debe apuntar ya a presentation/.
- Dejar shims 1.5a de TASK-03 en su sitio (se borran en TASK-06). Si un path viejo de
  presentation queda, convertirlo en reexport mínimo o eliminarlo solo si ningún import
  lo apunta.
- Conservar NavigationContainer key={status}, header «INICIO», AuthScaffold/GoldButton
  con estilos inline. Máquina §5.2 intacta.
- Cero cambio visual/funcional vs TASK-04. Cero any / TouchableOpacity / FlatList /
  Expo Router / emojis. Cero barrels index.ts. Cero StyleSheet.create injustificado.
- NO tocar los shims de TASK-03 (api/dto/tokenStore/biometricService/axiosClient viejos).

CIERRE:
1. npx tsc --noEmit debe pasar (exit 0).
2. No marques TASK-05 COMPLETED ni avances el puntero a TASK-06 hasta aprobación humana.
3. Actualiza progress/current-task.json a TASK-05 READY_FOR_HUMAN_REVIEW (sin COMPLETED)
   y registra la ejecución; no añadas entrada a history.md hasta aprobación humana.
4. DETENTE. No inicies TASK-06. Reporta: (1) archivos movidos/creados/modificados,
   (2) salida del tsc, (3) qué debe validar el Humano.