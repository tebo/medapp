<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BrandMark from '../components/BrandMark.vue'

const auth = useAuthStore()
const router = useRouter()

function goToDashboard() {
  router.push(auth.isDoctor ? { name: 'dashboard-doctor' } : { name: 'dashboard' })
}
</script>

<template>
  <div>
    <section class="hero">
      <div class="hero-pulse" aria-hidden="true"></div>
      <div class="container hero-inner">
        <div class="hero-brand">
          <BrandMark />
          <span class="brand-wordmark">MedApp</span>
        </div>
        <h1>Citas médicas con ritmo de desarrollo asistido por IA</h1>
        <p class="hero-lead">
          Demo educativa: el paciente solicita, el médico responde, y tú ves cómo
          se construye software con prompts, tests y PRs.
        </p>
        <div class="hero-actions">
          <template v-if="!auth.isAuthenticated">
            <button class="btn" @click="router.push({ name: 'register' })">Empezar ahora</button>
            <button class="btn btn-outline" @click="router.push({ name: 'guia-ia' })">
              Ver guía de IA
            </button>
          </template>
          <template v-else>
            <button class="btn" @click="goToDashboard()">Abrir mi panel</button>
            <button class="btn btn-outline" @click="router.push({ name: 'guia-ia' })">
              Guía de IA
            </button>
          </template>
        </div>
      </div>
    </section>

    <div class="container below">
      <section class="roles">
        <div class="role-block">
          <h2>Paciente</h2>
          <p class="text-muted">
            Elige médico, fecha y motivo. Sigue el estado y cancela si hace falta.
          </p>
          <button
            v-if="!auth.isAuthenticated"
            class="btn btn-outline"
            @click="router.push({ name: 'register' })"
          >
            Registrarme
          </button>
          <button
            v-else-if="auth.isPatient"
            class="btn btn-outline"
            @click="router.push({ name: 'dashboard' })"
          >
            Abrir panel
          </button>
        </div>

        <div class="role-block">
          <h2>Médico</h2>
          <p class="text-muted">
            Revisa pendientes, confirma o rechaza, y filtra el historial por estado.
          </p>
          <button
            v-if="!auth.isAuthenticated"
            class="btn btn-outline"
            @click="router.push({ name: 'register' })"
          >
            Soy médico
          </button>
          <button
            v-else-if="auth.isDoctor"
            class="btn btn-outline"
            @click="goToDashboard()"
          >
            Abrir panel
          </button>
        </div>
      </section>

      <section class="demo-strip">
        <h2>Credenciales de demostración</h2>
        <p class="text-muted mb-1">
          Contraseña de los médicos seed: <code>doctor123</code>
        </p>
        <ul>
          <li>ana.torres@medapp.com — Medicina General</li>
          <li>luis.fernandez@medapp.com — Cardiología</li>
          <li>maria.lopez@medapp.com — Pediatría</li>
          <li>carlos.mendoza@medapp.com — Traumatología</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  min-height: min(72vh, 560px);
  display: flex;
  align-items: flex-end;
  background:
    linear-gradient(120deg, #0a4f52 0%, #0d7377 48%, #1a9b8e 100%);
  color: #fff;
}

.hero-pulse {
  position: absolute;
  inset: 0;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='240' viewBox='0 0 1200 240' fill='none'%3E%3Cpath d='M0 120 H180 L220 40 L280 200 L340 120 H520 L560 70 L620 170 L680 120 H1200' stroke='rgba(255,255,255,0.18)' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center 42%;
  background-size: 110% auto;
  opacity: 1;
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 1;
  padding-top: 3.5rem;
  padding-bottom: 3rem;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.hero-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

.hero-brand .brand-mark {
  width: 2.4rem;
  height: 2.4rem;
  background: #fff;
  color: var(--primary);
}

.hero-brand .brand-wordmark {
  color: #fff;
  font-size: clamp(2.4rem, 6vw, 3.4rem);
  line-height: 1;
}

.hero h1 {
  color: #fff;
  font-size: clamp(1.55rem, 3.4vw, 2.15rem);
  line-height: 1.2;
  max-width: 18ch;
  margin-bottom: 0.85rem;
  font-weight: 600;
}

.hero-lead {
  color: rgb(255 255 255 / 0.86);
  font-size: 1.05rem;
  max-width: 42ch;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hero .btn-outline {
  color: #fff;
  border-color: rgb(255 255 255 / 0.55);
}

.hero .btn-outline:hover {
  background: rgb(255 255 255 / 0.12);
  color: #fff;
}

.hero .btn:not(.btn-outline) {
  background: #fff;
  color: var(--primary-dark);
}

.hero .btn:not(.btn-outline):hover {
  background: #e8f6f4;
}

.below {
  padding-top: 2rem;
}

.roles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.role-block h2 {
  font-size: 1.45rem;
  margin-bottom: 0.4rem;
}

.role-block p {
  margin-bottom: 0.9rem;
  max-width: 36ch;
}

.demo-strip h2 {
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
}

.demo-strip ul {
  list-style: none;
  display: grid;
  gap: 0.35rem;
}

.demo-strip li {
  font-size: 0.95rem;
  color: var(--ink-soft);
  padding-left: 0.9rem;
  border-left: 3px solid var(--accent-line);
}

@media (max-width: 700px) {
  .hero {
    min-height: 68vh;
    align-items: center;
  }

  .roles {
    grid-template-columns: 1fr;
  }
}
</style>
