<template>
  <div class="quiz-management-container">
    
    <header class="dashboard-header">
      <div class="header-text">
        <h1 class="title">Quiz Management</h1>
        <div class="title-decoration"></div><br>
        <p class="subtitle">Manage assessments, monitor results, and generate content.</p>
      </div>
      <div class="header-actions">
        <AppButton variant="secondary" @click="showAICreation = true">
          AI Generator
        </AppButton>
        <AppButton variant="primary" @click="showManualCreation = true">
          + Create Quiz
        </AppButton>
      </div>
    </header>

    <div v-if="isLoading" class="stats-grid">
      <div v-for="i in 3" :key="i" class="stat-card skeleton-card">
        <div class="stat-icon skeleton-circle"></div>
        <div class="stat-info">
          <AppSkeleton type="text" width="60px" height="24px" class="mb-1" />
          <AppSkeleton type="text" width="100px" height="16px" />
        </div>
      </div>
    </div>

    <div v-else class="stats-grid">
       <div class="stat-card">
        <div class="stat-icon blue"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
        <div class="stat-info"><h3>{{ totalQuizzes }}</h3><p>Total Quizzes</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
        <div class="stat-info"><h3>{{ activeQuizzes }}</h3><p>Published</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
        <div class="stat-info"><h3>{{ draftsCount }}</h3><p>Drafts</p></div>
      </div>
    </div>

    <div class="content-panel">
      <div class="toolbar">
        <div class="tabs-wrapper">
          <div class="tabs">
            <button v-for="t in ['All', 'Published', 'Draft', 'Closed']" :key="t" :class="{active: filterStatus === t.toLowerCase() || (t==='All' && !filterStatus)}" @click="setFilter(t)">{{ t }}</button>
          </div>
        </div>
        
         <div class="filters">
            <input type="text" v-model="searchQuery" placeholder="Search quizzes..." class="search-box">
             <select v-model="filterModule" class="module-select">
                <option value="">All Modules</option>
                <option v-for="m in modules" :key="m.id" :value="m.id">{{ m.name }}</option>
              </select>
         </div>
      </div>

      <div v-if="isLoading">
        
        <div class="desktop-view hidden-mobile">
          <div class="skeleton-table">
            <div class="sk-row header">
              <div style="width: 40%"><AppSkeleton type="text" width="60%" height="14px" /></div> <div style="width: 20%"><AppSkeleton type="text" width="50%" height="14px" /></div> <div style="width: 10%"><AppSkeleton type="text" width="80%" height="14px" /></div> <div style="width: 15%"><AppSkeleton type="text" width="60%" height="14px" /></div> <div style="width: 15%"><AppSkeleton type="text" width="50%" height="14px" /></div> </div>
            
            <div v-for="i in 5" :key="i" class="sk-row">
              <div style="width: 40%">
                <AppSkeleton type="text" width="80%" height="16px" class="mb-1" />
                <AppSkeleton type="text" width="40%" height="12px" />
              </div>
              <div style="width: 20%"><AppSkeleton type="text" width="70%" height="16px" /></div>
              <div style="width: 10%"><AppSkeleton type="text" width="30px" height="16px" /></div>
              <div style="width: 15%"><AppSkeleton type="text" width="80px" height="22px" style="border-radius:12px" /></div>
              <div style="width: 15%"><AppSkeleton type="text" width="90px" height="16px" /></div>
            </div>
          </div>
        </div>

        <div class="mobile-view">
          <div v-for="i in 3" :key="i" class="quiz-card skeleton-card">
             <div class="card-header-skel">
               <AppSkeleton type="text" width="80px" height="24px" style="border-radius: 6px;" />
               <AppSkeleton type="text" width="60px" height="24px" style="border-radius: 12px;" />
             </div>
             <AppSkeleton type="text" width="70%" height="22px" class="my-2" />
             <div class="card-meta-skel">
                <AppSkeleton type="text" width="50px" height="14px" />
                <AppSkeleton type="text" width="80px" height="14px" />
             </div>
             <div class="sk-card-actions">
                <AppSkeleton type="circle" width="36px" height="36px" />
                <AppSkeleton type="circle" width="36px" height="36px" />
                <AppSkeleton type="circle" width="36px" height="36px" />
             </div>
          </div>
        </div>

      </div>
      <template v-else>
         <div class="desktop-view hidden-mobile">
          <AppTable :columns="columns" :data="filteredQuizzes" hover striped>
            <template #status="{ item }">
              <span :class="['status-pill', item.status]">{{ item.status }}</span>
            </template>
            <template #actions="{ item }">
              <div class="table-actions">
                <button v-if="item.status === 'closed'" class="action-btn" title="View Results" @click="openResultsModal(item)">
                  <svg class="icon-blue" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                </button>
                <button v-if="item.status === 'draft'" class="action-btn" title="Edit Questions" @click="openQuestionsModal(item)">
                  <svg class="icon-purple" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button v-if="item.status !== 'closed'" class="action-btn" :title="item.status === 'published' ? 'Unpublish' : 'Publish'" @click="toggleStatus(item)">
                  <svg v-if="item.status === 'published'" class="icon-green" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                  <svg v-else class="icon-green" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
                <button v-if="item.status === 'draft'" class="action-btn" title="Settings" @click="openEditModal(item)">
                   <svg class="icon-orange" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1-1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1 2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </button>
                <button v-if="item.status === 'draft' || item.status === 'closed'" class="action-btn" title="Delete" @click="confirmDelete(item)">
                  <svg class="icon-red" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </template>
          </AppTable>
        </div>

        <div class="mobile-view">
          <div v-for="item in filteredQuizzes" :key="item.id" class="quiz-card">
             <div class="card-header">
               <span class="module-tag">{{ item.module }}</span>
               <span :class="['status-pill', item.status]">{{ item.status }}</span>
             </div>
             
             <h3 class="card-title">{{ item.title }}</h3>
             <div class="card-meta">
               <span>{{ item.questions }} Qs</span>
               <span>{{ item.createdDate }}</span>
             </div>
             
             <div class="mobile-actions-row">
                <button v-if="item.status === 'draft'" class="action-icon" data-tooltip="Manage Questions" @click="openQuestionsModal(item)">
                   <svg class="icon-purple" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>

                <button v-if="item.status === 'closed'" class="action-icon" data-tooltip="View Results" @click="openResultsModal(item)">
                   <svg class="icon-blue" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                </button>

                <button v-if="item.status !== 'closed'" class="action-icon" :data-tooltip="item.status === 'published' ? 'Unpublish' : 'Publish'" @click="toggleStatus(item)">
                   <svg v-if="item.status === 'published'" class="icon-green" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                   <svg v-else class="icon-green" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>

                <button v-if="item.status === 'draft'" class="action-icon" data-tooltip="Edit Settings" @click="openEditModal(item)">
                   <svg class="icon-orange" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1-1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1 2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </button>

                <button v-if="item.status === 'draft' || item.status === 'closed'" class="action-icon delete" data-tooltip="Delete" @click="confirmDelete(item)">
                   <svg class="icon-red" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
             </div>
          </div>
        </div>
      </template>
    </div>

    <AppModal v-if="confirm.show" :show="confirm.show" :title="confirm.title" width="450px" @close="confirm.show=false">
       <div class="confirm-content">
        <div v-if="isProcessing" class="spinner-wrapper"><AppSpinner size="lg" color="primary" /><p>Processing...</p></div>
        <div v-else>
           <div class="icon-wrapper" :class="confirm.type">
             <svg v-if="confirm.type === 'danger'" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
             <svg v-else viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
           </div>
           <p>{{ confirm.message }}</p>
        </div>
      </div>
      <template #footer>
        <AppButton variant="outline" @click="confirm.show=false" :disabled="isProcessing">Cancel</AppButton>
        <AppButton :variant="confirm.type === 'danger' ? 'danger' : 'warning'" :loading="isProcessing" @click="executeConfirm">{{ confirm.btnText }}</AppButton>
      </template>
    </AppModal>

    <AppModal :show="showManualCreation" title="Create New Quiz" width="700px" @close="showManualCreation=false">
      <ManualQuizCreation @quiz-created="refresh(false)" @cancel="showManualCreation=false" />
    </AppModal>

    <AppModal :show="showAICreation" title="AI Quiz Generator" width="800px" @close="showAICreation=false">
      <AIQuizGeneration :modules="modules" @quiz-generated="refresh(false)" @cancel="showAICreation=false" />
    </AppModal>
    
    <QuizQuestionsEditModal :show="showQuestionsModal" :quiz="selectedQuiz" @save="refresh(false)" @close="showQuestionsModal=false" />
    <QuizResultsModal :show="showResultsModal" :quiz="selectedQuiz" @close="showResultsModal=false" />
    <QuizEditModal :show="showEditModal" :quiz="selectedQuiz" :modules="modules" @save="refresh(false)" @close="showEditModal=false" />
    <QuizApprovalModal :show="showApprovalModal" :quiz="selectedQuiz" @publish="refresh(false)" @close="showApprovalModal=false" />

  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppTable from '../../components/reusable/AppTable.vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppSpinner from '../../components/reusable/AppSpinner.vue' 
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'

