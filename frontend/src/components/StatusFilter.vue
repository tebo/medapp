<script setup>
defineProps({
  modelValue: { type: String, default: 'all' },
  options: {
    type: Array,
    default: () => [
      { value: 'all', label: 'Todas' },
      { value: 'pending', label: 'Pendientes' },
      { value: 'confirmed', label: 'Confirmadas' },
      { value: 'rejected', label: 'Rechazadas' },
      { value: 'cancelled', label: 'Canceladas' },
    ],
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="status-filter" role="group" aria-label="Filtrar por estado">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="filter-chip"
      :class="{ active: modelValue === option.value }"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.status-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-chip {
  border: 1px solid var(--gray-300);
  background: #fff;
  color: var(--gray-600);
  border-radius: var(--radius);
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.filter-chip.active {
  border-color: var(--primary);
  background: var(--primary);
  color: #fff;
}
</style>
