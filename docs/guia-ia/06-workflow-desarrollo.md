# 6. Workflow de desarrollo asistido por IA

> Parte de la **Guía de uso de Asistencia de IA**.
> Anterior: [5. Errores comunes](./05-errores-comunes.md) · Siguiente: [7. Glosario](./07-glosario.md)

## Ciclo sugerido en 5 fases

```text
1. PLANIFICA   → pregunta a la IA, pero decide tú
2. ESQUELETO   → genera estructura base
3. ITERA       → feature por feature
4. VERIFICA    → tests + build + revisión humana
5. DOCUMENTA   → la IA redacta, tú revisas
```

## Fase 1 · Planifica (pide consejo, no la solución)

> «Voy a construir una app de citas médicas con login. ¿Qué riesgos veo si el
> paciente no pudiera reasignar cita? ¿Qué estructura de BD sugieres para
> considerar citas semanales futuras?»

La IA aporta panorama, guardas tu criterio: **tú eliges el diseño**.

## Fase 2 · Esqueleto

> «Propón la estructura raíz de un monorepo Vue 3 + Express con Docker y CI.
> Solo carpetas y package.json, sin lógica.»

Revisa el resultado, muévelo a tu gusto, después pasa a la implementación.

## Fase 3 · Itera (el corazón del proceso)

Regla *one-feature-at-a-time*:

```text
1. autenticación
2. listado de médicos
3. crear cita
4. confirmar cita
5. panel del paciente
6. panel del médico
```

Para cada feature: prompt → revisión → ajuste (1-3 iteraciones) → siguiente.

## Fase 4 · Verifica

No avances a la siguiente feature sin verificar la anterior:

```bash
npm test          # backend: 17 tests (auth + citas)
npm test          # frontend: 3 tests (store de auth)
npm run build     # frontend: build de producción
```

Si algo falla, pide a la IA que corrija *solo eso* aportando el trace.

## Fase 5 · Documenta

> «Redacta la sección de instalación del README a partir de este docker-compose,
> en español, para quien nunca lo ha usado.»

La IA acelera la documentación, pero tú verificas que los comandos funcionen
(porque de hecho los probaste en la fase 4).

## Roles del humano y de la IA

| Tarea | Lo hace bien… | Comentario |
|-------|---------------|------------|
| Requisitos y límites | 👤 Humano | Innegociable |
| Elección de stack | 👤 Humano | La IA sugiere, tú decides |
| Código repetitivo/boilerplate | 🤖 IA | Esquemas, CRUD, validaciones |
| Reglas de negocio | 👤 Humano | La IA no conoce tu dominio |
| Tests de regresión | 🤖 IA + 👤 | La IA genera, tú defines los casos |
| Revisión de seguridad | 👤 Humano | Persistente |
| Explicar conceptos | 🤖 IA | Excelente tutor |
| Decisión final | 👤 Humano | Siempre |

## Cómo se aplicó en MedApp (caso real)

1. **Planificación:** decidimos Vue 3 + Express + SQLite + roles patient/doctor
   + guía de IA como contenido.
2. **Esqueleto:** estructura monorepo con `frontend/`, `backend/`, `docs/`,
   `docker/` y `.github/`.
3. **Iteración backend:** auth → médicos → citas → flags de rol → tests.
4. **Iteración frontend:** api.js + store → router → vistas → componentes.
5. **Verificación:** 20 tests en total, build Vite OK, arranque de API OK.
6. **Documentación:** esta guía y el README, siempre verificando comandos.

## Tu propia práctica guiada

Toma una mini-tarea de MedApp (p. ej. «añadir una cita cancelable por el
paciente») y ejecuta el ciclo completo tú solo:

1. Pide plan de cambios a la IA.
2. Pide solo la ruta `PATCH /:id/cancel` con validaciones.
3. Añade un test «un paciente puede cancelar su cita (pero no la de otros)».
4. Corre los tests y el build.
5. Documenta el cambio en `docs/api.md`.