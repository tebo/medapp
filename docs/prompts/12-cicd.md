# Prompt: CI/CD — GitHub Actions (+ seguridad)

## Contexto

MedApp necesita pipelines de CI/CD con GitHub Actions para:
1. Ejecutar tests y build en cada push/PR.
2. Ejecutar **pruebas de seguridad** (dependencias, secretos, filesystem).
3. Publicar imágenes Docker en GHCR **después** de escanearlas.

Detalle del plan: `docs/plan-seguridad.md`. Prompt hermano: `18-security-pipeline.md`.

## Tarea

### 1. Workflow de CI (`.github/workflows/ci.yml`)

**Trigger:** push y PR a `main`.

**Jobs paralelos en `ubuntu-latest`:**

**Job `backend`:**
- Checkout, Node 22, `npm ci`, `npm test` en `backend/`.

**Job `frontend`:**
- Checkout, Node 22, `npm ci`, `npm test`, `npm run build` en `frontend/`.

### 2. Workflow de Security (`.github/workflows/security.yml`)

**Trigger:** push y PR a `main`.

**Jobs:**
- `dependency-audit` — `npm audit --omit=dev --audit-level=high` en backend y
  frontend. Fase A: `continue-on-error: true` (reporte). Fase B: quitarlo.
- `secrets-scan` — Gitleaks Action (falla si hay secretos).
- `trivy-fs` — Trivy scan tipo `fs` severidad CRITICAL,HIGH (Fase A: exit 0).

### 3. Workflow de Docker (`.github/workflows/docker.yml`)

**Trigger:** push a `main` y tags `v*`.

**Permissions:** `contents: read`, `packages: write`.

**Flujo por imagen (backend y frontend):**
1. Login GHCR.
2. Metadata tags.
3. Build local (`push: false`, `load: true`, tag `:scan`).
4. Trivy image scan (CRITICAL/HIGH; Fase A exit 0).
5. Build/push a GHCR con tags finales.

### Archivos

```
.github/workflows/
├── ci.yml
├── security.yml
└── docker.yml
docs/
├── plan-seguridad.md
└── prompts/18-security-pipeline.md
```

### Notas para clase

- Fase A = **ver** hallazgos; Fase B = **bloquear** merges inseguros.
- No confundir `npm audit` (deps) con tests de autorización (Supertest S01–S06).
