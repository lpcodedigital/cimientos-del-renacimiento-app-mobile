# TASK — auth-biometric

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 1 — Shell Base, Navegación y Login Híbrido
**Feature:** `auth-biometric`
**Ejecutor:** Agente Trabajador (DeepSeek V4 Flash)
**Auditor:** Agente Revisor (tras TASK-06)
**Tester biométrico / `expo start`:** Humano — prohibido a agentes
**Fecha:** 2026-08-21

Leer antes de tocar código: `spec.md`, `plan.md`, `/spec/constitution/tech-stack.md`, `/AGENTS.md`.

Reglas absolutas del Trabajador:

- SOLO editar archivos listados en `allowed_files` de la task activa.
- SOLO dependencias de `plan.md` §7. Instalar nativos con `npx expo install`. Nunca `npm i` para módulos nativos.
- Cero `.swift`, `.kt`, `.java`, `.pbxproj`, `Info.plist` a mano.
- Cero Expo Router (`app/` de rutas). Cero `any`. Cero `TouchableOpacity`. Cero `FlatList`. Cero `StyleSheet.create` salvo valor dinámico justificado.
- Cero registro, recover, MFA UI, GPS, mapas, tabs.
- Al terminar cada task: marcar `- [x]`, actualizar `progress/current-task.json` a la siguiente task (o dejar TASK-06 lista para Revisor).
- No correr `npx expo start`. El arnés (`eslint`, `tsc`) lo corre el Trabajador solo en TASK-06; el Revisor lo re-ejecuta.

---

## TASK-01 — Bootstrap Expo, NativeWind, Lato y paleta

**Status:** IN_PROGRESS
**assigned_role:** Trabajador

**Objetivo:** Proyecto Expo SDK 57 en la raíz, TypeScript estricto, NativeWind v4, tokens institucionales, fuentes Lato locales. Sin pantallas de negocio.

**Pasos**

- [ ] Crear el app con `npx create-expo-app@latest . --template blank-typescript` (o copia segura desde `/tmp` si el dir no vacío lo bloquea). No usar template `default`. No borrar `/spec`, `/progress`, `AGENTS.md`, `opencode.json`, `.agents`.
- [ ] Forzar `strict` + `noImplicitAny` y alias `@/*` → `./src/*` en `tsconfig.json`.
- [ ] Instalar NativeWind v4 y peers: `nativewind`, `react-native-reanimated`, `react-native-safe-area-context`, `tailwindcss@^3.4.17` (dev). Configurar `babel.config.js`, `metro.config.js`, `global.css`, `tailwind.config.js` (colors + fontFamily de la spec), `nativewind-env.d.ts`.
- [ ] Instalar `expo-font`, `expo-splash-screen`. Colocar `assets/fonts/Lato-Regular.ttf` y `assets/fonts/Lato-Bold.ttf` (SIL OFL).
- [ ] Crear `src/theme/tokens.ts` con hex y nombres de familia. Extender Tailwind con esos tokens. Cero UI de login todavía.
- [ ] `App.tsx`: `useFonts` Lato + `SplashScreen.preventAutoHideAsync` / hide. Placeholder mínimo institucional (`bg-fondo`, texto Lato, copy «Gabinete Móvil») para verificar marca. Importar `./global.css`.
- [ ] `app.json`: nombre «Gabinete Móvil», slug `cimientos-del-renacimiento`, `web.bundler: metro`. Aún sin plugins biométricos (TASK-05).
- [ ] Scripts `lint` y `typecheck` pueden quedar para TASK-06; no bloquear aquí.

**allowed_files**

- `package.json`
- `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` (el que genere el bootstrap)
- `app.json`
- `tsconfig.json`
- `babel.config.js`
- `metro.config.js`
- `tailwind.config.js`
- `global.css`
- `nativewind-env.d.ts`
- `App.tsx`
- `index.ts` / `index.js` (solo si el template lo exige)
- `assets/fonts/Lato-Regular.ttf`
- `assets/fonts/Lato-Bold.ttf`
- `src/theme/tokens.ts`

**Definition of done:** `npx tsc --noEmit` no debe romper por configs. La app tiene Lato + tokens. No hay `app/` de Router.

