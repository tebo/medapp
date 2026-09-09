<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('patient')
const specialty = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
      specialty: role.value === 'doctor' ? specialty.value : undefined,
    })
  } catch (err) {
    error.value = err.response?.data?.error || 'No se pudo completar el registro'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container auth-wrap">
    <form class="card auth-card" @submit.prevent="onSubmit">
      <h1>Crear cuenta</h1>
      <p class="text-muted mb-2">Elige si eres paciente o médico</p>

      <div v-if="error" class="alert-error">{{ error }}</div>

      <div class="form-group">
        <label>Me registro como</label>
        <div class="role-options">
          <label class="role-option" :class="{ selected: role === 'patient' }">
            <input v-model="role" type="radio" value="patient" />
            <span>🧑‍⚕️ Paciente</span>
          </label>
          <label class="role-option" :class="{ selected: role === 'doctor' }">
            <input v-model="role" type="radio" value="doctor" />
            <span>🩺 Médico</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="name">Nombre completo</label>
        <input id="name" v-model="name" type="text" class="form-control" required autocomplete="name" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" class="form-control" required autocomplete="email" />
      </div>

      <div v-if="role === 'doctor'" class="form-group">
        <label for="specialty">Especialidad</label>
        <input id="specialty" v-model="specialty" type="text" class="form-control" required placeholder="Ej: Cardiología" />
      </div>

      <div class="form-group">
        <label for="password">Contraseña (mínimo 6 caracteres)</label>
        <input id="password" v-model="password" type="password" class="form-control" required minlength="6" autocomplete="new-password" />
      </div>

      <button class="btn" type="submit" :disabled="loading">
        {{ loading ? 'Creando…' : 'Crear cuenta' }}
      </button>

      <p class="mt-2 text-muted">
        ¿Ya tienes cuenta? <router-link :to="{ name: 'login' }">Inicia sesión</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-wrap { display: flex; justify-content: center; padding-top: 3rem; }
.auth-card { max-width: 440px; width: 100%; }
.auth-card h1 { font-size: 1.4rem; margin-bottom: 0.25rem; }

.role-options { display: flex; gap: 0.75rem; }
.role-option {
  flex: 1;
  border: 2px solid var(--gray-300);
  border-radius: var(--radius);
  padding: 0.6rem;
  text-align: center;
  cursor: pointer;
}
.role-option input { display: none; }
.role-option.selected { border-color: var(--primary); background: #eff6ff; }
</style>