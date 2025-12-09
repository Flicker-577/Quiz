<template>
  <AppModal :show="show" :title="`Manage Questions: ${quiz?.title}`" width="800px" @close="$emit('close')">
    <div class="questions-manager">
      
      <div v-if="loading" class="text-center p-5">
        <div class="spinner"></div>
        <p class="mt-3" style="color: var(--gray-dark)">Loading questions...</p>
      </div>
      
      <div v-else>
        <div class="toolbar mb-3">
           <span class="text-dark font-weight-bold">
             Total Questions: <strong style="color: var(--primary-dark)">{{ localQuestions.length }}</strong>
           </span>
           <AppButton size="sm" @click="addNewQuestion">+ Add New Question</AppButton>
        </div>

        <div v-if="localQuestions.length === 0" class="alert alert-warning text-center">
          <p class="mb-1">No questions found for this quiz.</p>
          <small>Click <strong>+ Add New Question</strong> above to get started.</small>
        </div>

        <div v-else class="questions-list-scroll">
          <div v-for="(question, index) in localQuestions" :key="index" class="card q-card">
            
            <div v-if="editingIndex !== index">
              <div class="card-header q-header">
                <div class="q-title">
                  <span class="q-number">Q{{ index + 1 }}</span>
                  <span class="badge">{{ getTypeName(question.type) }}</span>
                  <span class="points">({{ question.points }} pts)</span>
                </div>
                <div class="actions">
                  <button class="icon-btn edit" title="Edit" @click="startEditing(index)">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button class="icon-btn delete" title="Delete" @click="removeQuestion(index)">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
              
              <div class="q-body">
                <p class="q-text">{{ question.text || '(No question text)' }}</p>
                
                <div v-if="question.type === 'multiple'" class="preview-opts mt-2">
                   <div v-for="(opt, i) in question.options" :key="i" class="preview-opt" :class="{correct: i === question.correctOption}">
                      <span class="opt-label">{{ String.fromCharCode(65+i) }}.</span> {{ opt }}
                   </div>
                </div>
                
                <div v-else class="preview-ans mt-2">
                   <strong>Correct Answer:</strong> 
                   <span :class="question.correctAnswer ? 'text-success' : 'text-danger'" class="font-weight-bold ml-2">
                     {{ question.correctAnswer ? 'True' : 'False' }}
                   </span>
                </div>
              </div>
            </div>

            <div v-else class="edit-form">
               <div class="grid grid-2 mb-3">
                  <div class="form-group mb-0">
                     <label class="form-label">Type</label>
                     <select v-model="tempQuestion.type" class="form-control">
                        <option value="multiple">Multiple Choice</option>
                        <option value="truefalse">True/False</option>
                     </select>
                  </div>
                  <div class="form-group mb-0">
                     <label class="form-label">Points</label>
                     <input type="number" v-model="tempQuestion.points" class="form-control" min="1">
                  </div>
               </div>

               <div class="form-group">
                  <label class="form-label">Question Text</label>
                  <textarea v-model="tempQuestion.text" class="form-control" rows="2"></textarea>
               </div>

               <div v-if="tempQuestion.type === 'multiple'" class="options-container">
                  <label class="form-label">Options <small style="color: var(--gray-color)">(Select radio for correct answer)</small></label>
                  <div class="options-list">
                    <div v-for="(opt, i) in tempQuestion.options" :key="i" class="opt-row">
                       <div class="custom-radio-wrapper">
                         <input type="radio" :value="i" v-model="tempQuestion.correctOption" name="correctOpt">
                       </div>
                       <input type="text" v-model="tempQuestion.options[i]" class="form-control sm-control">
                       <button class="icon-btn delete" @click="removeOption(i)" v-if="tempQuestion.options.length > 2">×</button>
                    </div>
                  </div>
                  <button class="btn-text mt-2" @click="addOption">+ Add Option</button>
               </div>
               
               <div v-if="tempQuestion.type === 'truefalse'" class="options-container">
                  <label class="form-label">Correct Answer</label>
                  <div class="tf-options">
                    <label class="tf-card" :class="{ selected: tempQuestion.correctAnswer === true }">
                        <input type="radio" :value="true" v-model="tempQuestion.correctAnswer" class="hidden-radio"> 
                        <span class="tf-text">True</span>
                    </label>
                    <label class="tf-card" :class="{ selected: tempQuestion.correctAnswer === false }">
                        <input type="radio" :value="false" v-model="tempQuestion.correctAnswer" class="hidden-radio"> 
                        <span class="tf-text">False</span>
                    </label>
                  </div>
               </div>

               <div class="edit-footer">
                  <AppButton variant="outline" size="sm" @click="cancelEdit">Cancel</AppButton>
                  <AppButton size="sm" @click="saveEdit(index)">Update Question</AppButton>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <template #footer>
       <div class="modal-footer">
         <AppButton variant="outline" @click="$emit('close')">Close</AppButton>
         <AppButton @click="saveAll" :loading="saving">Save All Changes</AppButton>
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
  name: 'QuizQuestionsEditModal',
  components: { AppModal, AppButton, AppSpinner },
  props: { show: Boolean, quiz: Object },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const loading = ref(false)
    const saving = ref(false)
    const localQuestions = ref([])
    const editingIndex = ref(-1)
    const tempQuestion = ref(null)

    const getTypeName = (type) => {
      if (type === 'multiple') return 'Multiple Choice';
      return 'True/False';
    }

    // --- 1. Load Data ---
    watch(() => props.show, async (val) => {
      if (val && props.quiz) {
        loading.value = true
        editingIndex.value = -1
        try {
           const res = await api.get(`/lecturer/quizzes/${props.quiz.id}`)
           const questionsData = res.data.questions || [];

           localQuestions.value = questionsData.map(q => {
              let isTrue = false;
              if (typeof q.correct_answer === 'boolean') isTrue = q.correct_answer;
              else if (typeof q.correct_answer === 'string') isTrue = q.correct_answer.toLowerCase() === 'true';
              
              const safeType = q.question_type === 'multiple_choice' ? 'multiple' : 'truefalse';

              return {
                id: q.id, 
                text: q.question_text || '',
                type: safeType,
                points: q.marks || 1,
                options: q.options || [], 
                correctOption: (q.options && q.correct_answer) ? q.options.indexOf(q.correct_answer) : 0, 
                correctAnswer: isTrue 
              }
           })
        } catch (e) { 
           console.error("Error loading questions:", e) 
           alert("Failed to load questions.")
        } finally { 
           loading.value = false 
        }
      }
    })

    // --- 2. Watcher for Type Change ---
    watch(() => tempQuestion.value?.type, (newType) => {
        if (newType === 'truefalse') {
            if (typeof tempQuestion.value.correctAnswer !== 'boolean') {
                tempQuestion.value.correctAnswer = true;
            }
        } else if (newType === 'multiple') {
            if (!tempQuestion.value.options || tempQuestion.value.options.length === 0) {
                tempQuestion.value.options = ['Option 1', 'Option 2'];
                tempQuestion.value.correctOption = 0;
            }
        }
    })

    const startEditing = (index) => {
       editingIndex.value = index
       tempQuestion.value = JSON.parse(JSON.stringify(localQuestions.value[index]))
    }

    const cancelEdit = () => { editingIndex.value = -1; tempQuestion.value = null }
    
    const saveEdit = (index) => {
       if (!tempQuestion.value.text) { alert("Question text required"); return; }
       localQuestions.value[index] = tempQuestion.value
       cancelEdit()
    }

    const removeQuestion = (index) => { 
      if(confirm("Delete this question?")) localQuestions.value.splice(index, 1) 
    }

    const addNewQuestion = () => {
       localQuestions.value.push({
          text: 'New Question', 
          type: 'multiple', 
          points: 1, 
          options: ['Option 1','Option 2'], 
          correctOption: 0,
          correctAnswer: true
       })
       startEditing(localQuestions.value.length - 1)
    }

    const addOption = () => tempQuestion.value.options.push('')
    const removeOption = (i) => tempQuestion.value.options.splice(i, 1)

    const saveAll = async () => {
       saving.value = true
       try {
          const payload = localQuestions.value.map(q => {
             if (q.type === 'multiple' && !q.options) q.options = [];
             return q;
          });

          await api.put(`/lecturer/quizzes/${props.quiz.id}/questions`, {
             questions: payload
          })
          emit('save')
          emit('close')
       } catch (e) {
          console.error(e)
          alert('Failed to save changes')
       } finally {
          saving.value = false
       }
    }

    return { 
       loading, saving, localQuestions, editingIndex, tempQuestion,
       startEditing, cancelEdit, saveEdit, removeQuestion, addNewQuestion, 
       addOption, removeOption, saveAll, getTypeName
    }
  }
}
</script>

