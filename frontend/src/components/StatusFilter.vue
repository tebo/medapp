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
  gap: 0.45rem;
  margin-bottom: 1rem;
}

.filter-chip {
  border: 1px solid var(--border);
  background: rgb(255 255 255 / 0.7);
  color: var(--ink-soft);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
}

.filter-chip.active {
  border-color: var(--primary);
  background: var(--primary);
  color: #fff;
}

.filter-chip:hover:not(.active) {
  border-color: var(--primary);
  color: var(--primary-dark);
}
</style>
