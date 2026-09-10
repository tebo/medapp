const { isValidDate, isFutureDate, isValidTime } = require('../src/utils/validation')

describe('isValidDate', () => {
  it('acepta una fecha en formato ISO YYYY-MM-DD', () => {
    // Fecha correcta que existe en el calendario
    expect(isValidDate('2026-10-15')).toBe(true)
  })

  it('acepta una fecha válida con día de un dígito (rellenado con cero)', () => {
    // El formato exige 2 dígitos en día y mes
    expect(isValidDate('2026-05-03')).toBe(true)
  })

  it('rechaza un formato con barras', () => {
    // La API solo admite el separador "-"
    expect(isValidDate('15/10/2026')).toBe(false)
  })

  it('rechaza una fecha inexistente del calendario', () => {
    // Abril solo tiene 30 días; el 31 no es real
    expect(isValidDate('2026-04-31')).toBe(false)
  })

  it('rechaza una fecha que no es texto', () => {
    // Entradas no string no deben validarse
    expect(isValidDate(null)).toBe(false)
    expect(isValidDate(undefined)).toBe(false)
  })

  it('rechaza cadenas sin el formato exacto', () => {
    // Falta el día en esta cadena truncada
    expect(isValidDate('2026-10')).toBe(false)
  })
})

describe('isFutureDate', () => {
  it('acepta una fecha de hoy mismo', () => {
    // Un paciente puede pedir cita para el mismo día
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    expect(isFutureDate(today)).toBe(true)
  })

  it('acepta una fecha futura', () => {
    // Fechas posteriores a hoy son válidas para crear cita
    expect(isFutureDate('2099-12-31')).toBe(true)
  })

  it('rechaza una fecha pasada', () => {
    // Las citas no pueden crearse en el pasado
    expect(isFutureDate('2020-01-01')).toBe(false)
  })

  it('rechaza un día pasado del mes actual', () => {
    // Evita masajear la fecha: un día antes de hoy tampoco vale
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const yesterdayISO = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
    expect(isFutureDate(yesterdayISO)).toBe(false)
  })
})

describe('isValidTime', () => {
  it('acepta una hora válida de la mañana', () => {
    // Formato 24h con dos dígitos para la hora
    expect(isValidTime('09:30')).toBe(true)
  })

  it('acepta la última hora válida del día', () => {
    // 23:59 es el límite superior permitido
    expect(isValidTime('23:59')).toBe(true)
  })

  it('acepta la hora cero con minutos', () => {
    // Medianoche (00:00) es un valor permitido
    expect(isValidTime('00:00')).toBe(true)
  })

  it('rechaza una hora fuera de rango', () => {
    // No existe la hora 25
    expect(isValidTime('25:00')).toBe(false)
  })

  it('rechaza minutos fuera de rango', () => {
    // Solo hay 60 minutos en una hora (00-59)
    expect(isValidTime('10:60')).toBe(false)
  })

  it('rechaza un formato sin dos dígitos', () => {
    // La hora debe ir con dos dígitos y dos puntos
    expect(isValidTime('9:30')).toBe(false)
  })

  it('rechaza horas que no sean texto', () => {
    // Entradas null/undefined no deben validarse
    expect(isValidTime(null)).toBe(false)
  })
})