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
- **Siguiente fase (gobernanza):** la **Fase 1.5b `core-arch-refactor`** quedó autorizada para **Paso 0 SDD** el 2026-09-10 (ver bloque abajo). El código de TASK-01 no arranca en esta instancia.

## Fase 1.5b — Refactor arquitectónico (core-arch-refactor)

### 2026-09-10 — Orquestación Paso 0 (Lead Planner) — SDD escrito; CERO código

- Constitución leída: `AGENTS.md`, `mission.md`, `tech-stack.md` §5, `roadmap.md` Fase 1.5b.
- Baseline 1.5a congelada: `auth-ui-polish` spec/plan + inventario real de `/src`. Fase 1 y 1.5a no reabiertas.
- Decisiones humanas (2026-09-10): árbol nested por feature; `src/app/compositionRoot.ts` + `AuthProvider` en presentation con use cases por props; DIP `presentation → application+domain`; DTOs en infra / `User`+`Session` en domain; puerto `AuthTokenHolder`; use case `ListBiometricMethods`; factories (closures) no clases; shims TASK-03 y delete TASK-06; `features/home` para el placeholder; fences ESLint sin paquete nuevo.
- Artefactos SDD:
  - `spec/features/core-arch-refactor/spec.md`
  - `spec/features/core-arch-refactor/plan.md`
  - `spec/features/core-arch-refactor/task.md` (TASK-01…06; TASK-01 Status TODO)
- `progress/current-task.json` → feature `core-arch-refactor`, TASK-01 `TODO`, `assigned_role: Trabajador`. **No IN_PROGRESS.**
- **PARADA CONTROLADA:** no se inició TASK-01 ni se pasó el batón al Trabajador. Fase 2 sigue bloqueada.

### 2026-09-10 — TASK-01 (Domain kernel auth) — COMPLETED y APROBADA por el Humano

- **Hecho (secuencia TASK-01):** creados los **8 archivos de domain** con firmas **verbatim** de `plan.md` §4, sin consumidores, sin UI, sin moves, sin dependencias:
  - `src/features/auth/domain/entities/User.ts` (`User`: `idUser`, `name`, `email`, `active`, `role`, `isFirstLogin`).
  - `src/features/auth/domain/entities/Session.ts` (`Session`: `token`, `expiresAt`, `user`).
  - `src/features/auth/domain/errors/AuthError.ts` (`AuthErrorKind`, `AuthError`, `AUTH_ERROR_MESSAGES`, `authError()`).
  - `src/features/auth/domain/sessionLifecycle.ts` (`AuthStatus`, `BiometricUnlockMode`, `isSessionVigente()`).
  - `src/features/auth/domain/ports/SessionRepository.ts` (`save`/`load`/`clear`/`setBiometricEnabled`/`getBiometricEnabled`).
  - `src/features/auth/domain/ports/BiometricGateway.ts` (`BiometricAvailability`, `BiometricMethodKind`, `BiometricFallbackReason`, `BiometricGateway`).
  - `src/features/auth/domain/ports/AuthApi.ts` (`login`).
  - `src/features/auth/domain/ports/AuthTokenHolder.ts` (`setToken`).
- **Reglas respetadas:** domain sin imports de `react`, `react-native`, `expo-*`, `axios`, `@/shared`, `@/app` ni capas hermanas (solo imports relativos `./User` / `../entities/Session`). Cero `any`, cero clases de use case, cero barrels `index.ts`, cero comentarios. No se tocó ninguna pantalla, Provider, `api`, `tokenStore`, `biometricService`, `App.tsx` ni infraestructura.
- **Arnés:** `npx tsc --noEmit` → **exit 0** (verde). ESLint de fences + repo completo sigue reservado a TASK-06. NO se ejecutó `npx expo start`.
- `spec/features/core-arch-refactor/task.md`: TASK-01 marcada `- [x]` / `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-02`, `status: TODO` (no IN_PROGRESS), `harness_status` con typecheck `true`.
- **SIGUIENTE:** TASK-02 (Application use cases: `types.ts` + 7 factories, plan §5) en **NUEVA SESIÓN**, solo al autorizarlo el Humano. Fase 2 sigue bloqueada.

### 2026-09-10 — TASK-02 (Application use cases) — COMPLETED y APROBADA por el Humano

- **Objetivo:** crear la capa `application` de auth, aún sin consumidores: el contrato de inyección y las 7 factories que orquestan los puertos del `domain`, replicando la máquina de estados congelada de 1.5a (plan §5.2). Nadie la instancia todavía.
- **Hecho (secuencia TASK-02):** creados los **8 archivos** con firmas **verbatim** de `plan.md` §5, sin consumidores, sin UI, sin moves, sin dependencias:
  - `src/features/auth/application/types.ts` (`SessionSnapshot`, `EMPTY_UNAUTHENTICATED`, `AuthUseCases`).
  - `src/features/auth/application/bootstrapSession.ts` → `createBootstrapSession`.
  - `src/features/auth/application/signIn.ts` → `createSignIn`.
  - `src/features/auth/application/unlockWithBiometrics.ts` → `createUnlockWithBiometrics`.
  - `src/features/auth/application/enableBiometric.ts` → `createEnableBiometric`.
  - `src/features/auth/application/declineBiometricOptIn.ts` → `createDeclineBiometricOptIn`.
  - `src/features/auth/application/signOut.ts` → `createSignOut`.
  - `src/features/auth/application/listBiometricMethods.ts` → `createListBiometricMethods`.
- **Tabla §5.2 respetada:** `signIn` devuelve siempre `canUseBiometricLogin: false` (no lo “arregla”); `unlockWithBiometrics` lanza `new Error(reason)` con los 3 mensajes institucionales exactos y **no** lanza si la sesión está ausente/expirada (retorna `EMPTY_UNAUTHENTICATED`); `decline`/`enable` reexponen `token`/`user`/`expiresAt` vigentes vía `load()` sin limpiar el JWT; `signOut` = `tokenHolder.setToken(null)` + `Promise.allSettled([clear(), setBiometricEnabled(false)])` + `EMPTY_UNAUTHENTICATED`. Factories = closures, no clases. `signIn` deja subir `AuthError` sin `catch`.
- **Reglas respetadas:** application solo importa `../domain/...` y `./types` (cero `react`, `react-native`, `expo-*`, `axios`, `infrastructure`, `presentation`, `@/shared`, `@/app`). Cero `any`, cero comentarios, cero barrels `index.ts`. No se tocó pantalla, Provider, `api`, `tokenStore`, `biometricService`, `App.tsx` ni infraestructura.
- **Arnés:** `npx tsc --noEmit` → **exit 0** (verde). Grep de `any`/`TouchableOpacity`/`FlatList`/`expo-router` en `application/` → 0 coincidencias. ESLint de fences + repo completo sigue reservado a TASK-06. NO se ejecutó `npx expo start`.
- **PARADA CONTROLADA:** TASK-02 **COMPLETED** aprobada por el Humano el 2026-09-10. El puntero **no** avanza a TASK-03 (se autoriza en nueva sesión). `spec/features/core-arch-refactor/task.md`: TASK-02 marcada `- [x]` / `Status: COMPLETED`. `progress/current-task.json` → `active_task: TASK-02`, `status: COMPLETED`, `harness_status.typecheck_passed: true`.
- **Nota para TASK-03 (3 interpretaciones de §5.2 confirmadas):** (1) `unlockWithBiometrics` success → `canUseBiometricLogin: true`; (2) `enableBiometric` → `canUseBiometricLogin: false` en ambas ramas; (3) `decline`/`enable` usan `session?.token ?? null` para reexponer la sesión vigente sin limpiar el JWT.
- **SIGUIENTE:** TASK-03 (Infrastructure adapters + shims 1.5a, plan §6) en **NUEVA SESIÓN**, solo al autorizarlo el Humano. Fase 2 sigue bloqueada.

### 2026-09-10 — TASK-03 (Infrastructure adapters + shims 1.5a) — COMPLETED y APROBADA por el Humano

- **Objetivo:** crear los adapters canónicos que implementan los puertos del `domain` y dejar los paths 1.5a de auth/http como **shims de reexport sin lógica**, para que la app 1.5a siga compilando hasta TASK-04/06. Cero UI nueva, cero movimientos de presentation, cero dependencias, cero código nativo.
- **Hecho (secuencia TASK-03):** creados **6 archivos** de infraestructura canónica con factories (closures, no clases) y firmas de `plan.md` §6:
  - `src/features/auth/infrastructure/dto.ts` (verbatim 1.5a: `AuthRequestDTO`, `AuthBasicUserResponseDTO`, `AuthResponseDTO`).
  - `src/features/auth/infrastructure/AxiosAuthApi.ts` → `createAxiosAuthApi` + `loginRequest`. `demoLogin` idéntico (`demo@cdr.mx` / `demo1234`, token `demo-token-${Date.now()}`, expires +8h, user Juan Pérez). `POST /api/auth/login` con `AuthRequestDTO`. Mapeo intacto: `mfaRequired` → `mfa_required`; `user.active===false` → `account_inactive`; Axios 400/401/403 → `invalid_credentials`; else → `server_unreachable`. Usa `authError()` de domain. `Session` mapeado 1:1 (`token`, `expiresAt`, `user`).
  - `src/features/auth/infrastructure/SecureStoreSessionRepository.ts` → `createSecureStoreSessionRepository`. Claves `jwt`, `expires_at`, `user_snapshot`, `biometric_enabled`; opciones `{ keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY }`; parse fallido de `user_snapshot` → `clear()` + `null`; `clear()` **no** borra `biometric_enabled`.
  - `src/features/auth/infrastructure/ExpoBiometricGateway.ts` → `createExpoBiometricGateway`. Cuatro métodos del puerto (`getAvailability`, `authenticate`, `confirmOptIn`, `getSupportedMethods`) con prompts iOS/Android, `Platform.OS` branches, Android `getEnrolledLevelAsync` y iOS `disableDeviceFallback`/`fallbackLabel` **verbatim**.
  - `src/features/auth/infrastructure/AxiosAuthTokenHolder.ts` → `createAxiosAuthTokenHolder` (`return { setToken: setAuthToken }`).
  - `src/shared/infrastructure/http/axiosClient.ts` (move fiel: `baseURL: EXPO_PUBLIC_API_URL`, timeout 15000, interceptor Bearer, `setAuthToken`/`getAuthToken`).
- **Shims de reexport sin lógica (paths 1.5a):**
  - `src/features/auth/dto.ts` → reexport de los 3 tipos de `./infrastructure/dto`.
  - `src/features/auth/api.ts` → reexport de `loginRequest` + tipos `AuthDomainError`/`AuthErrorKind` de domain (compatibilidad de superficie).
  - `src/features/auth/tokenStore.ts` → singleton de `createSecureStoreSessionRepository()` + `PersistedSession = Session` + `saveSession`/`loadSession`/`clearSession`/`setBiometricEnabled`/`getBiometricEnabled`.
  - `src/features/auth/biometricService.ts` → singleton de `createExpoBiometricGateway()` + los 4 nombres 1.5a + reexport de tipos biométricos de domain.
  - `src/lib/http/axiosClient.ts` → reexport de `@/shared/infrastructure/http/axiosClient`.
- **Reglas respetadas:** adapters = closures; infrastructure solo implementa puertos de domain e importa axios/expo (cero imports de `application`/`presentation`); shims sin lógica; semántica intacta (demo login, mapeo de errores, claves SecureStore, `clear()` no borra `biometric_enabled`, prompts biométricos, `WHEN_UNLOCKED_THIS_DEVICE_ONLY`). Cero `any`, cero barrels `index.ts`, cero comentarios. No se tocó pantalla, Provider, compositionRoot, `api`/`tokenStore`/`biometricService` originales (quedaron como shims), `App.tsx` ni `app.json`.
- **Arnés:** `npx tsc --noEmit` → **exit 0** (verde). Grep de `any`/`TouchableOpacity`/`FlatList`/`expo-router` en lo tocado → 0. NO se ejecutó `npx expo start`.
- **Validación humana:** el Tester Visual Humano compiló y validó TASK-03 en **Android e iOS** (build sin problemas, login funcional). TASK-03 marcada `- [x]` / `Status: COMPLETED` en `spec/features/core-arch-refactor/task.md`.
- **PARADA CONTROLADA:** `progress/current-task.json` → `active_task: TASK-04`, `status: TODO` (no IN_PROGRESS), `harness_status` con bundling Android/iOS `OK`. El puntero **no** se ejecuta: TASK-04 se autoriza en nueva sesión. Fase 2 sigue bloqueada.
- **SIGUIENTE:** TASK-04 (Composition root + AuthProvider DIP + OptIn, plan §7) en **NUEVA SESIÓN**, solo al autorizarlo el Humano.

### 2026-09-10 — TASK-04 (Composition root + AuthProvider DIP + OptIn) — COMPLETED y APROBADA por el Humano

- **Objetivo:** cablear DIP con composition root. Único cambio funcional permitido: OptIn obtiene métodos vía `listBiometricMethods` del contexto (mismo resultado que `getSupportedBiometricMethods`). Cero cambio visual/funcional vs 1.5a.
- **Hecho (secuencia TASK-04):**
  - `src/app/compositionRoot.ts` (nuevo) → `createAuthUseCases()`: instancia los 4 adapters de infrastructure (tokenHolder, sessionRepository, biometricGateway, authApi) y arma los 7 use cases de application con las factories del plan §7.1. **Único importador de `infrastructure`** (DIP).
  - `src/features/auth/AuthProvider.tsx` → props `{ children, useCases: AuthUseCases }`; estado React idéntico + `applySnapshot()`; bootstrap con `active` flag; acciones delegan a los use cases; `unlockWithBiometrics` **re-lanza** el `Error` del use case (UnlockScreen depende) y no lanza si el use case retorna `unauthenticated` por sesión vencida. **CERO imports de `api`/`tokenStore`/`biometricService`/`axiosClient`/`dto`/`infrastructure`**. Conserva `enableBiometricAfterLogin` y demás nombres públicos; reexporta `AuthStatus`/`BiometricUnlockMode`.
  - `src/features/auth/useAuth.ts` → misma fachada + `listBiometricMethods`; tipos desde `domain` (`User`, `AuthStatus`, `BiometricUnlockMode`, `BiometricMethodKind`) y reexport para no forzar rutas de domain a las pantallas.
  - `App.tsx` → `const authUseCases = createAuthUseCases()` a nivel de módulo; `<AuthProvider useCases={authUseCases}>`; fonts/Splash/QueryClient/StatusBar/global.css intactos.
  - `src/screens/auth/BiometricOptInScreen.tsx` → quitado import de `biometricService`; usa `listBiometricMethods` de `useAuth` en el `useEffect` de montaje; **CERO cambios de JSX/estilos**.
  - Shims de TASK-03 intactos (se borran en TASK-06). Máquina §5.2 intacta (delegada a `application`).
- **Arnés:** `npx tsc --noEmit` → **exit 0** (verde). ESLint de fences + repo completo sigue reservado a TASK-06. NO se ejecutó `npx expo start`.
- **Validación humana:** el Tester Visual Humano compiló y validó TASK-04 en **Android e iOS**; builds sin problema y sin pérdida de características. TASK-04 marcada `- [x]` / `Status: COMPLETED` en `spec/features/core-arch-refactor/task.md`.
- **PARADA CONTROLADA:** `progress/current-task.json` → `active_task: TASK-05`, `status: TODO` (no IN_PROGRESS), `harness_status` con bundling Android/iOS `OK`. El puntero **no** se ejecuta: TASK-05 se autoriza en nueva sesión. Fase 2 sigue bloqueada.
- **SIGUIENTE:** TASK-05 (Relocate presentation / shared / navigation / home, plan §2–§3/§7.4) en **NUEVA SESIÓN**, solo al autorizarlo el Humano.

### 2026-09-10 — TASK-05 (Relocate presentation / shared / navigation / home) — COMPLETED y APROBADA por el Humano

- **Objetivo:** mover presentation/shared/navigation/home al árbol destino de Clean Architecture. Diff permitido = **solo rutas de import y reloc**. Cero cambios de JSX, estilos, copy o keys de navegación.
- **Hecho (secuencia TASK-05):** movimientos con `git mv` (historial preservado):
  - `src/features/auth/{AuthProvider.tsx,useAuth.ts}` → `src/features/auth/presentation/` (imports relativos a `../application` y `../domain`).
  - `src/screens/auth/{Login,BiometricOptIn,BiometricUnlock}Screen.tsx` → `src/features/auth/presentation/screens/`.
  - `src/screens/app/HomePlaceholderScreen.tsx` → `src/features/home/presentation/`.
  - `src/navigation/{types.ts,RootNavigator.tsx}` → `src/app/navigation/`.
  - `src/components/ui/*` (6 componentes) → `src/shared/ui/`.
  - `src/theme/tokens.ts` → `src/shared/theme/tokens.ts`.
  - `src/assets/images.ts` → `src/shared/assets/images.ts` (relative path del PNG ajustado a `../../../assets/images/escudo-yucatan.png`).
- **Imports actualizados:** `App.tsx` (AuthProvider → `presentation/`, RootNavigator → `app/navigation/`), `RootNavigator` (useAuth/presentation, theme → shared/theme, screens → presentation/screens, home → features/home), pantallas (useAuth → presentation, UI → shared/ui, tokens → shared/theme, images → shared/assets, types → app/navigation), `shared/ui/AuthScaffold` y `GoldButton` (tokens → shared/theme). Total: 11 archivos modificados, 35 líneas cambiadas, todas de import.
- **Invariantes conservadas:** `NavigationContainer key={status}`, header nativo «INICIO», `AuthScaffold`/`GoldButton` con estilos inline, máquina de estados §5.2 y contratos. Cero shims de presentation nuevos (ningún import apunta a los paths viejos); shims TASK-03 (`api`/`dto`/`tokenStore`/`biometricService`/`lib/http/axiosClient`) intactos. Cero barrels `index.ts`.
- **Arnés:** `npx tsc --noEmit` → **exit 0** (verde). ESLint de fences + repo completo sigue reservado a TASK-06. NO se ejecutó `npx expo start`/`export`.
- **Validación humana:** el Tester Visual Humano compiló y validó TASK-05 en **Android e iOS**; todo se ejecutó correctamente y sin errores. TASK-05 marcada `- [x]` / `Status: COMPLETED` en `spec/features/core-arch-refactor/task.md`.
- **PARADA CONTROLADA:** `progress/current-task.json` → `active_task: TASK-06`, `status: TODO` (no IN_PROGRESS), `harness_status` con bundling Android/iOS `OK`. El puntero **no** se ejecuta: TASK-06 se autoriza en nueva sesión. Fase 2 sigue bloqueada.
- **SIGUIENTE:** TASK-06 (Borrar shims + fences ESLint + arnés, plan §9) en **NUEVA SESIÓN**, solo al autorizarlo el Humano. TASK-06 es la última de la Fase 1.5b; tras ella, Revisor audita y el Tester Visual Humano valida CA-01…08 en dispositivo.

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
- [x] Fase 1.5b Paso 0 SDD — Orquestador (2026-09-10): spec/plan/task escritos; TASK-01 en TODO
- [x] Fase 1.5b TASK-01 — Domain kernel (Trabajador; COMPLETED y APROBADA por el Humano 2026-09-10)
- [x] Fase 1.5b TASK-02 — Application use cases (Trabajador; COMPLETED y APROBADA por el Humano 2026-09-10)
- [x] Fase 1.5b TASK-03 — Infrastructure + shims (Trabajador; COMPLETED y APROBADA por el Humano 2026-09-10; build Android/iOS OK, login funcional)
- [x] Fase 1.5b TASK-04 — Composition root + AuthProvider DIP (Trabajador; COMPLETED y APROBADA por el Humano 2026-09-10; build Android/iOS OK, sin pérdida de características)
- [x] Fase 1.5b TASK-05 — Relocate presentation/shared/nav/home (Trabajador; COMPLETED y APROBADA por el Humano 2026-09-10; build Android/iOS OK, sin errores)
- [x] Fase 1.5b TASK-06 — Delete shims + ESLint fences + arnés (Trabajador; COMPLETED y APROBADA por el Humano 2026-09-10; compilada y probada en Android/iOS)

### 2026-09-10 — TASK-06 (Delete shims + ESLint fences + arnés) — READY_FOR_REVIEW

- **Objetivo:** eliminar los paths 1.5a residuales, imponer el DIP por linter (sin paquete nuevo) y dejar la Fase 1.5b lista para el Revisor y el Tester Visual Humano. Cero UI, cero cambios visuales/funcionales, cero dependencias.
- **Hecho (secuencia TASK-06):**
  - **Shims borrados (5):** `git rm src/features/auth/api.ts`, `src/features/auth/dto.ts`, `src/features/auth/tokenStore.ts`, `src/features/auth/biometricService.ts` y `src/lib/http/axiosClient.ts`; `rmdir src/lib/http` + `src/lib` (dirs vacíos). Ya no existían `src/features/auth/AuthProvider.tsx` ni `src/features/auth/useAuth.ts` en la raíz (TASK-05 los movió a `presentation/`).
  - **Dirs 1.5a ya vaciados en TASK-05:** `src/screens`, `src/components`, `src/navigation`, `src/theme`, `src/assets` no existían. El asset raíz `assets/images/escudo-yucatan.png` permanece intacto.
  - **Confirmación de imports:** grep en `*.ts`/`*.tsx`/`*.js`: cero referencias a `@/screens`, `@/components`, `@/navigation`, `@/theme`, `@/assets`, `features/auth/{api,dto,tokenStore,biometricService}`, `lib/http`, `features/auth/{AuthProvider,useAuth}`.
  - **`eslint.config.js` — tres bloques `no-restricted-imports` (plan §9, regla core, sin paquete nuevo):**
    1. `src/features/*/domain/**` — prohíbe `react`, `react-native`, `axios`, `@tanstack/*`, `expo-secure-store`, `expo-local-authentication`, `expo-font`, `expo-linear-gradient`, `@/features/*/application/**`, `@/features/*/infrastructure/**`, `@/features/*/presentation/**`, `@/shared/**`, `@/app/**`.
    2. `src/features/*/application/**` — prohíbe `react`, `react-native`, `axios`, los `expo-*` listados, `@/features/*/infrastructure/**`, `@/features/*/presentation/**`, `@/shared/infrastructure/**`, `@/app/**`.
    3. `src/features/*/presentation/**`, `src/app/navigation/**`, `src/shared/ui/**` — prohíbe `@/features/*/infrastructure/**`, `@/shared/infrastructure/**`, `expo-secure-store`, `expo-local-authentication`, `axios`.
    - `src/app/compositionRoot.ts` y `App.tsx` quedan **fuera** de los globs (pueden importar infra).
