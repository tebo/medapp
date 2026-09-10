# 1. Introducción a la Asistencia de IA

> Parte de la **Guía de uso de Asistencia de IA** del proyecto MedApp.
> Índice: [Índice](../README.md) · 1 · [2. Prompts efectivos](./02-prompts-efectivos.md)

## ¿Qué es una IA generativa?

Una IA generativa (como la que usas en un chat) es un modelo entrenado con una
enorme cantidad de texto que **predice la siguiente palabra** en función de lo que
le escribes. De esa capacidad surge algo asombroso: puede escribir código, explicar
conceptos, redactar documentación y analizar problemas.

**Importante:** no es una base de datos que busca respuestas exactas. Es una máquina
de probabilidad. Piensa en ella como un *colega muy leído que a veces se equivoca*.

## ¿Para qué sirve en desarrollo de software?

| Uso | Ejemplo |
|-----|---------|
| Generar código | «Crea un endpoint POST en Express que guarde una cita en SQLite» |
| Explicar conceptos | «Explícame qué es un middleware en Express» |
| Refactorizar | «Mueve esta lógica a un servicio y usa async/await» |
| Escribir tests | «Genera tests con Vitest para la función de ordenar citas» |
| Depurar errores | «Este trace de error dice X, ¿qué causa probablemente?» |
| Documentar | «Redacta un README para este módulo» |
| Diseñar arquitectura | «Propón la estructura de carpetas para una app de citas» |

## ¿Qué NO debe hacer?

- **No sustituir tu criterio profesional** (ni el de un médico en un contexto real).
- **No verificar la seguridad** por ti: con secretos, datos de pacientes o
  desplegues, la responsabilidad final es tuya.
- **No ser la fuente de verdad**: sus respuestas hay que leerlas, ejecutarlas y
  comprobarlas (tests, linter, revisión).
- **No decidir por el negocio**: tú planteas los requisitos; la IA solo ayuda a
  cumplirlos.

## La ley clave: verificación

Repite contigo mismo: **todo lo que genera una IA es un borrador que hay que revisar**.

En este proyecto aplicamos esa ley:

1. Cada módulo se escribió con prompts (capítulo 4) y después se revisó a mano.
2. El backend tiene **67 tests** con **Vitest + Supertest** (auth, citas, médicos y
   unitarias) y el frontend **35 tests** (store, router, componentes y API).
3. Docker y CI/CD verifican tests y build en cada cambio.

## Ejercicio rápido

Abre tu asistente de IA y escribe:

> «Explícame con un ejemplo corto qué es un middleware de autenticación con JWT
> en Express, en español.»

Observa la respuesta, pregúntate: ¿qué le faltó para ser perfecta? Casi seguro
estas dos cosas: **contexto** (¿versión de Express? ¿CommonJS?) y **formato**
(¿un párrafo? ¿código?). Eso es exactamente lo que aprenderás en el capítulo 2.