# SPEC — auth-biometric

**Proyecto:** Cimientos del Renacimiento — Gabinete Móvil
**Fase:** 1 — Shell Base, Navegación y Login Híbrido
**Feature:** `auth-biometric`
**Rol autor:** Orquestador (Lead Planner)
**Estado:** APROBADO — listo para el Agente Trabajador
**Fecha:** 2026-08-21

---

## 1. Propósito

Habilitar el acceso privado e institucional de hasta 4 usuarios del gabinete (Gobernador y secretarios) mediante un **login híbrido**:

1. Primera sesión: correo + contraseña validados contra la API Spring Boot inmutable.
2. Sesiones posteriores (opcional): Face ID / Touch ID / huella, sin volver a teclear credenciales en campo.

La app es 100 % de lectura. No existe registro público, recuperación de contraseña ni gestión de usuarios.

---

## 2. Actores

| Actor | Contexto de uso |
| --- | --- |
| Gobernador (VIP) | Acceso instantáneo en gira, exteriores, red inestable. Fuentes grandes, alto contraste. |
| Director / Secretario | Mismo flujo. Respaldo de información en sitio. |
| Tester Visual Humano | Único autorizado para validar Face ID / Touch ID en dispositivo físico. |

---

## 3. Alcance de esta feature

**Dentro de alcance**

- Bootstrap del proyecto Expo SDK 57 en la raíz del repositorio (hoy no existe `package.json` / `app.json` / `/src`).
- TypeScript estricto + NativeWind v4 + tipografía Lato + paleta institucional.
- Pantalla de Login tradicional (email + password).
- Persistencia del JWT y de la preferencia biométrica en `expo-secure-store`.
- Habilitación opcional de biometría post-login (`expo-local-authentication`).
- Desbloqueo biométrico en arranques posteriores si hay JWT + preferencia activa.
- Native Stack (React Navigation) con dos raíces: `Auth` y `App`.
- Placeholder autenticado de Inicio (sin GPS, sin mapa, sin tabs).
- Cliente HTTP Axios con header `Authorization: Bearer <token>`.
- Arnés: `npx eslint .` y `npx tsc --noEmit`.

**Fuera de alcance (prohibido diseñar o implementar)**

- Crear cuenta, recuperar contraseña, cambiar contraseña.
- Flujo MFA / OTP / TOTP (el backend puede devolver `mfaRequired`; la app lo trata como error bloqueante).
- CRUD de obras, capacitaciones o usuarios.
- Radar territorial, `expo-location`, mapas, FlashList, ficha ejecutiva, Cloudflare Images.
- Bottom Tabs (se aplazan a Fase 2).
- Expo Router / file-based routing.
- Código nativo (`.swift`, `.kt`, `.java`, `.pbxproj`).
- Dependencias no listadas en `/spec/constitution/tech-stack.md` (salvo peers obligatorios de Expo / NativeWind / React Navigation documentados en `plan.md`).

---

## 4. Contrato de API (inmutable — Spring Boot)

Base URL: variable de entorno `EXPO_PUBLIC_API_URL` (sin slash final).

### 4.1 Login

`POST {EXPO_PUBLIC_API_URL}/api/auth/login`

**Request — `AuthRequestDTO`**

```ts
{
  email: string;    // @Email @NotBlank
  password: string; // @NotBlank
}
```

**Response 200 — `AuthResponseDTO`**

```ts
{
  token: string;
  expiresAt: string; // Date ISO-8601 del backend
  user: AuthBasicUserResponseDTO;
  mfaRequired: boolean; // default false
}
```

**`AuthBasicUserResponseDTO`**

```ts
{
  idUser: number;
  name: string;
  email: string;
  active: boolean;
  role: string;
  isFirstLogin: boolean;
}
```

El frontend asume estos campos como contrato. Prohibido el tipo `any`. Prohibido proponer reescrituras del backend.

### 4.2 Autorización posterior

Todas las peticiones autenticadas (Fases 2+) envían:

`Authorization: Bearer <token>`

En Fase 1 no hay más endpoints de negocio.

### 4.3 Errores esperados

| Condición | Comportamiento de producto |
| --- | --- |
| 400 (validación email/password) | Mensaje institucional: credenciales incompletas o correo inválido. No persistir nada. |
| 401 / 403 | Mensaje institucional: correo o contraseña incorrectos. No persistir nada. |
| 5xx / timeout / red | Mensaje institucional: no fue posible contactar al servidor. No persistir nada. |
| 200 + `mfaRequired === true` | **Bloqueante.** No persistir JWT ni usuario. Mensaje: el acceso con segundo factor no está disponible en el Gabinete Móvil. Usar la plataforma web. |
| 200 + `user.active === false` | Bloqueante. No persistir. Mensaje: la cuenta no está activa. |
| 200 + `mfaRequired === false` + `user.active === true` | Éxito. Persistir JWT, `expiresAt` y perfil básico. |

