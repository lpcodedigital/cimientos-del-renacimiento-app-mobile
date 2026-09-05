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
- **Ajustes de integración biométrica validados en el flujo de prueba local (rama `feature/auth-biometric/task-05/29082026/local-login-test`):**
  - **Android:** se autoriza cualquier método seguro activado (PIN/patrón/huella/rostro) vía `getEnrolledLevelAsync() !== NONE`; `authenticateAsync` con `disableDeviceFallback: false` permite el respaldo DEVICE_CREDENTIAL. Funciona el desbloqueo por PIN.
  - **iOS:** para forzar Face ID como método principal se usa `disableDeviceFallback: true` (política `deviceOwnerAuthenticationWithBiometrics`) + `fallbackLabel: ""`. Se detectó la causa raíz del «Face ID nunca aparece»: faltaba la clave `NSFaceIDUsageDescription` en el `Info.plist` del proyecto nativo (vía `ios.infoPlist` en `app.json` y edición directa en `ios/GabineteMvil/Info.plist`). Tras añadirla, el overlay nativo de Face ID aparece y autentica correctamente en iOS (26.6).
  - Manejo de errores: `authenticateWithResult` envuelto en `try/catch`; `unlockWithBiometrics` devuelve errores tipados con mensajes claros (`lockout`, `not_enrolled`, cancelación…); `BiometricUnlockScreen` muestra el error y estado `pending`; `signOut` limpia el estado primero y la persistencia con `Promise.allSettled` (garantizando navegar al Login). Auto-prompt con `setTimeout` 500 ms para evitar canciones de iOS durante la transición.
  - Login demo local sin backend (`demo@cdr.mx` / `demo1234`) en `api.ts` para prueba de dispositivos.
- Cierre: TASK-05 confirmada `COMPLETED` tras validación física en Android e iOS con Face ID funcionando.
- Lista para TASK-06 (ARNÉS: instalar/configurar ESLint + scripts `lint`/`typecheck`, correr `npx eslint .` y `npx tsc --noEmit`, cierre de Fase 1) y posterior auditoría por el Revisor.

### 2026-08-29 — TASK-06 (Agente Trabajador) — LISTA PARA REVISOR

- **Nota de restauración:** la rama git se reinició y se perdió una pasada previa de TASK-06; se re-ejecutó completa desde el estado TASK-06 `TODO`.
- Instaladas dependencias dev de ESLint con `npx expo install --dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks` (eslint 9.39.5, @typescript-eslint 8.68.0, eslint-plugin-react 7.37.5, eslint-plugin-react-hooks 7.1.1). Añadidas a `devDependencies` en `package.json` + lockfile.
- `eslint.config.js` (flat config ESLint 9): spread de `@typescript-eslint/flat/recommended` + rules `react`/`react-hooks`. `react-in-jsx-scope` y `prop-types` off, `react/self-closing-comp`, `react/jsx-no-leaked-render` (`validStrategies: ternary`), `react-hooks/exhaustive-deps` (warn), `@typescript-eslint/no-explicit-any` (error), `no-unused-vars` (warn). Overrides para permitir `require()` en configs JS (eslint/metro/babel/postcss) y en `App.tsx` (assets fonts, patrón RN).
- Scripts en `package.json`: `"lint": "eslint ."`, `"typecheck": "tsc --noEmit"`.
- **Corrección de lint (archivo de TASK-05):** `src/screens/auth/BiometricUnlockScreen.tsx` — eliminada directiva `// eslint-disable-next-line react-hooks/exhaustive-deps` sin uso (la config ya aplica `exhaustive-deps: warn`; la directiva sobraba).
- **Arnés:** `npx eslint .` → 0 errores / 0 warnings; `npx tsc --noEmit` → verde. Verificación bans (rg sobre `.ts`/`.tsx`): cero `any` / `TouchableOpacity` / `FlatList` / imports `expo-router`. No se ejecutó `npx expo start`.
- `spec/features/auth-biometric/task.md`: TASK-06 marcada `- [x]` / `Status: COMPLETED`. `progress/current-task.json` → `active_task: TASK-06`, `status: READY_FOR_REVIEW`, `harness_status.linter_passed: true`, `typecheck_passed: true`, `bundling_passed_android/ios: true`.

