<template>
  <AppModal :show="show" :title="`Results: ${attempt?.quiz_title}`" width="800px" @close="$emit('close')">
    <div class="correction-container p-2" v-if="attempt">
      
      <div class="score-summary" :class="isPass ? 'gradient-success' : 'gradient-danger'">
        <div class="score-circle">
          <span class="score-val">{{ attempt.score }}</span>
          <span class="score-total">/ {{ attempt.total_marks }}</span>
        </div>
        <div class="score-text">
          <h3>{{ isPass ? 'Great Job!' : 'Keep Practicing' }}</h3>
          <p>You scored {{ percentage }}%</p>
        </div>
      </div>

      <div class="d-flex flex-column gap-3">
        <div v-for="(q, index) in attempt.questions" :key="index" class="card p-3 mb-2">
          
          <div class="d-flex justify-between align-center mb-3 border-bottom pb-2">
            <span class="fw-bold text-dark">Q{{ index + 1 }}</span>
            <span class="text-gray text-sm">({{ q.marks }} marks)</span>
            <span class="status-badge" :class="q.is_correct ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'">
              {{ q.is_correct ? 'Correct' : 'Incorrect' }}
            </span>
          </div>
          
          <p class="q-text text-dark mb-3">{{ q.text }}</p>

          <div v-if="isObjective(q.type)" class="d-flex flex-column gap-2">
            <div 
              v-for="(opt, i) in q.options" 
              :key="i"
              class="option-row"
              :class="getOptionClass(q, opt)"
            >
              <div class="opt-marker">
                <span v-if="isCorrectOption(q, opt)">✔</span>
                <span v-else-if="isSelectedButWrong(q, opt)">✖</span>
                <span v-else>{{ String.fromCharCode(65+i) }}</span>
              </div>
              
              <div class="opt-text">
                {{ getOptionLabel(opt) }}
                
                <span v-if="isCorrectOption(q, opt)" class="badge-success ms-auto">
                  Correct Answer
                </span>
                
                <span v-if="isSelectedButWrong(q, opt)" class="badge-danger ms-auto">
                  Your Answer
                </span>
                
                <span v-if="isSelectedAndCorrect(q, opt)" class="badge-success ms-auto">
                  Your Answer (Correct)
                </span>
              </div>
            </div>
          </div>

          <div v-else class="d-flex flex-column gap-2">
             <div class="ans-box" :class="q.is_correct ? 'bg-success-soft' : 'bg-danger-soft'">
              <strong>Your Answer:</strong> {{ q.student_answer || '(No Answer)' }}
            </div>
            <div v-if="!q.is_correct" class="ans-box bg-success-soft">
              <strong>Correct Answer:</strong> {{ q.correct_answer }}
            </div>
          </div>

          <div v-if="q.explanation" class="alert alert-warning mt-3 mb-0 text-sm">
            <strong>Explanation:</strong> {{ q.explanation }}
          </div>

        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" @click="$emit('close')">Close Results</button>
    </template>
  </AppModal>
</template>

<script setup>
import { computed } from 'vue';
import AppModal from '../reusable/AppModal.vue';

const props = defineProps({ show: Boolean, attempt: Object });
defineEmits(['close']);

// --- Computed Stats ---
const percentage = computed(() => { 
  if (!props.attempt?.total_marks) return 0; 
  return Math.round((props.attempt.score / props.attempt.total_marks) * 100); 
});
const isPass = computed(() => percentage.value >= 50);

// --- Helpers ---

// Check if question type is one that uses options
const isObjective = (type) => {
  return ['multiple_choice', 'true_false', 'mcq', 'tf', 'boolean'].includes(type);
};

// Normalize values for comparison (handles "True" vs "true" vs boolean)
const normalize = (val) => String(val).trim().toLowerCase();

const getOptionValue = (opt) => {
  const val = (typeof opt === 'object' && opt !== null) ? (opt.value || opt.text) : opt;
  return normalize(val);
};

const getOptionLabel = (opt) => (typeof opt === 'object' && opt !== null) ? (opt.text || opt.value) : opt;

// Logic checks
const isCorrectOption = (q, opt) => {
  return getOptionValue(opt) === normalize(q.correct_answer);
};

const isSelectedOption = (q, opt) => {
  // Handle case where student didn't answer
  if (q.student_answer === null || q.student_answer === undefined) return false;
  return getOptionValue(opt) === normalize(q.student_answer);
};

const isSelectedButWrong = (q, opt) => {
  return isSelectedOption(q, opt) && !isCorrectOption(q, opt);
};

const isSelectedAndCorrect = (q, opt) => {
  return isSelectedOption(q, opt) && isCorrectOption(q, opt);
};

// Styling
const getOptionClass = (q, opt) => {
  if (isCorrectOption(q, opt)) return 'correct-opt'; 
  if (isSelectedButWrong(q, opt)) return 'wrong-opt'; 
  return 'neutral-opt';
};
</script>

<style scoped>
/* Using Variables */
.gradient-success { background: var(--gradient-success); }
.gradient-danger { background: var(--gradient-danger); }

/* Header */
.score-summary { display: flex; align-items: center; gap: 20px; padding: 20px; border-radius: var(--border-radius-lg); margin-bottom: 25px; color: white; }
.score-circle { background: rgba(255,255,255,0.2); width: 70px; height: 70px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; }
.score-val { font-size: 1.6rem; font-weight: 800; }

/* Options Styling */
.option-row { 
  display: flex; align-items: center; padding: 12px; margin-bottom: 8px; 
  border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); 
  gap: 12px; transition: all 0.2s;
}

/* Correct Style (Green) */
.correct-opt { background: var(--success-soft); border-color: var(--success-color); color: var(--success-dark); }
.correct-opt .opt-marker { background: var(--success-color); color: white; }

/* Wrong Selection Style (Red) */
.wrong-opt { background: var(--danger-soft); border-color: var(--danger-color); color: var(--danger-dark); }
.wrong-opt .opt-marker { background: var(--danger-color); color: white; }

/* Neutral/Unselected */
.neutral-opt { background: white; color: var(--gray-color); opacity: 0.7; }
.neutral-opt .opt-marker { background: var(--gray-light); color: var(--gray-dark); }

/* Markers & Badges */
.opt-marker { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; flex-shrink: 0; }
.opt-text { flex: 1; display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 0.95rem; }

.badge-success { background: var(--success-color); color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-weight: 700; }
.badge-danger { background: var(--danger-color); color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-weight: 700; }

.ms-auto { margin-left: auto; }
.text-sm { font-size: 0.85rem; }
.ans-box { padding: 12px; border-radius: 6px; font-size: 0.95rem; }
</style>