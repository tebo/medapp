const request = require('supertest')
const app = require('../src/app')

describe('API de médicos', () => {
  let patient

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Paciente Docs',
      email: 'docs@test.com',
      password: 'secreto123',
      role: 'patient',
    })
    patient = res.body
  })

  it('exige autenticación para listar médicos', async () => {
    const res = await request(app).get('/api/doctors')
    expect(res.status).toBe(401)
  })

  it('incluye los médicos demo sembrados', async () => {
    const res = await request(app)
      .get('/api/doctors')
      .set('Authorization', `Bearer ${patient.token}`)

    expect(res.status).toBe(200)
    const names = res.body.doctors.map((d) => d.name)
    expect(names).toContain('Dra. Ana Torres')
    expect(names).toContain('Dr. Luis Fernández')
    expect(names).toContain('Dra. María López')
    expect(names).toContain('Dr. Carlos Mendoza')
  })
})