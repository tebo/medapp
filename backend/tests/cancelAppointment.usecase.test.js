const appointmentModel = require('../src/models/appointment.model')
const { cancelAppointment } = require('../src/application/appointments/cancelAppointment')
const { AppError } = require('../src/application/errors')

describe('use case cancelAppointment', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('cancela una cita pending del paciente', () => {
    vi.spyOn(appointmentModel, 'cancelByPatient').mockReturnValue({
      appointment: { id: 1, status: 'cancelled', patient_id: 10 },
    })

    const result = cancelAppointment({ appointmentId: 1, patientId: 10 })

    expect(appointmentModel.cancelByPatient).toHaveBeenCalledWith(1, 10)
    expect(result.appointment.status).toBe('cancelled')
    expect(result.message).toBe('Cita cancelada')
  })

  it('lanza AppError 404 si la cita no existe o no es del paciente', () => {
    vi.spyOn(appointmentModel, 'cancelByPatient').mockReturnValue({ error: 'not_found' })

    try {
      cancelAppointment({ appointmentId: 99, patientId: 10 })
      expect.unreachable('debía lanzar')
    } catch (err) {
      expect(err).toBeInstanceOf(AppError)
      expect(err.status).toBe(404)
      expect(err.code).toBe('not_found')
    }
  })

  it('lanza AppError 400 si el estado no es cancelable', () => {
    const rejected = { id: 2, status: 'rejected', patient_id: 10 }
    vi.spyOn(appointmentModel, 'cancelByPatient').mockReturnValue({
      error: 'invalid_status',
      appointment: rejected,
    })

    try {
      cancelAppointment({ appointmentId: 2, patientId: 10 })
      expect.unreachable('debía lanzar')
    } catch (err) {
      expect(err).toBeInstanceOf(AppError)
      expect(err.status).toBe(400)
      expect(err.code).toBe('invalid_status')
      expect(err.details.appointment).toEqual(rejected)
    }
  })
})
