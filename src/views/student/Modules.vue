<template>
  <div class="student-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">My Learning Modules</h1>
        <div class="title-decoration"></div><br>
        <p class="page-subtitle">Access your course materials, quizzes, and track your progress</p>
      </div>
      <div class="header-controls">
        <div class="search-wrapper">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Find a module..." 
            class="search-input"
            :disabled="loading"
          >
        </div>
      </div>
    </div>

    <div v-if="loading" class="stats-row">
      <div v-for="i in 3" :key="i" class="stat-card">
        <div class="stat-icon skeleton-circle"></div>
        <div class="stat-info">
          <AppSkeleton type="text" width="60px" height="24px" />
          <AppSkeleton type="text" width="100px" height="16px" />
        </div>
      </div>
    </div>

    <div v-else class="stats-row">
      <div class="stat-card">
        <div class="stat-icon primary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div class="stat-info">
          <span class="value">{{ statistics?.total_modules || 0 }}</span>
          <span class="label">Enrolled Modules</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="stat-info">
          <span class="value">{{ attempts.length }}</span>
          <span class="label">Quizzes Completed</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="stat-info">
          <span class="value">{{ statistics?.total_available_quizzes || 0 }}</span>
          <span class="label">Available Quizzes</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="modules-grid">
      <div v-for="i in 3" :key="i" class="module-card skeleton-card">
        <div class="skeleton-accent"></div>
        <div class="card-body">
          <div class="module-top">
            <AppSkeleton type="text" width="80px" height="24px" />
            <AppSkeleton type="text" width="100px" height="24px" />
          </div>
          <div class="module-title-skeleton">
            <AppSkeleton type="text" width="70%" height="28px" />
          </div>
          <div class="lecturer-info-skeleton">
            <AppSkeleton type="circle" width="24px" height="24px" />
            <AppSkeleton type="text" width="120px" height="16px" />
          </div>
          <div class="description-skeleton">
            <AppSkeleton type="text" width="100%" height="16px" />
            <AppSkeleton type="text" width="90%" height="16px" />
            <AppSkeleton type="text" width="80%" height="16px" />
          </div>
          <div class="meta-skeleton">
            <AppSkeleton type="text" width="80px" height="16px" />
          </div>
          <div class="actions-skeleton">
            <AppSkeleton type="text" width="100%" height="36px" />
            <AppSkeleton type="text" width="100%" height="36px" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="error-container">
      <h3>Error Loading Modules</h3>
      <p>{{ error }}</p>
      <AppButton @click="fetchModules">Retry</AppButton>
    </div>

    <div v-else class="modules-grid">
      <div 
        v-for="module in filteredModules" 
        :key="module.id" 
        class="module-card"
      >
        <div class="card-accent" :class="getColorClass(module.id)"></div>
        
        <div class="card-body">
          <div class="module-top">
            <span class="module-code">{{ module.code || 'N/A' }}</span>
            <span v-if="module.availableQuizzes && module.availableQuizzes.length > 0" class="status-badge quiz-available">
              <span class="dot"></span> {{ module.availableQuizzes.length }} Quiz{{ module.availableQuizzes.length > 1 ? 'zes' : '' }}
            </span>
            <span v-else class="status-badge no-quiz">
              No Quizzes
            </span>
          </div>

          <h3 class="module-name">{{ module.name || 'Unnamed Module' }}</h3>
          
          <div class="lecturer-info">
            <div class="avatar">{{ getInitials(module.lecturer_name) }}</div>
            <span>{{ module.lecturer_name || 'Lecturer Unassigned' }}</span>
          </div>

          <div class="module-description">
            <p>{{ truncateDescription(module.description, 120) }}</p>
          </div>

          <div class="module-meta">
            <div class="meta-item">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{{ module.credits || 0 }} Credits</span>
            </div>
          </div>

          <div class="card-actions">
            <AppButton 
              variant="outline" 
              @click="openModuleDetails(module)"
              class="details-btn"
            >
              View Details
            </AppButton>
            
            <AppButton 
              v-if="module.availableQuizzes && module.availableQuizzes.length > 0"
              variant="primary" 
              @click="handleStartQuiz(module.availableQuizzes[0])"
              class="quiz-btn"
            >
              Take Quiz
            </AppButton>
          </div>
        </div>
      </div>
      
      <div v-if="!loading && (!modules || modules.length === 0)" class="empty-state-card">
        <h3>No Modules Found</h3>
        <p>You are not enrolled in any modules for this semester.</p>
      </div>
    </div>

    <AppModal 
      :show="showModuleModal" 
      :title="selectedModule?.name || 'Module Details'" 
      width="700px"
      @close="showModuleModal = false"
    >
      <div v-if="selectedModule" class="module-details">
        <div class="module-header">
          <div class="module-badge">
            <span class="code">{{ selectedModule.code || 'N/A' }}</span>
            <span class="credits">{{ selectedModule.credits || 0 }} Credits</span>
          </div>
          <div class="lecturer-details">
            <div class="lecturer-avatar">{{ getInitials(selectedModule.lecturer_name) }}</div>
            <div>
              <div class="lecturer-name">{{ selectedModule.lecturer_name || 'Unassigned' }}</div>
              <div class="lecturer-role">Module Lecturer</div>
            </div>
          </div>
        </div>

        <div class="module-content">
          <div class="description-section">
            <h3>Module Description</h3>
            <p>{{ selectedModule.description || 'No description available.' }}</p>
          </div>

          <div class="learning-objectives" v-if="selectedModule.learning_objectives && selectedModule.learning_objectives.length > 0">
            <h3>Learning Objectives</h3>
            <ul>
              <li v-for="(objective, index) in selectedModule.learning_objectives" :key="index">
                {{ objective }}
              </li>
            </ul>
          </div>

          <div class="quizzes-section">
            <h3>Available Quizzes</h3>
            <div v-if="selectedModule.availableQuizzes && selectedModule.availableQuizzes.length > 0" class="quizzes-list">
              <div 
                v-for="quiz in selectedModule.availableQuizzes" 
                :key="quiz.id"
                class="quiz-item"
              >
                <div class="quiz-info">
                  <div class="quiz-title">{{ quiz.title || 'Untitled Quiz' }}</div>
                  <div class="quiz-meta">
                    <span>{{ quiz.question_count || 0 }} questions</span>
                    <span>•</span>
                    <span>{{ quiz.duration_minutes || 0 }} mins</span>
                  </div>
                </div>
                <AppButton variant="primary" @click="handleStartQuiz(quiz)">
                  Start Quiz
                </AppButton>
              </div>
            </div>
            <div v-else class="no-quizzes">
              <p>No quizzes available for this module yet.</p>
            </div>
          </div>
        </div>
      </div>
    </AppModal>

    <AppModal 
      :show="showQuizModal" 
      full-screen 
      @close="handleQuizCloseRequest"
    >
      <QuizAttempt 
        v-if="showQuizModal" 
        @submit="handleQuizSubmit"
        @close="showQuizModal = false"
      />
    </AppModal>

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'
import QuizAttempt from '../../components/student/QuizAttempt.vue'
import { useStudentQuizStore } from '@/stores/studentQuizStore' // exact letters
import api from '@/api/api' 

