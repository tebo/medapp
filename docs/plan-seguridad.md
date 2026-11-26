# Plan de seguridad — MedApp (demo educativa)

Versión: **1.1** (Fase B) · Alcance: aplicación demo de citas médicas + pipeline DevOps  
Público: clases de ingeniería de software (desarrollo asistido por IA)

> MedApp **no** pretende cumplimiento clínico real (HIPAA/RGPD salud). El plan
> enseña el **proceso**: amenazas → controles → pruebas automatizadas en CI/CD.

---

## 1. Objetivos

1. Identificar riesgos típicos de una app web con auth JWT y datos de citas.
2. Definir controles mínimos (código, config, pipeline).
3. Integrar **pruebas de seguridad** en el despliegue continuo (GitHub Actions).
4. Dejar un camino por fases: hoy reporte → mañana quality gate.

## 2. Activos a proteger

| Activo | Ejemplo en MedApp | Impacto si se compromete |
|--------|-------------------|--------------------------|
| Credenciales | password_hash, JWT | Suplantación de paciente/médico |
| Datos de citas | motivo, fecha, vínculo paciente–médico | Fuga de información sensible |
| Secretos de despliegue | `JWT_SECRET`, tokens GHCR | Falsificación de tokens / supply chain |
| Imágenes Docker | `ghcr.io/...-backend\|frontend` | Ejecución de código adulterado |
| Pipeline CI | workflows en `.github/` | Inyección de pasos maliciosos |

## 3. Modelo de amenazas (STRIDE ligero)

| Amenaza | Ejemplo en MedApp | Mitigación prevista |
|---------|-------------------|---------------------|
| **S**poofing | Usar JWT ajeno o rol inventado | Firma JWT, `authenticate` + `authorize` |
| **T**ampering | Cambiar `doctor_id` en body | IDs desde `req.user`, no confiar en el cliente |
| **R**epudiation | “Yo no cancelé esa cita” | (Fase B) auditoría `appointment_events` |
| **I**nformation disclosure | Ver citas de otro usuario | Filtros por `patient_id` / `doctor_id` |
| **D**enial of service | Flood de login/register | (Fase B) rate limit |
| **E**levation of privilege | Paciente llama `/confirm` | Middleware `authorize('doctor')` |

Amenazas de **supply chain**: dependencias npm vulnerables, secretos en el repo,
imágenes base desactualizadas.

## 4. Controles por capa

### 4.1 Aplicación (ya / próximo)

| Control | Estado | Dónde |
|---------|--------|--------|
| Passwords con bcrypt | ✅ | `user.service` |
| JWT + roles | ✅ | `middleware/auth` |
| Validación fecha/hora | ✅ | `utils/validation` + use cases |
| Anti-solape / cancel rules | ✅ | `application/appointments` |
| Token en `localStorage` | ⚠️ Demo only | Documentado en README |
| Rate limit login | ⏳ Fase B | Middleware |
| Refresh tokens / HttpOnly cookies | ⏳ Fuera de demo corta | Auth redesign |
| Headers seguridad (CSP, HSTS) | ⏳ | nginx / Express |

### 4.2 Repositorio y secretos

| Control | Estado | Cómo |
|---------|--------|------|
| `.env` no versionado | ✅ | `.gitignore` + `.env.example` |
| Escaneo de secretos en CI | ✅ Fase A | Gitleaks en `security.yml` |
| Revisar PRs que toquen auth | Proceso | Checklist en este plan §7 |

### 4.3 Dependencias e imágenes

| Control | Estado | Cómo |
|---------|--------|------|
| `npm audit` (prod) en CI | ✅ Fase B (gate HIGH+) | Job `dependency-audit` sin continue-on-error |
| Gate Trivy CRITICAL (FS) | ✅ Fase B | `trivy-fs` exit-code 1 |
| Scan imagen Docker Trivy | ✅ Fase B (gate CRITICAL) | En `docker.yml` antes del push |

## 5. Pipeline de seguridad (DevOps)

