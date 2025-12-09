<template>
  <button
    :class="['btn', `btn-${variant}`, { 'btn-block': block }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <AppLoader v-if="loading" small />
    <slot v-else />
  </button>
</template>

<script>
import AppLoader from './AppLoader.vue'

export default {
  name: 'AppButton',
  components: { AppLoader },
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'outline'].includes(value)
    },
    disabled: Boolean,
    loading: Boolean,
    block: Boolean
  },
  emits: ['click']
}
</script>

<style scoped>
.btn-block {
  width: 100%;
}
</style>