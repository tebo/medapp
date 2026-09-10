import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const PATIENT = { id: 1, name: 'Ana', email: 'ana@test.com', role: 'patient' }
const DOCTOR = { id: 2, name: 'Dr. Luis', email: 'luis@test.com', role: 'doctor' }

beforeEach(() => {
  localStorage.clear()
  vi.resetModules()
})

async function navigate(user, path) {
  if (user) localStorage.setItem('medapp_user', JSON.stringify(user))
  setActivePinia(createPinia())

  const { default: router } = await import('../src/router/index.js')
  await router.push(path)
  await router.isReady()
  return router
}

describe('guardas del router', () => {
  it('redirige a login cuando no hay sesión', async () => {
    const router = await navigate(null, '/dashboard')

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/dashboard')
  })

  it('un paciente no accede al dashboard de doctor', async () => {
    const router = await navigate(PATIENT, '/dashboard/doctor')
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('un usuario con sesión no accede a /login', async () => {
    const router = await navigate(PATIENT, '/login')
    expect(router.currentRoute.value.name).toBe('dashboard')
  })

  it('un doctor con sesión es enviado a su dashboard desde /register', async () => {
    const router = await navigate(DOCTOR, '/register')
    expect(router.currentRoute.value.name).toBe('dashboard-doctor')
  })

  it('la guía IA es de acceso público', async () => {
    const router = await navigate(null, '/guia-ia')
    expect(router.currentRoute.value.name).toBe('guia-ia')
  })
})