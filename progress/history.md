# Bitácora de Progreso (Gabinete Móvil)

## Fase 1 — Shell Base, Navegación y Login Híbrido

### 2026-08-21 — Orquestación (Lead Planner)

- Constitución leída: `mission.md`, `tech-stack.md`, `roadmap.md`, `AGENTS.md`.
- Hallazgo: la raíz **no** tenía proyecto Expo (no existían `package.json`, `app.json` ni `/src`). El check previo de «Monorepo Expo SDK 51» era incorrecto y se anula.
- Context7 MCP no disponible (API key). APIs consultadas en docs oficiales Expo SDK 57: `expo-local-authentication`, `expo-secure-store`, `expo-font`, NativeWind v4, React Navigation 7 native-stack.
- Decisiones humanas cerradas:
  - Bootstrap Expo en esta raíz (`blank-typescript`, no template `default`).
  - Contrato login: `AuthRequestDTO` / `AuthResponseDTO` / `AuthBasicUserResponseDTO` → `POST /api/auth/login`.
  - Navegación: React Navigation en `/src` (cero Expo Router).
  - Tokens: Guinda `#6B142E`, Dorado `#C4A35A`, Fondo `#F7F4F0`, Texto `#1A1A1A`. Lato Regular/Bold vía `useFonts` + TTF locales.
- Artefactos SDD escritos (cero código RN de producto):
  - `spec/features/auth-biometric/spec.md`
  - `spec/features/auth-biometric/plan.md`
  - `spec/features/auth-biometric/task.md`
- `progress/current-task.json` → `IN_PROGRESS`, TASK-01, `assigned_role: Trabajador`, `allowed_files` de bootstrap (sin `app/_layout.tsx`).

### 2026-08-28 — TASK-01 (Agente Trabajador)

- Bootstrap del proyecto Expo SDK 57 en la raíz: `create-expo-app` `blank-typescript` en `/tmp` y copia de artefactos a la raíz. Sin template `default`, sin Expo Router (cero `app/`).
- `tsconfig.json` estricto (`strict`, `noImplicitAny`) + alias `@/*` → `./src/*`.
- NativeWind v4 + Tailwind 3.4.17: `babel.config.js` (jsxImportSource nativewind + `nativewind/babel`), `metro.config.js` (`withNativeWind` input `./global.css`), `global.css`, `tailwind.config.js` (paleta institucional + `fontFamily` Lato), `nativewind-env.d.ts` (+ `declare module "*.css"` para satisfacer `tsc` en import de side-effect).
- Lato Regular + Bold (SIL OFL) en `assets/fonts/Lato-Regular.ttf` / `Lato-Bold.ttf`. Verificado via `fc-scan`: familia `Lato`, estilos Regular/Bold.
- `src/theme/tokens.ts` con paleta Guinda/Dorado/Fondo/Texto/Texto-suave/Error/Superficie + nombres de familia.
- `App.tsx`: `useFonts` Lato + `SplashScreen.preventAutoHideAsync`/hide + placeholder institucional `bg-fondo` Lato «Gabinete Móvil». Import de `./global.css`.
- `app.json`: name «Gabinete Móvil», slug `cimientos-del-renacimiento`, `web.bundler: metro`. Sin plugins biométricos (TASK-05).
- `npx tsc --noEmit` → pasa. `lint`/`typecheck` scripts se difieren a TASK-06 según task.
- `progress/current-task.json` → `active_task: TASK-02`. `harness_status.typecheck_passed: true`.

### 2026-08-29 — Hotfix TASK-01 (Agente Trabajador)

