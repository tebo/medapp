<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import AppointmentCard from '../components/AppointmentCard.vue'
import StatusFilter from '../components/StatusFilter.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const pending = ref([])
const answered = ref([])
const historyFilter = ref('all')
const loading = ref(true)
const error = ref('')
const message = ref('')

const historyOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'rejected', label: 'Rechazadas' },
  { value: 'cancelled', label: 'Canceladas' },
]

const summary = computed(() => ({
  pending: pending.value.length,
  confirmed: answered.value.filter((a) => a.status === 'confirmed').length,
  rejected: answered.value.filter((a) => a.status === 'rejected').length,
  cancelled: answered.value.filter((a) => a.status === 'cancelled').length,
}))

const filteredHistory = computed(() => {
  if (historyFilter.value === 'all') return answered.value
  return answered.value.filter((a) => a.status === historyFilter.value)
})

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const [pendingRes, mineRes] = await Promise.all([
      api.get('/appointments/pending'),
      api.get('/appointments/mine'),
    ])
    pending.value = pendingRes.data.appointments
    answered.value = mineRes.data.appointments.filter((a) => a.status !== 'pending')
  } catch (err) {
    error.value = err.response?.data?.error || 'No se pudieron cargar las citas'
  } finally {
    loading.value = false
  }
}

async function handleStatus(appointment, status) {
  message.value = ''
  try {
    await api.patch(`/appointments/${appointment.id}/${status}`)
    await loadData()
    message.value = `Cita ${status} correctamente`
  } catch (err) {
    error.value = err.response?.data?.error || 'No se pudo actualizar la cita'
  }
}

onMounted(loadData)
</script>

<template>
  <div class="container">
    <h1 class="page-title">Panel del médico</h1>
    <p class="text-muted mb-1">Bienvenido, {{ auth.user.name }}.</p>

    <div v-if="message" class="alert-success">{{ message }}</div>
    <div v-if="error" class="alert-error">{{ error }}</div>

    <div class="grid-4 mb-2">
      <div class="card stat-card">
        <strong>{{ summary.pending }}</strong>
        <span>Pendientes</span>
      </div>
      <div class="card stat-card">
        <strong>{{ summary.confirmed }}</strong>
        <span>Confirmadas</span>
      </div>
      <div class="card stat-card">
        <strong>{{ summary.rejected }}</strong>
        <span>Rechazadas</span>
      </div>
      <div class="card stat-card">
        <strong>{{ summary.cancelled }}</strong>
        <span>Canceladas</span>
      </div>
    </div>

    <h3 class="mb-1">Solicitudes pendientes</h3>
    <p v-if="loading" class="text-muted">Cargando…</p>
    <p v-else-if="pending.length === 0" class="text-muted">No hay solicitudes pendientes.</p>
    <AppointmentCard
      v-for="appointment in pending"
      :key="appointment.id"
      :appointment="appointment"
      show-actions
      @confirm="handleStatus($event, 'confirm')"
      @reject="handleStatus($event, 'reject')"
    />

    <h3 class="mb-1 mt-2">Historial de decisiones</h3>
    <StatusFilter v-model="historyFilter" :options="historyOptions" />
    <p v-if="answered.length === 0" class="text-muted">Aún no has respondido ninguna solicitud.</p>
    <p v-else-if="filteredHistory.length === 0" class="text-muted">
      No hay citas con ese estado en el historial.
    </p>
    <AppointmentCard
      v-for="appointment in filteredHistory"
      :key="appointment.id"
      :appointment="appointment"
    />
  </div>
</template>

<style scoped>
.page-title { font-size: 1.5rem; margin-top: 1rem; }
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
@media (max-width: 720px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
.stat-card { text-align: center; }
.stat-card strong { display: block; font-size: 1.75rem; color: var(--primary); }
.stat-card span { color: var(--gray-600); font-size: 0.9rem; }
.alert-success {
  background: #dcfce7;
  color: var(--success);
  padding: 0.75rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
}
</style>
