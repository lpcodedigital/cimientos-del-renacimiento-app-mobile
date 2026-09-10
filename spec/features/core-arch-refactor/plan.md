# PLAN — core-arch-refactor

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 1.5b — Refactor arquitectónico
**Feature:** `core-arch-refactor`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** APROBADO — listo para el Agente Trabajador **solo cuando el Humano autorice TASK-01**
**Fecha:** 2026-09-10

> Fuente de verdad técnica. El Trabajador implementa exactamente este árbol, estas firmas y este orden. Prohibido inventar paquetes, clases de use case, barrels filtrantes o “mejoras” de flujo.

---

## 1. Hallazgos de repositorio (baseline 1.5a)

Verificado por el Orquestador el 2026-09-10:

- Auth vive plano en `src/features/auth/`: `AuthProvider.tsx` orquesta api + tokenStore + biometricService + `setAuthToken` (viola DIP).
- `BiometricOptInScreen` importa `getSupportedBiometricMethods` desde `biometricService` (presentation → infra).
- `useAuth.ts` reexporta el hook del Provider (se conserva la fachada pública).
- HTTP: `src/lib/http/axiosClient.ts` (token en memoria + interceptor Bearer).
- UI compartida: `src/components/ui/*`. Theme: `src/theme/tokens.ts`. Asset: `src/assets/images.ts`.
- Nav: `src/navigation/RootNavigator.tsx` con `key={status}`.
- `App.tsx`: fonts + `QueryClientProvider` + `AuthProvider` + `RootNavigator` + `StatusBar style="light"`.
- Login demo y mapeo 400/401/403/5xx/MFA/inactive viven en `api.ts`.
- `clearSession()` no borra `biometric_enabled`. `signOut` sí llama `setBiometricEnabled(false)`.

---

## 2. Árbol destino (congelado)

```
App.tsx                                              # entry Expo (no se mueve de raíz)
src/app/compositionRoot.ts                           # ÚNICO lugar que importa infrastructure
src/app/navigation/types.ts
src/app/navigation/RootNavigator.tsx

src/features/auth/domain/entities/User.ts
src/features/auth/domain/entities/Session.ts
src/features/auth/domain/errors/AuthError.ts
src/features/auth/domain/sessionLifecycle.ts
src/features/auth/domain/ports/SessionRepository.ts
src/features/auth/domain/ports/BiometricGateway.ts
src/features/auth/domain/ports/AuthApi.ts
src/features/auth/domain/ports/AuthTokenHolder.ts

src/features/auth/application/types.ts               # AuthUseCases (contrato de inyección)
src/features/auth/application/bootstrapSession.ts
src/features/auth/application/signIn.ts
src/features/auth/application/unlockWithBiometrics.ts
src/features/auth/application/enableBiometric.ts
src/features/auth/application/declineBiometricOptIn.ts
src/features/auth/application/signOut.ts
src/features/auth/application/listBiometricMethods.ts

src/features/auth/infrastructure/dto.ts
src/features/auth/infrastructure/AxiosAuthApi.ts
src/features/auth/infrastructure/SecureStoreSessionRepository.ts
src/features/auth/infrastructure/ExpoBiometricGateway.ts
src/features/auth/infrastructure/AxiosAuthTokenHolder.ts

src/features/auth/presentation/AuthProvider.tsx
src/features/auth/presentation/useAuth.ts
src/features/auth/presentation/screens/LoginScreen.tsx
src/features/auth/presentation/screens/BiometricOptInScreen.tsx
src/features/auth/presentation/screens/BiometricUnlockScreen.tsx

src/features/home/presentation/HomePlaceholderScreen.tsx

src/shared/ui/{AuthScaffold,GoldButton,BiometricMethodCard,TextField,Button,InstitutionalText}.tsx
src/shared/theme/tokens.ts
src/shared/assets/images.ts
src/shared/infrastructure/http/axiosClient.ts
```

