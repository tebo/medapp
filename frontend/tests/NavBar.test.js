import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../src/stores/auth'
import NavBar from '../src/components/NavBar.vue'

// Aísla el componente del router real: las navegaciones son irrelevantes aquí
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const PATIENT = { id: 1, name: 'Ana', email: 'ana@test.com', role: 'patient' }
const DOCTOR = { id: 2, name: 'Dr. Luis', email: 'luis@test.com', role: 'doctor' }

// Monta la barra con un store de Pinia real (evita mockear el módulo)
function mountNavBar(user = null) {
  localStorage.clear()
  if (user) localStorage.setItem('medapp_user', JSON.stringify(user))
  setActivePinia(createPinia())

  const wrapper = mount(NavBar, {
    global: {
      stubs: { RouterLink: RouterLinkStub },
    },
  })

  return { wrapper, store: useAuthStore() }
}

describe('NavBar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra Entrar y Registrarse para un invitado', () => {
    // Sin sesión, la barra ofrece acceso al registro/login
    const { wrapper } = mountNavBar()

    expect(wrapper.text()).toContain('Entrar')
    expect(wrapper.text()).toContain('Registrarse')
    expect(wrapper.text()).not.toContain('Mi panel')
  })

  it('muestra el nombre y Mi panel para un paciente', () => {
    // Con sesión de paciente se muestra el saludo y el acceso al panel
    const { wrapper } = mountNavBar(PATIENT)

    expect(wrapper.text()).toContain('Hola, Ana')
    expect(wrapper.text()).toContain('Mi panel')
    expect(wrapper.text()).not.toContain('Entrar')
  })

  it('enlaza Mi panel al dashboard de doctor cuando el rol es doctor', () => {
    // El destino del enlace depende del rol del usuario conectado
    const { wrapper } = mountNavBar(DOCTOR)

    const link = wrapper.findComponent(RouterLinkStub)
    const allLinks = wrapper.findAllComponents(RouterLinkStub)
    const panel = allLinks.find((l) => l.text() === 'Mi panel')
    expect(panel.props('to')).toMatchObject({ name: 'dashboard-doctor' })
  })

  it('cierra la sesión al pulsar Salir', () => {
    // El botón Salir borra la sesión del store (y por tanto de localStorage)
    const { wrapper, store } = mountNavBar(PATIENT)

    wrapper.find('button').trigger('click')

    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('medapp_user')).toBeNull()
  })
})