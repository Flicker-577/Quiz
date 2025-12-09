<template>
  <div class="lecturer-results">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Results & Grading</h1>
          <div class="title-decoration"></div>
        </div>
        <p class="page-subtitle">Track student performance, view average scores, and manage grading</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline" @click="exportToExcel">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
          Export Excel
        </button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="stat-card">
        <div class="stat-icon primary">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value" v-if="!loading">{{ stats.totalStudents || 0 }}</span>
          <div v-else class="skeleton-shimmer" style="width: 40px; height: 24px; border-radius: 4px;"></div>
          <span class="stat-label">Enrolled Students</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon secondary">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value" v-if="!loading">{{ stats.totalQuizzes || 0 }}</span>
          <div v-else class="skeleton-shimmer" style="width: 40px; height: 24px; border-radius: 4px;"></div>
          <span class="stat-label">Total Quizzes</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value" v-if="!loading">{{ stats.avgScore || 0 }}%</span>
          <div v-else class="skeleton-shimmer" style="width: 40px; height: 24px; border-radius: 4px;"></div>
          <span class="stat-label">Global Avg</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value" v-if="!loading">{{ stats.passRate || 0 }}%</span>
          <div v-else class="skeleton-shimmer" style="width: 40px; height: 24px; border-radius: 4px;"></div>
          <span class="stat-label">Pass Rate</span>
        </div>
      </div>
    </div>

    <div class="filters-section">
      <div class="filter-card">
        <div class="filter-group search-group">
          <div class="search-wrapper">
            <svg viewBox="0 0 24 24" width="20" height="20" class="search-icon" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="search-input" 
              placeholder="Search by module code or name..." 
            />
            <div class="search-border"></div>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Semester</label>
          <div class="select-wrapper">
            <select v-model="selectedSemester" class="form-select">
              <option value="all">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
            <svg viewBox="0 0 24 24" width="16" height="16" class="select-arrow" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <div class="filter-group toggle-group">
          <label class="toggle-label">
            <span>Group by Session</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="groupBySession" />
              <span class="toggle-slider"></span>
            </label>
          </label>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-skeleton">
      <div v-for="n in 2" :key="n" class="skeleton-group">
        <div class="skeleton-header">
          <div class="skeleton-title skeleton-shimmer"></div>
        </div>
        <div class="modules-grid skeleton-grid">
          <div v-for="k in 3" :key="k" class="skeleton-card">
            <div class="skeleton-card-header skeleton-shimmer"></div>
            <div class="skeleton-card-content">
              <div class="skeleton-line skeleton-shimmer" style="width: 70%"></div>
              <div class="skeleton-line skeleton-shimmer" style="width: 40%"></div>
              <div class="skeleton-line skeleton-shimmer mt-4" style="width: 100%; height: 40px"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredModules.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 64 64" width="80" height="80" fill="none">
          <path d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z" stroke="var(--gray-light)" stroke-width="3"/>
          <path d="M32 24V32M32 40H32.02" stroke="var(--gray-light)" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </div>
      <h3 class="empty-title">No modules found</h3>
      <p class="empty-text">Try adjusting your search filters.</p>
    </div>

    <div v-else>
      <div v-if="groupBySession" class="session-groups">
        <div v-for="group in groupedModulesBySession" :key="group.session_name" class="session-group">
          <div class="session-header">
            <div class="session-title-wrapper">
              <h2 class="session-title">{{ group.session_name }}</h2>
              <div class="session-badges">
                <span v-if="group.is_current" class="badge current-session">
                  <svg viewBox="0 0 24 24" width="12" height="12" class="badge-icon" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  Current Session
                </span>
                <span v-else class="badge archived-session">Archived</span>
              </div>
            </div>
            <span class="module-count">{{ group.modules.length }} module{{ group.modules.length !== 1 ? 's' : '' }}</span>
          </div>

          <div class="modules-grid">
            <div v-for="module in group.modules" :key="module.id" class="module-card" @click="openModuleResults(module)">
              <div class="card-decoration" :style="getSemesterGradient(module.semester)"></div>
              
              <div class="card-content">
                <div class="card-header">
                  <span class="module-code">{{ module.code }}</span>
                  <span class="semester-indicator" :class="`sem-${module.semester}`">Sem {{ module.semester }}</span>
                </div>

                <h3 class="module-name" :title="module.name">{{ module.name }}</h3>
                
                <div class="module-info">
                  <div class="info-item">
                     <svg viewBox="0 0 24 24" width="16" height="16" class="info-icon" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" fill="currentColor"/></svg>
                     <span class="info-text">{{ module.course_name }}</span>
                  </div>
                  <div class="info-item">
                     <svg viewBox="0 0 24 24" width="16" height="16" class="info-icon" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/> <circle cx="12" cy="7" r="4"/></svg>
                     <span class="info-text">Year {{ module.year }}</span>
                  </div>
                </div>

                <div class="module-stats">
                  <div class="stat-item">
                    <span class="stat-value" :class="getScoreColor(module.avg_score)">{{ module.avg_score }}%</span>
                    <span class="stat-label">Avg Score</span>
                  </div>
                  <div class="stat-divider"></div>
                  <div class="stat-item">
                    <span class="stat-value">{{ module.student_count }}</span>
                    <span class="stat-label">Students</span>
                  </div>
                </div>

                <button class="card-action-btn" @click.stop="openModuleResults(module)">
                  <span>View Results</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" class="action-icon" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="modules-grid">
         <div v-for="module in filteredModules" :key="module.id" class="module-card" @click="openModuleResults(module)">
            <div class="card-decoration" :style="getSemesterGradient(module.semester)"></div>
            <div class="card-content">
               <div class="card-header">
                  <span class="badge" style="background:var(--light-color); color:var(--gray-dark); border:1px solid var(--gray-light)">{{ module.academic_session }}</span>
                  <span class="semester-indicator" :class="`sem-${module.semester}`">Sem {{ module.semester }}</span>
               </div>
               <h3 class="module-name">{{ module.name }}</h3>
               <div class="module-info simple">
                  <div class="info-item">
                     <span class="module-code">{{ module.code }}</span>
                     <span class="course-name">{{ module.course_name }}</span>
                  </div>
               </div>
               <div class="module-stats mt-auto">
                  <div class="stat-item"><span class="stat-value" :class="getScoreColor(module.avg_score)">{{ module.avg_score }}%</span><span class="stat-label">Avg</span></div>
                  <div class="stat-divider"></div>
                  <div class="stat-item"><span class="stat-value">{{ module.student_count }}</span><span class="stat-label">Students</span></div>
               </div>
               <button class="card-action-btn outline mt-3" @click.stop="openModuleResults(module)">
                 <span>View Details</span>
               </button>
            </div>
         </div>
      </div>
    </div>

    <AppModal
      :show="!!selectedModule"
      :title="`Results: ${selectedModule?.name}`"
      width="900px"
      @close="selectedModule = null"
    >
      <div v-if="selectedModule">
        <div class="modal-header-info">
          <div class="module-meta">
            <span class="meta-item">{{ selectedModule.code }}</span>
            <span class="meta-item">{{ selectedModule.academic_session }}</span>
            <span class="meta-item">Semester {{ selectedModule.semester }}</span>
          </div>
        </div>

        <div class="section-header">
          <h3>Quiz Performance</h3>
          <p class="section-description">Detailed breakdown of assessments in this module</p>
        </div>
        
        <div class="quizzes-results-grid">
          <div v-for="quiz in moduleQuizzes" :key="quiz.id" class="quiz-result-card">
            <div class="quiz-result-header">
              <h4 class="quiz-title">{{ quiz.title }}</h4>
              <span class="quiz-status" :class="quiz.status">{{ quiz.status }}</span>
            </div>
            
            <div class="quiz-stats">
              <div class="quiz-stat">
                <span class="stat-label">Attempts</span>
                <span class="stat-value">{{ getQuizAttempts(quiz.id).length }}</span>
              </div>
              <div class="quiz-stat">
                <span class="stat-label">Avg Score</span>
                <span :class="['stat-value', getScoreColor(getQuizAvgScore(quiz.id))]">
                  {{ getQuizAvgScore(quiz.id) }}%
                </span>
              </div>
              <div class="quiz-stat">
                <span class="stat-label">Total Marks</span>
                <span class="stat-value">{{ quiz.total_marks }}</span>
              </div>
            </div>

            <div class="quiz-actions">
              <button class="btn btn-outline" @click="viewQuizQuestions(quiz)">
                Questions
              </button>
              <button class="btn btn-primary" @click="openQuizResults(quiz)">
                View Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppModal>

    <QuizQuestionsModal :show="showQuizQuestionsModal" :quiz="selectedQuiz" @close="showQuizQuestionsModal = false" />
    <QuizResultsModal :show="showQuizResultsModal" :quiz="selectedQuiz" @close="showQuizResultsModal = false" />

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AppModal from '../../components/reusable/AppModal.vue'
import QuizQuestionsModal from '../../components/lecturer/QuizQuestionsModal.vue'
import QuizResultsModal from '../../components/lecturer/QuizResultsModal.vue'
import api from '@/api/api'