---

## 5. Flujo de usuario

### 5.1 Arranque en frío

1. Cargar Lato vía `expo-font` (`useFonts`). Mantener splash hasta que las fuentes estén listas o fallen (fallback de sistema solo si fallan; no bloquear la app indefinidamente).
2. Leer SecureStore: `jwt`, `biometric_enabled`.
3. Si no hay JWT → raíz `Auth` → `LoginScreen`.
4. Si hay JWT y `biometric_enabled === "true"` y el dispositivo tiene hardware + biometría enrolada → `BiometricUnlockScreen` (prompt nativo inmediato).
5. Si hay JWT y biometría no disponible / no habilitada → raíz `App` → `HomePlaceholderScreen` (sesión restaurada).
6. Si el JWT está expirado (`expiresAt` en el pasado) → borrar secretos → `LoginScreen`.

### 5.2 Login tradicional

1. Usuario ingresa email y contraseña.
2. Validación local: email con formato, ambos campos no vacíos. Botón deshabilitado si inválido o si hay request en vuelo.
3. `POST /api/auth/login`.
4. Éxito (regla 4.3): persistir `token`, `expiresAt`, snapshot de `user` en SecureStore.
5. Si el dispositivo tiene hardware biométrico y biometría enrolada: mostrar prompt opcional institucional: «¿Desea desbloquear el Gabinete Móvil con Face ID / huella en el próximo acceso?».
   - Aceptar → `authenticateAsync` de confirmación → si `success`, guardar `biometric_enabled = "true"`.
   - Rechazar / cancelar / fallo → `biometric_enabled = "false"`. El login **no se revierte**.
6. Navegar a raíz `App` (reset de stack; no se puede volver a Login con gesto atrás).

### 5.3 Desbloqueo biométrico

1. Prompt nativo: «Desbloquear Gabinete Móvil».
2. `success === true` → raíz `App`.
3. `user_cancel` / `system_cancel` / `user_fallback` → permanecer en `BiometricUnlockScreen` con acción «Usar correo y contraseña» que borra JWT + preferencia y va a `LoginScreen`.
4. `lockout` / `not_enrolled` / `not_available` / `authentication_failed` (reiterado) → mismo fallback a credenciales. No dejar al usuario atrapado.
5. Face ID **no funciona en Expo Go**. El Tester Visual Humano valida en development build / dispositivo físico. En simulador o Expo Go, si `hasHardwareAsync` o `isEnrolledAsync` es false, no ofrecer biometría.

### 5.4 Cerrar sesión (mínimo Fase 1)

En `HomePlaceholderScreen`, acción «Cerrar sesión» que elimina `jwt`, `expiresAt`, `user` y `biometric_enabled` de SecureStore y resetea a `LoginScreen`.

---

## 6. Guía de Imagen Digital (innegociable)

### 6.1 Tipografía

- Familia exclusiva: **Lato**.
- Pesos mínimos: Regular (400) y Bold (700). Opcional: Light (300) para labels secundarios.
- Carga: archivos `.ttf` / `.otf` locales en `assets/fonts/` + `expo-font` `useFonts` (mandato de `tech-stack.md`).
- Prohibido instalar `@expo-google-fonts/*` (no está en el tech-stack).
- Prohibido otras familias (Roboto, Inter, system-ui como marca).

### 6.2 Paleta institucional (tokens de Fase 1)

| Token | Hex | Uso |
| --- | --- | --- |
| `guinda` | `#6B142E` | Color primario. Fondos de marca, botón primario, header nativo. |
| `dorado` | `#C4A35A` | Acento. Iconos de apoyo, underline activo, detalles. |
| `fondo` | `#F7F4F0` | Fondo de pantalla (lectura en exteriores). |
| `texto` | `#1A1A1A` | Texto principal. Alto contraste. |
| `texto-suave` | `#5C534C` | Labels, ayudas. |
| `error` | `#8B1E1E` | Mensajes de error (variante guinda oscura; no rojo genérico de Tailwind). |
| `superficie` | `#FFFFFF` | Campos y cards. |

Prohibido introducir azules, verdes o paletas Tailwind por defecto (`blue-500`, `emerald`, etc.) en UI de producto.

### 6.3 UX institucional

