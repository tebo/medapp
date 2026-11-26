import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusFilter from '../src/components/StatusFilter.vue'

describe('StatusFilter', () => {
  it('marca la opción activa según modelValue', () => {
    const wrapper = mount(StatusFilter, { props: { modelValue: 'pending' } })
    const active = wrapper.find('.filter-chip.active')

    expect(active.exists()).toBe(true)
    expect(active.text()).toBe('Pendientes')
  })

  it('emite update:modelValue al elegir otro estado', async () => {
    const wrapper = mount(StatusFilter, { props: { modelValue: 'all' } })
    const chips = wrapper.findAll('.filter-chip')
    const confirmed = chips.find((c) => c.text() === 'Confirmadas')

    await confirmed.trigger('click')

    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('confirmed')
  })

  it('respeta opciones personalizadas', () => {
    const wrapper = mount(StatusFilter, {
      props: {
        modelValue: 'all',
        options: [
          { value: 'all', label: 'Todas' },
          { value: 'cancelled', label: 'Canceladas' },
        ],
      },
    })

    expect(wrapper.findAll('.filter-chip')).toHaveLength(2)
    expect(wrapper.text()).toContain('Canceladas')
    expect(wrapper.text()).not.toContain('Pendientes')
  })
})