export default {
  name: 'LecturerResults',
  components: { AppModal, QuizQuestionsModal, QuizResultsModal },
  setup() {
    // --- State ---
    const modules = ref([])
    const stats = ref({ totalStudents: 0, totalQuizzes: 0, avgScore: 0, passRate: 0 })
    const loading = ref(true)
    
    // Filters
    const selectedSemester = ref('all')
    const searchQuery = ref('')
    const groupBySession = ref(true)

    // Modal State
    const selectedModule = ref(null)
    const selectedQuiz = ref(null)
    const moduleQuizzes = ref([])
    const showQuizQuestionsModal = ref(false)
    const showQuizResultsModal = ref(false)
    
    const quizzesCache = ref([]) 

    // --- API Fetch ---
    const fetchDashboardData = async () => {
        loading.value = true
        try {
            const res = await api.get('/lecturer/dashboard-results')
            if (res.data.success) {
                modules.value = res.data.modules
                stats.value = res.data.kpis
            }
        } catch (error) {
            console.error('Failed to load results dashboard:', error)
        } finally {
            setTimeout(() => loading.value = false, 500)
        }
    }

    const fetchModuleDetails = async (moduleId) => {
       try {
          const res = await api.get(`/lecturer/modules/${moduleId}/quizzes`)
          if(res.data.success) {
             moduleQuizzes.value = res.data.quizzes
             res.data.quizzes.forEach(q => {
                if(!quizzesCache.value.find(c => c.id === q.id)) {
                   quizzesCache.value.push(q)
                }
             })
          }
       } catch(e) { console.error(e) }
    }

    // --- Computed Properties ---
    const filteredModules = computed(() => {
      let data = modules.value || []

      if (selectedSemester.value !== 'all') {
        data = data.filter(m => m.semester === parseInt(selectedSemester.value))
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        data = data.filter(m => 
          m.name.toLowerCase().includes(query) || 
          m.code.toLowerCase().includes(query) ||
          m.course_name.toLowerCase().includes(query)
        )
      }

      return data
    })

    const groupedModulesBySession = computed(() => {
      const groups = {}
      filteredModules.value.forEach(module => {
        const sessionName = module.academic_session || 'Unknown Session'
        if (!groups[sessionName]) {
          groups[sessionName] = {
            session_name: sessionName,
            is_current: module.is_current_session,
            modules: []
          }
        }
        groups[sessionName].modules.push(module)
      })

      return Object.values(groups).sort((a, b) => {
        if (a.is_current) return -1
        if (b.is_current) return 1
        return b.session_name.localeCompare(a.session_name)
      })
    })

    // --- Helpers ---
    const getSemesterGradient = (sem) => {
       return sem == 1 
         ? { background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))' } 
         : { background: 'linear-gradient(135deg, var(--secondary-color), var(--secondary-dark))' }
    }

    const getScoreColor = (score) => {
       if(score >= 80) return 'text-success'
       if(score >= 50) return 'text-primary'
       return 'text-danger'
    }

    const getQuizAttempts = (quizId) => [] 
    const getQuizAvgScore = (quizId) => 0 

    // --- Actions ---
    const openModuleResults = async (module) => {
      selectedModule.value = module
      await fetchModuleDetails(module.id)
    }

    const viewQuizQuestions = (quiz) => {
      selectedQuiz.value = quiz
      showQuizQuestionsModal.value = true
    }

    const openQuizResults = (quiz) => {
      selectedQuiz.value = quiz
      showQuizResultsModal.value = true
    }

    const exportToExcel = () => alert('Export functionality...')

    onMounted(fetchDashboardData)

    return {
      modules, stats, loading,
      selectedSemester, searchQuery, groupBySession,
      filteredModules, groupedModulesBySession,
      selectedModule, selectedQuiz, moduleQuizzes,
      showQuizQuestionsModal, showQuizResultsModal,
      getSemesterGradient, getScoreColor, getQuizAttempts, getQuizAvgScore,
      openModuleResults, viewQuizQuestions, openQuizResults, exportToExcel
    }
  }
}
</script>

