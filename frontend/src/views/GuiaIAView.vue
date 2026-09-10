<script setup>
import { ref, computed } from 'vue'

const chapters = [
  {
    id: 'intro',
    title: '1. Introducción',
    doc: 'docs/guia-ia/01-introduccion.md',
    content: [
      { h: '¿Qué es una IA generativa?', t: 'Un asistente que entiende tu descripción en lenguaje natural y genera texto, código o análisis a partir de ella. No es una base de datos exacta: es un modelo probabilístico, por eso conviene verificar siempre sus respuestas.' },
      { h: '¿Para qué sirve en desarrollo?', t: 'Generar y refactorizar código, explicar conceptos, escribir tests, documentar, depurar errores, revisar código y diseñar arquitecturas.' },
      { h: '¿Qué NO debe hacer?', t: 'Sustituir el juicio humano, la verificación de seguridad o las decisiones médicas/de negocio. El resultado siempre es tu responsabilidad.' },
      { h: 'Prueba rápida', t: 'Abre tu asistente de IA y escribe: «Explícame qué es un middleware de autenticación con JWT en Express, con un ejemplo corto». Nota que entiende el contexto aunque la pregunta no sea perfecta: la calidad de la respuesta depende de la calidad del prompt.' },
    ],
  },
  {
    id: 'prompts',
    title: '2. Prompts efectivos',
    doc: 'docs/guia-ia/02-prompts-efectivos.md',
    content: [
      { h: 'La receta del prompt perfecto', t: 'Cuatro elementos: (1) Rol, (2) Contexto, (3) Tarea y (4) Formato de salida.' },
      { h: 'Ejemplo en acción', t: '«Actúa como un desarrollador senior de Node.js. Estamos construyendo una API de citas médicas con Express y SQLite. Crea un middleware que verifique un token JWT de tipo Bearer. Devuélvelo como módulo CommonJS con 3-5 líneas de comentario como máximo.»' },
      { h: 'Sé específico', t: 'Cuanto más contexto (framework, versión, modo de módulos, lenguaje), más precisa será la respuesta. Nombra archivos, campos y convenciones reales de tu proyecto.' },
      { h: 'Itera, no esperes perfecto', t: 'Pide ajustes: «más corto», «usa async/await», «añade el caso del token expirado», «traduce los comentarios al español». La conversación construye la solución.' },
    ],
  },
  {
    id: 'practicas',
    title: '3. Mejores prácticas',
    doc: 'docs/guia-ia/03-mejores-practicas.md',
    content: [
      { h: 'Divide en pasos pequeños', t: 'Pide fragmentos atómicos: primero el modelo, luego el controlador, después una ruta. Es más fácil de revisar y de corregir.' },
      { h: 'Comunica las restricciones', t: 'Dile a la IA lo que NO puede usar: «no uses ORM», «no instales dependencias nuevas», «usa CommonJS», «sin comentarios innecesarios».' },
      { h: 'Verifica cada respuesta', t: 'Lee el código, ejecútalo y corrígelo. En este proyecto lo hacemos con tests (Vitest) y ejecutándolo en local.' },
      { h: 'Guarda las soluciones repetidas', t: 'Cuando una respuesta te funcionó bien, guarda ese prompt en docs/guia-ia/04-ejemplos-practicos.md para reutilizarlo.' },
    ],
  },
  {
    id: 'ejemplos',
    title: '4. Ejemplos aplicados',
    doc: 'docs/guia-ia/04-ejemplos-practicos.md',
    content: [
      { h: 'Prompt → Modelo SQLite', t: '«Dado este proyecto de citas (link al repositorio), genera el SQL de la tabla appointments con paciente_id y doctor_id como claves foráneas, status con CHECK pending/confirmed/rejected/cancelled, y timestamps con datetime("now").»' },
      { h: 'Prompt → Endpoint JWT', t: '«Añade un endpoint PATCH /api/appointments/:id/confirm que solo permita a un médico (rol doctor) confirmar una cita pendiente asignada a él. Usa middleware authenticate y authorize.»' },
      { h: 'Prompt → Componente Vue', t: '«Crea un componente Vue 3 con composition API <script setup> que muestre las citas del usuario: tarjeta con fecha, hora, médico y un badge de estado. Estilos scoped simples con clases banner.»' },
      { h: 'Prompt → Tests', t: '«Escribe tests con Vitest + Supertest para el flujo: paciente crea cita, médico confirma, paciente ve estado confirmed. La DB debe ser :memory:.»' },
      { h: 'Prompt → Validaciones', t: '«Mueve la validación de fecha/hora a backend/src/utils/validation.js (isValidDate, isValidTime, isFutureDate) y añade la regla de negocio: una cita no puede tener fecha anterior a hoy (400). Escribe tests unitarios para cada caso: formato, calendario, fecha pasada y hora fuera de rango.»' },
    ],
  },
  {
    id: 'errores',
    title: '5. Errores comunes',
    doc: 'docs/guia-ia/05-errores-comunes.md',
    content: [
      { h: '"Di tu código y ya"', t: 'Lanzar una orden genérica sin contexto produce código genérico. Aporta siempre contexto de tu proyecto.' },
      { h: 'Tomar el código a ciegas', t: 'Copiar y pegar sin revisión introduce bugs y vulnerabilidades. Trátalo como un borrador que DEBES revisar.' },
      { h: 'No definir el formato', t: 'Sin especificar CommonJS vs ESM, versión de Node, o framework, la IA adivinará y muchas veces no acertará.' },
      { h: 'Vagos "arregla esto"', t: 'Si no indicas el error exacto, el mensaje y lo que esperas obtener, la solución será adivinada. Adjunta la traza del error.' },
    ],
  },
  {
    id: 'workflow',
    title: '6. Workflow de desarrollo',
    doc: 'docs/guia-ia/06-workflow-desarrollo.md',
    content: [
      { h: 'Ciclo sugerido', t: '1) Planifica (pedir consejo de arquitectura). 2) Esqueleto (generar estructura base). 3) Iterar (feature por feature). 4) Verificar (test + revisión humana). 5) Documentar (IA redacta con tu revisión).' },
      { h: 'Cómo se aplicó aquí', t: 'Este proyecto se construyó en este orden: estructura → backend (auth → citas) → frontend → documentación de la guía. Cada paso pudo pedirse a una IA con prompts como los del capítulo 4.' },
      { h: 'Clave: criterio humano', t: 'La IA acelera, pero tú decides el diseño, la seguridad y si el resultado se ajusta al objetivo del negocio.' },
    ],
  },
  {
    id: 'glosario',
    title: '7. Glosario',
    doc: 'docs/guia-ia/07-glosario.md',
    content: [
      { h: 'Prompt', t: 'La instrucción o pregunta que le escribes a la IA.' },
      { h: 'Contexto', t: 'Información previa relevante que ayudas a dar (proyecto, archivos, restricciones).' },
      { h: 'Rol (role-playing)', t: 'Pedirle a la IA que actúe como un personaje o experto para mejorar la calidad de la respuesta.' },
      { h: 'Iteración', t: 'Mantener la conversación pidiendo ajustes sobre lo ya generado, en lugar de empezar de cero.' },
      { h: 'Alucinación', t: 'Respuesta plausible pero falsa. Por eso siempre hay que verificar.' },
    ],
  },
]

