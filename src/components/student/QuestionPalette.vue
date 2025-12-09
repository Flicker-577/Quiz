<template>
  <div class="palette-container">
    <div class="palette-grid">
      <button
        v-for="n in total"
        :key="n"
        :class="[
          'palette-button',
          { 'is-current': n - 1 === currentIndex },
          { 'is-answered': answeredStatus[n - 1] }
        ]"
        @click="$emit('navigate', n - 1)"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  total: { type: Number, required: true },
  currentIndex: { type: Number, required: true },
  answeredStatus: { type: Array, required: true }
});
defineEmits(['navigate']);
</script>

<style scoped>
.palette-container {
  width: 100%;
  background: transparent;
}

.palette-grid {
  display: grid;
  /* Auto-fill grid: creates as many columns as fit, min 40px wide */
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 8px;
  padding: 4px;
}

.palette-button {
  width: 100%;
  aspect-ratio: 1; /* Keeps it square */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  background: white;
  color: #6b7280;
  transition: all 0.2s;
}

.palette-button:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

/* Answered state */
.palette-button.is-answered {
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #4f46e5;
}

/* Current question */
.palette-button.is-current {
  background: #4f46e5;
  border-color: #4338ca;
  color: white;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
  transform: scale(1.05);
}
</style>