const appointmentModel = require('../src/models/appointment.model')
const userModel = require('../src/models/user.model')
const { createAppointment } = require('../src/application/appointments/createAppointment')
const { AppError } = require('../src/application/errors')

describe('use case createAppointment (anti-solape en capa application)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('crea la cita cuando el slot está libre', () => {
    vi.spyOn(userModel, 'findById').mockReturnValue({ id: 2, role: 'doctor' })
    vi.spyOn(appointmentModel, 'findDoctorSlotConflict').mockReturnValue(null)
    vi.spyOn(appointmentModel, 'createAppointment').mockReturnValue({
      id: 1,
      status: 'pending',
      date: '2027-06-01',
      time: '10:00',
    })

    const result = createAppointment({
      patientId: 5,
      doctorId: 2,
      date: '2027-06-01',
      time: '10:00',
      reason: 'Control',
    })

    expect(appointmentModel.createAppointment).toHaveBeenCalled()
    expect(result.appointment.status).toBe('pending')
  })

  it('lanza AppError 409 si hay solape (regla fuera del controller)', () => {
    vi.spyOn(userModel, 'findById').mockReturnValue({ id: 2, role: 'doctor' })
    vi.spyOn(appointmentModel, 'findDoctorSlotConflict').mockReturnValue({ id: 9 })

    try {
      createAppointment({
        patientId: 5,
        doctorId: 2,
        date: '2027-06-01',
        time: '10:00',
      })
      expect.unreachable('debía lanzar')
    } catch (err) {
      expect(err).toBeInstanceOf(AppError)
      expect(err.status).toBe(409)
      expect(err.code).toBe('slot_conflict')
    }
  })

  it('lanza AppError 400 si faltan campos', () => {
    try {
      createAppointment({ patientId: 1, doctorId: null, date: null, time: null })
      expect.unreachable('debía lanzar')
    } catch (err) {
      expect(err).toBeInstanceOf(AppError)
      expect(err.status).toBe(400)
    }
  })
})
