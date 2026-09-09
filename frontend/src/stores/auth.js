import { defineStore } from 'pinia'
import api from '../services/api'

const STORAGE_KEY = 'medapp_user'

function loadSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: loadSavedUser(),
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    isDoctor: (state) => state.user?.role === 'doctor',
    isPatient: (state) => state.user?.role === 'patient',
  },

  actions: {
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password })
      this.setSession(data)
    },

    async register(payload) {
      const { data } = await api.post('/auth/register', payload)
      this.setSession(data)
    },

    async fetchMe() {
      const { data } = await api.get('/auth/me')
      this.user = data.user
      this.persist()
    },

    setSession({ token, user }) {
      localStorage.setItem('token', token)
      this.user = user
      this.persist()
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem(STORAGE_KEY)
      this.user = null
    },

    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user))
    },
  },
})