### 2026-08-29 — TASK-06 APROBADA por el Humano

- **Validación:** el Tester Visual Humano compiló y validó TASK-06 con éxito en **Android e iOS** — arnés de control operativo (ESLint + TypeCheck en verde) y la app de Fase 1 compila y funciona íntegra sin romper el flujo del Login Híbrido validado en TASK-05.
- Cierre: la **Fase 1 (Shell Base, Navegación y Login Híbrido)** queda concluida y validada por el Humano en **Android e iOS**. Pendiente solo la re-auditoría opcional del Agente Revisor del arnés antes de planificar Fase 2 (Radar / GPS).

## Fase 1.5a — Pulido UI/UX de Autenticación (auth-ui-polish)

### 2026-09-04 — TASK-01 APROBADA por el Humano

- **Validación:** artefactos de base (tokens + dependencia) comprobados por el Humano; TASK-01 marcada `COMPLETED`.
- **Hecho:** `expo-linear-gradient@~57.0.1` instalada vía `npx expo install` (única dependencia nueva; `package.json` + lockfile). `global.css`: 15 tokens `--color-auth-*` dentro del `@theme` existente (paleta de Fase 1 y fuentes intactos). `src/theme/tokens.ts`: añadido `authPalette` (`bgTop`/`bgMid`/`bgBottom`/`goldGradStart`/`goldGradEnd`) más `btnText "#2D0A14"`; `palette` y `fontFamily` sin cambios.
- **Arnés:** `npx tsc --noEmit` → verde (exit 0).
- **Asset (consolidado — se respeta el plan original §2.4):** el Humano colocó **`assets/images/escudo-yucatan.png`** (PNG transparente). TASK-03 lo renderizará con `Image` de react-native (`resizeMode="contain"`, `accessibilityLabel="Escudo del Gobierno del Estado de Yucatán"`). `assets/images/escudo-yucatan.svg` permanece en el repo solo como fuente del Humano, no es asset de consumo de la app. Sin decisiones pendientes de asset para TASK-03.
- `progress/current-task.json` → `active_task: TASK-02`, `status: TODO`, `harness_status.typecheck_passed: true`. TASK-02 NO se ejecuta en esta instancia (la autoriza el Humano en nueva sesión).

### 2026-09-04 — Orquestación (Lead Planner)