Prohibido `src/domain/` global. Prohibido `index.ts` barrels entre capas.

---

## 3. Mapping origen → destino

| Origen (1.5a) | Destino | Notas |
| --- | --- | --- |
| `src/features/auth/dto.ts` | `infrastructure/dto.ts` | wire only |
| campos de `AuthBasicUserResponseDTO` | `domain/entities/User.ts` | mismos nombres de campo |
| `PersistedSession` | `domain/entities/Session.ts` | `{ token, expiresAt, user }` |
| `AuthDomainError` / `AuthErrorKind` | `domain/errors/AuthError.ts` | mismo shape `{ kind, message }` |
| `AuthStatus` / `BiometricUnlockMode` / `isSessionVigente` | `domain/sessionLifecycle.ts` | |
| tipos biométricos (`BiometricAvailability`, `BiometricMethodKind`, `BiometricFallbackReason`) | `domain/ports/BiometricGateway.ts` | el puerto los exporta |
| `api.ts` | `infrastructure/AxiosAuthApi.ts` | demo login + POST intactos |
| `tokenStore.ts` | `infrastructure/SecureStoreSessionRepository.ts` | mismas claves y opciones |
| `biometricService.ts` | `infrastructure/ExpoBiometricGateway.ts` | mismos prompts iOS/Android |
| `setAuthToken` (uso desde Provider) | puerto `AuthTokenHolder` + `AxiosAuthTokenHolder` | axiosClient no sale de infra |
| `AuthProvider.tsx` / `useAuth.ts` | `presentation/` | deps por props |
| `src/screens/auth/*` | `presentation/screens/` | JSX intacto; solo imports |
| `src/screens/app/HomePlaceholderScreen.tsx` | `features/home/presentation/` | |
| `src/navigation/*` | `src/app/navigation/` | |
| `src/components/ui/*` | `src/shared/ui/` | |
| `src/theme/tokens.ts` | `src/shared/theme/tokens.ts` | |
| `src/assets/images.ts` | `src/shared/assets/images.ts` | ruta relativa al PNG se ajusta |
| `src/lib/http/axiosClient.ts` | `src/shared/infrastructure/http/axiosClient.ts` | |

Durante TASK-03 los paths viejos de auth/http quedan como **shims de reexport** (un archivo = reexport). Se borran en TASK-06.

---

## 4. Domain — firmas exactas

### 4.1 `User.ts`

```ts
export interface User {
  idUser: number;
  name: string;
  email: string;
  active: boolean;
  role: string;
  isFirstLogin: boolean;
}
```

### 4.2 `Session.ts`

```ts
import type { User } from "./User";

export interface Session {
  token: string;
  expiresAt: string;
  user: User;
}
```

### 4.3 `sessionLifecycle.ts`

```ts
export type AuthStatus =
  | "bootstrapping"
  | "unauthenticated"
  | "biometric_opt_in"
  | "needs_biometric"
  | "authenticated";

export type BiometricUnlockMode = "auto" | "manual";

export function isSessionVigente(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() > Date.now();
}
```

### 4.4 `AuthError.ts`

```ts
export type AuthErrorKind =
  | "invalid_credentials"
  | "server_unreachable"
  | "mfa_required"
  | "account_inactive";

export interface AuthError {
  kind: AuthErrorKind;
  message: string;
}

export const AUTH_ERROR_MESSAGES: Record<AuthErrorKind, string> = {
  invalid_credentials: "Correo o contraseña incorrectos.",
  server_unreachable: "No fue posible contactar al servidor.",
  mfa_required:
    "El acceso con segundo factor no está disponible en el Gabinete Móvil. Usa la plataforma web.",
  account_inactive: "La cuenta no está activa.",
};

export function authError(kind: AuthErrorKind): AuthError {
  return { kind, message: AUTH_ERROR_MESSAGES[kind] };
}
```

### 4.5 Puertos

`SessionRepository`:

```ts
import type { Session } from "../entities/Session";

export interface SessionRepository {
  save(session: Session): Promise<void>;
  load(): Promise<Session | null>;
  clear(): Promise<void>;
  setBiometricEnabled(value: boolean): Promise<void>;
  getBiometricEnabled(): Promise<boolean>;
}
```

`clear()` **no** borra `biometric_enabled`.

`BiometricGateway`:

```ts
export type BiometricAvailability = { hasHardware: boolean; isEnrolled: boolean };
export type BiometricMethodKind = "facial" | "fingerprint" | "iris" | "none";
export type BiometricFallbackReason =
  | "success"
  | "user_cancel"
  | "lockout"
  | "not_enrolled"
  | "not_available"
  | "authentication_failed"
  | "fallback";

export interface BiometricGateway {
  getAvailability(): Promise<BiometricAvailability>;
  authenticate(): Promise<BiometricFallbackReason>;
  confirmOptIn(): Promise<boolean>;
  getSupportedMethods(): Promise<BiometricMethodKind[]>;
}
```

`AuthApi`:

```ts
import type { Session } from "../entities/Session";

export interface AuthApi {
  login(email: string, password: string): Promise<Session>;
}
```

Lanza `AuthError` (objeto, no `Error`) en los mismos casos que `loginRequest` actual.

`AuthTokenHolder`:

```ts
export interface AuthTokenHolder {
  setToken(token: string | null): void;
}
```

**Regla de domain:** cero imports de `react`, `react-native`, `expo-*`, `axios`, `@tanstack/*`, `@/features/*/infrastructure`, `@/features/*/application`, `@/features/*/presentation`, `@/shared`, `@/app`.

---

## 5. Application — casos de uso (funciones)

Cada archivo exporta una **factory** que cierra sobre puertos y devuelve la función de caso de uso. Cero React. Cero infra concreta.

### 5.1 Snapshot (contrato interno Provider ← use case)

```ts
import type { User } from "../domain/entities/User";
import type {
  AuthStatus,
  BiometricUnlockMode,
} from "../domain/sessionLifecycle";

export interface SessionSnapshot {
  status: AuthStatus;
  token: string | null;
  user: User | null;
  expiresAt: string | null;
  canUseBiometricLogin: boolean;
  biometricUnlockMode: BiometricUnlockMode;
}

export const EMPTY_UNAUTHENTICATED: SessionSnapshot = {
  status: "unauthenticated",
  token: null,
  user: null,
  expiresAt: null,
  canUseBiometricLogin: false,
  biometricUnlockMode: "auto",
};
```

Vive en `application/types.ts` junto a:

```ts
import type { BiometricMethodKind } from "../domain/ports/BiometricGateway";
import type { SessionSnapshot } from "./types"; // colocalizar

export interface AuthUseCases {
  bootstrapSession: () => Promise<SessionSnapshot>;
  signIn: (email: string, password: string) => Promise<SessionSnapshot>;
  unlockWithBiometrics: () => Promise<SessionSnapshot>;
  enableBiometric: () => Promise<SessionSnapshot>;
  declineBiometricOptIn: () => Promise<SessionSnapshot>;
  signOut: () => Promise<SessionSnapshot>;
  listBiometricMethods: () => Promise<BiometricMethodKind[]>;
}
```

(`SessionSnapshot` y `AuthUseCases` en el mismo `types.ts`.)

### 5.2 Transiciones (copia fiel de 1.5a plan §3.3)

