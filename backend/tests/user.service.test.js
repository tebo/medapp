const bcrypt = require('bcryptjs')
const userModel = require('../src/models/user.model')
const userService = require('../src/services/user.service')

describe('user.service', () => {
  beforeEach(() => {
    // Sustituye los métodos reales por dobles para aislar la lógica del servicio.
    // Las implementaciones por defecto evitan que un accidente llegue a SQLite.
    vi.spyOn(bcrypt, 'hashSync').mockReturnValue('hash-bcrypt')
    vi.spyOn(userModel, 'createUser').mockReturnValue({ id: 99 })
    vi.spyOn(userModel, 'findByEmail').mockReturnValue(null)
    vi.spyOn(userModel, 'listDoctors').mockReturnValue([])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('createUser hashea la contraseña y guarda el hash no el texto plano', () => {
    // El servicio debe transformar password -> passwordHash antes de persistir
    bcrypt.hashSync.mockReturnValue('hash-bcrypt')

    userService.createUser({ name: 'Ana', email: 'ana@test.com', password: 'secreto123', role: 'patient' })

    expect(bcrypt.hashSync).toHaveBeenCalledWith('secreto123', 10)
    expect(userModel.createUser).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@test.com',
      passwordHash: 'hash-bcrypt',
      role: 'patient',
      specialty: null,
    })
  })

  it('createUser normaliza la especialidad ausente a null', () => {
    // Los pacientes no tienen especialidad y debe persistirse como null
    bcrypt.hashSync.mockReturnValue('hash-bcrypt')

    userService.createUser({ name: 'Ana', email: 'ana@test.com', password: 'x', role: 'patient' })

    const arg = userModel.createUser.mock.calls[0][0]
    expect(arg.specialty).toBeNull()
  })

  it('findByEmail delega en el modelo', () => {
    // El servicio es un pasamanos: pide al modelo por email
    userModel.findByEmail.mockReturnValue('usuario')

    const result = userService.findByEmail('ana@test.com')

    expect(userModel.findByEmail).toHaveBeenCalledWith('ana@test.com')
    expect(result).toBe('usuario')
  })

  it('listDoctors devuelve lo que devuelve el modelo', () => {
    // El catálogo de médicos procede directamente del modelo
    userModel.listDoctors.mockReturnValue(['doc1', 'doc2'])

    const result = userService.listDoctors()

    expect(userModel.listDoctors).toHaveBeenCalled()
    expect(result).toEqual(['doc1', 'doc2'])
  })
})