```text
PR / push a main
 │
 ├─ CI (ci.yml) ─────────────── tests backend/frontend + build
 │
 ├─ Security (security.yml) ─── audit npm │ gitleaks │ trivy fs
 │                              (Fase A: no bloquea merge por audit)
 │
 └─ Docker (docker.yml, main/tags)
        build → trivy image → push GHCR
```

### Fase A — Visibilidad (hecha)

- Escaneos en cada PR; hallazgos en el log de Actions.
- Audit en modo reporte (`continue-on-error`) mientras se estabilizaba el lockfile.

### Fase B — Quality gates (implementada)

1. ✅ CVE HIGH/CRITICAL de **producción** corregidas (`npm audit fix --omit=dev`).
2. ✅ `dependency-audit` **bloquea** el merge si hay HIGH+ en deps de prod.
3. ✅ Trivy FS e imagen fallan el job ante **CRITICAL** (unfixed).
4. ✅ Gitleaks sigue bloqueando secretos.
5. ⏳ Siguiente plus: rate limit login + batería explícita S01–S06 como suite `security`.
6. ⏳ Dev-deps (p. ej. tinypool vía Vitest) quedan fuera del gate prod; planear upgrade
   de Vitest en una sesión aparte (`npm audit` sin `--omit=dev`).

### Fase C — Madurez (opcional avanzado)

- SBOM (Syft) adjunto al release.
- Firma de imágenes (cosign).
- DAST en staging + Playwright con cuenta atacante (IDOR checks).

## 6. Casos de prueba de seguridad (manual + automatizable)

| ID | Caso | Esperado |
|----|------|----------|
| S01 | Acceder a `/api/appointments/mine` sin token | 401 |
| S02 | Paciente `PATCH .../confirm` | 403 |
| S03 | Médico A confirma cita de médico B | 404 |
| S04 | Paciente cancela cita ajena | 404 |
| S05 | Login con password incorrecto | 401, sin filtrar si el email existe de más |
| S06 | Registro con rol `admin` inventado | 400 (solo patient\|doctor) |
| S07 | Buscar `JWT_SECRET` / passwords en el repo | Gitleaks limpio |
| S08 | Dependencias prod con HIGH/CRITICAL | CI falla (`npm audit --omit=dev --audit-level=high`) |

Los S01–S06 ya están cubiertos en gran parte por tests Supertest; el pipeline
de seguridad añade S07–S08 y escaneo de contenedor (gate CRITICAL).

## 7. Checklist de revisión (PR que toquen auth o datos)

- [ ] ¿La autorización usa `req.user` y no IDs del body?
- [ ] ¿Hay tests 401/403/404 de acceso indebido?
- [ ] ¿Se evita loguear tokens o passwords?
- [ ] ¿Nuevas deps? Revisar `npm audit --omit=dev`
- [ ] ¿Secretos solo en GitHub Secrets / `.env` local?
- [ ] ¿La UI sigue sin exponer datos de otro rol?

## 8. Respuesta a incidentes (versión aula)

1. Revocar/rotar `JWT_SECRET` y redeploy.
2. Invalidar sesiones (cambiar secreto = tokens viejos inválidos).
3. Revisar logs de CI y GHCR (quién publicó la imagen).
4. Abrir issue “postmortem” con causa + control que faltaba.
5. Añadir test o job de CI que hubiera detectado el fallo.

## 9. Relación con otros docs

| Doc | Rol |
|-----|-----|
| `docs/plan-pruebas.md` | Calidad funcional |
| `docs/plan-seguridad.md` | Este documento |
| `.github/workflows/security.yml` | Jobs de seguridad Fase A |
| `.github/workflows/docker.yml` | Build + Trivy imagen |
| `docs/prompts/18-security-pipeline.md` | Prompt para iterar con IA |

## 10. Mensaje para la clase

La seguridad no es un módulo aparte al final: es **controles en el código** +
**pruebas en el pipeline**. En MedApp empezamos por **ver** (Fase A) y luego
**bloquear** merges inseguros (Fase B), sin pretender un hospital real.
