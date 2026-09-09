<script setup>
import { reactive, ref, onMounted } from 'vue'
import api from '../services/api'

const emit = defineEmits(['created'])

const form = reactive({
  doctorId: '',
  date: '',
  time: '',
  reason: '',
})

const doctors = ref([])
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    const { data } = await api.get('/doctors')
    doctors.value = data.doctors
  } catch {
    error.value = 'No se pudieron cargar los médicos'
  }
})

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/appointments', { ...form })
    form.reason = ''
    emit('created')
  } catch (err) {
    error.value = err.response?.data?.error || 'No se pudo crear la cita'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="card" @submit.prevent="onSubmit">
    <h3>Solicitar nueva cita</h3>

    <div v-if="error" class="alert-error">{{ error }}</div>

    <div class="form-group">
      <label for="doctor">Médico</label>
      <select id="doctor" v-model="form.doctorId" class="form-control" required>
        <option value="" disabled>Selecciona un médico</option>
        <option v-for="doc in doctors" :key="doc.id" :value="doc.id">
          {{ doc.name }} — {{ doc.specialty }}
        </option>
      </select>
    </div>

    <div class="grid-row">
      <div class="form-group">
        <label for="date">Fecha</label>
        <input id="date" v-model="form.date" type="date" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="time">Hora</label>
        <input id="time" v-model="form.time" type="time" class="form-control" required />
      </div>
    </div>

    <div class="form-group">
      <label for="reason">Motivo de la consulta</label>
      <textarea id="reason" v-model="form.reason" class="form-control" rows="2" placeholder="Describe brevemente tu consulta"></textarea>
    </div>

    <button class="btn" type="submit" :disabled="loading">
      {{ loading ? 'Enviando…' : 'Solicitar cita' }}
    </button>
  </form>
</template>

<style scoped>
.grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>