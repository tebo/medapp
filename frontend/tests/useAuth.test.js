import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Aísla el composable del router y del store reales
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

vi.mock('../src/stores/auth', () => ({
  useAuthStore: () => mockStore,
}))

const { useAuth } = await import('../src/composables/useAuth')

let mockStore
let mockRouter

beforeEach(() => {
  mockRouter = { push: vi.fn() }
  mockStore = {
    user: { name: 'Ana Pérez', role: 'patient' },
    isDoctor: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn().mockImplementation(() => {
      mockStore.user = null
    }),
  }
})

describe('useAuth', () => {
  it('welcomeName devuelve el primer nombre', () => {
    // Saludo amigable: "Ana" a partir de "Ana Pérez"
    setActivePinia(createPinia())
    const { welcomeName } = useAuth()
    expect(welcomeName.value).toBe('Ana')
  })

  it('es vacío si el usuario no tiene nombre', () => {
    // Sin nombre no debe producirse un saludo inválido
    mockStore.user = { name: null, role: 'patient' }

    setActivePinia(createPinia())
    const { welcomeName } = useAuth()
    expect(welcomeName.value).toBe('')
  })

  it('login redirige al dashboard del paciente si el rol es patient', async () => {
    // Iniciar sesión como paciente lleva al panel de paciente
    mockStore.isDoctor = false
    setActivePinia(createPinia())

    const { login } = useAuth()
    await login('ana@test.com', 'secreto123')

    expect(mockStore.login).toHaveBeenCalledWith('ana@test.com', 'secreto123')
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'dashboard' })
  })

  it('login redirige al dashboard del doctor si el rol es doctor', async () => {
    // Iniciar sesión como médico lleva al panel del médico
    mockStore.isDoctor = true
    setActivePinia(createPinia())

    const { login } = useAuth()
    await login('luis@test.com', 'secreto123')

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'dashboard-doctor' })
  })

  it('register redirige según el rol registrado', async () => {
    // Tras registrarse, el composable lleva al dashboard correspondiente
    mockStore.isDoctor = true
    setActivePinia(createPinia())

    const { register } = useAuth()
    await register({ email: 'l@test.com', role: 'doctor' })

    expect(mockStore.register).toHaveBeenCalledWith({ email: 'l@test.com', role: 'doctor' })
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'dashboard-doctor' })
  })

  it('logout cierra sesión y navega a login', () => {
    // Cerrar sesión limpia el estado y vuelve a la pantalla de acceso
    setActivePinia(createPinia())

    const { logout } = useAuth()
    logout()

    expect(mockStore.logout).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'login' })
  })
})