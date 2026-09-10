const jwt = require('jsonwebtoken')
const { authenticate, authorize } = require('../src/middleware/auth')

// Simulacros de la respuesta HTTP de Express
function mockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }
}

// Añade una sesión con el rol indicado (como haría authenticate)
function authedReq(role) {
  return { user: { id: 1, role } }
}

describe('authenticate (middleware)', () => {
  let res
  let next

  beforeEach(() => {
    res = mockRes()
    next = vi.fn()
  })

  it('pasa el control si el token es válido', () => {
    // Un token firmado con el secreto real debe resolverse en req.user
    const valid = jwt.sign({ sub: 7, email: 'a@test.com', role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const req = { headers: { authorization: `Bearer ${valid}` } }

    authenticate(req, res, next)

    expect(req.user).toEqual({ id: 7, role: 'patient' })
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('devuelve 401 si falta el header Authorization', () => {
    // Sin cabecera no hay forma de autenticar
    const req = { headers: {} }

    authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Token no proporcionado' })
    expect(next).not.toHaveBeenCalled()
  })

  it('devuelve 401 si el header no es Bearer', () => {
    // Otro esquema de autorización no está soportado
    const req = { headers: { authorization: 'Basic abc123' } }

    authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('devuelve 401 si el token está manipulado', () => {
    // Un token falso no supera la verificación de firma
    const req = { headers: { authorization: 'Bearer token-invalido' } }

    authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado' })
    expect(next).not.toHaveBeenCalled()
  })

  it('devuelve 401 si el token está expirado', () => {
    // expiresIn 0s genera un token caducado al instante
    const expired = jwt.sign({ sub: 1, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '0s' })
    const req = { headers: { authorization: `Bearer ${expired}` } }

    authenticate(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })
})

describe('authorize (middleware)', () => {
  let req
  let res
  let next

  beforeEach(() => {
    res = mockRes()
    next = vi.fn()
  })

  it('pasa el control si el rol está permitido', () => {
    // Un doctor autenticado puede acceder a rutas de doctor
    req = authedReq('doctor')

    const middleware = authorize('doctor')
    middleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('rechaza con 403 si el rol no está en la lista', () => {
    // Un paciente no puede ejecutar acciones reservadas al doctor
    req = authedReq('patient')

    const middleware = authorize('doctor')
    middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'No tienes permisos para esta acción' })
    expect(next).not.toHaveBeenCalled()
  })

  it('rechaza con 403 si no hay usuario autenticado', () => {
    // Sin req.user no hay sobre quién autorizar
    req = {}

    const middleware = authorize('patient')
    middleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it('acepta cualquiera de los roles indicados', () => {
    // authorize() admite múltiples roles en la lista
    req = authedReq('doctor')

    const middleware = authorize('patient', 'doctor')
    middleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})