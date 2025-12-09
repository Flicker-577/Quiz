<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Courses & Programs</h1>
        <div class="title-decoration"></div><br>
        <p class="page-subtitle">Manage degree programs and course offerings for your department</p>
      </div>
      <AppButton 
        variant="primary" 
        @click="openModal()"
        :disabled="loading"
      >
        <span class="icon-wrapper">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </span>
        Add Course
      </AppButton>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon primary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
        </div>
        <div class="stat-info">
          <span class="label">Total Courses</span>
          <span class="value">{{ pagination?.total || courses.length }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon secondary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="label">Active Courses</span>
          <span class="value">{{ statistics.active_courses || 0 }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="stat-info">
          <span class="label">Your Department</span>
          <span class="value">{{ hodDepartment?.name || userDepartmentName }}</span>
        </div>
      </div>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by name or code..." 
            class="search-input"
            :disabled="loading"
          >
        </div>
        <div class="filter-group">
          <select v-model="filterStatus" class="filter-select" :disabled="loading">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div v-if="loading && !courses.length" class="skeleton-wrapper">
        <div v-for="n in 5" :key="n" class="skeleton-row">
           <AppSkeleton width="100%" height="60px" />
        </div>
      </div>

      <div v-else-if="!loading && !courses.length" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
        </div>
        <h3>No Courses Found</h3>
        <p>You haven't created any courses yet. Start by adding your first course.</p>
        <AppButton variant="primary" @click="openModal()">Add Your First Course</AppButton>
      </div>

      <div v-else>
        <AppTable 
          :columns="columns" 
          :data="filteredCourses" 
          hover 
          striped
          :loading="loading && courses.length > 0"
        >
          <template #name="{ item }">
            <div class="course-info">
              <div class="course-header">
                <span class="course-title">{{ item.name }}</span>
                <span class="course-code">{{ item.code }}</span>
              </div>
              <span v-if="item.description" class="course-desc">{{ item.description }}</span>
            </div>
          </template>

          <template #department="{ item }">
            <div class="department-info">
              <div class="avatar-xs">{{ getInitials(item.department?.name || 'N/A') }}</div>
              <div>
                <div class="department-name">{{ item.department?.name || 'N/A' }}</div>
                <div class="department-code">{{ item.department?.code || '' }}</div>
              </div>
            </div>
          </template>

          <template #duration="{ item }">
            <span class="badge duration">
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2" class="mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {{ item.duration }} Years
            </span>
          </template>

          <template #status="{ item }">
            <span class="status-badge" :class="item.status">
              {{ item.status }}
            </span>
          </template>
          
          <template #actions="{ item }">
            <div class="action-group">
              <button class="icon-btn" title="Edit" @click="openModal(item)" :disabled="saving || deleting">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="icon-btn danger" title="Delete" @click="initiateDelete(item)" :disabled="saving || deleting">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </template>
        </AppTable>

        <AppPagination 
          :meta="pagination" 
          @change="fetchCourses" 
        />
      </div>
    </div>

    <AppModal 
      :show="showModal" 
      :title="editingItem ? 'Edit Course' : 'Add New Course'" 
      width="600px"
      @close="closeModal"
      :loading="saving"
    >
      <form @submit.prevent="saveCourse" class="modal-form">
        <div class="form-group">
          <label class="form-label">Course Title <span class="required">*</span></label>
          <input v-model="form.name" type="text" class="form-control" required placeholder="e.g. Bachelor of Science in Computer Science" :disabled="saving">
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Course Code <span class="required">*</span></label>
            <input v-model="form.code" type="text" class="form-control" required placeholder="e.g. BSC-CS" :disabled="saving">
          </div>
          <div class="form-group">
            <label class="form-label">Duration (Years) <span class="required">*</span></label>
            <input v-model.number="form.duration" type="number" class="form-control" required min="1" max="6" :disabled="saving">
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Course Status</label>
            <div class="toggle-container">
              <ToggleSwitch
                v-model="form.statusBoolean"
                @change="handleStatusChange"
                :loading="saving"
                :variant="form.statusBoolean ? 'success' : 'danger'"
                label="Course Status"
              />
              <div class="toggle-hint">{{ form.statusBoolean ? 'Active' : 'Inactive' }}</div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea v-model="form.description" class="form-control" rows="3" placeholder="Optional course description..." :disabled="saving"></textarea>
        </div>

        <div v-if="formErrors.length" class="form-errors">
          <div v-for="(error, index) in formErrors" :key="index" class="error-message">{{ error }}</div>
        </div>

        <div class="modal-actions">
          <AppButton variant="outline" @click="closeModal" :disabled="saving">Cancel</AppButton>
          <AppButton variant="primary" type="submit" :loading="saving">{{ editingItem ? 'Save Changes' : 'Create Course' }}</AppButton>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showDeleteModal" title="Delete Course" width="450px" @close="showDeleteModal = false" :loading="deleting">
      <div class="confirmation-content">
        <div class="warning-icon">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" fill="none" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <h3>Are you sure?</h3>
        <p>You are about to delete <strong>{{ itemToDelete?.name }}</strong>. This action cannot be undone.</p>
        <div v-if="deleteError" class="api-error-message">{{ deleteError }}</div>
      </div>
      <template #footer>
        <div class="modal-actions centered">
          <AppButton variant="outline" @click="showDeleteModal = false" :disabled="deleting">Cancel</AppButton>
          <AppButton variant="danger" @click="executeDelete" :loading="deleting">Delete Course</AppButton>
        </div>
      </template>
    </AppModal>

    <AppSuccessModal
      :show="showSuccessModal"
      :title="successTitle"
      :message="successMessage"
      @close="showSuccessModal = false"
    />

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/api/api'
import AppTable from '../../components/reusable/AppTable.vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppPagination from '../../components/reusable/AppPagination.vue'
import AppSuccessModal from '../../components/reusable/AppSuccessModal.vue'
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'
import ToggleSwitch from '../../components/reusable/ToggleSwitch.vue'

export default {
  name: 'Courses',
  components: { AppTable, AppButton, AppModal, AppPagination, AppSuccessModal, AppSkeleton, ToggleSwitch },
  setup() {
    const authStore = useAuthStore()
    
    // State
    const courses = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)
    const formErrors = ref([])
    const apiError = ref('')
    const deleteError = ref('')
    const statistics = ref({})
    
    // Pagination State
    const pagination = ref({
       current_page: 1, last_page: 1, per_page: 10, total: 0, 
       prev_page_url: null, next_page_url: null 
    })
    
    // Modals
    const showModal = ref(false)
    const showDeleteModal = ref(false)
    const showSuccessModal = ref(false)
    const successTitle = ref('Success')
    const successMessage = ref('')
    
    const editingItem = ref(null)
    const itemToDelete = ref(null)
    
    // Filters
    const searchQuery = ref('')
    const filterStatus = ref('')
    
    // Form
    const form = ref({ name: '', code: '', duration: 3, statusBoolean: true, description: '' })
    
    const hodDepartment = ref(null)
    const userDepartmentName = computed(() => authStore.user?.department?.name || hodDepartment.value?.name || 'Your Department')
    
    const columns = [
      { key: 'name', label: 'Course Details', width: '40%' },
      { key: 'department', label: 'Department', width: '20%' },
      { key: 'duration', label: 'Duration', width: '15%' },
      { key: 'status', label: 'Status', width: '15%' },
    ]

    const filteredCourses = computed(() => {
      // Logic handled mostly by API now, but keep client side filter as fallback for current page
      let data = courses.value
      if (searchQuery.value) {
         data = data.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.value.toLowerCase()))
      }
      if (filterStatus.value) {
         data = data.filter(c => c.status === filterStatus.value)
      }
      return data
    })

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NA'

    const openSuccessModal = (title, message) => {
       successTitle.value = title
       successMessage.value = message
       showSuccessModal.value = true
    }

    const fetchCourses = async (page = 1) => {
      loading.value = true
      try {
        const response = await api.get('/hod/courses', {
          params: { page, search: searchQuery.value, status: filterStatus.value }
        })
        
        if (response.data.success) {
          courses.value = response.data.data
          hodDepartment.value = response.data.department
          if (response.data.meta) pagination.value = response.data.meta
        }
        await fetchStatistics()
      } catch (err) {
        console.error('Error fetching courses:', err)
      } finally {
        loading.value = false
      }
    }

    const fetchStatistics = async () => {
      try {
        const response = await api.get('/courses/statistics')
        if (response.data.success) statistics.value = response.data.data
      } catch (err) {}
    }

    const createCourse = async () => {
      saving.value = true
      formErrors.value = []
      
      const apiData = { ...form.value, status: form.value.statusBoolean ? 'active' : 'inactive' }
      delete apiData.statusBoolean
      
      try {
        const response = await api.post('/hod/courses', apiData)
        if (response.data.success) {
          openSuccessModal('Course Created', 'The course has been successfully created.')
          closeModal()
          fetchCourses() 
        }
      } catch (err) {
         if (err.response?.data?.errors) {
            formErrors.value = Object.values(err.response.data.errors).flat()
         }
      } finally {
        saving.value = false
      }
    }

    const updateCourse = async () => {
      saving.value = true
      formErrors.value = []
      
      const apiData = { ...form.value, status: form.value.statusBoolean ? 'active' : 'inactive' }
      delete apiData.statusBoolean
      
      try {
        const response = await api.put(`/hod/courses/${editingItem.value.id}`, apiData)
        if (response.data.success) {
          openSuccessModal('Course Updated', 'The course details have been updated.')
          closeModal()
          fetchCourses(pagination.value.current_page)
        }
      } catch (err) {
         if (err.response?.data?.errors) {
            formErrors.value = Object.values(err.response.data.errors).flat()
         }
      } finally {
        saving.value = false
      }
    }

    const deleteCourse = async () => {
      deleting.value = true
      try {
        const response = await api.delete(`/hod/courses/${itemToDelete.value.id}`)
        if (response.data.success) {
          showDeleteModal.value = false
          openSuccessModal('Course Deleted', 'The course has been permanently removed.')
          fetchCourses(pagination.value.current_page)
        }
      } catch (err) {
        deleteError.value = err.response?.data?.message || 'Failed to delete course'
      } finally {
        deleting.value = false
      }
    }

    // UI Methods
    const openModal = (item = null) => {
      editingItem.value = item
      formErrors.value = []
      if (item) {
        form.value = { 
          name: item.name, code: item.code, duration: item.duration, 
          statusBoolean: item.status === 'active', description: item.description || '' 
        }
      } else {
        form.value = { name: '', code: '', duration: 3, statusBoolean: true, description: '' }
      }
      showModal.value = true
    }

    const saveCourse = () => editingItem.value ? updateCourse() : createCourse()
    
    const initiateDelete = (item) => {
      itemToDelete.value = item
      deleteError.value = ''
      showDeleteModal.value = true
    }
    const executeDelete = () => itemToDelete.value && deleteCourse()
    
    const closeModal = () => { showModal.value = false; editingItem.value = null }
    const handleStatusChange = (val) => form.value.statusBoolean = val

    // Watchers
    let searchTimeout
    watch([searchQuery, filterStatus], () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => fetchCourses(1), 500)
    })

    onMounted(() => fetchCourses())

    return {
      courses, loading, saving, deleting, formErrors, apiError, deleteError, statistics, pagination,
      showModal, showDeleteModal, showSuccessModal, successTitle, successMessage,
      editingItem, itemToDelete, searchQuery, filterStatus, form,
      hodDepartment, userDepartmentName, columns, filteredCourses,
      openModal, saveCourse, initiateDelete, executeDelete, closeModal,
      fetchCourses, handleStatusChange, getInitials
    }
  }
}
</script>