- **Arnés (verde):**
  - `npx tsc --noEmit` → **exit 0**.
  - `npx eslint .` → **exit 0** (cero errores, cero warnings) con los tres fences activos.
  - Bans en `.ts`/`.tsx`: **cero** `any`, `TouchableOpacity`, `FlatList`, `expo-router`.
  - DIP: únicos imports de `infrastructure` = dentro de `src/features/auth/infrastructure/*` (legal) y `src/app/compositionRoot.ts` (único importador autorizado). `domain`/`application`/`presentation` limpios.
  - `git diff HEAD -- package.json app.json` → **sin cambios** (cero dependencias nuevas; cero cambios nativos).
  - NO se ejecutó `npx expo start` (reservado al Humano).
- **Árbol final:** `src/app/{compositionRoot.ts,navigation/}`, `src/features/auth/{domain,application,infrastructure,presentation}`, `src/features/home/presentation/`, `src/shared/{ui,theme,assets,infrastructure/http}`.
- `spec/features/core-arch-refactor/task.md`: TASK-06 marcada `- [x]` / `Status: READY_FOR_REVIEW`.
- `progress/current-task.json` → `active_task: TASK-06`, `status: READY_FOR_REVIEW`, `harness_status.linter_passed: true`, `typecheck_passed: true`, bans/DIP verificados, bundling Android/iOS `PENDIENTE (Humano)`.
- **PARADA CONTROLADA:** TASK-06 **READY_FOR_REVIEW**. Siguientes actores: el **Revisor** audita el arnés y las invariantes por diff; después el **Tester Visual Humano** valida CA-01…08 en dispositivo (iOS + Android) y la biometría física. **Fase 2 sigue bloqueada.**

### 2026-09-10 — TASK-06 APROBADA por el Humano — Fase 1.5b CERRADA

- **Validación:** el Humano confirmó que la **TASK-06 se completó con éxito**: compilada y probada en dispositivos **Android e iOS**. Arnés revalidado (ESLint + TypeCheck en verde), bans (any/TouchableOpacity/FlatList/expo-router) y DIP verificados, y `package.json`/`app.json` sin cambios.
- Cierre: **Fase 1.5b `core-arch-refactor` CERRADA y APROBADA por el Humano** (2026-09-10). Árbol Clean Architecture por features operativo: `src/app/{compositionRoot.ts,navigation/}`, `src/features/auth/{domain,application,infrastructure,presentation}`, `src/features/home/presentation/`, `src/shared/{ui,theme,assets,infrastructure/http}`. Paths 1.5a residuales eliminados y DIP impuesto por linter.
- `spec/features/core-arch-refactor/task.md`: TASK-06 marcada `- [x]` / `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-06`, `status: COMPLETED`, `harness_status` con linter/typecheck `true`, bans/DIP verificados y bundling Android/iOS `OK (Humano)`.
- **Fase 2 NO iniciada.** Queda bloqueada hasta autorización explícita del Humano en nueva sesión. PARADA CONTROLADA.

### 2026-09-15 — Orquestación Fase 2 (reescritura constitucional + spec 2a)

- **Decisión del Humano:** no implementar el párrafo original de Fase 2 ni crear un 2.5 de pulido. Reescribir Fase 2 **antes** de código. Menú = sub-fase **2a** anterior e independiente del radar. Clean Architecture + SOLID de 1.5b aplican desde la primera línea (2a sin dominio vacío; 2b abrirá capas de `home`).
- **Enmiendas constitucionales:**
  - `spec/constitution/roadmap.md`: Fase 2 = 2a `app-shell-menu` + 2b `radar-home` (contratos mapa/callout/KPI preparado; ficha = Fase 4). Bottom Tabs superseded. `AGENTS.md` y `mission.md` **sin cambios**.
  - `spec/constitution/tech-stack.md`: navegación = Native Stack + drawer overlay custom (prohibido `@react-navigation/drawer` / zeego / tabs en Fase 2); §2.2 paleta `app-*` muestreada de los PNG; §2.3 mapas/location solo 2b con `npx expo install` + API key Android autorizada por el Humano.
- **Mockups:** `menu.png` → `spec/features/app-shell-menu/mockups/menu.png`. `inicio.png` permanece en `spec/features/radar-home/mockups/` (chrome 2a + mapa 2b).
- **Artefactos SDD 2a (cero código RN):** `spec/features/app-shell-menu/{spec,plan,task}.md`. Spec estado **PENDIENTE DE APROBACIÓN HUMANA**. TASK-01…04 definidas; TASK-01 **TODO**, no IN_PROGRESS.
- **Muestreo 2026-09-15 (mockup @2x):** header crema `#F2EDE6`, franja/cabecera `#5C1120`, wordmark `#F0DDB3`, drawer ~72% + overlay, ítems `#333333` / iconos `#89535B`, logout pie `#B03132`. Copy de ítems: transcripción del PNG en TASK-02 (esta sesión no tuvo OCR).
- **2b no planificada.** Contratos congelados en el roadmap (obra/curso mapa + callout; `detail` de curso path `/api/v1/public/curso/detail/{id}`; localidad de curso ausente en DTO).
- `progress/current-task.json` → feature `app-shell-menu`, TASK-01 TODO, PARADA CONTROLADA.
- **Siguiente:** Humano aprueba `spec.md` (y confirma copy de menú al ver el PNG) y autoriza TASK-01 en **nueva sesión**. Prohibido al Trabajador arrancar solo.

### 2026-09-15 — Enmienda de árbol 2a (Humano)

- El chrome no vive en `src/app/navigation/` (quedaba suelto). Destino: `src/features/app-shell/presentation/{menuItems,AppHeader,AppBrandBar,AppDrawer,AppShell}`. Cero `domain`/`application`/`infrastructure` (no hay puertos). `RootNavigator` solo importa y envuelve.
- Enmendados: `roadmap.md` (arquitectura 2a), `spec/features/app-shell-menu/{spec,plan,task}.md`. TASK-01 (tokens) no cambia. TASK-02 `allowed_files` apuntan al nuevo path.
- Cero código RN. TASK-01 sigue TODO. PARADA CONTROLADA.

### 2026-09-17 — TASK-01 (Tokens `app-*`) — COMPLETED y APROBADA por el Humano

- **Hecho (secuencia TASK-01):** solo tokens, cero componentes, cero dependencias, cero nativo.
  - `global.css`: añadidos los 6 tokens `--color-app-*` del plan §3.1 dentro del `@theme` existente — `--color-app-crema: #f2ede6`, `--color-app-guinda: #5c1120`, `--color-app-gold-wordmark: #f0ddb3`, `--color-app-item: #333333`, `--color-app-item-icon: #89535b`, `--color-app-logout: #b03132`. Tokens Fase 1 y `auth-*` intactos; `--font-lato` / `--font-lato-bold` intactos. Overlay **no** se registró como color sólido (plan §3.1: valor dinámico de opacidad en estilo inline).
  - `src/shared/theme/tokens.ts`: añadido `appPalette` (`crema`, `guinda`, `goldWordmark`, `item`, `itemIcon`, `logout`, `overlay: "rgba(0,0,0,0.45)"`) `as const`, verbatim del plan §3.2. `palette`, `fontFamily` y `authPalette` sin modificar.
- **Reglas respetadas:** cero `any` / `TouchableOpacity` / `FlatList` / `expo-router` / paleta `auth-*` / comentarios. Sin UI, sin navigator, sin GPS/mapas/HTTP. No se adelantó TASK-02 (AppHeader/AppDrawer).
- **Arnés:** `npx tsc --noEmit` → **exit 0** (verde). `git diff -- package.json app.json` → **vacío**. NO se ejecutó `npx expo start`. ESLint de repo se reserva a TASK-04.
- **Validación:** el Humano dio TASK-01 por completada el 2026-09-17 (solo diff de tokens revisado).
- `spec/features/app-shell-menu/task.md`: TASK-01 marcada `- [x]` / `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-02`, `status: TODO` (el puntero NO avanza a IN_PROGRESS; lo autoriza el Humano en nueva sesión), `harness_status.typecheck_passed: true`, `package_json_sin_cambios: true`, `app_json_sin_cambios: true`.
- **SIGUIENTE:** TASK-02 (componentes del chrome bajo `src/features/app-shell/presentation/`, plan §4–§5) en **NUEVA SESIÓN**, solo al autorizarlo el Humano. `RootNavigator` no se toca hasta TASK-03. Fase 2b sigue bloqueada.

### 2026-09-18 — Transcripción de mockups 2a (Orquestador) — CERO código RN

- Bloqueo previo del Trabajador: el modelo no podía leer PNG y no debía inventar copy. El Humano pidió transcripción en spec/plan/task **sin ejecutar TASK-02**.
- **`inicio.png` (chrome):** hamburguesa `menu`; título `INICIO`; wordmark `Cimientos del Renacimiento` (Lato Bold).
- **`menu.png`:** ítems `Inicio` / `Búsqueda` / `Mi perfil` / `Historial` / `Configuración` con Ionicons `home-outline` / `search-outline` / `person-outline` / `time-outline` / `open-outline`. Logout pie `log-out-outline` + `Cerrar sesión` (fuera del array).
- **Decisión Humano:** cabecera del drawer = avatar + `user.name` + `user.email` (`useAuth`), no `AppBrandBar`. Wordmark solo en Inicio. PNG de ejemplo (`Juan Pérez López`) no se hardcodea. Inicio del menú sin bold/fill.
- Enmendados: `spec.md` §4.2–§4.5 + §6.5; `plan.md` §4–§5.3; `task.md` TASK-02 con copy verbatim. Cero archivos bajo `src/features/app-shell/`. TASK-02 sigue **TODO**.
- **SIGUIENTE:** Trabajador ejecuta TASK-02 en nueva sesión copiando spec §4.5 / plan §4. No relee PNG.

### 2026-09-18 — TASK-02 (Componentes del chrome) — IN_PROGRESS (pendiente Humano)

- **Hecho (secuencia TASK-02):** creados los **5 archivos** bajo `src/features/app-shell/presentation/` (sin wire al navigator; `RootNavigator` y `HomePlaceholderScreen` intactos):
  - `menuItems.ts`: tipos `AppMenuAction` / `AppMenuItem` + array `menuItems` verbatim de spec §4.5 (`Inicio`/`home-outline`/`home`, `Búsqueda`/`search-outline`, `Mi perfil`/`person-outline`, `Historial`/`time-outline`, `Configuración`/`open-outline`, los 4 últimos `noop`). Logout fuera del array.
  - `AppHeader.tsx`: fondo `app-crema` + `paddingTop` insets; fila 48 pt; `Pressable` hamburguesa Ionicons `menu` (`palette.texto`, 28, hitSlop, `accessibilityLabel="Abrir menú"`); `INICIO` `lato-bold` centrado absoluto. `<StatusBar style="dark" />`.
  - `AppBrandBar.tsx`: fondo `app-guinda`, wordmark `Cimientos del Renacimiento` `lato-bold` `goldWordmark` centrado. Solo Inicio.
  - `AppDrawer.tsx`: props `{ open, onClose, onSignOut }`; `null` si cerrado; overlay `Pressable` `absoluteFill` `appPalette.overlay` → `onClose`; panel `"72%"` `app-crema`; cabecera `app-guinda` con avatar `person-outline` + `useAuth().user.name` / `.email` (ternarios, cero hardcode); 5 ítems vía `menuItems.map` (`home`→`onClose`, `noop` no-op); pie divisor + `log-out-outline` + `Cerrar sesión` `app-logout`; `BackHandler` Android en `useEffect` si `open`.
  - `AppShell.tsx`: estado local `drawerOpen`; `useAuth().signOut`; `flex:1` `app-crema`; `AppHeader` abre; `AppBrandBar`; `{children}`; `AppDrawer`.
- **Estilos:** inline JS con `appPalette` / `palette` / `fontFamily` (precedente NativeWind v5 iOS 1.5a). `StyleSheet` solo para `absoluteFill` + `hairlineWidth`; ancho `"72%"` inline justificado. Solo `Pressable`. Cero `auth-*`.
- **Incidencia TS resuelta en la task:** `expo-status-bar` v57 **no** acepta `backgroundColor` (TS2322). Se usó `<StatusBar style="dark" />`; el crema lo pinta el `View` del header. Desviación documentada en `task.md` (plan §5.1 lo pedía).
- **Arnés:** `npx tsc --noEmit` → **exit 0**. `git diff -- package.json app.json` → **vacío**. Grep bans en `app-shell/` → cero `any` / `TouchableOpacity` / `FlatList` / `expo-router` / `auth-`. Cero `infrastructure`, cero barrels. NO se ejecutó `npx expo start`.
- `spec/features/app-shell-menu/task.md`: TASK-02 pasos `- [x]` / `Status: IN_PROGRESS` (NO COMPLETED; lo cierra el Humano). Notas de implementación añadidas.
- `progress/current-task.json` → `active_task: TASK-02`, `status: IN_PROGRESS` (el puntero NO avanza a TASK-03), `harness_status.typecheck_passed: true`.
- **PARADA CONTROLADA:** TASK-02 pendiente de validación Humana. No se inició TASK-03. `RootNavigator` sin tocar → el chrome aún no se ve en la app. Fase 2b sigue bloqueada.

### 2026-09-18 — TASK-02 APROBADA por el Humano

- **Validación:** el Humano dio por completada TASK-02 (revisión de código; el chrome aún no se pinta porque `RootNavigator` no se cablea hasta TASK-03).
- Cierre: `spec/features/app-shell-menu/task.md` → TASK-02 `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-03` (`TODO`, sin IN_PROGRESS), `harness_status.typecheck_passed: true`, `package_json_sin_cambios: true`, `app_json_sin_cambios: true`, bundling pendiente del Humano (se verá al cerrar TASK-03).
- **SIGUIENTE:** TASK-03 (wire `RootNavigator` + quitar logout de `HomePlaceholderScreen`) en **NUEVA SESIÓN**, solo al autorizarlo el Humano. Fase 2b sigue bloqueada.

### 2026-09-18 — TASK-03 (Wire navigator + quitar logout del placeholder) — READY_FOR_REVIEW

- **Hecho (secuencia TASK-03):** el chrome quedó cableado a la raíz autenticada. Solo 2 archivos tocados:
  - `src/app/navigation/RootNavigator.tsx`: import de `AppShell` desde `@/features/app-shell/presentation/AppShell`; `<AppStack.Navigator screenOptions={{ headerShown: false }}>` (eliminados `headerStyle` / `headerTintColor` / `headerTitleStyle` guinda); `<AppStack.Navigator>` **envuelto** en `<AppShell>`. Retirado `fontFamily` del import de `@/shared/theme/tokens` por quedar huérfano (`palette` se conserva para `appTheme.background`). `NavigationContainer key={status}` y `AuthStackNavigator` (headerShown:false + initialRoute por status) **intactos**.
  - `src/features/home/presentation/HomePlaceholderScreen.tsx`: eliminados el `Pressable` «Cerrar sesión» y el `signOut` huérfano (`useAuth().user` se conserva para el saludo). Fondo `bg-fondo` → `bg-app-crema`. Cero otros cambios.
  - `src/app/navigation/types.ts`: **sin tocar** (tsc no lo exigió; sin rutas nuevas).
- **Reglas respetadas:** cero `any` / `TouchableOpacity` / `FlatList` / `expo-router` / paleta `auth-*` / comentarios; cero deps; cero nativo; cero `src/features/auth/**`, `compositionRoot.ts`, `App.tsx`; cero barrels; solo `Pressable` (los componentes ya venían de TASK-02).
- **Arnés:** `npx tsc --noEmit` → **exit 0**. `git diff -- package.json app.json` → **vacío**. NO se ejecutó `npx expo start` (reservado al Humano). ESLint se reserva a TASK-04.
- `spec/features/app-shell-menu/task.md`: TASK-03 pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO COMPLETED; lo cierra el Humano). Notas de implementación añadidas.
- `progress/current-task.json` → `active_task: TASK-03`, `status: READY_FOR_REVIEW` (el puntero NO avanza a TASK-04), `harness_status.typecheck_passed: true`.
- **PARADA CONTROLADA:** TASK-03 pendiente de validación visual Humana en dispositivo. NO se inició TASK-04. Fase 2b sigue bloqueada.

### 2026-09-18 — TASK-03 APROBADA por el Humano (dispositivos físicos)

- **Validación:** el Humano validó TASK-03 en dispositivos físicos **Android e iOS** y la dio por **COMPLETED**. Chrome visible y funcional: header crema + `INICIO` + hamburguesa + franja guinda; drawer 72% (cabecera de perfil, 5 ítems, logout rojo) con overlay; Inicio/overlay/back cierran; stubs no navegan; `Cerrar sesión` → Login. Regresión auth OK.
- Cierre: `spec/features/app-shell-menu/task.md` → TASK-03 `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-04` (`TODO`, sin IN_PROGRESS; cronograma de arnés: Trabajador + Revisor), `harness_status` con `bundling_passed_android`/`ios` APROBADOS, `typecheck_passed: true`, `package_json_sin_cambios: true`, `app_json_sin_cambios: true`.
- **SIGUIENTE:** TASK-04 (arnés: `npx tsc --noEmit`, `npx eslint .`, grep bans, DIP, diff deps) en **NUEVA SESIÓN**, solo al autorizarlo el Humano. Fase 2b sigue bloqueada.

### 2026-09-18 — TASK-04 (Arnés / verificación CA-06 + CA-07) — READY_FOR_REVIEW

- **Modo:** solo auditoría. Cero cambios funcionales, cero deps, cero nativo, cero `npx expo start`. No se tocó código de producto, auth, `compositionRoot.ts`, `App.tsx` ni deps.
- **Resultados literales del arnés:**
  - `npx tsc --noEmit` → **exit 0**.
  - `npx eslint .` → **exit 0** (cero warnings).
  - Bans (`git ls-files 'src/**/*.ts' 'src/**/*.tsx' App.tsx` × grep `\bany\b|TouchableOpacity|FlatList|expo-router`) → **cero coincidencias** (exit 1).
  - DIP (grep `from '...infrastructure'` en código versionado): únicos imports = 4 en `src/app/compositionRoot.ts`. `AxiosAuthApi.ts` / `AxiosAuthTokenHolder.ts` importan `@/shared/infrastructure/http/axiosClient` desde dentro de `infrastructure` (no violan la regla). Cero imports de `infrastructure` desde presentation/application/navigation/shared-ui.
  - `git diff -- package.json app.json` → **vacío**. `git status` de deps → sin cambios.
  - Residuales `1.5a` / `legacy` / `_old` / `deprecated` en código versionado → **cero** (exit 1). Rutas `drawer`/`zeego`/`bottom-tabs` en navigator → cero.
- **Diff de árbol no-code:** único `M Instructions/fase_2a/fase_2a.md` (artefacto de prompt del Humano, preexistente; fuera de `src` y de deps).
- **CA-06 / CA-07:** listos. `spec/features/app-shell-menu/task.md` → TASK-04 `Status: READY_FOR_REVIEW` (NO COMPLETED).
- `progress/current-task.json` → `active_task: TASK-04`, `status: READY_FOR_REVIEW`, `harness_status.linter_passed: true` (además de typecheck/bans/DIP/deps).
- **PARADA CONTROLADA:** TASK-04 pendiente de aprobación del Revisor/Humano. **NO** se inició Fase 2b (`radar-home`).

### 2026-09-18 — TASK-04 APROBADA por el Humano (Fase 2a cerrada)

