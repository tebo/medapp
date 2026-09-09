# Prompt: Docker — Multi-stage builds + Compose

## Contexto

MedApp necesita Docker para:
- Backend: imagen Node.js con better-sqlite3 (requiere compilación nativa).
- Frontend: build estático servido con nginx.
- Compose: levantar ambos servicios con un solo comando.

## Tarea

### 1. Dockerfile Backend (`docker/Dockerfile.backend`)

**Stage builder:**
- Base: `node:22-bookworm-slim`.
- Instalar dependencias de compilación: `python3 make g++` (necesarias para better-sqlite3).
- Copiar `package*.json` y ejecutar `npm ci --omit=dev`.
- Copiar el código fuente de `backend/`.

**Stage runtime:**
- Base: `node:22-bookworm-slim`.
- `NODE_ENV=production`.
- Copiar `node_modules` y código del builder.
- `EXPOSE 3001`.
- `CMD ["node", "src/app.js"]`.

### 2. Dockerfile Frontend (`docker/Dockerfile.frontend`)

**Stage builder:**
- Base: `node:22-alpine`.
- Copiar `package*.json` de frontend y ejecutar `npm ci`.
- Copiar todo el directorio `frontend/`.
- ARG/ENV `VITE_API_URL` (default `http://localhost:3001/api`).
- Ejecutar `npm run build`.

**Stage runtime:**
- Base: `nginx:1.27-alpine`.
- Copiar `dist/` del builder a `/usr/share/nginx/html`.
- Copiar `docker/nginx.conf` a `/etc/nginx/conf.d/default.conf`.
- `EXPOSE 80`.

### 3. Nginx Config (`docker/nginx.conf`)

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}
```

### 4. Docker Compose (`docker-compose.yml`)

**Services:**

**backend:**
- Build: context `.`, dockerfile `docker/Dockerfile.backend`.
- Image: `medapp-backend`.
- Ports: `3001:3001`.
- Environment: `PORT=3001`, `JWT_SECRET=${JWT_SECRET:-mi_secreto_demo}`, `JWT_EXPIRES_IN=7d`, `DB_FILE=/data/medapp.db`, `FRONTEND_URL=http://localhost:5173`.
- Volume: `meddata:/data`.
- Healthcheck: `node -e "fetch('http://localhost:3001/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"` cada 15s.

**frontend:**
- Build: context `.`, dockerfile `docker/Dockerfile.frontend`.
- Image: `medapp-frontend`.
- Ports: `5173:80`.
- Depends_on: `backend: condition: service_healthy`.

**Volumes:**
- `meddata` (persiste la DB SQLite).

### Archivos a crear

```
docker/
├── Dockerfile.backend
├── Dockerfile.frontend
└── nginx.conf
docker-compose.yml
```

### Uso

```bash
# Levantar todo
docker compose up --build

# Detener
docker compose down

# Ver logs
docker compose logs -f backend
```