export default {
  name: 'StudentModules',
  components: { AppButton, AppModal, AppSkeleton, QuizAttempt },
  setup() {
    const store = useStudentQuizStore()
    const searchQuery = ref('')
    const loading = ref(true)
    const error = ref(null)
    
    // Data
    const modules = ref([])
    const statistics = ref({})
    const attempts = ref([]) // [NEW] Added to store quiz history
    
    // Modal states
    const showModuleModal = ref(false)
    const selectedModule = ref(null)
    const showQuizModal = ref(false) 

    // --- Quiz Logic ---
    const handleStartQuiz = async (quiz) => {
      try {
        await store.startQuiz(quiz.id)
        showQuizModal.value = true
        showModuleModal.value = false
      } catch (err) {
        const msg = err.response?.data?.message || 'Cannot start quiz.'
        alert(msg)
        fetchModules()
      }
    }

    const handleQuizSubmit = () => {
      showQuizModal.value = false
      fetchModules() 
      fetchStatistics()
      fetchAttempts() // Update attempts count immediately
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleQuizCloseRequest = () => {
      if (store.status === 'running') {
        store.completeQuiz('Navigated Away')
      } else {
        showQuizModal.value = false
        fetchModules()
      }
    }

    // --- Data Fetching ---
    const fetchModules = async () => {
      try {
        loading.value = true
        error.value = null
        
        const response = await api.get('/student/modules')
        
        if (response.data.success) {
          modules.value = response.data.modules || []
          statistics.value = response.data.statistics || {}
        } else {
          throw new Error(response.data.message)
        }
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to load modules'
        modules.value = []
      } finally {
        loading.value = false
      }
    }

    const fetchStatistics = async () => {
      try {
        const response = await api.get('/student/statistics')
        if (response.data.success) statistics.value = response.data.statistics || {}
      } catch (e) { console.error(e) }
    }

    // [NEW] Fetch Quiz Attempts from the same API endpoint used in Assignments.vue
    const fetchAttempts = async () => {
      try {
        const res = await api.get('/student/quiz-attempts')
        attempts.value = res.data
      } catch (err) {
        console.error("Error loading attempts:", err)
      }
    }

    // --- Computed & Helpers ---
    const filteredModules = computed(() => {
      if (!modules.value.length) return []
      if (!searchQuery.value) return modules.value
      const q = searchQuery.value.toLowerCase()
      return modules.value.filter(m => 
        (m.name?.toLowerCase().includes(q)) || 
        (m.code?.toLowerCase().includes(q)) ||
        (m.lecturer_name?.toLowerCase().includes(q))
      )
    })

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??'
    const getColorClass = (id) => ['blue', 'purple', 'green', 'orange', 'pink', 'teal'][(id || 0) % 6]
    const truncateDescription = (text, len) => text ? (text.length <= len ? text : text.substring(0, len) + '...') : 'No description'
    
    const openModuleDetails = (module) => {
      selectedModule.value = module
      showModuleModal.value = true
    }

    onMounted(() => { 
      fetchModules()
      fetchStatistics() 
      fetchAttempts() // [NEW] Load attempts on mount
    })

    return {
      searchQuery, loading, error, modules, statistics, attempts,
      filteredModules, showModuleModal, selectedModule,
      showQuizModal,
      handleStartQuiz, handleQuizSubmit, handleQuizCloseRequest,
      getInitials, getColorClass, truncateDescription, openModuleDetails, fetchModules
    }
  }
}
</script>

<style scoped>
/* Reuse global styles */
.student-page { max-width: 1200px; margin: 0 auto; padding: var(--spacing-md); }
.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--spacing-xl); flex-wrap: wrap; gap: var(--spacing-md); }
.page-title { font-size: 2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); }
.header-controls { display: flex; align-items: center; }
.search-wrapper { position: relative; width: 300px; }
.search-wrapper svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-color); }
.search-input { width: 100%; padding: 10px 12px 10px 36px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); font-size: 0.9rem; transition: border-color 0.2s; }
.search-input:focus { outline: none; border-color: var(--primary-color); }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-lg); margin-bottom: var(--spacing-xl); }
.stat-card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); display: flex; align-items: center; gap: 16px; }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.success { background: var(--success-soft); color: var(--success-color); }
.stat-icon.warning { background: var(--warning-soft); color: var(--warning-color); }
.skeleton-circle { background: var(--gray-light); width: 48px; height: 48px; border-radius: 12px; animation: skeleton-loading 1.5s infinite; }
.stat-info { display: flex; flex-direction: column; gap: 4px; }
.stat-info .value { font-size: 1.5rem; font-weight: 700; color: var(--dark-color); line-height: 1; }
.stat-info .label { font-size: 0.8rem; color: var(--gray-color); margin-top: 4px; }

