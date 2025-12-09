<template>
  <AppModal
    :show="show"
    title="Edit Quiz Details"
    width="700px"
    @close="$emit('close')"
  >
    <form @submit.prevent="saveChanges" class="edit-form" v-if="localQuiz">
      <div class="form-group">
        <label class="form-label">Quiz Title</label>
        <input 
          type="text" 
          v-model="localQuiz.title" 
          class="form-control" 
          required
        >
      </div>

      <div class="form-group">
        <label class="form-label">Module</label>
        <select v-model="localQuiz.moduleId" class="form-control">
          <option v-for="mod in modules" :key="mod.id" :value="mod.id">
            {{ mod.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea 
          v-model="localQuiz.description" 
          rows="4" 
          class="form-control"
          placeholder="Enter quiz instructions..."
        ></textarea>
      </div>
    </form>

    <template #footer>
      <AppButton variant="outline" @click="$emit('close')">Cancel</AppButton>
      <AppButton variant="primary" :loading="saving" @click="saveChanges">Save Changes</AppButton>
    </template>
  </AppModal>
</template>

<script>
import { ref, watch } from 'vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppButton from '../../components/reusable/AppButton.vue'
import api from '@/api/api'

export default {
  name: 'QuizEditModal',
  components: { AppModal, AppButton },
  props: {
    show: Boolean,
    quiz: Object,
    modules: Array
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const localQuiz = ref(null)
    const saving = ref(false)

    watch(() => props.quiz, (newVal) => {
      if (newVal) {
        localQuiz.value = JSON.parse(JSON.stringify(newVal))
        if (!localQuiz.value.description) localQuiz.value.description = ""
        if (newVal.moduleId) {
            localQuiz.value.moduleId = newVal.moduleId
        }
      }
    }, { immediate: true })

    const saveChanges = async () => {
      saving.value = true
      try {
        const payload = {
          title: localQuiz.value.title,
          module_course_assignment_id: localQuiz.value.moduleId,
          // REMOVED: duration_minutes (Will be set when publishing)
          description: localQuiz.value.description
        }

        const response = await api.put(`/lecturer/quizzes/${props.quiz.id}`, payload)
        emit('save', response.data.quiz) 
      } catch (error) {
        console.error("Update failed", error)
        alert("Failed to update quiz settings.")
      } finally {
        saving.value = false
      }
    }

    return {
      localQuiz,
      saving,
      saveChanges
    }
  }
}
</script>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
    margin-bottom: 15px;
}
.form-label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
}
.form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>