| Use case | Condición | Snapshot |
| --- | --- | --- |
| `bootstrapSession` | sin JWT / expirado | `clear()` si había basura; `tokenHolder.setToken(null)`; `EMPTY_UNAUTHENTICATED` |
| `bootstrapSession` | JWT vigente + `biometric_enabled` + HW+enrolled | status `needs_biometric`, mode `"auto"`, token en holder, `canUseBiometricLogin: true` |
| `bootstrapSession` | JWT vigente sin ese trío | status `authenticated`, mode `"auto"`, token en holder, `canUseBiometricLogin` = `biometric_enabled && vigente` (igual que hoy) |
| `signIn` | `AuthApi.login` OK, sin HW/enrolled | save session, setToken, status `authenticated`. **No** tocar `canUseBiometricLogin` (queda el valor previo del snapshot que el Provider sustituye entero: el use case debe devolver `canUseBiometricLogin: false` — ver nota) |
| `signIn` | HW + `getBiometricEnabled()===true` | save, setToken, mode `"manual"`, status `needs_biometric`, `canUseBiometricLogin: false` |
| `signIn` | HW + no activada | save, setToken, status `biometric_opt_in`, `canUseBiometricLogin: false` |
| `declineBiometricOptIn` | — | `setBiometricEnabled(false)`, status `authenticated` (conservar token/user/expiresAt del load o del estado: el use case **load** sesión vigente y la reexpone; si no hay, no debería llamarse) |
| `enableBiometric` | `confirmOptIn()===true` | `setBiometricEnabled(true)`, mode `"manual"`, status `needs_biometric` |
| `enableBiometric` | false | `setBiometricEnabled(false)`, status `authenticated` (login no revertido) |
| `unlockWithBiometrics` | sesión ausente/expirada | `clear()`, setToken null, `EMPTY_UNAUTHENTICATED` (**no throw**) |
| `unlockWithBiometrics` | `authenticate()!=="success"` | **throw `new Error(reason)`** con exactamente: lockout → `"Demasiados intentos fallidos. Usa tu correo y contraseña."`; `not_enrolled`/`not_available` → `"No hay Face ID / huella configurado en este dispositivo."`; resto → `"Desbloqueo cancelado o no reconocido. Inténtalo de nuevo."`. El Provider no cambia status (permanece `needs_biometric`) |
| `unlockWithBiometrics` | success | status `authenticated`, token/user/expiresAt de la sesión, setToken |
| `signOut` | — | **primero** conceptualmente el Provider hoy setea estado y **después** `Promise.allSettled([clear(), setBiometricEnabled(false)])`. El use case: `tokenHolder.setToken(null)` + `allSettled` de clear+flag false + return `EMPTY_UNAUTHENTICATED` |
| `listBiometricMethods` | — | `gateway.getSupportedMethods()` |

**Nota `canUseBiometricLogin` en `signIn`:** el Provider actual **no** llama `setCanUseBiometricLogin` dentro de `signIn` (el state previo permanece). Tras un login desde `unauthenticated` ese valor ya es `false`. El snapshot de `signIn` **debe** llevar `canUseBiometricLogin: false` para no introducir un set implícito distinto. No calcular `true` aunque `previouslyEnabled`.

**Nota `decline` / `enable`:** deben reexponer `token`/`user`/`expiresAt` vigentes (load sesión). No limpiar el JWT.

`signIn` **no** catch-ea `AuthError`: lo deja subir (LoginScreen lee `error.message`).

### 5.3 Factories (ejemplo de forma, no de lógica extra)

```ts
export function createSignIn(deps: {
  authApi: AuthApi;
  sessionRepository: SessionRepository;
  biometricGateway: BiometricGateway;
  tokenHolder: AuthTokenHolder;
}): AuthUseCases["signIn"] { /* … */ }
```

Mismo patrón para los siete. Nombres de archivo = camelCase del use case.

---

## 6. Infrastructure

### 6.1 `dto.ts`

Copiar **verbatim** las tres interfaces actuales de `src/features/auth/dto.ts`.

### 6.2 `AxiosAuthApi`