- **Incidente:** Metro lanzó `Cannot read properties of undefined (reading 'transformFile')` en `metro/src/Bundler.js:55` al compilar en iOS/Android.
- **Causa raíz:** `react-native-css-interop@0.2.6` (motor de estilos de NativeWind v4 `4.2.6`, la versión estable) no es compatible con Metro 0.84 (Expo SDK 57): al envolver `getDefaultConfig` con `withNativeWind`, el Bundler de Metro 0.84 queda sin `_transformer` y el `transformFile` crashea. Context7 MCP no disponible; diagnóstico por inspección de `node_modules/metro/src/Bundler.js`, `react-native-css-interop/dist/metro/index.js` y `metro@0.84.5`.
- **Decisión (aprobada por Orquestador/Humano):** migrar a **NativeWind v5 `5.0.0-preview.4`** + **react-native-css@3.0.7** + **Tailwind v4** (CSS-first). Es la única vía compatible con Metro 0.84/Expo SDK 54+. Desvía la pin `v4` de `plan.md` §2.3 (era pre-release en el momento de escribir el plan). Documentada como decisión técnica.
- **Cambios:**
  - `package.json`: `nativewind → 5.0.0-preview.4`, `react-native-css@^3.0.7`, `tailwindcss@^4.3.3` + `@tailwindcss/postcss` + `postcss` (dev), `overrides.lightningcss = 1.30.1` (previene errores de deserialización del CSS). Eliminado `postinstall: patch-package` (no era dependencia y rompía `npm install`).
  - `metro.config.js`: `withNativewind(config)` (v5, sin opción `input`).
  - `babel.config.js`: solo `babel-preset-expo` (sin preset `nativewind/babel`, sin `jsxImportSource`).
  - `global.css`: Tailwind v4 layers (`theme.css`/`preflight.css`/`utilities.css`) + `@import "nativewind/theme"` + paleta institucional y `--font-lato`/`--font-lato-bold` vía `@theme` (CSS-first).
  - Eliminado `tailwind.config.js` (Tailwind v4 CSS-first).
  - Añadido `postcss.config.mjs` con `@tailwindcss/postcss`.
  - `nativewind-env.d.ts`: referencia `react-native-css/types` + `declare module "*.css"`.
- **Verificado:** `npx tsc --noEmit` pasa; `metro.config.js` carga (`transformerPath` → react-native-css metro-transformer, `.css` en sourceExts); el transformer carga; PostCSS compila tokens (`bg-fondo`, `text-guinda`, `font-lato-bold`). Pendiente de validación final por el Humano con `npx expo start -c`.

### 2026-08-29 — Hotfix TASK-01 (causa raíz real: babel-preset-expo faltante)

- **Nuevo hallazgo (supersede el diagnóstico previo):** el crash `_transformer` undefined persistía tras la migración a NativeWind v5. Reproducción fiel con `CI=1 npx expo export --platform android` reveló la causa real en la salida completa:
  - `Failed to construct transformer: Error: Cannot find module 'babel-preset-expo'` (desde `@babel/core/lib/config/files/plugins.js`).
  - El `babel.config.js` referencia `babel-preset-expo`, pero el paquete **no estaba instalado**. Al fallar el preset, `new Transformer(...)` (Bundler.js:25) lanzaba; el `.catch` del constructor del Bundler tragaba el error y dejaba `_transformer = undefined`, produciendo el `TypeError` posterior en `transformFile`. El mensaje original era un síntoma, no la causa.
- **Corrección:** `npx expo install babel-preset-expo` → instaló `babel-preset-expo@57.0.9`.
- **Verificación definitiva (bundle real, sin `expo start`):**
  - `CI=1 npx expo export --platform android` → `Android Bundled 62327ms index.ts (1130 modules)` OK.
  - `CI=1 npx expo export --platform ios` → `iOS Bundled 80149ms index.ts (1132 modules)` OK.
  - Assets `Lato-Bold.ttf` / `Lato-Regular.ttf` incluidos. Runtime de Reanimated + worklets (peer de NativeWind v5) empaquetado.
- **Estado:** la configuración NativeWind v5 (previo) era correcta y se mantiene; el único fix adicional fue instalar `babel-preset-expo`. Listo para validación visual por el Humano (`npx expo run:ios` / `run:android` / `expo start -c`).

### 2026-08-29 — TASK-01 APROBADA por el Humano

- **Validación:** el Tester Visual Humano compiló y validó TASK-01 con éxito en **Android e iOS** (Lato + paleta institucional + placeholder «Gabinete Móvil» correctos).
- Cierre: marcadas todas las checkboxes `- [x]` de TASK-01 en `spec/features/auth-biometric/task.md`; `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-02` `status: IN_PROGRESS`, `harness_status` con bundling OK en ambas plataformas y notas actualizadas.

### 2026-08-29 — TASK-02 (Agente Trabajador)

