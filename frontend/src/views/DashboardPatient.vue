<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import AppointmentForm from '../components/AppointmentForm.vue'
import AppointmentCard from '../components/AppointmentCard.vue'

const appointments = ref([])
const loading = ref(true)
const error = ref('')

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

onMounted(loadAppointments)
</script>

<template>
  <div class="container">
    <h1 class="page-title">Mi panel de paciente</h1>
    <p class="text-muted mb-2">
      Solicita una cita con tu médico y sigue su estado aquí.
    </p>

    <div v-if="error" class="alert-error">{{ error }}</div>

    <div class="grid-2">
      <AppointmentForm @created="loadAppointments" />

      <div>
        <h3 class="mb-1">Mis citas</h3>
        <p v-if="loading" class="text-muted">Cargando…</p>
        <p v-else-if="appointments.length === 0" class="text-muted">
          Todavía no tienes citas. ¡Solicita la primera!
        </p>
        <template v-else>
          <AppointmentCard
            v-for="appointment in appointments"
            :key="appointment.id"
            :appointment="appointment"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: 1.5rem; margin-top: 1rem; }
</style>