# SPEC — core-arch-refactor

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 1.5b — Refactor arquitectónico (Clean Architecture + SOLID)
**Feature:** `core-arch-refactor`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** APROBADO por el Humano (2026-09-10) — listo para redacción de plan/task; **TASK-01 no inicia** hasta autorización explícita en nueva sesión
**Fecha:** 2026-09-10

---

## 1. Propósito

Reorganizar **todo `/src`** a Clean Architecture **por features** (capas `domain` / `application` / `infrastructure` / `presentation`) y aplicar los mínimos SOLID de `tech-stack.md` §5, **sin cambiar un píxel ni un flujo** respecto a la Fase 1.5a (`auth-ui-polish`) aprobada por el Humano el 2026-09-05.

Esta feature **no reabre** Fase 1 ni Fase 1.5a. Toma su UI, su máquina de estados y sus contratos como **baseline congelada**. Fase 2 permanece bloqueada hasta que el Revisor audite y el Tester Visual Humano apruebe 1.5b en dispositivo.

---

## 2. Decisiones del Humano (2026-09-10) — innegociables

1. Árbol **nested por feature**: `src/features/<feature>/{domain,application,infrastructure,presentation}` + `src/shared/{ui,theme,assets}` + `src/shared/infrastructure/http` + `src/app/{compositionRoot,navigation}`.
2. `App.tsx` permanece como **entry Expo** (fuentes, `QueryClientProvider`, `StatusBar`). El wiring vive en `src/app/compositionRoot.ts`. `AuthProvider` vive en **presentation** y recibe los use cases **por props**.
3. Regla DIP: `presentation` → `application` + `domain`; `application` → `domain`; `infrastructure` implementa puertos de `domain`; **solo** `compositionRoot.ts` importa `infrastructure`.
4. DTOs de wire (`AuthRequestDTO`, `AuthResponseDTO`, `AuthBasicUserResponseDTO`) viven en **infrastructure**. Domain posee `User` y `Session` con **los mismos campos**. Mapeo 1:1. Contrato JSON intacto.
5. Use cases = **funciones (closures)**, no clases.
6. Puerto extra **`AuthTokenHolder`** (además de `SessionRepository`, `BiometricGateway`, `AuthApi`) para no filtrar `setAuthToken` a presentation.
7. Séptimo use case **`ListBiometricMethods`**: `BiometricOptInScreen` deja de importar `biometricService`.
8. Placeholder autenticado se mueve a `src/features/home/presentation/` (semilla de Fase 2, sin lógica nueva).
9. Cero dependencias nuevas. Cero código nativo. Cero Expo Router. Cero `any` / `TouchableOpacity` / `FlatList`.

---

## 3. Invariantes congeladas (1.5a)

Fuente de verdad visual y de flujo: `spec/features/auth-ui-polish/spec.md` (APROBADO) y `plan.md` §3 (máquina de estados).

**ESTÁ ESTRICTAMENTE PROHIBIDO alterar:**

| Invariante | Valor congelado |
| --- | --- |
| Paleta auth | tokens `auth-*` de `tech-stack.md` §2.1; paleta clara de Fase 1 solo fuera de auth |
| Tipografía | Lato / Lato-Bold exclusivamente |
| Flujos | Login → (sin HW: Home) / (biometría ya activa: Unlock **manual**) / (Opt-In → ACTIVAR → Unlock **manual** → Home; Ahora no → Home sin revertir login). Arranque en frío con biometría: Unlock **auto** + reintento. Volver en Unlock → `signOut` (limpia sesión) → Login |
| Contrato HTTP | `POST /api/auth/login`; body/response idénticos a `dto.ts` actual |
| Login demo | `demo@cdr.mx` / `demo1234` permanece en el adapter HTTP (no en UI) |
| Claves SecureStore | `jwt`, `expires_at`, `user_snapshot`, `biometric_enabled` |
| Semántica `clearSession` | borra jwt/expires_at/user_snapshot; **no** borra `biometric_enabled` |
| Semántica `signOut` | limpia estado + `clearSession` + `setBiometricEnabled(false)` |
| Raíces de navegación | Auth \| App; `NavigationContainer key={status}`; header nativo App «INICIO» guinda |
| Throws | SignIn lanza objeto `{ kind, message }` (`AuthError`); Unlock lanza `new Error(reason)` con los mismos tres mensajes institucionales |
| `canUseBiometricLogin` | se calcula en bootstrap y se pone `false` en signOut/sesión inválida; **no** se setea en `signIn` (no “arreglar”) |
| Estilos 1.5a | AuthScaffold/GoldButton/OptIn/Unlock en **inline JS** donde ya lo están; no reescribir a `className` (iOS NativeWind v5) |
| Assets / plugins | `assets/images/escudo-yucatan.png`, `app.json`, fuentes Lato, `expo-linear-gradient`, `@expo/vector-icons` |

