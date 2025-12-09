<template>
  <div class="countdown-timer">
    <slot v-if="timeRemaining > 0" :days="days" :hours="hours" :minutes="minutes" :seconds="seconds">
      <span v-if="days > 0">{{ days }}d </span>
      <span>{{ String(hours).padStart(2, '0') }}:</span>
      <span>{{ String(minutes).padStart(2, '0') }}:</span>
      <span>{{ String(seconds).padStart(2, '0') }}</span>
    </slot>
    <div v-else class="countdown-finished">
      <slot name="finished">
        Time's up!
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  targetTime: {
    type: Number, // e.g., Date.now() + 10000
    default: null
  },
  duration: {
    type: Number, // e.g., 3600 for 1 hour
    default: null
  }
});

const emit = defineEmits(['finished']);

const now = ref(Math.floor(Date.now() / 1000));
const interval = ref(null);
const internalTargetTime = ref(0);

const timeRemaining = computed(() => {
  return Math.max(0, internalTargetTime.value - now.value);
});

const days = computed(() => Math.floor(timeRemaining.value / 86400));
const hours = computed(() => Math.floor((timeRemaining.value % 86400) / 3600));
const minutes = computed(() => Math.floor((timeRemaining.value % 3600) / 60));
const seconds = computed(() => timeRemaining.value % 60);

function updateTime() {
  now.value = Math.floor(Date.now() / 1000);
  if (timeRemaining.value <= 0) {
    stopTimer();
    emit('finished');
  }
}

function startTimer() {
  if (interval.value) {
    clearInterval(interval.value);
  }
  interval.value = setInterval(updateTime, 1000);
}

function stopTimer() {
  clearInterval(interval.value);
  interval.value = null;
}

function initializeTimer() {
  let target;
  if (props.targetTime) {
    target = Math.floor(props.targetTime / 1000);
  } else if (props.duration) {
    target = Math.floor(Date.now() / 1000) + props.duration;
  } else {
    return;
  }
  internalTargetTime.value = target;
  updateTime(); // Run once immediately
  startTimer();
}

watch(() => props.targetTime, initializeTimer);
watch(() => props.duration, initializeTimer);

onMounted(initializeTimer);
onBeforeUnmount(stopTimer);
</script>

<style scoped>
/* Styles remain unchanged */
.countdown-timer {
  font-weight: 600;
  font-size: var(--font-size-lg);
  color: var(--primary-dark);
}
.countdown-finished {
  font-weight: 600;
  color: var(--danger-color);
}
</style>