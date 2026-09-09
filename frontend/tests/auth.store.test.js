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
})