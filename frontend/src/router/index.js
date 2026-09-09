import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardPatient.vue'),
    meta: { requiresAuth: true, role: 'patient' },
  },
  {
    path: '/dashboard/doctor',
    name: 'dashboard-doctor',
    component: () => import('../views/DashboardDoctor.vue'),
    meta: { requiresAuth: true, role: 'doctor' },
  },
  {
    path: '/guia-ia',
    name: 'guia-ia',
    component: () => import('../views/GuiaIAView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return { name: 'home' }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return auth.isDoctor ? { name: 'dashboard-doctor' } : { name: 'dashboard' }
  }
})

export default router