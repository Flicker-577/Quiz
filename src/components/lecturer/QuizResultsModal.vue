<template>
  <AppModal :show="show" :title="`Results: ${quiz?.title}`" width="700px" @close="$emit('close')">
    <div class="modal-content-scroll">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading results...</p>
      </div>

      <div v-else class="results-container">
        <div class="summary-bar">
          <div class="summary-item">
            <span>Class Average</span>
            <strong>{{ statistics.average_percentage || 0 }}%</strong>
          </div>
          <div class="summary-item">
            <span>Submissions</span>
            <strong>{{ statistics.total_attempts || 0 }}</strong>
          </div>
          <div class="summary-item">
            <span>Pass Rate</span>
            <strong :class="getPassRateClass(statistics.pass_rate)">
              {{ statistics.pass_rate || 0 }}%
            </strong>
          </div>
        </div>

        <AppTable :columns="columns" :data="attempts" hover>
          <template #student="{ item }">
            <div class="user-cell">
              <div class="avatar-xs">{{ getInitials(item.student.name) }}</div>
              <div class="user-info">
                <span class="text-sm font-weight-bold">{{ item.student.name }}</span>
                <small class="text-muted">{{ item.student.reg_number }}</small>
              </div>
            </div>
          </template>
          
          <template #score="{ item }">
            <span :class="['score-text', getScoreClass(item.percentage)]">
              {{ item.score }} / {{ item.total_marks }}
            </span>
          </template>
          
          <template #percentage="{ item }">
            <span :class="['score-text', getScoreClass(item.percentage)]">
              {{ item.percentage }}%
            </span>
          </template>

          <template #status="{ item }">
            <span class="status-badge" :class="item.passed ? 'passed' : 'failed'">
              {{ item.passed ? 'Passed' : 'Failed' }}
            </span>
          </template>
        </AppTable>

        <div v-if="attempts.length === 0" class="empty-state">
          <p>No attempts found for this quiz yet.</p>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script>
import { ref, watch, reactive } from 'vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppTable from '../../components/reusable/AppTable.vue'
import api from '@/api/api'

export default {
  name: 'QuizResultsModal',
  components: { AppModal, AppTable },
  props: {
    show: Boolean,
    quiz: Object
  },
  emits: ['close'],
  setup(props) {
    const attempts = ref([])
    const loading = ref(false)
    const statistics = ref({})

    const columns = [
      { key: 'student', label: 'Student', width: '40%' },
      { key: 'score', label: 'Score', align: 'center' },
      { key: 'percentage', label: '%', align: 'center' },
      { key: 'status', label: 'Status', align: 'center' }
    ]

    const fetchResults = async () => {
      if (!props.quiz?.id) return
      
      loading.value = true
      try {
         // Using the correct endpoint from your LecturerModuleController
         const response = await api.get(`/lecturer/quizzes/${props.quiz.id}/results`)
         
         if (response.data.success) {
            attempts.value = response.data.attempts
            statistics.value = response.data.statistics
         }
      } catch (error) {
         console.error("Failed to load quiz results:", error)
      } finally {
         loading.value = false
      }
    }

    watch(() => props.show, (isVisible) => {
      if (isVisible) {
        fetchResults()
      }
    })
    
    // --- Helpers ---
    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'

    const getScoreClass = (percentage) => {
      if (percentage >= 80) return 'high'
      if (percentage >= 50) return 'mid'
      return 'low'
    }

    const getPassRateClass = (rate) => {
      if (rate >= 70) return 'text-success'
      if (rate >= 50) return 'text-warning'
      return 'text-danger'
    }

    return { 
      attempts, 
      statistics, 
      columns, 
      loading, 
      getInitials, 
      getScoreClass,
      getPassRateClass 
    }
  }
}
</script>

<style scoped>
.modal-content-scroll {
  max-height: 70vh;
  overflow-y: auto;
  padding: 5px;
}

/* Summary Bar */
.summary-bar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-md);
  background: var(--light-color);
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.summary-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-item span {
  font-size: 0.8rem;
  color: var(--gray-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-item strong {
  font-size: 1.4rem;
  color: var(--dark-color);
}

/* Table Content */
.user-cell { display: flex; align-items: center; gap: 12px; }
.user-info { display: flex; flex-direction: column; line-height: 1.2; }
.avatar-xs { 
  width: 32px; height: 32px; background: var(--primary-soft); color: var(--primary-color); 
  border-radius: 50%; display: flex; align-items: center; justify-content: center; 
  font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
}
.text-muted { font-size: 0.75rem; color: var(--gray-color); }

.score-text { font-weight: 600; }
.score-text.high { color: var(--success-dark); }
.score-text.mid { color: var(--warning-dark); }
.score-text.low { color: var(--danger-dark); }

.status-badge {
  font-size: 0.7rem; font-weight: 600; padding: 4px 8px;
  border-radius: 12px; text-transform: uppercase;
}
.status-badge.passed { background: var(--success-soft); color: var(--success-dark); }
.status-badge.failed { background: var(--danger-soft); color: var(--danger-dark); }

.text-success { color: var(--success-color); }
.text-warning { color: var(--warning-color); }
.text-danger { color: var(--danger-color); }

/* Loading & Empty States */
.loading-state, .empty-state {
  text-align: center;
  padding: 40px;
  color: var(--gray-color);
}
.spinner {
  width: 30px; height: 30px; border: 3px solid var(--gray-light);
  border-top-color: var(--primary-color); border-radius: 50%;
  animation: spin 1s linear infinite; margin: 0 auto 10px;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>