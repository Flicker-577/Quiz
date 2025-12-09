<template>
  <div class="manual-quiz-creation">
    <form @submit.prevent="createQuiz">
      <!-- Basic Information -->
      <div class="form-section">
        <h3>Basic Information</h3>
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label">Quiz Title *</label>
            <input
              v-model="quizData.title"
              type="text"
              class="form-control"
              placeholder="Enter quiz title"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">Module *</label>
            <select v-model="quizData.moduleId" class="form-control" required>
              <option value="">Select Module</option>
              <option
                v-for="module in modules"
                :key="module.id"
                :value="module.id"
              >
                {{ module.name }} ({{ module.code }})
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="form-section">
        <div class="section-header">
          <h3>Questions</h3>
          <AppButton type="button" @click="addQuestion">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Question
          </AppButton>
        </div>

        <div class="questions-list">
          <div
            v-for="(question, index) in quizData.questions"
            :key="index"
            class="question-card"
          >
            <div class="question-header">
              <h4>Question {{ index + 1 }}</h4>
              <button
                type="button"
                class="remove-btn"
                @click="removeQuestion(index)"
                :disabled="quizData.questions.length === 1"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div class="form-group">
              <label class="form-label">Question Text *</label>
              <textarea
                v-model="question.text"
                class="form-control"
                rows="3"
                placeholder="Enter your question"
                required
              ></textarea>
            </div>

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
              <input
                v-model="question.points"
                type="number"
                class="form-control"
                min="1"
                max="10"
                required
              />
            </div>

            <!-- Options for Multiple Choice -->
            <div v-if="question.type === 'multiple'" class="options-section">
              <div class="options-header">
                <label class="form-label">Options *</label>
                <span class="options-hint">Select the correct answer</span>
              </div>
              <div
                v-for="(option, optIndex) in question.options"
                :key="optIndex"
                class="option-row"
              >
                <input
                  type="radio"
                  :name="'correct-' + index"
                  :value="optIndex"
                  v-model="question.correctOption"
                  class="correct-radio"
                />
                <input
                  type="text"
                  v-model="question.options[optIndex]"
                  class="form-control option-input"
                  placeholder="Enter option text"
                  required
                />
                <button
                  type="button"
                  class="remove-option"
                  @click="removeOption(index, optIndex)"
                  :disabled="question.options.length <= 2"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
              <AppButton
                type="button"
                variant="outline"
                @click="addOption(index)"
                :disabled="question.options.length >= 6"
              >
                Add Option
              </AppButton>
            </div>

            <!-- Options for True/False -->
            <div v-if="question.type === 'truefalse'" class="options-section">
              <label class="form-label">Correct Answer *</label>
              <div class="truefalse-options">
                <label class="radio-option">
                  <input
                    type="radio"
                    :name="'tf-' + index"
                    :value="true"
                    v-model="question.correctAnswer"
                  />
                  <span>True</span>
                </label>
                <label class="radio-option">
                  <input
                    type="radio"
                    :name="'tf-' + index"
                    :value="false"
                    v-model="question.correctAnswer"
                  />
                  <span>False</span>
                </label>
              </div>
            </div>

            <!-- Answer for Short Answer -->
            <div v-if="question.type === 'short'" class="form-group">
              <label class="form-label">Expected Answer *</label>
              <textarea
                v-model="question.expectedAnswer"
                class="form-control"
                rows="2"
                placeholder="Enter expected answer"
                required
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <AppButton type="button" variant="outline" @click="$emit('cancel')">
          Cancel
        </AppButton>
        <AppButton
          type="submit"
          :loading="creating"
          :disabled="!canCreateQuiz"
        >
          Create Quiz
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AppButton from '../../components/reusable/AppButton.vue'
import api from '@/api/api' // Ensure this path matches your project structure

