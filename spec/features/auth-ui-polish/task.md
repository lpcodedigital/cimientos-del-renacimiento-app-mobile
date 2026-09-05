# TASK — auth-ui-polish

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 1.5a — Pulido UI/UX de Autenticación
**Feature:** `auth-ui-polish`
**Ejecutor:** Agente Trabajador
**Auditor:** Agente Revisor (tras TASK-06)
**Tester visual / biométrico / `expo start`:** Humano — prohibido a agentes
**Fecha:** 2026-09-04

Leer antes de tocar código: `spec.md`, `plan.md`, `/spec/constitution/tech-stack.md` (§2.1 y §gradientes), `/AGENTS.md`.

Reglas absolutas del Trabajador:

- SOLO editar archivos listados en `allowed_files` de la task activa.
- SOLO dependencia nueva: `expo-linear-gradient` (TASK-01). Instalar con `npx expo install`. Nunca `npm i` para módulos nativos.
- Cero `.swift`, `.kt`, `.java`, `.pbxproj`, `Info.plist`, `AndroidManifest.xml` a mano.
- Cero Expo Router. Cero `any`. Cero `TouchableOpacity`. Cero `FlatList`. Cero `StyleSheet.create` salvo valor dinámico justificado. Cero emojis en UI. Cero fuentes distintas de Lato.
- Prohibido aplicar Clean Architecture/SOLID ni mover archivos de capa (eso es Fase 1.5b).
- Prohibido tocar `src/features/auth/api.ts`, `src/features/auth/dto.ts`, `src/features/auth/tokenStore.ts` (contrato y claves congelados).
- Al terminar cada task: marcar `- [x]`, actualizar `progress/current-task.json` a la siguiente task.
- No correr `npx expo start`. El arnés (`eslint`, `tsc`) lo corre el Trabajador solo en TASK-06; el Revisor lo re-ejecuta.

---

## TASK-01 — Tokens auth + expo-linear-gradient + verificación de asset

**Status:** COMPLETED
**assigned_role:** Trabajador
**validation:** APROBADA por el Humano (2026-09-04)

**Objetivo:** Base de tokens oscuros institucionales y la única dependencia nueva. Sin pantallas.

**Pasos**

- [x] `npx expo install expo-linear-gradient`.
- [x] `global.css`: añadir los 15 tokens `--color-auth-*` dentro del `@theme` existente (plan §2.2). No tocar tokens de Fase 1.
- [x] `src/theme/tokens.ts`: añadir `authPalette` (plan §2.3) incluyendo `btnText: "#2D0A14"`. No modificar `palette` ni `fontFamily`.
- [x] Verificar si existe `assets/images/escudo-yucatan.png`. Si NO existe: reportarlo en `progress/current-task.json` (`agent_notes`) como bloqueante parcial — TASK-03 usará el placeholder del plan §2.4. No crear el PNG (lo proporciona el Humano).
- [x] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `package.json`
- lockfile
- `global.css`
- `src/theme/tokens.ts`
- `progress/current-task.json`

**Definition of done:** Tokens disponibles como clases (`bg-auth-surface`, `text-auth-crema`, etc.). Dependencia instalada vía expo install. TypeCheck verde.

---

## TASK-02 — Componentes UI del sistema auth oscuro

**Status:** COMPLETED
**assigned_role:** Trabajador
**validation:** APROBADA por el Humano (2026-09-04; compilación iOS + Android en verde). DESVIACIÓN AUTORIZADA: `@expo/vector-icons` ^15.0.2 instalado vía `npx expo install` (no venía transitivo en SDK 57; lo exigen los Ionicons de BiometricMethodCard y TextField).

**Objetivo:** Primitivas visuales reutilizables según plan §5. Sin pantallas.

**Pasos**

