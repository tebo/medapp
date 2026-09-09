# 7. Glosario

> Parte de la **Guía de uso de Asistencia de IA**.
> Anterior: [6. Workflow](./06-workflow-desarrollo.md) · [Índice](../README.md)

| Término | Descripción |
|---------|-------------|
| **Prompt** | La instrucción o pregunta que escribes a la IA. |
| **Contexto** | Información que aportas antes de la tarea (stack, archivos, versiones, restricciones). |
| **Rol (role-playing)** | Pedirle a la IA que actúe como un experto («desarrollador senior», «tutor de SQL») para mejorar la respuesta. |
| **Hit / acierto** | Respuesta que cumple exactamente lo pedido. |
| **Iteración** | Continuar la conversación pidiendo ajustes sobre lo ya generado, en lugar de empezar de cero. |
| **Alucinación** | Respuesta plausible pero falsa o inventada. Es normales en IA y por eso se verifica todo. |
| **Modelo** | El programa entrenado que genera las respuestas (ej. GPT, Claude, Gemini). Detrás hay parámetros y peso estadístico. |
| **Token** | Unidad mínima de texto que procesa el modelo (no exactamente una palabra). Los límites de contexto se miden en tokens. |
| **Ventana de contexto** | Cantidad máxima de texto que caben en una conversación. Si la excedes, la IA "olvida" lo anterior o falla. |
| **Temperatura** | Parámetro que controla la creatividad: alta = más variado, baja = más determinista. Para código se suele preferir baja. |
| **Few-shot** | Incluir 1-3 ejemplos en el prompt para que la IA imite el patrón. |
| **System prompt** | Instrucciones que el usuario avanzado fija al inicio; doctrinan el comportamiento general. |
| **Guardriles** | Restricciones o reglas (técnicas o de seguridad) impuestas sobre la salida. |
| **Refactoring asistido** | Pedirle a la IA que reestructure código sin cambiar su comportamiento. |
| **Test-driven prompt** | Escribir primero los tests que la IA debe cumplir y pedir código que los pase. |
| **CI/CD** | Integración/entrega continua: automatización que verifica build y tests en cada push. Con IA, también puedes pedir que redacte esos pipelines. |
| **Monorepo** | Un único repositorio con varios proyectos (aquí: `backend/` y `frontend/`). |
| **JWT** | Token firmado que usan las APIS para saber quién es el usuario. Firma y expiración las controla el servidor. |
| **bcrypt** | Función de hash para contraseñas; nunca guardamos la contraseña en texto plano. |
| **SQLite / better-sqlite3** | Base de datos embebida en un archivo (o memoria). Ideal demos y aprendizaje. |

## Consejos de estudio

1. No memorices el glosario; úsalo de consulta mientras lees los capítulos 2-6.
2. Cuando la IA use una palabra que no entiendas, pídele: «Explícame esto como si
   tuviera 12 años, con un ejemplo».
3. Cada vez que aprendas un término nuevo, escríbelo aquí. Este glosario es tuyo.