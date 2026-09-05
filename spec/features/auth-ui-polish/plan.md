# PLAN — auth-ui-polish

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 1.5a — Pulido UI/UX de Autenticación
**Feature:** `auth-ui-polish`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** APROBADO — listo para el Agente Trabajador
**Fecha:** 2026-09-04

> Fuente de verdad técnica. El Trabajador implementa exactamente este árbol y estas APIs. Prohibido inventar paquetes. Prohibido código nativo a mano. Prohibido refactor arquitectónico (eso es Fase 1.5b).

---

## 1. Hallazgos de repositorio (baseline Fase 1 validada)

Estado actual verificado por el Orquestador el 2026-09-04:

- `AuthProvider.tsx`: status `bootstrapping | unauthenticated | needs_biometric | authenticated`. Expone `shouldOfferBiometricOptIn`, `biometricEnrollHint`, `dismissBiometricOptIn` **sin consumidor UI** (remanentes sin pantalla asignada; se eliminan en esta feature). `enableBiometricAfterLogin` solo persiste el flag, sin prompt nativo de confirmación.
- `biometricService.ts`: tiene `getBiometricAvailability()` y `authenticateWithResult()`. **No existe** `confirmBiometricOptIn()` (se crea en TASK-04).
- `tokenStore.ts`: `clearSession()` borra `jwt`/`expires_at`/`user_snapshot` pero **no** `biometric_enabled` (se mantiene así; habilita el flujo §5.3.2 del spec).
- `LoginScreen.tsx`: contiene una caja visible «Prueba local: demo@cdr.mx / demo1234» (ayuda de desarrollo). **Se elimina de la UI** en el rediseño. El login demo vive en `api.ts` y **no se toca**.
- `BiometricUnlockScreen.tsx`: UI provisional con paleta clara; auto-prompt con `setTimeout` 500 ms ya implementado.
- `global.css` + `src/theme/tokens.ts`: solo tokens claros de Fase 1.
- `expo-status-bar ~57.0.1` ya instalado. `expo-linear-gradient` **no** instalado (TASK-01).
- `assets/` no contiene el escudo institucional: **el Humano lo proporciona** (§2.5 de este plan).

---

## 2. Preparación (TASK-01)

### 2.1 Dependencia nueva (única autorizada)

```sh
npx expo install expo-linear-gradient
```

Sin config plugin. Prohibido cualquier otra dependencia.

### 2.2 Tokens en `global.css` (Tailwind v4, CSS-first)

Añadir dentro del bloque `@theme` existente (sin tocar los tokens de Fase 1):

```css
--color-auth-bg-top: #5a1320;
--color-auth-bg-mid: #3b0917;
--color-auth-bg-bottom: #290810;
--color-auth-crema: #edd6a8;
--color-auth-taupe: #a58571;
--color-auth-taupe-dim: #6c4a44;
--color-auth-dorado: #c9a854;
--color-auth-dorado-tenue: #8f693b;
--color-auth-surface: #471725;
--color-auth-surface-border: #7a3b48;
--color-auth-card-active: #45201b;
--color-auth-card-inactive: #331016;
--color-auth-gold-grad-start: #f5e5af;
--color-auth-gold-grad-end: #d9b563;
--color-auth-btn-text: #2d0a14;
```

### 2.3 `src/theme/tokens.ts`

Añadir (sin modificar `palette` ni `fontFamily` existentes):

```ts
export const authPalette = {
  bgTop: "#5A1320",
  bgMid: "#3B0917",
  bgBottom: "#290810",
  goldGradStart: "#F5E5AF",
  goldGradEnd: "#D9B563",
} as const;
```

`authPalette` se usa para los `colors` de `expo-linear-gradient` (los gradientes no son expresables en NativeWind). Todo lo demás se consume por `className`.

### 2.4 Escudo institucional (asset del Humano)

