# SPEC — auth-ui-polish

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 1.5a — Pulido UI/UX de Autenticación
**Feature:** `auth-ui-polish`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** APROBADO por el Humano (2026-09-04) — listo para redacción de plan/task y handoff al Agente Trabajador
**Fecha:** 2026-09-04

---

## 1. Propósito

Llevar las pantallas del flujo de autenticación (Login, Opt-In biométrico, Unlock biométrico) a **pixel-perfect** contra los mockups aprobados, y ajustar el flujo de interacción (opt-in a pantalla completa + primer uso biométrico manual obligatorio + auto-prompt con reintento en arranques posteriores).

La Fase 1 está concluida y validada por el Humano. Esta feature **no reabre la Fase 1**: declara en la sección 7 qué reglas del spec `auth-biometric` supersede.

---

## 2. Decisiones del Humano (2026-09-04) — innegociables

1. Orden de ejecución: **1.5a (esta feature) primero**; 1.5b (refactor Clean Architecture) después.
2. **Tipografía: se mantiene Lato exclusivamente.** El título de marca de los mockups (serif/display) se aproxima con **Lato Bold** (desviación aprobada del mockup).
3. El link «¿Olvidaste tu contraseña?» del mockup se implementa como **link informativo** (ver §5.2): sin flujo de recuperación (prohibido por `mission.md` §4).
4. Arranques posteriores con biometría activa: **auto-prompt nativo al montar** la pantalla biométrica + botón «INICIAR SESIÓN» como reintento manual.
5. El **escudo institucional lo proporciona el Humano** como asset oficial.
6. Se autoriza la dependencia **`expo-linear-gradient`** (enmienda a `tech-stack.md` ya registrada) para el fondo guinda profundo y el botón dorado.
7. El «Volver» de la pantalla biométrica ejecuta el **fallback a credenciales limpiando la sesión** (semántica de Fase 1, sin cambios).

---

## 3. Entradas y Mockups (Source of Truth visual)

- `spec/features/auth-ui-polish/mockups/login-form.png` → rediseño de `LoginScreen.tsx`
- `spec/features/auth-ui-polish/mockups/biometric-opt-in-request.png` → **nueva** `BiometricOptInScreen.tsx`
- `spec/features/auth-ui-polish/mockups/biometric-login.png` → rediseño de `BiometricUnlockScreen.tsx`

> **DIRECTRIZ PARA EL TRABAJADOR (ANTI-ALUCINACIÓN):** Los tokens visuales exactos son los de la sección 4 (extraídos por muestreo de píxeles de los PNG el 2026-09-04). QUEDA PROHIBIDO inventar colores, fuentes o gradientes distintos.

---

## 4. Tokens visuales exactos

Todos los tokens están registrados en `/spec/constitution/tech-stack.md` §2.1 (paleta `auth-*`) y se exponen a NativeWind vía `@theme` en `global.css` + `src/theme/tokens.ts`.

### 4.1 Fondo (las 3 pantallas)

- Gradiente **vertical** guinda profundo: `auth-bg-top #5A1320` → `auth-bg-mid #3B0917` → `auth-bg-bottom #290810`, implementado con `expo-linear-gradient` a pantalla completa.

### 4.2 Tipografía y color de texto

| Elemento | Clases NativeWind |
| --- | --- |
| Título de marca («Cimientos del Renacimiento») | `font-lato-bold text-3xl text-auth-crema text-center` |
| Título de sección («Acceso rápido y seguro») | `font-lato-bold text-3xl text-auth-crema text-center` |
| Labels de inputs («CORREO ELECTRÓNICO») | `font-lato-bold text-xs text-auth-taupe uppercase tracking-widest` |
| Texto de input / placeholder | `font-lato text-base text-auth-crema` / `placeholder:text-auth-taupe` |
| Cuerpo descriptivo | `font-lato text-base text-auth-taupe text-center` |
| Texto terciario (divisor, subtítulos de card inactiva) | `font-lato text-sm text-auth-taupe-dim` |
| Link de apoyo («¿Olvidaste tu contraseña?») | `font-lato text-sm text-auth-dorado-tenue` |
| Navegación («Volver») | `font-lato text-base text-auth-taupe` |
| Texto de botón primario | `font-lato-bold text-base text-auth-btn-text uppercase tracking-widest` |
| Texto de botón secundario («Acceso biométrico») | `font-lato text-base text-auth-taupe` |