- [x] `src/components/ui/AuthScaffold.tsx`: gradiente vertical full-screen (`expo-linear-gradient` + `authPalette`), `<StatusBar style="light" />`, `SafeAreaView`, children (plan §5.1).
- [x] `src/components/ui/GoldButton.tsx`: compound `GoldButton` (gradiente horizontal, `h-14 rounded-full`, estados `pressed`/`disabled`/`loading` con `ActivityIndicator`) + `GoldButtonText` (plan §5.2). Solo `Pressable`.
- [x] `src/components/ui/BiometricMethodCard.tsx`: card seleccionada/atenuada con icono, título, subtítulo y checkmark (plan §5.3). No interactiva (`View`).
- [x] `src/components/ui/TextField.tsx`: restyle oscuro completo (label uppercase taupe, input `bg-auth-surface`, foco dorado, error `border-error`) + prop opcional `secureToggle` con iconos `eye`/`eye-off` de `@expo/vector-icons` Ionicons (plan §5.4).
- [x] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `src/components/ui/AuthScaffold.tsx`
- `src/components/ui/GoldButton.tsx`
- `src/components/ui/BiometricMethodCard.tsx`
- `src/components/ui/TextField.tsx`

**Definition of done:** Los 4 componentes compilan, usan solo tokens `auth-*` + Lato, cero `StyleSheet.create` injustificado, cero `any`.

---

## TASK-03 — LoginScreen pixel-perfect (`login-form.png`)

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** Rediseño visual del Login contra mockup. Lógica de validación/errores actual se conserva.

**Pasos**

- [ ] Reescribir `src/screens/auth/LoginScreen.tsx` según plan §6.1: `AuthScaffold` + KAV/ScrollView, título de marca, escudo (asset o placeholder §2.4 del plan), labels/inputs oscuros, `secureToggle` en contraseña, link «¿Olvidaste tu contraseña?» con `Alert` informativo institucional, `GoldButton` con `loading`, sección condicional divisor + «Acceso biométrico» (visible solo si `canUseBiometricLogin`; navegar a `BiometricUnlock`).
- [ ] **Eliminar** la caja «Prueba local: demo@cdr.mx / demo1234» de la UI. No tocar `api.ts` (el login demo permanece).
- [ ] Conservar intactos: `EMAIL_PATTERN`, `canSubmit`, fase `idle|submitting`, mapeo de errores de dominio.
- [ ] `AuthProvider.tsx`/`useAuth.ts`: añadir ÚNICAMENTE el selector `canUseBiometricLogin: boolean` (plan §6.1; calculado en bootstrap y tras `signOut`). Ningún otro cambio de estado en esta task.
- [ ] `navigation/types.ts` + `RootNavigator.tsx`: sin cambios de rutas en esta task; `LoginScreen` obtiene `navigation` vía prop tipada de `NativeStackScreenProps<AuthStackParamList, "Login">`.
- [ ] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `src/screens/auth/LoginScreen.tsx`
- `src/features/auth/AuthProvider.tsx` (solo selector `canUseBiometricLogin`)
- `src/features/auth/useAuth.ts` (solo tipo del selector)
- `assets/images/escudo-yucatan.png` (solo si el Humano ya lo colocó; el Trabajador no lo genera)

**Definition of done:** CA-01 lista para pixel-diff del Humano. Errores 401/red/MFA/inactivo siguen mostrándose (CA-08 parcial). TypeCheck verde.

---

## TASK-04 — Máquina de estados + BiometricOptInScreen (`biometric-opt-in-request.png`)

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** Nuevo status `biometric_opt_in`, modo de desbloqueo, confirmación nativa y la nueva pantalla de Opt-In.

**Pasos**

