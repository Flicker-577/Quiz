<template>
  <svg 
    class="spinner" 
    :class="[size, color]" 
    viewBox="0 0 50 50"
  >
    <circle 
      class="path" 
      cx="25" 
      cy="25" 
      r="20" 
      fill="none" 
      stroke-width="5"
    ></circle>
  </svg>
</template>

<script>
export default {
  name: 'AppSpinner',
  props: {
    size: {
      type: String,
      default: 'md', // sm, md, lg
      validator: v => ['sm', 'md', 'lg'].includes(v)
    },
    color: {
      type: String, // 'light' (for dark buttons) or 'primary' (for white backgrounds)
      default: 'light'
    }
  }
}
</script>

<style scoped>
.spinner {
  animation: rotate 2s linear infinite;
  display: inline-block;
}

.spinner.sm { width: 16px; height: 16px; }
.spinner.md { width: 20px; height: 20px; }
.spinner.lg { width: 32px; height: 32px; }

.path {
  stroke: currentColor;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

/* Colors handled via text-color utility in parent or defaults */
.spinner.light { color: #ffffff; }
.spinner.primary { color: var(--primary-color); }

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}
</style>