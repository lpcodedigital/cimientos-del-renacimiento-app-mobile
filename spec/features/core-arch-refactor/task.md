# TASK — core-arch-refactor

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 1.5b — Refactor arquitectónico
**Feature:** `core-arch-refactor`
**Ejecutor:** Agente Trabajador
**Auditor:** Agente Revisor (tras TASK-06)
**Tester visual / biométrico / `expo start`:** Humano — prohibido a agentes
**Fecha:** 2026-09-10

Leer antes de tocar código: `spec.md`, `plan.md`, `/spec/constitution/tech-stack.md` §5, `/AGENTS.md`. Baseline de comportamiento: `spec/features/auth-ui-polish/plan.md` §3.

Reglas absolutas del Trabajador:

- SOLO editar archivos listados en `allowed_files` de la task activa.
- Cero dependencias nuevas. Cero `npx expo install`. Cero `npm i`.
- Cero `.swift`, `.kt`, `.java`, `.pbxproj`, `Info.plist`, `AndroidManifest.xml`, `app.json`.
- Cero Expo Router. Cero `any`. Cero `TouchableOpacity`. Cero `FlatList`. Cero emojis en UI.
- Cero cambio visual o funcional vs 1.5a. Prohibido “arreglar” `canUseBiometricLogin` en signIn, unificar throws, o borrar `biometric_enabled` en `clear()`.
- Use cases = funciones/factories, no clases. Cero barrels `index.ts` entre capas.
- Al terminar cada task: marcar `- [x]`, `npx tsc --noEmit` verde, actualizar `progress/current-task.json` a la **siguiente** task en `TODO` (no dejar IN_PROGRESS al cerrar).
- No correr `npx expo start`. ESLint de fences + repo completo = TASK-06.
- No adelantar TASK-0N+1.

---

## TASK-01 — Domain kernel (auth)

**Status:** COMPLETED
**assigned_role:** Trabajador
**validation:** TypeCheck verde; domain sin imports de framework; Humano autoriza en sesión aparte antes de ejecutar

**Objetivo:** Crear **solo** el kernel de dominio. Nadie lo consume aún. Cero moves. Cero UI.

**Pasos**

- [x] Crear exactamente los archivos del plan §4 (firmas verbatim):
  - `src/features/auth/domain/entities/User.ts`
  - `src/features/auth/domain/entities/Session.ts`
  - `src/features/auth/domain/errors/AuthError.ts`
  - `src/features/auth/domain/sessionLifecycle.ts`
  - `src/features/auth/domain/ports/SessionRepository.ts`
  - `src/features/auth/domain/ports/BiometricGateway.ts`
  - `src/features/auth/domain/ports/AuthApi.ts`
  - `src/features/auth/domain/ports/AuthTokenHolder.ts`
- [x] Verificar que esos archivos no importan `react`, `react-native`, `expo-*`, `axios`, ni paths `@/features/auth/{application,infrastructure,presentation}`.
- [x] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `src/features/auth/domain/entities/User.ts`
- `src/features/auth/domain/entities/Session.ts`
- `src/features/auth/domain/errors/AuthError.ts`
- `src/features/auth/domain/sessionLifecycle.ts`
- `src/features/auth/domain/ports/SessionRepository.ts`
- `src/features/auth/domain/ports/BiometricGateway.ts`
- `src/features/auth/domain/ports/AuthApi.ts`
- `src/features/auth/domain/ports/AuthTokenHolder.ts`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** 8 archivos de domain existen con las firmas del plan §4. TypeCheck verde. Cero archivos 1.5a modificados.

---

## TASK-02 — Application use cases

**Status:** COMPLETED
**assigned_role:** Trabajador

**Objetivo:** Siete factories de use case + `AuthUseCases` / `SessionSnapshot`. Cero React. Cero infra concreta. Cero wiring en App.

**Pasos**

