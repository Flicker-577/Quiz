<template>
  <div class="quiz-wrapper" :class="{ 'offline-mode': !store.isOnline }">
    <AutoSubmitModal :visible="store.status === 'submitting' || store.status === 'submitted'" @confirm="confirmAndLeave"/>

    <header class="quiz-header">
      <div class="header-left">
        <h2 class="quiz-title text-dark">{{ store.quiz?.title || 'Loading...' }}</h2>
        <span class="status-badge" :class="store.isOnline ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'">
          {{ store.isOnline ? 'Online' : 'Offline' }}
        </span>
      </div>
      <div class="header-right">
        <span class="save-status" :class="saveStatusClass">{{ store.saveStatus }}</span>
        <CountdownTimer v-if="timerTarget" :target-time="timerTarget" @finished="handleTimerFinished">
          <template #default="{ hours, minutes, seconds }">
            <div class="timer-display" :class="{ 'urgent': hours === 0 && minutes < 5 }">
              <span>⏳ {{ String(hours).padStart(2, '0') }}:{{ String(minutes).padStart(2, '0') }}:{{ String(seconds).padStart(2, '0') }}</span>
            </div>
          </template>
        </CountdownTimer>
      </div>
    </header>

    <div class="quiz-body" v-if="store.currentQuestion">
      
      <section class="question-section">
        <div class="card question-card">
          <div class="q-meta mb-3">
            <span class="badge-primary-soft">Question {{ store.currentQuestionIndex + 1 }}</span>
            <span class="text-gray fw-bold">{{ store.currentQuestion.points || 1 }} Marks</span>
          </div>

          <h3 class="q-text mb-4">{{ store.currentQuestion.text }}</h3>

          <div class="options-list">
             <template v-if="['mcq', 'tf', 'multiple_choice', 'true_false'].includes(store.currentQuestion.type)">
               <div 
                 v-for="(opt, idx) in store.currentQuestion.options" 
                 :key="idx" 
                 class="option-card"
                 :class="{ 'is-selected': isSelected(opt) }"
                 @click="selectOption(opt)"
               >
                 <div class="option-marker">{{ String.fromCharCode(65+idx) }}</div>
                 <div class="option-content">{{ getOptionLabel(opt) }}</div>
                 <div class="option-radio"><div class="radio-inner"></div></div>
               </div>
             </template>

             <template v-if="['short', 'short_answer'].includes(store.currentQuestion.type)">
                <textarea 
                  :value="store.answers[store.currentQuestion.id]"
                  @input="e => store.saveAnswer(store.currentQuestion.id, e.target.value)"
                  class="form-control"
                  placeholder="Type your answer here..."
                  rows="5"
                ></textarea>
             </template>
          </div>

          <div class="nav-controls mt-4 pt-3 border-top">
             <button class="btn btn-secondary" @click="store.prevQuestion" :disabled="store.currentQuestionIndex === 0">← Previous</button>
             <button class="btn btn-primary" @click="store.nextQuestion" :disabled="store.isLastQuestion">Next →</button>
          </div>
        </div>
      </section>

      <section class="palette-section">
        <div class="card palette-card">
           <div class="section-header mb-2 d-flex justify-between">
             <h4 class="text-dark">Question Map</h4>
             <div class="legend">
               <span class="dot current"></span> Current <span class="dot answered"></span> Answered
             </div>
           </div>
           <QuestionPalette 
              :total="store.totalQuestions"
              :current-index="store.currentQuestionIndex"
              :answered-status="answeredStatusArray"
              @navigate="store.selectQuestion"
           />
        </div>
      </section>

      <section class="submit-section">
         <button class="btn btn-danger w-100 py-3" @click="showConfirmModal = true">
           Submit Assessment
         </button>
      </section>
    </div>

    <AppModal :show="showConfirmModal" title="Finish Attempt?" width="400px" @close="showConfirmModal = false">
      <div class="text-center p-3">
        <p>Are you sure you want to submit?</p>
        <p class="text-gray text-sm">Answered {{ answeredCount }} of {{ store.totalQuestions }} questions.</p>
      </div>
      <div class="d-flex justify-end gap-2 mt-3">
        <button class="btn btn-secondary" @click="showConfirmModal = false">Review</button>
        <button class="btn btn-danger" @click="handleUserSubmit">Submit Quiz</button>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
// ... (Script Logic identical to previous correct version, imports kept) ...
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStudentQuizStore } from '@/stores/studentQuizStore';
import AppModal from '@/components/reusable/AppModal.vue'; 
import QuestionPalette from './QuestionPalette.vue';
import CountdownTimer from './CountdownTimer.vue';
import AutoSubmitModal from '@/components/student/AutoSubmitModal.vue';

const store = useStudentQuizStore();
const emit = defineEmits(['submit', 'close']);
const showConfirmModal = ref(false);
const timerTarget = ref(null);

