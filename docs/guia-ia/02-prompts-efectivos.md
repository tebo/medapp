# 2. Cómo formular prompts efectivos

> Parte de la **Guía de uso de Asistencia de IA**.
> Anterior: [1. Introducción](./01-introduccion.md) · Siguiente: [3. Mejores prácticas](./03-mejores-practicas.md)

## La receta del prompt perfecto

Un buen prompt tiene **cuatro ingredientes**. No siempre hacen falta los cuatro,
pero cuantos más incluyas, mejor sale la respuesta:

1. **Rol** → cómo debe comportarse la IA.
2. **Contexto** → información del proyecto o del problema.
3. **Tarea** → qué quieres exactamente.
4. **Formato** → cómo quieres la salida.

### Desglose

| Ingrediente | Pregunta que responde | Ejemplo |
|-------------|----------------------|---------|
| Rol | «¿Quién eres?» | Actúa como desarrollador senior de Node.js |
| Contexto | «¿Qué estamos haciendo?» | API de citas con Express + SQLite, CommonJS |
| Tarea | «¿Qué quieres?» | Crea un middleware que valide JWT Bearer |
| Formato | «¿Cómo lo quieres?» | Un módulo CommonJS, máximo 40 líneas |

## Ejemplo completo

> *«Actúa como un desarrollador senior de Node.js. Estamos construyendo una API
> de citas médicas con Express 4 y SQLite (better-sqlite3), usando módulos
> CommonJS. Crea un middleware de autenticación que reciba un header
> `Authorization: Bearer <token>`, verifique el JWT con la librería jsonwebtoken
> y guarde `req.user = { id, role }`. Si el token falta o es inválido, responde
> 401 con JSON. Devuélvelo como archivo `auth.js` con comentarios mínimos.»*

Fíjate en lo que se incluyó: librerías, versión de módulos, campo de respuesta,
nombre de archivo y extensión máxima. Eso es lo que hace la diferencia.

## Sé específico: más contexto = mejor resultado

La IA no conoce tu proyecto. Dale los detalles:

- **Archivos reales**: «añádelo a `backend/src/middleware/auth.js`».
- **Convenciones**: «usa snake_case para las columnas», «tapas las rutas en
  `routes/`».
- **Restricciones**: «no instales dependencias», «no uses TypeScript», «no uses
  ORM, usa SQL directo».

## Usa "no hacer" (restricciones negativas)

La IA responde bien a lo que NO debe hacer. Ejemplos:

- «No uses async/await en firma» (si otro convenio).
- «No añadas comentarios a menos que expliquen algo no obvio».
- «No devuelvas contraseñas en la respuesta».

Esta técnica evita sorpresas y código con adorno innecesario.

## Itera. La conversación construye

Casi nunca la primera respuesta es perfecta. No empieces de cero: **pide ajustes**
sobre la base que la IA ya generó.

- «Más corto, reduce a la mitad.»
- «Añade el caso del token expirado.»
- «Cambia los mensajes de error al español.»
- «Ahora une esto con el endpoint que te mostré antes.»

Esta iteración es 10 veces más productiva que reescribir el prompt completo.

## Antipatrones de prompt

| ❌ Antipatrón | ✅ Mejor enfoque |
|---------------|------------------|
| «Haz una app de citas» | «Dame solo la estructura de carpetas del backend» |
| «Código» | «Endpoint POST /api/appointments en Express con validación básica» |
| «Arregla mi bug» (sin contexto) | «Este error lanza X al llamar a Y. El código es Z. ¿Qué causa y cómo lo arreglo?» |
| «¿Cómo funciona JWT?» (genérico) | «Explica JWT como si se lo enseñaras a un junior, con un mini ejemplo en Express» |

## Plantilla reutilizable

```text
Rol: <cómo debe actuar la IA>
Contexto: <stack, versión, convenciones, archivos>
Tarea: <qué exactamente>
Restricciones: <qué NO debe hacer o usar>
Formato: <extensión, longitud, lenguaje de los comentarios, idioma>
```