<style scoped>
/* Core Layout */
.lecturer-results { padding: var(--spacing-lg); max-width: 1400px; margin: 0 auto; }

/* Page Header (Matches Modules.vue) */
.page-header { display: flex; justify-content: space-between; margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-lg); border-bottom: 1px solid var(--gray-light); }
.page-title { font-size: 2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); margin-top: 0.5rem; }
.header-actions { display: flex; align-items: center; }

/* KPI Grid (Styled like Stat Cards in Modules.vue) */
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.secondary { background: var(--secondary-soft); color: var(--secondary-color); }
.stat-icon.success { background: var(--success-soft); color: var(--success-color); }
.stat-icon.warning { background: rgba(248, 150, 30, 0.15); color: var(--warning-color); }
.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: var(--dark-color); line-height: 1.2; }
.stat-label { font-size: 0.8rem; text-transform: uppercase; color: var(--gray-color); }

/* Filters (Matches Modules.vue) */
.filters-section { margin-bottom: var(--spacing-xl); }
.filter-card { display: grid; grid-template-columns: 1fr auto auto; gap: 1.5rem; padding: 1.5rem; background: white; border-radius: var(--border-radius-lg); border: 1px solid var(--gray-light); box-shadow: var(--shadow-sm); align-items: end; }
.search-wrapper { position: relative; }
.search-input { width: 100%; padding: 12px 16px 12px 48px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); font-size: 0.95rem; }
.search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--gray-color); }
.filter-label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--gray-dark); display: block; margin-bottom: 0.5rem; }
.form-select { padding: 12px 40px 12px 16px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); background: white; cursor: pointer; min-width: 180px; }
.select-wrapper { position: relative; }
.select-arrow { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--gray-color); }