<style scoped>
/* Reuse Global Variables */
.questions-list-scroll { 
  max-height: 60vh; 
  overflow-y: auto; 
  padding-right: var(--spacing-sm); 
}

/* Card Specific Overrides */
.q-card {
  padding: 0; /* Reset default card padding for custom header */
  overflow: hidden;
  border-left: 4px solid transparent;
  transition: transform 0.2s ease;
}

.q-card:hover {
  transform: translateY(-2px);
  border-left-color: var(--primary-color);
}

/* Header */
.q-header {
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: var(--spacing-md);
  background-color: var(--light-color);
  border-bottom: 1px solid var(--gray-light);
  margin-bottom: 0;
}

.q-title { display: flex; align-items: center; gap: var(--spacing-sm); }

.q-number {
  font-weight: 700;
  color: var(--dark-color);
  font-size: var(--font-size-lg);
}

.badge { 
  background: var(--primary-soft); 
  color: var(--primary-dark); 
  padding: 2px 8px; 
  border-radius: var(--border-radius-xl); 
  font-size: var(--font-size-xs); 
  text-transform: uppercase; 
  font-weight: 600;
}

.points { color: var(--gray-color); font-size: var(--font-size-sm); font-weight: 500; }

.q-body {
  padding: var(--spacing-md);
}

