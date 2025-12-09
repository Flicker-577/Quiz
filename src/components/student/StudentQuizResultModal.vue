<template>
  <AppModal :show="show" :title="`Result: ${quiz?.title}`" width="700px" @close="$emit('close')">
    
    <div class="result-summary" v-if="results.length > 0">
      <div class="summary-card">
        <span class="label">Student</span>
        <span class="value">{{ studentName || 'Student' }}</span>
      </div>
      <div class="summary-card">
        <span class="label">Total Score</span>
        <span class="value highlight">{{ totalScore }} / {{ maxScore }}</span>
      </div>
    </div>

    <div class="questions-container">
      <div v-if="results.length === 0" class="empty-state">
        <p>No result data available.</p>
      </div>
      
      <div v-else class="question-list">
        <div v-for="(q, index) in results" :key="q.id" class="question-item">
          
          <div class="question-header">
            <div class="header-left">
              <span class="question-number">Q{{ index + 1 }}</span>
              <p class="question-text">{{ q.question }}</p>
            </div>
            <div class="header-right">
              <span 
                class="status-badge" 
                :class="q.selected_answer === q.correct_answer ? 'success' : 'danger'"
              >
                {{ q.selected_answer === q.correct_answer ? 'Correct' : 'Incorrect' }}
              </span>
              <span class="question-marks">{{ q.mark }} Marks</span>
            </div>
          </div>

          <div class="question-options">
            <div 
              v-for="opt in q.options" :key="opt.key"
              class="option"
              :class="getOptionClass(q, opt.key)"
            >
              <span class="option-key">{{ opt.key }}</span>
              <span class="option-text">{{ opt.text }}</span>
              
              <span v-if="opt.key === q.correct_answer" class="icon-status check">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Correct
              </span>
              <span v-if="opt.key === q.selected_answer && opt.key !== q.correct_answer" class="icon-status cross">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Your Answer
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="modal-actions">
        <AppButton variant="outline" @click="$emit('close')">Close</AppButton>
      </div>
    </template>
  </AppModal>
</template>

<script>
import { ref, watch, computed } from 'vue'
import AppModal from '../reusable/AppModal.vue'
import AppButton from '../reusable/AppButton.vue'

export default {
  name: 'StudentQuizResultModal',
  components: { AppModal, AppButton },
  props: {
    show: Boolean,
    quiz: Object,
    studentName: {
      type: String,
      default: 'Ian Malcolm' // Default for demo
    }
  },
  emits: ['close'],
  setup(props) {
    const results = ref([])

    // Computed totals for the summary header
    const maxScore = computed(() => results.value.reduce((acc, q) => acc + q.mark, 0))
    const totalScore = computed(() => {
      return results.value.reduce((acc, q) => {
        return q.selected_answer === q.correct_answer ? acc + q.mark : acc
      }, 0)
    })

    // Logic to determine CSS class for each option
    const getOptionClass = (question, optionKey) => {
      // 1. It is the CORRECT answer (Always show Green)
      if (optionKey === question.correct_answer) {
        return 'correct'
      }
      // 2. It is the WRONG answer selected by student (Show Red)
      if (optionKey === question.selected_answer && optionKey !== question.correct_answer) {
        return 'wrong'
      }
      // 3. It is a neutral unselected option
      return 'neutral'
    }

    watch(() => props.quiz, (newQuiz) => {
      if (newQuiz) {
        // Mock Data simulating a student's attempt
        results.value = [
          { 
            id: 1, question: 'What does HTML stand for?', mark: 10,
            options: [
              { key: 'A', text: 'HyperText Markup Language' },
              { key: 'B', text: 'High-Level Test Machine' },
              { key: 'C', text: 'Hyperlink and Text Markup' }
            ],
            correct_answer: 'A', 
            selected_answer: 'A' // Student got this RIGHT
          },
          { 
            id: 2, question: 'Is CSS a programming language?', mark: 10,
            options: [
              { key: 'A', text: 'Yes' },
              { key: 'B', text: 'No' }
            ],
            correct_answer: 'B', 
            selected_answer: 'A' // Student got this WRONG
          },
          { 
            id: 3, question: 'What is Vue.js?', mark: 10,
            options: [
              { key: 'A', text: 'A database' },
              { key: 'B', text: 'A server-side language' },
              { key: 'C', text: 'A progressive JavaScript framework' }
            ],
            correct_answer: 'C', 
            selected_answer: 'C' // Student got this RIGHT
          }
        ]
      }
    })

    return { results, maxScore, totalScore, getOptionClass }
  }
}
</script>

<style scoped>
/* Summary Header */
.result-summary {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--light-color);
  border-radius: var(--border-radius-md);
}
.summary-card {
  flex: 1;
  background: white;
  padding: 10px 15px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--gray-light);
  display: flex;
  flex-direction: column;
}
.summary-card .label { font-size: 0.75rem; color: var(--gray-color); text-transform: uppercase; }
.summary-card .value { font-weight: 700; color: var(--dark-color); font-size: 1.1rem; }
.summary-card .value.highlight { color: var(--primary-color); }

/* Questions Layout */
.questions-container {
  max-height: 60vh;
  overflow-y: auto;
  padding: 5px;
}
.question-list { display: flex; flex-direction: column; gap: var(--spacing-lg); }

.question-item {
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

/* Header */
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f8f9fa;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--gray-light);
}
.header-left { display: flex; gap: var(--spacing-md); flex: 1; }
.header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }

.question-number { font-weight: 700; color: var(--primary-color); font-size: 0.9rem; min-width: 25px; }
.question-text { margin: 0; font-weight: 500; color: var(--dark-color); line-height: 1.4; }
.question-marks { font-size: 0.75rem; color: var(--gray-color); font-weight: 600; }

.status-badge { font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase; }
.status-badge.success { background: var(--success-soft); color: var(--success-dark); }
.status-badge.danger { background: var(--danger-soft); color: var(--danger-color); }

/* Options */
.question-options { display: flex; flex-direction: column; padding: var(--spacing-md); gap: 8px; }

.option {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 10px;
  border-radius: var(--border-radius-sm);
  border: 1px solid transparent;
  background: white;
  transition: all 0.2s;
}

.option-key {
  font-weight: 600;
  font-size: 0.8rem;
  width: 24px; height: 24px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--gray-light);
  color: var(--gray-dark);
  flex-shrink: 0;
}

.option-text { flex: 1; font-size: 0.9rem; color: var(--dark-color); }

.icon-status {
  font-size: 0.75rem;
  font-weight: 600;
  display: flex; align-items: center; gap: 4px;
}

/* --- Visual Logic Styles --- */

/* 1. Correct Answer (Green) */
.option.correct {
  background: #e8f5e9; /* Light Green */
  border-color: #c8e6c9;
}
.option.correct .option-key { background: #2e7d32; color: white; }
.option.correct .option-text { color: #1b5e20; font-weight: 600; }
.option.correct .icon-status.check { color: #2e7d32; }

/* 2. Wrong Selected Answer (Red) */
.option.wrong {
  background: #ffebee; /* Light Red */
  border-color: #ffcdd2;
}
.option.wrong .option-key { background: #c62828; color: white; }
.option.wrong .option-text { color: #b71c1c; }
.option.wrong .icon-status.cross { color: #c62828; }

/* 3. Neutral/Unselected */
.option.neutral {
  border-color: var(--gray-light);
  opacity: 0.7;
}

.modal-actions { display: flex; justify-content: flex-end; }
.empty-state { text-align: center; padding: var(--spacing-xl); }
</style>