- Ruta exacta: `assets/images/escudo-yucatan.png` (PNG con transparencia, @2x/@3x opcional `escudo-yucatan@2x.png` / `@3x`).
- **Bloqueante:** el Humano coloca el asset antes de que el Trabajador inicie TASK-03. Si a la hora de TASK-03 el asset no existe, el Trabajador renderiza un `View` placeholder (`w-28 h-32 rounded-2xl border border-auth-dorado/40`) con las dimensiones finales y lo reporta; el Humano lo reemplaza sin tocar código.
- Render: `Image` de `react-native` con `resizeMode="contain"` y `accessibilityLabel="Escudo del Gobierno del Estado de Yucatán"`.

---

## 3. Máquina de estados de sesión (TASK-04) — cambios en `AuthProvider`

### 3.1 Nuevo `AuthStatus`

```ts
export type AuthStatus =
  | "bootstrapping"
  | "unauthenticated"
  | "biometric_opt_in"      // NUEVO: sesión guardada, decidiendo opt-in
  | "needs_biometric"       // sesión guardada, debe desbloquear (modo manual u auto)
  | "authenticated";

export type BiometricUnlockMode = "auto" | "manual"; // NUEVO
```

Estado adicional en el provider: `biometricUnlockMode: BiometricUnlockMode` (default `"auto"`).

### 3.2 API del contexto (breaking interno, actualizar `useAuth.ts`)

Se **eliminan** (sin consumidor): `shouldOfferBiometricOptIn`, `biometricEnrollHint`, `dismissBiometricOptIn`.

```ts
interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  user: AuthBasicUserResponseDTO | null;
  expiresAt: string | null;
  biometricUnlockMode: BiometricUnlockMode; // NUEVO
  signIn: (email: string, password: string) => Promise<void>;
  unlockWithBiometrics: () => Promise<void>;
  declineBiometricOptIn: () => Promise<void>;   // «Ahora no» / «Volver» en Opt-In
  enableBiometricAfterLogin: () => Promise<void>; // «ACTIVAR BIOMÉTRICO»
  signOut: () => Promise<void>;
}
```

### 3.3 Transiciones

| Evento | Condición | Resultado |
| --- | --- | --- |
| `bootstrap` | JWT vigente + `biometric_enabled` + hardware/enrolled | `biometricUnlockMode="auto"`, `status="needs_biometric"` |
| `bootstrap` | JWT vigente sin biometría | `status="authenticated"` |
| `bootstrap` | sin JWT / expirado | limpiar sesión, `status="unauthenticated"` |
| `signIn` OK | sin hardware/enrolled | `status="authenticated"` |
| `signIn` OK | hardware + `biometric_enabled==="true"` previo | `biometricUnlockMode="manual"`, `status="needs_biometric"` |
| `signIn` OK | hardware + no activada | `status="biometric_opt_in"` |
| `declineBiometricOptIn` | — | `setBiometricEnabled(false)`, `status="authenticated"` |
| `enableBiometricAfterLogin` | `confirmBiometricOptIn()` → success | `setBiometricEnabled(true)`, `biometricUnlockMode="manual"`, `status="needs_biometric"` |
| `enableBiometricAfterLogin` | confirm cancelado/fallido | `setBiometricEnabled(false)`, `status="authenticated"` (login NO revertido) |
| `unlockWithBiometrics` | `authenticateWithResult()` → success | `status="authenticated"` |
| `unlockWithBiometrics` | sesión expirada | limpiar, `status="unauthenticated"` |
| `unlockWithBiometrics` | fallo/cancelación | throw con mensaje de dominio; permanece en `needs_biometric` |
| `signOut` | — | estado limpio + `clearSession()` + `setBiometricEnabled(false)` (como Fase 1) |

### 3.4 `biometricService.ts` — adiciones (TASK-04)

```ts
export async function confirmBiometricOptIn(): Promise<boolean>;
```

- iOS: `authenticateAsync({ promptMessage: "Confirmar Face ID para Gabinete Móvil", cancelLabel: "Cancelar", fallbackLabel: "", disableDeviceFallback: true })` → `result.success`.
- Android: `authenticateAsync({ promptMessage: "Confirmar desbloqueo biométrico", cancelLabel: "Cancelar", disableDeviceFallback: false })` → `result.success`.
- Envolver en try/catch → `false`.