---

## 4. Criterios de Aceptación (CA)

Los CA visuales y de flujo de 1.5a **siguen vigentes** como regresión. Esta feature no añade pixel-diff nuevo; exige igualdad contra 1.5a.

- [ ] **CA-01 (Regresión visual Login):** `LoginScreen` empata 1.5a / `login-form.png` (desviaciones solo las ya aprobadas en 1.5a §6).
- [ ] **CA-02 (Regresión visual Opt-In):** `BiometricOptInScreen` empata 1.5a / `biometric-opt-in-request.png`.
- [ ] **CA-03 (Regresión visual Unlock):** `BiometricUnlockScreen` empata 1.5a / `biometric-login.png` (auto vs manual solo difieren en el auto-prompt nativo).
- [ ] **CA-04 (Flujo sin hardware):** login exitoso sin biometría → Home directo. *(idéntico a 1.5a CA-04)*
- [ ] **CA-05 (Flujo opt-in):** login con biometría disponible → Opt-In → ACTIVAR → primer uso **manual** → Home. *(idéntico a 1.5a CA-05)*
- [ ] **CA-06 (Opt-in rechazado):** «Ahora no» / «Volver» → Home, sesión intacta, `biometric_enabled = "false"`. *(idéntico a 1.5a CA-06)*
- [ ] **CA-07 (Arranque posterior):** JWT vigente + biometría activa → Unlock **auto-prompt**; cancelación → reintento «INICIAR SESIÓN»; «Volver» → Login con sesión limpiada. *(idéntico a 1.5a CA-07)*
- [ ] **CA-08 (Regresión cero credenciales):** login válido, errores 401/red/MFA/inactivo, «Cerrar sesión» idénticos a Fase 1 + 1.5a. *(idéntico a 1.5a CA-08)*
- [ ] **CA-09 (Arnés):** `npx eslint .` y `npx tsc --noEmit` en verde. Cero `any`, `TouchableOpacity`, `FlatList`, imports de `expo-router`.
- [ ] **CA-10 (Capas):** `domain` no importa React/Expo/Axios; `application` no importa infra ni React; `presentation` no importa `infrastructure`; único importador de infra de auth = `src/app/compositionRoot.ts`. Verificado con `no-restricted-imports` (sin paquete nuevo).
- [ ] **CA-11 (Contratos):** diff de forma JSON, path `POST /api/auth/login`, claves SecureStore y opciones `{ keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY }` = idénticos.
- [ ] **CA-12 (Dependencias):** cero entradas nuevas en `package.json`. Cero cambios nativos (`app.json` intacto salvo que el Humano lo autorice; esta feature **no lo toca**).

CA-01…08 los valida **solo el Tester Visual Humano** en dispositivo. Los agentes validan CA-09…12.

---

## 5. Límites (qué NO se toca)

**ESTÁ ESTRICTAMENTE PROHIBIDO:**

- Cambiar copy, colores, espaciado, iconos, gradientes, tamaños de escudo, `Alert` de recuperación, o el header nativo «INICIO».
- “Mejorar” la máquina de estados, unificar throws, setear `canUseBiometricLogin` en `signIn`, o borrar `biometric_enabled` en `clear()`.
- Añadir dependencias, Expo Router, código `.swift`/`.kt`/`.java`/`.pbxproj`, o tocar `app.json` / `Info.plist` / `AndroidManifest.xml`.
- Implementar Fase 2 (GPS, mapa, KPIs). `features/home` solo aloja el placeholder existente.
- Usar `any`, `TouchableOpacity`, `FlatList`, emojis en UI, fuentes distintas de Lato.
- Crear barrels (`index.ts`) que reexporten infrastructure hacia presentation.
- Correr `npx expo start` (reservado al Humano).
- Enmendar `mission.md` o `AGENTS.md`.

`tech-stack.md` §5 ya está en vigor; esta spec la operacionaliza. No se reescribe la constitución.

---

## 6. Dependencias de constitución

- `/spec/constitution/mission.md`
- `/spec/constitution/tech-stack.md` §5 (capas + SOLID) y §2.1 (paleta)
- `/spec/constitution/roadmap.md` — Fase 1.5b
- `/spec/features/auth-ui-polish/spec.md` y `plan.md` (baseline congelada)
- `/AGENTS.md`

Esta spec es la fuente de verdad de producto de 1.5b. El `plan.md` es la fuente de verdad técnica. El `task.md` es la única lista de archivos que el Trabajador puede tocar.
