import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppointmentCard from '../src/components/AppointmentCard.vue'

// Cita base para los casos de prueba
function makeAppointment(status = 'pending', overrides = {}) {
  return {
    id: 1,
    date: '2026-10-15',
    time: '10:30',
    status,
    reason: 'Dolor de cabeza',
    doctor_name: 'Dra. Ana Torres',
    doctor_specialty: 'Medicina General',
    ...overrides,
  }
}

describe('AppointmentCard', () => {
  it('muestra la etiqueta de estado Pendiente y su clase', () => {
    // La tarjeta traduce valores internos (pending) a texto legible en español
    const wrapper = mount(AppointmentCard, { props: { appointment: makeAppointment('pending') } })

    expect(wrapper.find('.badge').text()).toBe('Pendiente')
    expect(wrapper.find('.badge').classes()).toContain('badge-pending')
  })

  it('traduce cada estado a su etiqueta en español', () => {
    // Misma regla de traducción para el resto de estados posibles
    const cases = [
      ['confirmed', 'Confirmada', 'badge-confirmed'],
      ['rejected', 'Rechazada', 'badge-rejected'],
      ['cancelled', 'Cancelada', 'badge-cancelled'],
    ]

    for (const [status, label, cls] of cases) {
      const wrapper = mount(AppointmentCard, { props: { appointment: makeAppointment(status) } })
      expect(wrapper.find('.badge').text()).toBe(label)
      expect(wrapper.find('.badge').classes()).toContain(cls)
    }
  })

  it('formatea la fecha a formato dd/mm/aaaa', () => {
    // El backend entrega YYYY-MM-DD; la UI lo muestra como 15/10/2026
    const wrapper = mount(AppointmentCard, { props: { appointment: makeAppointment('pending') } })

    expect(wrapper.text()).toContain('15/10/2026')
  })

  it('muestra el nombre del médico y su especialidad', () => {
    // Los datos clave de la cita deben aparecer para orientar al usuario
    const wrapper = mount(AppointmentCard, { props: { appointment: makeAppointment('pending') } })

    expect(wrapper.text()).toContain('Dra. Ana Torres')
    expect(wrapper.text()).toContain('Medicina General')
  })

  it('emite confirm cuando se pulsa Confirmar', () => {
    // La tarjeta solo delega la decisión; el padre escucha el evento
    const wrapper = mount(AppointmentCard, {
      props: { appointment: makeAppointment('pending'), showActions: true },
    })

    wrapper.find('.btn-success').trigger('click')

    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')[0][0]).toMatchObject({ id: 1, status: 'pending' })
  })

  it('emite reject cuando se pulsa Rechazar', () => {
    // Igual que confirm, la tarjeta notifica la intención de rechazo
    const wrapper = mount(AppointmentCard, {
      props: { appointment: makeAppointment('pending'), showActions: true },
    })

    wrapper.find('.btn-danger').trigger('click')

    expect(wrapper.emitted('reject')).toBeTruthy()
  })

  it('no muestra acciones si showActions es falso', () => {
    // En la vista del paciente no hay botones de decisión
    const wrapper = mount(AppointmentCard, { props: { appointment: makeAppointment('pending') } })

    expect(wrapper.find('.actions').exists()).toBe(false)
  })

  it('no muestra acciones cuando la cita ya no está pendiente', () => {
    // Una cita confirmada no debe ofrecer Confirmar/Rechazar
    const wrapper = mount(AppointmentCard, {
      props: { appointment: makeAppointment('confirmed'), showActions: true },
    })

    expect(wrapper.find('.actions').exists()).toBe(false)
  })

  it('oculta el motivo cuando viene vacío', () => {
    // El motivo es opcional; si no hay, no se renderiza nada
    const wrapper = mount(AppointmentCard, {
      props: { appointment: makeAppointment('pending', { reason: '' }) },
    })

    expect(wrapper.find('.reason').exists()).toBe(false)
  })
})