```ts
export type BiometricMethodKind = "facial" | "fingerprint" | "iris" | "none";
export async function getSupportedBiometricMethods(): Promise<BiometricMethodKind[]>;
```

Basado en `supportedAuthenticationTypesAsync()` (mapear `FACIAL_RECOGNITION`→`facial`, `FINGERPRINT`→`fingerprint`, `IRIS`→`iris`). Alimenta las cards del Opt-In. Prohibido modificar `authenticateWithResult` ni `getBiometricAvailability`.

---

## 4. Navegación (TASK-04)

`src/navigation/types.ts`:

```ts
export type AuthStackParamList = {
  Login: undefined;
  BiometricOptIn: undefined;   // NUEVO
  BiometricUnlock: undefined;
};
```

`RootNavigator.tsx`:

- Registrar `AuthStack.Screen name="BiometricOptIn"`.
- Extender el mapeo de ruta inicial: `biometric_opt_in → "BiometricOptIn"`, `needs_biometric → "BiometricUnlock"`, `unauthenticated → "Login"`.
- `authenticated → AppStack` (sin cambios). Raíces `Auth` | `App` intactas (spec §8).

---

## 5. Componentes UI (TASK-02)

### 5.1 `src/components/ui/AuthScaffold.tsx` (nuevo)

- `LinearGradient` (de `expo-linear-gradient`) absoluto a pantalla completa: `colors={[authPalette.bgTop, authPalette.bgMid, authPalette.bgBottom]}`, `locations={[0, 0.45, 1]}`, `start {x:0.5,y:0}` `end {x:0.5,y:1}`.
- `<StatusBar style="light" />` (de `expo-status-bar`, ya instalado) dentro del scaffold.
- `SafeAreaView` (de `react-native-safe-area-context`) + children. Props: `{ children: ReactNode }`. Nada más (cada pantalla gestiona su propio scroll/teclado).

### 5.2 `src/components/ui/GoldButton.tsx` (nuevo, compound)

- `GoldButton`: `Pressable` envolviendo un `LinearGradient` horizontal (`colors={[goldGradStart, goldGradEnd]}`, `start {x:0,y:0.5}` `end {x:1,y:0.5}`), clases `h-14 w-full items-center justify-center rounded-full`, `disabled → opacity-40`, `pressed → opacity-80`. Props: `{ loading?: boolean } & Omit<PressableProps, "className">`. Cuando `loading`, renderiza `ActivityIndicator color={authPalette... btnText}` (añadir `btnText: "#2D0A14"` a `authPalette`) y deshabilita.
- `GoldButtonText`: `Text` con `font-lato-bold text-base uppercase tracking-widest text-auth-btn-text`.

### 5.3 `src/components/ui/BiometricMethodCard.tsx` (nuevo)

Props: `{ icon: ReactNode; title: string; subtitle: string; selected: boolean }`. Card `rounded-3xl border p-6 items-center gap-2`: seleccionada `bg-auth-card-active border-auth-dorado`, no seleccionada `bg-auth-card-inactive border-transparent`. Título `font-lato-bold text-auth-crema uppercase`, subtítulo `font-lato text-sm text-auth-taupe-dim`. Checkmark circular dorado bajo el icono cuando `selected` (icono `checkmark-circle` de `@expo/vector-icons` Ionicons, color token `auth-dorado`).

### 5.4 `src/components/ui/TextField.tsx` (restyle oscuro)

Solo lo consumen pantallas de autenticación: se restiliza directo (sin variant).

- Label: `font-lato-bold text-xs uppercase tracking-widest text-auth-taupe`.
- Input: `h-14 rounded-2xl border border-auth-surface-border bg-auth-surface px-5 font-lato text-base text-auth-crema`, `placeholderTextColor` token taupe, foco `focus:border-auth-dorado`.
- Error: `border-error` en el input + `font-lato text-xs text-error mt-1` (patrón ternario existente).
- Nueva prop opcional `secureToggle?: boolean`: cuando es true, renderiza un `Pressable` (icono `eye` / `eye-off` de Ionicons, color taupe) posicionado a la derecha del input que alterna `secureTextEntry`. Estado interno del componente.