- `demoLogin` idéntico (`demo@cdr.mx` / `demo1234`, token `demo-token-${Date.now()}`, expires +8h, user Juan Pérez, etc.).
- `POST /api/auth/login` con `AuthRequestDTO` `{ email, password }`.
- Mapeo de errores idéntico (mfaRequired, `user.active===false`, Axios 400/401/403 → invalid_credentials, else server_unreachable).
- Usa `authError()` de domain.
- Return: `Session` mapeado 1:1 desde `AuthResponseDTO` (`token`, `expiresAt`, `user`).
- Importa `axiosClient` desde `@/shared/infrastructure/http/axiosClient` (path destino; durante TASK-03 si axios aún no se movió, el shim viejo reexporta).

### 6.3 `SecureStoreSessionRepository`

Claves y `SECURE_STORE_OPTIONS` **verbatim**. Parse fallido de `user_snapshot` → `clear()` y `null`. JSON.stringify del `User` domain (mismos campos).

### 6.4 `ExpoBiometricGateway`

Portar `biometricService.ts` **sin cambiar prompts, Platform.OS branches, Android `getEnrolledLevelAsync`, iOS `disableDeviceFallback`/`fallbackLabel`**. Métodos del puerto = los cuatro del §4.5.

### 6.5 `AxiosAuthTokenHolder`

```ts
import { setAuthToken } from "@/shared/infrastructure/http/axiosClient";

export function createAxiosAuthTokenHolder(): AuthTokenHolder {
  return { setToken: setAuthToken };
}
```

### 6.6 `axiosClient`

Move fiel: `baseURL: process.env.EXPO_PUBLIC_API_URL`, timeout 15000, interceptor Bearer, `setAuthToken`/`getAuthToken`. Cero logs de token.

---

## 7. Composition root y presentation

### 7.1 `src/app/compositionRoot.ts`

```ts
export function createAuthUseCases(): AuthUseCases {
  const tokenHolder = createAxiosAuthTokenHolder();
  const sessionRepository = createSecureStoreSessionRepository();
  const biometricGateway = createExpoBiometricGateway();
  const authApi = createAxiosAuthApi();
  return {
    bootstrapSession: createBootstrapSession({ sessionRepository, biometricGateway, tokenHolder }),
    signIn: createSignIn({ authApi, sessionRepository, biometricGateway, tokenHolder }),
    unlockWithBiometrics: createUnlockWithBiometrics({ sessionRepository, biometricGateway, tokenHolder }),
    enableBiometric: createEnableBiometric({ sessionRepository, biometricGateway }),
    declineBiometricOptIn: createDeclineBiometricOptIn({ sessionRepository }),
    signOut: createSignOut({ sessionRepository, tokenHolder }),
    listBiometricMethods: createListBiometricMethods({ biometricGateway }),
  };
}
```

Adapters también como factories (no clases). Invocar **una vez a nivel de módulo** en `App.tsx`:

```ts
const authUseCases = createAuthUseCases();
// …
<AuthProvider useCases={authUseCases}>
```

No instanciar dentro de `App()`. Conservar `useFonts`, `SplashScreen`, `QueryClientProvider`, `StatusBar`, `global.css`.

### 7.2 `AuthProvider`

- Props: `{ children, useCases: AuthUseCases }`.
- Estado React idéntico: `status`, `token`, `user`, `expiresAt`, `canUseBiometricLogin`, `biometricUnlockMode` + `bootstrapped` ref.
- Bootstrap `useEffect`: `useCases.bootstrapSession()` → aplica snapshot (mismo `active` flag de cleanup).
- Acciones: delegan al use case y `applySnapshot`. `unlockWithBiometrics` **re-lanza** el `Error` del use case (UnlockScreen depende de ello). Si el use case retorna `unauthenticated` por sesión vencida, aplicar snapshot y **no throw**.
- **Cero** imports de api/tokenStore/biometricService/axiosClient.
- `useAuth()` se exporta desde el Provider (como hoy) y `presentation/useAuth.ts` reexporta la misma fachada **más** `listBiometricMethods: () => Promise<BiometricMethodKind[]>`.

API pública de `useAuth` (congelada + 1 método):

