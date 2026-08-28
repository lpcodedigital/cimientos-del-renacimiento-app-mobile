# PLAN — auth-biometric

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 1 — Shell Base, Navegación y Login Híbrido
**Feature:** `auth-biometric`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** APROBADO — listo para el Agente Trabajador
**Fecha:** 2026-08-21

> Fuente de verdad técnica. El Trabajador implementa exactamente este árbol y estas APIs. Prohibido inventar paquetes. Prohibido código nativo a mano.

---

## 1. Hallazgo de repositorio

La raíz **no** contiene un proyecto Expo. No existen `package.json`, `app.json`, `App.tsx` ni `/src`.

`TASK-01` incluye el bootstrap. Conservar intactos: `AGENTS.md`, `/spec`, `/progress`, `.agents`, `opencode.json`, `instructions.md`.

---

## 2. Bootstrap Expo (TASK-01)

### 2.1 Crear el proyecto en la raíz

Plantilla **obligatoria:** `blank-typescript` (SDK 57).

**Prohibido** `--template default`: trae Expo Router y viola `tech-stack.md` (React Navigation).

```sh
npx create-expo-app@latest . --template blank-typescript
```

Si el directorio no vacío lo rechaza:

```sh
npx create-expo-app@latest /tmp/cdr-expo-tmp --template blank-typescript
```

Copiar a la raíz **solo** artefactos Expo (`package.json`, `app.json`, `App.tsx`, `tsconfig.json`, `index.ts`/`index.js`, `assets/` de plantilla). **No** sobrescribir `/spec`, `/progress`, `AGENTS.md`, `opencode.json`.

Alternativa equivalente: scaffold manual + `npx expo install expo` y dependencias del template blank-typescript SDK 57.

### 2.2 TypeScript estricto

`tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

Prohibido `"strict": false` y el tipo `any`.

### 2.3 NativeWind v4 (estable)

NativeWind v5 está en pre-release. Fase 1 usa **v4** + Tailwind 3.4.

```sh
npx expo install nativewind react-native-reanimated react-native-safe-area-context
npx expo install --dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11
```

`babel.config.js` — presets `babel-preset-expo` (`jsxImportSource: "nativewind"`) + `nativewind/babel`.

`metro.config.js` — `withNativeWind` con `input: './global.css'`.

`tailwind.config.js`:

- `content`: `./App.tsx`, `./src/**/*.{js,jsx,ts,tsx}`
- `presets: [require("nativewind/preset")]`
- `theme.extend.colors`: tokens de la spec (`guinda`, `dorado`, `fondo`, `texto`, `texto-suave`, `error`, `superficie`)
- `theme.extend.fontFamily`: `lato: ["Lato"]`, `lato-bold: ["Lato-Bold"]`

`global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`nativewind-env.d.ts` (nombre exacto; no `nativewind.d.ts`):

```ts
/// <reference types="nativewind/types" />
```

`app.json` → `expo.web.bundler = "metro"`.

### 2.4 Navegación (React Navigation 7 + native-stack)

Mandato de constitución + skill `navigation-native-navigators`. **Cero Expo Router.**

```sh
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens
```

`react-native-safe-area-context` ya viene con NativeWind. No instalar `@react-navigation/stack` (JS stack). No instalar `@react-navigation/bottom-tabs` en Fase 1.

API **dinámica** (`NavigationContainer` + `createNativeStackNavigator`). Un solo `NavigationContainer` en la raíz.

### 2.5 Hardware y fuentes (solo Expo)

```sh
npx expo install expo-local-authentication expo-secure-store expo-font expo-splash-screen
```

```sh
npx expo install axios @tanstack/react-query
```

TanStack Query se instala y se monta el `QueryClientProvider` en Fase 1 (tech-stack). El login usa una mutación Axios directa o `useMutation`; no hay queries de negocio.

Lato: descargar TTF oficiales (SIL OFL) a `assets/fonts/`:

- `Lato-Regular.ttf`
- `Lato-Bold.ttf`
- Opcional: `Lato-Light.ttf`

Carga runtime con `useFonts` (mandato `tech-stack.md`: «cargada asíncronamente mediante expo-font»). El config plugin de `expo-font` es opcional y **no sustituye** `useFonts` en esta fase (permite Expo Go).

Iconos: `@expo/vector-icons` (viene con Expo) o `lucide-react-native` si se instala con `npx expo install`. Preferir `@expo/vector-icons` para no sumar paquete. Prohibido otras librerías de iconos.

