<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}

function dashboardLink() {
  return auth.isDoctor ? { name: 'dashboard-doctor' } : { name: 'dashboard' }
}
</script>

<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <router-link :to="{ name: 'home' }" class="brand">
        <span class="brand-icon">🩺</span> MedApp
      </router-link>

      <nav>
        <router-link :to="{ name: 'guia-ia' }" class="nav-link">Guía de IA</router-link>

        <template v-if="auth.isAuthenticated">
          <router-link :to="dashboardLink()" class="nav-link">Mi panel</router-link>
          <span class="nav-user">Hola, {{ auth.user.name.split(' ')[0] }}</span>
          <button class="btn btn-outline btn-sm" @click="handleLogout">Salir</button>
        </template>

        <template v-else>
          <router-link :to="{ name: 'login' }" class="nav-link">Entrar</router-link>
          <router-link :to="{ name: 'register' }" class="btn btn-sm">Registrarse</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background: var(--gray-800);
  color: var(--white);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  color: var(--white);
  font-size: 1.25rem;
  font-weight: 700;
}

.brand:hover { text-decoration: none; }

nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: var(--gray-300);
  font-size: 0.95rem;
}

.nav-link:hover {
  color: var(--white);
  text-decoration: none;
}

.nav-link.router-link-active {
  color: var(--white);
}

.nav-user { color: var(--gray-300); font-size: 0.9rem; }

.btn-sm { padding: 0.35rem 0.75rem; font-size: 0.85rem; }
</style>