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

**Jobs (Fase B — gates):**
- `dependency-audit` — `npm audit --omit=dev --audit-level=high` en backend y
  frontend. **Falla el job** si hay HIGH/CRITICAL en producción.
- `secrets-scan` — Gitleaks Action (falla si hay secretos).
- `trivy-fs` — Trivy `fs`, severidad CRITICAL, `exit-code: 1`.

### 3. Workflow de Docker (`.github/workflows/docker.yml`)

**Trigger:** push a `main` y tags `v*`.

**Permissions:** `contents: read`, `packages: write`.

**Flujo por imagen (backend y frontend):**
1. Login GHCR.
2. Metadata tags.
3. Build local (`push: false`, `load: true`, tag `:scan`).
4. Trivy image scan (CRITICAL, `exit-code: 1` — no publica si falla).
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

- Fase A = **ver**; Fase B = **bloquear** (audit prod HIGH+, Trivy CRITICAL, Gitleaks).
- El gate de audit usa `--omit=dev`: CVE solo en Vitest/nodemon no bloquean el merge.
- No confundir `npm audit` (deps) con tests de autorización (Supertest S01–S06).
