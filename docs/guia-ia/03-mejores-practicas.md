# 3. Mejores prácticas en desarrollo asistido por IA

> Parte de la **Guía de uso de Asistencia de IA**.
> Anterior: [2. Prompts efectivos](./02-prompts-efectivos.md) · Siguiente: [4. Ejemplos aplicados](./04-ejemplos-practicos.md)

## 1. Divide en pasos pequeños

No le pidas toda la aplicación de golpe. Pide **fragmentos atómicos** y revísalos
uno a uno:

1. La estructura de carpetas.
2. El esquema de la base de datos.
3. Un modelo.
4. Un controlador.
5. Una ruta.
6. Una vista.

Así es más fácil detectar errores y cada pieza queda bajo tu control. Este
proyecto se construyó exactamente así.

## 2. Comunica las restricciones antes de empezar

Di qué librerías, versiones y convenciones **NO** puedes usar:

- «No uses ORM ni dependencias nuevas, solo lo que ya está instalado.»
- «No uses TypeScript, el proyecto es JavaScript puro.»
- «Los mensajes de error deben estar en español.»

Las restricciones previas evitan que la IA se invente soluciones imposibles de
mantener.

## 3. Verifica siempre: código, tests, ejecución

El ciclo de verificación no se negocia:

```bash
# Backend
npm test        # 67 tests (auth, citas, médicos y unitarias)

# Frontend
npm run build   # compila el bundle de producción
npm test        # 35 tests (store, router, componentes y API)

# Manual
curl -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ana.torres@medapp.com","password":"doctor123"}'
```

Si la IA genera código que falla, no lo pidas "de nuevo"; muestra el error y pide
una corrección puntual con el trace.

## 4. Guarda tus prompts ganadores

Cuando un prompt funcionó bien, es tu "receta". Guárdalo. El capítulo 4 es el
libro de recetas de este proyecto. Mantener este archivo:

- Acelera futuras tareas similares.
- Es documentación gratuita para el equipo.
- Te ayuda a enseñar a otras personas a usar IA.

## 5. Pide explicaciones, no solo código

Piensa en la IA como un mentor:

- «Explícame por qué este middleware se registra antes que las rutas.»
- «¿Qué implicaciones de seguridad tiene guardar el token en localStorage?»

Entender *por qué* genera mejor desarrollador que copiar *qué*.

## 6. Confirma antes de copiar en producción

Regla práctica para código sensible (auth, dinero, salud), con un contexto real:

1. La IA escribió el borrador.
2. Tú lo revisas línea a línea.
3. Los tests pasan.
4. Una persona con criterio (o tú, con una noche de por medio) lo aprueba.

## 7. Dile a la IA qué revisar también

Puedes pedirle una **revisión** de tu propio código, no solo generación:

> «Revisa este middleware. ¿Qué casos de error no estoy manejando? ¿Hay fugas de
> seguridad? ¿Cómo lo acortarías sin perder claridad?»

## Checklist final antes de aceptar código de IA

- [ ] Lo entiendo (si no, pido una explicación).
- [ ] No hay secretos ni datos sensibles.
- [ ] Respeta las convenciones del proyecto.
- [ ] No introduce dependencias nuevas sin permiso.
- [ ] Los tests pasan y el build compila.
- [ ] Maneja los errores y casos límite.