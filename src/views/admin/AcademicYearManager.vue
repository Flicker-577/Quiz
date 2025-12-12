<template>
  <div class="academic-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Academic Year & Calendar</h1>
        <p class="page-subtitle">Manage university sessions and automatic progression.</p>
      </div>
      <div class="header-actions" v-if="!loading && sessions.length === 0">
        <AppButton variant="primary" @click="openCreateModal">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Initialize Academic Calendar
        </AppButton>
      </div>
    </div>

    <div v-if="loading" class="stats-grid mb-4">
      <div v-for="n in 2" :key="n" class="skeleton-stat-card">
        <AppSkeleton type="card" height="100%" borderRadius="12px" />
      </div>
    </div>

    <div v-else class="stats-grid mb-4">
      <div class="stat-card active-session">
        <div class="stat-icon primary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <div class="stat-info">
          <span class="label">Current Active Year</span>
          <h3 class="value">{{ currentSession?.name || 'Not Started' }}</h3>
          <span class="sub-text" v-if="currentSession">
            {{ formatDate(currentSession.start_date) }} — {{ formatDate(currentSession.end_date) }}
          </span>
        </div>
        <div class="status-badge active" v-if="currentSession">Running</div>
      </div>

      <div class="stat-card countdown-card">
        <div class="stat-icon warning">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="label">Current Semester</span>
          <h3 class="value">{{ activeSemester ? activeSemester.name : 'No Active Semester' }}</h3>
          <span class="sub-text" v-if="activeSemester">
            Ends in <strong :class="countdownClass">{{ daysRemaining }} days</strong>
          </span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="content-card">
      <div class="card-header-skeleton">
         <AppSkeleton width="300px" height="28px" class="mb-3" />
      </div>
      <div class="table-skeleton">
        <AppSkeleton width="100%" height="48px" borderRadius="4px" class="mb-2" />
        <AppSkeleton :count="5" width="100%" height="60px" borderRadius="4px" />
      </div>
    </div>

    <div v-else class="content-card">
      <div class="card-header-simple">
        <h3>Academic History & Future Schedule</h3>
      </div>
      
      <AppTable 
        :columns="columns" 
        :data="sortedSessions" 
        hover
      >
        <template #status="{ item }">
          <div class="status-cell">
             <span v-if="item.is_current" class="badge badge-success">Active Year</span>
             <span v-else-if="item.status === 'closed'" class="badge badge-gray">Closed (History)</span>
             <span v-else class="badge badge-warning">Draft (Future)</span>
          </div>
        </template>

        <template #semesters="{ item }">
          <div class="semester-mini-list">
            <div v-for="sem in item.semesters" :key="sem.id" class="sem-item">
              <span class="sem-dot" :class="{ 'active': sem.is_active }"></span>
              <span class="sem-name">S{{ sem.number }}</span>
            </div>
          </div>
        </template>

        <template #actions="{ item }">
          <div class="action-buttons">
            <button 
              v-if="item.status === 'draft' && !item.is_current"
              class="icon-btn success" 
              title="Publish & Activate"
              @click="confirmPublish(item)"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>

            <button 
              v-if="item.status !== 'closed'"
              class="icon-btn primary" 
              title="Edit Session"
              @click="editSession(item)"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
          </div>
        </template>
      </AppTable>
    </div>

    <AppModal 
      :show="showFormModal" 
      :title="editingId ? 'Edit Academic Schedule' : 'Initialize Calendar'" 
      width="600px" 
      @close="closeFormModal"
    >
      <form @submit.prevent="saveSession" class="session-form">
        <div class="form-section">
          <h4 class="section-title">Academic Year</h4>
          <div class="form-group">
            <label class="form-label">Session Name</label>
            <input type="text" v-model="form.name" class="form-control" placeholder="YYYY/YYYY" required>
          </div>
          <div class="form-group">
            <label class="form-label">Duration (Full Year)</label>
            <div class="date-range-stack">
               <div class="date-input-group">
                 <span class="input-label">Start</span>
                 <input type="date" v-model="form.start_date" class="form-control" required>
               </div>
               <div class="date-input-group">
                 <span class="input-label">End</span>
                 <input type="date" v-model="form.end_date" class="form-control" required>
               </div>
            </div>
          </div>
        </div>

        <div class="form-section mt-4">
          <h4 class="section-title">Semesters</h4>
          
          <div class="semester-stack">
            <div class="semester-row">
               <div class="sem-label">Semester 1</div>
               <div class="sem-dates">
                 <input type="date" v-model="form.sem1_start" class="form-control compact" required>
                 <span class="to-arrow">→</span>
                 <input type="date" v-model="form.sem1_end" class="form-control compact" required>
               </div>
            </div>

            <div class="semester-row">
               <div class="sem-label">Semester 2</div>
               <div class="sem-dates">
                 <input type="date" v-model="form.sem2_start" class="form-control compact" required>
                 <span class="to-arrow">→</span>
                 <input type="date" v-model="form.sem2_end" class="form-control compact" required>
               </div>
            </div>
          </div>
        </div>
      </form>
      
      <template #footer>
        <div class="modal-actions centered">
          <AppButton variant="outline" @click="closeFormModal" type="button">Cancel</AppButton>
          <AppButton variant="primary" :disabled="submitting" @click="saveSession">
            <span v-if="submitting" class="btn-loading-content">
              <AppSpinner size="sm" color="light" /> Saving...
            </span>
            <span v-else>{{ editingId ? 'Save Changes' : 'Initialize' }}</span>
          </AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal 
      :show="showPublishModal" 
      title="Activate New Academic Year" 
      width="550px" 
      @close="showPublishModal = false"
    >
      <div class="publish-container">
        <div class="publish-header">
           <div class="year-transition">
              <span class="old-year">{{ currentSession?.name || 'None' }}</span>
              <span class="arrow">➔</span>
              <span class="new-year">{{ sessionToPublish?.name }}</span>
           </div>
           <p class="publish-desc">You are about to transition the system to a new academic year.</p>
        </div>

        <div class="impact-box">
           <h5>System Actions:</h5>
           <ul>
             <li>✅ Close <strong>{{ currentSession?.name || 'Previous' }}</strong> session (ReadOnly).</li>
             <li>✅ Promote active students (Year X → Year X+1).</li>
             <li>✅ Graduate final year students.</li>
             <li>✅ Generate <strong>Draft for {{ estimatedNextYear }}</strong> automatically.</li>
           </ul>
        </div>

        <div class="publish-config">
           <label>Start with Semester:</label>
           <div class="radio-group">
              <label class="radio-card" :class="{ selected: publishSemesterTarget === 1 }">
                 <input type="radio" v-model="publishSemesterTarget" :value="1">
                 <span>Semester 1</span>
              </label>
              <label class="radio-card" :class="{ selected: publishSemesterTarget === 2 }">
                 <input type="radio" v-model="publishSemesterTarget" :value="2">
                 <span>Semester 2</span>
              </label>
           </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-actions centered">
          <AppButton variant="outline" @click="showPublishModal = false">Cancel</AppButton>
          <AppButton variant="success" :disabled="publishing" @click="executePublish">
            <span v-if="publishing" class="btn-loading-content">
              <AppSpinner size="sm" color="light" /> Processing...
            </span>
            <span v-else>Confirm & Activate</span>
          </AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import AppTable from '@/components/reusable/AppTable.vue'
