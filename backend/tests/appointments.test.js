const request = require('supertest')
const app = require('../src/app')

async function registerUser(data) {
  const res = await request(app).post('/api/auth/register').send(data)
  return res.body
}

describe('API de citas médicas', () => {
  let patient
  let doctor

  beforeAll(async () => {
    patient = await registerUser({ name: 'Ana Paciente', email: 'ana@test.com', password: 'secreto123', role: 'patient' })
    doctor = await registerUser({ name: 'Dr. Bueno', email: 'bueno@test.com', password: 'secreto123', role: 'doctor', specialty: 'Cardiología' })
  })

  it('lista los médicos disponibles', async () => {
    const res = await request(app)
      .get('/api/doctors')
      .set('Authorization', `Bearer ${patient.token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.doctors)).toBe(true)
    const found = res.body.doctors.find((d) => d.name === 'Dr. Bueno')
    expect(found).toBeTruthy()
    expect(found.specialty).toBe('Cardiología')
  })

  it('el paciente crea una cita', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ doctorId: doctor.user.id, date: '2026-10-15', time: '10:30', reason: 'Consulta de rutina' })

    expect(res.status).toBe(201)
    expect(res.body.appointment).toMatchObject({ status: 'pending', date: '2026-10-15' })
  })

  it('el paciente puede ver sus citas', async () => {
    const res = await request(app)
      .get('/api/appointments/mine')
      .set('Authorization', `Bearer ${patient.token}`)

    expect(res.status).toBe(200)
    expect(res.body.appointments.length).toBeGreaterThan(0)
  })

  it('el doctor ve las citas pendientes asignadas a él', async () => {
    const res = await request(app)
      .get('/api/appointments/pending')
      .set('Authorization', `Bearer ${doctor.token}`)

    expect(res.status).toBe(200)
    expect(res.body.appointments.length).toBeGreaterThan(0)
  })

  it('el doctor confirma una cita', async () => {
    const pending = await request(app)
      .get('/api/appointments/pending')
      .set('Authorization', `Bearer ${doctor.token}`)
    const cita = pending.body.appointments[0]

    const res = await request(app)
      .patch(`/api/appointments/${cita.id}/confirm`)
      .set('Authorization', `Bearer ${doctor.token}`)

    expect(res.status).toBe(200)
    expect(res.body.appointment.status).toBe('confirmed')
  })

  it('el paciente ve el estado confirmada', async () => {
    const res = await request(app)
      .get('/api/appointments/mine')
      .set('Authorization', `Bearer ${patient.token}`)

    expect(res.status).toBe(200)
    expect(res.body.appointments[0].status).toBe('confirmed')
  })

  it('un paciente no puede confirmar citas', async () => {
    const mine = await request(app)
      .get('/api/appointments/mine')
      .set('Authorization', `Bearer ${patient.token}`)
    const cita = mine.body.appointments[0]

    const res = await request(app)
      .patch(`/api/appointments/${cita.id}/confirm`)
      .set('Authorization', `Bearer ${patient.token}`)

    expect(res.status).toBe(403)
  })

  it('rechaza crear cita sin fecha válida', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ doctorId: doctor.user.id, date: '15/10/2026', time: '10:30' })

    expect(res.status).toBe(400)
  })

  it('un doctor no puede crear citas como paciente', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${doctor.token}`)
      .send({ doctorId: doctor.user.id, date: '2026-11-01', time: '09:00' })

    expect(res.status).toBe(403)
  })

  it('el doctor rechaza una cita', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ doctorId: doctor.user.id, date: '2026-12-01', time: '11:00', reason: 'Revisión' })

    const res = await request(app)
      .patch(`/api/appointments/${created.body.appointment.id}/reject`)
      .set('Authorization', `Bearer ${doctor.token}`)

    expect(res.status).toBe(200)
    expect(res.body.appointment.status).toBe('rejected')
  })

  it('un paciente no puede rechazar citas', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ doctorId: doctor.user.id, date: '2026-12-01', time: '11:30' })

    const res = await request(app)
      .patch(`/api/appointments/${created.body.appointment.id}/reject`)
      .set('Authorization', `Bearer ${patient.token}`)

    expect(res.status).toBe(403)
  })

  it('rechaza crear cita sin doctorId', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ date: '2026-12-02', time: '09:00' })

    expect(res.status).toBe(400)
  })

  it('permite crear cita sin motivo (campo opcional)', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ doctorId: doctor.user.id, date: '2026-12-02', time: '09:30' })

    expect(res.status).toBe(201)
    expect(res.body.appointment.reason).toBeNull()
  })

  it('rechaza crear cita con un doctor inexistente', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ doctorId: 999999, date: '2026-12-02', time: '10:00' })

    expect(res.status).toBe(400)
  })

  it('rechaza crear cita con fecha pasada', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ doctorId: doctor.user.id, date: '2020-01-01', time: '10:00' })

    expect(res.status).toBe(400)
  })

  it('rechaza crear cita con hora inválida', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ doctorId: doctor.user.id, date: '2026-12-02', time: '25:00' })

    expect(res.status).toBe(400)
  })

  it('devuelve 404 al confirmar una cita inexistente', async () => {
    const res = await request(app)
      .patch('/api/appointments/999999/confirm')
      .set('Authorization', `Bearer ${doctor.token}`)

    expect(res.status).toBe(404)
  })

  it('devuelve 404 al rechazar una cita inexistente', async () => {
    const res = await request(app)
      .patch('/api/appointments/999999/reject')
      .set('Authorization', `Bearer ${doctor.token}`)

    expect(res.status).toBe(404)
  })

  it('la confirmación es idempotente (no revierte el estado)', async () => {
    const mine = await request(app)
      .get('/api/appointments/mine')
      .set('Authorization', `Bearer ${patient.token}`)

    const cita = mine.body.appointments[0]

    const res = await request(app)
      .patch(`/api/appointments/${cita.id}/confirm`)
      .set('Authorization', `Bearer ${doctor.token}`)

    expect(res.status).toBe(200)
    expect(res.body.appointment.status).toBe('confirmed')
  })

  it('un doctor no puede decidir citas de otro doctor', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Dr. Ajeno',
      email: 'ajeno@test.com',
      password: 'secreto123',
      role: 'doctor',
      specialty: 'Neurología',
    })

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ajeno@test.com', password: 'secreto123' })

    const created = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ doctorId: doctor.user.id, date: '2026-12-03', time: '12:00' })

    const res = await request(app)
      .patch(`/api/appointments/${created.body.appointment.id}/confirm`)
      .set('Authorization', `Bearer ${login.body.token}`)

    expect(res.status).toBe(404)
  })

  it('rechaza crear cita sin token', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ doctorId: doctor.user.id, date: '2026-12-03', time: '12:30' })

    expect(res.status).toBe(401)
  })

  it('rechaza ver mis citas sin token', async () => {
    const res = await request(app).get('/api/appointments/mine')
    expect(res.status).toBe(401)
  })

  it('un paciente no puede ver citas pendientes', async () => {
    const res = await request(app)
      .get('/api/appointments/pending')
      .set('Authorization', `Bearer ${patient.token}`)

    expect(res.status).toBe(403)
  })
})