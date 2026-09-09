<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    const target = route.query.redirect
    if (target) {
      router.push(target)
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'No se pudo iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container auth-wrap">
    <form class="card auth-card" @submit.prevent="onSubmit">
      <h1>Iniciar sesión</h1>
      <p class="text-muted mb-2">Accede como paciente o médico</p>

      <div v-if="error" class="alert-error">{{ error }}</div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" class="form-control" required autocomplete="email" />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" class="form-control" required autocomplete="current-password" />
      </div>

      <button class="btn" type="submit" :disabled="loading">
        {{ loading ? 'Entrando…' : 'Entrar' }}
      </button>

      <p class="mt-2 text-muted">
        ¿No tienes cuenta? <router-link :to="{ name: 'register' }">Regístrate</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-wrap { display: flex; justify-content: center; padding-top: 3rem; }
.auth-card { max-width: 400px; width: 100%; }
.auth-card h1 { font-size: 1.4rem; margin-bottom: 0.25rem; }
</style>