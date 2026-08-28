# TECH-STACK.md - Especificación Tecnológica Móvil y Restricciones

> **Directriz de Orquestación:** Este archivo define el límite estricto de las herramientas permitidas. Está ESTRICTAMENTE PROHIBIDO para cualquier agente añadir dependencias al `package.json` o utilizar librerías alternativas que no estén explícitamente autorizadas aquí.

## 1. Core Framework (Innegociable)
- **Framework:** React Native + Expo (SDK 57).
- **Lenguaje:** TypeScript (Estricto). 
  - *Regla Absoluta:* Prohibido el uso del tipo `any`. Todos los DTOs y props deben coincidir con los contratos del backend.
- **Navegación:** React Navigation (Stack Navigator + Bottom Tabs). 

## 2. UI, Design System y Rendimiento
- **Styling Engine:** NativeWind (Tailwind CSS adaptado a React Native). 
  - *Regla Absoluta:* No mezclar clases de NativeWind con `StyleSheet.create()` a menos que se requiera calcular valores dinámicos complejos.
- **Restricciones de Rendimiento Visual:**
  - **Listas:** Uso obligatorio de `@shopify/flash-list` para renderizar el explorador de obras. *PROHIBIDO usar `FlatList` de react-native.*
  - **Interacciones:** Uso obligatorio de `Pressable` con configuraciones de feedback. *PROHIBIDO usar la librería legada `TouchableOpacity`.*
- **Fuente Oficial:** Google Font `Lato` (Cargada asíncronamente mediante `expo-font`).
- **Mapas:** `react-native-maps` (Integrado nativamente en el ecosistema Expo).
- **Iconografía:** `Lucide React Native` o `@expo/vector-icons`.

## 3. Biometría & Hardware APIs (Exclusivo Expo)
> *Nota para Agentes: Todo puente de hardware se resuelve mediante APIs de Expo. Cero código nativo escrito a mano.*
- **Autenticación Biométrica:** `expo-local-authentication` (Implementada como fallback o acceso rápido post-login tradicional).
- **Geolocalización:** `expo-location` (Manejo estricto de permisos para el Radar Territorial).
- **Almacenamiento Seguro:** `expo-secure-store` (Obligatorio para la persistencia del JWT y preferencias de usuario).

## 4. Backend & API Integration (Solo Lectura)
- **Backend:** Spring Boot 3 (Java 17) - PostgreSQL. 
  - *Regla Absoluta:* El frontend asume la API REST como inmutable. No se deben proponer reescrituras de la lógica del servidor.
- **Cliente HTTP y Estado:** Axios (peticiones base) / TanStack Query (React Query) para el caché y manejo del Server State.
- **Autenticación:** JWT (JSON Web Tokens) transmitidos vía Headers.
- **CDN de Imágenes:** Cloudflare Images (Servidas vía HTTPS). 
  - *Regla Absoluta:* Toda evidencia fotográfica debe consumirse desde la URL optimizada de Cloudflare para no saturar la memoria del dispositivo.