- Instalado `expo-secure-store@~57.0.2`, `axios@^1.20.0`, `@tanstack/react-query@^5.102.8` vía `npx expo install` (config plugin de `expo-secure-store` añadido a `app.json` por el propio comando).
- `src/features/auth/dto.ts`: DTOs espejo del contrato Spring Boot (cero `any`): `AuthRequestDTO`, `AuthBasicUserResponseDTO` (`idUser`, `name`, `email`, `active`, `role`, `isFirstLogin`), `AuthResponseDTO` (`token`, `expiresAt: string` ISO, `user`, `mfaRequired: boolean`).
- `src/lib/http/axiosClient.ts`: `axiosClient` con `baseURL: process.env.EXPO_PUBLIC_API_URL`, `timeout: 15000`, `Content-Type: application/json`, interceptor request Bearer desde módulo de token en memoria (`setAuthToken`/`getAuthToken`). No loguea tokens/payloads.
- `src/features/auth/tokenStore.ts`: claves `jwt`, `expires_at`, `user_snapshot`, `biometric_enabled`; opciones `{ keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY }`; `saveSession`/`loadSession`/`clearSession`/`setBiometricEnabled`/`getBiometricEnabled`. No persiste password. Parse de `user_snapshot` fallido → trata como sesión inválida y limpia.
- `src/features/auth/api.ts`: `loginRequest(payload): Promise<AuthResponseDTO>` mapeando 400/401/403 → `invalid_credentials`, 5xx/timeout/red → `server_unreachable`, 200+`mfaRequired` → `mfa_required` (bloqueante, no persiste), 200+`user.active===false` → `account_inactive`. Errores de dominio tipados (`AuthDomainError`), cero `any`.
- `.env.example` con `EXPO_PUBLIC_API_URL=` (placeholder). El Humano coloca la URL real.
- `npx expo install` añadió el plugin `expo-secure-store` a `app.json` (esperado; plugins biométricos completos serán TASK-05).
- **Arnés:** `npx tsc --noEmit` → pasa sin errores. ESLint no aplica aún (se configura en TASK-06); verificación de `any`/`TouchableOpacity`/`FlatList`/Expo Router = cero en los archivos tocados.
- `progress/current-task.json` → `active_task: TASK-03`, `status: IN_PROGRESS`, `harness_status.typecheck_passed: true`.

### 2026-08-29 — TASK-03 (Agente Trabajador)

- Instalado `@react-navigation/native@^7.3.18`, `@react-navigation/native-stack@^7.18.10`, `react-native-screens@~4.26.0` vía `npx expo install` (peers documentados de React Navigation 7; cero Expo Router).
- `src/navigation/types.ts`: `AuthStackParamList` (Login, BiometricUnlock), `AppStackParamList` (HomePlaceholder), `RootStackParamList` (Auth, App).
- `src/features/auth/AuthProvider.tsx`: sesión con `AuthStatus` `bootstrapping | unauthenticated | needs_biometric | authenticated`. Bootstrap con `loadSession` + validación de vigencia (`expiresAt`) + `getBiometricEnabled`; si sesión vencida→limpia y `unauthenticated`. Acciones `signIn`, `unlockWithBiometrics`, `declineBiometricOptIn`, `enableBiometricAfterLogin`, `signOut` que mantienen en sincronía SecureStore y el token en memoria del `axiosClient` (`setAuthToken`).
- `src/features/auth/useAuth.ts`: hook consumidor del contexto.
- `src/navigation/RootNavigator.tsx`: un solo `NavigationContainer` con tema `bg-fondo`; `status === authenticated` → AppStack (header nativo guinda, título «INICIO», Lato Bold); en caso contrario AuthStack con `headerShown: false` y `initialRouteName = BiometricUnlock` si `needs_biometric`, `Login` si `unauthenticated`; `bootstrapping` → `null` (splash). Cambio de raíz desmonta el stack contrario.
- `src/screens/app/HomePlaceholderScreen.tsx`: saludo con `user.name`, copy «Radar territorial disponible en la siguiente fase» y botón «Cerrar sesión».
- `src/screens/auth/LoginScreen.tsx` / `BiometricUnlockScreen.tsx`: stubs institucionales mínimos (UI final en TASK-04/05) para que el stack compile.
- `App.tsx`: cableado `QueryClientProvider` (@tanstack/react-query) → `AuthProvider` → `RootNavigator` + `StatusBar`.
- **Arnés:** `npx tsc --noEmit` → pasa sin errores. Cero `any` / `TouchableOpacity` / `FlatList` / Expo Router en los archivos tocados. ESLint se configura en TASK-06.
- **Nota TASK-03:** el desbloqueo biométrico solo valida que haya sesión vigente (la autenticación nativa `expo-local-authentication` se completa en TASK-05).
- `progress/current-task.json` → `active_task: TASK-04`, `status: TODO`, `harness_status.typecheck_passed: true`.