<style scoped>
.admin-page { max-width: 1200px; margin: 0 auto; padding: var(--spacing-md); }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-lg); }
.page-title { font-size: 2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); max-width: 600px; }
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-lg); }
.stat-card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); display: flex; align-items: center; gap: 16px; }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.secondary { background: var(--secondary-soft); color: var(--secondary-color); }
.stat-icon.success { background: var(--success-soft); color: var(--success-color); }
.stat-info .label { font-size: 0.8rem; color: var(--gray-color); text-transform: uppercase; }
.stat-info .value { font-size: 1.5rem; font-weight: 700; color: var(--dark-color); }

.content-card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); }
.toolbar { display: flex; justify-content: space-between; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); flex-wrap: wrap; }
.search-box { position: relative; width: 100%; max-width: 320px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-color); }
.search-input { width: 100%; padding: 10px 12px 10px 36px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); }
.filter-select { padding: 10px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); min-width: 180px; }

/* Skeleton */
.skeleton-wrapper { display: flex; flex-direction: column; gap: 1rem; padding: 1rem 0; }
.skeleton-row { border-radius: 8px; overflow: hidden; }

/* Empty State */
.empty-state { padding: 3rem; text-align: center; color: var(--gray-color); display: flex; flex-direction: column; align-items: center; }
.empty-icon { color: var(--gray-light); margin-bottom: 1rem; }
.empty-state h3 { color: var(--dark-color); margin-bottom: 0.5rem; }