- **Contexto:** Fase 1 concluida y validada por el Humano (2026-08-29). El Humano solicitó pulido visual del flujo de login contra mockups (`spec/features/auth-ui-polish/mockups/`), ajuste del flujo de interacción biométrico (`sutuacion-actual.md`) y un refactor Clean Architecture + SOLID, y pidió criterio sobre cómo encajarlo en el SDD del proyecto.
- **Decisión de gobernanza (aprobada por el Humano):** NO son tareas adicionales de la Fase 1 (queda congelada como baseline). Se crea la **Fase 1.5** en `roadmap.md` con dos sub-fases estrictamente secuenciales: **1.5a `auth-ui-polish`** (UI pixel-perfect + flujo) y **1.5b `core-arch-refactor`** (Clean Architecture + SOLID, invariante: cero cambio visual/funcional). Fase 2 permanece bloqueada hasta auditoría + aprobación humana de ambas.
- **Extracción de tokens:** muestreo de píxeles de los 3 PNG con script Python stdlib (sin PIL). 15 tokens `auth-*` consolidados: fondo gradiente `#5A1320→#3B0917→#290810`, crema `#EDD6A8`, taupe `#A58571`/`#6C4A44`, dorado `#C9A854`/`#8F693B`, surface `#471725`/`#7A3B48`, cards `#45201B`/`#331016`, gradiente dorado `#F5E5AF→#D9B563`, texto botón `#2D0A14`.
- **Decisiones del Humano (2026-09-04):** (1) orden 1.5a → 1.5b; (2) Lato se mantiene (título serif del mockup se aproxima con Lato Bold — desviación documentada); (3) «¿Olvidaste tu contraseña?» = link informativo con Alert institucional; (4) arranques posteriores = auto-prompt + botón de reintento; primer uso tras activar biometría = manual obligatorio (`biometric-login.png`); (5) escudo institucional lo proporciona el Humano (`assets/images/escudo-yucatan.png`, bloqueante parcial para TASK-03); (6) autorizada `expo-linear-gradient` como única dependencia nueva; (7) «Volver» del Unlock limpia sesión (semántica Fase 1 intacta).
- **Enmiendas constitucionales:** `roadmap.md` (Fase 1.5 insertada); `tech-stack.md` (§2.1 paleta auth-* exclusiva del flujo de autenticación, autorización de `expo-linear-gradient`, §5 Arquitectura de Software obligatoria desde 1.5b). `mission.md` y `AGENTS.md` sin cambios.
- **Artefactos SDD escritos:** `spec/features/auth-ui-polish/spec.md` (reescritura completa: tokens reales, flujo §5 con nueva `BiometricOptInScreen` + primer uso manual + caso biometría ya activada, §7 tabla de reglas superseded de Fase 1, CA-01…CA-10), `plan.md` (nuevo status `biometric_opt_in` + `biometricUnlockMode auto/manual`, componentes `AuthScaffold`/`GoldButton`/`BiometricMethodCard`/TextField dark, `confirmBiometricOptIn` + `getSupportedBiometricMethods`, eliminación de campos muertos del provider, eliminación de la caja «Prueba local» del Login), `task.md` (TASK-01…06 con allowed_files estrictos; `api.ts`/`dto.ts`/`tokenStore.ts` congelados).
- **Flujo resultante:** Login → (sin hardware: Home) / (biometría ya activa: Unlock manual) / (Opt-In → ACTIVAR → confirm nativo → primer uso manual → Home; Ahora no → Home sin revertir login). Arranque en frío con biometría: Unlock con auto-prompt + reintento manual; Volver → limpia sesión → Login.
- `progress/current-task.json` → feature `auth-ui-polish`, TASK-01 `TODO`, assigned_role Trabajador.

### 2026-09-04 — TASK-02 APROBADA por el Humano

- **Validación:** el Tester Visual Humano compiló la app con éxito en **Android e iOS**; TASK-02 marcada `COMPLETED`. Aclaración: el «fondo de color» que observó en el form es el Login claro de Fase 1 — todavía sin cablear; el reestilo oscuro llega en TASK-03. Sin cambios funcionales en pantallas en esta task (solo primitivas de UI semilla).
- **Hecho (secuencia TASK-02):** creados `AuthScaffold.tsx` (gradiente vertical `authPalette` + `StatusBar light` + `SafeAreaView`), `GoldButton.tsx` (compound `GoldButton` + `GoldButtonText` — gradiente horizontal dorado, `h-14 rounded-full`, `pressed`/`disabled`/`loading` con `ActivityIndicator`; solo `Pressable`), `BiometricMethodCard.tsx` (card `View` no interactiva, `bg-auth-card-active border-auth-dorado` / `bg-auth-card-inactive border-transparent`, checkmark Ionicons), y reestyle oscuro de `TextField.tsx` (label uppercase taupe, `bg-auth-surface`, `focus:border-auth-dorado`, error `border-error`, prop `secureToggle` con eye/eye-off). Cero `any` / `TouchableOpacity` / `FlatList` / `StyleSheet.create` injustificado; solo tokens `auth-*` + Lato.
- **DESVIACIÓN AUTORIZADA por el Humano/Orquestador:** `@expo/vector-icons@^15.0.2` NO venía instalado ni declarado (en Expo SDK 57 no es transitivo de `expo`), pero plan §5.3/§5.4 exigen Ionicons (checkmark y eye/eye-off). Instalado con `npx expo install @expo/vector-icons` (`package.json` + lockfile). El Revisor debe incluirla en las invariantes de TASK-06.
- **Arnés:** `npx tsc --noEmit` → verde (exit 0). Bundling verificado por el Humano (Android + iOS). ESLint se reserva a TASK-06.
- `spec/features/auth-ui-polish/task.md`: TASK-02 marcada `- [x]` / `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-02`, `status: COMPLETED`, `harness_status` con bundling Android/iOS `true` y typecheck `true`.
- **SIGUIENTE:** TASK-03 (LoginScreen pixel-perfect, plan §6.1) en NUEVA SESIÓN — consumirá AuthScaffold/TextField dark/GoldButton, renderizará `assets/images/escudo-yucatan.png` (plan §2.4) y añadirá el selector `canUseBiometricLogin` a `AuthProvider`/`useAuth`.