.q-text {
  font-size: var(--font-size-base);
  color: var(--dark-color);
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
}

/* Actions */
.actions { display: flex; gap: var(--spacing-xs); }
.icon-btn { background: none; border: none; cursor: pointer; padding: 4px; color: var(--gray-color); transition: color 0.2s; }
.icon-btn:hover { background: var(--gray-light); border-radius: var(--border-radius-sm); }
.icon-btn.edit:hover { color: var(--warning-color); }
.icon-btn.delete:hover { color: var(--danger-color); }

/* Preview Styles */
.preview-opts { display: flex; flex-direction: column; gap: var(--spacing-xs); }
.preview-opt { 
  display: flex; gap: 8px; 
  font-size: var(--font-size-sm); 
  color: var(--gray-dark); 
  padding: 6px 12px; 
  border-radius: var(--border-radius-sm); 
  border: 1px solid transparent;
}
.preview-opt.correct { 
  background: var(--success-soft); 
  color: var(--success-dark); 
  border-color: var(--success-light);
  font-weight: 500; 
}
.opt-label { font-weight: 600; color: var(--gray-color); }

/* Edit Form Styles */
.edit-form { padding: var(--spacing-md); background: var(--light-color); }

.options-container {
  background: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--gray-light);
  margin-bottom: var(--spacing-md);
}

.opt-row { display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm); align-items: center; }
.sm-control { padding: var(--spacing-xs) var(--spacing-sm); }

.btn-text {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: var(--font-size-sm);
}

/* True/False Cards */
.tf-options { display: flex; gap: var(--spacing-md); }
.tf-card { 
  flex: 1;
  display: flex; 
  align-items: center; 
  justify-content: center;
  gap: 8px; 
  cursor: pointer; 
  padding: var(--spacing-md); 
  border: 2px solid var(--gray-light); 
  border-radius: var(--border-radius-md); 
  background: white; 
  transition: all 0.2s; 
}
.tf-card:hover { border-color: var(--primary-light); }
.tf-card.selected { 
  border-color: var(--primary-color); 
  background: var(--primary-soft);
  color: var(--primary-dark);
  font-weight: 700;
}
.hidden-radio { display: none; }

.edit-footer { display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.modal-footer { display: flex; justify-content: flex-end; gap: var(--spacing-sm); padding-top: var(--spacing-md); border-top: 1px solid var(--gray-light); }
.toolbar { display: flex; justify-content: space-between; align-items: center; }
</style>