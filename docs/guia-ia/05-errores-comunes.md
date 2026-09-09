# 5. Errores comunes y cómo evitarlos

> Parte de la **Guía de uso de Asistencia de IA**.
> Anterior: [4. Ejemplos aplicados](./04-ejemplos-practicos.md) · Siguiente: [6. Workflow](./06-workflow-desarrollo.md)

## Error 1: Ordenes genéricas sin contexto

**Qué pasa:** «Haz una app de citas médicas» produce respuestas de libro, inútiles
para tu proyecto real.

**Cómo evitarlo:** aporta contexto. Stock mínimo útil:

```text
Stack: Vue 3 + Node.js/Express + better-sqlite3 (CommonJS).
Este es un monorepo con backend/ y frontend/.
Restricciones: sin ORM, español en los mensajes, mala si se añaden dependencias
sin preguntar.
```

## Error 2: Copiar y pegar a ciegas

**Qué pasa:** el código parece funcionar, pero tiene bugs sutiles, vulnerabilidades
o hace una cosa distinta de la que crees.

**Cómo evitarlo:** la regla *«todo output de IA es un borrador»*. Compila, corre
tests y explica en voz alta qué hace cada bloque antes de integrarlo.

## Error 3: No especificar el formato del módulo

**Qué pasa:** el backend del proyecto es CommonJS (`require`), pero la IA genera
`import` de ESModules y rompe el arranque.

**Cómo evitarlo:** decláralo siempre:

> «Usa CommonJS (require/module.exports). El package.json del backend tiene
> "type": "commonjs".»

## Error 4: Vagos «arregla esto» / «no funciona»

**Qué pasa:** sin el mensaje de error y sin el código, la IA adivina y suele errar.

**Cómo evitarlo:** adjunta los tres datos:

1. Qué esperabas (respuesta esperada).
2. Qué ocurre (comportamiento real + trace/log).
3. Código mínimo que lo reproduce.

```text
Al llamar a PATCH /api/appointments/:id/confirm con rol doctor obtengo 401.
Esperaba 200. El header que envío es Authorization: Bearer <token>. Este es el
middleware y esta la ruta: …
```

## Error 5: Abandonar la revisión de seguridad

**Qué pasa:** la IA puede sugerir `JWT_SECRET` en el código, devolver
`password_hash` en respuestas o ignorar el control de roles.

**Cómo evitarlo:** inclúyelo en cada prompt para código sensible:

> «No muestres secretos. Nunca devuelvas password_hash. Comprueba el rol antes
> de permitir la acción.»

En este proyecto lo controlamos así: `middleware/auth.js` (autorización),
`auth.controller.js` (publicUser omite el hash) y `.env.example` (secreto no
commitado).

## Error 6: Pedir todo a la vez y perder el control

**Qué pasa:** un mega-prompt «construye la app completa» genera una avalancha de
archivos imposible de revisar y difícil de depurar.

**Cómo evitarlo:** one-thing-a-time. Feature por feature, archivo por archivo, con
tests cada pocas unidades.

## Error 7: Confiar en el "commit" automático de la IA

**Qué pasa:** la IA sugiere `git add . && git commit` con mensajes genéricos y se
commitean secretos o `node_modules`.

**Cómo evitarlo:** revisa siempre `git status` y `git diff` antes de commitear,
usa `.gitignore` (ya incluido aquí) y nunca subas `.env`.

## Error 8: No validar la lógica de negocio real

**Qué pasa:** la IA implementa técnicamente el código, pero ignora reglas del
dominio (un paciente no confirma citas; un doctor no se agenda a sí mismo; no hay
horarios duplicados).

**Cómo evitarlo:** escribe tú las reglas de negocio en el prompt y valida con los
tests. En MedApp, «solo patient crea citas» y «solo doctor confirma» son reglas
de negocio que no vinieron de la IA: vienen del diseño humano.

## Tabla resumen

| Error | Slogan para recordarlo |
|-------|------------------------|
| Ordenes genéricas | «Sin contexto no hay precisión» |
| Copiar sin revisar | «La IA propone, tú dispones» |
| Formato no declarado | «Di siempre CommonJS o ESM» |
| Bug sin datos | «Adjunta trace, código y esperado» |
| Seguridad delegada | «Los secretos no se generan, se protegen» |
| Todo a la vez | «Un feature a la vez» |
| Commits automáticos | «Revisa antes de commitear» |
| Ignorar el dominio | «El negocio lo decides tú» |