### 2026-09-05 — TASK-03 APROBADA por el Humano

- **Validación:** el Tester Visual Humano compiló la app en **Android e iOS**; en ambas plataformas ve el contenido (título, escudo, inputs, botón) con **match visual con `login-form.png`**. Funcionalidad del login (envío, validación) probada OK en Android. TASK-03 marcada `COMPLETED`.
- **Hecho (secuencia TASK-03):** reescrito `LoginScreen.tsx` (AuthScaffold + KAV + ScrollView `flex-1`, título de marca, escudo `assets/images/escudo-yucatan.png` con `Image` contain + accessibilityLabel, TextField dark email/password con `secureToggle` en contraseña, link «¿Olvidaste tu contraseña?» → `Alert` informativo, `GoldButton` «INICIAR SESIÓN» con loading, sección condicional divisor + «Acceso biométrico» si `canUseBiometricLogin`). Eliminada la caja «Prueba local: demo@cdr.mx / demo1234» de la UI (login demo intacto en `api.ts`). Conservados `EMAIL_PATTERN`, `canSubmit`, fase `idle|submitting` y mapeo de errores de dominio. Añadido selector `canUseBiometricLogin: boolean` a `AuthProvider` (bootstrap + signOut, default false) y su tipo en `useAuth.ts`. `LoginScreen` recibe navigation prop tipada `NativeStackScreenProps<AuthStackParamList, "Login">`. Sin cambios de rutas en navigation/types ni RootNavigator.
- **CORRECCIONES DE TASK-02 ESCALADAS durante TASK-03 (validadas por el Humano, zona de invariantes para TASK-06):** NativeWind v5/Tailwind v4 (CSS-first) NO aplica en iOS los `className` de los archivos NUEVOS de TASK-02 (AuthScaffold, GoldButton) — el Login quedaba en blanco/en fondo sin contenido y faltaba el botón. Se reescribieron a **estilos inline JS**: `AuthScaffold.tsx` (root `flex` + `backgroundColor` fill, gradiente `StyleSheet.absoluteFill` en capa `pointerEvents="none"` detrás del contenido, `useSafeAreaInsets()` como padding sobre `View` plano — sin `SafeAreaView` nativo) y `GoldButton.tsx`/`GoldButtonText.tsx` (Pressable `height 56`, `borderRadius 999`, `overflow hidden`, `opacity` por estado, `LinearGradient` `StyleSheet.absoluteFill` + borderRadius, texto Lato-Bold inline). Android e iOS quedan idénticos tras esto.
- **Arnés:** `npx tsc --noEmit` → verde (exit 0). Bundling verificado por el Humano (Android + iOS). ESLint se reserva a TASK-06.
- `spec/features/auth-ui-polish/task.md`: TASK-03 marcada `- [x]` / `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-04`, `status: TODO`, `harness_status` con bundling Android/iOS `true` y typecheck `true`.
- **SIGUIENTE:** TASK-04 (máquina de estados + BiometricOptInScreen, plan §3/§4/§6.2) en NUEVA SESIÓN, solo al autorizarlo el Humano.

