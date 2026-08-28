# AGENTS.md — Reglas, Arnés de Control y Orquestación Multi-Agente

## 1. Arquitectura de Roles y Modelos
- **Orquestador y Revisor (Grok 4.6 / Lead Planner & Auditor):** 
  - *Fase de Plan:* Lee la especificación inmutable en `/spec/constitution/` y desglosa tareas atómicas en `task.md`.
  - *Fase de Auditoría:* Una vez que el Trabajador termina, asume el rol de Revisor para verificar que el código cumpla la Guía de Imagen Digital (Lato, `#6B142E`), ejecuta el arnés de control y fuerza correcciones si hay fallos.
- **Trabajador (DeepSeek V4 Flash / Execution Agent):** Escribe código de forma quirúrgica en React Native. SOLO toca los archivos asignados en el `task.md` activo.
- **Humano (Tester Visual):** El único autorizado para compilar, validar la experiencia visual (UI/UX) y probar la autenticación biométrica en un dispositivo físico iOS/Android.

## 2. Leyes Absolutas (Anti-patrones y Límites)
- **NO hagas "Vibe Coding":** No generes ni una sola línea de código sin antes leer/actualizar la especificación en `/spec`.
- **NO pierdas la memoria:** Al iniciar o terminar cualquier acción, es OBLIGATORIO leer y actualizar el estado externo en `progress/current-task.json` y `progress/history.md`.
- **NO asumas bibliotecas externas:** Usa EXCLUSIVAMENTE las dependencias declaradas en `/spec/constitution/tech-stack.md`. Tienes prohibido inventar paquetes. Usa siempre `npx expo install`, NUNCA `npm i` para módulos nativos.
- **NO escribas código Nativo:** Tienes PROHIBIDO tocar, generar o sugerir modificaciones a archivos `.swift`, `.kt`, `.java` o `.pbxproj`. Todo puente de hardware se resuelve mediante APIs de Expo.
- **NO ignores las Reglas de Rendimiento:** Es OBLIGATORIO acatar todas las reglas de mejores prácticas, rendimiento de listas y UI alojadas en la carpeta de skills (`.agents/skills` u oculta de reglas).
- **Uso Estratégico de MCP (Context7):** Tienes acceso al servidor MCP `context7`. El Agente Orquestador (Kimi) DEBE usar esta herramienta para buscar documentación actualizada si desconoce la firma de una función, la migración de un componente nativo o los props exactos de Expo SDK 51+. Para evitar saturar el límite de tokens, usa el MCP SOLO para consultas quirúrgicas, prohibido abusar de la herramienta para conceptos generales.

## 3. Flujo de Trabajo Obligatorio
1. **Fase Contexto:** Lee `/spec/constitution/` y sincroniza tu memoria con `progress/current-task.json`.
2. **Fase Spec & Plan:** El Orquestador redacta o actualiza el `spec.md` y `task.md` del módulo correspondiente. Si el orquestador encuentra ambigüedad técnica sobre dependencias modernas (ej. Cloudflare Images en React Native, APIs de biometría en Expo), utilizará la herramienta MCP `context7` antes de escribir el plan.
3. **Fase Código:** El Trabajador implementa la solución descrita en `task.md`, aplicando obligatoriamente las reglas de la carpeta de *skills* (ej. usar `FlashList`, `expo-image`, `Pressable`).
4. **Fase Auditoría (Arnés):** El Revisor ejecuta el Linter y TypeCheck. Si falla o si se violan las directrices visuales, fuerza al Trabajador a corregir el código.
5. **Fase Registro:** Actualiza `progress/history.md` detallando lo que se logró y marca la tarea como lista para el Tester Visual Humano.

## 4. Comandos del Arnés de Control
- **Linter:** `npx eslint .` (Fuerza la consistencia de React Hooks y evita variables huérfanas).
- **TypeCheck:** `npx tsc --noEmit` (Validación estricta de interfaces y contratos del backend Spring Boot).
- **Ejecución Local:** `npx expo start` (Levanta el servidor de desarrollo en la red local para pruebas físicas).