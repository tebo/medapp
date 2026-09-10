import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../src/stores/auth'

vi.mock('../src/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

import api from '../src/services/api'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('inicia sesión y guarda token y usuario', async () => {
    api.post.mockResolvedValue({
      data: {
        token: 'jwt-demo',
        user: { id: 1, name: 'Ana', email: 'ana@test.com', role: 'patient' },
      },
    })

    const store = useAuthStore()
    await store.login('ana@test.com', 'secreto123')

    expect(store.isAuthenticated).toBe(true)
    expect(store.isDoctor).toBe(false)
    expect(localStorage.getItem('token')).toBe('jwt-demo')
    expect(store.user.name).toBe('Ana')
  })

  it('identifica correctamente al médico', async () => {
    api.post.mockResolvedValue({
      data: {
        token: 'jwt-demo',
        user: { id: 2, name: 'Dr. Luis', email: 'l@test.com', role: 'doctor' },
      },
    })

    const store = useAuthStore()
    await store.register({ email: 'l@test.com', role: 'doctor' })

    expect(store.isDoctor).toBe(true)
    expect(store.isPatient).toBe(false)
  })

  it('cierra sesión y limpia el estado', () => {
    localStorage.setItem('token', 'jwt-demo')
    localStorage.setItem('medapp_user', JSON.stringify({ id: 1, name: 'Ana', role: 'patient' }))

    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(true)

    store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('medapp_user')).toBeNull()
  })

  it('fetchMe actualiza el usuario y lo persiste', async () => {
    // Recargar el perfil refresca los datos guardados en localStorage
    localStorage.setItem('token', 'jwt-demo')
    api.get.mockResolvedValue({
      data: { user: { id: 1, name: 'Ana', email: 'ana@test.com', role: 'doctor' } },
    })

    const store = useAuthStore()
    await store.fetchMe()

    expect(api.get).toHaveBeenCalledWith('/auth/me')
    expect(store.user.role).toBe('doctor')
    expect(store.isDoctor).toBe(true)
    expect(JSON.parse(localStorage.getItem('medapp_user')).role).toBe('doctor')
  })

  it('setSession persiste el token y el usuario recibidos', () => {
    // Tras login/registro, la sesión queda respaldada en localStorage
    const store = useAuthStore()

    store.setSession({ token: 'jwt-nuevo', user: { id: 5, name: 'Luis', role: 'patient' } })

    expect(localStorage.getItem('token')).toBe('jwt-nuevo')
    expect(store.user.name).toBe('Luis')
    expect(JSON.parse(localStorage.getItem('medapp_user')).id).toBe(5)
  })

  it('restaura la sesión guardada al crear el store', () => {
    // Al recargar la página, la sesión previa se recupera de localStorage
    localStorage.setItem('token', 'jwt-viejo')
    localStorage.setItem('medapp_user', JSON.stringify({ id: 5, name: 'Luis', role: 'patient' }))

    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(true)
    expect(store.user.id).toBe(5)
  })
})