### 2026-09-05 — TASK-04 APROBADA por el Humano (Fase 1.5a)

- **Validación:** el Tester Visual Humano compiló en **Android e iOS**. El login con Face ID activo (aún no activado en la app) mostró la `BiometricOptInScreen`: **visual 10/10, match con `biometric-opt-in-request.png`**. «Ahora no» → Home con sesión intacta. «ACTIVAR BIOMÉTRICO» → solicita permiso Face ID; aceptado → `biometric_enabled`. Arranque en frío con Face ID → reconoce → Home; «Cerrar sesión» → Login.
- **Hecho (secuencia TASK-04):**
  - `biometricService.ts`: añadidos `confirmBiometricOptIn()` (iOS `disableDeviceFallback:true`+`fallbackLabel""`, Android `disableDeviceFallback:false`, try/catch→false), `getSupportedBiometricMethods()` y tipo `BiometricMethodKind` (`facial|fingerprint|iris|none`), mapeando `AuthenticationType.FACIAL_RECOGNITION/FINGERPRINT/IRIS`. Sin tocar `authenticateWithResult` ni `getBiometricAvailability`.
  - `AuthProvider.tsx`: `AuthStatus` ampliado con `biometric_opt_in`; nuevo `BiometricUnlockMode = "auto"|"manual"` + estado `biometricUnlockMode` (default auto). Transiciones de plan §3.3: bootstrap (con biometría → needs_biometric/auto); `signIn` (sin hardware → authenticated; hardware + ya activada → needs_biometric/manual; hardware + no activada → biometric_opt_in); `declineBiometricOptIn` (persiste false → authenticated); `enableBiometricAfterLogin` (`confirmBiometricOptIn()` success → true + manual + needs_biometric; cancelado → false + authenticated, login NO revertido). Eliminados `shouldOfferBiometricOptIn`, `biometricEnrollHint`, `dismissBiometricOptIn`. Conservado `canUseBiometricLogin`.
  - `useAuth.ts`: interfaz sincronizada (`biometricUnlockMode` añadido, campos muertos eliminados, re-export de `BiometricUnlockMode`).
  - `navigation/types.ts`: añadido `BiometricOptIn: undefined`.
  - `RootNavigator.tsx`: registrada `BiometricOptInScreen` y extendido el mapeo `AUTH_INITIAL_ROUTE` (`biometric_opt_in → "BiometricOptIn"`).
  - `src/screens/auth/BiometricOptInScreen.tsx`: nueva pantalla (Volver/Ahora no → `declineBiometricOptIn`; ACTIVAR → `enableBiometricAfterLogin` con `loading`; cards FACE ID / HUELLA desde `getSupportedBiometricMethods()` — la soportada seleccionada, la otra `opacity 0.5` atenuda no-seleccionada, el hardware manda; beneficios lock-closed/flash/refresh con Ionicons). **Escrita con estilos INLINE JS** (los `className` de archivos nuevos no se aplican en iOS; no se reutilizó `BiometricMethodCard`, className-poisoned).
  - `HomePlaceholderScreen.tsx`: ajuste mínimo — eliminado el bloque que consumía los campos eliminados (el opt-in ya no vive ahí); volvió al placeholder de sesión simple con «Cerrar sesión».
