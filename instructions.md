**Instrucciones**

## INSTRUCCIONES PARA AGENTE ORQUESTADOR (MODE PLAN)

## 1. ¿Qué decirle a Grok 4.6? (Copia y pega este prompt)
Quiero inicializar un nuevo proyecto móvil utilizando la arquitectura estricta de Spec-Driven Development (SDD), Ingeniería de Arneses y Multi-Agent Orchestration.

Tu rol principal en esta etapa inicial será el de Agente Orquestador (Lead Planner). Tienes estrictamente prohibido generar código de implementación de React Native en este momento.

1. Contexto del Proyecto:
Nombre: Cimientos del Renacimiento - Gabinete Móvil
Objetivo: App ejecutiva de control político y geolocalización territorial para el Gobernador de Yucatán.
Stack: React Native, Expo SDK, TypeScript estricto, NativeWind.
Ubicación del código: El proyecto de Expo está inicializado en la RAÍZ de este repositorio. Todo el código fuente de componentes, pantallas y navegación debe planificarse estrictamente dentro de la carpeta `/src`.

2. Tu primera directriz obligatoria:
Lee los archivos físicos que ya están en tu espacio de trabajo para sincronizar tu contexto:
- /AGENTS.md (Tus reglas absolutas).
- /spec/constitution/mission.md, tech-stack.md y roadmap.md (La constitución inmutable).
- /progress/current-task.json (Tu memoria de estado a corto plazo).

3. Acciones a ejecutar (Fase 1):
Confirma que has procesado las reglas absolutas, la tipografía estricta Lato y la paleta guinda institucional oficial. Una vez confirmado, ejecuta secuencialmente lo siguiente para iniciar la Fase 1 (Shell Base y Login Híbrido):
1. Genera /spec/features/auth-biometric/spec.md (Definición y criterios de aceptación).
2. Genera /spec/features/auth-biometric/plan.md (Propuesta técnica de arquitectura ubicando los módulos en `/src`).
3. Genera /spec/features/auth-biometric/task.md (Desglose de tareas atómicas para el Agente Trabajador).
4. Modifica /progress/current-task.json cambiando el status a IN_PROGRESS.

Nota: Si tienes alguna duda sobre las APIs modernas de Expo SDK para redactar tu plan técnico, es OBLIGATORIO que utilices tu herramienta MCP context7 para consultar la documentación oficial.

## INSTRUCCIONES PARA EL AGENTE TRABAJADOR (MODE BUILD)

## 2. ¿Qué decirle a DeepSeek? (Copia y pega este prompt)
"Asume el rol de Agente Trabajador siguiendo las reglas absolutas de AGENTS.md.
Sincroniza tu contexto leyendo progress/current-task.json y spec/features/auth-biometric/task.md.
Ejecuta únicamente la TASK-01 desglosada en task.md.
Recuerda que solo tienes permitido modificar los archivos definidos en allowed_files.
Una vez terminada la TASK-01 y verificada con el linter/TypeScript, actualiza el estado correspondiente en progress/current-task.json y avísame para realizar la prueba en el emulador."

## ¿Qué va a pasar ahora?
DeepSeek leerá task.md, verá que la TASK-01 requiere hacer el bootstrap de Expo, instalar las dependencias de NativeWind / TypeScript / React Navigation y definir los tokens del tema (/src/theme).
Ejecutará los comandos de instalación o creará los archivos de configuración requeridos dentro de /src.
Al finalizar, te dirá que la TASK-01 está lista.
En ese momento tú podrás ejecutar en tu terminal local npx expo start para verificar que la base de la app arranca sin errores en tu simulador o teléfono, y le darás el pase para la TASK-02 (DTOs y cliente Axios con SecureStore).
