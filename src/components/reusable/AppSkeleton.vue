<template>
  <div class="skeleton-container">
    <div 
      v-for="i in count" 
      :key="i"
      :class="['skeleton', `skeleton-${type}`, { 'skeleton-animated': animated }]"
      :style="{
        width: width,
        height: height,
        borderRadius: borderRadius
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'AppSkeleton',
  props: {
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'card', 'circle', 'image'].includes(value)
    },
    count: {
      type: Number,
      default: 1
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '1rem'
    },
    borderRadius: {
      type: String,
      default: '0.25rem'
    },
    animated: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-animated {
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-text {
  height: 1rem;
}

.skeleton-card {
  height: 120px;
  border-radius: 0.5rem;
}

.skeleton-circle {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.skeleton-image {
  height: 200px;
  border-radius: 0.5rem;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>