### 2026-08-29 — TASK-03 APROBADA por el Humano

- **Validación:** el Tester Visual Humano compiló y validó TASK-03 con éxito en **Android e iOS** (sesión + navegación Auth | App + Home placeholder con header nativo institucional correctos).
- Cierre: TASK-03 marcada `- [x]` / `Status: COMPLETED` en `spec/features/auth-biometric/task.md`.
- Lista para iniciar TASK-04 (LoginScreen institucional).

### 2026-08-29 — TASK-04 (Agente Trabajador)

- `src/components/ui/InstitutionalText.tsx`: wrapper de `Text` con `variant` `regular|bold` (Lato / Lato-Bold).
- `src/components/ui/Button.tsx`: compound `Button` + `ButtonText`, **solo `Pressable`** (cero `TouchableOpacity`). Variantes `primary` (`bg-guinda`, texto `superficie`) y `secondary` (`bg-superficie`, borde guinda, texto `guinda`). `disabled` → `opacity-40`. `accessibilityRole="button"`.
- `src/components/ui/TextField.tsx`: `label` + `TextInput` NativeWind (fondo `superficie`, borde `texto-suave`, `focus:border-guinda`) + `errorLabel` opcional en `text-error`.
- `src/features/auth/biometricService.ts`: stub tipado `getBiometricAvailability()`/`canUseBiometrics()` que retorna `false` (firma lista; la detección real de hardware con `expo-local-authentication` es TASK-05).
- `src/screens/auth/LoginScreen.tsx`: formulario institucional completo — validación local de email (`EMAIL_PATTERN`) y password no vacía; botón disabled si inválido o en vuelo (`idle|submitting|offering_biometrics`); errores de dominio institucionales (400/401/403, red, `mfaRequired`, `user.active===false`) leyendo `error.message` de `AuthDomainError` (sin importar `api.ts`, fuera de `allowed_files`); bloque opt-in biométrico «¿Usar Face ID / huella?» con «Usar Face ID / huella» (`enableBiometricAfterLogin`) y «Ahora no» (`declineBiometricOptIn`), visible solo si `canUseBiometrics()`; `KeyboardAvoidingView`+`ScrollView`; copy formal; strings dentro de `<Text>`; ternarios/`!!` sin falsy `&&`.
- `AuthProvider` no requirió cambios (ya exponía `enableBiometricAfterLogin`/`declineBiometricOptIn`). Sin tocar `api.ts` (fuera de `allowed_files`).
- **Arnés:** `npx tsc --noEmit` → pasa sin errores. Cero `any` / `TouchableOpacity` / `FlatList` / Expo Router. ESLint sigue pendiente (TASK-06).
- `spec/features/auth-biometric/task.md`: TASK-04 marcada `- [x]` / `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-05`, `status: TODO`.

### 2026-08-29 — TASK-04 APROBADA por el Humano

- **Validación:** el Tester Visual Humano compiló y validó TASK-04 con éxito en **Android e iOS** (marca Lato + guinda, formulario email/password, validación, mensajes de error institucionales y botón «Ingresar» correctos).
- Cierre: TASK-04 confirmada `COMPLETED`.
- Lista para iniciar TASK-05 (biometría: `expo-local-authentication` + plugins + unlock + opt-in real). Nota: el bloque opt-in aún no aparece porque `canUseBiometrics()` es stub (`false`) hasta TASK-05.

### 2026-08-29 — TASK-05 (Agente Trabajador)