export default {
  name: 'ManualQuizCreation',
  components: { AppButton },
  // We no longer rely on props for modules, we fetch them to ensure latest data
  emits: ['quiz-created', 'cancel'],
  setup(props, { emit }) {
    const creating = ref(false)
    const modules = ref([])
    const isLoadingModules = ref(false)

    const quizData = ref({
      title: '',
      moduleId: '', // This maps to module_course_assignment_id
      duration: 30, // Default duration, or add an input field for this
      questions: [
        {
          text: '',
          type: 'multiple',
          points: 1,
          options: ['', ''],
          correctOption: 0,
          correctAnswer: true,
          expectedAnswer: ''
        }
      ]
    })

    // Fetch modules on mount
    onMounted(async () => {
      isLoadingModules.value = true
      try {
        // Defined in api.php: Route::get('/assigned-modules', ...)
        const response = await api.get('/assigned-modules')
        modules.value = response.data
      } catch (error) {
        console.error('Failed to load modules:', error)
      } finally {
        isLoadingModules.value = false
      }
    })

    const totalPoints = computed(() => {
      return quizData.value.questions.reduce((total, question) => {
        return total + (parseInt(question.points) || 0)
      }, 0)
    })

    const canCreateQuiz = computed(() => {
      const hasBasicInfo = quizData.value.title && quizData.value.moduleId
      
      const hasValidQuestions = quizData.value.questions.length > 0 && 
                              quizData.value.questions.every(q => {
                                if (!q.text.trim() || !q.points || q.points < 1) return false
                                
                                if (q.type === 'multiple') {
                                  return q.options.length >= 2 && 
                                         q.options.every(opt => opt.trim()) && 
                                         q.correctOption !== null
                                } else if (q.type === 'truefalse') {
                                  return q.correctAnswer !== null
                                } else if (q.type === 'short') {
                                  return q.expectedAnswer.trim()
                                }
                                return false
                              })
      
      return hasBasicInfo && hasValidQuestions
    })

    const addQuestion = () => {
      quizData.value.questions.push({
        text: '',
        type: 'multiple',
        points: 1,
        options: ['', ''],
        correctOption: 0,
        correctAnswer: true,
        expectedAnswer: ''
      })
    }

    const removeQuestion = (index) => {
      if (quizData.value.questions.length > 1) {
        quizData.value.questions.splice(index, 1)
      }
    }

    const handleQuestionTypeChange = (index) => {
      const question = quizData.value.questions[index]
      
      // Reset question-specific data when type changes
      if (question.type === 'multiple') {
        question.options = ['', '']
        question.correctOption = 0
        question.correctAnswer = null
        question.expectedAnswer = ''
      } else if (question.type === 'truefalse') {
        question.options = []
        question.correctOption = null
        question.correctAnswer = true
        question.expectedAnswer = ''
      } else if (question.type === 'short') {
        question.options = []
        question.correctOption = null
        question.correctAnswer = null
        question.expectedAnswer = ''
      }
    }

    const addOption = (questionIndex) => {
      if (quizData.value.questions[questionIndex].options.length < 6) {
        quizData.value.questions[questionIndex].options.push('')
      }
    }

    const removeOption = (questionIndex, optionIndex) => {
      if (quizData.value.questions[questionIndex].options.length > 2) {
        quizData.value.questions[questionIndex].options.splice(optionIndex, 1)
        // Adjust correct option if needed
        if (quizData.value.questions[questionIndex].correctOption >= optionIndex) {
          quizData.value.questions[questionIndex].correctOption =
            Math.max(0, quizData.value.questions[questionIndex].correctOption - 1)
        }
      }
    }

    const createQuiz = async () => {
      if (!canCreateQuiz.value) return

      creating.value = true

      try {
        // --- SAFEGUARDING DATA TYPES ---
        const payload = {
          title: quizData.value.title,
          module_course_assignment_id: quizData.value.moduleId,
          duration_minutes: parseInt(quizData.value.duration) || 30, 
          questions: quizData.value.questions.map(q => {
            
            // Helper: Force value to integer, default to 0 if logic fails
            const safeOption = parseInt(q.correctOption);
            const finalOption = isNaN(safeOption) ? 0 : safeOption;

            // Helper: Force points to integer, default to 1
            const safePoints = parseInt(q.points);
            const finalPoints = isNaN(safePoints) ? 1 : safePoints;

            return {
              text: q.text,
              type: q.type,
              points: finalPoints, // Uses the safe integer
              options: q.type === 'multiple' ? q.options : [], // Send empty array if not multiple
              
              // THE FIX: Use the safe finalOption variable
              correctOption: q.type === 'multiple' ? finalOption : null,
              
              correctAnswer: q.type === 'truefalse' ? q.correctAnswer : null,
              expectedAnswer: q.type === 'short' ? q.expectedAnswer : null
            };
          })
        }

        // DEBUG: Uncomment this line to see exactly what is being sent in your browser console (F12)
        console.log('Sending Payload:', JSON.stringify(payload, null, 2)); 

        const response = await api.post('/lecturer/quizzes', payload)

        creating.value = false
        emit('quiz-created', response.data.quiz)
        
      } catch (error) {
        creating.value = false
        console.error('Error creating quiz:', error)
        
        if (error.response && error.response.status === 422) {
             const errors = error.response.data.errors;
             // Get the first error message available
             const firstField = Object.keys(errors)[0];
             const firstMessage = errors[firstField][0];
             alert(`Validation Error: ${firstMessage}`);
        } else {
             alert('Failed to create quiz. Please check your inputs.');
        }
      }
    }

    return {
      quizData,
      modules, // Now returning the fetched modules
      creating,
      totalPoints,
      canCreateQuiz,
      addQuestion,
      removeQuestion,
      handleQuestionTypeChange,
      addOption,
      removeOption,
      createQuiz
    }
  }
}
</script>

<style scoped>
.manual-quiz-creation {
  max-height: 80vh;
  overflow-y: auto;
  padding: var(--spacing-sm);
}

.form-section {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-lg);
  border: 1px solid var(--gray-light);
}

.form-section h3 {
  margin-bottom: var(--spacing-lg);
  color: var(--dark-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: var(--spacing-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-header h3 {
  margin: 0;
  border: none;
  padding: 0;
}

.grid {
  display: grid;
  gap: var(--spacing-lg);
}

.grid-2 {
  grid-template-columns: 1fr 1fr;
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  color: var(--dark-color);
}

.form-control {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--gray-light);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.question-card {
  background: var(--light-color);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--gray-light);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.question-header h4 {
  margin: 0;
  color: var(--primary-dark);
}

.remove-btn {
  background: var(--danger-soft);
  border: none;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  color: var(--danger-color);
  transition: all 0.3s ease;
}

.remove-btn:hover:not(:disabled) {
  background: var(--danger-color);
  color: white;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.options-section {
  margin-top: var(--spacing-md);
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.options-hint {
  font-size: var(--font-size-sm);
  color: var(--gray-color);
}

.option-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.correct-radio {
  margin: 0;
}

.option-input {
  flex: 1;
}

.remove-option {
  background: none;
  border: none;
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  color: var(--danger-color);
  transition: background-color 0.3s ease;
}

.remove-option:hover:not(:disabled) {
  background: var(--danger-soft);
}

.remove-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.truefalse-options {
  display: flex;
  gap: var(--spacing-lg);
}

.radio-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--gray-light);
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }

  .option-row {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: stretch;
  }

  .truefalse-options {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .action-buttons {
    flex-direction: column;
  }

  .options-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>