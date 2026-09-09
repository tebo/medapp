# Prompt: Guía de IA integrada (7 capítulos en la app)

## Contexto

MedApp incluye una guía de uso de asistencia de IA accesible dentro de la
propia aplicación en la ruta `/guia-ia`. Son 7 capítulos navegables con tabs.

## Tarea

### 1. Vista GuiaIAView (`views/GuiaIAView.vue`)

Crear vista con:

- **Tabs de navegación**: 7 capítulos como botones/tabs.
- **Contenido dinámico**: mostrar el capítulo seleccionado.
- **Contenido hardcodeado** en el componente (no cargar de archivos MD).
- **Diseño**: cards con tipografía clara, bloques de código con estilo.
- **Navegación**: tabs horizontales, responsive (scrollable en móvil).

### 2. Capítulos

**Capítulo 1: Introducción a la IA en desarrollo**
- Qué es la asistencia de IA.
- Cuándo usarla (y cuándo no).
- Herramientas populares (Cursor, Copilot, ChatGPT, Claude, opencode).
- Limitaciones: alucinaciones, código obsoleto, falta de contexto.

**Capítulo 2: Prompts efectivos**
- Estructura de un buen prompt: contexto + tarea + restricciones + formato de salida.
- Prompt vs conversación: cuándo usar cada uno.
- Ejemplos de prompts malos vs buenos.
- Template de prompt para desarrollo de software.

**Capítulo 3: Mejores prácticas**
- Proporcionar contexto del proyecto (estructura, stack, convenciones).
- Ser específico con el output deseado.
- Dividir tareas complejas en pasos.
- Verificar y refinar el código generado.
- Mantener el control: tú decides qué código entra al proyecto.

**Capítulo 4: Ejemplos prácticos**
- Ejemplo 1: Crear un endpoint REST desde cero.
- Ejemplo 2: Debuggear un error con contexto.
- Ejemplo 3: Refactorizar código existente.
- Ejemplo 4: Escribir tests para una función.
- Cada ejemplo: prompt completo + respuesta esperada + código.

**Capítulo 5: Errores comunes**
- Pedir código sin contexto suficiente.
- Aceptar código sin revisarlo.
- No especificar stack/tecnologías.
- Usar prompts demasiado vagos o demasiado largos.
- Confiar ciegamente en la IA para lógica de seguridad.

**Capítulo 6: Workflow de desarrollo con IA**
- Flujo recomendado: planificar → prompt → revisar → testear → iterar.
- Cómo integrar IA en un sprint real.
- Pair programming con IA.
- Documentación asistida por IA.

**Capítulo 7: Glosario**
- Definiciones de términos: prompt, token, fine-tuning, RAG, alucinación, etc.
- Referencias y recursos para aprender más.

### Archivos a crear

```
frontend/src/views/
└── GuiaIAView.vue
```

### Notas

- El contenido es educativo y debe ser claro para developers junior.
- Usar español.
- El componente puede ser largo (~400+ líneas) ya que contiene todo el contenido.
- Usar `v-show` o `v-if` para alternar entre capítulos.