### 4.3 Componentes

- **Botón primario:** gradiente horizontal `auth-gold-grad-start #F5E5AF` → `auth-gold-grad-end #D9B563` (`expo-linear-gradient`, `start={x:0,y:0.5}` `end={x:1,y:0.5}`), `rounded-full`, alto `h-14`, texto según §4.2. Estado `pressed`: `opacity-80`. Estado `disabled`: `opacity-40`. Estado `isLoading`: `ActivityIndicator` color `auth-btn-text` + `opacity-80`.
- **Input:** fondo `bg-auth-surface`, borde `border border-auth-surface-border`, `rounded-2xl`, alto `h-14`, `px-5`. Error: `border-error` + mensaje `font-lato text-xs text-error mt-1`.
- **Botón secundario («Acceso biométrico»):** transparente, `border border-auth-dorado`, `rounded-full`, `h-12`, icono dorado + texto `auth-taupe`.
- **Card biométrica (opt-in):** seleccionada `bg-auth-card-active border-auth-dorado`, no seleccionada `bg-auth-card-inactive border-transparent`; `rounded-3xl`, icono `auth-dorado`, título `font-lato-bold text-auth-crema`, subtítulo `text-auth-taupe-dim`.
- **Divisor:** línea `bg-auth-taupe-dim/40` + texto «o continúa con» (`text-auth-taupe-dim`).

### 4.4 Espaciado (derivado del mockup @2x; el Humano valida pixel-diff)

- Padding horizontal global: `px-8`.
- Inputs: separación vertical `gap-6` entre bloques (label+input).
- Botón primario: `mt-8` tras el último input / bloque inferior con `mb-10`.
- Escudo institucional: ancho ≈ `w-28` en Login, ≈ `w-40` en Unlock biométrico (centrado; asset del Humano).

---

## 5. Flujo de usuario (nuevo — supersede parcialmente Fase 1, ver §7)

### 5.1 Paso A — Ingreso inicial (`login-form.png`)

1. Arranque en frío sin sesión vigente → `LoginScreen` (fondo gradiente oscuro, título de marca Lato Bold, escudo, labels, inputs, link informativo, botón dorado, divisor + «Acceso biométrico» condicional).
2. Validación local (email con formato, ambos campos no vacíos). Botón deshabilitado si inválido o request en vuelo (estados visuales §4.3).
3. Errores de dominio (400/401/403, red, `mfaRequired`, `user.active === false`): mismos mensajes institucionales de Fase 1, renderizados con el estilo de error de §4.3.
4. `KeyboardAvoidingView` + `ScrollView`: al abrir el teclado, el encabezado (título + escudo) se encoge/scrolla y los inputs + botón permanecen visibles (iOS y Android).

### 5.2 Link informativo «¿Olvidaste tu contraseña?»

Al presionarlo se muestra un `Alert` nativo institucional: «La recuperación de acceso se gestiona en la plataforma web institucional. Contacte al administrador.» **Prohibido** cualquier flujo de recuperación dentro de la app (`mission.md` §4).

### 5.3 Paso B — Verificación y Opt-In (`biometric-opt-in-request.png`) — NUEVA PANTALLA

Tras login exitoso:

1. Si el dispositivo **no** tiene hardware + biometría enrolada → directo a `HomePlaceholderScreen` (sin cambios).
2. Si la biometría **ya está activada** en la app (`biometric_enabled = "true"`, p. ej. usuario recurrente con sesión expirada que vuelve a ingresar con credenciales) → directo a `BiometricUnlockScreen` en **modo manual** (Paso C.1). No se vuelve a mostrar el Opt-In.
3. Si hay biometría disponible y **no** está activada en la app → nueva pantalla completa `BiometricOptInScreen`:
   - «Volver» (arriba a la izquierda) ≡ «Ahora no» (abajo): rechaza el opt-in.
   - Título «Acceso rápido y seguro», cuerpo descriptivo, cards informativas del método detectado (FACE ID / HUELLA según `supportedAuthenticationTypesAsync`; la disponible se muestra seleccionada, la otra atenuada — **no es un selector**, el hardware manda), lista de beneficios con iconos vectoriales dorados, botón «ACTIVAR BIOMÉTRICO».
4. «Ahora no» / «Volver» → `biometric_enabled = "false"` → `HomePlaceholderScreen`. **El login no se revierte** (regla de Fase 1 intacta).
5. «ACTIVAR BIOMÉTRICO» → prompt nativo de confirmación (`confirmBiometricOptIn` en `biometricService.ts`):
   - `success` → `biometric_enabled = "true"` → **Paso C (primer uso manual obligatorio)**.
   - cancelación/fallo → `biometric_enabled = "false"` → `HomePlaceholderScreen` (login no revertido).

### 5.4 Paso C — Primer uso manual + Unlock (`biometric-login.png`)

1. **Tras activar la biometría (primer uso):** `BiometricUnlockScreen` en **modo manual** — SIN auto-prompt. El usuario presiona «INICIAR SESIÓN» → `authenticateAsync` → éxito → `HomePlaceholderScreen`.
2. **Arranques posteriores** (JWT vigente + `biometric_enabled` + hardware): `BiometricUnlockScreen` en **modo auto** — auto-prompt nativo una sola vez al montar (decisión §2.4) + botón «INICIAR SESIÓN» como reintento tras cancelación/fallo.
3. «Volver» → fallback a credenciales: limpia `jwt`, `expires_at`, `user_snapshot`, `biometric_enabled` → `LoginScreen` (semántica de Fase 1 §5.3, intacta).
4. `lockout` / `not_enrolled` / `not_available` / fallos reiterados → mismo fallback visible; nunca dejar al usuario atrapado.

### 5.5 Botón «Acceso biométrico» en Login

Visible **solo** si `biometric_enabled === "true"` y existe sesión vigente. Navega a `BiometricUnlockScreen` (modo auto). Si no es visible, el divisor «o continúa con» tampoco se renderiza. (Con el fallback actual que limpia sesión, este botón normalmente permanecerá oculto; se implementa la lógica condicional para soportar el caso sin violar la seguridad de Fase 1.)

---

## 6. Desviaciones aprobadas del mockup (documentadas — no son errores)

1. Fuente del título de marca: Lato Bold en lugar de la serif del mockup (§2.2).
2. Los iconos de beneficios del mockup son emojis; se implementan con iconos vectoriales (`@expo/vector-icons`) tintados en `auth-dorado` (mandato `tech-stack.md`).
3. El botón «Acceso biométrico» + divisor se renderizan condicionalmente (§5.5).
4. Copy formal institucional («Sus datos…», «Puede desactivarlo…») en lugar del informal del mockup («Tus datos…»), conforme a la regla §6.3 del spec de Fase 1.
5. El indicador de estado del sistema (hora, batería del mockup) no se replica; se usa `StatusBar` nativa con estilo claro sobre fondo oscuro.

---

## 7. Reglas de Fase 1 superseded por esta feature

| Regla original (`auth-biometric/spec.md`) | Nuevo comportamiento |
| --- | --- |
| §5.2 paso 5: opt-in biométrico como «diálogo / bloque in-line» tras el login | Opt-in como **pantalla completa** `BiometricOptInScreen` (§5.3) |
| §5.2 paso 5: tras aceptar, el login concluye directo a Home | Tras aceptar: **primer uso biométrico manual obligatorio** antes de Home (§5.4.1) |
| §5.3 paso 1: auto-prompt biométrico en todo `BiometricUnlockScreen` | Auto-prompt **solo** en arranques posteriores; modo manual en el primer uso (§5.4) |
| §6.2 paleta clara (`fondo #F7F4F0`) en pantallas de autenticación | Paleta oscura `auth-*` exclusiva del flujo de autenticación (tech-stack §2.1) |
| §5.1/5.2 UI de Login clara | UI de Login oscura pixel-perfect (§5.1) |

