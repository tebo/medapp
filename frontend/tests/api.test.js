import { describe, it, expect, beforeEach } from 'vitest'
import api from '../src/services/api'

describe('cliente API (interceptores de axios)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('añade Authorization Bearer cuando hay token', () => {
    // El interceptor de petición enriquece cada salida con el token guardado
    localStorage.setItem('token', 'jwt-demo')

    const handler = api.interceptors.request.handlers[0].fulfilled
    const config = handler({ headers: {} })

    expect(config.headers.Authorization).toBe('Bearer jwt-demo')
  })

  it('no añade Authorization si no hay token', () => {
    // Sin sesión, la petición sale limpia (rutas públicas)
    const handler = api.interceptors.request.handlers[0].fulfilled
    const config = handler({ headers: {} })

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('no añade Authorization si el token está vacío', () => {
    // Un token con cadena vacía no debe incluirse como Bearer
    localStorage.setItem('token', '')

    const handler = api.interceptors.request.handlers[0].fulfilled
    const config = handler({ headers: {} })

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('elimina el token ante una respuesta 401', async () => {
    // Sesión caducada: la app limpia la credencial para evitar bucles
    localStorage.setItem('token', 'jwt-demo')
    const onRejected = api.interceptors.response.handlers[0].rejected

    const error = { response: { status: 401 } }
    // La promesa debe rechazarse para que el llamador gestione el error
    await expect(onRejected(error)).rejects.toMatchObject({ response: { status: 401 } })

    expect(localStorage.getItem('token')).toBeNull()
  })

  it('conserva el token si el error no es 401', async () => {
    // Otros errores (p. ej. 400 de validación) no deben cerrar la sesión
    localStorage.setItem('token', 'jwt-demo')
    const onRejected = api.interceptors.response.handlers[0].rejected

    const error = { response: { status: 400 } }
    await expect(onRejected(error)).rejects.toMatchObject({ response: { status: 400 } })

    expect(localStorage.getItem('token')).toBe('jwt-demo')
  })
})