- Instalado `expo-local-authentication@~57.0.2` vía `npx expo install` (módulo nativo → nunca `npm i`).
- `app.json`: plugins enriquecidos — `expo-local-authentication` con `faceIDPermission` institucional («…usa Face ID para desbloquear tu sesión institucional sin escribir la contraseña»), `expo-secure-store` con `configureAndroidBackup: true` + mismo `faceIDPermission`, y `ios.config.usesNonExemptEncryption: false` (cumplimiento Export Compliance de SecureStore). Cero `Info.plist` / `.swift` / `.kt` / `.pbxproj` a mano.
- `src/features/auth/biometricService.ts`: implementación real sobre `expo-local-authentication` — `getBiometricAvailability()` (`hasHardwareAsync` + `isEnrolledAsync`), `canUseBiometrics()` (`hasHardware && isEnrolled`), `authenticateWithResult()` (mapea el resultado a razones de dominio: `success`, `not_enrolled`, `not_available`, `lockout`, `authentication_failed`, `user_cancel`/`system_cancel`/`user_fallback` → `fallback`; opciones `disableDeviceFallback: false`, `biometricsSecurityLevel: "strong"`, prompt «Desbloquear Gabinete Móvil»), y `confirmBiometricOptIn()` (prompt de confirmación del opt-in con `disableDeviceFallback: true`).
- `src/features/auth/AuthProvider.tsx`:
  - **Bootstrap** (spec §5.1): ahora valida JWT + `biometric_enabled` + **hardware+enrolled** antes de setear `needs_biometric`; si no hay biometría disponible → `authenticated` (sin ofrecer unlock).
  - **`unlockWithBiometrics`**: ejecuta `authenticateWithResult()`; solo si `success` pasa a `authenticated`; cualquier fallo/cancelación permanece en `needs_biometric` (dejando visible el fallback a credenciales). Sesión vencida → limpia y `unauthenticated`.
  - **`enableBiometricAfterLogin`**: ejecuta `confirmBiometricOptIn()` y persiste `biometric_enabled` según `success`/`false`, **sin revertir el login** (spec §5.2).
- `src/screens/auth/BiometricUnlockScreen.tsx`: UI institucional rediseñada — auto-prompt biométrico **una sola vez al montar** (`useRef`), botón «Desbloquear» (dispara `unlockWithBiometrics`) y «Usar correo y contraseña» (→ `signOut`, limpia sesión y lleva a Login). Titulo Lato Bold guinda, `InstitutionalText`.
- `src/screens/auth/LoginScreen.tsx`: se conserva el cableado real — tras `signIn` exitoso consulta `canUseBiometrics()` real y muestra el bloque opt-in «¿Usar Face ID / huella?» con «Usar Face ID / huella» (`enableBiometricAfterLogin`) / «Ahora no» (`declineBiometricOptIn`). Sin cambios funcionales necesarios (el stub de TASK-04 ya quedó conectado).
- `src/features/auth/useAuth.ts`: sin cambios (interfaz estable).
- **Arnés:** `npx tsc --noEmit` → pasa en verde. Cero `any` / `TouchableOpacity` / `FlatList` / Expo Router. ESLint sigue pendiente (TASK-06).
- `spec/features/auth-biometric/task.md`: TASK-05 marcada `- [x]` / `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-06`, `status: TODO`, `harness_status.typecheck_passed: true`.

### 2026-08-29 — TASK-05 APROBADA por el Humano

- **Validación:** el Tester Visual Humano compiló y validó TASK-05 con éxito en **Android e iOS** (development build) — flujo completo del login híbrido correcto: login tradicional + opt-in «Usar Face ID / huella» → `biometric_enabled`; reapertura → pantalla Desbloquear con auto-prompt; Face ID/huella exitoso → acceso a Inicio sin teclear; cancelación/fallo → fallback «Usar correo y contraseña» que limpia la sesión.
- Cierre: TASK-05 confirmada `COMPLETED`.
- Lista para TASK-06 (ARNÉS: instalar/configurar ESLint + scripts `lint`/`typecheck`, correr `npx eslint .` y `npx tsc --noEmit`, cierre de Fase 1) y posterior auditoría por el Revisor.

### Pendiente

- [x] TASK-01 — Agente Trabajador ✅ (validada por el Humano en Android + iOS)
- [x] TASK-02 — Agente Trabajador ✅ (pendiente de validación visual/typing por el Humano)
- [x] TASK-03 — Agente Trabajador ✅ (validada por el Humano en Android + iOS)
- [x] TASK-04 — Agente Trabajador ✅ (validada por el Humano en Android + iOS)
- [x] TASK-05 — Agente Trabajador ✅ (validada por el Humano en Android + iOS)
- [ ] TASK-06 — Agente Trabajador / Revisor
- [ ] Auditoría arnés — Agente Revisor
- [ ] Validación visual + Face ID en dispositivo físico — Tester Visual Humano
- [ ] UI de Login Híbrido completada (bloqueada hasta handoff del Trabajador + Revisor)
