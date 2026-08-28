**Estrategia de agentes y sessesion - Ingeniería de Contexto**

---

### 1. ¿Cómo renombrar una sesión en OpenCode?

En OpenCode (dependiendo de si usas la interfaz TUI/Terminal o la interfaz gráfica/web):

* **Si usas la Terminal / TUI (Interfaz de líneas de comando):**
Puedes usar el comando de barra inclinada (slash command) directamente en la caja de texto:

```text
  /session rename Fase 1 - Worker Tasks
  

```

*(O en algunas versiones simplemente `/rename Fase 1 - Worker Tasks`)*.

* **Si estás en la interfaz de usuario / barra lateral:**
En la barra de historial de sesiones, coloca el cursor sobre la sesión actual o presiona `R` (según los atajos) para cambiarle el nombre a algo claro como: `Fase 1: TASK-01 - Bootstrap (DeepSeek)`.

---

### 2. Gestión de Contexto: ¿Cómo y cuándo abrir nuevas sesiones?

Es un excelente hallazgo: **el enemigo número uno del rendimiento de un LLM es la saturación de contexto** (llamado *Context Drift* o degradación de contexto). Conforme una conversación se vuelve más larga, el modelo empieza a ignorar instrucciones del inicio (como la paleta guinda o reglas de `AGENTS.md`) o empieza a alucinar.

#### La ventaja secreta del Spec-Driven Development (SDD):

La belleza de la arquitectura que montaste (`spec/`, `progress/current-task.json`, `progress/history.md`) es que **LA MEMORIA NO VIVE EN EL CHAT, VIVE EN TUS ARCHIVOS**.

Por lo tanto, no hay **ningún riesgo** en cerrar una sesión y abrir una nueva. La sesión antigua se puede desechar tranquilamente.

---

### 3. La Estrategia Ideal de Sesiones (Paso a Paso)

No necesitas mantener una sola sesión kilométrica para toda la Fase 1. El flujo recomendado es el siguiente:

#### **Paso A: Cambio de Orquestador a Trabajador (Abre Nueva Sesión)**

Como acabas de terminar la orquestación con Grok:

1. **Renombra o archiva** la sesión con Grok (ejemplo: `Orquestación - Fase 1 (Grok)`).
2. **Abre una NUEVA sesión limpia** con **DeepSeek** en modo **Build**.
3. En esta nueva sesión limpia, DeepSeek **no** necesita leer los 50 mensajes de discusión previa que tuviste con Grok. Solo necesita leer el disco.

#### **Paso B: Ejecución de Tareas con el Trabajador**

* **Opción Recomendada:** Puedes avanzar 2 o 3 tareas simples (`TASK-01`, `TASK-02`, `TASK-03`) en la misma sesión de DeepSeek si la conversación no se ha alargado demasiado.
* **Si la tarea es compleja o el contexto crece:** Cuando veas que ya han intercambiado muchos comandos o código, o al terminar una tarea grande, **inicia una nueva sesión limpia**.

#### **Paso C: Cambio de Fase (Nueva Sesión de Orquestación)**

Cuando termines **todas** las tareas de la Fase 1 (al llegar a `TASK-06`):

1. Cierras la sesión del Trabajador.
2. Abres una **NUEVA sesión** con **Grok** en modo **Plan**.
3. Le dices: *"Lee `progress/history.md` y `spec/constitution/roadmap.md`. Orquesta la Fase 2 (Radar GPS)"*.

---

### 4. ¿Qué pasa con el contexto antiguo y la "Compactación"?

Muchos entornos de IA utilizan un proceso llamado **Context Compaction / Summarization**. Cuando la memoria alcanza el límite del modelo (ejemplo, 64k o 128k tokens):

1. El sistema borra los mensajes antiguos intermedios.
2. Genera un "resumen invisible" del pasado.
3. Continúa la conversación.

**El problema de la compactación automática:** En el desarrollo de software, esos resúmenes automáticos suelen perder detalles técnicos críticos (como el contrato del API o nombres exactos de variables).

**Por qué tu arquitectura es superior:** Al usar SDD y abrir una sesión nueva cuando sea necesario, el contexto arranca con **0% de basura** y **100% de precisión**, porque el primer mensaje obliga al modelo a leer los archivos `.md` formateados e inmutables de tu proyecto.

---

### 💡 Prompt Mágico para abrir una NUEVA Sesión Limpia con DeepSeek

Cuando abras tu nueva sesión para ejecutar el código, solo pega esto:

> *"Sincroniza tu contexto leyendo `AGENTS.md`, `progress/current-task.json` y `spec/features/auth-biometric/task.md`. Asume el rol de Agente Trabajador y ejecuta únicamente **TASK-01**. Modifica solo los archivos listados en `allowed_files`."*

Con esto, DeepSeek sabrá exactamente qué hacer desde el primer milisegundo, consumiendo el mínimo de tokens posible.