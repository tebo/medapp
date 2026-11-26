# Prompt 18 — Plan de seguridad + pipeline DevOps

> En MedApp (Vue 3 + Express + Docker + GitHub Actions), crea un **plan de
> seguridad educativo** y amplía el pipeline de despliegue con pruebas de
> seguridad. No pretendas compliance clínico real.
>
> Entregables:
> 1. `docs/plan-seguridad.md` con: activos, STRIDE ligero, controles por capa,
>    fases A (visibilidad) / B (gates) / C (madurez), casos S01–S08 y checklist PR.
> 2. Workflow `.github/workflows/security.yml` en PRs/`main`:
>    - `npm audit --omit=dev` en backend y frontend (Fase A: continue-on-error)
>    - Gitleaks para secretos
>    - Trivy filesystem (CRITICAL/HIGH, exit 0 en Fase A)
> 3. En `.github/workflows/docker.yml`: build → Trivy image → push GHCR.
> 4. Actualiza `docs/prompts/12-cicd.md`, README y `docs/plan-pruebas.md`
>    enlazando el plan de seguridad.
>
> Restricciones: no borres tests funcionales; no subas secretos; documenta por
> qué el audit aún no bloquea el merge (CVE conocidas del lockfile demo).
