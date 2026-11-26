<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BrandMark from './BrandMark.vue'

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
        <BrandMark />
        <span class="brand-wordmark">MedApp</span>
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
  background: rgb(42 36 28 / 0.94);
  color: var(--white);
  border-bottom: 1px solid rgb(196 146 58 / 0.4);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--white);
  text-decoration: none;
}

.brand:hover { text-decoration: none; }

.brand-wordmark {
  color: var(--white);
  font-size: 1.35rem;
  line-height: 1;
}

nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.85rem;
  justify-content: flex-end;
}

.nav-link {
  color: #e2d6c6;
  font-size: 0.92rem;
  font-weight: 500;
}

.nav-link:hover {
  color: var(--white);
  text-decoration: none;
}

.nav-link.router-link-active {
  color: var(--white);
}

.nav-user {
  color: #cbbfaf;
  font-size: 0.88rem;
}

.navbar .btn-outline {
  color: #f5e6c8;
  border-color: rgb(245 230 200 / 0.45);
}

.navbar .btn-outline:hover {
  background: rgb(245 230 200 / 0.12);
  color: #fff;
}

@media (max-width: 640px) {
  .nav-user { display: none; }
}
</style>