- Fuentes grandes: título de Login ≥ 28, cuerpo ≥ 16, botón ≥ 16 bold.
- Contraste alto sobre `#F7F4F0` / `#6B142E`.
- Interacciones: **solo `Pressable`**. Prohibido `TouchableOpacity`.
- Estilos: **solo NativeWind `className`**. `StyleSheet.create` únicamente si hay valores dinámicos que NativeWind no puede expresar.
- Componentes de botón: compound (`Button` + `ButtonText`), no children polimórficos string|node.
- Copy en español formal institucional. Sin emojis. Sin tono informal.

---

## 7. Seguridad

- JWT y perfil de usuario **solo** en `expo-secure-store`. Prohibido `AsyncStorage` / texto plano.
- Accesibilidad iOS: `SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY`.
- Claves alfanuméricas: `jwt`, `expires_at`, `user_snapshot`, `biometric_enabled`.
- No persistir `password`.
- No loguear token, password ni payload de login en consola de producción.
- `ios.config.usesNonExemptEncryption: false` en app config (cumplimiento Export Compliance de SecureStore).
- Plugin `expo-local-authentication` con `faceIDPermission` institucional.
- Plugin `expo-secure-store` con el mismo mensaje Face ID.
- Cero archivos `.swift` / `.kt` / `.java` / `.pbxproj` tocados a mano.

---

## 8. Criterios de aceptación

### CA-01 — Shell y marca

Dado un dispositivo con la app instalada, cuando arranca por primera vez, entonces se ven Lato y la paleta guinda/dorado/fondo institucional, sin fuentes de sistema como marca y sin colores ajenos.

### CA-02 — Login exitoso

Dado un usuario activo provisionado, cuando envía email y password válidos y el backend responde 200 con `mfaRequired: false` y `user.active: true`, entonces el JWT se guarda en SecureStore y la app entra a `HomePlaceholderScreen` sin poder volver atrás al Login.

### CA-03 — Credenciales inválidas

Dado un password incorrecto (401), entonces se muestra mensaje institucional, no se guarda JWT y el usuario permanece en Login.

### CA-04 — MFA bloqueado

Dado un 200 con `mfaRequired: true`, entonces no se persiste ningún secreto y se informa que el segundo factor no está disponible en el Gabinete Móvil.

### CA-05 — Opt-in biométrico

Dado un login exitoso en un dispositivo con biometría enrolada, cuando el usuario acepta el prompt opcional y `authenticateAsync` resuelve `success`, entonces `biometric_enabled` queda en `"true"`.

### CA-06 — Unlock biométrico

Dado un arranque posterior con JWT vigente y `biometric_enabled === "true"`, cuando la biometría es exitosa, entonces se entra a `HomePlaceholderScreen` sin teclear contraseña.

### CA-07 — Fallback a credenciales

Dado un fallo, cancelación o lockout biométrico, entonces existe una acción visible para volver a correo y contraseña, que limpia la sesión local.

### CA-08 — Cerrar sesión

Dado un usuario autenticado, cuando pulsa «Cerrar sesión», entonces SecureStore queda sin `jwt` / preferencia y se muestra Login.

### CA-09 — TypeScript y linter

`npx tsc --noEmit` y `npx eslint .` pasan. Cero `any`. DTOs idénticos al contrato de la sección 4.

### CA-10 — Restricciones de implementación

No existe `FlatList`, `TouchableOpacity`, Expo Router (`app/` de rutas), ni dependencias fuera del tech-stack + peers documentados. Todo el código de producto vive bajo `/src` (más `App.tsx` de bootstrap en raíz, configs Expo y `assets/fonts`).

### CA-11 — Hardware vía Expo

Face ID / Keychain se configuran **solo** con config plugins de Expo. El Tester Visual Humano es el único que valida biometría en físico.

---

## 9. No funcionales

- TypeScript `strict: true`. Prohibido `any`.
- Listas: no aplica en Fase 1. Queda sentado: futuro explorador usa `@shopify/flash-list`, nunca `FlatList`.
- Red: timeout Axios 15 s. Sin reintentos agresivos en login (1 intento por tap).
- Accesibilidad: labels en inputs y botón con `accessibilityLabel` / `accessibilityRole`.
- El Humano no delega `npx expo start` ni pruebas biométricas a agentes.

---

## 10. Dependencias de constitución

- `/spec/constitution/mission.md`
- `/spec/constitution/tech-stack.md`
- `/spec/constitution/roadmap.md` — Fase 1
- `/AGENTS.md`

Esta spec es la fuente de verdad de producto. El `plan.md` es la fuente de verdad técnica. El `task.md` es la única lista de archivos que el Trabajador puede tocar.
