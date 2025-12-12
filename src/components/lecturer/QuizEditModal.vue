<template>
  <AppModal :show="show" title="Edit Quiz Details" width="700px" @close="$emit('close')">
    <form @submit.prevent="saveChanges" class="edit-form" v-if="localQuiz">
      <div class="form-group">
        <label class="form-label">Quiz Title</label>
        <input type="text" v-model="localQuiz.title" class="form-control" required>
      </div>

      <div class="form-group">
        <label class="form-label">Module</label>
        <select v-model="localQuiz.moduleId" class="form-control">
          <option v-for="mod in modules" :key="mod.id" :value="mod.id">{{ mod.name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea v-model="localQuiz.description" rows="4" class="form-control" placeholder="Enter quiz instructions..."></textarea>
      </div>
    </form>

    <template #footer>
      <div class="modal-actions centered">
        <AppButton variant="outline" @click="$emit('close')">Cancel</AppButton>
        <AppButton variant="primary" :disabled="saving" @click="saveChanges">
           <span v-if="saving" class="btn-loading-content">
             <AppSpinner size="sm" color="light" /> Saving...
           </span>
           <span v-else>Save Changes</span>
        </AppButton>
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
  name: 'QuizEditModal',
  components: { AppModal, AppButton, AppSpinner },
  props: { show: Boolean, quiz: Object, modules: Array },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const localQuiz = ref(null)
    const saving = ref(false)

    watch(() => props.quiz, (newVal) => {
      if (newVal) {
        localQuiz.value = JSON.parse(JSON.stringify(newVal))
        if (!localQuiz.value.description) localQuiz.value.description = ""
        if (newVal.moduleId) localQuiz.value.moduleId = newVal.moduleId
      }
    }, { immediate: true })

    const saveChanges = async () => {
      saving.value = true
      try {
        const payload = { title: localQuiz.value.title, module_course_assignment_id: localQuiz.value.moduleId, description: localQuiz.value.description }
        const response = await api.put(`/lecturer/quizzes/${props.quiz.id}`, payload)
        emit('save', response.data.quiz) 
      } catch (error) { alert("Failed to update quiz settings.") } 
      finally { saving.value = false }
    }

    return { localQuiz, saving, saveChanges }
  }
}
</script>

<style scoped>
.edit-form { display: flex; flex-direction: column; gap: 15px; }
.form-group { margin-bottom: 15px; }
.form-label { display: block; margin-bottom: 5px; font-weight: 600; color: var(--dark-color); }
.form-control { width: 100%; padding: 10px; border: 1px solid var(--gray-light); border-radius: 8px; }
.modal-actions.centered { display: flex; justify-content: flex-end; gap: 10px; }
.btn-loading-content { display: flex; align-items: center; gap: 8px; }
</style>