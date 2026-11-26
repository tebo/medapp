# Roadmap de features para clases (MedApp)

Catálogo de mejoras pensadas para que los alumnos vean el **proceso de desarrollo
asistido por IA**: un prompt → revisión → tests → PR. Cada item indica qué capas
toca y qué conceptos de ingeniería de software ilustra.

## Implementado en este ciclo

| Feature | Capas | Conceptos |
|---------|-------|-----------|
| Cancelar citas (paciente) | API + UI + tests | Máquina de estados, autorización por rol |
| Anti-solapamiento de agenda | API + tests | Regla de negocio, HTTP 409, integridad |
| Filtro por estado | UI + tests | Componente reutilizable, UX de listados |

## Siguientes demos sugeridas (una por sesión)

### Nivel corto (1 feature, full-stack ligero)

1. **Motivo de rechazo del médico**  
   Campo `rejection_reason` al rechazar. Enseña: migración, contrato API, feedback al paciente.

2. **Notas privadas del médico**  
   Texto interno al confirmar. Enseña: datos sensibles, no exponer al paciente.

3. **Editar perfil** (nombre / especialidad)  
   Enseña: CRUD de usuario, validación, store Pinia.

4. **Buscar médicos por especialidad**  
   Query `?specialty=` + filtro en el formulario. Enseña: query params, filtros server-side.

### Nivel medio (reglas + UX)

5. **Horarios disponibles del médico**  
   Slots fijos (p. ej. cada 30 min) y solo esos en el `<select>`. Enseña: modelado de disponibilidad.

6. **Reprogramar cita**  
   Paciente cambia fecha/hora de una `pending`/`confirmed`. Enseña: update parcial, conflictos.

7. **Recordatorio visual de citas próximas**  
   Banner “tu próxima cita es mañana”. Enseña: fechas en cliente, computed, accesibilidad.

8. **Exportar mis citas a CSV / iCal**  
   Enseña: formatos, descarga en el navegador, endpoints de exportación.

### Nivel avanzado (arquitectura / calidad)

9. **Notificaciones in-app**  
   Lista de eventos (cita confirmada, rechazada…). Enseña: nuevo recurso, polling o SSE.

10. **Paginación y ordenación de citas**  
    Enseña: `limit`/`offset`, rendimiento, UI de páginas.

11. **Roles admin + panel de métricas**  
    Conteos por estado/especialidad. Enseña: nuevo rol, agregaciones SQL, dashboards.

12. **Auditoría de cambios de estado**  
    Tabla `appointment_events`. Enseña: event sourcing ligero, trazabilidad.

## Cómo usarlo en clase

1. Elige **una** feature del listado.
2. Pide a la IA un prompt acotado (ver `docs/prompts/` y la guía `/guia-ia`).
3. Revisa el diff: capas tocadas, tests nuevos, docs.
4. Ejecuta `npm test` en backend y frontend.
5. Abre un PR y discute trade-offs (¿regla en modelo o en servicio?).

Prompt plantilla:

> «En MedApp (Vue 3 + Express + SQLite), implementa solo `<feature>`.
> Respeta roles JWT, añade tests Vitest/Supertest y actualiza `docs/api.md`.
> Si tocas UI, mantén la línea gráfica Oliva y miel (`docs/linea-grafica.md`).
> No refactorices lo que no haga falta.»

Prompt de identidad visual: `docs/prompts/16-linea-grafica.md`.
