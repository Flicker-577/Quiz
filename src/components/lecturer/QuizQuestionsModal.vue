<template>
  <AppModal :show="show" :title="`View Questions: ${quiz?.title}`" width="800px" @close="$emit('close')">
    <div class="questions-manager">
      
      <div v-if="loading" class="loader-container">
        <AppSpinner size="lg" color="primary" />
        <p class="loading-text">Loading questions...</p>
      </div>
      
      <div v-else>
        <div class="toolbar">
           <span class="count-text">Total Questions: <strong>{{ localQuestions.length }}</strong></span>
        </div>

        <div v-if="localQuestions.length === 0" class="empty-state">
          <p>No questions found for this quiz.</p>
        </div>

        <div v-else class="questions-list-scroll">
          <div v-for="(question, index) in localQuestions" :key="index" class="q-card">
            
            <div class="q-header">
              <div class="q-title">
                <strong>Q{{ index + 1 }}.</strong> 
                <span class="badge">{{ getTypeName(question.type) }}</span>
                <span class="points">({{ question.points }} pts)</span>
              </div>
              </div>
            
            <p class="text">{{ question.text || '(No question text)' }}</p>
            
            <div v-if="question.type === 'multiple'" class="preview-opts">
                <div v-for="(opt, i) in question.options" :key="i" class="preview-opt" :class="{correct: i === question.correctOption}">
                  <span class="opt-label">{{ String.fromCharCode(65+i) }}.</span> {{ opt }}
                  <span v-if="i === question.correctOption" class="correct-indicator"> (Correct)</span>
                </div>
            </div>
            
            <div v-else class="preview-ans">
                <strong>Correct Answer:</strong> 
                <span class="ans-text">
                  {{ question.type === 'truefalse' ? (question.correctAnswer ? 'True' : 'False') : question.expectedAnswer }}
                </span>
            </div>

          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
       <div class="modal-footer">
         <AppButton variant="outline" @click="$emit('close')">Close</AppButton>
       </div>
    </template>
  </AppModal>
</template>

<script>
import { ref, watch } from 'vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppSpinner from '../../components/reusable/AppSpinner.vue' 
import api from '@/api/api'

export default {
  name: 'QuizQuestionsViewModal',
  components: { AppModal, AppButton, AppSpinner },
  props: { show: Boolean, quiz: Object },
  emits: ['close'],
  setup(props) {
    const loading = ref(false)
    const localQuestions = ref([])

    // Helper: Map backend type to friendly label
    const getTypeName = (type) => {
      if (type === 'multiple') return 'Multiple Choice';
      if (type === 'truefalse') return 'True/False';
      return 'Short Answer';
    }

    // RETRIEVAL: Fetch questions from DB and map to frontend structure
    watch(() => props.show, async (val) => {
      if (val && props.quiz) {
        loading.value = true
        try {
           const res = await api.get(`/lecturer/quizzes/${props.quiz.id}`)
           
           const questionsData = res.data.questions || [];

           // MAPPING LOGIC
           localQuestions.value = questionsData.map(q => ({
              id: q.id,
              text: q.question_text || '',
              type: q.question_type === 'multiple_choice' ? 'multiple' : (q.question_type === 'true_false' ? 'truefalse' : 'short'),
              points: q.marks || 1,
              options: q.options || [],
              correctOption: (q.options && q.correct_answer) ? q.options.indexOf(q.correct_answer) : 0, 
              correctAnswer: q.correct_answer === 'True',
              expectedAnswer: q.correct_answer || ''
           }))
        } catch (e) { 
           console.error("Error loading questions:", e) 
           alert("Failed to load questions.")
        } finally { 
           loading.value = false 
        }
      }
    })

    return { 
       loading, 
       localQuestions, 
       getTypeName
    }
  }
}
</script>

<style scoped>
.loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; }
.loading-text { margin-top: 10px; color: #6b7280; font-size: 0.9rem; }
.empty-state { text-align: center; padding: 40px; border: 2px dashed #e5e7eb; border-radius: 8px; color: #6b7280; margin-bottom: 20px; }
.questions-list-scroll { max-height: 60vh; overflow-y: auto; padding-right: 5px; }
.q-card { border: 1px solid #e5e7eb; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

/* Header */
.q-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px; }
.q-title { display: flex; align-items: center; gap: 8px; }
.badge { background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;}
.points { color: #6b7280; font-size: 0.85rem; font-weight: 500; }

/* Content */
.text { font-size: 1rem; color: #1f2937; margin: 0 0 12px 0; line-height: 1.5; font-weight: 500; }

/* Options Styling */
.preview-opts { display: flex; flex-direction: column; gap: 6px; }
.preview-opt { display: flex; gap: 8px; font-size: 0.9rem; color: #4b5563; padding: 6px 10px; border-radius: 4px; border: 1px solid transparent; }

/* Highlight Correct Answer */
.preview-opt.correct { background: #ecfdf5; color: #065f46; font-weight: 600; border-color: #a7f3d0; }
.correct-indicator { font-size: 0.8rem; color: #059669; font-weight: 700; }

.opt-label { font-weight: 600; color: #9ca3af; }
.preview-opt.correct .opt-label { color: #059669; }

/* Answer Box for Non-MCQ */
.preview-ans { background: #f9fafb; padding: 10px; border-radius: 4px; font-size: 0.95rem; color: #4b5563; border-left: 4px solid #3b82f6; }
.ans-text { font-weight: 600; color: #1f2937; margin-left: 5px; }

/* Toolbar & Footer */
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.count-text { color: #6b7280; font-size: 0.9rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb; }
</style>