- [x] Crear `src/features/auth/application/types.ts` (`SessionSnapshot`, `EMPTY_UNAUTHENTICATED`, `AuthUseCases`) según plan §5.1.
- [x] Crear las 7 factories según plan §5.2–5.3:
  - `bootstrapSession.ts` → `createBootstrapSession`
  - `signIn.ts` → `createSignIn`
  - `unlockWithBiometrics.ts` → `createUnlockWithBiometrics`
  - `enableBiometric.ts` → `createEnableBiometric`
  - `declineBiometricOptIn.ts` → `createDeclineBiometricOptIn`
  - `signOut.ts` → `createSignOut`
  - `listBiometricMethods.ts` → `createListBiometricMethods`
- [x] `signIn` no setea `canUseBiometricLogin: true`. Unlock throws `new Error` con los 3 mensajes exactos. SignIn deja subir `AuthError`.
- [x] Imports de application: **solo** `../domain/...`. Cero `react` / `expo` / `axios`.
- [x] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `src/features/auth/application/types.ts`
- `src/features/auth/application/bootstrapSession.ts`
- `src/features/auth/application/signIn.ts`
- `src/features/auth/application/unlockWithBiometrics.ts`
- `src/features/auth/application/enableBiometric.ts`
- `src/features/auth/application/declineBiometricOptIn.ts`
- `src/features/auth/application/signOut.ts`
- `src/features/auth/application/listBiometricMethods.ts`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** Use cases compilando, tabla §5.2 implementada, nadie los instancia aún.

---

## TASK-03 — Infrastructure adapters + shims 1.5a

**Status:** COMPLETED
**assigned_role:** Trabajador
**validation:** COMPLETED y APROBADA por el Humano (build Android/iOS sin problemas, login funcional; typecheck verde)

**Objetivo:** Adapters canónicos que implementan los puertos. Paths viejos quedan como reexport para no romper 1.5a hasta TASK-04/06. Cero cambio de comportamiento HTTP/SecureStore/biometría.

**Pasos**

- [x] Mover lógica (no “reescribir semántica”) a:
  - `src/features/auth/infrastructure/dto.ts` (verbatim 1.5a)
  - `src/features/auth/infrastructure/AxiosAuthApi.ts` (`createAxiosAuthApi`)
  - `src/features/auth/infrastructure/SecureStoreSessionRepository.ts` (`createSecureStoreSessionRepository`)
  - `src/features/auth/infrastructure/ExpoBiometricGateway.ts` (`createExpoBiometricGateway`)
  - `src/features/auth/infrastructure/AxiosAuthTokenHolder.ts` (`createAxiosAuthTokenHolder`)
  - `src/shared/infrastructure/http/axiosClient.ts` (contenido actual de `src/lib/http/axiosClient.ts`)
- [x] Convertir los paths 1.5a en shims de reexport **sin lógica**:
  - `src/features/auth/dto.ts`
  - `src/features/auth/api.ts` (`loginRequest` debe seguir exportándose: wrapper fino sobre `createAxiosAuthApi().login` **o** reexport de una función `loginRequest` exportada por `AxiosAuthApi` para no romper `AuthProvider` 1.5a)
  - `src/features/auth/tokenStore.ts` (exportar las mismas funciones: `saveSession`, `loadSession`, `clearSession`, `setBiometricEnabled`, `getBiometricEnabled`, tipo `PersistedSession`)
  - `src/features/auth/biometricService.ts` (mismos nombres de función 1.5a: `getBiometricAvailability`, `authenticateWithResult`, `confirmBiometricOptIn`, `getSupportedBiometricMethods`, tipos)
  - `src/lib/http/axiosClient.ts` → reexport de `@/shared/infrastructure/http/axiosClient`
- [x] Demo login, claves SecureStore, prompts biométricos y opciones `WHEN_UNLOCKED_THIS_DEVICE_ONLY` intactos.
- [x] `npx tsc --noEmit` debe pasar. App 1.5a sigue compilando contra shims.

**allowed_files**