/* Toggle */
.toggle-label { display: flex; align-items: center; justify-content: space-between; gap: 1rem; cursor: pointer; }
.toggle-switch { position: relative; width: 48px; height: 24px; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; inset: 0; background-color: var(--gray-light); transition: .4s; border-radius: 24px; }
.toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
input:checked + .toggle-slider { background: var(--gradient-primary); }
input:checked + .toggle-slider:before { transform: translateX(24px); }

/* Sessions & Modules */
.session-group { margin-bottom: 3rem; }
.session-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--gray-light); padding-bottom: 1rem; }
.session-title { font-size: 1.5rem; font-weight: 700; color: var(--dark-color); margin: 0; margin-right: 1rem; }
.session-title-wrapper { display: flex; align-items: center; }
.badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.current-session { background: var(--success-soft); color: var(--success-dark); border: 1px solid var(--success-light); }
.archived-session { background: var(--gray-light); color: var(--gray-dark); }
.module-count { font-size: 0.9rem; color: var(--gray-color); }

.modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }

/* Module Card (Exact Twin of Modules.vue) */
.module-card { background: white; border-radius: var(--border-radius-lg); border: 1px solid var(--gray-light); overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s ease; cursor: pointer; height: 100%; }
.module-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--primary-light); }
.card-decoration { height: 4px; width: 100%; }
.card-content { padding: 1.5rem; display: flex; flex-direction: column; flex: 1; }
.card-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
.module-code { font-weight: 700; background: var(--primary-soft); color: var(--primary-dark); padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; }
.semester-indicator { font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; }
.sem-1 { background: rgba(100, 181, 246, 0.1); color: var(--primary-dark); }
.sem-2 { background: rgba(206, 147, 216, 0.1); color: var(--secondary-dark); }
.module-name { font-size: 1.2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 1rem; line-height: 1.4; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }

.module-info { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
.info-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--gray-color); }
.info-icon { color: var(--primary-color); }

.module-stats { display: flex; background: var(--light-color); border-radius: 8px; padding: 0.8rem; margin-top: auto; margin-bottom: 1.5rem; }
.stat-item { flex: 1; text-align: center; display: flex; flex-direction: column; }
.stat-divider { width: 1px; background: var(--gray-light); }
.text-success { color: var(--success-color); }
.text-primary { color: var(--primary-color); }
.text-danger { color: var(--danger-color); }

.card-action-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: var(--gradient-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.card-action-btn:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
.card-action-btn.outline { background: transparent; border: 2px solid var(--primary-color); color: var(--primary-color); }
.card-action-btn.outline:hover { background: var(--primary-soft); }

/* Skeleton */
.skeleton-shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.skeleton-card { height: 300px; background: white; border-radius: 12px; border: 1px solid var(--gray-light); overflow: hidden; }
.skeleton-card-header { height: 4px; width: 100%; }
.skeleton-card-content { padding: 1.5rem; }
.skeleton-line { height: 12px; border-radius: 6px; margin-bottom: 1rem; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* Empty State */
.empty-state { text-align: center; padding: 4rem 2rem; color: var(--gray-color); }
.empty-icon { color: var(--gray-light); margin-bottom: 1.5rem; }
.empty-title { font-size: 1.25rem; color: var(--dark-color); margin-bottom: 0.5rem; }

/* Modal Inner */
.modal-header-info { margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-light); }
.module-meta { display: flex; gap: 1rem; }
.meta-item { background: var(--light-color); padding: 4px 12px; border-radius: 12px; font-size: 0.9rem; color: var(--gray-dark); }
.section-header h3 { font-size: 1.2rem; color: var(--dark-color); margin: 0 0 5px 0; }
.section-description { color: var(--gray-color); font-size: 0.9rem; }

.quizzes-results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.quiz-result-card { background: white; border: 1px solid var(--gray-light); border-radius: 12px; padding: 1rem; box-shadow: var(--shadow-sm); }
.quiz-result-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
.quiz-title { font-weight: 600; color: var(--dark-color); margin: 0; }
.quiz-status { font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; background: var(--light-color); color: var(--gray-dark); }
.quiz-status.published { background: var(--success-soft); color: var(--success-dark); }

.quiz-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-bottom: 1rem; }
.quiz-stat { background: var(--light-color); padding: 8px; border-radius: 8px; text-align: center; }
.quiz-actions { display: flex; gap: 8px; }
.quiz-actions .btn { flex: 1; padding: 6px; font-size: 0.8rem; }

/* Responsive */
@media (max-width: 768px) {
  .filter-card { grid-template-columns: 1fr; }
  .session-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .module-count { margin-top: 0.5rem; }
}
</style>