---

## TASK-02 — DTOs, Axios y SecureStore

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** Contrato Spring Boot tipado + persistencia segura. Sin UI de login.

**Pasos**

- [ ] `npx expo install expo-secure-store axios @tanstack/react-query`.
- [ ] Crear `src/features/auth/dto.ts` espejo exacto: `AuthRequestDTO`, `AuthBasicUserResponseDTO`, `AuthResponseDTO` (`mfaRequired: boolean`, `expiresAt: string`).
- [ ] Crear `src/lib/http/axiosClient.ts` (`baseURL` de `EXPO_PUBLIC_API_URL`, timeout 15s, interceptor Bearer desde un getter inyectable / módulo de token en memoria).
- [ ] Crear `src/features/auth/tokenStore.ts` con claves y opciones de `plan.md` §4.2.
- [ ] Crear `src/features/auth/api.ts` con `loginRequest(payload: AuthRequestDTO): Promise<AuthResponseDTO>`. Mapear 400/401/5xx a errores de dominio tipados (no `any`).
- [ ] Crear `.env.example` con `EXPO_PUBLIC_API_URL=`.

**allowed_files**

- `package.json`
- lockfile
- `src/features/auth/dto.ts`
- `src/features/auth/api.ts`
- `src/features/auth/tokenStore.ts`
- `src/lib/http/axiosClient.ts`
- `.env.example`

**Definition of done:** DTOs sin `any`. SecureStore no persiste password. API no loguea secretos.

---

## TASK-03 — AuthProvider y Native Stack

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** Sesión + navegación Auth | App. Home placeholder. Sin formulario de login pulido (puede haber stub).

**Pasos**

- [ ] `npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens`.
- [ ] Implementar `src/features/auth/AuthProvider.tsx` + `src/features/auth/useAuth.ts` según `plan.md` §4.5. Montar `QueryClientProvider` en `App.tsx`.
- [ ] `src/navigation/types.ts` + `src/navigation/RootNavigator.tsx`. Un `NavigationContainer`. Header nativo institucional en App; `headerShown: false` en Auth.
- [ ] `src/screens/app/HomePlaceholderScreen.tsx`: saludo + «Cerrar sesión» + copy de radar aplazado.
- [ ] Stub mínimo de `LoginScreen` / `BiometricUnlockScreen` (pantalla vacía institucional) para que el stack compile. UI final es TASK-04 / TASK-05.
- [ ] Cablear `App.tsx`: fonts → providers → `RootNavigator`.

**allowed_files**