- `src/features/auth/infrastructure/dto.ts`
- `src/features/auth/infrastructure/AxiosAuthApi.ts`
- `src/features/auth/infrastructure/SecureStoreSessionRepository.ts`
- `src/features/auth/infrastructure/ExpoBiometricGateway.ts`
- `src/features/auth/infrastructure/AxiosAuthTokenHolder.ts`
- `src/shared/infrastructure/http/axiosClient.ts`
- `src/features/auth/dto.ts`
- `src/features/auth/api.ts`
- `src/features/auth/tokenStore.ts`
- `src/features/auth/biometricService.ts`
- `src/lib/http/axiosClient.ts`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** Adapters existen; shims mantienen exports 1.5a; TypeCheck verde; cero cambio de UI.

---

## TASK-04 — Composition root + AuthProvider DIP + OptIn

**Status:** COMPLETED
**assigned_role:** Trabajador
**validation:** COMPLETED y APROBADA por el Humano (build Android/iOS sin problemas, sin pérdida de características; typecheck verde)

**Objetivo:** Cablear DIP. Único cambio funcional permitido: OptIn obtiene métodos vía `listBiometricMethods` del contexto (mismo resultado que `getSupportedBiometricMethods`).

**Pasos**

- [x] Crear `src/app/compositionRoot.ts` (`createAuthUseCases`) según plan §7.1.
- [x] Reescribir `src/features/auth/AuthProvider.tsx` para recibir `useCases: AuthUseCases`, aplicar snapshots, **sin** imports de api/tokenStore/biometricService/axiosClient. Conservar nombres públicos (`enableBiometricAfterLogin`, etc.).
- [x] Actualizar `src/features/auth/useAuth.ts`: misma fachada + `listBiometricMethods`.
- [x] `App.tsx`: `const authUseCases = createAuthUseCases()` a nivel módulo; `<AuthProvider useCases={authUseCases}>`. No tocar fonts/Splash/QueryClient/StatusBar/css.
- [x] `BiometricOptInScreen.tsx`: quitar import de `biometricService`; usar `listBiometricMethods` de `useAuth`. Cero cambios de estilo/JSX de layout.
- [x] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `src/app/compositionRoot.ts`
- `src/features/auth/AuthProvider.tsx`
- `src/features/auth/useAuth.ts`
- `App.tsx`
- `src/screens/auth/BiometricOptInScreen.tsx`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** Provider no importa infra. OptIn no importa `biometricService`. Máquina 1.5a intacta. TypeCheck verde.

---

## TASK-05 — Relocate presentation / shared / navigation / home

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** Mover archivos al árbol destino. Diff permitido = **rutas de import y reloc**. Cero cambios de JSX, estilos, copy, keys de navegación.

**Pasos**

- [ ] Mover según plan §2–§3:
  - AuthProvider + useAuth → `src/features/auth/presentation/`
  - screens auth → `src/features/auth/presentation/screens/`
  - HomePlaceholder → `src/features/home/presentation/HomePlaceholderScreen.tsx`
  - navigation → `src/app/navigation/`
  - `src/components/ui/*` → `src/shared/ui/`
  - `src/theme/tokens.ts` → `src/shared/theme/tokens.ts`
  - `src/assets/images.ts` → `src/shared/assets/images.ts` (ajustar relative path del PNG)