- **Validación:** el Humano dio TASK-04 por **COMPLETED**. Arnés de Fase 2a completo en verde: `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 (cero warnings); bans (`any`/`TouchableOpacity`/`FlatList`/`expo-router`) a cero; DIP verificado (único importador de `infrastructure` = `compositionRoot.ts`); `git diff -- package.json app.json` vacío (CA-07); cero residuales `1.5a`.
- Cierre: `spec/features/app-shell-menu/task.md` → TASK-04 `Status: COMPLETED`.
- `progress/current-task.json` → `active_task: TASK-04`, `status: COMPLETED`, `harness_status` con `linter_passed`/`typecheck_passed`/`bans_verificado`/`dip_verificado`/`package_json_sin_cambios`/`app_json_sin_cambios` en `true`.
- **Estado:** Fase 2a (`app-shell-menu`, CA-01…CA-07) **CERRADA**. No se ejecutó `npx expo start` por agentes.
- **DETENIDO:** no se planifica ni escribe Fase 2b (`radar-home`). Siguiente paso solo bajo instrucción explícita del Humano.

## Fase 2b — Radar Territorial (radar-home)

### 2026-10-06 — Orquestación Paso 0 (Lead Planner) — SDD escrito; CERO código RN

- **Contexto:** Fase 2a cerrada y aprobada por el Humano (2026-09-18). El Humano autorizó la fase de plan de 2b con contrato real del backend ya disponible y pidió reescribir 2b contra `spec/features/radar-home/mockups/inicio.png` (el texto 2026-09-15 de pines por obra/curso con callout individual queda superseded).
- **Contrato real (Humano, 2026-10-06):** `GET /api/v1/dashboard/mapa-home` → array de `MunicipioResumenDTO` (`municipio`, `totalObras`, `totalCursos`, `totalInversion`, `obrasFinalizadas`, `obrasEnProceso`, `latitude`, `longitude`) con JSON de ejemplo de 22 municipios (CHANKOM…PANABÁ). Un pin por municipio; popup KPI agregado municipal.
- **Decisiones del Humano (12, en spec §2):** un pin por municipio guinda `#6B142E` + GPS dorado `#C4A35A`; popup KPI + `X` + `Ver más` no-op + ripple animado de 3 anillos; barra de búsqueda **solo visual** (Fase 3); chips del endpoint = centran cámara + estado seleccionado (no abren popup); «MI UBICACIÓN» centra GPS (pide permiso solo al tocarlo); etiqueta fija del municipio del dispositivo vía reverse geocode (`—` sin permiso); cámara inicial GPS-si-permiso / si-no `fitToCoordinates`; datos del DTO tal cual (sin reconciliar sumas); `VARIOS` se pinta; deps únicas `react-native-maps` + `expo-location`; copy de permiso **aprobado**: «El Gabinete Móvil usa tu ubicación para centrar el radar territorial y mostrar el municipio donde te encuentras.»
- **Muestreo 2026-10-06 (Python stdlib, fills sin texto):** chip activo `#C67E33`, chip inactivo `#C3CEC0`, popup header `#D6DED1`, popup body `#D8DAC9`, superficies `#FFFFFF`. Pines morado `#6F337B`/verde `#2D7939` del generador → superseded por guinda/dorado. Artefactos del PNG declarados NO replicar (spec §4.7): labels gibberish de pines, `MI MV UBICACIÓN`, KPI de ejemplo, icono pin morado `#7044BD` de la etiqueta.
- **Context7 (2026-10-06):** `react-native-maps` (`Marker pinColor`/`onPress`, `animateToRegion`, `fitToCoordinates`, `pointForCoordinate`) y `expo-location` (`get/requestForegroundPermissionsAsync`, `getCurrentPositionAsync`, `reverseGeocodeAsync`, config plugin `locationWhenInUsePermission`) verificados contra docs actuales.
- **Enmiendas constitucionales:** `roadmap.md` §2b reescrito (contrato real + comportamiento chips/popup/búsqueda); `tech-stack.md` §2.4 nueva tabla `radar-*` (8 tokens + reglas de texto). `mission.md` y `AGENTS.md` sin cambios.
- **Artefactos SDD escritos (cero código RN):** `spec/features/radar-home/spec.md` (12 decisiones, transcripción literal §4.5, contrato verbatim §4.6, artefactos §4.7, flujo §5, desviaciones §6, superseded §7, arquitectura 4 capas §8, CA-01…10), `plan.md` (árbol destino, firmas verbatim domain/application/infra, `HomeProvider`, wiring `compositionRoot`/`App.tsx`, fences ESLint para `expo-location`/`react-native-maps`, ripple Reanimated, formato MDP/Title Case, apéndice JSON de referencia), `task.md` (TASK-01…06 con allowed_files estrictos; TASK-01 = tokens + installs + `app.json` con **gate de API key del Humano**).
- `progress/current-task.json` → feature `radar-home`, TASK-01 `TODO` (no IN_PROGRESS). PARADA CONTROLADA.
- **SIGUIENTE:** el Humano aprueba `spec.md`, entrega la API key de Google Maps Android y autoriza TASK-01 en **nueva sesión**. Prohibido al Trabajador arrancar solo. Fase 3 sigue bloqueada.

### 2026-10-06 — Micro-enmienda del plan 2b (Orquestador) — CERO código, CERO tasks ejecutadas

- **Motivo:** el Humano pidió auditar el SDD de 2b contra las prácticas de `core-arch-refactor` (1.5b) antes de continuar. Auditoría favorable salvo 3 desviaciones de redacción.
- **Ajustes aplicados SOLO a `spec/features/radar-home/plan.md`:**
  1. **§7 (HomeProvider):** fachada única fijada — `useHomeRadar()` reexpone estado + acciones **y** `useCases` (calco de `useAuth` 1.5b). Los componentes nunca reciben use cases por otro camino.
  2. **§8.8 (HomeScreen):** eliminada la ambigüedad "desde `useHomeRadar()` o prop directa" → los use cases llegan **solo** por `useHomeRadar()`; prohibido pasarlos por props al screen.
  3. **§12 nueva tabla "Skills aplicables"** (patrón 1.5b plan §10): `ui-pressable`, `rendering-no-falsy-and`, `animation-gpu-properties`, `js-hoist-intl`, `react-state-minimize`, `navigation-native-navigators`, `ui-measure-views`.
  4. **§13 nuevo "Criterio de hecho técnico"** (patrón 1.5b plan §11): arnés/deps/contrato verdes, árbol poblado + placeholder eliminado + chrome/auth diff vacío, firmas intactas, TASK-06 `READY_FOR_REVIEW`, Fase 3 no iniciada.
- **Sin cambios:** spec.md, task.md, constitución, código de producto. TASK-01 sigue **TODO** con gate (spec aprobada + API key Android del Humano). Ninguna TASK fue ejecutada ni autorizada.
- **Prácticas 1.5b verificadas como ya presentes en el SDD 2b:** closures no clases, puertos en domain, DTO espejo en infra, error `{kind,message}`+factory, `compositionRoot` único importador de infra, instanciación a nivel de módulo en `App.tsx`, provider con use cases por props, cero barrels, fences `no-restricted-imports` sin paquete nuevo, servidor solo TanStack Query, orden anti-rompimiento domain→application→infra→UI→wire→arnés, tsc verde por task.

### 2026-10-06 — spec.md de radar-home APROBADA por el Humano

- **Aprobación:** el Humano revisó y aprobó `spec/features/radar-home/spec.md` (fuente de verdad de producto de 2b). Header de la spec actualizado a **APROBADA (2026-10-06)**.
- **Estado de gobernanza:** SDD completo y aprobado (spec + plan + task + enmiendas constitucionales + micro-enmienda del plan). TASK-01 permanece **TODO** (no IN_PROGRESS).
- **Gate restante para el Worker (DeepSeek):** el Humano entrega la **API key de Google Maps Android** y autoriza TASK-01 en **nueva sesión** con el prompt de ejecución preparado por el Orquestador (2026-10-06). Tras ejecutar, TASK-01 queda `READY_FOR_REVIEW` (la cierra el Humano tras validar diff y rebuild nativo).
- **Cero código RN.** Fase 3 sigue bloqueada hasta cerrar 2b.

### 2026-10-06 — TASK-01 (Tokens radar-* + deps + plugins) — READY_FOR_REVIEW (Trabajador)

- **Objetivo:** registrar la paleta `radar-*`, instalar mapas/ubicación y dejar `app.json` listo. Sin componentes, cero UI.
- **Hecho:**
  - `global.css`: añadidos los 5 tokens `--color-radar-*` dentro del `@theme` existente (plan §3.1) — `--color-radar-surface: #ffffff`, `--color-radar-chip: #c3cec0`, `--color-radar-chip-active: #c67e33`, `--color-radar-popup-header: #d6ded1`, `--color-radar-popup-body: #d8dac9`. Fase 1, `auth-*` y `app-*` intactos.
  - `src/shared/theme/tokens.ts`: añadido `radarPalette` verbatim (plan §3.2) — `surface`, `chip`, `chipActive`, `popupHeader`, `popupBody`, `pin` (`#6B142E`), `pinGps` (`#C4A35A`), `ripple` (`rgba(196,163,90,0.35)`). `palette`, `fontFamily`, `authPalette`, `appPalette` sin tocar.
  - **Dependencias instaladas con `npx expo install` (NUNCA `npm i`):** `expo-location@~57.0.20` y `react-native-maps@1.27.2`. `package.json` + `package-lock.json` actualizados.
  - `app.json` — SOLO dos cambios (verificado con `git diff -- app.json`): (a) plugin `["expo-location", { "locationWhenInUsePermission": "El Gabinete Móvil usa tu ubicación para centrar el radar territorial y mostrar el municipio donde te encuentras." }]`; (b) `android.config.googleMaps.apiKey = "AIzaSyDK7sYtxqsifCz17bM2QMMv_ok93A900JQ"` (key entregada por el Humano). Cero `Info.plist`, `AndroidManifest.xml`, `.swift`/`.kt`/`.java`/`.pbxproj` tocados.
- **Arnés:** `npx tsc --noEmit` → **exit 0** (verde). `git diff -- app.json` muestra exactamente los dos cambios. Cero componentes creados. NO se ejecutó `npx expo start` (reservado al Humano).
- `spec/features/radar-home/task.md`: TASK-01 pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO `COMPLETED`).
- `progress/current-task.json` → `active_task: TASK-01`, `status: READY_FOR_REVIEW`, `harness_status.typecheck_passed: true`, `package_json_sin_cambios`/`app_json_sin_cambios: false` (esperado).
- **PARADA CONTROLADA (validación Humana):** el Humano debe (1) revisar el diff de `app.json` (plugin location + key Android), (2) hacer rebuild nativo (nuevo módulo `react-native-maps` + permiso de ubicación) y validar en dispositivo, (3) autorizar TASK-02 en nueva sesión. Fase 3 sigue bloqueada.

### 2026-10-06 — TASK-01 APROBADA por el Humano (Fase 2b)

- **Validación:** el Humano revisó y aprobó los cambios: diff de `app.json` (SOLO plugin `expo-location` con copy §2.11 + `android.config.googleMaps.apiKey`) y `package.json` (solo `expo-location@~57.0.20` + `react-native-maps@1.27.2`), y validó el rebuild nativo. TASK-01 marcada **`COMPLETED`**.
- `spec/features/radar-home/task.md`: TASK-01 `Status: COMPLETED` (pasos en `- [x]`).
- `progress/current-task.json` → `active_task: TASK-01` `status: COMPLETED`, `harness_status.typecheck_passed: true`.
- **PARADA CONTROLADA:** TASK-02 **NO** se inicia en esta sesión; la autoriza el Humano en nueva sesión. Fase 3 sigue bloqueada.

### 2026-10-06 — TASK-02 (Domain + Application de home) — READY_FOR_REVIEW (Trabajador)

- **Modo:** EJECUCIÓN de TASK-02 únicamente. Cero UI, cero infraestructura, cero consumidores, cero dependencias nuevas, cero `npx expo start`, cero commit.
- **Objetivo:** crear el kernel de `home` (domain + application) con firmas **verbatim** de `plan.md` §4–§5. Sin consumidores.
- **Hecho (10 archivos: 5 domain + 5 application, closures, sin comentarios):**
  - `src/features/home/domain/entities/GeoPosition.ts` (plan §4.1, verbatim).
  - `src/features/home/domain/entities/MunicipioRadar.ts` (plan §4.2, verbatim).
  - `src/features/home/domain/errors/RadarError.ts` (plan §4.3, verbatim: `RadarErrorKind`, `RadarError`, `RADAR_ERROR_MESSAGES`, `radarError()`).
  - `src/features/home/domain/ports/RadarMapRepository.ts` (plan §4.4, verbatim: `listMunicipios(): Promise<MunicipioRadar[]>`).
  - `src/features/home/domain/ports/LocationGateway.ts` (plan §4.5, verbatim: `getForegroundPermission`/`requestForegroundPermission`/`getCurrentPosition`/`reverseGeocodeMunicipio` + `LocationPermissionStatus`).
  - `src/features/home/application/types.ts` (plan §5.1, verbatim: `HomeUseCases`).
  - `src/features/home/application/loadRadarMap.ts` → `createLoadRadarMap` (plan §5.2): `return () => deps.radarMapRepository.listMunicipios();`, **deja subir `RadarError` sin `catch`**.
  - `src/features/home/application/getCurrentLocation.ts` → `createGetCurrentLocation` (plan §5.2): **sin prompt** — si `getForegroundPermission() !== "granted"` → `null`; si granted → `getCurrentPosition()`.
  - `src/features/home/application/requestLocationAccess.ts` → `createRequestLocationAccess` (plan §5.2): **con prompt** — `requestForegroundPermission()`; si `"granted"` → `getCurrentPosition()`; en otro caso → `null`.
  - `src/features/home/application/resolveDeviceMunicipio.ts` → `createResolveDeviceMunicipio` (plan §5.2): `(position) => deps.locationGateway.reverseGeocodeMunicipio(position)`.
- **Reglas de capa verificadas por grep:**
  - `domain/`: imports exclusivamente relativos (`../entities/...`); **cero** `react`, `react-native`, `expo-*`, `axios`, `@tanstack/*`, `react-native-maps`, `@/shared`, `@/app` ni capas hermanas.
  - `application/`: solo `../domain/...` + `./types`; **cero** React/Expo/Axios/Query/infrastructure.
  - Cero `any`, cero `TouchableOpacity`, cero `FlatList`, cero `expo-router`, cero barrels `index.ts`, cero emojis, cero comentarios.
- **Arnés:** `npx tsc --noEmit` → **exit 0** (verde). No se tocó `src/features/auth/**`, `src/features/app-shell/**`, `src/app/**`, `App.tsx`, `eslint.config.js`, `app.json`, `global.css` ni `tokens.ts`. `package.json`/`app.json` sin cambios. NO se ejecutó `npx expo start`. NO se hizo commit.
- `spec/features/radar-home/task.md`: TASK-02 pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO `COMPLETED`; lo cierra el Humano).
- `progress/current-task.json` → `active_task: TASK-02`, `status: READY_FOR_REVIEW`, `harness_status.typecheck_passed: true`, `bans_verificado`/`dip_verificado: true`, `package_json_sin_cambios`/`app_json_sin_cambios: true`.
- **PARADA CONTROLADA (validación Humana):** revisar los 10 archivos (firmas verbatim, capas limpias), autorizar TASK-03 (infrastructure + `compositionRoot` + `HomeProvider` + fences ESLint) en **nueva sesión**. **Cero TASK-03+ ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-06 — TASK-02 APROBADA por el Humano (Fase 2b)

- **Validación:** el Humano revisó y aprobó la TASK-02: los 10 archivos (5 domain + 5 application) con firmas **verbatim** de `plan.md` §4–§5, capas limpias (domain sin framework; application solo `../domain/...` + `./types`) y `npx tsc --noEmit` en verde. TASK-02 marcada **`COMPLETED`**.
- `spec/features/radar-home/task.md`: TASK-02 `Status: COMPLETED` (pasos en `- [x]`; nota de aprobación del Humano añadida).
- `progress/current-task.json` → `active_task: TASK-02` `status: COMPLETED`, `harness_status.typecheck_passed: true`; notas de aprobación registradas.
- **PARADA CONTROLADA:** TASK-03 (infrastructure + `compositionRoot` + `HomeProvider` + fences ESLint) **NO** se inicia en esta sesión; la autoriza el Humano en **nueva sesión**. **Cero TASK-03+ ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-06 — TASK-03 (Infrastructure + compositionRoot + HomeProvider + fences) — READY_FOR_REVIEW (Trabajador)

- **Modo:** EJECUCIÓN de TASK-03 únicamente. Cero componentes de mapa/UI (TASK-04+ no iniciada), cero dependencias nuevas, cero `npx expo start`, cero commit.
- **Objetivo:** adapters concretos de infraestructura + wiring DIP en `compositionRoot` + provider de presentation + fences ESLint, con firmas verbatim de `plan.md` §6–§7.
- **Creados (5 archivos):**
  - `src/features/home/infrastructure/dto.ts` (plan §6.1, verbatim): `MunicipioResumenDTO` espejo 1:1 del wire (cero `any`).
  - `src/features/home/infrastructure/AxiosRadarMapApi.ts` → `createAxiosRadarMapApi(): RadarMapRepository` (plan §6.2): `axiosClient.get<MunicipioResumenDTO[]>("/api/v1/dashboard/mapa-home")`; mapper 1:1 (`nombre: dto.municipio`, resto copia directa); `catch` → rethrow si ya es `RadarError`, si no `throw radarError("radar_unavailable")`. Sin logs de token/payload.
  - `src/features/home/infrastructure/ExpoLocationGateway.ts` → `createExpoLocationGateway(): LocationGateway` (plan §6.3): `getForegroundPermission`/`requestForegroundPermission` mapean `Location.PermissionStatus` (`GRANTED`→`"granted"`, `DENIED`→`"denied"`, resto→`"undetermined"`); `getCurrentPosition` (`getCurrentPositionAsync({})` → `{latitude, longitude}`; `try/catch`→`null`); `reverseGeocodeMunicipio` (`reverseGeocodeAsync` → primer resultado `city ?? subregion ?? region ?? null`; `try/catch`→`null`).
  - `src/features/home/presentation/HomeProvider.tsx` (plan §7): estado UI del radar (`selectedChip`, `popupMunicipio`, `cameraRequest`, `gpsPosition`, `deviceMunicipio`) + `nonce` incremental (`useRef`) + `requestInitialCamera` con guard `useRef` (una sola vez); `requestMyLocation` (prompt → chip `MI_UBICACION` + cámara GPS + `deviceMunicipio`); `selectMunicipioChip` (no toca popup); `openPopup`/`closePopup` (no tocan chips). Expone `HomeRadarState` (tipos verbatim) + `useCases` por props. Hook `useHomeRadar()`.
  - `src/features/home/presentation/useHomeRadar.ts` (plan §7): fachada única que reexpone estado + acciones + `useCases` (calco de `useAuth` 1.5b).
- **Editados (3 archivos):**
  - `src/app/compositionRoot.ts` (plan §6.4): añadido `createHomeUseCases()` (instancia `createAxiosRadarMapApi` + `createExpoLocationGateway` y arma los 4 use cases). `createAuthUseCases` **intacto** (diff: solo adiciones).
  - `App.tsx` (plan §6.6): `const homeUseCases = createHomeUseCases()` a nivel de módulo; `<HomeProvider useCases={homeUseCases}>` dentro de `<AuthProvider>` envolviendo `<RootNavigator />` + `<StatusBar style="light" />`. Fuentes, `QueryClient`, `StatusBar` y `global.css` intactos.
  - `eslint.config.js` (plan §6.5): `expo-location` + `react-native-maps` añadidos a los bans de `domain/**` y `application/**`; `expo-location` añadido al ban de `presentation/**` + `navigation/**` + `shared/ui/**` (`react-native-maps` permitido en presentation por ser UI). Sin paquete nuevo.
- **Reglas de capa verificadas por grep:**
  - **DIP:** único importador de `home/infrastructure` = `src/app/compositionRoot.ts`. `domain/`/`application/`/`presentation/` sin imports de infra.
  - `expo-location`/`react-native-maps` ausentes de `domain/` y `application/`; `expo-location` ausente de `presentation/`. `HomeProvider` recibe `HomeUseCases` por props (patrón `AuthProvider`).
  - Cero `any`, ceros `TouchableOpacity`, `FlatList`, `expo-router`, barrels `index.ts`, emojis ni comentarios.
- **Invariantes por diff:** `package.json`/`app.json`/`package-lock.json` **sin cambios**; `src/features/auth/**` y `src/features/app-shell/**` **diff vacío** (chrome congelado CA-07).
- **Arnés (verde):** `npx tsc --noEmit` → **exit 0**; `npx eslint .` → **exit 0** (cero errores/warnings). NO se ejecutó `npx expo start`.
- `spec/features/radar-home/task.md`: TASK-03 pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO `COMPLETED`).
- `progress/current-task.json` → `active_task: TASK-03`, `status: READY_FOR_REVIEW`, `harness_status.linter_passed`/`typecheck_passed: true`, `bans_verificado`/`dip_verificado: true`, `package_json_sin_cambios`/`app_json_sin_cambios: true`.
- **PARADA CONTROLADA (validación Humana):** revisar los 8 archivos (firmas verbatim, mapper 1:1, mapeo de `PermissionStatus`, DIP), y autorizar TASK-04 (componentes del radar) en **nueva sesión**. **Cero TASK-04+ ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-06 — TASK-03 APROBADA por el Humano (Fase 2b)

- **Validación:** el Humano revisó y aprobó la TASK-03: los 5 archivos nuevos (`dto.ts`, `AxiosRadarMapApi.ts`, `ExpoLocationGateway.ts`, `HomeProvider.tsx`, `useHomeRadar.ts`) y los 3 editados (`compositionRoot.ts`, `App.tsx`, `eslint.config.js`) con firmas **verbatim** de `plan.md` §6–§7; mapper 1:1 (`nombre: dto.municipio`); mapeo de `PermissionStatus` (`GRANTED`→`granted`, `DENIED`→`denied`, resto→`undetermined`); DIP verificado (único importador de `home/infrastructure` = `compositionRoot.ts`); `npx tsc --noEmit` y `npx eslint .` en verde. TASK-03 marcada **`COMPLETED`**.
- `spec/features/radar-home/task.md`: TASK-03 `Status: COMPLETED` (pasos en `- [x]`; nota de aprobación del Humano añadida).
- `progress/current-task.json` → `active_task: TASK-03` `status: COMPLETED`; `harness_status.linter_passed`/`typecheck_passed: true`, `bans_verificado`/`dip_verificado: true`, `package_json_sin_cambios`/`app_json_sin_cambios: true`; notas de aprobación registradas.
- **PARADA CONTROLADA:** TASK-04 (componentes del radar, plan §8 / spec §4.5) **NO** se inicia en esta sesión; la autoriza el Humano en **nueva sesión** con el prompt de ejecución preparado por el Orquestador. **Cero TASK-04+ ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-06 — TASK-04 (Componentes del radar, sin wire al navigator) — READY_FOR_REVIEW