- `package.json`
- lockfile
- `App.tsx`
- `src/features/auth/AuthProvider.tsx`
- `src/features/auth/useAuth.ts`
- `src/navigation/types.ts`
- `src/navigation/RootNavigator.tsx`
- `src/screens/app/HomePlaceholderScreen.tsx`
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/BiometricUnlockScreen.tsx`

**Definition of done:** Cambio de raíz según `AuthStatus`. Cerrar sesión limpia SecureStore. Cero Expo Router.

---

## TASK-04 — LoginScreen institucional

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** Formulario email/password con marca, validación, errores de dominio (401, red, MFA, inactivo).

**Pasos**

- [ ] `src/components/ui/Button.tsx` (compound `Button` + `ButtonText`), `TextField.tsx`, `InstitutionalText.tsx`. Solo `Pressable`. NativeWind + tokens.
- [ ] Implementar `LoginScreen` según spec §5.2 y §6 y plan §5.1.
- [ ] Validación local email/password. Botón disabled si inválido o pending.
- [ ] Conectar `signIn`. Mensajes institucionales para 400, 401, red, `mfaRequired`, `active === false`.
- [ ] Opt-in biométrico: UI de «¿Usar Face ID / huella?» y «Ahora no» visible solo si el servicio reporta hardware+enrolled. La llamada real a `authenticateAsync` se completa en TASK-05; aquí puede quedar el callback cableado a un no-op tipado o a la función ya exportada si TASK-05 se adelanta solo el service — **preferir** dejar el botón llamando `enableBiometricAfterLogin` que TASK-05 implementará. Si el service aún no existe, extraer la firma en un stub en `biometricService.ts` (único extra permitido) y terminarlo en TASK-05.
- [ ] Reset de stack al autenticar (lo provee RootNavigator).

**allowed_files**

- `src/components/ui/Button.tsx`
- `src/components/ui/TextField.tsx`
- `src/components/ui/InstitutionalText.tsx`
- `src/screens/auth/LoginScreen.tsx`
- `src/features/auth/AuthProvider.tsx` (solo si hay que exponer `enableBiometricAfterLogin` / mensajes)
- `src/features/auth/biometricService.ts` (solo stub de firma, si hace falta)

**Definition of done:** CA-02, CA-03, CA-04 implementados a nivel UI + API. Lato + guinda. Cero `TouchableOpacity`.

---

## TASK-05 — Biometría y desbloqueo

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** `expo-local-authentication` + plugins + unlock + opt-in real.

**Pasos**

- [ ] `npx expo install expo-local-authentication`.
- [ ] Plugins en `app.json` según `plan.md` §2.6 (`expo-local-authentication`, `expo-secure-store`, `usesNonExemptEncryption: false`). Mensajes Face ID institucionales.
- [ ] Implementar `src/features/auth/biometricService.ts` (APIs de plan §4.3).
- [ ] Completar `enableBiometricAfterLogin` / `unlockWithBiometrics` en `AuthProvider`.
- [ ] `BiometricUnlockScreen`: auto-prompt una vez al montar + botón «Desbloquear» + «Usar correo y contraseña».
- [ ] Bootstrap: JWT + flag + hardware+enrolled → `needs_biometric`. Sin hardware → no ofrecer opt-in.
- [ ] No tocar `.swift` / `.kt` / `Info.plist`.

**allowed_files**

- `package.json`
- lockfile
- `app.json`
- `src/features/auth/biometricService.ts`
- `src/features/auth/AuthProvider.tsx`
- `src/features/auth/useAuth.ts`
- `src/screens/auth/BiometricUnlockScreen.tsx`
- `src/screens/auth/LoginScreen.tsx` (solo cablear opt-in real)

**Definition of done:** CA-05, CA-06, CA-07. Face ID queda para el Tester Visual Humano en development build.

---

## TASK-06 — Arnés de control

**Status:** TODO
**assigned_role:** Trabajador (primera pasada) → Revisor (auditoría)

**Objetivo:** ESLint + TypeCheck verdes. Cierre de Fase 1 para el Humano.

**Pasos**

- [ ] Instalar ESLint y plugins (`npx expo install --dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks`). Configurar `eslint.config.js` o `.eslintrc` compatible con RN/TS. Activar `react-hooks` y preferir `react/jsx-no-leaked-render` si el plugin lo permite.
- [ ] Scripts `lint` y `typecheck` en `package.json`.
- [ ] Correr `npx eslint .` y `npx tsc --noEmit`. Corregir solo archivos ya tocados por TASK-01…05 (no refactors de alcance).
- [ ] Verificar grep mental / búsqueda: cero `any`, cero `TouchableOpacity`, cero `FlatList`, cero imports de `expo-router`.
- [ ] Actualizar `progress/current-task.json`: `harness_status`, notas. Dejar `active_task` en TASK-06 `status: READY_FOR_REVIEW`.
- [ ] No ejecutar `npx expo start`.

**allowed_files**

- `package.json`
- lockfile
- `eslint.config.js` / `.eslintrc.js` / `.eslintrc.cjs` / `eslint.config.mjs` (uno)
- Archivos de TASK-01…05 **solo** para correcciones de lint/tipos
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** CA-09 y CA-10. El Revisor re-ejecuta el arnés. El Humano prueba UI y biometría.

---

## Secuencia y handoff

```
TASK-01 → TASK-02 → TASK-03 → TASK-04 → TASK-05 → TASK-06
                                                      ↓
                                              Revisor (arnés)
                                                      ↓
                                         Tester Visual Humano
```

Prohibido planificar Fase 2 (Radar / GPS) hasta que el Revisor audite y el Humano apruebe visualmente la Fase 1 (`roadmap.md`).