- [ ] Actualizar **todos** los imports afectados (`App.tsx`, compositionRoot si aplica, RootNavigator, pantallas).
- [ ] Conservar `NavigationContainer key={status}`, header «INICIO», AuthScaffold/GoldButton inline.
- [ ] Dejar shims 1.5a de TASK-03 en su sitio (se borran en TASK-06). Si un archivo de presentation viejo queda, convertirlo en reexport **o** eliminarlo solo si ningún import 1.5a lo apunta — preferir reexport mínimo para AuthProvider/useAuth viejos si algo aún los usa; `App.tsx` debe apuntar ya a `presentation/`.
- [ ] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `src/features/auth/presentation/AuthProvider.tsx`
- `src/features/auth/presentation/useAuth.ts`
- `src/features/auth/presentation/screens/LoginScreen.tsx`
- `src/features/auth/presentation/screens/BiometricOptInScreen.tsx`
- `src/features/auth/presentation/screens/BiometricUnlockScreen.tsx`
- `src/features/auth/AuthProvider.tsx` (shim o delete si `App` ya no lo importa)
- `src/features/auth/useAuth.ts` (shim o delete)
- `src/features/home/presentation/HomePlaceholderScreen.tsx`
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/BiometricOptInScreen.tsx`
- `src/screens/auth/BiometricUnlockScreen.tsx`
- `src/screens/app/HomePlaceholderScreen.tsx`
- `src/app/navigation/types.ts`
- `src/app/navigation/RootNavigator.tsx`
- `src/navigation/types.ts`
- `src/navigation/RootNavigator.tsx`
- `src/shared/ui/AuthScaffold.tsx`
- `src/shared/ui/GoldButton.tsx`
- `src/shared/ui/BiometricMethodCard.tsx`
- `src/shared/ui/TextField.tsx`
- `src/shared/ui/Button.tsx`
- `src/shared/ui/InstitutionalText.tsx`
- `src/components/ui/AuthScaffold.tsx`
- `src/components/ui/GoldButton.tsx`
- `src/components/ui/BiometricMethodCard.tsx`
- `src/components/ui/TextField.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/InstitutionalText.tsx`
- `src/shared/theme/tokens.ts`
- `src/theme/tokens.ts`
- `src/shared/assets/images.ts`
- `src/assets/images.ts`
- `App.tsx`
- `src/app/compositionRoot.ts`
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** Árbol destino de presentation/shared/nav/home poblado. TypeCheck verde. Diff de pantallas = imports (y el cambio OptIn ya hecho en TASK-04).

---

## TASK-06 — Borrar shims + fences ESLint + arnés

**Status:** TODO
**assigned_role:** Trabajador + Revisor (auditoría de arnés)

**Objetivo:** Eliminar paths 1.5a residuales, imponer DIP por linter, dejar Fase 1.5b lista para el Humano. Cero UI.

**Pasos**

- [ ] Borrar shims y dirs vacíos: `src/features/auth/{api,dto,tokenStore,biometricService,AuthProvider,useAuth}.ts` si aún son shims; `src/lib/http/axiosClient.ts`; `src/screens/**`; `src/components/**`; `src/navigation/**`; `src/theme/**`; `src/assets/**` (el de `src/`, no `assets/` raíz).
- [ ] Confirmar que no queda import a esos paths (`grep`).
- [ ] `eslint.config.js`: tres bloques `no-restricted-imports` del plan §9. Sin paquetes nuevos.
- [ ] `npx tsc --noEmit` → exit 0.
- [ ] `npx eslint .` → exit 0 (cero warnings).
- [ ] Grep bans en `.ts`/`.tsx`: cero `any`, `TouchableOpacity`, `FlatList`, `expo-router`.
- [ ] Grep DIP: cero imports de `infrastructure` desde `domain`/`application`/`presentation` (excepto `compositionRoot.ts`).
- [ ] `package.json` / `app.json` sin cambios de esta feature (verificar diff).
- [ ] NO ejecutar `npx expo start`.

**allowed_files**

- `eslint.config.js`
- shims/archivos listados en el paso de borrado (delete)
- `progress/current-task.json`
- `progress/history.md`
- `spec/features/core-arch-refactor/task.md` (marcar checkboxes)

**Definition of done:** CA-09…12 listos para el Revisor. TASK-06 `READY_FOR_REVIEW`. Fase 2 no abierta.

---

## Orden y handoff

```
TASK-01 (domain)
  → TASK-02 (application)
    → TASK-03 (infra + shims)
      → TASK-04 (composition root + Provider DIP)
        → TASK-05 (move presentation)
          → TASK-06 (delete + fences + arnés)
            → Revisor → Tester Visual Humano (CA-01…08 en dispositivo)
```

El Trabajador ejecuta **una** task por sesión, solo si el Humano la autoriza. Tras TASK-01: parar.