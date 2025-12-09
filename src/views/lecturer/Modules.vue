<template>
  <div class="lecturer-modules">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Teaching Modules</h1>
          <div class="title-decoration"></div>
        </div>
        <p class="page-subtitle">Manage your courses, quizzes, and student assessments across all academic sessions</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 17V7M9 7L5 11M9 7L13 11" stroke-linecap="round"/>
              <path d="M15 7V17M15 17L11 13M15 17L19 13" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalModules || 0 }}</span>
            <span class="stat-label">Total Modules</span>
          </div>
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
          <div class="skeleton-badge skeleton-shimmer"></div>
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

    <div v-else-if="!hasData" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 64 64" width="80" height="80" fill="none">
          <path d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z" 
                stroke="var(--gray-light)" stroke-width="3"/>
          <path d="M32 24V32M32 40H32.02" stroke="var(--gray-light)" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </div>
      <h3 class="empty-title">No modules found</h3>
      <p class="empty-text">Try adjusting your search filters or check back later</p>
      <button class="btn btn-outline" @click="resetFilters">
        Reset Filters
      </button>
    </div>

    <div v-else>
      <div v-if="groupBySession" class="session-groups">
        <div v-for="group in moduleData" :key="group.session_name" class="session-group">
          <div class="session-header">
            <div class="session-title-wrapper">
              <h2 class="session-title">{{ group.session_name }}</h2>
              <div class="session-badges">
                <span v-if="group.is_current" class="badge current-session">
                  <svg viewBox="0 0 24 24" width="12" height="12" class="badge-icon" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Current Session
                </span>
                <span v-else class="badge archived-session">Archived</span>
              </div>
            </div>
            <span class="module-count">{{ group.modules.length }} module{{ group.modules.length !== 1 ? 's' : '' }}</span>
          </div>

          <div class="modules-grid">
            <div v-for="module in group.modules" :key="module.id" class="module-card" @click="openModuleModal(module)">
              <div class="card-decoration" :style="getSemesterGradient(module.semester)"></div>
              <div class="card-content">
                <div class="card-header">
                  <span class="module-code">{{ module.code }}</span>
                  <span class="semester-indicator" :class="`sem-${module.semester}`">
                    Sem {{ module.semester }}
                  </span>
                </div>

                <h3 class="module-name" :title="module.name">{{ module.name }}</h3>
                
                <div class="module-info">
                  <div class="info-item">
                    <svg viewBox="0 0 24 24" width="16" height="16" class="info-icon" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" fill="currentColor"/>
                    </svg>
                    <span class="info-text">{{ module.course_name }}</span>
                  </div>
                  <div class="info-item">
                    <svg viewBox="0 0 24 24" width="16" height="16" class="info-icon" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span class="info-text">Year {{ module.year_of_study }}</span>
                  </div>
                </div>

                <div class="module-stats">
                  <div class="stat-item">
                    <span class="stat-value">{{ module.studentCount || 0 }}</span>
                    <span class="stat-label">Students</span>
                  </div>
                  <div class="stat-divider"></div>
                  <div class="stat-item">
                    <span class="stat-value">{{ module.quizCount || 0 }}</span>
                    <span class="stat-label">Quizzes</span>
                  </div>
                </div>

                <button class="card-action-btn" @click.stop="openModuleModal(module)">
                  <span>Manage Module</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" class="action-icon" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="modules-grid">
        <div v-for="module in moduleData" :key="module.id" class="module-card" @click="openModuleModal(module)">
          <div class="card-decoration" :style="getSemesterGradient(module.semester)"></div>
          <div class="card-content">
            <div class="card-header">
              <span class="badge session-badge">{{ module.academic_session_name }}</span>
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
               <div class="stat-item"><span class="stat-value">{{ module.studentCount }}</span><span class="stat-label">Students</span></div>
               <div class="stat-divider"></div>
               <div class="stat-item"><span class="stat-value">{{ module.quizCount }}</span><span class="stat-label">Quizzes</span></div>
            </div>

            <button class="card-action-btn outline mt-3" @click.stop="openModuleModal(module)">
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppModal
      :show="!!selectedModule"
      :title="selectedModule ? `Manage: ${selectedModule.name}` : ''"
      width="900px"
      @close="selectedModule = null"
    >
      <div v-if="selectedModule" class="manage-modal">
        <div class="modal-tabs-header">
          <button 
            v-for="tab in tabs" :key="tab.id"
            :class="['modal-tab', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="activeTab === 'quizzes'" class="modal-tab-content">
          <div v-if="moduleQuizzes.length === 0" class="empty-state small">
             <p>No quizzes created yet.</p>
          </div>
          <AppTable v-else :columns="quizColumns" :data="moduleQuizzes" hover>
            <template #title="{ item }">
               <div class="table-cell-title">
                 <strong>{{ item.title }}</strong>
                 <small>{{ item.total_marks }} Marks • {{ item.question_count }} Questions</small>
               </div>
            </template>
            <template #status="{ item }">
               <span :class="['status-pill', item.status]">{{ item.status }}</span>
            </template>
            <template #actions="{ item }">
               <div class="flex gap-2 justify-end">
                  <button class="btn-icon" title="View Questions" @click="viewQuizQuestions(item)">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button class="btn-icon" title="Results" @click="viewQuizResults(item)">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  </button>
                  <button class="btn-icon danger" title="Delete" @click="initiateDelete(item, 'quiz')">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
               </div>
            </template>
          </AppTable>
        </div>

        <div v-if="activeTab === 'results'" class="modal-tab-content">
           <div class="results-list-grid">
              <div v-for="quiz in moduleQuizzes" :key="quiz.id" class="result-box" @click="viewQuizResults(quiz)">
                 <div class="result-box-header">
                    <span class="font-bold">{{ quiz.title }}</span>
                    <span :class="['status-dot', quiz.status]"></span>
                 </div>
                 <div class="result-box-footer">
                    <span>View Performance</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AppModal>

    <AppModal :show="showDeleteModal" title="Confirm Delete" width="400px" @close="showDeleteModal = false">
       <div class="text-center p-4">
          <p>Are you sure you want to delete <strong>{{ itemToDelete?.title }}</strong>?</p>
          <div class="flex justify-center gap-3 mt-4">
             <button class="btn btn-outline" @click="showDeleteModal = false">Cancel</button>
             <button class="btn btn-danger" @click="executeDelete">Delete</button>
          </div>
       </div>
    </AppModal>

    <QuizQuestionsModal :show="showQuizQuestionsModal" :quiz="selectedQuiz" @close="showQuizQuestionsModal = false" />
    <QuizResultsModal :show="showQuizResultsModal" :quiz="selectedQuiz" @close="showQuizResultsModal = false" />

  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppTable from '../../components/reusable/AppTable.vue'