Todo lo no listado aquí permanece intacto (contrato API §4, errores §4.3, seguridad §7, claves SecureStore, navegación raíz Auth | App, Home placeholder).

---

## 8. Límites estrictos (Invariantes Congeladas)

**ESTÁ ESTRICTAMENTE PROHIBIDO en esta feature:**

- Mover, renombrar o extraer lógica hacia `src/domain/`, `src/application/` o aplicar Clean Architecture/SOLID (eso pertenece exclusivamente a la Fase 1.5b).
- Modificar el contrato `POST /api/auth/login` o los DTOs.
- Alterar las claves de `SecureStore` (`jwt`, `expires_at`, `user_snapshot`, `biometric_enabled`) o la semántica del JWT.
- Modificar las raíces de navegación (`Auth` vs `App`) ni el header nativo institucional de `App`.
- Añadir dependencias distintas de `expo-linear-gradient` (autorizada por el Humano el 2026-09-04).
- Tocar archivos `.swift`, `.kt`, `.java`, `.pbxproj`, `Info.plist`, `AndroidManifest.xml`.
- Usar `TouchableOpacity`, `FlatList`, `StyleSheet.create` (salvo valor dinámico justificado), fuentes distintas de Lato, o emojis en UI.

---

## 9. Criterios de Aceptación (CA)

- [ ] **CA-01 (Pixel-diff Login):** `LoginScreen` en iOS y Android empata visualmente con `login-form.png` (layout, gradiente de fondo, tokens, jerarquía, botón dorado). Desviaciones solo las de §6.
- [ ] **CA-02 (Pixel-diff Opt-In):** `BiometricOptInScreen` empata con `biometric-opt-in-request.png` (cards de método detectado, beneficios, botón).
- [ ] **CA-03 (Pixel-diff Unlock):** `BiometricUnlockScreen` empata con `biometric-login.png` en ambos modos (manual/auto solo difieren en el auto-prompt nativo).
- [ ] **CA-04 (Flujo sin hardware):** login exitoso en dispositivo sin biometría → Home directo, sin pantallas intermedias.
- [ ] **CA-05 (Flujo opt-in):** login exitoso con biometría disponible → pantalla Opt-In → «ACTIVAR BIOMÉTRICO» → prompt nativo → primer uso **manual** en Unlock → éxito → Home.
- [ ] **CA-06 (Opt-in rechazado):** «Ahora no» / «Volver» → Home con sesión intacta y `biometric_enabled = "false"`.
- [ ] **CA-07 (Arranque posterior):** JWT vigente + biometría activa → Unlock con **auto-prompt** al montar; cancelación → reintento manual con «INICIAR SESIÓN»; «Volver» → sesión limpiada → Login.
- [ ] **CA-08 (Regresión cero):** login con credenciales válidas, errores 401/red/MFA/inactivo, y «Cerrar sesión» funcionan exactamente como en la Fase 1 validada.
- [ ] **CA-09 (Arnés):** `npx eslint .` y `npx tsc --noEmit` en verde. Cero `any`, `TouchableOpacity`, `FlatList`, imports de `expo-router`.
- [ ] **CA-10 (Dependencias):** la única dependencia añadida es `expo-linear-gradient` (vía `npx expo install`).

---

## 10. Dependencias de constitución

- `/spec/constitution/mission.md`
- `/spec/constitution/tech-stack.md` (§2.1 paleta auth, §gradientes)
- `/spec/constitution/roadmap.md` — Fase 1.5a
- `/spec/features/auth-biometric/spec.md` (baseline; reglas superseded listadas en §7)
- `/AGENTS.md`

Esta spec es la fuente de verdad de producto. El `plan.md` es la fuente de verdad técnica. El `task.md` es la única lista de archivos que el Trabajador puede tocar.
