<script setup>
import { computed } from 'vue'

const props = defineProps({
  appointment: { type: Object, required: true },
  showActions: { type: Boolean, default: false },
  showCancel: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'reject', 'cancel'])

const statusLabel = computed(() => {
  const map = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    rejected: 'Rechazada',
    cancelled: 'Cancelada',
  }
  return map[props.appointment.status] || props.appointment.status
})

const statusClass = computed(() => `badge-${props.appointment.status}`)

const dateLabel = computed(() => {
  const [y, m, d] = props.appointment.date.split('-')
  return `${d}/${m}/${y}`
})

const canCancel = computed(() =>
  props.showCancel && ['pending', 'confirmed'].includes(props.appointment.status)
)
</script>

<template>
  <div class="appointment" :class="`tone-${appointment.status}`">
    <div class="appointment-head">
      <div>
        <strong class="doctor">{{ appointment.doctor_name || 'Médico' }}</strong>
        <span v-if="appointment.doctor_specialty" class="text-muted specialty">
          {{ appointment.doctor_specialty }}
        </span>
      </div>
      <span class="badge" :class="statusClass">{{ statusLabel }}</span>
    </div>

    <p class="meta">
      <span>{{ dateLabel }}</span>
      <span class="dot" aria-hidden="true"></span>
      <span>{{ appointment.time }}</span>
      <template v-if="appointment.patient_name">
        <span class="dot" aria-hidden="true"></span>
        <span class="text-muted">{{ appointment.patient_name }}</span>
      </template>
    </p>

    <p v-if="appointment.reason" class="text-muted reason">
      {{ appointment.reason }}
    </p>

    <div v-if="showActions && appointment.status === 'pending'" class="actions">
      <button class="btn btn-success" @click="emit('confirm', appointment)">Confirmar</button>
      <button class="btn btn-danger" @click="emit('reject', appointment)">Rechazar</button>
    </div>

    <div v-else-if="canCancel" class="actions">
      <button class="btn btn-outline" @click="emit('cancel', appointment)">Cancelar cita</button>
    </div>
  </div>
</template>

<style scoped>
.appointment {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--primary);
  border-radius: var(--radius);
  padding: 1.1rem 1.2rem;
  margin-bottom: 0.85rem;
  box-shadow: var(--shadow-soft);
}

.tone-pending { border-left-color: var(--warning); }
.tone-confirmed { border-left-color: var(--success); }
.tone-rejected { border-left-color: var(--danger); }
.tone-cancelled { border-left-color: var(--gray-300); }

.appointment-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.doctor {
  font-family: var(--font-display);
  font-size: 1.05rem;
  display: block;
}

.specialty {
  display: block;
  font-size: 0.88rem;
  margin-top: 0.15rem;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.65rem;
  font-size: 0.92rem;
  font-weight: 500;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent-line);
  display: inline-block;
}

.reason {
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 0.45rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