### 5.5 `InstitutionalText.tsx` / `Button.tsx`

Sin cambios. (`Button` sigue usándose solo en UI clara — Home placeholder. Las pantallas auth usan `GoldButton` y `Pressable` de enlaces.)

---

## 6. Pantallas (TASK-03 / TASK-04 / TASK-05)

### 6.1 `LoginScreen.tsx` (TASK-03) — `login-form.png`

Estructura (dentro de `AuthScaffold`):

```
KeyboardAvoidingView (iOS padding) + ScrollView (keyboardShouldPersistTaps="handled")
  [espacio flexible]
  Título "Cimientos del Renacimiento" (font-lato-bold text-3xl text-auth-crema text-center)
  Escudo (w-28, centrado, mt-8)
  [espacio flexible]
  Formulario px-8, gap-6:
    TextField "CORREO ELECTRÓNICO" (placeholder "usuario@yucatan.gob.mx", email rules actuales)
    TextField "CONTRASEÑA" (secureToggle)
    Link "¿Olvidaste tu contraseña?" (Pressable, text-auth-dorado-tenue, alineado a la derecha)
      → Alert.alert("Recuperación de acceso", "La recuperación de acceso se gestiona en la
         plataforma web institucional. Contacte al administrador.")
    Error de dominio (estilo §5.4)
    GoldButton "INICIAR SESIÓN" (loading = submitting)
    [si canUseBiometricLogin] Divisor "o continúa con" + botón secundario "Acceso biométrico"
      (Pressable h-12 rounded-full border border-auth-dorado, icono "scan" Ionicons auth-dorado)
      → navigation.navigate("BiometricUnlock")
```

- Se **elimina** la caja «Prueba local: demo@cdr.mx / demo1234».
- Validación local, `canSubmit`, fase `idle|submitting` y manejo de errores de dominio: **se conserva la lógica actual**, solo cambia la presentación.
- `canUseBiometricLogin` (spec §5.5): `biometric_enabled && sesión vigente`. Se obtiene de un nuevo selector liviano en el provider: `canUseBiometricLogin: boolean` (calculado en bootstrap y tras signOut; default `false`). Dado que el fallback limpia sesión, normalmente será `false` y divisor+botón no se renderizan (ternario, nunca `&&` suelto).

### 6.2 `BiometricOptInScreen.tsx` (TASK-04) — `biometric-opt-in-request.png`

Dentro de `AuthScaffold`:

```
Header: Pressable "< Volver" (text-auth-taupe) → declineBiometricOptIn
Icono escudo dorado (Ionicons "shield-checkmark", auth-dorado, ~64) con halo (View rounded-full border border-auth-dorado/30)
Título "Acceso rápido y seguro" (text-3xl font-lato-bold text-auth-crema text-center)
Cuerpo: "Active el acceso biométrico para ingresar a la app sin contraseña, de forma segura cada vez."
Row de cards (gap-4, flex-1 cada una):
  FACE ID  (icono "scan" / MaterialCommunityIcons "face-recognition")  selected = methods incluye "facial"
  HUELLA   (icono "finger-print")                                      selected = methods incluye "fingerprint"
  (si el método no está soportado, la card se muestra atenuada opacity-50, no seleccionada)
Beneficios (gap-4, icono Ionicons auth-dorado + font-lato text-auth-taupe):
  "lock-closed"  → "Sus datos nunca salen del dispositivo"
  "flash"        → "Acceso en menos de un segundo"
  "refresh"      → "Puede desactivarlo en cualquier momento"
GoldButton "ACTIVAR BIOMÉTRICO" (loading mientras confirmBiometricOptIn) → enableBiometricAfterLogin
Pressable "Ahora no" (text-auth-taupe text-center) → declineBiometricOptIn
```

