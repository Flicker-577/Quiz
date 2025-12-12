<template>
  <AppModal :show="show" :title="`Publish Quiz: ${quiz?.title}`" width="500px" @close="$emit('close')">
    <div class="quiz-publish-form">
      <form @submit.prevent="publishQuiz">
        
        <div class="form-group">
          <label class="label">Start Time (EAT)</label>
          <input v-model="formData.startDateTime" type="datetime-local" class="input-field" required />
        </div>

        <div class="form-group">
          <label class="label">Duration (Minutes)</label>
          <input v-model.number="formData.duration" type="number" class="input-field" min="1" required />
        </div>

        <div class="form-group">
          <label class="label">End Time (Auto-calculated)</label>
          <input :value="calculatedEndTime" type="datetime-local" class="input-field readonly" readonly />
          <small class="hint">Quiz closes exactly after the duration.</small>
        </div>

        <div class="form-group">
          <label class="label">Passing Marks</label>
          <input v-model.number="formData.passingScore" type="number" class="input-field" min="0" required />
        </div>

        <div class="form-group">
          <label class="label">Instructions</label>
          <textarea v-model="formData.instructions" class="input-field textarea" rows="4" placeholder="Enter quiz instructions..."></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="publishing || !isFormValid">
            <span v-if="publishing" class="btn-loading-content">
               <AppSpinner size="sm" color="white" /> Publishing...
            </span>
            <span v-else>Publish Quiz</span>
          </button>
        </div>

      </form>
    </div>
  </AppModal>
</template>

<script>
import { ref, computed, watch } from 'vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppSpinner from '../../components/reusable/AppSpinner.vue'
import api from '@/api/api'

export default {
  name: 'QuizApprovalModal',
  components: { AppModal, AppSpinner },
  props: { show: Boolean, quiz: Object },
  emits: ['publish', 'close'],
  setup(props, { emit }) {
    const publishing = ref(false)
    const formData = ref({ startDateTime: '', duration: 30, passingScore: 50, instructions: '' })

    const toInputFormat = (date) => {
      const pad = (n) => n < 10 ? '0' + n : n;
      return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
    };

    const getEATTime = (date = new Date()) => {
       const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
       return new Date(utc + (3600000 * 3));
    }

    const calculatedEndTime = computed(() => {
      if (!formData.value.startDateTime || !formData.value.duration) return '';
      const start = new Date(formData.value.startDateTime);
      const end = new Date(start.getTime() + (formData.value.duration * 60000));
      return toInputFormat(end);
    })

    const isFormValid = computed(() => formData.value.startDateTime && formData.value.duration > 0 && formData.value.passingScore >= 0)

    watch(() => props.show, (isVisible) => {
      if (isVisible) {
        const nowEAT = getEATTime();
        formData.value.startDateTime = toInputFormat(nowEAT);
        if (props.quiz) {
           if (props.quiz.duration) formData.value.duration = parseInt(props.quiz.duration);
           if (props.quiz.passing_marks) formData.value.passingScore = props.quiz.passing_marks;
        }
      }
    })

    const publishQuiz = async () => {
      publishing.value = true;
      try {
        const payload = {
          status: 'published',
          start_time: formData.value.startDateTime,
          end_time: calculatedEndTime.value,
          duration_minutes: formData.value.duration,
          passing_marks: formData.value.passingScore,
          instructions: formData.value.instructions
        };
        const response = await api.put(`/lecturer/quizzes/${props.quiz.id}`, payload);
        emit('publish', response.data.quiz);
      } catch (error) { alert('Failed to publish quiz'); } finally { publishing.value = false; }
    };

    return { formData, publishing, calculatedEndTime, isFormValid, publishQuiz }
  }
}
</script>

<style scoped>
.quiz-publish-form { padding: 10px; }
.form-group { margin-bottom: 20px; }
.label { display: block; font-weight: 600; margin-bottom: 8px; color: var(--dark-color); font-size: 0.95rem; }
.input-field { width: 100%; padding: 10px 12px; border: 1px solid var(--gray-light); border-radius: 8px; font-size: 1rem; transition: border-color 0.2s; }
.input-field:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px var(--primary-soft); }
.input-field.readonly { background-color: #f3f4f6; color: var(--gray-color); cursor: not-allowed; }
.input-field.textarea { resize: vertical; min-height: 100px; }
.hint { display: block; margin-top: 5px; font-size: 0.8rem; color: var(--gray-color); }
.form-actions { margin-top: 30px; }
.btn-submit { width: 100%; padding: 12px; background-color: var(--primary-color); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; transition: background-color 0.2s; }
.btn-submit:hover:not(:disabled) { background-color: var(--primary-dark); }
.btn-submit:disabled { background-color: #93c5fd; cursor: not-allowed; }
.btn-loading-content { display: flex; align-items: center; gap: 8px; }
</style>