```
status, token, user, expiresAt, canUseBiometricLogin, biometricUnlockMode,
signIn, unlockWithBiometrics, declineBiometricOptIn, enableBiometricAfterLogin,
signOut, listBiometricMethods
```

El nombre `enableBiometricAfterLogin` se **conserva** en el contexto (1.5a). Por dentro llama `useCases.enableBiometric`.

### 7.3 Pantallas

- Login / Unlock / Home: **solo cambiar imports** de path. Cero JSX/estilo.
- Opt-In: sustituir import de `biometricService` por `const { listBiometricMethods } = useAuth()` y `listBiometricMethods()` en el `useEffect` de montaje. Cero cambios visuales. Tipo `BiometricMethodKind` se importa de domain **o** se reexporta desde `useAuth` (preferir reexport desde `useAuth` para no forzar a la pantalla a conocer la ruta de domain; si importa domain, es legal DIP).

### 7.4 Navegación / shared UI

Move + actualizar imports. Conservar `NavigationContainer key={status}`, `AUTH_INITIAL_ROUTE`, header App. `imageAssets` path relativo: desde `src/shared/assets/images.ts` hacia `../../../assets/images/escudo-yucatan.png`.

---

## 8. Orden de movimiento (anti-rompimiento)

```
TASK-01  domain (archivos nuevos; nada consume aún)
TASK-02  application (archivos nuevos; nada consume aún)
TASK-03  infrastructure canónica + shims de reexport en paths 1.5a
         (App sigue compilando contra shims; adapters ya existen)
TASK-04  compositionRoot + AuthProvider DIP + OptIn listBiometricMethods + App.tsx wiring
TASK-05  move presentation/nav/ui/theme/assets/home (solo imports)
TASK-06  borrar shims y dirs vacíos; eslint no-restricted-imports; arnés
```

No adelantar. Cada task deja `npx tsc --noEmit` verde.

---

## 9. ESLint fences (TASK-06, sin paquete nuevo)

Usar `no-restricted-imports` en `eslint.config.js` (regla core). Tres bloques `files`:

1. `src/features/*/domain/**` — prohibir: `react`, `react-native`, `axios`, `@tanstack/**`, `expo-secure-store`, `expo-local-authentication`, `expo-font`, `expo-linear-gradient`, `@/features/*/application/**`, `@/features/*/infrastructure/**`, `@/features/*/presentation/**`, `@/shared/**`, `@/app/**`.
2. `src/features/*/application/**` — prohibir: `react`, `react-native`, `axios`, `expo-*` listados, `@/features/*/infrastructure/**`, `@/features/*/presentation/**`, `@/shared/infrastructure/**`, `@/app/**`.
3. `src/features/*/presentation/**`, `src/app/navigation/**`, `src/shared/ui/**` — prohibir: `@/features/*/infrastructure/**`, `@/shared/infrastructure/**`, `expo-secure-store`, `expo-local-authentication`, `axios`.

`src/app/compositionRoot.ts` **no** entra en esos globs (puede importar infra). `App.tsx` tampoco.

---

## 10. Skills aplicables

| Skill | Aplicación |
| --- | --- |
| `ui-pressable` | no reintroducir `TouchableOpacity` al mover pantallas |
| `rendering-no-falsy-and` | no convertir ternarios 1.5a en `&&` |
| `react-state-minimize` | un snapshot; no duplicar máquina en pantallas |
| `imports-design-system-folder` | pantallas importan `@/shared/ui/*` |

---

## 11. Criterio de "hecho" técnico

Fase 1.5b lista para el Tester Visual Humano cuando:

1. CA-09…12 del spec en verde (agente).
2. Árbol destino poblado; paths 1.5a de auth/screens/components/lib/navigation/theme/assets **eliminados**.
3. Máquina §5.2 y contratos §3 del spec intactos por inspección.
4. `progress/current-task.json` → TASK-06 `READY_FOR_REVIEW`.
5. Fase 2 **no** iniciada.
