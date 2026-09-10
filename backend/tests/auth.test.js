const request = require('supertest')
const app = require('../src/app')

describe('API de autenticación', () => {
  it('registra un paciente correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Paciente Test', email: 'paciente1@test.com', password: 'secreto123', role: 'patient' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user).toMatchObject({ email: 'paciente1@test.com', role: 'patient' })
    expect(res.body.user).not.toHaveProperty('password_hash')
  })

  it('registra un médico con especialidad', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Dr. Test',
        email: 'doctor1@test.com',
        password: 'secreto123',
        role: 'doctor',
        specialty: 'Dermatología',
      })

    expect(res.status).toBe(201)
    expect(res.body.user).toMatchObject({ role: 'doctor', specialty: 'Dermatología' })
  })

  it('rechaza un médico sin especialidad', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Dr. X', email: 'doctorx@test.com', password: 'secreto123', role: 'doctor' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Un doctor debe indicar su especialidad')
  })

  it('rechaza un registro con email duplicado', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Paciente Duplicado', email: 'dup@test.com', password: 'secreto123', role: 'patient' })

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Otro Duplicado', email: 'dup@test.com', password: 'secreto123', role: 'patient' })

    expect(res.status).toBe(409)
  })

  it('inicia sesión y devuelve un token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login Test', email: 'login@test.com', password: 'secreto123', role: 'patient' })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'secreto123' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('rechaza credenciales inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nadie@test.com', password: 'incorrecta' })

    expect(res.status).toBe(401)
  })

  it('accede a /me con token válido', async () => {
    const reg = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Me Test', email: 'me@test.com', password: 'secreto123', role: 'patient' })

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${reg.body.token}`)

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe('me@test.com')
  })

  it('rechaza /me sin token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('rechaza un registro con campos incompletos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Solo Nombre' })

    expect(res.status).toBe(400)
  })

  it('rechaza un rol no permitido', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin', email: 'admin@test.com', password: 'secreto123', role: 'admin' })

    expect(res.status).toBe(400)
  })

  it('rechaza un token manipulado', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token-invalido')

    expect(res.status).toBe(401)
  })

  it('rechaza un token expirado', async () => {
    const jwt = require('jsonwebtoken')
    const expired = jwt.sign({ sub: 1, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '0s' })

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expired}`)

    expect(res.status).toBe(401)
  })
})