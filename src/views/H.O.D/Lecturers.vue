<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Lecturers & Staff</h1>
        <div class="title-decoration"></div><br>
        <p class="page-subtitle">Manage faculty members in your {{ currentDepartment?.name }} department</p>
      </div>
      <div class="header-actions">
        <AppButton variant="primary" @click="openModal()">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          </span>
          Register Lecturer
        </AppButton>
      </div>
    </div>

    <div v-if="loading" class="stats-row">
      <div v-for="n in 3" :key="n" class="skeleton-stat-card">
        <AppSkeleton type="card" height="100%" borderRadius="12px" />
      </div>
    </div>

    <div v-else class="stats-row">
      <div class="stat-card">
        <div class="stat-icon primary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="stat-info">
          <span class="label">Total Lecturers</span>
          <span class="value">{{ pagination?.total || lecturers.length }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="label">Active Now</span>
          <span class="value">{{ activeCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon secondary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        </div>
        <div class="stat-info">
          <span class="label">Assigned Modules</span>
          <span class="value">{{ assignedModulesCount }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="content-card">
      <div class="toolbar-skeleton">
        <AppSkeleton width="300px" height="42px" borderRadius="8px" />
        <AppSkeleton width="100px" height="42px" borderRadius="8px" />
      </div>
      <div class="table-skeleton">
         <AppSkeleton width="100%" height="50px" borderRadius="4px" class="mb-2" />
         <AppSkeleton :count="5" width="100%" height="60px" borderRadius="4px" />
      </div>
    </div>

    <div v-else class="content-card">
      <div class="toolbar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" v-model="searchQuery" placeholder="Search by name or email..." class="search-input">
        </div>
        <AppButton variant="outline" @click="fetchLecturers(1)" title="Refresh Data">Refresh</AppButton>
      </div>

      <div v-if="!lecturers.length" class="empty-state">
         <h3>No Lecturers Found</h3>
         <p>Get started by registering your first lecturer.</p>
      </div>

      <div v-else>
        <AppTable :columns="columns" :data="filteredLecturers" hover striped>
          <template #name="{ item }">
            <div class="user-cell">
              <div class="avatar" :class="getRandomColor(item.id)">
                {{ getInitials(item.name) }}
              </div>
              <div class="user-info">
                <span class="name">{{ item.name }}</span>
                <span class="email">{{ item.email }}</span>
                <span class="role-badge">Lecturer</span>
              </div>
            </div>
          </template>
          <template #department_name="{ item }">
            <span class="badge dept">{{ item.department?.name || currentDepartment?.name }}</span>
          </template>
          <template #phone="{ item }">
            <span class="phone">{{ item.phone || 'N/A' }}</span>
          </template>
          <template #status="{ item }">
            <span class="status-indicator" :class="item.status === 'active' ? 'active' : 'inactive'">
              <span class="dot" :class="item.status === 'active' ? 'dot-active' : 'dot-inactive'"></span>
              {{ item.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </template>
          <template #actions="{ item }">
            <div class="action-group">
              <button class="icon-btn" title="Edit" @click="openModal(item)">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="icon-btn danger" title="Delete" @click="initiateDelete(item)">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </template>
        </AppTable>
        
        <AppPagination 
          :meta="pagination" 
          @change="fetchLecturers" 
        />
      </div>
    </div>

    <AppModal 
      :show="showModal" 
      :title="editingItem ? 'Edit Lecturer Profile' : 'Register New Lecturer'" 
      width="600px"
      @close="closeModal"
    >
      <form @submit.prevent="saveLecturer" class="modal-form">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input v-model="form.name" class="form-control" required placeholder="e.g. Dr. Alan Grant">
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input v-model="form.email" type="email" class="form-control" required placeholder="alan.grant@university.edu">
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input v-model="form.phone" type="tel" class="form-control" required placeholder="+255 123 456 789">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Account Status</label>
          <div class="toggle-switch-container">
            <input type="checkbox" id="statusToggle" class="toggle-switch-checkbox" v-model="form.is_active" />
            <label for="statusToggle" class="toggle-switch-label"></label>
            <span class="toggle-switch-text">{{ form.is_active ? 'Active' : 'Inactive' }}</span>
          </div>
        </div>

        <div class="info-message">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Default password will be set to the email address. User can change it after first login.
        </div>
        
        <div class="modal-actions">
          <AppButton variant="outline" @click="closeModal" type="button">Cancel</AppButton>
          <AppButton variant="primary" type="submit" :disabled="loading">
            <span v-if="loading" class="btn-loading-content">
              <AppSpinner size="sm" color="light" /> Saving...
            </span>
            <span v-else>{{ editingItem ? 'Save Changes' : 'Register Lecturer' }}</span>
          </AppButton>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showDeleteModal" title="Remove Lecturer" width="450px" @close="showDeleteModal = false">
      <div class="confirmation-content">
        <div class="warning-icon">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>
        </div>
        <h3>Revoke Access?</h3>
        <p>You are about to remove <strong>{{ itemToDelete?.name }}</strong>. They will lose access to the dashboard immediately.</p>
      </div>
      <template #footer>
        <div class="modal-actions centered">
          <AppButton variant="outline" @click="showDeleteModal = false">Cancel</AppButton>
          <AppButton variant="danger" @click="executeDelete" :disabled="loading">
             <span v-if="loading" class="btn-loading-content">
              <AppSpinner size="sm" color="light" /> Removing...
            </span>
            <span v-else>Remove Lecturer</span>
          </AppButton>
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
import { ref, computed, onMounted } from 'vue'
import { useLecturerStore } from '@/stores/lecturer'
import AppTable from '../../components/reusable/AppTable.vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppPagination from '../../components/reusable/AppPagination.vue'
import AppSuccessModal from '../../components/reusable/AppSuccessModal.vue'
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'
import AppSpinner from '../../components/reusable/AppSpinner.vue'
import api from '@/api/api'

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : ''

export default {
  name: 'Lecturers',
  components: { AppTable, AppButton, AppModal, AppPagination, AppSuccessModal, AppSkeleton, AppSpinner },
  setup() {
    const lecturerStore = useLecturerStore()
    
    // UI State
    const showModal = ref(false)
    const showDeleteModal = ref(false)
    const showSuccessModal = ref(false)
    const successTitle = ref('Success')
    const successMessage = ref('')
    
    const editingItem = ref(null)
    const itemToDelete = ref(null)
    const searchQuery = ref('')
    const loading = ref(false)
    
    // Pagination
    const pagination = ref({ current_page: 1, last_page: 1, per_page: 10, total: 0 })
    
    const form = ref({ name: '', email: '', phone: '', is_active: true })
    const currentDepartment = ref(null)
    
    const columns = [
      { key: 'name', label: 'Lecturer Profile', width: '35%' },
      { key: 'department_name', label: 'Department', width: '20%' },
      { key: 'phone', label: 'Phone', width: '15%' },
      { key: 'status', label: 'Status', width: '15%' },
    ]

    const fetchCurrentDepartment = async () => {
      try {
        const response = await api.get('/auth/me')
        if (response.data.department_id) {
          const deptResponse = await api.get(`/departments/${response.data.department_id}`)
          currentDepartment.value = deptResponse.data
        }
      } catch (error) {}
    }

    const fetchLecturers = async (page = 1) => {
      loading.value = true
      try {
        await lecturerStore.fetchLecturers(page) 
        
        if(lecturerStore.pagination) {
           pagination.value = lecturerStore.pagination
        } else {
           pagination.value.total = lecturerStore.lecturers.length
        }
      } catch (error) {
        console.error('Failed to fetch lecturers:', error)
      } finally {
        // UPDATED: Added delay for smoother transition
        setTimeout(() => { loading.value = false }, 500)
      }
    }

    const openSuccessModal = (title, message) => {
       successTitle.value = title
       successMessage.value = message
       showSuccessModal.value = true
    }

    const saveLecturer = async () => {
      loading.value = true
      try {
        const lecturerData = { name: form.value.name, email: form.value.email, phone: form.value.phone, is_active: Boolean(form.value.is_active) }

        if (editingItem.value) {
          await lecturerStore.updateLecturer(editingItem.value.id, lecturerData)
          openSuccessModal('Profile Updated', 'Lecturer details updated successfully.')
        } else {
          await lecturerStore.createLecturer(lecturerData)
          openSuccessModal('Registration Complete', 'New lecturer has been registered successfully.')
        }
        
        showModal.value = false
        resetForm()
      } catch (error) {
         alert('Failed to save: ' + (error.response?.data?.message || error.message))
      } finally {
        loading.value = false
      }
    }

    const executeDelete = async () => {
      if (itemToDelete.value) {
        loading.value = true
        try {
          await lecturerStore.deleteLecturer(itemToDelete.value.id)
          showDeleteModal.value = false
          itemToDelete.value = null
          openSuccessModal('Lecturer Removed', 'Access has been revoked successfully.')
        } catch (error) {
           alert('Failed to delete: ' + (error.response?.data?.message || error.message))
        } finally {
          loading.value = false
        }
      }
    }

    const resetForm = () => { form.value = { name: '', email: '', phone: '', is_active: true }; editingItem.value = null }

    const openModal = (item = null) => {
      editingItem.value = item
      if (item) {
        form.value = { name: item.name, email: item.email, phone: item.phone || '', is_active: item.status === 'active' }
      } else {
        resetForm()
      }
      showModal.value = true
    }
    const closeModal = () => { showModal.value = false; resetForm() }
    const initiateDelete = (item) => { itemToDelete.value = item; showDeleteModal.value = true }
    
    // Computed
    const lecturers = computed(() => lecturerStore.lecturers)
    const activeCount = computed(() => lecturerStore.lecturers.filter(l => l.status === 'active').length)
    const assignedModulesCount = computed(() => activeCount.value * 3) // Mock calculation
    const filteredLecturers = computed(() => lecturers.value.filter(l => l.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || l.email.toLowerCase().includes(searchQuery.value.toLowerCase())))
    const getRandomColor = (id) => ['bg-blue', 'bg-purple', 'bg-green', 'bg-orange'][id % 4]

    onMounted(() => { fetchCurrentDepartment(); fetchLecturers() })

    return {
      columns, filteredLecturers, currentDepartment, searchQuery, showModal, showDeleteModal, showSuccessModal, successTitle, successMessage,
      editingItem, itemToDelete, form, lecturers, loading, activeCount, assignedModulesCount, pagination,
      getInitials, getRandomColor, openModal, saveLecturer, initiateDelete, executeDelete, closeModal, fetchLecturers
    }
  }
}
</script>

<style scoped>
.admin-page { max-width: 1200px; margin: 0 auto; padding: var(--spacing-md); }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-lg); }
.page-title { font-size: 2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
/* PRESERVED: Unique decoration for this page */
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); margin-bottom: 8px; }
.department-badge { margin-top: 8px; }
.header-actions { display: flex; gap: var(--spacing-sm); }
.icon-wrapper { margin-right: 8px; display: flex; align-items: center; }

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

/* NEW SKELETON STYLES */
.skeleton-stat-card {
  height: 100px;
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.toolbar-skeleton {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.table-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mb-2 { margin-bottom: 8px; }

.btn-loading-content { display: flex; align-items: center; gap: 8px; }
.empty-state { padding: 40px; text-align: center; color: var(--gray-color); }

/* User Cell */
.user-cell { display: flex; align-items: center; gap: 12px; }
.avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; color: white; }
.bg-blue { background: linear-gradient(135deg, #667eea, #764ba2); }
.bg-purple { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
.bg-green { background: linear-gradient(135deg, #10b981, #059669); }
.bg-orange { background: linear-gradient(135deg, #f97316, #ea580c); }
.user-info { display: flex; flex-direction: column; }
.name { font-weight: 600; color: var(--dark-color); font-size: 0.95rem; }
.email { font-size: 0.8rem; color: var(--gray-color); }
.badge { padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.badge.dept { background: var(--light-color); color: var(--gray-dark); border: 1px solid var(--gray-light); }
.status-indicator { font-size: 0.8rem; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; }
.status-indicator .dot { width: 8px; height: 8px; border-radius: 50%; }
.dot-active { background: var(--success-color); box-shadow: 0 0 6px rgba(34, 197, 94, 0.4); }
.dot-inactive { background: var(--gray-color); }
.status-indicator.active { color: var(--success-dark); font-weight: 600; }
.status-indicator.inactive { color: var(--gray-dark); }
.action-group { display: flex; gap: 6px; }
.icon-btn { background: transparent; border: none; cursor: pointer; color: var(--gray-color); padding: 6px; border-radius: 4px; }
.icon-btn:hover { background: var(--light-color); color: var(--primary-color); }
.icon-btn.danger:hover { background: var(--danger-soft); color: var(--danger-color); }

/* Modal */
.modal-form { display: flex; flex-direction: column; gap: var(--spacing-md); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; }
.form-control { width: 100%; padding: 10px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); }
.modal-actions { display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.modal-actions.centered { justify-content: center; }
.confirmation-content { text-align: center; padding: var(--spacing-md) 0; }
.warning-icon { width: 64px; height: 64px; background: rgba(229, 57, 53, 0.1); color: var(--danger-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-lg); }

/* Toggle */
.toggle-switch-container { display: flex; align-items: center; gap: var(--spacing-sm); background: var(--light-color); padding: var(--spacing-md); border-radius: var(--border-radius-md); border: 1px solid var(--gray-light); }
.toggle-switch-checkbox { height: 0; width: 0; visibility: hidden; }
.toggle-switch-label { cursor: pointer; width: 40px; height: 22px; background: var(--gray-color); display: block; border-radius: 100px; position: relative; }
.toggle-switch-label::after { content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: 0.3s; }
.toggle-switch-checkbox:checked + .toggle-switch-label { background: var(--success-color); }
.toggle-switch-checkbox:checked + .toggle-switch-label::after { left: calc(100% - 2px); transform: translateX(-100%); }
.info-message { display: flex; align-items: flex-start; gap: 8px; padding: 12px; background: var(--info-soft); border: 1px solid var(--info-color); border-radius: var(--border-radius-md); color: var(--info-dark); font-size: 0.85rem; }

@media (max-width: 768px) {
  .grid-2 { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: 1fr; }
}
</style>