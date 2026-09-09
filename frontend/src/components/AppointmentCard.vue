<script setup>
import { computed } from 'vue'

const props = defineProps({
  appointment: { type: Object, required: true },
  showActions: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'reject'])

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
</script>

<template>
  <div class="card appointment">
    <div class="appointment-head">
      <div>
        <strong>{{ appointment.doctor_name || 'Médico' }}</strong>
        <span v-if="appointment.doctor_specialty" class="text-muted">
          · {{ appointment.doctor_specialty }}
        </span>
      </div>
      <span class="badge" :class="statusClass">{{ statusLabel }}</span>
    </div>

    <p class="mt-1">
      🗓️ {{ dateLabel }} · 🕐 {{ appointment.time }}
      <span v-if="appointment.patient_name" class="text-muted">
        · Paciente: {{ appointment.patient_name }}
      </span>
    </p>

    <p v-if="appointment.reason" class="text-muted reason">
      {{ appointment.reason }}
    </p>

    <div v-if="showActions && appointment.status === 'pending'" class="actions">
      <button class="btn btn-success" @click="emit('confirm', appointment)">Confirmar</button>
      <button class="btn btn-danger" @click="emit('reject', appointment)">Rechazar</button>
    </div>
  </div>
</template>

<style scoped>
.appointment-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.reason {
  font-size: 0.9rem;
  font-style: italic;
}

.actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
</style>