- **Objetivo:** crear la UI completa del radar según `plan.md` §8 y `spec.md` §4.5 **sin** cablearla al navigator. `HomePlaceholderScreen` sigue montado; nadie importa `HomeScreen`. Cero dependencias nuevas, cero código nativo, cero `npx expo start`, cero commit.
- **Creados (8 archivos, `allowed_files` exactos):**
  - `src/features/home/presentation/format.ts` (plan §8.7): `mdpFormatter` hoisted en module scope (`Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 })`), `formatMdp(totalInversion)` → `\`${n} MDP\`` sobre `totalInversion / 1_000_000`, `toTitleCase(nombre)` (`toLocaleLowerCase("es-MX")` + `\p{L}` con flag `u`).
  - `RadarSearchBar.tsx` (plan §8.1 / spec §4.5): pill `radarPalette.surface`, radio 24, padding 12/16, `boxShadow`, `marginTop: -28`; `View` + `Text` **no interactiva** (cero `TextInput`/`Pressable`), lupa Ionicons `search` (20, `texto-suave`) + texto verbatim en 2 líneas (`OBRA O CAPACITACION` sin acento), `lato-bold` 13, mayúsculas; `accessibilityLabel="Buscar (disponible en la siguiente fase)"`.
  - `RadarChipRow.tsx` (plan §8.2): `ScrollView` horizontal sin scrollbar; chip fijo «MI UBICACIÓN» primero (Ionicons `location` 14 blanco); chips del array en orden con `toTitleCase`; activo = `radarPalette.chipActive` + texto blanco bold, inactivo = `radarPalette.chip` + `palette.texto`; `Pressable` con `pressed` → opacity 0.8; `accessibilityRole="button"`.
  - `DeviceMunicipioLabel.tsx` (plan §8.3): pill blanca (radio 20, padding 10/14, `boxShadow`), pin Ionicons `location` 18 `radarPalette.pin` + `lato-bold` 15: `deviceMunicipio ?? "—"`.
  - `RadarMap.tsx` (plan §8.4): `MapView` con `ref`, `flex: 1`, provider por defecto, `showsUserLocation={false}`, `showsCompass={false}`, `toolbarEnabled={false}`; `Marker` nativo `pinColor={radarPalette.pin}` por municipio con lat/lng no nulos (`key=nombre`, `onPress → onMarkerPress(nombre)`); `Marker` GPS `pinGps` `zIndex={1000}` sin `onPress`; efecto de cámara sobre `cameraRequest` (`"fit"`→`fitToCoordinates` con edgePadding 120/60/120/60, `"gps"`/`"municipio"`→`animateToRegion` delta 0.12 duración 600, `"municipio"` sin coords → no-op); `useImperativeHandle` expone `getPointForCoordinate(position)` vía `pointForCoordinate` con `try/catch → null`. Type guard `hasCoordinates` evita aserciones.
  - `RadarRipple.tsx` (plan §8.5): overlay `StyleSheet.absoluteFill` con `pointerEvents="none"`; 3 `Animated.View` Reanimated de tamaños 48/88/128, borde `radarPalette.ripple`, `scale` 0.3→1 y `opacity` 0.9→0, `withDelay` 0/220/440 + `withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.ease) }), -1, false)`. Solo `transform`/`opacity`.
  - `MunicipioCallout.tsx` (plan §8.6): cabecera `radarPalette.popupHeader` con `location-outline` + nombre del DTO en mayúsculas (`lato-bold` 20) + `X` Ionicons `close` (`hitSlop` 12, `accessibilityLabel="Cerrar"`); cuerpo `radarPalette.popupBody` con 3 columnas flex 1 y hairlines (`StyleSheet.hairlineWidth`, `rgba(0,0,0,0.12)`): inversión (`formatMdp`), obras con desglose `Obras (X en proceso, Y concluidas)`, capacitaciones; cola triangular abajo-centro (`rotate 45deg`, fondo `popupBody`, 16×16, `marginBottom: -8`); `Ver más` outline guinda **no-op** tipado (`accessibilityLabel="Ver más (disponible en la siguiente fase)"`). Recibe `municipio: MunicipioRadar`.
  - `HomeScreen.tsx` (plan §8.8): `const { useCases, ...estado } = useHomeRadar()` + `useQuery<MunicipioRadar[], RadarError>({ queryKey: ["radar","mapa-home"], queryFn: () => useCases.loadRadarMap(), staleTime: 60_000 })`; layout `View flex:1` fondo `appPalette.crema` → `RadarMap` flex 1 → overlay absoluto superior (columna `gap: 10`, `paddingHorizontal: 16`) con `RadarSearchBar` + `RadarChipRow` (wrapper `marginHorizontal: -16` para scroll full-bleed) + `DeviceMunicipioLabel` + `MunicipioCallout` si `popupMunicipio` (lookup por nombre en `data`) → `RadarRipple` si popup y `ripplePoint` no nulo; `requestInitialCamera(data.length > 0)` al llegar `data` (guard del provider); `isLoading`→`ActivityIndicator` guinda; `isError`→`Text error?.message ?? RADAR_ERROR_MESSAGES.radar_unavailable`; `data` vacío→«Sin municipios con obras o capacitaciones.». `openPopup` resuelve el punto de pantalla vía ref del mapa; si es `null`, el popup abre igual sin anillos.
- **Reglas de capa verificadas por grep:** `presentation` importa `react-native-maps` (solo `RadarMap.tsx`); `expo-location` **ausente** de `presentation`; use cases **solo** vía `useHomeRadar()` (nunca por props al screen); cero imports de `infrastructure` ni `@/shared/infrastructure/**`; estilos inline JS con `radarPalette`/`appPalette`/`palette`/`fontFamily` (`StyleSheet` solo para `absoluteFill`/hairline); solo `Pressable`; ternarios/`!!` (cero `&&` falsy); cero `any`/`TouchableOpacity`/`FlatList`/`expo-router`/`className`/emojis/comentarios/barrels.
- **Invariantes por diff:** `package.json`/`app.json` **sin cambios**; `src/features/auth/**`, `src/features/app-shell/**` y `src/app/navigation/**` **diff vacío**; `HomeProvider.tsx`/`useHomeRadar.ts`/`compositionRoot.ts`/`App.tsx` intactos; `HomePlaceholderScreen.tsx` sigue montado y nadie importa `HomeScreen`.
- **Arnés (verde):** `npx tsc --noEmit` → **exit 0**; `npx eslint .` → **exit 0** (cero errores/warnings). NO se ejecutó `npx expo start`.
- **Desviaciones menores documentadas:** `format.ts` como módulo propio (plan lo permitía); `MunicipioCallout` compuesto dentro de la columna overlay tras `DeviceMunicipioLabel` para quedar ~16 px bajo la etiqueta; wrapper `marginHorizontal: -16` para el scroll full-bleed de chips.
- `spec/features/radar-home/task.md`: TASK-04 pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO `COMPLETED`).
- `progress/current-task.json` → `active_task: TASK-04`, `status: READY_FOR_REVIEW`, `harness_status.linter_passed`/`typecheck_passed: true`.
- **PARADA CONTROLADA (validación Humana):** compilar y validar el radar en dispositivo (`npx expo run:ios` / `run:android` o `expo start`), revisar CA-01…07 y autorizar TASK-05 (wire navigator + borrado del placeholder) en **nueva sesión**. **Cero TASK-05+ ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-06 — TASK-04 APROBADA por el Humano (Fase 2b)

- **Validación:** el Humano revisó y aprobó la TASK-04. Confirmó el comportamiento esperado en dispositivo físico **Android e iOS**: tras login la app se ve **idéntica** a la baseline, porque `HomeScreen` todavía no está cableada al navigator y el placeholder sigue montado (el cambio visual corresponde a TASK-05). El único aviso observado en iOS fue el permiso de **«red local» del dev server de Metro/Expo** (no proviene del código del radar; `expo-location` no se solicita porque el mapa no se monta). TASK-04 marcada **`COMPLETED`**.
- `spec/features/radar-home/task.md`: TASK-04 `Status: COMPLETED` (pasos en `- [x]`; nota de aprobación del Humano añadida).
- `progress/current-task.json` → `active_task: TASK-04` `status: COMPLETED`; `harness_status.linter_passed`/`typecheck_passed: true`, `bans_verificado`/`dip_verificado: true`, `package_json_sin_cambios`/`app_json_sin_cambios: true`; notas de aprobación registradas.
- **PARADA CONTROLADA:** TASK-05 (wire navigator + borrado del placeholder, plan §9) **NO** se inicia en esta sesión; la autoriza el Humano en **nueva sesión** con el prompt de ejecución preparado por el Orquestador. **Cero TASK-05+ ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-07 — TASK-05 (Wire navigator + borrado del placeholder) — COMPLETED (con nota honesta)

- **Objetivo:** montar `HomeScreen` (radar) como pantalla autenticada y eliminar el placeholder, sin tocar el chrome 2a (CA-07). Cero dependencias nuevas, cero código nativo, cero `npx expo start`, cero commit, cero TASK-06+.
- **Editados (2 archivos):**
  - `src/app/navigation/types.ts` (plan §9): `AppStackParamList` pasa de `{ HomePlaceholder: undefined }` a `{ Home: undefined }`. `AuthStackParamList` y `RootStackParamList` intactos.
  - `src/app/navigation/RootNavigator.tsx` (plan §9): import cambiado a `import { HomeScreen } from "@/features/home/presentation/HomeScreen";` y `<AppStack.Screen name="HomePlaceholder" component={HomePlaceholderScreen} />` reemplazado por `<AppStack.Screen name="Home" component={HomeScreen} />`. `AppShell`, `<NavigationContainer key={status}>`, `appTheme`, `AuthStackNavigator` y el resto del AppStack **intactos**.
- **Borrado (1 archivo):** `git rm src/features/home/presentation/HomePlaceholderScreen.tsx` (placeholder eliminado del repo).
- **Verificaciones por grep:**
  - `HomeScreen` importado **únicamente** por `src/app/navigation/RootNavigator.tsx`; el resto de referencias son su propia definición.
  - `HomePlaceholder` **ausente** de `src/` y de `App.tsx`.
  - `git diff -- src/features/app-shell src/features/auth` → **vacío** (0 líneas; chrome/auth congelados, CA-07).
  - `package.json`/`app.json`/`global.css`/`src/shared/theme/tokens.ts`/`eslint.config.js`/`src/app/compositionRoot.ts`/`App.tsx` → **sin cambios**.
  - Cero `any`/`TouchableOpacity`/`FlatList`/`expo-router`/`auth-*` fuera de auth/barrels/comentarios/emojis en lo tocado (los archivos nav solo cambian identificadores de ruta y componente).
- **Arnés (verde):** `npx tsc --noEmit` → **exit 0**; `npx eslint .` → **exit 0** (cero errores/warnings). NO se ejecutó `npx expo start`.
- **Validación física del Humano (Android/iOS):** app compilada y radar visible dentro del chrome 2a (pines, popup KPI, ripple, chips y centrado por chip funcionan; iOS usa MapKit nativo). El crash de **Android** (`API key not found` + `addViewAt`) y el permiso de **iOS** (`NSLocation*UsageDescription`) eran de **build/nativo**, no de código; los resolvió el Humano con `npx expo prebuild` + key Android exclusiva (package+SHA1). `app.json` ya declaraba el plugin `expo-location` y `android.config.googleMaps.apiKey`.
- **Decisión del Humano (2026-10-07):** dar TASK-05 por **COMPLETADA con nota honesta**, sin tocar código. Sus 4 pasos se ejecutaron correctamente; la validación física detectó **3 defectos visuales en componentes de TASK-04**, que se atienden en **TASK-05R** (nueva task que creará el Orquestador) antes del arnés: (1) `RadarSearchBar` recortada por el contenedor de pantalla al solapar la franja (`marginTop: -28`); (2) `RadarRipple` se desplaza al panear el mapa con el popup abierto; (3) `MunicipioCallout` tapa el pin / posición no óptima.
- `spec/features/radar-home/task.md`: TASK-05 pasos `- [x]` / `Status: COMPLETED` + nota honesta (3 defectos → TASK-05R).
- `progress/current-task.json` → `active_task: TASK-05`, `status: COMPLETED`; `harness_status.linter_passed`/`typecheck_passed: true`; `bundling_passed_android`/`ios: APROBADO por el Humano (2026-10-07)`; `blockers_or_errors` con los 3 defectos diferidos a TASK-05R.
- **PARADA CONTROLADA:** TASK-06 (arnés) **NO** se inicia; queda bloqueada hasta que el Orquestador cree **TASK-05R** y el Humano la autorice. **Cero TASK-05R+/TASK-06 ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-07 — Orquestación TASK-05R (rework visual post-QA) — SDD actualizado; CERO código RN