- Los métodos se leen una vez al montar (`getSupportedBiometricMethods()`), estado local tipado.
- Errores de `enableBiometricAfterLogin` no aplican (la función no lanza: cancelación → Home, regla §3.3).

### 6.3 `BiometricUnlockScreen.tsx` (TASK-05) — `biometric-login.png`

Dentro de `AuthScaffold`:

```
Header: Pressable "< Volver" → signOut (fallback que limpia sesión, spec §5.4.3)
Título "Cimientos del Renacimiento" (como Login)
Escudo (w-40, centrado)
Cuerpo: "Utilice su método biométrico para acceder" (text-auth-taupe text-center)
Error de desbloqueo (si existe, text-error)
GoldButton "INICIAR SESIÓN" (loading = pending) → unlockWithBiometrics
```

- `const { biometricUnlockMode } = useAuth()`: el auto-prompt (efecto con `setTimeout` 500 ms, una sola vez, patrón actual) **solo se ejecuta si `biometricUnlockMode === "auto"`**. En `"manual"` el prompt solo salta al presionar el botón.
- Se conserva la lógica actual de `handleUnlock` (errores de dominio, `pending`, `autoPrompted` ref).

---

## 7. Skills de rendimiento / UI aplicables

| Skill | Aplicación |
| --- | --- |
| `ui-pressable` | Único primitive de tap (GoldButton, links, cards no interactivas usan `View`) |
| `rendering-no-falsy-and` | Ternarios / `!!` en errores y secciones condicionales |
| `rendering-text-in-text-component` | Strings solo en `Text` / `InstitutionalText` / `GoldButtonText` |
| `react-state-minimize` | `biometricUnlockMode` como estado único; modo derivado, no duplicado en pantallas |
| `design-system-compound-components` | `GoldButton` + `GoldButtonText` |
| `imports-design-system-folder` | Imports desde `@/components/ui` |
| `ui-styling` | NativeWind `className`; `StyleSheet.create` solo si un valor dinámico lo exige (gradientes usan props, no StyleSheet) |

---

## 8. Dependencias (cierre)

**Autorizada nueva:** `expo-linear-gradient` (`npx expo install`).

**Ya instaladas y usadas:** `expo-status-bar` (StatusBar light en auth), `@expo/vector-icons` (iconos, viene con Expo), `react-native-safe-area-context`, `expo-local-authentication`, `expo-secure-store`.

**Prohibido:** cualquier otra dependencia; bottom-sheets JS; librerías de gradientes distintas; `@expo-google-fonts/*`.

---

## 9. Orden de implementación y handoff

```
TASK-01 (tokens + gradient + asset check)
  → TASK-02 (componentes UI: AuthScaffold, GoldButton, BiometricMethodCard, TextField dark)
    → TASK-03 (LoginScreen pixel-perfect)
      → TASK-04 (máquina de estados + biometricService + navegación + BiometricOptInScreen)
        → TASK-05 (BiometricUnlockScreen pixel-perfect, modos auto/manual)
          → TASK-06 (arnés: eslint + tsc + bans)
            → Revisor (auditoría) → Tester Visual Humano (pixel-diff CA-01…03 + flujos CA-04…08)
```

El Trabajador sigue `task.md` en orden. No adelantar TASK-0N+1 si TASK-0N no está `[x]`.

---

## 10. Criterio de "hecho" técnico

Fase 1.5a lista para el Tester Visual Humano cuando:

1. CA-01…CA-10 del `spec.md` implementados.
2. `npx eslint .` y `npx tsc --noEmit` en verde; cero `any` / `TouchableOpacity` / `FlatList` / `expo-router`.
3. La única dependencia nueva es `expo-linear-gradient`.
4. Contrato API, DTOs, claves SecureStore y raíces de navegación intactos (verificación por diff).
5. `progress/current-task.json` refleja TASK-06 `READY_FOR_REVIEW` y el Revisor registra el arnés.
