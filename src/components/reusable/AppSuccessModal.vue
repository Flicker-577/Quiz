<template>
  <AppModal :show="show" :title="title" width="400px" @close="close">
    <div class="success-content">
      <div class="checkmark-wrapper">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
      </div>

      <h3 class="success-title">{{ title }}</h3>
      <p class="success-message">{{ message }}</p>
    </div>

    <template #footer>
      <button class="btn btn-primary btn-block" @click="close">
        {{ buttonText }}
      </button>
    </template>
  </AppModal>
</template>

<script>
import AppModal from './AppModal.vue'

export default {
  name: 'AppSuccessModal',
  components: { AppModal },
  props: {
    show: Boolean,
    title: {
      type: String,
      default: 'Success!'
    },
    message: {
      type: String,
      default: 'Operation completed successfully.'
    },
    buttonText: {
      type: String,
      default: 'Continue'
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const close = () => emit('close')
    return { close }
  }
}
</script>

<style scoped>
.success-content {
  text-align: center;
  padding: 2rem 1rem;
}

.success-title {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--dark-color);
  font-weight: 700;
  font-size: 1.5rem;
}

.success-message {
  color: var(--gray-color);
  font-size: 1rem;
}

.btn-block {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-block:hover {
  background: var(--primary-dark);
}

/* --- Animation Styles --- */

.checkmark-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.checkmark {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px var(--success-color);
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: var(--success-color);
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% { stroke-dashoffset: 0; }
}

@keyframes scale {
  0%, 100% { transform: none; }
  50% { transform: scale3d(1.1, 1.1, 1); }
}

@keyframes fill {
  100% { box-shadow: inset 0px 0px 0px 50px var(--success-color); }
}
</style>