import QuizQuestionsModal from '../../components/lecturer/QuizQuestionsModal.vue'
import QuizResultsModal from '../../components/lecturer/QuizResultsModal.vue'
import api from '@/api/api'

export default {
  name: 'LecturerModules',
  components: { AppButton, AppModal, AppTable, QuizQuestionsModal, QuizResultsModal },
  setup() {
    const moduleData = ref([]) 
    const loading = ref(true)
    const groupBySession = ref(true)
    const searchQuery = ref('')
    const selectedSemester = ref('all')

    // Modal logic
    const selectedModule = ref(null)
    const activeTab = ref('quizzes')
    const moduleQuizzes = ref([])
    const selectedQuiz = ref(null)
    const showQuizQuestionsModal = ref(false)
    const showQuizResultsModal = ref(false)
    const showDeleteModal = ref(false)
    const itemToDelete = ref(null)

    const tabs = [
      { id: 'quizzes', label: 'Quizzes' },
      { id: 'results', label: 'Results' }
    ]

    const quizColumns = [
      { key: 'title', label: 'Quiz', width: '45%' },
      { key: 'duration_minutes', label: 'Duration', width: '15%' },
      { key: 'status', label: 'Status', width: '15%' },
      { key: 'actions', label: '', width: '25%', align: 'right' }
    ]

    const hasData = computed(() => {
        if(Array.isArray(moduleData.value)) return moduleData.value.length > 0
        if(groupBySession.value && moduleData.value) return moduleData.value.some(g => g.modules?.length > 0)
        return false
    })

    const totalModules = computed(() => {
        if(!moduleData.value) return 0
        if(groupBySession.value) return moduleData.value.reduce((acc, g) => acc + (g.modules?.length || 0), 0)
        return moduleData.value.length
    })

    const fetchAssignedModules = async () => {
      loading.value = true
      try {
        const params = {
          search: searchQuery.value || undefined,
          semester: selectedSemester.value !== 'all' ? selectedSemester.value : undefined,
          group_by_session: groupBySession.value
        }
        const res = await api.get('/lecturer/modules', { params })
        if (res.data.success) moduleData.value = res.data.data
      } catch (e) { console.error(e) } 
      finally { setTimeout(() => loading.value = false, 300) }
    }

    const fetchModuleQuizzes = async (moduleId) => {
       try {
          const res = await api.get(`/lecturer/modules/${moduleId}/quizzes`)
          if(res.data.success) moduleQuizzes.value = res.data.quizzes
       } catch(e) { console.error(e) }
    }

    const openModuleModal = async (module) => {
       selectedModule.value = module
       activeTab.value = 'quizzes'
       await fetchModuleQuizzes(module.id)
    }

    const viewQuizQuestions = (quiz) => {
       selectedQuiz.value = quiz
       showQuizQuestionsModal.value = true
    }

    const viewQuizResults = async (quiz) => {
       try {
          const res = await api.get(`/lecturer/quizzes/${quiz.id}/results`)
          if(res.data.success) {
             selectedQuiz.value = { ...quiz, results: res.data.attempts, statistics: res.data.statistics }
             showQuizResultsModal.value = true
          }
       } catch(e) { console.error(e) }
    }

    const initiateDelete = (item) => {
       itemToDelete.value = item
       showDeleteModal.value = true
    }

    const executeDelete = async () => {
       if(!itemToDelete.value) return
       try {
          await api.delete(`/lecturer/quizzes/${itemToDelete.value.id}`)
          moduleQuizzes.value = moduleQuizzes.value.filter(q => q.id !== itemToDelete.value.id)
       } catch(e) { console.error(e) }
       finally { showDeleteModal.value = false }
    }

    const resetFilters = () => {
       searchQuery.value = ''
       selectedSemester.value = 'all'
    }

    const getSemesterGradient = (sem) => {
       return sem == 1 
         ? { background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))' } 
         : { background: 'linear-gradient(135deg, var(--secondary-color), var(--secondary-dark))' }
    }

    let debounce
    watch([groupBySession, selectedSemester], () => fetchAssignedModules())
    watch(searchQuery, () => {
       clearTimeout(debounce)
       debounce = setTimeout(fetchAssignedModules, 500)
    })

    onMounted(fetchAssignedModules)

    return {
       moduleData, loading, hasData, totalModules,
       searchQuery, selectedSemester, groupBySession,
       selectedModule, activeTab, tabs, quizColumns, moduleQuizzes,
       selectedQuiz, showQuizQuestionsModal, showQuizResultsModal, showDeleteModal, itemToDelete,
       openModuleModal, viewQuizQuestions, viewQuizResults, initiateDelete, executeDelete,
       resetFilters, getSemesterGradient
    }
  }
}
</script>