- [ ] `biometricService.ts`: añadir `confirmBiometricOptIn()` y `getSupportedBiometricMethods()` + tipo `BiometricMethodKind` (plan §3.4). No modificar las funciones existentes.
- [ ] `AuthProvider.tsx`: implementar plan §3.1–§3.3 completo (`biometric_opt_in`, `biometricUnlockMode`, transiciones de `signIn`/`enableBiometricAfterLogin`/`declineBiometricOptIn`; eliminar `shouldOfferBiometricOptIn`, `biometricEnrollHint`, `dismissBiometricOptIn`).
- [ ] `useAuth.ts`: sincronizar la interfaz (eliminar campos muertos, añadir `biometricUnlockMode`).
- [ ] `navigation/types.ts`: añadir `BiometricOptIn: undefined`.
- [ ] `RootNavigator.tsx`: registrar la screen y extender el mapeo de ruta inicial (plan §4).
- [ ] `src/screens/auth/BiometricOptInScreen.tsx`: nueva pantalla según plan §6.2 (Volver/Ahora no → `declineBiometricOptIn`; ACTIVAR → `enableBiometricAfterLogin` con `loading`; cards según `getSupportedBiometricMethods()`; beneficios con Ionicons).
- [ ] Verificar consumidores de campos eliminados: si `HomePlaceholderScreen.tsx` u otro archivo los usa, ajustarlo (mínimo indispensable).
- [ ] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `src/features/auth/biometricService.ts`
- `src/features/auth/AuthProvider.tsx`
- `src/features/auth/useAuth.ts`
- `src/navigation/types.ts`
- `src/navigation/RootNavigator.tsx`
- `src/screens/auth/BiometricOptInScreen.tsx`
- `src/screens/app/HomePlaceholderScreen.tsx` (solo ajuste por campos eliminados, si aplica)

**Definition of done:** Flujos CA-04/05/06 implementables: sin hardware → Home; opt-in mostrado/aceptado/rechazado según spec §5.3. TypeCheck verde.

---

## TASK-05 — BiometricUnlockScreen pixel-perfect (`biometric-login.png`)

**Status:** TODO
**assigned_role:** Trabajador

**Objetivo:** Rediseño visual del Unlock + modos auto/manual.

**Pasos**

- [ ] Reescribir `src/screens/auth/BiometricUnlockScreen.tsx` según plan §6.3: `AuthScaffold`, «Volver» → `signOut`, título de marca, escudo (`w-40`), cuerpo institucional, error de desbloqueo, `GoldButton` «INICIAR SESIÓN» con `loading`.
- [ ] Auto-prompt (efecto `setTimeout` 500 ms, una sola vez) **solo** cuando `biometricUnlockMode === "auto"`. En `"manual"` el prompt salta únicamente al presionar el botón.
- [ ] Conservar la lógica actual de `handleUnlock` (errores de dominio, `pending`, ref anti-duplicado).
- [ ] `npx tsc --noEmit` debe pasar.

**allowed_files**

- `src/screens/auth/BiometricUnlockScreen.tsx`

**Definition of done:** CA-03/05/07 implementados. TypeCheck verde.

---

## TASK-06 — Arnés de control

**Status:** TODO
**assigned_role:** Trabajador (primera pasada) → Revisor (auditoría)

**Objetivo:** ESLint + TypeCheck verdes. Cierre de Fase 1.5a para el Humano.

**Pasos**

- [ ] Correr `npx eslint .` y `npx tsc --noEmit`. Corregir solo archivos de TASK-01…05 (sin refactors de alcance).
- [ ] Verificación bans: cero `any`, cero `TouchableOpacity`, cero `FlatList`, cero imports de `expo-router`, cero emojis en UI auth, cero `StyleSheet.create` injustificado.
- [ ] Verificar por diff: `api.ts`, `dto.ts`, `tokenStore.ts`, `app.json` sin cambios; única dependencia nueva = `expo-linear-gradient`.
- [ ] Actualizar `progress/current-task.json`: `harness_status`, `active_task` TASK-06 `status: READY_FOR_REVIEW`.
- [ ] No ejecutar `npx expo start`.

**allowed_files**

- Archivos de TASK-01…05 **solo** para correcciones de lint/tipos
- `progress/current-task.json`
- `progress/history.md`

**Definition of done:** CA-09 y CA-10. El Revisor re-ejecuta el arnés. El Humano hace pixel-diff (CA-01…03), valida flujos (CA-04…08) y prueba Face ID/huella en físico.

---

## Secuencia y handoff

```
TASK-01 → TASK-02 → TASK-03 → TASK-04 → TASK-05 → TASK-06
                                                       ↓
                                               Revisor (arnés + diff de invariantes)
                                                       ↓
                                          Tester Visual Humano
                                          (pixel-diff + flujos + biometría física)
                                                       ↓
                          Orquestador redacta Fase 1.5b (core-arch-refactor)
```

Prohibido planificar Fase 1.5b o Fase 2 hasta que el Revisor audite y el Humano apruebe visualmente la Fase 1.5a (`roadmap.md`).