- **FIX navegación en vivo (RootNavigator):** tras el login el `status` cambiaba pero el `AuthStack.Navigator` ya montado no re-aplicaba su `initialRouteName` → Login colgada sin navegar. Solución: `key={initialRouteName}` en el Navigator (remonta en la ruta inicial correcta al cambiar de status). Esto saneó Login → Opt-In en vivo.
- **Handoff a TASK-05 (documentado, NO es bug de TASK-04):** tras ACTIVAR (primer uso) y tras re-login con biometría activa, el status aterriza correctamente en `needs_biometric` + `manual`; pero la `BiometricUnlockScreen` heredada (provisional Fase 1) aún **auto-promputea incondicional** y iOS bloquea el segundo `authenticateAsync` encadenado → queda colgada hasta reiniciar. Ese tramo (modo manual sin auto-prompt + botón «INICIAR SESIÓN» + reintento manual) se resuelve EXCLUSIVAMENTE en TASK-05. OptIn/Unlock comparten el AuthScaffold oscuro; la Opt-In quedó aprobada.
- **Arnés:** `npx tsc --noEmit` → verde (exit 0). Bundling verificado por el Humano (Android + iOS). ESLint se reserva a TASK-06.
- `spec/features/auth-ui-polish/task.md`: TASK-04 marcada `- [x]` / `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-04`, `status: COMPLETED` (el puntero NO avanza a TASK-05; lo autoriza el Humano en nueva sesión). `harness_status` bundling Android/iOS `true` y typecheck `true`.
- **SIGUIENTE:** TASK-05 (BiometricUnlockScreen pixel-perfect + modos auto/manual, plan §6.3/§5.4) en NUEVA SESIÓN, solo al autorizarlo el Humano.

### 2026-09-05 — TASK-05 APROBADA por el Humano (Fase 1.5a)

- **Validación (físico, iOS + Android):** el Tester Visual Humano dio por cerrada TASK-05. Visual de `BiometricUnlockScreen` con match de `biometric-login.png`; flujo completo validado: en `BiometricOptInScreen`, ACTIVAR dispara Face ID/huella nativo → la app navega a `BiometricUnlockScreen` en modo **`manual` (sin auto-prompt)** → al presionar «INICIAR SESIÓN» valida el método y lleva a Home.
- **Hecho (secuencia TASK-05):**
  - `src/screens/auth/BiometricUnlockScreen.tsx`: reescrita íntegra con **estilos INLINE JS** (los `className` de archivos nuevos no se aplican en iOS). AuthScaffold + header Pressable `< Volver` → `signOut` (fallback que limpia sesión), título «Cimientos del Renacimiento» (Lato-Bold, crema), escudo `assets/images/escudo-yucatan.png` (`Image` contain, w-40=160×160, accessibilityLabel institucional), cuerpo «Utilice su método biométrico para acceder» (taupe), error de desbloqueo `text-error` si existe, `GoldButton` «INICIAR SESIÓN» (loading/disabled = pending) → `unlockWithBiometrics`. Reutiliza `AuthScaffold`/`GoldButton`/`GoldButtonText` (ya inline de TASK-03). Cero `any`/`TouchableOpacity`/`FlatList`/`expo-router`/emojis.
  - Auto-prompt: efecto `setTimeout` 500 ms protegido por `autoPrompted` ref **solo cuando `biometricUnlockMode === "auto"`**; en `"manual"` no hay auto-prompt, el prompt salta únicamente al presionar el botón. Conserva `handleUnlock` (errores de dominio vía `errorMessage`, `pending` anti-duplicado en ref). Resuelve el bug real en físico: iOS bloqueaba el segundo `authenticateAsync` encadenado justo tras ACTIVAR/OptIn y tras re-login con biometría activa.
  - **FIX de navegación en vivo (`src/navigation/RootNavigator.tsx`), escalado del handoff de TASK-04 y confirmado con esta task:** el `initialRouteName` del `AuthStack.Navigator` NO se re-aplicaba en un navigator ya montado (el `NavigationContainer` conservaba el estado previo y la pantalla OptIn quedaba pegada tras ACTIVAR; igual ocurría Login→OptIn). Solución definitiva: **`<NavigationContainer key={status} …>`** — cada transición de la máquina de estados remonta el container sin estado previo e inicia limpio en el `initialRouteName` derivado del `status`. Se eliminó el `key={initialRouteName}` interno del Navigator. Transiciones sancadas: `biometric_opt_in`→Unlock manual, `unauthenticated`→Login, `signIn`→`biometric_opt_in`, y `needs_biometric` auto/manual en arranque en frío.