- **Contexto:** TASK-05 cerrada por el Humano como COMPLETED con nota honesta (2026-10-07). El Humano eligió la **opción C** del Orquestador: cerrar TASK-05 (sus pasos eran correctos) y tratar los 3 defectos visuales de componentes de TASK-04 en una task de rework planificada **antes** del arnés. TASK-06 sigue bloqueada.
- **Enmiendas SDD (Orquestador, cero código de producto):**
  - `spec/features/radar-home/spec.md` §6: desviación **8** (pill de búsqueda sin solape con la franja guinda: el contenedor de pantalla del native-stack recorta el overflow; mantener el solape exigiría tocar el chrome 2a congelado) y desviación **9** (tap en pin → cámara con offset al norte para dejar el pin en el tercio inferior + anillos del ripple re-anclados al pin en cada `onRegionChangeComplete`).
  - `spec/features/radar-home/plan.md`: §8.1 (`marginTop: 12` congelado, sustituye el `-28` original), §8.4 (nueva prop `onRegionChangeComplete?: () => void` + método de handle `focusOnPosition(position)` con constantes verbatim `FOCUS_LATITUDE_DELTA 0.09` / `FOCUS_LONGITUDE_DELTA 0.09` / `FOCUS_CENTER_OFFSET 0.025` / 600 ms), §8.5 (re-anclaje del ripple — **sustituye** la "desviación aceptada" original; `RadarRipple` no cambia), §8.8 (flujo `handleMarkerPress`: `openPopup` → `ripplePoint null` → `focusOnPosition` → recompute vía `onRegionChangeComplete`).
  - `spec/features/radar-home/task.md`: insertada **TASK-05R — Rework visual post-QA físico** entre TASK-05 y TASK-06 (FIX-1 pill, FIX-2 re-anclaje ripple, FIX-3 offset cámara; `allowed_files`: `RadarSearchBar.tsx`, `RadarMap.tsx`, `HomeScreen.tsx`, task.md, progress/*). Status **TODO**.
- **Sin cambios:** `RadarRipple.tsx`, `MunicipioCallout.tsx`, auth, `app-shell`, `navigation`, `HomeProvider`, infra, constitución. Cero dependencias nuevas. Cero `npx expo start`.
- `progress/current-task.json` → `active_task: TASK-05R`, `status: TODO` (no IN_PROGRESS). PARADA CONTROLADA.
- **SIGUIENTE:** el Humano autoriza TASK-05R en **nueva sesión** con el Worker (DeepSeek) usando el prompt de ejecución del Orquestador. Tras ejecutarla, validación física Android + iOS (checklist en task.md) → TASK-05R COMPLETED → TASK-06 en nueva sesión. Fase 3 sigue bloqueada.

### 2026-10-07 — TASK-05R (Rework visual post-QA) — READY_FOR_REVIEW

- **Objetivo:** corregir los 3 defectos visuales del QA físico, solo en 3 archivos de `presentation`, sin dependencias nuevas ni cambios fuera del `allowed_files`. Cero `npx expo start`, cero commit, cero TASK-06+.
- **FIX-1 (pill íntegra) — `RadarSearchBar.tsx`:** `marginTop: -28` → `marginTop: 12` (spec §6.8, plan §8.1). Cero otro cambio en el archivo.
- **FIX-2 (re-anclaje del ripple):**
  - `RadarMap.tsx`: nueva prop `onRegionChangeComplete?: () => void` reenviada al `MapView`.
  - `HomeScreen.tsx`: extraído el recompute a `recomputeRipple` (`useCallback`, deps `[data, popupMunicipio]`): `popupMunicipio === null` → `setRipplePoint(null)`; municipio sin coords o `map === null` → `setRipplePoint(null)`; si no `getPointForCoordinate` → `setRipplePoint`. Conectada como `onRegionChangeComplete` al `RadarMap`.
- **FIX-3 (offset de cámara al tap de pin):**
  - `RadarMap.tsx`: `RadarMapHandle` añade `focusOnPosition(position: GeoPosition): void` con constantes verbatim a module scope `FOCUS_LATITUDE_DELTA = 0.09`, `FOCUS_LONGITUDE_DELTA = 0.09`, `FOCUS_CENTER_OFFSET = 0.025`, duración `600`; centro `{ latitude: position.latitude + FOCUS_CENTER_OFFSET, longitude: position.longitude, ... }`.
  - `HomeScreen.tsx` `handleMarkerPress`: `openPopup(nombre)` → `setRipplePoint(null)` → si hay coords `map.focusOnPosition(position)`; **eliminado** el `getPointForCoordinate` inmediato del press (el punto llega vía `onRegionChangeComplete` tras la animación). Guard de municipio sin coords intacto (solo `openPopup`, ripple `null`).
- **Sin cambios (diff vacío):** `RadarRipple.tsx`, `MunicipioCallout.tsx`, auth, `app-shell`, `navigation`, `HomeProvider`, `useHomeRadar`, infra, `compositionRoot`, `App.tsx`, `package.json`, `app.json`, `eslint.config.js`.
- **Arnés (verde):** `npx tsc --noEmit` → **exit 0**; `npx eslint .` → **exit 0** (cero errores/warnings). NO se ejecutó `npx expo start`.
- **Desviaciones:** ninguna. `FOCUS_CENTER_OFFSET` queda en `0.025` (plan §8.4); ajuste fino solo si el Humano lo pide tras validar. Documentado en las notas de implementación de `task.md`.
- `spec/features/radar-home/task.md`: TASK-05R pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO `COMPLETED`).
- `progress/current-task.json` → `active_task: TASK-05R`, `status: READY_FOR_REVIEW`; `harness_status.last_run` actualizado; `linter_passed`/`typecheck_passed: true`.
- **PARADA CONTROLADA (validación Humana):** comprobar en dispositivos físicos Android + iOS el checklist de `task.md` (pill íntegra; ripple pegado al pin al panear; popup nunca tapa el pin; etiqueta del dispositivo resuelve tras permiso; chips siguen centrando; drawer/logout intactos) → TASK-05R COMPLETED → TASK-06 en nueva sesión. **Cero TASK-06 ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-07 — TASK-05R APROBADA por el Humano (Fase 2b)

- **Validación:** el Tester Visual Humano validó en **dispositivos físicos Android + iOS** y confirmó que las 3 correcciones quedaron aplicadas: la **barra de búsqueda** se ve íntegra, el **modal/card KPI** está correcto y las **ondas expansivas del ripple** también. Todo quedó como debía. TASK-05R marcada **`COMPLETED`**.
- `spec/features/radar-home/task.md`: TASK-05R `Status: COMPLETED` + nota de aprobación del Humano (`Validación: APROBADA`); pasos en `- [x]`.
- `progress/current-task.json` → `active_task: TASK-05R`, `status: COMPLETED`; `validation`/`last_run`/`blockers_or_errors`/`agent_notes` actualizados con la aprobación; `harness_status.linter_passed`/`typecheck_passed: true`.
- **PARADA CONTROLADA:** TASK-06 (arnés) **NO** se inicia en esta sesión; el Humano la autoriza en **nueva sesión**. **Cero TASK-06 ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-12 — Orquestación TASK-05G (homologación Google Maps iOS) — SDD actualizado; CERO código RN de producto

- **Contexto:** TASK-05R COMPLETED y validada en físico (2026-10-07). El Humano pidió homologar el mapa a Google Maps también en iOS (antes: Apple MapKit) para tener la misma interfaz de mapa en ambas plataformas, y lo confirmó como task nueva **TASK-05G** antes del arnés TASK-06.
- **Mecanismo de keys (decisión del Humano 2026-10-12):** cero hardcodeo. `.env` (gitignored) → `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS` (entregada por el Humano y colocada por el Orquestador en esta sesión; el valor NO va en prompts ni archivos trackeados) → `app.config.js` la inyecta dinámicamente (plugin `react-native-maps` `iosGoogleMapsApiKey`), mismo patrón que la key Android (`EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID` → `android.config.googleMaps.apiKey`). `.env.example` actualizado (placeholders iOS/Android con prefijo `EXPO_PUBLIC_`).
- **Enmiendas SDD (Orquestador):**
  - `spec/constitution/tech-stack.md` §2.3: proveedor homologado `PROVIDER_GOOGLE` en ambas plataformas; keys solo vía `.env` + `app.config.js` (prohibido hardcodear); MapKit documentado como fallback sin key iOS.
  - `spec/features/radar-home/spec.md`: §4.2 (Google Maps en ambas plataformas), §6.10 (desviación de homologación; el mockup usa cartografía estilo Google → mejora CA-01), CA-09 (`app.json` solo plugin `expo-location`; keys vía `app.config.js`/`.env`).
  - `spec/features/radar-home/plan.md` §8.4: `provider={PROVIDER_GOOGLE}` + mecanismo de keys.
  - `spec/features/radar-home/task.md`: insertada **TASK-05G** (app.config.js + `RadarMap.tsx` provider; gate: key ya en `.env`; `app.json`/`package.json` sin cambios) y paso de diff de TASK-06 actualizado (keys inyectadas, grep `AIza` sobre el tree).
- **Sin cambios:** `RadarRipple.tsx`, `MunicipioCallout.tsx`, auth, `app-shell`, `navigation`, infra, `App.tsx`. Cero dependencias nuevas. Cero `npx expo start`.
- `progress/current-task.json` → `active_task: TASK-05G`, `status: TODO` (no IN_PROGRESS). PARADA CONTROLADA.
- **SIGUIENTE:** el Humano autoriza TASK-05G en **nueva sesión** con el Worker (DeepSeek) y el prompt del Orquestador. Tras ejecutarla: `npx expo prebuild` + `run:ios`/`run:android` (Humano) y validación lado a lado → TASK-05G COMPLETED → TASK-06 (arnés) en nueva sesión. Fase 3 sigue bloqueada.

### 2026-10-12 — TASK-05G (Homologación Google Maps en iOS) — READY_FOR_REVIEW (Trabajador)

- **Objetivo:** homologar el mapa a Google Maps también en iOS. Solo 2 archivos de product code, cero dependencias nuevas, cero keys hardcodeadas, cero `npx expo start`/`prebuild`/`run:*`, cero commit.
- **Editados (2 archivos):**
  - `app.config.js`: añadida la clave `plugins` al final del objeto retornado — `[...(config.plugins || []), ["react-native-maps", { iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS }]]`. La inyección Android existente (`android.config.googleMaps.apiKey` desde `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID`) quedó **intacta**. `app.json` sin tocar (inyección dinámica vía `.env`).
  - `src/features/home/presentation/RadarMap.tsx`: import cambiado a `import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";` y `provider={PROVIDER_GOOGLE}` añadido al `MapView`. Props, `RadarMapHandle` (`getPointForCoordinate`/`focusOnPosition`), markers, efecto de cámara y `onRegionChangeComplete` **intactos**.
- **Verificaciones:**
  - `git diff -- app.json package.json` → **vacío** (exit 0).
  - `git status` → `.env` **no aparece** (ignorado por `.gitignore:73`); solo `app.config.js`, `RadarMap.tsx` y el preexistente `Instructions/fase_2b/fase_2b.md`.
  - `git grep "AIza"` → cero coincidencias **nuevas** en `app.config.js`/`RadarMap.tsx` (la key iOS se lee de `process.env`, nunca se escribe).
  - Cero `any`/`TouchableOpacity`/`FlatList`/`className`/comentarios nuevos/emojis en lo tocado.
- **Arnés (verde):** `npx tsc --noEmit` → **exit 0**; `npx eslint .` → **exit 0** (cero errores/warnings). NO se ejecutó `npx expo start`.
- `spec/features/radar-home/task.md`: TASK-05G pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO `COMPLETED`; el rebuild y la validación física son del Humano). Notas de implementación añadidas (sin desviaciones).
- `progress/current-task.json` → `active_task: TASK-05G`, `status: READY_FOR_REVIEW`; `harness_status.last_run`/`validation`/`blockers_or_errors` actualizados; `linter_passed`/`typecheck_passed`/`package_json_sin_cambios`/`app_json_sin_cambios: true`.
- **PARADA CONTROLADA (validación Humana):** `npx expo prebuild` + `npx expo run:ios --device` (instala pods de Google Maps) y `npx expo run:android --device`; checklist lado a lado (misma cartografía Google en iOS y Android, pines guinda/dorado, chips centran, tap de pin → offset + popup + ripple, etiqueta del dispositivo, drawer/logout) → TASK-05G COMPLETED → TASK-06 (arnés) en nueva sesión. **Cero TASK-06 ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-12 — TASK-05G QA físico iOS OK / regresión Android detectada y corregida — READY_FOR_REVIEW (Trabajador)

- **QA físico del Humano:** iOS validado — Google Maps se aplicó correctamente (homologación `PROVIDER_GOOGLE` + key iOS desde `.env` vía `app.config.js`). **Android falló** con `addViewAt: ... API key not found. Check that <meta-data android:name="com.google.android.geo.API_KEY" .../> is in the <application> element of AndroidManifest.xml`.
- **Diagnóstico (no fue borrado manual):** `git diff -- android/app/src/main/AndroidManifest.xml` mostró que el Human's `npx expo prebuild` **eliminó** la línea `<meta-data android:name="com.google.android.geo.API_KEY" android:value="AIza…"/>`. Causa raíz en el plugin de `react-native-maps@1.27.2` (`node_modules/react-native-maps/plugin/build/android.js:47-52`): si no recibe la prop `androidGoogleMapsApiKey`, ejecuta `removeMetaDataItemFromMainApplication(..., 'com.google.android.geo.API_KEY')`. Al añadir el plugin solo con `iosGoogleMapsApiKey` (TASK-05G inicial), el mod de Android borró la key que exponía `android.config.googleMaps.apiKey`. **Ningún archivo nativo fue editado a mano** (prohibido por AGENTS.md/task).
- **Fix (solo config, archivo permitido `app.config.js`):** el plugin `react-native-maps` recibe ahora **ambas** props — `iosGoogleMapsApiKey` y `androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID` — de modo que re-inyecta el meta-data de Android en el próximo `prebuild`. Se conserva además `android.config.googleMaps.apiKey` (misma key). Verificado con `node --env-file=.env` que ambas props resuelven a valor no vacío (sin imprimir el valor).
- **Invariantes:** `app.json`/`package.json` **sin cambios** (siguen vacíos por diff); `.env` ignorado; cero keys hardcodeadas en `app.config.js`/`RadarMap.tsx`. El `AndroidManifest.xml` y los archivos `ios/*` modificados en el working tree son producto del `prebuild` del Humano (pods de Google Maps + mods), no ediciones del agente.
- **Arnés (verde):** `npx tsc --noEmit` → **exit 0**; `npx eslint .` → **exit 0**. NO se ejecutó `npx expo start/prebuild/run`.
- `spec/features/radar-home/task.md`: TASK-05G sigue `Status: READY_FOR_REVIEW` (NO `COMPLETED`); añadida la sección «Corrección post-QA físico — regresión Android» con causa raíz y fix.
- `progress/current-task.json` → `active_task: TASK-05G`, `status: READY_FOR_REVIEW`; `description`/`validation`/`last_run`/`bundling_passed_android`/`bundling_passed_ios`/`blockers_or_errors` actualizados con la regresión y el fix.
- **PARADA CONTROLADA (validación Humana):** re-ejecutar `npx expo prebuild --platform android` + `npx expo run:android --device` y validar Android (Google Maps con la key re-inyectada) → TASK-05G COMPLETED → TASK-06 (arnés) en nueva sesión. **Cero TASK-06 ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-12 — TASK-05G APROBADA por el Humano (Fase 2b)

- **Validación:** el Tester Visual Humano validó en **dispositivos físicos Android + iOS** y confirmó que Google Maps funciona correctamente en **ambas plataformas** tras el fix de la regresión Android. iOS: Google Maps aplicado correctamente. Android: tras re-ejecutar `npx expo prebuild --platform android` + `npx expo run:android --device`, la key se re-inyectó (gracias a `androidGoogleMapsApiKey` pasado al plugin `react-native-maps` en `app.config.js`) y el mapa Google funcionó. TASK-05G marcada **`COMPLETED`**.
- `spec/features/radar-home/task.md`: TASK-05G `Status: COMPLETED` + nota de aprobación del Humano (`Validación: APROBADA`); pasos en `- [x]`.
- `progress/current-task.json` → `active_task: TASK-05G`, `status: COMPLETED`; `validation`/`last_run`/`bundling_passed_android`/`bundling_passed_ios`/`blockers_or_errors` actualizados con la aprobación; `harness_status.linter_passed`/`typecheck_passed`/`package_json_sin_cambios`/`app_json_sin_cambios: true`.
- **PARADA CONTROLADA:** TASK-06 (arnés) **NO** se inicia en esta sesión; el Humano la autoriza en **nueva sesión**. **Cero TASK-06 ejecutada.** Fase 3 sigue bloqueada.

### 2026-10-12 — TASK-06 (Arnés de control, Fase 2b) — READY_FOR_REVIEW (Trabajador)

- **Objetivo:** auditoría + registro de CA-08/CA-09/CA-10. **Cero cambios de código de producto** (solo `task.md`, `current-task.json`, `history.md`). Cero dependencias nuevas, cero `npx expo start/prebuild/run`, cero commit, cero Fase 3.
- **Arnés (verde):** `npx tsc --noEmit` → **exit 0**; `npx eslint .` → **exit 0** (cero errores, cero warnings).
- **Bans (git grep `src/**/*.ts(x)` + `App.tsx`):** `any` **0**, `TouchableOpacity` **0**, `FlatList` **0**, `expo-router` **0**. `auth-*`/`authPalette` **0** en `src/features/home/**` y `App.tsx` (y `className` **0** en home).
- **DIP (verde):** único importador de `home/infrastructure` = `src/app/compositionRoot.ts:18-19`; `react-native-maps` solo en `src/features/home/presentation/RadarMap.tsx:2`; `expo-location` solo en `src/features/home/infrastructure/ExpoLocationGateway.ts:1`; cero en `domain`/`application`.
- **Contrato (verde):** `/api/v1/dashboard/mapa-home` aparece **una sola vez** en código = `src/features/home/infrastructure/AxiosRadarMapApi.ts:34`; `infrastructure/dto.ts` es **espejo 1:1** de spec §4.6 (`municipio`, `totalObras`, `totalCursos`, `totalInversion`, `obrasFinalizadas`, `obrasEnProceso`, `latitude|null`, `longitude|null`); cero `any` en el mapper.
- **Chrome congelado (verde):** `git diff` de `src/features/app-shell/**` y `src/features/auth/**` **VACÍO** (worktree y delta vs baseline 2b `333b62f`) → CA-07 intacta.
- **Hallazgo 1 — deps extra ajenas al radar (commit humano `68cb002`):** `git diff HEAD -- package.json` y `-- app.json` son **VACÍOS** (el working tree está limpio porque todo está commiteado por el Humano). Contra el baseline 2b (`333b62f..HEAD`), el radar (TASK-01) añadió **solo** `expo-location` + `react-native-maps` y `app.json` **solo** el plugin `expo-location`; pero el commit humano previo `68cb002` ("Inject google maps api key android") añadió deps extra `dotenv`, `lightningcss`, `react-native-worklets`, `react-native-worklets-core`, `patch-package`, script `postinstall` y subió `react-native-reanimated` `4.5.1 → ^4.7.1` (build nativo de Google Maps). **CA-09 con hallazgo**; no corregido (fuera de `allowed_files`).
- **Hallazgo 2 — `auth-*` fuera de `src/features/auth/**` (preexistente Fase 1.5a/1.5b):** coincidencias en `src/shared/ui/TextField.tsx`, `src/shared/ui/BiometricMethodCard.tsx`, `src/shared/ui/AuthScaffold.tsx`, `src/shared/ui/GoldButton.tsx` y `src/shared/theme/tokens.ts`. No introducidas por el radar; primitivas del flujo auth. No se toca `shared/ui`/auth (congelado).
- **Hallazgo 3 — `git grep "AIza"` (todas preexistentes, no introducidas por el radar):** `android/app/src/main/AndroidManifest.xml:19`, `ios/GabineteMvil/AppDelegate.swift:38`, `ios/GabineteMvil/Info.plist:37` (nativos: **no editados**, prohibido), `progress/history.md:552` (archivo permitido: la key `AIzaSy…900JQ` **no se borró**, se reporta como hallazgo) y `Instructions/fase_2b/fase_2b.md:38`. Cero keys en `app.config.js`/`RadarMap.tsx` (leídas de `process.env`).
- **Nota de working tree:** limpio respecto a HEAD salvo `Instructions/fase_2b/fase_2b.md` **no commiteado** (añade el prompt de TASK-06), fuera de `allowed_files` y ajeno a esta auditoría.
- `spec/features/radar-home/task.md`: TASK-06 pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO `COMPLETED`); añadida sección de evidencia literal y hallazgos.
- `progress/current-task.json` → `active_task: TASK-06`, `status: READY_FOR_REVIEW`; `harness_status` con linter/typecheck/bans/DIP/contrato/chrome verificados y los hallazgos (deps extra, `auth-*`, AIza) registrados.
- **Resultado CA:** CA-08 (arnés/bans/DIP) y CA-10 (contrato) **listos**; CA-09 **con hallazgo** (deps extra de commit humano, no del radar). **PARADA CONTROLADA:** el **Revisor** re-ejecuta el arnés y adjudica los hallazgos; el **Humano** cierra. TASK-06 NO `COMPLETED`. Fase 3 sigue bloqueada.

### 2026-10-12 — TASK-05G COMPLETED + TASK-06 (Arnés) ejecutada — hallazgos resueltos por el Humano

- **TASK-05G (Homologación Google Maps iOS):** COMPLETED y validada por el Humano (2026-10-12). El Worker cableó `app.config.js` (plugin `react-native-maps` con `iosGoogleMapsApiKey` desde `.env`, conservando la inyección Android) y `RadarMap.tsx` (`provider={PROVIDER_GOOGLE}`). El Humano hizo `npx expo prebuild` + `run:ios`/`run:android` y validó lado a lado: misma cartografía Google en ambas plataformas, pines, offset, popup, ripple, etiqueta dispositivo y drawer/logout intactos. `app.json`/`package.json` sin cambios por la feature; cero keys hardcodeadas (key iOS vive solo en `.env`, gitignored).
- **TASK-06 (Arnés) ejecutada por el Worker:** `npx tsc --noEmit` exit 0; `npx eslint .` exit 0 (cero warnings); bans (`any`/`TouchableOpacity`/`FlatList`/`expo-router`) = 0; `auth-*` = 0 en `src/features/home/**`; DIP verificado (único importador de `home/infrastructure` = `compositionRoot.ts`; `react-native-maps` solo en `RadarMap.tsx`; `expo-location` solo en `ExpoLocationGateway.ts`); contrato `/api/v1/dashboard/mapa-home` único en `AxiosRadarMapApi.ts:34` + DTO espejo 1:1; chrome/auth diff vacío. Reportó 4 hallazgos SIN corregir y dejó TASK-06 `READY_FOR_REVIEW`.
- **Resolución de hallazgos (Humano + Orquestador, 2026-10-12):**
  1. **Deps extra del commit `68cb002` → ACEPTADAS con whitelist** (CA-09 enmendado en spec.md): reanimated `^4.7.1` + worklets + worklets-core (peer de pods Google Maps iOS), patch-package + postinstall + patch `expo-modules-jsi` (fix build iOS), lightningcss directa (redundante), dotenv (sin uso; candidata a limpieza futura).
  2. **`auth-*` en `src/shared/ui/*` → ACEPTABLE (congelado 1.5b).** Falso positivo del paso de arnés (scope corregido: el ban aplica al código nuevo de `src/features/home/**`).
  3. **Keys `AIza` en trackeados (AndroidManifest, AppDelegate, Info.plist, `history.md:552`, `Instructions/fase_2b/fase_2b.md`) → task de higiene `security-keys` POST-2B, antes de Fase 3:** rotar/revocar keys (la `AIzaSy…900JQ` de history.md:552 está superseded), restringir iOS por bundle id, limpiar history/Instructions, decidir gitignore de `android/`/`ios/`.
  4. Comparación de deps contra baseline `333b62f` (no `HEAD`; el tree está commiteado).
- **Enmiendas aplicadas por el Orquestador:** `spec/features/radar-home/spec.md` (CA-09 whitelist), `spec/features/radar-home/task.md` (resolución de hallazgos asentada en TASK-06; scope del ban `auth-*` aclarado).
- `progress/current-task.json` → `active_task: TASK-06`, `status: READY_FOR_REVIEW` con hallazgos resueltos; pendiente el **cierre formal del Humano**.
- **SIGUIENTE:** el Humano da TASK-06 por COMPLETED → **Fase 2b (radar-home) CERRADA**. Después: Orquestador planifica la mini-task `security-keys` (higiene de keys) y solo entonces se evalúa abrir Fase 3. Fase 3 sigue bloqueada.

### 2026-10-12 — TASK-06 COMPLETED — FASE 2b (radar-home) CERRADA

- **Cierre formal del Humano (2026-10-12):** con los hallazgos adjudicados en la entrada anterior (whitelist de deps `68cb002` en CA-09; `auth-*` en `shared/ui` aceptado como congelado 1.5b; keys `AIza` diferidas a `security-keys`), el Humano da TASK-06 por **COMPLETED**. CA-01…CA-10 de Fase 2b todos listos (CA-01…07 validados en dispositivo físico Android + iOS; CA-08…10 por arnés + adjudicación).
- `spec/features/radar-home/task.md`: TASK-06 `Status: COMPLETED` + nota de cierre. Definition of done actualizado.
- `progress/current-task.json` → `active_task: TASK-06`, `status: COMPLETED`; fase marcada como cerrada; siguiente cola: `security-keys` → Fase 3 (bloqueada).
- **Estado de la app al cierre de 2b:** login híbrido (1.5b) → chrome 2a (header + wordmark + drawer) → Radar Territorial: mapa Google homologado (iOS+Android), un pin guinda por municipio de `GET /api/v1/dashboard/mapa-home`, pin dorado GPS, chips que centran cámara, etiqueta del municipio del dispositivo, búsqueda solo-visual (Fase 3), popup KPI municipal con ripple animado re-anclado, X y Ver más no-op (Fase 4). Clean Architecture 4 capas + DIP + fences + TanStack Query.
- **PARADA CONTROLADA:** Fase 2b CERRADA. Siguiente: el Orquestador planifica la mini-task `security-keys` (rotar/revocar keys, restringir iOS por bundle id, limpiar `history.md`/`Instructions/`, decidir gitignore `android/`/`ios/`). **Fase 3 (búsqueda predictiva) NO se abre** hasta completar `security-keys`.

## Fase 3 — Búsqueda Predictiva y Explorador (search-bar)

### 2026-10-15 — Planeación estratégica Fase 3 (Lead Planner) — decisiones APROBADAS por el Humano; CERO código RN

- **Modo:** ORQUESTACIÓN (plan/diálogo). Lectura obligatoria completada (AGENTS.md, current-task.json, history 2026-10-06…12, roadmap, tech-stack §2.3/§2.4/§5, mission, cierre TASK-06). CERO código RN, cero spec/plan/task definitivos (eso es el Paso 0, en nueva sesión).
- **`security-keys` CANCELADA (decisión del Humano 2026-10-15):** las keys ya fueron rotadas en Google Console; no se requiere task de higiene ni cambio al roadmap por este motivo. El bloqueo "security-keys antes de Fase 3" queda sin efecto.
- **Mockup:** existe y fue leído por el Orquestador: `spec/features/search-bar/mockups/Busqueda.png` (versionado 2026-10-13). La transcripción literal + muestreo de píxeles (stdlib) se hará en el Paso 0 SDD (patrón 2b: el Worker no lee imágenes).
- **Decisiones del Humano (2026-10-15):**
  1. **Ubicación:** pantalla propia `Search` en el AppStack (UX tipo Uber/Rappi). `RadarSearchBar` del Home actúa como falso input → tap navega a `Search`. Ítem «Búsqueda» del drawer también navega.
  2. **Chrome intocable:** el back arrow (top-left, `navigation.goBack()`) vivirá **dentro del cuerpo de la pantalla** Search; `app-shell`/`AppHeader` NO se modifican (CA-07 intacta).
  3. **Input:** `TextInput` real con `autoFocus={true}`; botón **X** a la derecha que limpia texto, detiene la búsqueda en curso y limpia resultados.
  4. **Debounce ~500 ms**; **spinner central** solo en la primera carga; **spinner pequeño al pie** en páginas subsecuentes (`onEndReached`, concatena `page+1`); **contador** con `totalElements`; **empty state** si `totalElements = 0`.
  5. **Contrato real (producción):** `GET /api/v1/app-mobile/global-search?search={q}&page={n}&size=10` → Spring `Page<AppMobileGlobalSearchCardDTO>`. DTO verbatim (Java): `idOriginal: Long`, `tipo: String` (`"OBRA"`/`"CURSO"`), `titulo`, `municipio`, `localidad` (omitida en CURSOS), `descripcionCorta`, `estatus` (omitido en CURSOS), `progreso: Integer` (omitido en CURSOS), `imagenUrl` (opcional) — `@JsonInclude(NON_NULL)`. Page trae `content[]`, `totalElements`, `totalPages`, `last`, `number`, `size`. JSON de ejemplo real (query `merida`, 20 elementos, 2 páginas) entregado por el Humano en esta sesión; quedará verbatim en el spec §4.6-equivalente.
  6. **Tap en tarjeta → no-op tipado** (detalle = Fase 4; patrón «Ver más» del popup 2b).
- **Adjudicaciones mockup ↔ contrato (APROBADAS por el Humano):** (a) la mención "FlatList" fue error gramatical → **FlashList** (constitución: obligatoria; FlatList prohibido); (b) dropdown de sugerencias de localidad del mockup → **superseded** (no existe endpoint de autocompletado de localidades); (c) franja de mapa del mockup → **superseded** (decisión Humana: pantalla limpia); (d) `$3.1 MDP` y `NOV 12-2025` de las tarjetas → **no replicar** (campos inexistentes en el DTO; el contrato manda, patrón 2b); (e) `95% Concluida` → **sí replicar** (`progreso` + `estatus`, solo OBRAS); (f) serif de títulos → **Lato / Lato Bold** (constitución, precedente 1.5a); (g) pin morado `#7044BD` → artefacto del generador → token institucional a definir en el muestreo; (h) pills `Obra` (verde) / `Capacitación` (café) → **sí replicar** (campo `tipo`; hex exactos a muestrear → tokens `search-*` en tech-stack §2.5); (i) fallback **«Sin imagen»** (View gris + texto/icono centrado) cuando `imagenUrl` ausente; (j) artefactos del generador ("Preview", guion top-left, `Capotódeteres`) → no replicar.
- **Dependencias APROBADAS por el Humano (gate CA-09 de Fase 3):** `@shopify/flash-list` y `expo-image`, ambas vía `npx expo install` en TASK-01; rebuild nativo (`prebuild` + `run:*`) = Humano. **Context7 (2026-10-15):** FlashList v2 requiere New Architecture (RN 0.86.3 la trae por defecto ✅), **`estimatedItemSize` no existe en v2** (prohibido pasarlo), sin config plugin. `expo-image` requerirá enmienda de `tech-stack.md` §2 en el Paso 0.
- **Inputs fijados:** `MIN_CHARS = 3` para disparar la búsqueda; `size = 10` fijo; título de pantalla **BÚSQUEDA** (con acento; el mockup lo muestra sin acento).
- **Arquitectura propuesta (calco del patrón `home`, Clean Architecture 4 capas + SOLID):** `src/features/search/{domain,application,infrastructure,presentation}` — entidades `SearchCard`/`SearchPage`, puerto `SearchRepository`, error `SearchError` `{kind,message}`+factory, closure `createGlobalSearch`, `dto.ts` espejo 1:1 (campos `localidad`/`estatus`/`progreso`/`imagenUrl` opcionales), `AxiosGlobalSearchApi`, `SearchProvider` + `useSearch()` (fachada calco `useHomeRadar`/`useAuth`), `SearchScreen`, `SearchInputBar`, `SearchResultCard`, `SearchEmptyState`, `format.ts` hoisted. Server state: `useInfiniteQuery` (TanStack Query v5) con `queryKey: ["search","global",debouncedQuery]`, `getNextPageParam` desde `last`/`number`, `enabled: debouncedQuery.length >= 3`, `placeholderData: keepPreviousData`; el texto del input vive como estado local y solo el valor debounced alimenta el `queryKey` (cero re-renders del grid por keystroke). Wiring: `compositionRoot.ts` único importador de `search/infrastructure`; fences `no-restricted-imports` extendidos; ruta `Search` en `AppStackParamList`. FlashList v2 con `numColumns={2}` (grid del mockup). Skills obligatorias: `list-performance`, `react-state-minimize`, `js-hoist-intl`, `ui-pressable`, `rendering-no-falsy-and` (crítico: `progreso: 0` es falsy → ternarios estrictos, nunca `&&`).
- **Orden de trabajo aprobado:** Paso 0 SDD (enmiendas `roadmap.md` §3 + `tech-stack.md` §2.5 + escritura de `spec/features/search-bar/{spec,plan,task}.md`) → TASK-01 (tokens `search-*` + installs) → TASK-02 (domain+application) → TASK-03 (infra+compositionRoot+SearchProvider+fences) → TASK-04 (componentes, sin wire) → TASK-05 (wire navigator + RadarSearchBar/drawer navegan) → TASK-06 (arnés).
- `progress/current-task.json` → `active_feature: search-bar`, `active_task: FASE3-PASO0-SDD` (`TODO`), `blockers_or_errors` actualizado (security-keys CANCELADA; Fase 3 desbloqueada para Paso 0).
- **PARADA CONTROLADA:** el Paso 0 SDD se ejecuta en **NUEVA SESIÓN** del Orquestador, solo al autorizarlo el Humano. TASK-01+ quedan bloqueadas hasta que el Humano apruebe el spec escrito en el Paso 0 (patrón 2b).

### 2026-10-15 — Paso 0 SDD de Fase 3 (Orquestador) — spec/plan/task ESCRITOS; CERO código RN

- **Autorización:** el Humano autorizó ejecutar el Paso 0 en la misma sesión de planeación. Rol: Orquestador (Lead Planner) — solo SDD, enmiendas constitucionales y `progress/*`. CERO código RN, cero installs, cero `npx expo start`.
- **Muestreo 2026-10-15 (`Busqueda.png` 788×1494, Python stdlib, moda de regiones sobre fills sin texto):** pill Obra `#5C7A3F`, pill Capacitación `#8B5E2F`, fondo tarjeta `#F5F0E8`, fondo cuerpo pantalla `#E8E4D9`, barra `#FFFFFF`, texto secundario `#777777`, placeholder imagen `#E4E0D5`, acento dorado (glyphs «$3.1 MDP») `#C97C33` → **RESERVADO para Fase 4** (el DTO no trae monto). Header `#F2EDE6` y franja `#5C1120` = tokens `app-*` existentes (chrome congelado, se confirma que el mockup usa el chrome 2a).
- **Conflicto detectado en sesión y resuelto con el Humano:** el mockup muestra `BUSQUEDA` como título del header, pero el chrome 2a está congelado mostrando `INICIO` en todas las pantallas. **Decisión del Humano: título «BÚSQUEDA» (con acento) en el CUERPO** — fila 1: back arrow + título; fila 2: barra de búsqueda. Cero excepciones a CA-07 del chrome.
- **Enmiendas constitucionales:**
  - `spec/constitution/roadmap.md` §3 **reescrito** contra el contrato real `GET /api/v1/app-mobile/global-search` y las decisiones 2026-10-15 (pantalla `Search` propia, chrome congelado, debounce 500 ms / MIN_CHARS 3, FlashList v2 + `expo-image` autorizadas, tarjetas sin monto/fecha, tap no-op Fase 4). El párrafo original (autocompletado de localidades + monto invertido) queda **superseded**. `security-keys` NO se menciona en el roadmap (instrucción explícita del Humano: ya rotó las keys en Google Console).
  - `spec/constitution/tech-stack.md` §2: FlashList v2 (instalación autorizada 2026-10-15 vía `npx expo install`; **prohibido `estimatedItemSize`** — no existe en v2; New Architecture requerida, RN 0.86 la trae por defecto) + `expo-image` autorizada (imágenes remotas del explorador, caché `memory-disk`, `recyclingKey`; prohibido `Image` de RN para ese fin). Nueva **§2.5**: paleta `search-*` (8 tokens + reglas: serif→Lato, pin morado→guinda, `search-accent` reservado, `auth-*` prohibida).
- **Artefactos SDD escritos:**
  - `spec/features/search-bar/spec.md` — 12 decisiones del Humano; tokens §4.1–4.4; **transcripción literal §4.5** (layout, copy verbatim: `BÚSQUEDA`, placeholder, heading, estados inicial/vacío/error, `Sin imagen`, formatos Title Case / ubicación / avance / contador); **contrato §4.6** (endpoint + params + JSON de ejemplo + DTO Java verbatim + campos opcionales por `@JsonInclude(NON_NULL)` + campos del Page ignorados deliberadamente); **artefactos §4.7** (10 ítems: dropdown de sugerencias, franja de mapa, `$3.1 MDP`, `NOV 12-2025`, pin morado `#7044BD`, serif, `BUSQUEDA` en header, MAYÚSCULAS inconsistentes, artefactos del generador, datos de ejemplo); flujo §5; 9 desviaciones §6; 5 reglas superseded §7; arquitectura 4 capas §8 (cambios en features congeladas = solo 4 acciones de navegación, cero píxel); límites §9; **CA-01…CA-10**. Estado: **PENDIENTE DE APROBACIÓN HUMANA**.
  - `spec/features/search-bar/plan.md` — árbol destino; orden anti-rompimiento; tokens verbatim §3; firmas **verbatim** de domain (4) / application (2) / infrastructure (`dto.ts` espejo + `AxiosGlobalSearchApi` con `axios.isCancel` re-lanzado) / `SearchProvider` + `useSearch` (calco `HomeProvider`, debounce 500 ms con `setTimeout`+cleanup, `SEARCH_MIN_CHARS=3`); `useInfiniteQuery` tipado (`queryKey: ["search","global",debouncedQuery]`, `getNextPageParam` desde `isLast`/`page`, `placeholderData: keepPreviousData`, `signal` al use case); `renderCard`/`keyExtractor` hoisted; FlashList `numColumns={2}` sin `estimatedItemSize`; `format.ts` con `toTitleCase` duplicado deliberadamente (prohibido importar entre features); fences `@shopify/*`+`expo-image` solo en bans de domain/application; skills §10; criterio de hecho técnico §11.
  - `spec/features/search-bar/task.md` — TASK-01 (tokens + `npx expo install @shopify/flash-list expo-image`; doble gate: spec aprobada + rebuild nativo del Humano), TASK-02 (domain+application, 6 archivos), TASK-03 (infra + compositionRoot + SearchProvider + fences), TASK-04 (5 componentes sin wire; `types.ts` añade `Search: undefined` como excepción tipada), TASK-05 (wire: RootNavigator + `RadarSearchBar` Pressable + `menuItems`/`AppDrawer` acción search, cero píxel, con checklist físico CA-01…07), TASK-06 (arnés). Cada TASK con `allowed_files` estrictos.
- `progress/current-task.json` → `active_task: TASK-01` (`TODO`, **bloqueada** hasta aprobación del spec), `context_pointers` apuntando a los 3 artefactos, `blockers_or_errors` con el bloqueo activo.
- **PARADA CONTROLADA:** el Humano revisa y aprueba `spec/features/search-bar/spec.md`. TASK-01 se autoriza en **nueva sesión** con el Worker (DeepSeek) solo tras esa aprobación (patrón 2b). Fase 4 sigue bloqueada.

### 2026-10-15 — spec.md de search-bar APROBADA por el Humano

- **Aprobación:** el Humano revisó y aprobó `spec/features/search-bar/spec.md` completa (copy verbatim §4.5, desviaciones §6 — incluida la 2: título `BÚSQUEDA` en el cuerpo —, artefactos §4.7 y CA-01…10). Header de la spec actualizado a **APROBADA (2026-10-15)**.
- **Estado de gobernanza:** SDD de Fase 3 completo y aprobado (spec + plan + task + enmiendas constitucionales roadmap §3 / tech-stack §2 y §2.5). TASK-01 pasa a **TODO DESBLOQUEADA** (no IN_PROGRESS).
- **Decisión del Humano:** el Worker (DeepSeek) ejecuta TASK-01 en **nueva sesión**, puesto en contexto por el propio Humano con el prompt de ejecución preparado por el Orquestador. Cero TASK iniciada en la sesión de planeación.
- `progress/current-task.json` → `active_task: TASK-01` (`TODO`, desbloqueada), `current_roadmap_phase` y `blockers_or_errors` actualizados; `spec_file` marcada APROBADA.
- **Gate restante tras TASK-01:** el Humano valida el diff (tokens + `package.json` con solo `@shopify/flash-list` + `expo-image`) y hace el **rebuild nativo** (`npx expo prebuild` + `run:ios`/`run:android`) — FlashList es módulo nativo. Fase 4 sigue bloqueada.

### 2026-10-16 — TASK-01 (Tokens `search-*` + dependencias) — READY_FOR_REVIEW (Trabajador)

- **Alcance (plan §3 verbatim):** solo tokens + las 2 deps autorizadas. Cero componentes, cero `src/features/search/**`, cero toques a `src/app/**`/`App.tsx`/`eslint.config.js`/nativos. No se ejecutó `npx expo start`/`prebuild`/`run:*`; cero commit.
- **`global.css`:** añadidos los 8 tokens `--color-search-*` dentro del `@theme` existente, tras los `radar-*` (Fase 1, `auth-*`, `app-*`, `radar-*` intactos):
  ```
  --color-search-tag-obra: #5c7a3f;
  --color-search-tag-curso: #8b5e2f;
  --color-search-card-bg: #f5f0e8;
  --color-search-screen-bg: #e8e4d9;
  --color-search-surface: #ffffff;
  --color-search-text-muted: #777777;
  --color-search-image-placeholder: #e4e0d5;
  --color-search-accent: #c97c33;
  ```
- **`src/shared/theme/tokens.ts`:** añadido `searchPalette` al final, `palette`/`fontFamily`/`authPalette`/`appPalette`/`radarPalette` sin tocar:
  ```ts
  export const searchPalette = {
    tagObra: "#5C7A3F",
    tagCurso: "#8B5E2F",
    cardBg: "#F5F0E8",
    screenBg: "#E8E4D9",
    surface: "#FFFFFF",
    textMuted: "#777777",
    imagePlaceholder: "#E4E0D5",
    accent: "#C97C33",
  } as const;
  ```
  `accent` queda registrado pero prohibido en Fase 3 (spec §9).
- **Dependencias (`npx expo install @shopify/flash-list expo-image`):** instaladas `@shopify/flash-list@2.0.2` y `expo-image@~57.0.5`. `git diff -- package.json`:
  ```diff
  +    "@shopify/flash-list": "2.0.2",
  ...
  +    "expo-image": "~57.0.5",
  ```
  Únicas dos entradas nuevas. `package-lock.json`: solo inserciones (`1 file changed, 42 insertions(+)`, 0 deleciones).
- **Gate app config:** `git diff -- app.json app.config.js` → **VACÍO**. Hallazgo: el comando `expo install` imprimió el aviso `Cannot automatically write to dynamic config at: app.config.js / Add the following to your Expo config { "plugins": ["expo-image"] }`, pero **no** modificó ninguna config (ninguna de las 2 deps requiere config plugin en Fase 3; no se añadió el plugin).
- **Arnés:** `npx tsc --noEmit` → **exit 0** (verde).
- **Hallazgo (ajeno a TASK-01, plumbing preexistente):** el `postinstall` (`patch-package`) reportó `Failed to apply patch for package expo-modules-jsi` (`patches/expo-modules-jsi+57.1.1.patch`). No introducido por esta task (el lockfile no tuvo deleciones ni cambios de versión de `expo-modules-jsi`); se reporta para el Revisor. El `npm install` completó y ambas deps quedaron operativas (`2.0.2` / `57.0.5`).
- **Estado:** `spec/features/search-bar/task.md` TASK-01 marcada `- [x]` / `Status: READY_FOR_REVIEW`. `progress/current-task.json` → `active_task: TASK-01` `READY_FOR_REVIEW`, `harness_status.typecheck_passed: true`, `package_json_sin_cambios: false` (solo las 2 deps), `app_json_sin_cambios: true`.
- **PARADA CONTROLADA (gate Humano):** TASK-01 NO se marca COMPLETED. El Humano valida el diff de tokens + `package.json` y ejecuta el **rebuild nativo** (`npx expo prebuild` + `run:ios`/`run:android`) — FlashList es módulo nativo. Tras aprobarla, TASK-01 → COMPLETED y se autoriza TASK-02 en nueva sesión. TASK-02 NO iniciada. Fase 4 sigue bloqueada.

### 2026-10-16 — TASK-01 APROBADA por el Humano — COMPLETED

- **Validación del Humano:** diff de `global.css` (8 tokens `search-*`), `src/shared/theme/tokens.ts` (`searchPalette`) y `package.json` (solo `@shopify/flash-list@2.0.2` + `expo-image@~57.0.5`) revisado y aprobado. Rebuild nativo (`npx expo prebuild` + `run:ios`/`run:android`) ejecutado y validado **OK en Android e iOS**.
- **Cierre:** `spec/features/search-bar/task.md` → TASK-01 `- [x]` / `Status: COMPLETED`. `progress/current-task.json` → `active_task: TASK-01` `COMPLETED`, `current_roadmap_phase` actualizado.
- **Gobernanza:** TASK-02 (domain + application) **NO iniciada**. Se autoriza en **NUEVA SESIÓN** con el prompt de ejecución (patrón por task). Fase 4 sigue bloqueada.

### 2026-10-16 — TASK-02 (Domain + Application de search) — READY_FOR_REVIEW (Trabajador)

- **Alcance (plan §4.1–§4.4 y §5.1–§5.2 verbatim):** solo domain + application, sin consumidores. Cero `infrastructure/`/`presentation/`, cero toques a `src/app/**`, `App.tsx`, `eslint.config.js`, `app.json`, `app.config.js`, `global.css`, `tokens.ts`, `package.json`/lock. No se instalaron dependencias, no se ejecutó `npx expo start`/`prebuild`/`run:*`, cero commit.
- **Archivos creados (6):**
  - `src/features/search/domain/entities/SearchCard.ts` (`SearchCardTipo`, `SearchCard`).
  - `src/features/search/domain/entities/SearchPage.ts` (`SearchPage`, import relativo `./SearchCard`).
  - `src/features/search/domain/errors/SearchError.ts` (`SearchErrorKind`, `SearchError`, `SEARCH_ERROR_MESSAGES`, `searchError`, `isSearchError`).
  - `src/features/search/domain/ports/SearchRepository.ts` (`SearchRepository`, import relativo `../entities/SearchPage`).
  - `src/features/search/application/types.ts` (`SearchUseCases`, import `../domain/entities/SearchPage`).
  - `src/features/search/application/globalSearch.ts` (`createGlobalSearch` factory closure; deja subir `SearchError` sin catch; imports `../domain/ports/SearchRepository` + `./types`).
- **Arnés — typecheck:** `npx tsc --noEmit` → **exit 0**.
- **Arnés — linter:** `npx eslint .` → **exit 0** (cero errores, cero warnings).
- **Grep de capas (evidencia):**
  ```
  domain/ports/SearchRepository.ts:1:import type { SearchPage } from "../entities/SearchPage";
  domain/entities/SearchPage.ts:1:import type { SearchCard } from "./SearchCard";
  application/globalSearch.ts:1:import type { SearchRepository } from "../domain/ports/SearchRepository";
  application/globalSearch.ts:2:import type { SearchUseCases } from "./types";
  application/types.ts:1:import type { SearchPage } from "../domain/entities/SearchPage";
  ```
  Imports no relativos: **NONE**. Bans por término (case-insensitive, sobre `domain/` + `application/`): `react: 0`, `axios: 0`, `tanstack: 0`, `shopify: 0`, `flash-list: 0`, `expo-image: 0`, `@/shared: 0`, `@/app: 0`. (`expo` solo aparece como subcadena de `export`; cero imports de Expo.) `any`/comentarios/barrels `index.ts`: **NONE**.
- **Gate de deps:** `git diff -- package.json app.json app.config.js` → **VACÍO**. Cero dependencias nuevas.
- **Estado:** `spec/features/search-bar/task.md` TASK-02 marcada `- [x]` / `Status: READY_FOR_REVIEW`. `progress/current-task.json` → `active_task: TASK-02` `READY_FOR_REVIEW`, `harness_status.typecheck_passed: true`, nota `fase_3_task_02_run` con los 6 archivos.
- **PARADA CONTROLADA (gate Humano):** TASK-02 NO se marca COMPLETED. El Humano revisa los 6 archivos (firmas verbatim, capas limpias). Tras aprobarla, TASK-02 → COMPLETED y se autoriza TASK-03 en nueva sesión. TASK-03 NO iniciada. Fase 4 sigue bloqueada.

### 2026-10-16 — TASK-02 APROBADA por el Humano — COMPLETED

- **Validación del Humano:** los 6 archivos de domain + application revisados y aprobados (firmas verbatim de plan §4–§5, capas limpias, cero consumidores). Arnés reproducido: `npx tsc --noEmit` → exit 0; `npx eslint .` → exit 0; grep de capas sin imports no relativos ni bans; `git diff -- package.json app.json app.config.js` → VACÍO.
- **Cierre:** `spec/features/search-bar/task.md` → TASK-02 `- [x]` / `Status: COMPLETED`. `progress/current-task.json` → `active_task: TASK-02` `COMPLETED`, `current_roadmap_phase` actualizado.
- **Gobernanza:** TASK-03 (infrastructure + compositionRoot + SearchProvider + fences) **NO iniciada**. Se autoriza en **NUEVA SESIÓN** con el prompt de ejecución. Fase 4 sigue bloqueada.

### 2026-10-16 — TASK-03 (Infrastructure + compositionRoot + SearchProvider + fences) — READY_FOR_REVIEW (Trabajador)

- **Alcance (plan §6.1–§6.5 y §7 verbatim):** infra + wiring, sin UI ni navegación. Cero toques a `domain/**`, `application/**`, nativos, `package.json`/lock, `app.json`, `app.config.js`, `global.css`, `tokens.ts`. No se instalaron dependencias, no se ejecutó `npx expo start`/`prebuild`/`run:*`, cero commit.
- **Archivos creados (4):**
  - `src/features/search/infrastructure/dto.ts` (`GlobalSearchCardDTO`, `GlobalSearchPageDTO`; espejo 1:1 de spec §4.6).
  - `src/features/search/infrastructure/AxiosGlobalSearchApi.ts` (`mapCard` 1:1 con opcionales → `null`, `createAxiosGlobalSearchApi(): SearchRepository`, `PAGE_SIZE = 10`; cancelación `axios.isCancel` re-lanzada intacta; path `/api/v1/app-mobile/global-search` único).
  - `src/features/search/presentation/SearchProvider.tsx` (`SEARCH_MIN_CHARS = 3`, `SEARCH_DEBOUNCE_MS = 500`, estado `query`/`debouncedQuery`/`isActive`, `setQuery`/`clearQuery`, `useCases` en contexto).
  - `src/features/search/presentation/useSearch.ts` (`useSearch()` con guard de contexto nulo).
- **Archivos editados (3):**
  - `src/app/compositionRoot.ts`: imports de search + `createSearchUseCases()` al final; `createAuthUseCases`/`createHomeUseCases` intactos.
  - `App.tsx`: `createSearchUseCases` en el import existente, `const searchUseCases = createSearchUseCases()` a nivel de módulo y `<SearchProvider>` dentro de `<HomeProvider>` envolviendo `<RootNavigator />` + `<StatusBar />`.
  - `eslint.config.js`: `"@shopify/*"` y `"expo-image"` añadidos a los `patterns` de `src/features/*/domain/**` y `src/features/*/application/**`; bloque presentation/navigation/shared-ui sin cambios.
- **Arnés — typecheck:** `npx tsc --noEmit` → **exit 0**.
- **Arnés — linter:** `npx eslint .` → **exit 0** (1 warning: `useContext` sin usar en `SearchProvider.tsx`, import incluido tal cual en el snippet verbatim de plan §7; el hook se consume en `useSearch.ts`). Cero errores.
- **Grep DIP (evidencia):**
  ```
  src/app/compositionRoot.ts:22:import { createAxiosGlobalSearchApi } from "@/features/search/infrastructure/AxiosGlobalSearchApi";
  ```
  Único importador de `search/infrastructure` = `compositionRoot.ts`. `@shopify`/`expo-image` en `search/domain` y `search/application`: **NONE**. Path del endpoint: única coincidencia en `AxiosGlobalSearchApi.ts:32`. `SearchRepository` implementado por la API Axios; `presentation` solo importa `../application/types`.
- **Gate de deps:** `git diff -- package.json app.json app.config.js` → **VACÍO**. `domain/**`/`application/**` sin cambios (`git status` solo lista los 3 editados + 4 nuevos).
- **Estado:** `spec/features/search-bar/task.md` TASK-03 marcada `- [x]` / `Status: READY_FOR_REVIEW`. `progress/current-task.json` → `active_task: TASK-03` `READY_FOR_REVIEW`, `harness_status.typecheck_passed: true`, nota `fase_3_task_03_run`.
- **PARADA CONTROLADA (gate Humano):** TASK-03 NO se marca COMPLETED. El Humano revisa firmas verbatim, mapper 1:1, DIP y fences. TASK-04 NO iniciada. Fase 4 sigue bloqueada.

### 2026-10-16 — TASK-03 APROBADA por el Humano — COMPLETED

- **Validación del Humano:** infra + wiring revisados y aprobados (firmas verbatim de plan §6–§7, mapper 1:1, DIP y fences). Arnés reproducido: `npx tsc --noEmit` → exit 0; `npx eslint .` → exit 0; grep DIP limpio (único importador `compositionRoot.ts:22`); `git diff -- package.json app.json app.config.js` → VACÍO.
- **Cierre:** `spec/features/search-bar/task.md` → TASK-03 `- [x]` / `Status: COMPLETED`. `progress/current-task.json` → `active_task: TASK-03` `COMPLETED`, `current_roadmap_phase` actualizado, nota `fase_3_task_03_run` marcada como aprobada.
- **Gobernanza:** no se requiere `prebuild`/rebuild por TASK-03 (solo JS/TS; los módulos nativos se reconstruyeron en TASK-01). TASK-04 (5 componentes sin wire) **NO iniciada**: se autoriza en **NUEVA SESIÓN** con prompt de ejecución. La compilación en dispositivo queda para el gate de TASK-05. Fase 4 sigue bloqueada.

### 2026-10-17 — TASK-04 (Componentes de búsqueda, sin wire al navigator) — READY_FOR_REVIEW (Trabajador)

- **Alcance (plan §8.1–§8.5 + spec §4.5 verbatim):** solo los 5 componentes de `search/presentation` + `Search: undefined` en `AppStackParamList`. Cero wire al `RootNavigator`, cero toques a `domain/**`, `application/**`, `infrastructure/**`, `SearchProvider`, `useSearch`, `App.tsx`, `compositionRoot`, `eslint.config.js`, nativos, `package.json`/lock, `app.json`/`app.config.js`, `global.css` o `tokens.ts`. No se instalaron dependencias, no se ejecutó `npx expo start`/`prebuild`/`run:*`, cero commit. La pantalla aún no se ve (no hay ruta montada).
- **Archivos creados (5):**
  - `src/features/search/presentation/format.ts` (`toTitleCase`, `formatProgreso`, `formatUbicacion` verbatim; `toTitleCase` duplicado deliberadamente, sin importar de `home`).
  - `src/features/search/presentation/SearchInputBar.tsx` (pill blanca `searchPalette.surface` radio 24, lupa Ionicons, `TextInput` `autoFocus` con placeholder verbatim, X solo con `query.length > 0` que llama `clearQuery` sin `blur()`).
  - `src/features/search/presentation/SearchResultCard.tsx` (`memo`, `expo-image` 4:3 con `recyclingKey={card.imagenUrl}` + `cachePolicy="memory-disk"` + `transition={0}`; fallback `Sin imagen`; pill `Obra`/`Capacitación`; título `toTitleCase` 2 líneas; ubicación; avance con ternario estricto por presencia — `progreso: 0` se pinta).
  - `src/features/search/presentation/SearchEmptyState.tsx` (variantes `initial`/`empty`/`error`, iconos `search-outline`/`alert-circle-outline`, copy verbatim).
  - `src/features/search/presentation/SearchScreen.tsx` (`useInfiniteQuery<SearchPage, SearchError, InfiniteData<SearchPage>, readonly unknown[], number>` con `queryKey: ["search", "global", debouncedQuery]`, `initialPageParam: 0`, `getNextPageParam` por `isLast`, `enabled: isActive`, `placeholderData: keepPreviousData`; `renderCard`/`keyExtractor`/`cardWrapperStyle` hoisted; `FlashList` `numColumns={2}` sin `estimatedItemSize`; heading `Resultado de búsqueda` + contador singular/plural; spinner central y footer; back arrow `navigation.goBack()`; `useSearch()` como único consumo de casos de uso).
- **Archivo editado (1):**
  - `src/app/navigation/types.ts`: `AppStackParamList` pasa a `{ Home: undefined; Search: undefined }` (excepción tipada autorizada; `RootNavigator` intacto).
- **Arnés — typecheck:** `npx tsc --noEmit` → **exit 0**.
- **Arnés — linter:** `npx eslint .` → **exit 0** (1 warning preexistente de TASK-03: `useContext` sin usar en `SearchProvider.tsx`, import del snippet verbatim de plan §7; los 5 archivos nuevos sin warnings).
- **Greps de capas/UI (evidencia):**
  ```
  expo-image / @shopify/flash-list en src/:
    SearchResultCard.tsx:2:import { Image } from "expo-image";
    SearchScreen.tsx:4:import { FlashList, type ListRenderItem } from "@shopify/flash-list";

  infrastructure|@/shared/infrastructure|axios|expo-secure-store|SecureStore en search/presentation: NONE
  FlatList|estimatedItemSize|any|TouchableOpacity|className en search/presentation: NONE
  auth-* / searchPalette.accent en search/presentation: NONE
  ```
- **Gate de deps:** `git diff -- package.json app.json app.config.js` → **VACÍO**. `git status --short` lista solo `src/app/navigation/types.ts` (1 línea) + los 5 archivos nuevos de `search/presentation`; `domain/**`, `application/**` e `infrastructure/**` sin cambios.
- **Estado:** `spec/features/search-bar/task.md` TASK-04 marcada `- [x]` / `Status: READY_FOR_REVIEW`. `progress/current-task.json` → `active_task: TASK-04` `READY_FOR_REVIEW`, `harness_status.typecheck_passed: true`, nota `fase_3_task_04_run` con los archivos creados/editados.
- **PARADA CONTROLADA (gate Humano):** TASK-04 NO se marca COMPLETED. El Humano revisa los 5 componentes (estructura/copy/estilos verbatim de plan §8) y la línea de `types.ts`. Tras aprobarla, TASK-04 → COMPLETED y se autoriza TASK-05 en nueva sesión. TASK-05 NO iniciada. Fase 4 sigue bloqueada.

### 2026-10-17 — TASK-04 APROBADA por el Humano — COMPLETED

- **Validación del Humano:** los 5 componentes de `search/presentation` (`format.ts`, `SearchInputBar.tsx`, `SearchResultCard.tsx`, `SearchEmptyState.tsx`, `SearchScreen.tsx`) y la línea `Search: undefined` de `src/app/navigation/types.ts` revisados y aprobados. No se requirió `prebuild`/rebuild: TASK-04 es solo JS/TS y los módulos nativos (`@shopify/flash-list`, `expo-image`) ya se reconstruyeron en TASK-01. La compilación visual en dispositivo queda para el gate de TASK-05.
- **Cierre:** `spec/features/search-bar/task.md` → TASK-04 `- [x]` / `Status: COMPLETED`. `progress/current-task.json` → `active_task: TASK-04` `COMPLETED`, `current_roadmap_phase` actualizado, `blockers_or_errors` apuntando a TASK-05 y nota `fase_3_task_04_run` marcada como aprobada.
- **Gobernanza:** TASK-05 (wire navigator + RadarSearchBar + drawer) **NO iniciada**: se autoriza en **NUEVA SESIÓN** con el prompt de ejecución. Tras TASK-05, la validación visual en Android + iOS la hace el Humano (checklist CA-01…07). TASK-06 (arnés) no iniciada. Fase 4 sigue bloqueada.

### 2026-10-17 — TASK-05 (Wire navigator + entradas de navegación) — READY_FOR_REVIEW (Trabajador)

- **Alcance (plan §9.2–§9.5 verbatim):** solo el wire al navigator y las tres entradas de navegación. Cero cambio visual, cero toques a `SearchScreen`, `search/domain|application|infrastructure|presentation`, `SearchProvider`, `useSearch`, `App.tsx`, `compositionRoot`, `eslint.config.js`, `types.ts` (ya traía `Search`), `package.json`/lock, `app.json`/`app.config.js`, `global.css`, `tokens.ts` ni nativos. No se instalaron dependencias, no se ejecutó `npx expo start`/`prebuild`/`run:*`, cero commit.
- **Archivos editados (4):**
  - `src/app/navigation/RootNavigator.tsx`: añadido `import { SearchScreen } from "@/features/search/presentation/SearchScreen";` y `<AppStack.Screen name="Search" component={SearchScreen} />` tras `Home`. `AppShell`, `NavigationContainer key={status}` y `AuthStackNavigator` intactos.
  - `src/features/home/presentation/RadarSearchBar.tsx`: `View` raíz → `Pressable` con `useNavigation<NativeStackNavigationProp<AppStackParamList>>()`, `onPress={() => navigation.navigate("Search")}`, `accessibilityRole="button"`, `accessibilityLabel="Buscar"` (sustituye el label anterior), `pressed → opacity 0.9`. Mismos `surface`, radio 24, paddings, `marginTop`, `gap`, `boxShadow`, lupa y textos.
  - `src/features/app-shell/presentation/menuItems.ts`: `AppMenuAction` = `"home" | "search" | "noop" | "sign-out"`; ítem `search` con `action: "search"`. Labels e iconos intactos.
  - `src/features/app-shell/presentation/AppDrawer.tsx`: `useNavigation` tipado; handler de ítems añade `action === "search"` → `onClose()` + `navigation.navigate("Search")`. `home`/`noop`/`sign-out` y layout intactos.
- **Arnés — typecheck:** `npx tsc --noEmit` → **exit 0**.
- **Arnés — linter:** `npx eslint .` → **exit 0** (1 warning preexistente de TASK-03: `useContext` sin usar en `SearchProvider.tsx`; los archivos de TASK-05 sin warnings).
- **Greps de acciones/píxel y DIP (evidencia):**
  ```
  git diff --stat -- src/features/app-shell src/features/home:
    AppDrawer.tsx  |  9 +++++++++
    menuItems.ts   |  4 ++--
    RadarSearchBar.tsx | 21 +++++++++++++++------
    3 files changed, 26 insertions(+), 8 deletions(-)

  grep search/infrastructure en src fuera de compositionRoot.ts: NONE
  TouchableOpacity|FlatList|estimatedItemSize|expo-router|any|className en archivos editados: NONE
  ```
- **Gate de deps:** `git diff -- package.json app.json app.config.js` → **VACÍO**. `git status --short` lista solo los 4 archivos de TASK-05 (más una modificación preexistente de `Instructions/fase_3/fase_3.md`, ajena a esta TASK y no editada por el agente).
- **Estado:** `spec/features/search-bar/task.md` TASK-05 marcada `- [x]` / `Status: READY_FOR_REVIEW` (NO COMPLETED). `progress/current-task.json` → `active_task: TASK-05` `READY_FOR_REVIEW`, `harness_status.typecheck_passed: true`, nota `fase_3_task_05_run` con archivos editados.
- **PARADA CONTROLADA (gate Humano):** validación visual en Android + iOS con checklist CA-01…07 (entrada desde barra del Home y desde el drawer con cierre; `autoFocus` + teclado; back arrow al radar; búsqueda real; spinner/contador/grid/pills/fallback/scroll infinito; X conserva foco; empty state; radar y chrome pixel-idénticos). Al aprobarla, TASK-05 → COMPLETED y se autoriza TASK-06 en nueva sesión. TASK-06 NO iniciada. Fase 4 sigue bloqueada.

### 2026-10-17 — TASK-05 APROBADA por el Humano — COMPLETED

- **Validación del Humano:** TASK-05 validada en dispositivos **Android + iOS** con el checklist CA-01…07; funciona correctamente (entrada desde la barra del Home y desde el drawer, cierre del drawer, `autoFocus`/teclado, back arrow al radar, búsqueda real, spinners, contador, grid 2 columnas con pills, fallback «Sin imagen», scroll infinito, X conserva foco, empty state y radar/chrome pixel-idénticos).
- **Cierre:** `spec/features/search-bar/task.md` → TASK-05 `- [x]` / `Status: COMPLETED` (validación Humana registrada). `progress/current-task.json` → `active_task: TASK-05` `COMPLETED`, `current_roadmap_phase` actualizado, nota `fase_3_task_05_run` marcada como aprobada, `blockers_or_errors` apuntando a TASK-06.
- **Gobernanza:** TASK-06 (arnés) **NO iniciada**: se autoriza en **NUEVA SESIÓN** con el prompt de ejecución. Fase 4 sigue bloqueada.

### 2026-10-17 — TASK-06 (Arnés de control Fase 3) — READY_FOR_REVIEW (Trabajador + Revisor)

- **Alcance:** SOLO auditoría/arnés de la feature `search-bar`. Cero cambios de código, cero features, cero UI, cero dependencias, cero commit, cero `npx expo start`/`prebuild`/`run:*`. Editados únicamente `spec/features/search-bar/task.md`, `progress/current-task.json` y `progress/history.md`.
- **Typecheck:** `npx tsc --noEmit` → **exit 0**.
- **Linter:** `npx eslint .` → **exit 0**. Salida literal:
  ```
  /Users/macbookair/Documents/Projects/React-Native/CIMIENTOS-DEL-RENACIMIENTO-APP-MOBILE/src/features/search/presentation/SearchProvider.tsx
    4:3  warning  'useContext' is defined but never used  @typescript-eslint/no-unused-vars

  ✖ 1 problem (0 errors, 1 warning)
  ```
  **Desviación conocida:** warning preexistente de TASK-03 (`useContext` importado y sin usar; snippet verbatim de plan §7). `SearchProvider.tsx` está fuera de `allowed_files` de TASK-06 y **no se editó**. Se solicita al Humano/Revisor autorizar el fix de 1 línea (eliminar `useContext` del import) o aceptar la desviación.
- **Bans (git grep sobre `src/**/*.ts`, `src/**/*.tsx`, `App.tsx`):**
  ```
  any=0 | TouchableOpacity=0 | FlatList=0 | expo-router=0 | estimatedItemSize=0
  className en search/**=0 (solo coincidencias preexistentes en features/auth/.../LoginScreen.tsx y src/shared/ui/*)
  searchPalette.accent fuera de tokens.ts=0
  auth-* fuera de auth: solo src/shared/ui/BiometricMethodCard.tsx, src/shared/ui/TextField.tsx y src/shared/theme/tokens.ts (ACEPTADO preexistente 1.5b); cero en search/** y App.tsx
  ```
- **DIP:** único importador de `search/infrastructure` = `src/app/compositionRoot.ts:22`. `@shopify/*`/`expo-image` ausentes de `domain`/`application`. `@shopify/flash-list` solo en `search/presentation/SearchScreen.tsx:4`; `expo-image` solo en `search/presentation/SearchResultCard.tsx:2`.
- **Gate de deps (baseline pre-Fase-3 `3ab59f9`):** `git diff 3ab59f9 -- package.json` → SOLO `+"@shopify/flash-list": "2.0.2"` y `+"expo-image": "~57.0.5"`. `git diff -- package.json app.json app.config.js` (worktree) → **VACÍO**. `git diff 3ab59f9 -- app.json app.config.js` → **VACÍO**.
- **Contrato:** `/api/v1/app-mobile/global-search` aparece **una sola vez** en código (`AxiosGlobalSearchApi.ts:32`). `infrastructure/dto.ts` es espejo de spec §4.6 (`idOriginal`, `tipo`, `titulo`, `municipio`, `localidad?`, `descripcionCorta?`, `estatus?`, `progreso?`, `imagenUrl?`; Page: `content`, `totalElements`, `totalPages`, `number`, `last`).
- **Chrome/radar:** `git diff --stat 3ab59f9 -- src/features/app-shell src/features/home` → SOLO `AppDrawer.tsx` (+9), `menuItems.ts` (4 cambiadas), `RadarSearchBar.tsx` (+21/-8); `3 files changed, 26 insertions(+), 8 deletions(-)`. `git diff -- src/features/app-shell src/features/home` (worktree) → **VACÍO**.
- **TASK-06 sin cambios de código:** `git diff -- src/ App.tsx` → **VACÍO**; sin untracked. `git status --porcelain` solo muestra la modificación preexistente de `Instructions/fase_3/fase_3.md`, fuera de alcance y no tocada.
- **Estado:** `spec/features/search-bar/task.md` TASK-06 → pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO COMPLETED). `progress/current-task.json` → `active_task: TASK-06` `READY_FOR_REVIEW`, `harness_status` con evidencia y desviación.
- **PARADA CONTROLADA (gate Humano):** el Humano/Revisor debe (1) decidir sobre el warning de `SearchProvider.tsx` (autorizar fix de 1 línea o aceptar la desviación) y (2) dar el cierre formal de TASK-06/Fase 3. **NO se abrió Fase 4.**

### 2026-10-17 — TASK-06 APROBADA por el Humano — COMPLETED

- **Validación del Humano:** TASK-06 validada. El Humano autorizó y aplicó **manualmente** el fix de 1 línea en `src/features/search/presentation/SearchProvider.tsx` (eliminación del import `useContext` sin usar), resolviendo la única desviación del arnés. El agente no editó código.
- **Arnés re-ejecutado sobre el árbol con el fix:**
  - `npx tsc --noEmit` → **exit 0**.
  - `npx eslint .` → **exit 0, cero errores y cero warnings**.
  - Greps/depuración sin cambios: `any`/`TouchableOpacity`/`FlatList`/`expo-router`/`estimatedItemSize` = 0; `searchPalette.accent` fuera de `tokens.ts` = 0; `auth-*` solo en auth + `src/shared/ui/*` + `tokens.ts` (aceptado 1.5b).
  - DIP, deps (`package.json` vs baseline `3ab59f9` solo FlashList + expo-image; `app.json`/`app.config.js` sin diff), contrato (`/api/v1/app-mobile/global-search` único + `dto.ts` espejo §4.6) y chrome/radar (solo `AppDrawer.tsx`, `menuItems.ts`, `RadarSearchBar.tsx`) → **en verde**.
- **Cierre:** `spec/features/search-bar/task.md` → TASK-06 `- [x]` / `Status: COMPLETED` con validación Humana registrada. `progress/current-task.json` → `active_task: TASK-06` `COMPLETED`, `current_roadmap_phase` actualizado, `harness_status.linter` sin warnings, `fase_3_task_06_run` y `blockers_or_errors` con el cierre.
- **Gobernanza:** Fase 3 (search-bar) con TASK-01…TASK-06 **COMPLETED**. **Fase 4 NO abierta.** Sin commit (lo decide el Humano).

### 2026-10-20 — Planeación estratégica Fase 4 (Lead Planner) — decisiones APROBADAS por el Humano; CERO código RN

- **Modo:** ORQUESTACIÓN (plan/diálogo). Lectura obligatoria completada (AGENTS.md, `current-task.json`, history 2026-10-15…17, roadmap, tech-stack, mission, cierre TASK-06 de search-bar, spec §4.6/§8 de search-bar). CERO código RN, cero spec/plan/task definitivos (eso es el Paso 0, en nueva sesión). Se escribió únicamente `progress/*` con autorización expresa del Humano.
- **Mockups leídos por el Orquestador (versionados por el Humano 2026-10-20):** `spec/features/detail-obra-curso/mockups/Detalle_obra.jpg` (1198×3464) y `Detalle_capacitacion.jpg` (1348×3189). Feature = **`detail-obra-curso`** (código en `src/features/detail/`). La transcripción literal + muestreo de píxeles (Python stdlib) se harán en el Paso 0 SDD (el Worker no lee imágenes).
- **Contratos reales entregados por el Humano (verbatim — inmutables, 2 endpoints por tipo):**
  - `GET /api/v1/app-mobile/obra/{id}` → `AppMobileObraDetailDTO` (Java verbatim): `id: Long`, `name`, `municipality`, `locality`, `agency`, `investment: String` (ej. `"10495378.41"`), `progress: Integer`, `description`, `latitude/longitude: Double`, `status`, `galeryUrls: List<String>` **OPCIONAL** (puede no traer imágenes). JSON de ejemplo real: id 1, KANASIN, IDEFEEY, progress 100, FINALIZADA, 3 URLs `imagedelivery.net` (variantes `thumbnail`/`public`).
  - `GET /api/v1/app-mobile/curso/{id}` → `AppMobileCursoDetailDTO` (Java verbatim): `id`, `title`, `description`, `municipality`, `courseDate` (`"2026-07-04"`), `latitude/longitude`, `coverImageUrl`, `galeryUrls`. JSON de ejemplo real entregado. **`coverImageUrl` NO se renderiza** (decisión del Humano: `galeryUrls` ya la incluye).
  - **Navegación tipo→endpoint:** la tarjeta de Search ya trae `tipo` (`"OBRA"`/`"CURSO"`) + `idOriginal`; la app elige el endpoint por `tipo` y muestra la vista adecuada (flujo confirmado por el Humano).
- **Decisiones del Humano (2026-10-20):**
  1. **«Ver más» del popup municipal (radar 2b): se OCULTA (no se elimina)** en Fase 4; se creará una **Fase 5 placeholder** en el roadmap (Detalle Municipal) que lo reactivará en el futuro.
  2. **Carrusel de evidencias:** `FlashList` horizontal (lazy real vía reciclado) + `expo-image` (caché `memory-disk`); tarjetas estilo *peek* con caption `evidencia N` (el mockup no muestra dots → sin dots); tap en foto → se abre más grande (`Modal` nativo de RN, sin zoom/pan); si no hay imágenes → mensaje institucional. **Cero deps nuevas en toda la Fase 4.**
  3. **Header con título dinámico (chrome 2a intacto):** el header crema muestra `DETALLE` en detalle y **`BÚSQUEDA` en Search** (petición expresa del Humano: «no me gustó ver INICIO en la barra de búsqueda»); Home sigue `INICIO`. Mecanismo: `HeaderTitleProvider` (contexto ligero en `app-shell/presentation`, default `INICIO`) + `useFocusEffect` por pantalla (robusto ante goBack en native-stack). `«Resumen Ejecutivo»` del mockup **no se pinta** (redundante con `DETALLE`); back arrow vive en el cuerpo (patrón Fase 3).
  4. **Ajuste de Search confirmado:** con el header mostrando `BÚSQUEDA`, se **retira el título duplicado del cuerpo** y se conserva el back arrow en la fila 1.
  5. **Título de obra/curso en Title Case** (consistencia Fase 3; `toTitleCase` duplicado deliberado en detail, prohibido importar entre features). Descripción y filas clave-valor van verbatim.
  6. **Mapa de «Ubicación» INTERACTIVO** (zoom/pan habilitados; `pitch`/`rotate` off), `react-native-maps` `PROVIDER_GOOGLE` homologado (ya instalado), pin guinda `#6B142E`. Riesgo documentado: gesto vertical atrapado por el mapa dentro del scroll de la pantalla → se mitiga con altura moderada y lo valida el Tester Humano en físico (CA dedicado).
  7. **Fase 5 placeholder y cero deps nuevas en Fase 4: confirmados.**
- **Adjudicaciones mockup↔contrato (propuestas por el Orquestador, sin objeción del Humano):** (a) 3ª KPI de obra = **Estatus** («Empleo Local (% Personal Local)» del roadmap §4 **superseded** — no existe en el DTO); (b) monto completo formateado `$10,495,378.41` (**supersede** «$ MDP» del roadmap; `Intl.NumberFormat` hoisted — skill `js-hoist-intl`); (c) captions `evidencia N` (**supersede** Antes/En Proceso/Después — `galeryUrls` no trae fase); (d) mapa OSM, pin verde, botones +/−, footer «Report a problem © OpenStreetMap…», etiqueta «Preview» solapada y wrap «FINALIZA DA» = **artefactos del generador**; (e) serif → **Lato / Lato Bold** (precedente 1.5a/3); (f) `courseDate` → `4 de julio de 2026` con formateo manual determinista (array de meses hoisted; evita riesgos de `Intl` con locale `es` en Hermes); (g) `search-accent #C97C33` (reservado en Fase 3) se **LIBERA** como `detail-accent` en la nueva §2.6 de tech-stack (Paso 0).
- **Cambios autorizados en features cerradas (inventario completo para TASK-05, cero sorpresas):** `app-shell` (`HeaderTitleProvider` + `AppHeader` consume contexto; INICIO idéntico en Home, cero otro cambio de píxel), `search` (header `BÚSQUEDA` + retiro del título del cuerpo + tap de tarjeta navega a `Detail` con `{ tipo, id: idOriginal }`), `home` (botón «Ver más» del popup se oculta; código intacto).
- **Arquitectura propuesta (calco del patrón home/search, Clean Architecture 4 capas + SOLID):** `src/features/detail/{domain,application,infrastructure,presentation}` — entidades `ObraDetail`/`CursoDetail`, error `DetailError`, puertos `ObraDetailRepository`/`CursoDetailRepository`, closures `createObraDetail`/`createCursoDetail`, `DetailUseCases`; `dto.ts` espejo de ambos wire DTOs (`galeryUrls?: string[]` → `null`); `AxiosObraDetailApi` + `AxiosCursoDetailApi` (paths únicos grep-ables); `DetailProvider`/`useDetail` (fachada única); `DetailScreen` con `useQuery` por tipo (`queryKey: ["detail", tipo, id]`, `signal` al use case); componentes KPI (3 obra / 2 curso), `DetailMapCard`, `EvidenceCarousel` + `EvidenceViewerModal`, filas clave-valor, estados (spinner central, error, sin evidencias), `format.ts` hoisted. Ruta `Detail: { tipo: "OBRA" | "CURSO"; id: number }` en `AppStackParamList`. `compositionRoot` único importador de infra; fences ESLint vigentes. Skills obligatorias: list-performance, js-hoist-intl, ui-pressable, rendering-no-falsy-and (`progress: 0` es falsy → ternarios estrictos).
- **Orden de trabajo aprobado:** Paso 0 SDD (enmiendas `roadmap.md` §4 + Fase 5 placeholder + `tech-stack.md` §2.6 + escritura de `spec/features/detail-obra-curso/{spec,plan,task}.md`) → TASK-01 (tokens `detail-*`, cero deps) → TASK-02 (domain+application) → TASK-03 (infra + compositionRoot + DetailProvider + fences) → TASK-04 (~10 componentes presentation + ruta en `types.ts`, sin wire) → TASK-05 (wire navigator + 3 cambios en features cerradas + validación física Android+iOS) → TASK-06 (arnés).
- **Copy propuesto (se fija en el Paso 0, lo aprueba el Humano con la spec):** galería vacía → «Sin evidencias fotográficas.»; error de carga → «No se pudo cargar el detalle.»
- `progress/current-task.json` → `active_feature: detail-obra-curso`, `active_task: FASE4-PASO0-SDD` (`TODO`, bloqueado), `context_pointers` y `blockers_or_errors` actualizados.
- **PARADA CONTROLADA:** el Paso 0 SDD se ejecuta en **NUEVA SESIÓN** del Orquestador, solo al autorizarlo el Humano (patrón 2b/3). TASK-01+ quedan bloqueadas hasta que el Humano apruebe la spec escrita en el Paso 0. Sin commit (lo decide el Humano).

### 2026-10-20 — Paso 0 SDD de Fase 4 (Orquestador) — spec/plan/task ESCRITOS; CERO código RN

- **Autorización:** el Humano autorizó ejecutar el Paso 0 en la misma sesión de planeación («en esta misma sesión puedes continuar con el plan»). Rol: Orquestador — solo SDD, enmiendas constitucionales y `progress/*`. CERO código RN, cero installs, cero `npx expo start`.
- **Muestreo 2026-10-20 (Python stdlib, moda de regiones sobre fills sin texto):** los mockups son JPEG → conversión a PNG con `sips` (nativo macOS, cero instalación) y decodificación PNG stdlib (zlib+struct). Regiones localizadas con crops visuales previos. Ambos mockups arrojaron los mismos hex: fondo cuerpo `#E4E4D8`, fondo tarjetas KPI y filas `#F4F0E8`, iconos dorados `#BC803C`, labels KPI `#545454`, sublabels/captions/labels de fila `#7C7C78`, valores `#181818` (= `texto #1A1A1A` de Fase 1, sin token nuevo). **Nota de fidelidad:** el acento de Fase 4 usa su propio hex muestreado `#BC803C` (el mockup manda); `search-accent #C97C33` queda histórico, prohibido en `search/**` (tech-stack §2.5 actualizado). El header guinda del mockup (`#501020`-ish) NO se pinta (chrome congelado con título dinámico).
- **Lectura quirúrgica de soporte (para el plan):** `eslint.config.js` (bans por glob `src/features/*` ya cubren a `detail`: `react-native-maps`, `@shopify/*`, `expo-image` vetados en domain/application → **cero cambios en fences**), `compositionRoot.ts`, `App.tsx`, `AppHeader.tsx` (`INICIO` hardcodeado), `AppShell.tsx`, `RootNavigator.tsx`, `MunicipioCallout.tsx` (botón «Ver más» a ocultar), `SearchScreen.tsx` (título `BÚSQUEDA` del cuerpo a retirar), `SearchResultCard.tsx` (`handleCardPress` no-op a reemplazar).
- **Enmiendas constitucionales:**
  - `spec/constitution/roadmap.md` §4 **reescrito** contra los 2 contratos reales y los mockups (supersede: KPI «Empleo Local», «$ MDP», carrusel «Antes / En Proceso / Después»). Nueva **Fase 5: Detalle Municipal (PLACEHOLDER)** — sin spec, bloqueada hasta cerrar Fase 4; reactivará el «Ver más» oculto.
  - `spec/constitution/tech-stack.md`: nueva **§2.6** (paleta `detail-*`, 5 tokens + reglas: Lato, pin guinda, `auth-*` prohibida, `search-accent` prohibido) + nota de liberación en §2.5.
- **Artefactos SDD escritos:**
  - `spec/features/detail-obra-curso/spec.md` — 12 decisiones del Humano; tokens e iconografía Ionicons §4.1–4.4; **transcripción literal §4.5 (obra) y §4.6 (capacitación)**; **contratos verbatim §4.7** (ambos JSON reales + DTOs Java + reglas de mapeo: `galeryUrls?` → `galleryUrls: string[] | null`, `coverImageUrl` ignorado, URLs Cloudflare tal cual, `progress: 0` válido); **artefactos §4.8** (12 ítems); flujo §5; 10 desviaciones §6 (header dinámico, back en cuerpo, serif→Lato, Title Case, mapa Google interactivo, KPI Estatus una línea, sin hairlines, Ionicons, `coverImageUrl` fuera, ajuste Search); 7 reglas superseded §7; arquitectura §8 (incluye inventario exacto de cambios en features congeladas); límites §9; **CA-01…CA-10**. Estado: **PENDIENTE DE APROBACIÓN HUMANA**.
  - `spec/features/detail-obra-curso/plan.md` — árbol destino; orden anti-rompimiento; tokens verbatim §3; firmas **verbatim** de domain (5) / application (3) / infrastructure (`dto.ts` espejo + 2 Axios*Api con cancelación calcada de `AxiosGlobalSearchApi`) / `DetailProvider` + `useDetail`; `format.ts` (`MONEY_FORMATTER` Intl hoisted → `$10,495,378.41`, `MESES` hoisted → `4 de julio de 2026`, `toTitleCase` duplicado deliberado); 9 componentes presentation + `DetailScreen` (dos `useQuery` con `enabled` por tipo, `queryKey ["detail", tipo, id]`); `HeaderTitleProvider` + `useHeaderTitle` (default `INICIO`) + setters `useFocusEffect` por pantalla; `SearchResultCard` `onPress` → navigate; `MunicipioCallout` `SHOW_SEE_MORE = false`; skills §10; criterios de hecho §11; prohibiciones §12.
  - `spec/features/detail-obra-curso/task.md` — TASK-01 (tokens, **cero installs**), TASK-02 (domain+application, 8 archivos), TASK-03 (infra + compositionRoot + DetailProvider; fences sin cambios), TASK-04 (11 archivos presentation + `types.ts`, sin wire), TASK-05 (wire + 10 archivos permitidos incl. los cambios en app-shell/home/search, con gate físico CA-01…09), TASK-06 (arnés). Cada TASK con `allowed_files` estrictos.
- `progress/current-task.json` → `active_task: TASK-01` (`TODO`, **bloqueada** hasta aprobación de la spec), `context_pointers` a los 3 artefactos, `blockers_or_errors` con el bloqueo activo.
- **PARADA CONTROLADA:** el Humano revisa y aprueba `spec/features/detail-obra-curso/spec.md`. TASK-01 se autoriza en **NUEVA SESIÓN** con el Worker (DeepSeek) solo tras esa aprobación (patrón 2b/3). Sin commit (lo decide el Humano).

### 2026-10-20 — spec.md de detail-obra-curso APROBADA por el Humano

- **Aprobación:** el Humano revisó y aprobó `spec/features/detail-obra-curso/spec.md` completa (transcripción literal §4.5/§4.6, contratos verbatim §4.7, desviaciones §6 — incluida la 1: header dinámico `DETALLE` en el chrome —, artefactos §4.8 y CA-01…10). Header de la spec actualizado a **APROBADA (2026-10-20)**.
- **Estado de gobernanza:** SDD de Fase 4 completo y aprobado (spec + plan + task + enmiendas constitucionales roadmap §4 / Fase 5 placeholder / tech-stack §2.6 y §2.5). TASK-01 pasa a **TODO DESBLOQUEADA** (no IN_PROGRESS).
- **Decisión del Humano:** el Worker (DeepSeek) ejecuta TASK-01 en **nueva sesión**, puesto en contexto por el propio Humano con el prompt de ejecución preparado por el Orquestador. Cero TASK iniciada en la sesión del Orquestador.
- `progress/current-task.json` → `active_task: TASK-01` (`TODO`, desbloqueada), `current_roadmap_phase` y `blockers_or_errors` actualizados; `spec_file` marcada APROBADA.
- **Gate restante tras TASK-01:** el Humano valida el diff (solo los 5 tokens en `global.css` + `detailPalette` en `tokens.ts`; `package.json`/`app.json`/`app.config.js` **VACÍO** — Fase 4 no requiere rebuild nativo: cero deps nuevas).

### 2026-10-20 — TASK-01 (tokens detail-*, Fase 4) — READY_FOR_REVIEW (Trabajador)

- **Alcance:** SOLO tokens de la feature `detail-obra-curso`. Cero componentes, cero `src/features/detail/**`, cero `src/app/**`/`App.tsx`/navegación, cero `eslint.config.js`, cero nativos, cero `package.json`/lock, cero `app.json`/`app.config.js`. No se instaló nada (`npx expo install`/`npm i` no ejecutados), no se ejecutó `npx expo start`/`prebuild`/`run:*`, cero commit.
- **Archivos editados (2 de código + 3 de memoria):**
  - `global.css`: añadidos los 5 tokens dentro del `@theme` existente, inmediatamente tras los `search-*` (plan §3 verbatim): `--color-detail-screen-bg: #e4e4d8;`, `--color-detail-card-bg: #f4f0e8;`, `--color-detail-accent: #bc803c;`, `--color-detail-kpi-label: #545454;`, `--color-detail-text-muted: #7c7c78;`.
  - `src/shared/theme/tokens.ts`: añadido al FINAL, sin tocar las paletas existentes (plan §3 verbatim):
    ```ts
    export const detailPalette = {
      screenBg: "#E4E4D8",
      cardBg: "#F4F0E8",
      accent: "#BC803C",
      kpiLabel: "#545454",
      textMuted: "#7C7C78",
    } as const;
    ```
  - `spec/features/detail-obra-curso/task.md`, `progress/current-task.json` y `progress/history.md` (memoria/cierre).
- **Diff de tokens:** `git diff -- global.css src/shared/theme/tokens.ts` → SOLO las 6 líneas de `global.css` (5 tokens + línea en blanco de separación) y las 8 líneas de `detailPalette` en `tokens.ts`. `palette`/`fontFamily`/`authPalette`/`appPalette`/`radarPalette`/`searchPalette` intactas. `detail-accent` = `#BC803C` (NO se usó `#C97C33`, histórico de `search-accent`).
- **Arnés — typecheck:** `npx tsc --noEmit` → **exit 0**.
- **Gate de deps:** `git diff -- package.json app.json app.config.js` → **VACÍO**. Cero instalaciones.
- **Working tree:** `git status --porcelain` muestra `M global.css`, `M src/shared/theme/tokens.ts` y la modificación **preexistente** `M Instructions/fase_4/fase_4.md` (fuera de `allowed_files`, ajena a TASK-01, no tocada por el agente). Sin untracked.
- **Estado:** `spec/features/detail-obra-curso/task.md` TASK-01 → pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO COMPLETED). `progress/current-task.json` → `active_task: TASK-01` `READY_FOR_REVIEW`, `harness_status.typecheck_passed: true`, nota `fase_4_task_01_run`.
- **PARADA CONTROLADA (gate Humano):** el Humano valida el diff (solo los 5 tokens `detail-*` y `detailPalette`; `package.json`/`app.json`/`app.config.js` **VACÍO**) y da el cierre formal **COMPLETED**. **TASK-02 NO iniciada** (nueva sesión). Sin commit (lo decide el Humano).

### 2026-10-20 — TASK-01 APROBADA por el Humano — COMPLETED

- **Validación del Humano:** TASK-01 validada; diff aprobado (solo los 5 tokens `--color-detail-*` en `global.css` + `detailPalette` en `src/shared/theme/tokens.ts`; `package.json`/`app.json`/`app.config.js` **VACÍO**). Cierre formal **COMPLETED** registrado.
- **Cierre:** `spec/features/detail-obra-curso/task.md` → TASK-01 `- [x]` / `Status: COMPLETED` con validación Humana; TASK-02 marcada `TODO (desbloqueada; se ejecuta en nueva sesión)`. `progress/current-task.json` → `active_task: TASK-02` (`TODO`), `current_roadmap_phase` actualizado, `fase_4_task_01_run` y `last_run` con el cierre, `blockers_or_errors` apuntando a TASK-02.
- **Gobernanza:** TASK-02 (domain + application, 8 archivos) **NO iniciada**: se autoriza en **NUEVA SESIÓN** con el prompt de ejecución. TASK-03…06 bloqueadas. Sin commit (lo decide el Humano).

### 2026-10-20 — TASK-02 (domain + application de detail, Fase 4) — READY_FOR_REVIEW (Trabajador)

- **Alcance:** SOLO Domain + Application de `detail-obra-curso`, 8 archivos nuevos, firmas **verbatim** de plan §4.1–§5.3. Cero consumidores, cero `infrastructure/`/`presentation/`, cero componentes/navegación/providers, cero `src/app/**`/`App.tsx`/`eslint.config.js`, cero nativos, cero `package.json`/lock, cero `app.json`/`app.config.js`, cero tokens. No se instaló nada (`npx expo install`/`npm i` no ejecutados), no se ejecutó `npx expo start`/`prebuild`/`run:*`, cero commit.
- **Archivos creados (8 de código):**
  - `src/features/detail/domain/entities/ObraDetail.ts` (plan §4.1): `ObraDetail` con `id`, `name`, `municipality`, `locality`, `agency`, `investment`, `progress`, `description`, `latitude`, `longitude`, `status`, `galleryUrls: string[] | null`.
  - `src/features/detail/domain/entities/CursoDetail.ts` (plan §4.2): `CursoDetail` con `id`, `title`, `description`, `municipality`, `courseDate`, `latitude`, `longitude`, `galleryUrls: string[] | null`.
  - `src/features/detail/domain/errors/DetailError.ts` (plan §4.3, calco de `SearchError`): `DetailErrorKind` (`"network" | "server" | "unexpected"`), `DetailError`, `DETAIL_ERROR_MESSAGES` (copy verbatim), `detailError(kind)` e `isDetailError(error)`.
  - `src/features/detail/domain/ports/ObraDetailRepository.ts` (plan §4.4): `getObraById(id: number, signal?: AbortSignal): Promise<ObraDetail>`.
  - `src/features/detail/domain/ports/CursoDetailRepository.ts` (plan §4.5): `getCursoById(id: number, signal?: AbortSignal): Promise<CursoDetail>`.
  - `src/features/detail/application/types.ts` (plan §5.1): `DetailUseCases` con `getObraDetail`/`getCursoDetail` `(id: number, signal?: AbortSignal) => Promise<...>`.
  - `src/features/detail/application/obraDetail.ts` (plan §5.2): `createObraDetail(deps)` → `DetailUseCases["getObraDetail"]`.
  - `src/features/detail/application/cursoDetail.ts` (plan §5.3): `createCursoDetail(deps)` → `DetailUseCases["getCursoDetail"]`.
  - Los use cases dejan subir `DetailError` sin `catch` (patrón 2b/3). En domain el campo es `galleryUrls` (el typo `galeryUrls` del backend queda para `infrastructure/dto.ts` en TASK-03; no usado aquí).
- **Arnés — typecheck:** `npx tsc --noEmit` → **exit 0**.
- **Arnés — linter:** `npx eslint .` → **exit 0** (0 errores, 0 warnings).
- **Grep de capas:** imports de `src/features/detail` = SOLO relativos: domain → `../entities/*`; application → `../domain/ports/*` + `./types`. Cero `react`, `react-native`, `axios`, `@tanstack`, `expo-*`, `react-native-maps`, `@shopify`, `expo-image`, `@/shared`, `@/app`; cero `any`.
- **Gate de deps:** `git diff -- package.json app.json app.config.js` → **VACÍO**. Cero instalaciones.
- **Working tree:** `git status --porcelain` muestra `?? src/features/detail/` (los 8 archivos nuevos) y la modificación **preexistente** `M Instructions/fase_4/fase_4.md` (fuera de `allowed_files`, ajena a TASK-02, no tocada por el agente).
- **Estado:** `spec/features/detail-obra-curso/task.md` TASK-02 → pasos `- [x]` / `Status: READY_FOR_REVIEW` (NO COMPLETED; TASK-03 permanece `TODO`). `progress/current-task.json` → `active_task: TASK-02` `READY_FOR_REVIEW`, `harness_status.typecheck_passed: true`, nota `fase_4_task_02_run`.
- **PARADA CONTROLADA (gate Humano):** el Humano valida los 8 archivos domain/application (firmas verbatim), cero imports de framework, `npx tsc --noEmit`/`npx eslint .` en verde y `git diff -- package.json app.json app.config.js` **VACÍO**, y da el cierre formal **COMPLETED**. **TASK-03 NO se inicia en esa sesión.** Sin commit (lo decide el Humano).

### 2026-10-20 — TASK-02 APROBADA por el Humano — COMPLETED

- **Validación del Humano:** TASK-02 validada; los 8 archivos domain/application con firmas verbatim, arnés en verde (`npx tsc --noEmit` y `npx eslint .` exit 0) y gate de deps **VACÍO** aprobados. Cierre formal **COMPLETED** registrado.
- **Cierre:** `spec/features/detail-obra-curso/task.md` → TASK-02 `- [x]` / `Status: COMPLETED` con validación Humana; TASK-03 marcada `TODO (desbloqueada; se ejecuta en nueva sesión)`.
- **Estado vivo:** `progress/current-task.json` → `active_task: TASK-03` (`TODO`), `current_roadmap_phase` actualizado, `fase_4_task_02_run` y `last_run` con el cierre, `blockers_or_errors` apuntando a TASK-03.
- **Gobernanza:** TASK-03 (infrastructure + compositionRoot + DetailProvider) **NO iniciada**: se autoriza en **NUEVA SESIÓN** con el prompt de ejecución. TASK-04…06 bloqueadas. Sin commit (lo decide el Humano).