import AppButton from '@/components/reusable/AppButton.vue'
import AppModal from '@/components/reusable/AppModal.vue'
import AppSkeleton from '@/components/reusable/AppSkeleton.vue'
import AppSpinner from '@/components/reusable/AppSpinner.vue'
import api from '@/api/api'

export default {
  name: 'AcademicYearManager',
  components: { AppTable, AppButton, AppModal, AppSkeleton, AppSpinner },
  setup() {
    // --- State ---
    const sessions = ref([])
    const loading = ref(true)
    const submitting = ref(false)
    const publishing = ref(false)
    
    // Modals
    const showFormModal = ref(false)
    const showPublishModal = ref(false)
    const editingId = ref(null)
    const sessionToPublish = ref(null)
    const publishSemesterTarget = ref(1)

    // Form
    const form = ref({
      name: '', start_date: '', end_date: '',
      sem1_start: '', sem1_end: '',
      sem2_start: '', sem2_end: ''
    })

    const columns = [
      { key: 'name', label: 'Academic Year', width: '25%' },
      { key: 'status', label: 'Status', width: '20%', align: 'center' },
      { key: 'semesters', label: 'Semesters', width: '25%', align: 'center' },
      { key: 'start_date', label: 'Starts', width: '15%' },
      { key: 'end_date', label: 'Ends', width: '15%' }
    ]

    // --- Computed Properties ---
    
    // Sort: Current -> Future Drafts -> Closed History
    const sortedSessions = computed(() => {
        return [...sessions.value].sort((a, b) => {
            if (a.is_current) return -1;
            if (b.is_current) return 1;
            
            if (a.status === 'draft' && b.status === 'closed') return -1;
            if (a.status === 'closed' && b.status === 'draft') return 1;
            
            return new Date(a.start_date) - new Date(b.start_date);
        });
    })

    const currentSession = computed(() => sessions.value.find(s => s.is_current))
    
    const activeSemester = computed(() => {
      if (!currentSession.value) return null
      return currentSession.value.semesters?.find(s => s.is_active)
    })

    const daysRemaining = computed(() => {
      if (!activeSemester.value) return 0
      const end = new Date(activeSemester.value.end_date)
      const now = new Date()
      const diffTime = end - now
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    })

    const countdownClass = computed(() => {
      if (daysRemaining.value < 7) return 'text-danger'
      if (daysRemaining.value < 30) return 'text-warning'
      return 'text-success'
    })

    const estimatedNextYear = computed(() => {
        if (!sessionToPublish.value) return 'Next Year'
        try {
            const parts = sessionToPublish.value.name.split('/')
            const startYear = parseInt(parts[0]) + 3
            return `${startYear}/${startYear + 1}`
        } catch (e) {
            return 'Next Year'
        }
    })

    // --- API Actions ---

    const fetchSessions = async () => {
      loading.value = true
      // 4. UPDATED: Delay loading state
      try {
        const response = await api.get('/academic-sessions')
        sessions.value = response.data
      } catch (error) {
        console.error('Failed to fetch sessions:', error)
      } finally {
        setTimeout(() => { loading.value = false }, 500)
      }
    }

    const saveSession = async () => {
      submitting.value = true
      try {
        const payload = { ...form.value }
        
        if (editingId.value) {
           await api.put(`/academic-sessions/${editingId.value}`, payload)
           alert('Session updated successfully')
        } else {
           await api.post('/academic-sessions', payload)
           alert('Session initialized successfully')
        }
        
        closeFormModal()
        await fetchSessions()
      } catch (error) {
        console.error('Save failed:', error)
        alert('Failed to save session: ' + (error.response?.data?.message || error.message))
      } finally {
        submitting.value = false
      }
    }

    const executePublish = async () => {
      publishing.value = true
      try {
        await api.post(`/academic-sessions/${sessionToPublish.value.id}/publish`, {
            active_semester: publishSemesterTarget.value
        })
        
        showPublishModal.value = false
        alert('Academic Year Activated! Students have been promoted.')
        await fetchSessions()
      } catch (error) {
        console.error('Publish failed:', error)
        alert('Failed to publish year: ' + (error.response?.data?.message || error.message))
      } finally {
        publishing.value = false
      }
    }

    // --- Helpers ---
    const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '-'
    
    const openCreateModal = () => {
      editingId.value = null
      form.value = { name: '', start_date: '', end_date: '', sem1_start: '', sem1_end: '', sem2_start: '', sem2_end: '' }
      showFormModal.value = true
    }

    const editSession = (item) => {
      editingId.value = item.id
      form.value = {
          name: item.name,
          start_date: item.start_date,
          end_date: item.end_date,
          sem1_start: item.semesters?.find(s => s.number === 1)?.start_date || '',
          sem1_end: item.semesters?.find(s => s.number === 1)?.end_date || '',
          sem2_start: item.semesters?.find(s => s.number === 2)?.start_date || '',
          sem2_end: item.semesters?.find(s => s.number === 2)?.end_date || '',
      }
      showFormModal.value = true
    }

    const confirmPublish = (item) => {
      sessionToPublish.value = item
      showPublishModal.value = true
    }

    const closeFormModal = () => showFormModal.value = false

    onMounted(() => {
      fetchSessions()
    })

    return {
      sessions, sortedSessions, loading, submitting, publishing,
      columns, currentSession, activeSemester, daysRemaining, countdownClass, estimatedNextYear,
      showFormModal, showPublishModal, form, editingId, sessionToPublish, publishSemesterTarget,
      openCreateModal, editSession, closeFormModal, saveSession, confirmPublish, executePublish, formatDate
    }
  }
}
</script>

