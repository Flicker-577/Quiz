<template>
  <div class="ai-quiz-generation">
    <div class="generation-steps">
      
      <div class="step" :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-content">
          <h4>Materials & Module</h4>
          <div v-if="currentStep === 1" class="step-form">
            <div class="form-group">
              <label class="form-label">Target Module</label>
              <select v-model="generationData.moduleId" class="form-control" required>
                <option value="">Select Module</option>
                <option v-for="mod in modules" :key="mod.id" :value="mod.id">
                  {{ mod.name }} ({{ mod.code }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Lecture Notes (PDF, DOCX, TXT)</label>
              
              <div 
                class="drop-zone"
                :class="{ 'is-dragover': dragOver, 'has-files': uploadedFiles.length > 0 }"
                @dragover.prevent="dragOver = true"
                @dragleave.prevent="dragOver = false"
                @drop.prevent="handleFileDrop"
                @click="triggerFileInput"
              >
                <input ref="fileInput" type="file" multiple accept=".pdf,.doc,.docx,.txt" class="hidden-input" @change="handleFileSelect" />
                
                <div v-if="uploadedFiles.length === 0" class="empty-state">
                  <div class="icon-bg">
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" fill="none" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  <p class="primary-text">Click or drag lecture notes here</p>
                  <p class="sub-text">AI will extract text and ignore images automatically.</p>
                </div>

                <div v-else class="files-preview">
                  <div v-for="(file, index) in uploadedFiles" :key="index" class="file-chip" @click.stop>
                    <div class="chip-icon">
                      <span v-if="file.name.endsWith('.pdf')" class="type-pdf">PDF</span>
                      <span v-else-if="file.name.match(/\.doc(x)?$/)" class="type-doc">DOC</span>
                      <span v-else class="type-txt">TXT</span>
                    </div>
                    <div class="chip-info">
                      <span class="name" :title="file.name">{{ truncateName(file.name) }}</span>
                      <span class="size">{{ formatFileSize(file.size) }}</span>
                    </div>
                    <button class="remove-btn" @click="removeFile(index)">&times;</button>
                  </div>
                  <button class="add-more-btn" @click.stop="triggerFileInput">+ Add More</button>
                </div>
              </div>
            </div>

            <div class="step-actions">
              <AppButton @click="nextStep" :disabled="!canProceedToStep2">Next Step</AppButton>
            </div>
          </div>
        </div>
      </div>

      <div class="step" :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }">
        <div class="step-number">2</div>
        <div class="step-content">
          <h4>Quiz Settings</h4>
          <div v-if="currentStep === 2" class="step-form">
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label">Quiz Title</label>
                <input v-model="generationData.title" class="form-control" placeholder="e.g. Chapter 4 Quiz" />
              </div>
              <div class="form-group">
                <label class="form-label">Difficulty</label>
                <select v-model="generationData.difficulty" class="form-control">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Number of Questions</label>
              <div class="count-selector-group">
                <button type="button" class="count-btn" :class="{ active: generationData.questionCount === 10 }" @click="generationData.questionCount = 10">10</button>
                <button type="button" class="count-btn" :class="{ active: generationData.questionCount === 20 }" @click="generationData.questionCount = 20">20</button>
                <button type="button" class="count-btn" :class="{ active: generationData.questionCount === 30 }" @click="generationData.questionCount = 30">30</button>
                
                <div class="custom-count-input">
                  <input type="number" v-model.number="generationData.questionCount" placeholder="Custom" min="1" max="50" class="form-control sm-input" :class="{ 'active-border': ![10, 20, 30].includes(generationData.questionCount) }" />
                  <span class="input-suffix">Qs</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Question Types</label>
              <div class="type-selector">
                <label class="type-card" :class="{active: generationData.questionTypes.includes('multiple')}">
                  <input type="checkbox" value="multiple" v-model="generationData.questionTypes" class="hidden-cb">
                  <span class="check-icon"></span>
                  <span>Multiple Choice</span>
                </label>
                <label class="type-card" :class="{active: generationData.questionTypes.includes('truefalse')}">
                  <input type="checkbox" value="truefalse" v-model="generationData.questionTypes" class="hidden-cb">
                  <span class="check-icon"></span>
                  <span>True / False</span>
                </label>
              </div>
            </div>

            <div class="step-actions">
              <AppButton variant="outline" @click="prevStep">Back</AppButton>
              <AppButton @click="nextStep" :disabled="!canProceedToStep3">Generate Quiz</AppButton>
            </div>
          </div>
        </div>
      </div>

      <div class="step" :class="{ 'active': currentStep === 3 }">
        <div class="step-number">3</div>
        <div class="step-content">
          <h4>Review Generated Questions</h4>
          <div v-if="currentStep === 3" class="step-form">
            
            <div v-if="generating" class="loader-state">
              <AppLoader size="lg" />
              <h5 class="mt-3">Analyzing Documents...</h5>
              <p>Extracting text and generating {{ generationData.questionCount }} questions.</p>
            </div>

            <div v-else class="results-state">
              <div class="questions-container">
                <div v-for="(q, index) in generatedQuestions" :key="index" class="q-card">
                  
                  <div v-if="editingIndex !== index">
                    <div class="q-head">
                      <span class="q-badge">{{ q.type }}</span>
                      <div class="q-actions">
                        <button class="icon-btn edit" @click="startEditing(index)">Edit</button>
                        <button class="icon-btn delete" @click="removeQuestion(index)">Remove</button>
                      </div>
                    </div>
                    <p class="q-text">{{ q.text }}</p>
                    
                    <div v-if="q.type === 'multiple'" class="q-opts">
                      <div v-for="(opt, i) in q.options" :key="i" class="opt" :class="{correct: i === q.correctOption}">
                        {{ opt }}
                      </div>
                    </div>
                    <div v-else class="q-ans">
                      Answer: {{ q.type === 'truefalse' ? (q.correctAnswer ? 'True' : 'False') : q.expectedAnswer }}
                    </div>
                  </div>

                  <div v-else class="edit-mode">
                    <textarea v-model="tempQuestion.text" class="form-control" rows="2"></textarea>
                    
                    <div v-if="tempQuestion.type === 'multiple'" class="edit-opts">
                      <div v-for="(opt, i) in tempQuestion.options" :key="i" class="edit-row">
                        <input type="radio" :value="i" v-model="tempQuestion.correctOption">
                        <input type="text" v-model="tempQuestion.options[i]" class="form-control sm">
                      </div>
                    </div>
                    
                    <div class="edit-tools">
                      <AppButton size="sm" variant="outline" @click="cancelEdit">Cancel</AppButton>
                      <AppButton size="sm" @click="saveEdit(index)">Save</AppButton>
                    </div>
                  </div>

                </div>
              </div>

              <div class="results-actions">
                <AppButton variant="outline" @click="prevStep">Back</AppButton>
                <AppButton variant="outline" @click="regenerateQuestions">Regenerate</AppButton>
                <AppButton @click="saveQuiz" :disabled="saving">
                   <span v-if="saving" class="btn-loading-content">
                     <AppSpinner size="sm" color="light" /> Saving...
                   </span>
                   <span v-else>Save to Library</span>
                </AppButton>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// Script remains identical to your upload, functionality is preserved.
import { ref, computed } from 'vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppLoader from '../../components/reusable/AppLoader.vue'
import AppSpinner from '../../components/reusable/AppSpinner.vue'
import api from '@/api/api'

export default {
  name: 'AIQuizGeneration',
  components: { AppButton, AppLoader, AppSpinner },
  props: { modules: { type: Array, default: () => [] } },
  emits: ['quiz-generated', 'cancel'],
  setup(props, { emit }) {
    // ... (Your existing logic) ...
    const currentStep = ref(1)
    const generating = ref(false)
    const saving = ref(false)
    const dragOver = ref(false)
    const fileInput = ref(null)
    const uploadedFiles = ref([])
    const generatedQuestions = ref([])
    const editingIndex = ref(-1)
    const tempQuestion = ref(null)
    const generationData = ref({moduleId: '', title: '', questionCount: 10, questionTypes: ['multiple'], difficulty: 'medium', focusAreas: ''})

    const canProceedToStep2 = computed(() => generationData.value.moduleId && uploadedFiles.value.length > 0)
    const canProceedToStep3 = computed(() => generationData.value.title.trim() && generationData.value.questionTypes.length > 0 && generationData.value.questionCount > 0)

    const triggerFileInput = () => fileInput.value?.click()
    const handleFileSelect = (e) => processFiles(Array.from(e.target.files))
    const handleFileDrop = (e) => { dragOver.value = false; processFiles(Array.from(e.dataTransfer.files)) }
    const processFiles = (files) => {
      const valid = files.filter(f => f.size < 10*1024*1024 && (f.name.match(/\.(pdf|txt|doc|docx)$/i)))
      uploadedFiles.value = [...uploadedFiles.value, ...valid]
      if(fileInput.value) fileInput.value.value = ''
    }
    const removeFile = (i) => uploadedFiles.value.splice(i, 1)
    
    const nextStep = () => {
      if (currentStep.value === 2) generateQuestions()
      else currentStep.value++
    }
    const prevStep = () => currentStep.value--

    const generateQuestions = async () => {
      generating.value = true
      currentStep.value = 3
      try {
        const fd = new FormData()
        uploadedFiles.value.forEach(f => fd.append('files[]', f))
        fd.append('config', JSON.stringify(generationData.value))
        const res = await api.post('/lecturer/ai/generate', fd)
        pollStatus(res.data.job_id)
      } catch (e) {
        alert('Failed to start generation')
        currentStep.value = 2
        generating.value = false
      }
    }

    const pollStatus = (jobId) => {
      const interval = setInterval(async () => {
        try {
          const res = await api.get(`/lecturer/ai/status/${jobId}`)
          if (res.data.status === 'completed') {
            clearInterval(interval)
            generatedQuestions.value = res.data.questions
            generating.value = false
          } else if (res.data.status === 'failed') {
            clearInterval(interval)
            alert(res.data.error)
            currentStep.value = 2
            generating.value = false
          }
        } catch (e) { console.error(e) }
      }, 2000)
    }

    const saveQuiz = async () => {
      saving.value = true
      try {
        const payload = { title: generationData.value.title, module_course_assignment_id: generationData.value.moduleId, questions: generatedQuestions.value, status: 'draft' }
        const res = await api.post('/lecturer/quizzes', payload)
        emit('quiz-generated', res.data.quiz)
      } catch (e) { alert('Save failed') } finally { saving.value = false }
    }

    const startEditing = (i) => { editingIndex.value = i; tempQuestion.value = JSON.parse(JSON.stringify(generatedQuestions.value[i])) }
    const cancelEdit = () => { editingIndex.value = -1; tempQuestion.value = null }
    const saveEdit = (i) => { generatedQuestions.value[i] = tempQuestion.value; cancelEdit() }
    const removeQuestion = (i) => generatedQuestions.value.splice(i, 1)
    const regenerateQuestions = () => generateQuestions()
    const truncateName = (n) => n.length > 20 ? n.substring(0,18)+'...' : n
    const formatFileSize = (b) => (b/1024).toFixed(1) + ' KB'

    return {
      currentStep, generating, saving, dragOver, fileInput, uploadedFiles, generationData,
      generatedQuestions, editingIndex, tempQuestion, canProceedToStep2, canProceedToStep3,
      triggerFileInput, handleFileSelect, handleFileDrop, removeFile, nextStep, prevStep,
      generateQuestions, saveQuiz, startEditing, cancelEdit, saveEdit, removeQuestion, regenerateQuestions,
      truncateName, formatFileSize
    }
  }
}
</script>

<style scoped>
/* Reuse variables from previous files for consistency */
.ai-quiz-generation { padding: 10px; max-height: 80vh; overflow-y: auto; }
.step { display: flex; gap: 20px; padding-bottom: 40px; position: relative; }
.step::before { content: ''; position: absolute; left: 19px; top: 40px; bottom: 0; width: 2px; background: #e5e7eb; z-index: 0; }
.step:last-child { padding-bottom: 0; }
.step:last-child::before { display: none; }
.step-number { width: 40px; height: 40px; border-radius: 50%; background: #f3f4f6; color: #9ca3af; font-weight: 700; display: flex; align-items: center; justify-content: center; z-index: 1; border: 2px solid white; transition: 0.3s; }
.step.active .step-number { background: var(--primary-color); color: white; box-shadow: 0 0 0 4px var(--primary-soft); }
.step.completed .step-number { background: var(--success-color); color: white; }
.step-content { flex: 1; }
.step-content h4 { margin: 8px 0 15px; color: var(--dark-color); }
.step-form { background: white; padding: 20px; border-radius: 12px; border: 1px solid var(--gray-light); }

.drop-zone { border: 2px dashed var(--gray-light); border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: 0.2s; background: #f9fafb; }
.drop-zone:hover, .drop-zone.is-dragover { border-color: var(--primary-color); background: var(--primary-soft); }
.hidden-input { display: none; }
.empty-state .icon-bg { width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--primary-color); }
.primary-text { font-weight: 600; color: var(--dark-color); margin: 0; }
.sub-text { font-size: 0.8rem; color: var(--gray-color); margin-top: 5px; }

.files-preview { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
.file-chip { background: white; padding: 10px; border-radius: 8px; border: 1px solid var(--gray-light); display: flex; align-items: center; gap: 10px; position: relative; }
.chip-icon span { font-size: 0.7rem; font-weight: 700; padding: 2px 4px; border-radius: 4px; }
.type-pdf { background: #fee2e2; color: #dc2626; }
.type-doc { background: #dbeafe; color: #2563eb; }
.type-txt { background: #f3f4f6; color: #4b5563; }
.chip-info { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
.chip-info .name { font-size: 0.85rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chip-info .size { font-size: 0.7rem; color: var(--gray-color); }
.remove-btn { background: none; border: none; font-size: 1.2rem; color: var(--gray-color); cursor: pointer; padding: 0 5px; }
.add-more-btn { border: 1px dashed var(--gray-light); background: none; border-radius: 8px; font-size: 0.9rem; color: var(--primary-color); cursor: pointer; }

.type-selector { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.type-card { border: 2px solid var(--gray-light); padding: 12px; border-radius: 8px; text-align: center; cursor: pointer; transition: 0.2s; position: relative; }
.type-card:hover { border-color: var(--primary-color); }
.type-card.active { border-color: var(--primary-color); background: var(--primary-soft); color: var(--primary-dark); font-weight: 600; }
.hidden-cb { display: none; }

.questions-container { display: flex; flex-direction: column; gap: 15px; margin-top: 15px; }
.q-card { background: #f9fafb; border: 1px solid var(--gray-light); padding: 15px; border-radius: 8px; }
.q-head { display: flex; justify-content: space-between; margin-bottom: 8px; }
.q-badge { background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
.q-actions button { background: none; border: none; font-size: 0.8rem; cursor: pointer; color: var(--gray-color); margin-left: 8px; }
.q-actions button:hover { color: var(--primary-color); }
.q-text { font-weight: 600; color: var(--dark-color); margin-bottom: 10px; }
.opt { padding: 6px 10px; background: white; border: 1px solid var(--gray-light); margin-bottom: 5px; border-radius: 6px; font-size: 0.9rem; }
.opt.correct { border-color: var(--success-color); background: var(--success-soft); color: var(--success-dark); }
.loader-state { text-align: center; padding: 40px; }

.count-selector-group { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.count-btn { border: 1px solid var(--gray-light); background: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: 0.2s; min-width: 50px; }
.count-btn:hover { border-color: var(--primary-color); color: var(--primary-color); }
.count-btn.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
.custom-count-input { display: flex; align-items: center; gap: 8px; position: relative; }
.sm-input { width: 80px; text-align: center; }
.active-border { border-color: var(--primary-color); box-shadow: 0 0 0 2px var(--primary-soft); }
.input-suffix { color: var(--gray-color); font-size: 0.9rem; font-weight: 500; }

.form-group { margin-bottom: 20px; }
.form-label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.9rem; color: var(--dark-color); }
.form-control { width: 100%; padding: 10px; border: 1px solid var(--gray-light); border-radius: 8px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.step-actions, .results-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #f3f4f6; }
.btn-loading-content { display: flex; align-items: center; gap: 8px; }
</style>