### 2.6 app.json — plugins (cero Info.plist a mano)

```json
{
  "expo": {
    "name": "Gabinete Móvil",
    "slug": "cimientos-del-renacimiento",
    "ios": {
      "config": { "usesNonExemptEncryption": false }
    },
    "plugins": [
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "El Gabinete Móvil usa Face ID para desbloquear tu sesión institucional sin escribir la contraseña."
        }
      ],
      [
        "expo-secure-store",
        {
          "configureAndroidBackup": true,
          "faceIDPermission": "El Gabinete Móvil usa Face ID para proteger el acceso a tu sesión institucional."
        }
      ]
    ]
  }
}
```

Prohibido editar `.swift`, `.kt`, `.java`, `Info.plist`, `AndroidManifest.xml`, `.pbxproj`.

### 2.7 ESLint + scripts del arnés

```sh
npx expo install --dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
```

Scripts en `package.json`:

- `"lint": "eslint ."`
- `"typecheck": "tsc --noEmit"`

El Revisor ejecuta `npx eslint .` y `npx tsc --noEmit`.

---

## 3. Árbol de módulos (todo el producto en `/src`)

```
/
├── App.tsx                          # Bootstrap: fonts, splash, providers, NavigationContainer
├── global.css
├── tailwind.config.js
├── metro.config.js
├── babel.config.js
├── nativewind-env.d.ts
├── app.json
├── tsconfig.json
├── package.json
├── assets/fonts/                    # Lato-Regular.ttf, Lato-Bold.ttf
└── src/
    ├── theme/
    │   └── tokens.ts                # hex + nombres de fontFamily (const, no StyleSheet)
    ├── lib/
    │   └── http/
    │       └── axiosClient.ts       # instancia Axios + interceptor Bearer
    ├── navigation/
    │   ├── types.ts                 # RootStackParamList
    │   └── RootNavigator.tsx        # Native Stack Auth | App
    ├── features/
    │   └── auth/
    │       ├── dto.ts               # AuthRequestDTO, AuthResponseDTO, AuthBasicUserResponseDTO
    │       ├── api.ts               # loginRequest()
    │       ├── tokenStore.ts        # SecureStore wrappers
    │       ├── biometricService.ts  # hasHardware / isEnrolled / authenticate
    │       ├── AuthProvider.tsx     # estado de sesión
    │       └── useAuth.ts           # hook consumidor
    ├── components/
    │   └── ui/
    │       ├── Button.tsx           # compound: Button + ButtonText
    │       ├── TextField.tsx
    │       └── InstitutionalText.tsx
    └── screens/
        ├── auth/
        │   ├── LoginScreen.tsx
        │   └── BiometricUnlockScreen.tsx
        └── app/
            └── HomePlaceholderScreen.tsx
```

`App.tsx` permanece en la raíz porque la plantilla `blank-typescript` lo exige como entry. **Toda** pantalla, componente, DTO y navegación vive en `/src`.

Prohibido crear `app/` de Expo Router. Prohibido pantallas fuera de `/src/screens`.

---

## 4. Arquitectura de sesión

### 4.1 DTOs (`src/features/auth/dto.ts`)

Espejo exacto del backend. Sin `any`. `expiresAt` se tipa `string` (ISO) en el cliente. `mfaRequired: boolean`.

### 4.2 tokenStore (`src/features/auth/tokenStore.ts`)

Claves: `jwt`, `expires_at`, `user_snapshot`, `biometric_enabled`.

API async:

- `saveSession({ token, expiresAt, user })`
- `loadSession(): Promise<Session | null>`
- `clearSession()`
- `setBiometricEnabled(value: boolean)`
- `getBiometricEnabled(): Promise<boolean>`

Opciones SecureStore: `{ keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }`.

`user_snapshot` es `JSON.stringify` del DTO. Si el parse falla, tratar como sesión inválida y limpiar.

### 4.3 biometricService (`src/features/auth/biometricService.ts`)

APIs Expo SDK 57 (`expo-local-authentication`):

| Método | Uso |
| --- | --- |
| `hasHardwareAsync()` | ¿Hay sensor? |
| `isEnrolledAsync()` | ¿Hay Face ID / huella enrolada? |
| `supportedAuthenticationTypesAsync()` | Copy: Face ID vs huella |
| `getEnrolledLevelAsync()` | Opcional; no bloquear si es `BIOMETRIC_WEAK` en Android |
| `authenticateAsync(options)` | Prompt de desbloqueo / opt-in |

Opciones de `authenticateAsync`:

```ts
{
  promptMessage: "Desbloquear Gabinete Móvil",
  cancelLabel: "Cancelar",
  disableDeviceFallback: false,
  biometricsSecurityLevel: "strong"
}
```

Resultado: discriminar `success` vs `error` (`user_cancel`, `lockout`, `not_enrolled`, `not_available`, `authentication_failed`, `user_fallback`, `system_cancel`).

No usar `SecureStore.requireAuthentication` para el JWT en Fase 1: el prompt biométrico es **explícito** vía `expo-local-authentication` (flujo de producto). El JWT se lee tras el éxito.

### 4.4 axiosClient

- `baseURL: process.env.EXPO_PUBLIC_API_URL`
- `timeout: 15000`
- `Content-Type: application/json`
- Interceptor request: si hay token en memoria (AuthProvider), adjuntar `Authorization: Bearer <token>`
- No loguear bodies de login ni tokens

`EXPO_PUBLIC_API_URL` se documenta en `.env.example`. El Trabajador crea `.env.example` con un placeholder. El Humano pone la URL real. Si falta la URL, el login muestra error institucional (no crash).

### 4.5 AuthProvider

Estado mínimo (ground truth):

```ts
type AuthStatus = "bootstrapping" | "unauthenticated" | "needs_biometric" | "authenticated";

type AuthState = {
  status: AuthStatus;
  token: string | null;
  user: AuthBasicUserResponseDTO | null;
  expiresAt: string | null;
};
```

Acciones: `signIn(email, password)`, `unlockWithBiometrics()`, `declineBiometricOptIn()`, `enableBiometricAfterLogin()`, `signOut()`.

`signIn`:

1. Validar email/password en cliente.
2. `loginRequest`.
3. Si `mfaRequired` o `!user.active` → throw de dominio (mensajes de la spec). No persistir.
4. `saveSession`.
5. `status = "authenticated"`.
6. El opt-in biométrico lo orquesta `LoginScreen` (no el provider), llamando `enableBiometricAfterLogin` solo si el usuario acepta y `authenticateAsync` es success.

Al bootstrap: `loadSession` → si token vigente y biometric enabled y hardware+enrolled → `needs_biometric`; si token vigente sin biometría → `authenticated`; si no → `unauthenticated`.

### 4.6 RootNavigator

```
status === bootstrapping        → splash / null (fuentes + sesión)
status === unauthenticated      → stack Auth: Login
status === needs_biometric      → stack Auth: BiometricUnlock
status === authenticated        → stack App: HomePlaceholder
```

Cambio de raíz = desmontar el stack contrario (no apilar Login sobre Home). `headerShown: false` en Auth. En App, header nativo institucional (`headerStyle` guinda, `headerTintColor` fondo/blanco, título «INICIO», `headerTitleStyle` Lato Bold). Prohibido header JS custom.

---

## 5. UI — reglas de implementación

### 5.1 LoginScreen

- Fondo `bg-fondo`. Título institucional en Lato Bold, color `guinda`.
- Subtítulo: «Gabinete Móvil — Gobierno del Estado de Yucatán».
- `TextField` email (`keyboardType="email-address"`, `autoCapitalize="none"`, `autoCorrect={false}`).
- `TextField` password (`secureTextEntry`).
- `Button` primario `bg-guinda` + `ButtonText` blanco Lato Bold. `Pressable`. Disabled si inválido o pending.
- Zona de error en `text-error`. Ternarios / `!!error`, nunca `{error && <Text>}`.
- Todo string dentro de `<Text>`.
- Tras éxito, si `canUseBiometrics()`: diálogo / bloque institucional (no modal de librería extra) con dos `Pressable`: «Usar Face ID / huella» y «Ahora no».

### 5.2 BiometricUnlockScreen

- Misma marca. Un `Button` «Desbloquear» que dispara `authenticateAsync` (también auto-trigger al montar, una sola vez).
- Link/botón secundario: «Usar correo y contraseña» → `signOut()`.

### 5.3 HomePlaceholderScreen

- Header nativo «INICIO».
- Cuerpo: saludo con `user.name`, copy «Radar territorial disponible en la siguiente fase».
- `Button` «Cerrar sesión».
- Cero mapa, cero GPS, cero FlashList.

### 5.4 Componentes UI

- `Button` / `ButtonText`: compound. Children no son `string | ReactNode` ambiguo.
- `TextField`: label + input + error opcional. NativeWind.
- `InstitutionalText`: wrapper de `Text` con `font-lato` / `font-lato-bold`.
- Importar UI desde `@/components/ui/...` (skill design-system).

