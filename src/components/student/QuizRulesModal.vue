<template>
  <AppModal :show="show" :title="`Quiz Details: ${quiz?.title}`" width="500px" @close="$emit('close')">
    <div v-if="quiz" class="rules-container">
      <div class="rules-list">
        <div class="rule-item">
          <span class="label">Module</span>
          <span class="value">{{ moduleName }}</span>
        </div>
        <div class="rule-item">
          <span class="label">Starts At</span>
          <span class="value">{{ formatDateTime(quiz.start_at) }}</span>
        </div>
        <div class="rule-item">
          <span class="label">Ends At</span>
          <span class="value">{{ formatDateTime(quiz.end_at) }}</span>
        </div>
        <div class="rule-item">
          <span class="label">Duration</span>
          <span class="value">{{ quiz.duration_minutes }} minutes</span>
        </div>
        <div class="rule-item">
          <span class="label">Total Marks</span>
          <span class="value">{{ quiz.total_marks }}</span>
        </div>
      </div>
      
      <h4 class="rules-title">Instructions</h4>
      <ul class="instructions">
        <li>This quiz must be completed in one sitting.</li>
        <li>Once you start, the timer will not stop.</li>
        <li>Do not close or refresh this browser window.</li>
        <li>The quiz will auto-submit when the timer ends.</li>
        <li>Your results will be available after grading.</li>
      </ul>
    </div>
    
    <template #footer>
      <AppButton variant="primary" @click="$emit('close')">
        Close
      </AppButton>
    </template>
  </AppModal>
</template>

<script setup>
import { computed } from 'vue';
import AppModal from '../reusable/AppModal.vue';
import AppButton from '../reusable/AppButton.vue';
// Import the shared utility function
import { formatDateTime } from '../../utils/formatters.js'; // Adjust path as needed

// Define props and emits
const props = defineProps({
  show: Boolean,
  quiz: {
    type: Object,
    // Add specific validation
    validator: (q) => {
      return q === null || (q &&
        typeof q.title === 'string' &&
        typeof q.start_at === 'string' && // ISO String
        typeof q.end_at === 'string' &&   // ISO String
        typeof q.duration_minutes === 'number' &&
        typeof q.total_marks === 'number'
      );
    }
  }
});
defineEmits(['close']);

const moduleName = computed(() => {
  // This is fine, but in a larger app, you might fetch module names
  // based on 'module_id' rather than hardcoding them.
  return props.quiz?.module_id === 1 ? 'Web Programming' : 'Database Systems';
});

// The formatDateTime function is no longer needed here!
</script>

<style scoped>
/* Styles remain unchanged */
.rules-list {
  background: var(--light-color);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--gray-light);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}
.rule-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--gray-light);
}
.rule-item:last-child { border-bottom: none; }
.rule-item .label {
  font-size: 0.9rem;
  color: var(--gray-color);
}
.rule-item .value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--dark-color);
}
.rules-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark-color);
  margin-bottom: var(--spacing-sm);
}
.instructions {
  padding-left: var(--spacing-md);
  font-size: 0.9rem;
  color: var(--gray-dark);
  line-height: 1.6;
}
</style>