const active = ref(chapters[0].id)

const activeChapter = computed(() => chapters.find((c) => c.id === active.value))
</script>

<template>
  <div class="container">
    <header class="card header">
      <h1>Guía de uso de Asistencia de IA</h1>
      <p class="text-muted">
        Aprende a sacar partido a la IA en el desarrollo. Esta misma aplicación se puede
        construir paso a paso pidiendo ayuda a un asistente. La versión completa está en
        <code>docs/guia-ia/</code>.
      </p>
    </header>

    <nav class="tabs">
      <button
        v-for="chapter in chapters"
        :key="chapter.id"
        class="tab"
        :class="{ active: chapter.id === active }"
        @click="active = chapter.id"
      >
        {{ chapter.title }}
      </button>
    </nav>

    <section class="card chapter">
      <p class="text-muted doc-link">
        📄 Documento completo: <code>{{ activeChapter.doc }}</code>
      </p>
      <article v-for="(item, idx) in activeChapter.content" :key="idx" class="item">
        <h3>{{ item.h }}</h3>
        <p>{{ item.t }}</p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.header { margin-top: 1rem; }
.header h1 { font-size: 1.6rem; }
code { background: var(--gray-100); padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.9em; }

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.tab {
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--gray-300);
  border-radius: 999px;
  background: var(--white);
  color: var(--gray-700);
  cursor: pointer;
  font-size: 0.88rem;
}

.tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--white);
}

.doc-link { font-size: 0.9rem; margin-bottom: 0.75rem; }

.item { margin-bottom: 1rem; }
.item h3 { font-size: 1.05rem; margin-bottom: 0.25rem; color: var(--primary-dark); }
</style>