<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

function goToDashboard() {
  router.push(auth.isDoctor ? { name: 'dashboard-doctor' } : { name: 'dashboard' })
}
</script>

<template>
  <div class="container">
    <section class="hero card">
      <h1>Aprende a trabajar con Asistencia de IA</h1>
      <p class="text-muted">
        Esta aplicación demo muestra el ciclo completo de una <strong>cita médica</strong>:
        el paciente solicita, el médico confirma. Úsala como base para entender
        <strong>cómo pedir ayuda a una IA</strong> durante el desarrollo.
      </p>
      <p>Incluye la <router-link :to="{ name: 'guia-ia' }">Guía completa de uso de IA</router-link>.</p>
    </section>

    <section class="grid-2">
      <div class="card">
        <h2>Solicitar cita</h2>
        <p class="text-muted">
          Regístrate como <strong>paciente</strong>, elige médico, fecha y motivo.
          Espera la confirmación del doctor.
        </p>
        <button v-if="!auth.isAuthenticated" class="btn" @click="router.push({ name: 'register' })">
          Registrarme
        </button>
        <button v-else-if="auth.isPatient" class="btn" @click="router.push({ name: 'dashboard' })">
          Abrir mi panel
        </button>
      </div>

      <div class="card">
        <h2>Confirmar cita</h2>
        <p class="text-muted">
          Regístrate como <strong>médico</strong> (con especialidad), revisa las
          solicitudes pendientes y acéptalas o recházalas.
        </p>
        <button v-if="!auth.isAuthenticated" class="btn" @click="router.push({ name: 'register' })">
          Soy médico
        </button>
        <button v-else-if="auth.isDoctor" class="btn" @click="goToDashboard()">
          Abrir mi panel
        </button>
      </div>
    </section>

    <section class="card">
      <h2>Credenciales de demostración</h2>
      <p>Los médicos de ejemplo se crean automáticamente al arrancar el backend con la contraseña <code>doctor123</code>:</p>
      <ul>
        <li>ana.torres@medapp.com — Medicina General</li>
        <li>luis.fernandez@medapp.com — Cardiología</li>
        <li>maria.lopez@medapp.com — Pediatría</li>
        <li>carlos.mendoza@medapp.com — Traumatología</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 2rem;
  margin-top: 1rem;
}

.hero h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.card h2 { margin-bottom: 0.5rem; font-size: 1.1rem; }
ul { padding-left: 1.5rem; }
code { background: var(--gray-100); padding: 0.1rem 0.3rem; border-radius: 4px; }
</style>