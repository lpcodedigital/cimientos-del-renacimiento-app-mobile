# MISSION.md - Cimientos del Renacimiento (Gabinete Móvil)

## 1. Propósito e Identidad del Sistema
Desarrollar una aplicación móvil ejecutiva, privada e institucional para el Gobernador del Estado de Yucatán y un grupo selecto de su gabinete (máximo 4 usuarios). La app funciona estrictamente como una herramienta de control político, toma de decisiones y visualización de evidencias en territorio. Sintetiza la información en tiempo real de obras públicas (ObraModel) y capacitaciones (CursoModel).

## 2. Usuarios Objetivo y Contexto de Uso
- **Gobernador del Estado de Yucatán (Usuario VIP)**: Requiere consulta ultra-rápida y territorial durante giras de trabajo. La interfaz debe priorizar fuentes grandes, alto contraste para lectura en exteriores y carga rápida bajo condiciones de red inestables.
- **Directores / Secretarios de Estado**: Utilizan la app como respaldo de información financiera y evidencia fotográfica para asistir al Gobernador en sitio.

## 3. Criterios Clave de Éxito (Innegociables)
- **Autenticación Biométrica sin fricción:** Acceso instantáneo mediante Face ID / Touch ID. No se debe obligar a escribir contraseñas en campo.
- **Radar Territorial Pasivo (Performance):** Detección de ubicación actual por GPS para renderizar el mapa y las tarjetas de resumen financiero/social en menos de 30 segundos.
- **Cumplimiento Normativo de UI:** Alineación estricta y absoluta a la Guía de Imagen Digital del Gobierno del Estado de Yucatán (2024-2030). Uso exclusivo de la paleta guinda/dorado y tipografía Lato.
- **Consumo de Infraestructura Existente:** Integración transparente con la API REST actual en Spring Boot y renderizado de medios optimizados mediante Cloudflare Images. Prohibido solicitar o sugerir reescrituras del backend.

## 4. Límites del Sistema (Fuera de Alcance)
Para evitar alucinaciones del Agente Orquestador, queda estrictamente prohibido diseñar o implementar lo siguiente:
- **NO es una app de captura:** No implementar formularios de creación, edición o borrado de obras ni capacitaciones. La app es 100% de lectura (Read-Only).
- **NO es un panel administrativo:** La gestión de usuarios, auditoría de base de datos y flujos de trabajo administrativos ya existen en la plataforma web.
- **NO incluye registro público:** No hay flujos de "Crear Cuenta" o "Recuperar Contraseña" para ciudadanos. El acceso es provisionado internamente.