onMounted(() => { if (store.timeRemaining > 0) timerTarget.value = Date.now() + (store.timeRemaining * 1000); });
watch(() => store.status, (newVal) => { if (newVal === 'submitted') { /* wait for user */ } });
onUnmounted(async () => { if (store.status === 'running') { await store.completeQuiz('Navigated Away'); emit('submit'); } store.stopTimers(); });

const getOptionValue = (opt) => (typeof opt === 'object' && opt !== null) ? (opt.value || opt.text) : opt;
const getOptionLabel = (opt) => (typeof opt === 'object' && opt !== null) ? (opt.text || opt.value) : opt;
const isSelected = (opt) => getOptionValue(opt) == store.answers[store.currentQuestion.id];
const selectOption = (opt) => store.saveAnswer(store.currentQuestion.id, getOptionValue(opt));

const answeredStatusArray = computed(() => { if (!store.questions.length) return []; return store.questions.map(q => { const ans = store.answers[q.id]; return ans !== null && ans !== undefined && ans !== ''; }); });
const answeredCount = computed(() => answeredStatusArray.value.filter(Boolean).length);
const saveStatusClass = computed(() => { if (store.saveStatus === 'Saving...') return 'text-warning'; if (store.saveStatus === 'Saved') return 'text-success'; return 'text-danger'; });

const handleUserSubmit = () => { showConfirmModal.value = false; store.completeQuiz('User Action'); };
const handleTimerFinished = () => { store.completeQuiz('Time Expired'); };
const confirmAndLeave = () => { emit('submit'); };
</script>

<style scoped>
.quiz-wrapper { display: flex; flex-direction: column; height: 100vh; background-color: var(--light-color); overflow: hidden; }

/* Header */
.quiz-header { height: 64px; flex-shrink: 0; background: white; border-bottom: 1px solid var(--gray-light); display: flex; align-items: center; justify-content: space-between; padding: 0 var(--spacing-lg); z-index: 20; }
.header-left, .header-right { display: flex; align-items: center; gap: var(--spacing-md); }
.quiz-title { font-size: var(--font-size-lg); font-weight: 700; color: var(--dark-color); margin: 0; }
.status-badge { font-size: var(--font-size-xs); padding: 4px 10px; border-radius: 4px; font-weight: 600; text-transform: uppercase; }
.bg-success-soft { background: var(--success-soft); } .text-success { color: var(--success-dark); }
.bg-danger-soft { background: var(--danger-soft); } .text-danger { color: var(--danger-dark); }

.timer-display { font-family: monospace; font-size: var(--font-size-lg); font-weight: 700; color: var(--dark-color); background: var(--light-color); padding: 6px 12px; border-radius: var(--border-radius-md); }
.timer-display.urgent { color: var(--danger-color); background: var(--danger-soft); }

/* Body */
.quiz-body { flex: 1; overflow-y: auto; padding: var(--spacing-lg); display: flex; flex-direction: column; gap: var(--spacing-lg); align-items: center; }
.question-section, .palette-section, .submit-section { width: 100%; max-width: 800px; }

/* Question Card */
.question-card { padding: var(--spacing-xl); }
.q-meta { display: flex; justify-content: space-between; align-items: center; }
.badge-primary-soft { background: var(--primary-soft); color: var(--primary-color); padding: 4px 10px; border-radius: var(--border-radius-sm); font-weight: 600; font-size: var(--font-size-sm); }
.q-text { font-size: var(--font-size-xl); color: var(--dark-color); line-height: 1.5; font-weight: 600; }

/* Options */
.options-list { display: flex; flex-direction: column; gap: var(--spacing-md); }
.option-card {
  display: flex; align-items: center; padding: var(--spacing-md);
  border: 2px solid var(--gray-light); border-radius: var(--border-radius-md);
  cursor: pointer; background: white; transition: all 0.2s;
}
.option-card:hover { border-color: var(--primary-light); background: var(--primary-soft); }
.option-card.is-selected { border-color: var(--primary-color); background: var(--primary-soft); box-shadow: 0 0 0 1px var(--primary-color); }

.option-marker {
  width: 32px; height: 32px; background: var(--light-color); color: var(--gray-color);
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--border-radius-sm); font-weight: 700; margin-right: var(--spacing-md);
}
.option-card.is-selected .option-marker { background: var(--primary-color); color: white; }
.option-content { flex: 1; font-size: var(--font-size-base); color: var(--dark-color); }

/* Radio */
.option-radio { width: 22px; height: 22px; border: 2px solid var(--gray-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.option-card.is-selected .option-radio { border-color: var(--primary-color); }
.radio-inner { width: 12px; height: 12px; background: var(--primary-color); border-radius: 50%; opacity: 0; transition: opacity 0.2s; }
.option-card.is-selected .radio-inner { opacity: 1; }

/* Palette */
.legend { display: flex; gap: 10px; font-size: var(--font-size-xs); }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 4px; }
.dot.current { background: var(--primary-color); }
.dot.answered { background: var(--primary-soft); border: 1px solid var(--primary-color); }

.nav-controls { display: flex; justify-content: space-between; }
</style>