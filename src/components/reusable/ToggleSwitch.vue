<!-- components/reusable/ToggleSwitch.vue -->
<template>
  <label class="toggle-switch" :class="{ disabled: disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
      class="toggle-input"
    />
    <span class="toggle-slider" :class="{
      'success': variant === 'success',
      'warning': variant === 'warning',
      'danger': variant === 'danger',
      'primary': variant === 'primary' || !variant
    }"></span>
    <span v-if="label" class="toggle-label">{{ label }}</span>
    <span v-if="loading" class="toggle-loading">
      <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    </span>
  </label>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ToggleSwitch',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value)
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const handleChange = (event) => {
      if (!props.disabled && !props.loading) {
        const newValue = event.target.checked
        emit('update:modelValue', newValue)
        emit('change', newValue)
      }
    }

    return {
      handleChange
    }
  }
}
</script>

<style scoped>
.toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.toggle-switch.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  background-color: var(--gray-light);
  border-radius: 24px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.toggle-slider:before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

.toggle-input:checked + .toggle-slider.success {
  background-color: var(--success-color);
}

.toggle-input:checked + .toggle-slider.warning {
  background-color: var(--warning-color);
}

.toggle-input:checked + .toggle-slider.danger {
  background-color: var(--danger-color);
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-input:focus + .toggle-slider {
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.toggle-input:checked:focus + .toggle-slider {
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.toggle-input:disabled + .toggle-slider {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-label {
  font-size: 0.875rem;
  color: var(--dark-color);
  font-weight: 500;
}

.toggle-loading {
  display: flex;
  align-items: center;
  color: var(--gray-color);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Hover effects */
.toggle-switch:not(.disabled):hover .toggle-slider {
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.toggle-switch:not(.disabled):hover .toggle-slider.success {
  box-shadow: 0 0 0 3px var(--success-soft);
}

.toggle-switch:not(.disabled):hover .toggle-slider.warning {
  box-shadow: 0 0 0 3px var(--warning-soft);
}

.toggle-switch:not(.disabled):hover .toggle-slider.danger {
  box-shadow: 0 0 0 3px var(--danger-soft);
}
</style>