import ManualQuizCreation from '../../components/lecturer/ManualQuizCreation.vue'
import AIQuizGeneration from '../../components/lecturer/AIQuizGeneration.vue'
import QuizQuestionsEditModal from '../../components/lecturer/QuizQuestionsEditModal.vue'
import QuizEditModal from '../../components/lecturer/QuizEditModal.vue'
import QuizApprovalModal from '../../components/lecturer/QuizApprovalModal.vue'
import QuizResultsModal from '../../components/lecturer/QuizResultsModal.vue'
import api from '@/api/api'

export default {
  name: 'QuizManagement',
  components: {
    AppButton, AppTable, AppModal, AppSpinner, AppSkeleton,
    ManualQuizCreation, AIQuizGeneration, QuizQuestionsEditModal, QuizEditModal, QuizApprovalModal, QuizResultsModal
  },
  setup() {
    const modules = ref([])
    const quizzes = ref([])
    const isLoading = ref(true)
    const isProcessing = ref(false)
    const showManualCreation = ref(false)
    const showAICreation = ref(false)
    
    const showQuestionsModal = ref(false)
    const showEditModal = ref(false)
    const showApprovalModal = ref(false)
    const showResultsModal = ref(false)
    const selectedQuiz = ref(null)
    const filterStatus = ref('')
    const filterModule = ref('')
    const searchQuery = ref('')
    const confirm = ref({ show: false, title: '', message: '', type: 'danger', btnText: 'Confirm', action: null })
    
    let pollingInterval = null

    const columns = [
      { key: 'title', label: 'Quiz Title', width: '40%' },
      { key: 'module', label: 'Module', width: '20%' },
      { key: 'questions', label: 'Items', width: '10%' },
      { key: 'status', label: 'Status', width: '15%' },
      { key: 'createdDate', label: 'Date', width: '15%' },
    ]

    const loadData = async (showSkeleton = true) => {
      if (showSkeleton) isLoading.value = true
      try {
        const [mRes, qRes] = await Promise.all([
          api.get('/assigned-modules'),
          api.get('/lecturer/quizzes')
        ])
        modules.value = mRes.data
        quizzes.value = qRes.data
      } catch (e) { console.error(e) }
      finally { if (showSkeleton) isLoading.value = false }
    }

    onMounted(() => {
      loadData(true)
      pollingInterval = setInterval(() => { loadData(false) }, 30000)
    })
    
    onUnmounted(() => { if (pollingInterval) clearInterval(pollingInterval) })
    
    const totalQuizzes = computed(() => quizzes.value.length)
    const activeQuizzes = computed(() => quizzes.value.filter(q => q.status === 'published').length)
    const draftsCount = computed(() => quizzes.value.filter(q => q.status === 'draft').length)

    const filteredQuizzes = computed(() => {
      return quizzes.value.filter(q => {
        const modMatch = filterModule.value ? q.moduleId == filterModule.value : true
        let statusMatch = true
        if (filterStatus.value && filterStatus.value !== 'all') statusMatch = q.status === filterStatus.value
        const searchMatch = q.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        return modMatch && statusMatch && searchMatch
      })
    })

    const setFilter = (s) => filterStatus.value = s === 'All' ? '' : s.toLowerCase()

    const refresh = (skel) => {
      showManualCreation.value = false
      showAICreation.value = false
      showQuestionsModal.value = false
      showEditModal.value = false
      showApprovalModal.value = false
      showResultsModal.value = false
      loadData(skel)
    }

    const openQuestionsModal = (q) => { selectedQuiz.value = { ...q }; showQuestionsModal.value = true }
    const openResultsModal = (q) => { selectedQuiz.value = { ...q }; showResultsModal.value = true }
    const openEditModal = (q) => { selectedQuiz.value = { ...q }; showEditModal.value = true }

    const toggleStatus = (q) => {
      if (q.status === 'published') {
        confirm.value = {
          show: true, title: 'Unpublish Quiz?', message: 'Revert to Draft?',
          type: 'warning', btnText: 'Unpublish',
          action: async () => { await api.put(`/lecturer/quizzes/${q.id}`, { status: 'draft' }); q.status = 'draft' }
        }
      } else { selectedQuiz.value = { ...q }; showApprovalModal.value = true; }
    }

    const confirmDelete = (q) => {
      confirm.value = {
        show: true, title: 'Delete Quiz?', message: 'Cannot be undone.',
        type: 'danger', btnText: 'Delete',
        action: async () => { await api.delete(`/lecturer/quizzes/${q.id}`); quizzes.value = quizzes.value.filter(item => item.id !== q.id) }
      }
    }

    const executeConfirm = async () => {
      if (confirm.value.action) {
        isProcessing.value = true
        try { await confirm.value.action(); confirm.value.show = false; }
        catch (e) { alert('Action failed'); }
        finally { isProcessing.value = false; }
      }
    }

    return {
      modules, quizzes, isLoading, isProcessing, columns,
      showManualCreation, showAICreation, 
      showQuestionsModal, showEditModal, showApprovalModal, showResultsModal, 
      selectedQuiz, filterStatus, filterModule, searchQuery, filteredQuizzes, confirm,
      totalQuizzes, activeQuizzes, draftsCount,
      loadData, refresh, setFilter, toggleStatus, confirmDelete, executeConfirm, 
      openQuestionsModal, openEditModal, openResultsModal
    }
  }
}
</script>

