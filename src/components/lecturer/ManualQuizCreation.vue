<template>
  <div class="manual-quiz-creation">
    <form @submit.prevent="createQuiz">
      <div class="form-section">
        <h3>Basic Information</h3>
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label">Quiz Title *</label>
            <input v-model="quizData.title" type="text" class="form-control" placeholder="Enter quiz title" required />
          </div>
          <div class="form-group">
            <label class="form-label">Module *</label>
            <select v-model="quizData.moduleId" class="form-control" required>
              <option value="">Select Module</option>
              <option v-for="module in modules" :key="module.id" :value="module.id">
                {{ module.name }} ({{ module.code }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <h3>Questions</h3>
          <AppButton type="button" @click="addQuestion" size="sm">
            + Add Question
          </AppButton>
        </div>

        <div class="questions-list">
          <div v-for="(question, index) in quizData.questions" :key="index" class="question-card">
            <div class="question-header">
              <h4>Question {{ index + 1 }}</h4>
              <button type="button" class="remove-btn" @click="removeQuestion(index)" :disabled="quizData.questions.length === 1">
                <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>

            <div class="form-group">
              <label class="form-label">Question Text *</label>
              <textarea v-model="question.text" class="form-control" rows="3" placeholder="Enter your question" required></textarea>
            </div>

            <div class="grid grid-2">
               <div class="form-group">
                  <label class="form-label">Question Type *</label>
                  <select v-model="question.type" class="form-control" required @change="handleQuestionTypeChange(index)">
                  <option value="multiple">Multiple Choice</option>
                  <option value="truefalse">True/False</option>
                  <option value="short">Short Answer</option>
                  </select>
               </div>
               <div class="form-group">
                  <label class="form-label">Points *</label>
                  <input v-model="question.points" type="number" class="form-control" min="1" max="10" required />
               </div>
            </div>

            <div v-if="question.type === 'multiple'" class="options-section">
              <div class="options-header">
                <label class="form-label">Options * <small style="color: var(--gray-color)">(Radio indicates correct answer)</small></label>
              </div>
              <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-row">
                <input type="radio" :name="'correct-' + index" :value="optIndex" v-model="question.correctOption" class="correct-radio" />
                <input type="text" v-model="question.options[optIndex]" class="form-control option-input" placeholder="Enter option text" required />
                <button type="button" class="remove-option" @click="removeOption(index, optIndex)" :disabled="question.options.length <= 2">
                  <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
              <AppButton type="button" variant="outline" size="sm" @click="addOption(index)" :disabled="question.options.length >= 6">
                Add Option
              </AppButton>
            </div>

            <div v-if="question.type === 'truefalse'" class="options-section">
              <label class="form-label">Correct Answer *</label>
              <div class="truefalse-options">
                <label class="radio-option" :class="{selected: question.correctAnswer === true}">
                  <input type="radio" :name="'tf-' + index" :value="true" v-model="question.correctAnswer" class="hidden-radio" />
                  <span>True</span>
                </label>
                <label class="radio-option" :class="{selected: question.correctAnswer === false}">
                  <input type="radio" :name="'tf-' + index" :value="false" v-model="question.correctAnswer" class="hidden-radio" />
                  <span>False</span>
                </label>
              </div>
            </div>

            <div v-if="question.type === 'short'" class="form-group mt-3">
              <label class="form-label">Expected Answer *</label>
              <textarea v-model="question.expectedAnswer" class="form-control" rows="2" placeholder="Enter expected answer" required></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <AppButton type="button" variant="outline" @click="$emit('cancel')">Cancel</AppButton>
        <AppButton type="submit" :disabled="!canCreateQuiz || creating">
           <span v-if="creating" class="btn-loading-content">
             <AppSpinner size="sm" color="light" /> Creating...
           </span>
           <span v-else>Create Quiz</span>
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script>
// Script remains functionally identical, ensuring 'modules' are fetched or passed
import { ref, computed, onMounted } from 'vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppSpinner from '../../components/reusable/AppSpinner.vue'
import api from '@/api/api'

export default {
  name: 'ManualQuizCreation',
  components: { AppButton, AppSpinner },
  emits: ['quiz-created', 'cancel'],
  setup(props, { emit }) {
    const creating = ref(false)
    const modules = ref([])
    const isLoadingModules = ref(false)
    const quizData = ref({ title: '', moduleId: '', duration: 30, questions: [{ text: '', type: 'multiple', points: 1, options: ['', ''], correctOption: 0, correctAnswer: true, expectedAnswer: '' }] })

    onMounted(async () => {
      isLoadingModules.value = true
      try {
        const response = await api.get('/assigned-modules')
        modules.value = response.data
      } catch (error) { console.error(error) } 
      finally { isLoadingModules.value = false }
    })

    const canCreateQuiz = computed(() => {
      const hasBasicInfo = quizData.value.title && quizData.value.moduleId
      const hasValidQuestions = quizData.value.questions.length > 0 && quizData.value.questions.every(q => {
        if (!q.text.trim() || !q.points || q.points < 1) return false
        if (q.type === 'multiple') return q.options.length >= 2 && q.options.every(opt => opt.trim()) && q.correctOption !== null
        else if (q.type === 'truefalse') return q.correctAnswer !== null
        else if (q.type === 'short') return q.expectedAnswer.trim()
        return false
      })
      return hasBasicInfo && hasValidQuestions
    })

    const addQuestion = () => { quizData.value.questions.push({ text: '', type: 'multiple', points: 1, options: ['', ''], correctOption: 0, correctAnswer: true, expectedAnswer: '' }) }
    const removeQuestion = (index) => { if (quizData.value.questions.length > 1) quizData.value.questions.splice(index, 1) }
    const handleQuestionTypeChange = (index) => {
      const question = quizData.value.questions[index]
      if (question.type === 'multiple') { question.options = ['', '']; question.correctOption = 0 }
      else if (question.type === 'truefalse') { question.options = []; question.correctAnswer = true }
      else if (question.type === 'short') { question.options = []; question.expectedAnswer = '' }
    }
    const addOption = (qIndex) => { if (quizData.value.questions[qIndex].options.length < 6) quizData.value.questions[qIndex].options.push('') }
    const removeOption = (qIndex, oIndex) => { 
        if (quizData.value.questions[qIndex].options.length > 2) {
            quizData.value.questions[qIndex].options.splice(oIndex, 1)
            if (quizData.value.questions[qIndex].correctOption >= oIndex) quizData.value.questions[qIndex].correctOption = Math.max(0, quizData.value.questions[qIndex].correctOption - 1)
        }
    }

    const createQuiz = async () => {
      if (!canCreateQuiz.value) return
      creating.value = true
      try {
        const payload = {
          title: quizData.value.title,
          module_course_assignment_id: quizData.value.moduleId,
          duration_minutes: parseInt(quizData.value.duration) || 30, 
          questions: quizData.value.questions.map(q => ({
            text: q.text, type: q.type, points: parseInt(q.points) || 1,
            options: q.type === 'multiple' ? q.options : [],
            correctOption: q.type === 'multiple' ? (parseInt(q.correctOption) || 0) : null,
            correctAnswer: q.type === 'truefalse' ? q.correctAnswer : null,
            expectedAnswer: q.type === 'short' ? q.expectedAnswer : null
          }))
        }
        const response = await api.post('/lecturer/quizzes', payload)
        creating.value = false
        emit('quiz-created', response.data.quiz)
      } catch (error) {
        creating.value = false
        alert('Failed to create quiz.')
      }
    }

    return { quizData, modules, creating, canCreateQuiz, addQuestion, removeQuestion, handleQuestionTypeChange, addOption, removeOption, createQuiz }
  }
}
</script>

<style scoped>
.manual-quiz-creation { max-height: 80vh; overflow-y: auto; padding: 5px; }
.form-section { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--gray-light); }
.form-section h3 { margin-bottom: 20px; color: var(--dark-color); border-bottom: 2px solid var(--primary-color); padding-bottom: 5px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.grid { display: grid; gap: 20px; }
.grid-2 { grid-template-columns: 1fr 1fr; }
.form-group { margin-bottom: 20px; }
.form-label { display: block; margin-bottom: 6px; font-weight: 600; color: var(--dark-color); }
.form-control { width: 100%; padding: 10px; border: 1px solid var(--gray-light); border-radius: 8px; transition: 0.2s; }
.form-control:focus { border-color: var(--primary-color); outline: none; }

.questions-list { display: flex; flex-direction: column; gap: 20px; }
.question-card { background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid var(--gray-light); }
.question-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.question-header h4 { margin: 0; color: var(--primary-dark); }
.remove-btn, .remove-option { background: #fee2e2; border: none; padding: 6px; border-radius: 4px; cursor: pointer; color: #dc2626; transition: 0.2s; }
.remove-btn:hover:not(:disabled) { background: #dc2626; color: white; }
.remove-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.options-section { margin-top: 15px; }
.option-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.correct-radio { margin: 0; }
.option-input { flex: 1; }

.truefalse-options { display: flex; gap: 20px; }
.radio-option { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 10px 20px; border: 1px solid var(--gray-light); border-radius: 8px; background: white; }
.radio-option.selected { border-color: var(--primary-color); background: var(--primary-soft); font-weight: 600; color: var(--primary-dark); }
.hidden-radio { display: none; }

.action-buttons { display: flex; gap: 10px; justify-content: flex-end; padding-top: 20px; border-top: 1px solid var(--gray-light); }
.btn-loading-content { display: flex; align-items: center; gap: 8px; }

@media (max-width: 768px) {
  .grid-2 { grid-template-columns: 1fr; }
}
</style>