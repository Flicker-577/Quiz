<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal" :style="{ width: width }">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="close">&times;</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppModal',
  props: {
    show: Boolean,
    title: String,
    width: {
      type: String,
      default: '500px'
    }
  },
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-light);
}

.modal-header h3 {
  margin: 0;
  color: var(--dark-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray-color);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-button:hover {
  background: var(--gray-light);
  color: var(--dark-color);
}

.modal-body {
  padding: var(--spacing-lg);
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--gray-light);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}
</style>