- **Arnés:** `npx tsc --noEmit` → verde (exit 0). Bundling verificado por el Humano (Android + iOS). ESLint se reserva a TASK-06 (queda pendiente ahí el lint de `typecheck` puro ya verde y el caso del patrón `require()` en `BiometricUnlockScreen.tsx:106`, mismo patrón aprobado en LoginScreen).
- `spec/features/auth-ui-polish/task.md`: TASK-05 marcada `- [x]` / `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-05`, `status: COMPLETED` (el puntero NO avanza a TASK-06; lo autoriza el Humano en nueva sesión al ejecutar la TASK-06). `harness_status` bundling Android/iOS `true` y typecheck `true`.
- **SIGUIENTE:** TASK-06 (ARNÉS) en NUEVA SESIÓN — ESLint + TypeCheck + verificación de bans e invariantes por diff, para dejar la Fase 1.5a lista para pixel-diff (CA-01…03), flujos (CA-04…08) y biometría física del Humano. Solo al autorizarlo el Humano.

### 2026-09-05 — TASK-06 (Arnés de control) — READY_FOR_REVIEW (primera pasada del Trabajador)

- **Arnés real sobre todo el repo:**
  - `npx tsc --noEmit` → **exit 0** (verde, sin errores).
  - `npx eslint .` → **exit 0** (sin errores ni warnings).
  - NO se ejecutó `npx expo start` (prohibido a agentes; bundling real en físico queda reservado al Humano).
- **Correcciones de lint aplicadas (solo archivos de TASK-01…05, sin refactors de alcance):**
  1. `src/components/ui/TextField.tsx` (TASK-02): `react/jsx-no-leaked-render` en `secureTextEntry={secureToggle && isSecure}` → nueva const derivada `isSecureActive` (booleana), usada como prop. Cero cambio funcional.
  2. `src/features/auth/AuthProvider.tsx` (TASK-04): `@typescript-eslint/prefer-const` → `nextMode` de `let` a `const` (nunca se reasignaba).
  3. `src/screens/auth/LoginScreen.tsx` (TASK-03) y `src/screens/auth/BiometricUnlockScreen.tsx` (TASK-05): resuelto el **require() público del escudo** pendiente (`@typescript-eslint/no-require-imports` está off solo en `App.tsx`/configs). Estrategia de TASK-06: el asset se define como import/const en un módulo nuevo compartido **`src/assets/images.ts`** (`imageAssets.escudoYucatan`, import tipado del `.png` vía alias relativo), reutilizable por Login y Unlock, y se sustituyó el `require(...)` inline en ambos screens por `source={imageAssets.escudoYucatan}`. Para que el `import` del `.png` tipara se añadió la **declaración de módulo `*.png`** (`source: ImageSourcePropType`) en `nativewind-env.d.ts`, misma forma que el `declare module "*.css"` preexistente. **Fuentes de asset intactas** (`assets/images/escudo-yucatan.png` no fue modificado).
