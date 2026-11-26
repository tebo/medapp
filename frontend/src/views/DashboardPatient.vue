<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import AppointmentForm from '../components/AppointmentForm.vue'
import AppointmentCard from '../components/AppointmentCard.vue'
import StatusFilter from '../components/StatusFilter.vue'

const appointments = ref([])
const statusFilter = ref('all')
const loading = ref(true)
const error = ref('')
const message = ref('')

const filteredAppointments = computed(() => {
  if (statusFilter.value === 'all') return appointments.value
  return appointments.value.filter((a) => a.status === statusFilter.value)
})

async function loadAppointments() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/appointments/mine')
    appointments.value = data.appointments
  } catch (err) {
    error.value = err.response?.data?.error || 'No se pudieron cargar tus citas'
  } finally {
    loading.value = false
  }
}

async function handleCancel(appointment) {
  message.value = ''
  error.value = ''
  try {
    await api.patch(`/appointments/${appointment.id}/cancel`)
    await loadAppointments()
    message.value = 'Cita cancelada correctamente'
  } catch (err) {
    error.value = err.response?.data?.error || 'No se pudo cancelar la cita'
  }
}

onMounted(loadAppointments)
</script>

<template>
  <div class="container">
    <h1 class="page-title">Mi panel de paciente</h1>
    <p class="text-muted mb-2">
      Solicita una cita con tu médico y sigue su estado aquí.
    </p>

    <div v-if="message" class="alert-success">{{ message }}</div>
    <div v-if="error" class="alert-error">{{ error }}</div>

    <div class="grid-2">
      <AppointmentForm @created="loadAppointments" />

      <div>
        <h3 class="mb-1">Mis citas</h3>
        <StatusFilter v-model="statusFilter" />
        <p v-if="loading" class="text-muted">Cargando…</p>
        <p v-else-if="appointments.length === 0" class="text-muted">
          Todavía no tienes citas. ¡Solicita la primera!
        </p>
        <p v-else-if="filteredAppointments.length === 0" class="text-muted">
          No hay citas con ese estado.
        </p>
        <template v-else>
          <AppointmentCard
            v-for="appointment in filteredAppointments"
            :key="appointment.id"
            :appointment="appointment"
            show-cancel
            @cancel="handleCancel"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: 1.5rem; margin-top: 1rem; }
.alert-success {
  background: #dcfce7;
  color: var(--success);
  padding: 0.75rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
}
</style>