<style scoped>
/* Main Styles */
.quiz-management-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
.dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 20px; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.title { font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.subtitle { color: #6b7280; font-size: 0.95rem; }
.header-actions { display: flex; gap: 12px; }

/* Stats Grid */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px; }
.stat-card { background: white; padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 16px; border: 1px solid #f3f4f6; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.stat-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.stat-icon.blue { background: #eff6ff; color: #3b82f6; } .stat-icon.green { background: #ecfdf5; color: #10b981; } .stat-icon.orange { background: #fff7ed; color: #f97316; }
.stat-info h3 { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0; line-height: 1; }
.stat-info p { color: #6b7280; font-size: 0.85rem; margin-top: 4px; }

/* Skeleton */
.skeleton-card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f3f4f6; overflow: hidden; display: flex; flex-direction: column; padding: 20px; gap: 10px; margin-bottom: 16px; }
.skeleton-circle { background: #e5e7eb; width: 48px; height: 48px; border-radius: 12px; animation: skeleton-loading 1.5s infinite; }
@keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* Desktop Skeleton Table */
.skeleton-table { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #f3f4f6; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.sk-row { display: flex; padding: 16px; align-items: center; gap: 10px; border-bottom: 1px solid #e5e7eb; }
.sk-row.header { background: #f9fafb; border-bottom: 1px solid #e5e7eb; }

/* Mobile Skeleton Cards */
.sk-card-header, .sk-card-meta, .sk-card-actions { display: flex; gap: 10px; }
.sk-card-header { justify-content: space-between; }
.sk-card-actions { margin-top: 10px; }

/* Desktop Table View */
.status-pill { padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: capitalize; display: inline-block; }
.status-pill.published { background: #ecfdf5; color: #065f46; } .status-pill.draft { background: #f3f4f6; color: #4b5563; } .status-pill.closed { background: #fee2e2; color: #dc2626; }
.table-actions { display: flex; gap: 4px; justify-content: flex-end; }
.action-btn { background: transparent; border: none; padding: 6px; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.action-btn:hover { background: #f3f4f6; }
.icon-green { color: #10b981; } .icon-gray { color: #9ca3af; } .icon-purple { color: #8b5cf6; } .icon-orange { color: #f59e0b; } .icon-red { color: #ef4444; } .icon-blue { color: #3b82f6; }

/* Mobile Card View */
.desktop-view { display: block; } .mobile-view { display: none; }
.quiz-card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.module-tag { font-size: 0.75rem; color: #6b7280; font-weight: 600; background: #f9fafb; padding: 4px 8px; border-radius: 6px; border: 1px solid #e5e7eb; }
.card-title { margin: 0; font-size: 1.1rem; font-weight: 600; color: #111827; }
.card-meta { display: flex; gap: 16px; font-size: 0.85rem; color: #6b7280; border-bottom: 1px solid #f3f4f6; padding-bottom: 12px; }

/* MOBILE ACTION ICONS ROW */
.mobile-actions-row { display: flex; gap: 15px; padding-top: 10px; justify-content: flex-start; }
.action-icon {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  color: #64748b;
  cursor: pointer;
  position: relative; /* For Tooltip */
}
.action-icon:hover { background: white; border-color: #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.action-icon.delete:hover { background: #fee2e2; border-color: #fecaca; color: #dc2626; }

/* CSS Tooltip */
.action-icon::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 4px 8px;
  font-size: 0.75rem;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s;
  pointer-events: none;
  margin-bottom: 6px;
}
.action-icon:hover::after { opacity: 1; visibility: visible; }

/* Layout & Modals */
.content-panel { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 20px; border: 1px solid #f3f4f6; }
.toolbar { display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
.tabs-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; }
.tabs { display: flex; gap: 8px; background: #f9fafb; padding: 4px; border-radius: 8px; white-space: nowrap; }
.tabs button { border: none; background: transparent; padding: 6px 12px; font-size: 0.9rem; color: #6b7280; border-radius: 6px; cursor: pointer; transition: 0.2s; font-weight: 500; }
.tabs button.active { background: white; color: #3b82f6; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.filters { display: flex; gap: 12px; flex: 1; justify-content: flex-end; }
.search-box, .module-select { padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; font-size: 0.9rem; height: 40px; }
.search-box:focus { border-color: #3b82f6; } .search-box { min-width: 200px; }
.confirm-content { text-align: center; padding: 20px 0; }
.spinner-wrapper { display: flex; flex-direction: column; align-items: center; gap: 12px; color: #6b7280; }
.icon-wrapper { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.icon-wrapper.danger { background: #fee2e2; color: #ef4444; } .icon-wrapper.warning { background: #ffedd5; color: #f97316; }

/* Mobile Breakpoint */
@media (max-width: 768px) { 
  .quiz-management-container { padding: 12px; } 
  .dashboard-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .header-actions { width: 100%; flex-direction: row; gap: 12px; } 
  .header-actions button { flex: 1; margin: 0; justify-content: center; } 
  .stats-grid { grid-template-columns: 1fr; gap: 12px; } 
  .desktop-view { display: none; } 
  .mobile-view { display: grid; grid-template-columns: 1fr; gap: 16px; } 
  .toolbar { flex-direction: column; align-items: stretch; gap: 16px; } 
  .filters { flex-direction: column; gap: 10px; width: 100%; }
  .search-box, .module-select { width: 100%; }
}
</style>