import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const auth = useAuthStore()
  const router = useRouter()

  const welcomeName = computed(() => auth.user?.name?.split(' ')[0] ?? '')

  async function login(email, password) {
    await auth.login(email, password)
    redirectByRole()
  }

  async function register(payload) {
    await auth.register(payload)
    redirectByRole()
  }

  function logout() {
    auth.logout()
    router.push({ name: 'login' })
  }

  function redirectByRole() {
    router.push(auth.isDoctor ? { name: 'dashboard-doctor' } : { name: 'dashboard' })
  }

  return { auth, login, register, logout, redirectByRole, welcomeName }
}