- **Verificación de bans (grep sobre `.ts`/`.tsx`): cero `any`, cero `TouchableOpacity`, cero `FlatList`, cero imports de `expo-router`, cero emojis en UI auth, cero `StyleSheet.create`.**
- **Verificación de invariantes por diff contra HEAD:** `src/features/auth/api.ts`, `src/features/auth/dto.ts`, `src/features/auth/tokenStore.ts` y `app.json` **sin cambios** (exit 0). Dependencia nueva de Fase 1.5a = `expo-linear-gradient@~57.0.1` (+ `@expo/vector-icons@^15.0.2` autorizado en TASK-02 y registrado en las invariantes como pidió el Revisor).
- `spec/features/auth-ui-polish/task.md`: TASK-06 marcada `- [x]` (pasos) / `Status: COMPLETED` (primera pasada del Trabajador) con allowed_files ampliado para incluir el módulo compartido y la declaración `*.png`.
- `progress/current-task.json` → `active_task: TASK-06`, `status: READY_FOR_REVIEW`, `harness_status.linter_passed: true`, `typecheck_passed: true`, bundling Android/iOS `PENDIENTE (Humano)`.
- **PARADA CONTROLADA (sin avanzar de fase):** NO se inició Fase 1.5b ni la auditoría del Revisor. Siguientes actores por turno: el **Revisor** re-ejecuta el arnés y verifica el diff de invariantes; después el **Tester Visual Humano** hace pixel-diff (CA-01…03), valida flujos (CA-04…08) y comprueba Face ID/huella en físico (iOS + Android) antes de autorizar que el Orquestador redacte Fase 1.5b.

### 2026-09-05 — TASK-06 APROBADA por el Humano — Fase 1.5a CERRADA

- **Validación:** el Humano dio por completada la TASK-06 y cerró la **Fase 1.5a `auth-ui-polish`**. Revalidó el arnés (ESLint + TypeCheck en verde) y las invariantes por diff, y confirmó en dispositivo el comportamiento de los cambios de asset (módulo `src/assets/images.ts` + import tipado del escudo). Aprobación formal en `spec/features/auth-ui-polish/task.md`, `progress/current-task.json` (TASK-06 `APPROVED`, `harness_status` actualizado) y esta bitácora.
- **Siguiente fase (gobernanza):** la **Fase 1.5b `core-arch-refactor`** (Clean Architecture + SOLID) NO ha sido abierta ni planificada. Conforme a `roadmap.md`, se redactará y arrancará cuando el Humano la autorice en una nueva instancia. El puntero de `current-task.json` queda detenido en TASK-06 `APPROVED`.

### Pendiente

- [x] TASK-01 — Agente Trabajador ✅ (validada por el Humano en Android + iOS)
- [x] TASK-02 — Agente Trabajador ✅ (pendiente de validación visual/typing por el Humano)
- [x] TASK-03 — Agente Trabajador ✅ (validada por el Humano en Android + iOS)
- [x] TASK-04 — Agente Trabajador ✅ (validada por el Humano en Android + iOS)
- [x] TASK-05 — Agente Trabajador ✅ (validada por el Humano en Android + iOS)
- [x] TASK-06 — Agente Trabajador ✅ (validada por el Humano en Android + iOS)
- [x] Fase 1.5a TASK-01 — Tokens + expo-linear-gradient + asset (Agente Trabajador, APROBADA 2026-09-04)
- [x] Fase 1.5a TASK-02 — Componentes UI (AuthScaffold, GoldButton, BiometricMethodCard, TextField dark) (Agente Trabajador, APROBADA 2026-09-04)
- [x] Fase 1.5a TASK-03 — LoginScreen pixel-perfect (Agente Trabajador, APROBADA 2026-09-05; match con login-form.png en iOS y Android)
- [x] Fase 1.5a TASK-04 — Máquina de estados + BiometricOptInScreen (Agente Trabajador, APROBADA 2026-09-05; ver bloque de cierre abajo)
- [x] Fase 1.5a TASK-05 — BiometricUnlockScreen pixel-perfect (Agente Trabajador, APROBADA 2026-09-05; ver bloque de cierre abajo)
- [x] Fase 1.5a TASK-06 — Arnés (APROBADA por el Humano 2026-09-05; Fase 1.5a CERRADA)
- [ ] Fase 1.5b `core-arch-refactor` — spec/plan/task se redactan al autorizarla el Humano en nueva instancia (Orquestador; NO abierta)