### 5.5 Fuentes en App.tsx

```ts
SplashScreen.preventAutoHideAsync();
const [loaded, error] = useFonts({
  Lato: require("./assets/fonts/Lato-Regular.ttf"),
  "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
});
```

Ocultar splash cuando `loaded || error`. Si fallan las fuentes, continuar (no deadlock).

---

## 6. Skills de rendimiento / UI aplicables

| Skill | Aplicación en Fase 1 |
| --- | --- |
| `ui-pressable` | Único primitive de tap |
| `navigation-native-navigators` | Solo `createNativeStackNavigator` |
| `rendering-no-falsy-and` | Ternarios / `!!` |
| `rendering-text-in-text-component` | Strings solo en `Text` |
| `react-state-minimize` | Status como ground truth; no duplicar `isLoggedIn` + `token` |
| `design-system-compound-components` | Button + ButtonText |
| `imports-design-system-folder` | Imports desde `@/components/ui` |
| `ui-styling` | NativeWind; `gap` no márgenes sueltos en hijos |
| `fonts-config-plugin` | No bloquea `useFonts` (mandato tech-stack). Plugin opcional. |
| `list-performance-*` | No aplica aún; queda la prohibición de `FlatList` |

---

## 7. Dependencias autorizadas (cierre)

**Constitución:** `react-native`, `expo`, `typescript`, `nativewind`, `@react-navigation/native`, `@react-navigation/native-stack`, `expo-font`, `expo-local-authentication`, `expo-secure-store`, `axios`, `@tanstack/react-query`, `lucide-react-native` **o** `@expo/vector-icons`.

**Peers obligatorios (documentados, no “inventados”):**

- `react-native-reanimated`, `react-native-safe-area-context` (NativeWind)
- `react-native-screens` (native-stack)
- `expo-splash-screen` (carga de Lato)
- `tailwindcss@^3.4.17` (dev, NativeWind v4)
- ESLint + plugins TypeScript/React (arnés)

**Prohibido:** Expo Router, `@react-navigation/stack`, `@react-navigation/bottom-tabs` (Fase 1), `@shopify/flash-list` (Fase 3), `react-native-maps` / `expo-location` (Fase 2), `@expo-google-fonts/*`, `AsyncStorage`, `TouchableOpacity`, `FlatList`, librerías MFA, bottom-sheets JS.

Instalación nativa: **siempre** `npx expo install`. Nunca `npm i` / `yarn add` para módulos nativos.

---

## 8. Orden de implementación

El Trabajador sigue `task.md` en orden. No adelantar TASK-0N+1 si TASK-0N no está marcada `[x]` y el arnés de esa task no aplica o no pasó.

Tras TASK-06, el **Revisor** (no el Trabajador) corre el arnés completo y actualiza `progress/`. El **Humano** es el único que ejecuta `npx expo start` y prueba Face ID.

---

## 9. Notas de APIs Expo SDK 57 (consultadas)

Context7 MCP no estuvo disponible (API key). Consulta oficial:

- [LocalAuthentication SDK 57](https://docs.expo.dev/versions/latest/sdk/local-authentication/) — `authenticateAsync`, `hasHardwareAsync`, `isEnrolledAsync`, `supportedAuthenticationTypesAsync`, plugin `faceIDPermission`. Face ID no soportado en Expo Go.
- [SecureStore SDK 57](https://docs.expo.dev/versions/latest/sdk/securestore/) — `setItemAsync` / `getItemAsync` / `deleteItemAsync`, `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, `usesNonExemptEncryption`, persistencia iOS Keychain post-uninstall (no depender de ello).
- [Font SDK 57](https://docs.expo.dev/versions/latest/sdk/font/) — `useFonts` + splash. Config plugin opcional (requiere prebuild; no Expo Go).
- NativeWind v4 docs — `tailwindcss@^3.4.17`, `withNativeWind`, `nativewind/babel`.
- React Navigation 7 — `createNativeStackNavigator` + un `NavigationContainer`.

---

## 10. Criterio de “hecho” técnico

Fase 1 está lista para el Tester Visual Humano cuando:

1. El árbol de la sección 3 existe.
2. CA-01 … CA-11 de `spec.md` son implementables / implementados.
3. `npx eslint .` y `npx tsc --noEmit` pasan.
4. No hay rutas Expo Router ni código nativo a mano.
5. `progress/current-task.json` refleja TASK-06 y el Revisor registra el arnés.