/* Table Elements */
.course-info { display: flex; flex-direction: column; gap: 4px; }
.course-title { font-weight: 600; color: var(--dark-color); }
.course-code { font-size: 0.8rem; color: var(--gray-color); font-family: monospace; }
.course-desc { font-size: 0.75rem; color: var(--gray-color); max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.department-info { display: flex; align-items: center; gap: 8px; }
.avatar-xs { width: 24px; height: 24px; background: var(--primary-soft); color: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.625rem; font-weight: 700; }
.badge.duration { background: var(--light-color); color: var(--dark-color); border: 1px solid var(--gray-light); display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.status-badge { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.status-badge.active { background: var(--success-soft); color: var(--success-color); }
.status-badge.inactive { background: var(--danger-soft); color: var(--danger-color); }
.action-group { display: flex; gap: 6px; }
.icon-btn { background: transparent; border: none; cursor: pointer; color: var(--gray-color); padding: 6px; border-radius: 4px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.icon-btn:hover { background: var(--light-color); color: var(--primary-color); }
.icon-btn.danger:hover { background: var(--danger-soft); color: var(--danger-color); }

/* Modal & Form */
.modal-form { display: flex; flex-direction: column; gap: var(--spacing-md); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; }
.form-control { width: 100%; padding: 10px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); }
.modal-actions { display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.modal-actions.centered { justify-content: center; }
.confirmation-content { text-align: center; padding: var(--spacing-md) 0; }
.warning-icon { width: 64px; height: 64px; background: rgba(229, 57, 53, 0.1); color: var(--danger-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-lg); }
.form-errors { background: var(--danger-soft); color: var(--danger-color); padding: 10px; border-radius: 6px; font-size: 0.9rem; }

/* Toggle */
.toggle-container { display: flex; align-items: center; gap: 10px; }
.toggle-hint { font-size: 0.85rem; color: var(--gray-color); }

@media (max-width: 768px) {
  .grid-2 { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: 1fr; }
}
</style>