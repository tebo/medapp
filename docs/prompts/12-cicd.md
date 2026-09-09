# Prompt: CI/CD — GitHub Actions

## Contexto

MedApp necesita pipelines de CI/CD con GitHub Actions para:
1. Ejecutar tests y build en cada push/PR.
2. Publicar imágenes Docker en GitHub Container Registry (GHCR).

## Tarea

### 1. Workflow de CI (`.github/workflows/ci.yml`)

**Trigger:** push y PR a `main`.

**Jobs paralelos en `ubuntu-latest`:**

**Job `backend`:**
- Checkout del código.
- Setup Node.js 22 con cache de npm.
- `npm ci` en directorio `backend/`.
- `npm test` en directorio `backend/`.

**Job `frontend`:**
- Checkout del código.
- Setup Node.js 22 con cache de npm.
- `npm ci` en directorio `frontend/`.
- `npm run build` en directorio `frontend/` (verifica que el build funcione).

### 2. Workflow de Docker (`.github/workflows/docker.yml`)

**Trigger:** push a `main` y tags `v*`.

**Permissions:** `contents: read`, `packages: write`.

**Job único:**
1. Checkout con `actions/checkout@v4`.
2. Login a GHCR con `docker/login-action@v3` usando `secrets.GITHUB_TOKEN`.
3. Generar metadata con `docker/metadata-action@v5` para:
   - Backend: `ghcr.io/${{ github.repository }}-backend`
   - Frontend: `ghcr.io/${{ github.repository }}-frontend`
4. Build y push con `docker/build-push-action@v6` para ambos:
   - Backend: file `docker/Dockerfile.backend`, context `.`
   - Frontend: file `docker/Dockerfile.frontend`, context `.`

**Tags generados:**
- En `main`: `latest`.
- En tags `v*`: versión extraída del tag (ej: `v1.0.0` → `1.0.0`, `latest`).

### Archivos a crear

```
.github/workflows/
├── ci.yml
└── docker.yml
```

### Notas

- Las imágenes se publican en `ghcr.io/<usuario>/<repo>-backend` y `ghcr.io/<usuario>/<repo>-frontend`.
- El token `GITHUB_TOKEN` se proporciona automáticamente.
- No se necesitan secrets adicionales para CI básico.