/* Modules Grid */
.modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--spacing-lg); }
.module-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); overflow: hidden; transition: all 0.3s ease; display: flex; flex-direction: column; }
.module-card:hover:not(.skeleton-card) { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--primary-light); }
.card-accent { height: 6px; width: 100%; }
.skeleton-accent { height: 6px; width: 100%; background: var(--gray-light); animation: skeleton-loading 1.5s infinite; }
.card-accent.blue { background: var(--primary-color); }
.card-accent.purple { background: var(--secondary-color); }
.card-accent.green { background: var(--success-color); }
.card-accent.orange { background: #ff9800; }
.card-accent.pink { background: #e91e63; }
.card-accent.teal { background: #009688; }
.card-body { padding: var(--spacing-lg); flex: 1; display: flex; flex-direction: column; }

.module-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.module-code { font-size: 0.75rem; font-weight: 700; background: var(--light-color); padding: 4px 8px; border-radius: 4px; color: var(--gray-dark); }
.status-badge { font-size: 0.7rem; padding: 4px 8px; border-radius: 12px; display: flex; align-items: center; gap: 4px; font-weight: 600; }
.status-badge.quiz-available { color: var(--success-dark); background: var(--success-soft); }
.status-badge.no-quiz { color: var(--gray-color); background: var(--gray-light); }
.dot { width: 6px; height: 6px; border-radius: 50%; }
.status-badge.quiz-available .dot { background: var(--success-color); }

.module-name { font-size: 1.2rem; font-weight: 700; color: var(--dark-color); margin: 0 0 12px 0; line-height: 1.4; }
.lecturer-info { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 0.85rem; color: var(--gray-color); }
.avatar { width: 24px; height: 24px; background: var(--gray-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: var(--gray-dark); flex-shrink: 0; }
.module-description { margin-bottom: 16px; flex: 1; }
.module-description p { font-size: 0.9rem; color: var(--gray-color); line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.module-meta { display: flex; gap: 16px; margin-bottom: 16px; }
.meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--gray-color); }

.card-actions { display: flex; gap: 8px; margin-top: auto; }
.card-actions .btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.85rem; padding: 8px 12px; }

/* Empty & Error */
.empty-state-card { grid-column: 1 / -1; text-align: center; padding: var(--spacing-xl); background: var(--light-color); border: 1px dashed var(--gray-light); border-radius: var(--border-radius-lg); color: var(--gray-color); }
.error-container { text-align: center; padding: 3rem; background: var(--light-color); border-radius: var(--border-radius-lg); margin-bottom: var(--spacing-xl); }
.error-container h3 { color: var(--danger-color); margin-bottom: 1rem; }

/* Module Details Modal */
.module-details { max-height: 70vh; overflow-y: auto; }
.module-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--gray-light); }
.module-badge { display: flex; flex-direction: column; gap: 8px; }
.module-badge .code { font-size: 1.1rem; font-weight: 700; color: var(--primary-color); background: var(--primary-soft); padding: 6px 12px; border-radius: 6px; width: fit-content; }
.module-badge .credits { font-size: 0.9rem; color: var(--gray-color); font-weight: 500; }
.lecturer-details { display: flex; align-items: center; gap: 12px; }
.lecturer-avatar { width: 40px; height: 40px; background: var(--secondary-soft); color: var(--secondary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
.lecturer-name { font-weight: 600; color: var(--dark-color); }
.lecturer-role { font-size: 0.8rem; color: var(--gray-color); }
.module-content { display: flex; flex-direction: column; gap: 24px; }
.module-content h3 { font-size: 1.1rem; font-weight: 600; color: var(--dark-color); margin-bottom: 12px; }
.description-section p { line-height: 1.6; color: var(--gray-dark); margin: 0; }
.learning-objectives ul { margin: 0; padding-left: 20px; }
.learning-objectives li { margin-bottom: 8px; line-height: 1.5; color: var(--gray-dark); }
.quizzes-list { display: flex; flex-direction: column; gap: 12px; }
.quiz-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--light-color); border-radius: var(--border-radius-md); border: 1px solid var(--gray-light); }
.quiz-info { flex: 1; }
.quiz-title { font-weight: 600; color: var(--dark-color); margin-bottom: 4px; }
.quiz-meta { display: flex; gap: 8px; font-size: 0.8rem; color: var(--gray-color); }
.no-quizzes { text-align: center; padding: 32px; color: var(--gray-color); background: var(--light-color); border-radius: var(--border-radius-md); border: 1px dashed var(--gray-light); }

@keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@media (max-width: 768px) { .header-controls, .search-wrapper { width: 100%; } .stats-row { grid-template-columns: 1fr; } .modules-grid { grid-template-columns: 1fr; } .module-header { flex-direction: column; gap: 16px; } .quiz-item { flex-direction: column; gap: 12px; align-items: flex-start; } .card-actions { flex-direction: column; } }
</style>