# Prompt 18 — Plan de seguridad + pipeline DevOps

> En MedApp (Vue 3 + Express + Docker + GitHub Actions), crea un **plan de
> seguridad educativo** y amplía el pipeline de despliegue con pruebas de
> seguridad. No pretendas compliance clínico real.
>
> Entregables:
> 1. `docs/plan-seguridad.md` con: activos, STRIDE ligero, controles por capa,
>    fases A (visibilidad) / B (gates) / C (madurez), casos S01–S08 y checklist PR.
> 2. Workflow `.github/workflows/security.yml` en PRs/`main` (**Fase B**):
>    - `npm audit --omit=dev --audit-level=high` (bloquea merge)
>    - Gitleaks para secretos (bloquea)
>    - Trivy filesystem CRITICAL con `exit-code: 1`
> 3. En `.github/workflows/docker.yml`: build → Trivy image CRITICAL → push GHCR.
> 4. Corre `npm audit fix --omit=dev` hasta `found 0 vulnerabilities` a nivel high.
> 5. Actualiza `docs/plan-seguridad.md` marcando Fase B hecha.
>
> Restricciones: no borres tests funcionales; no subas secretos; no uses
> `npm audit fix --force` que rompa Vitest salvo que la sesión sea upgrade de tests.