<style scoped>
/* Base Layout */
.academic-page { padding: var(--spacing-md); max-width: 1200px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); }
.page-title { font-size: 1.75rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.25rem; }
.page-subtitle { color: var(--gray-color); }

/* Stats Cards */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-md); }
.stat-card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); display: flex; align-items: center; gap: 16px; position: relative; overflow: hidden; }
.stat-card.active-session { border-left: 5px solid var(--primary-color); }
.stat-card.countdown-card { border-left: 5px solid var(--warning-color); }
.stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.warning { background: var(--warning-soft); color: var(--warning-color); }
.stat-info { display: flex; flex-direction: column; }
.stat-info .label { text-transform: uppercase; font-size: 0.75rem; color: var(--gray-color); font-weight: 600; }
.stat-info .value { font-size: 1.5rem; font-weight: 700; color: var(--dark-color); margin: 4px 0; }
.status-badge { position: absolute; top: 12px; right: 12px; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
.status-badge.active { background: var(--success-soft); color: var(--success-dark); }

/* NEW SKELETON STYLES */
.skeleton-stat-card {
  height: 100px;
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.table-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-loading-content { display: flex; align-items: center; gap: 8px; }
.modal-actions.centered { display: flex; justify-content: flex-end; gap: var(--spacing-sm); }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 16px; }

/* Table */
.content-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); padding: var(--spacing-lg); }
.card-header-simple h3 { font-size: 1.1rem; color: var(--dark-color); margin-bottom: var(--spacing-md); }
.badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.badge-success { background: var(--success-soft); color: var(--success-dark); }
.badge-gray { background: var(--gray-light); color: var(--gray-dark); }
.badge-warning { background: var(--warning-soft); color: var(--warning-dark); }
.semester-mini-list { display: flex; gap: 8px; }
.sem-item { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; background: var(--light-color); padding: 2px 6px; border-radius: 4px; }
.sem-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gray-color); }
.sem-dot.active { background: var(--success-color); }
.action-buttons { display: flex; gap: 8px; justify-content: flex-end; }
.icon-btn { border: none; background: transparent; cursor: pointer; padding: 6px; border-radius: 4px; color: var(--gray-color); }
.icon-btn:hover { background: var(--light-color); }
.icon-btn.primary:hover { color: var(--primary-color); background: var(--primary-soft); }
.icon-btn.success:hover { color: var(--success-color); background: var(--success-soft); }