<style scoped>
/* Core Layout */
.lecturer-modules { padding: var(--spacing-lg); max-width: 1400px; margin: 0 auto; }

/* Page Header */
.page-header { display: flex; justify-content: space-between; margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-lg); border-bottom: 1px solid var(--gray-light); }
.page-title { font-size: 2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); margin-top: 0.5rem; }

/* Stats */
.stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); }
.stat-icon { width: 48px; height: 48px; background: var(--primary-soft); color: var(--primary-color); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: var(--dark-color); display: block; }
.stat-label { font-size: 0.8rem; text-transform: uppercase; color: var(--gray-color); }

/* Filters */
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

/* Module Card */
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

.card-action-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: var(--gradient-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.card-action-btn:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
.card-action-btn.outline { background: transparent; border: 2px solid var(--primary-color); color: var(--primary-color); }
.card-action-btn.outline:hover { background: var(--primary-soft); }

/* Modal Styling */
.modal-tabs-header { display: flex; gap: 1rem; border-bottom: 1px solid var(--gray-light); margin-bottom: 1.5rem; }
.modal-tab { background: none; border: none; padding: 10px 15px; font-size: 1rem; color: var(--gray-color); font-weight: 500; cursor: pointer; border-bottom: 3px solid transparent; }
.modal-tab.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
.modal-tab:hover { color: var(--dark-color); }

.table-cell-title { display: flex; flex-direction: column; }
.table-cell-title small { color: var(--gray-color); margin-top: 2px; }
.status-pill { font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; font-weight: 600; }
.status-pill.published { background: var(--success-soft); color: var(--success-dark); }
.status-pill.draft { background: var(--gray-light); color: var(--gray-dark); }

.btn-icon { background: none; border: none; cursor: pointer; color: var(--gray-color); padding: 4px; transition: 0.2s; }
.btn-icon:hover { color: var(--primary-color); transform: scale(1.1); }
.btn-icon.danger:hover { color: var(--danger-color); }

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

/* Responsive */
@media (max-width: 768px) {
  .filter-card { grid-template-columns: 1fr; }
  .header-stats { display: none; }
  .session-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .module-count { margin-top: 0.5rem; }
}
</style>