/* --- Edit Modal --- */
.session-form { padding: 0 4px; }
.form-section { margin-bottom: 20px; }
.section-title { font-size: 1rem; color: var(--primary-dark); border-bottom: 1px solid var(--gray-light); padding-bottom: 8px; margin-bottom: 12px; }
.form-group { margin-bottom: 12px; }
.form-label { display: block; font-size: 0.9rem; margin-bottom: 4px; font-weight: 500; }
.form-control { width: 100%; padding: 8px 12px; border: 1px solid var(--gray-light); border-radius: 6px; font-size: 0.95rem; }

.date-range-stack { display: flex; gap: 12px; }
.date-input-group { flex: 1; }
.input-label { display: block; font-size: 0.75rem; color: var(--gray-color); margin-bottom: 2px; }

/* Semester Stack */
.semester-stack { background: var(--light-color); border-radius: 8px; padding: 12px; }
.semester-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--gray-light); }
.semester-row:last-child { margin-bottom: 0; padding-bottom: 0; border: none; }
.sem-label { font-weight: 600; font-size: 0.9rem; width: 100px; }
.sem-dates { flex: 1; display: flex; align-items: center; gap: 8px; }
.to-arrow { color: var(--gray-color); font-weight: bold; }
.form-control.compact { padding: 6px; font-size: 0.85rem; }

/* --- Publish Modal --- */
.publish-container { padding: 8px; }
.publish-header { text-align: center; margin-bottom: 20px; }
.year-transition { display: flex; align-items: center; justify-content: center; gap: 16px; font-size: 1.5rem; font-weight: 700; color: var(--dark-color); margin-bottom: 8px; }
.arrow { color: var(--success-color); }
.old-year { color: var(--gray-color); text-decoration: line-through; opacity: 0.6; font-size: 1.2rem; }
.publish-desc { font-size: 0.9rem; color: var(--gray-color); margin: 0; }

.impact-box { background: var(--light-color); padding: 16px; border-radius: 8px; border: 1px solid var(--gray-light); margin-bottom: 20px; }
.impact-box h5 { margin: 0 0 8px 0; font-size: 0.95rem; color: var(--dark-color); }
.impact-box ul { padding-left: 20px; margin: 0; font-size: 0.9rem; color: var(--gray-dark); }
.impact-box li { margin-bottom: 4px; }

.publish-config { margin-top: 10px; }
.radio-group { display: flex; gap: 12px; margin-top: 8px; }
.radio-card { flex: 1; border: 2px solid var(--gray-light); border-radius: 8px; padding: 10px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.radio-card.selected { border-color: var(--primary-color); background: var(--primary-soft); color: var(--primary-dark); }
</style>