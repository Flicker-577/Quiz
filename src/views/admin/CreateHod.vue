<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Departments</h1>
        <p class="page-subtitle">Manage academic faculties and organizational units</p>
      </div>
      <AppButton variant="primary" @click="openModal()" :disabled="loading">
        <span class="icon-wrapper">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </span>
        Add Department
      </AppButton>
    </div>

    <div class="stats-row">
      <template v-if="loading">
        <div v-for="n in 4" :key="n" class="stat-card">
          <AppSkeleton type="circle" width="48px" height="48px" />
          <div class="stat-info" style="width: 100%">
            <AppSkeleton width="60%" height="0.8rem" class="mb-1" />
            <AppSkeleton width="40%" height="1.5rem" />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="stat-card">
          <div class="stat-icon primary">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <div class="stat-info">
            <span class="label">Total Departments</span>
            <span class="value">{{ statistics.total_departments || 0 }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon secondary">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="label">Active Courses</span>
            <span class="value">{{ statistics.active_courses || 0 }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="label">Active Departments</span>
            <span class="value">{{ statistics.active_departments || 0 }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="label">Departments with HOD</span>
            <span class="value">{{ statistics.departments_with_hod || 0 }}</span>
          </div>
        </div>
      </template>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" v-model="searchQuery" placeholder="Search departments..." class="search-input">
        </div>
      </div>

      <div v-if="loading" class="skeleton-table">
        <div class="skeleton-header">
           <AppSkeleton width="100%" height="40px" borderRadius="8px" />
        </div>
        <div class="skeleton-rows">
           <div v-for="n in 5" :key="n" class="skeleton-row">
              <div class="s-cell" style="width: 25%"><AppSkeleton width="80%" /></div>
              <div class="s-cell" style="width: 10%"><AppSkeleton width="60%" /></div>
              <div class="s-cell" style="width: 15%"><AppSkeleton width="60%" borderRadius="12px" /></div>
              <div class="s-cell" style="width: 20%"><AppSkeleton type="circle" width="32px" height="32px" /><AppSkeleton width="100px" class="ml-2" /></div>
              <div class="s-cell" style="width: 30%"><AppSkeleton width="90%" /></div>
           </div>
        </div>
      </div>

      <template v-else>
        <AppTable 
          :columns="columns" 
          :data="filteredDepartments" 
          hover 
          striped
        >
          <template #code="{ item }">
            <span class="badge code">{{ item.code }}</span>
          </template>

          <template #status="{ item }">
            <ToggleSwitch
              :modelValue="item.status === 'active'"
              @change="toggleDepartmentStatus(item, $event)"
              :loading="loadingStatus[item.id]"
              :variant="item.status === 'active' ? 'success' : 'danger'"
              :label="item.status === 'active' ? 'Active' : 'Inactive'"
            />
          </template>

          <template #head="{ item }">
            <div class="user-cell" v-if="item.hod">
              <div class="avatar-xs">{{ getInitials(item.hod.name) }}</div>
              <div class="user-info">
                <span class="text-sm">{{ item.hod.name }}</span>
                <span class="text-xs text-muted">{{ item.hod.email }}</span>
              </div>
            </div>
            <span v-else class="text-muted">Unassigned</span>
          </template>
          
          <template #actions="{ item }">
            <div class="action-group">
              <button class="icon-btn" title="Edit" @click="openModal(item)">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="icon-btn danger" title="Delete" @click="initiateDelete(item)">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </template>
        </AppTable>

        <div v-if="departments.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" fill="none" stroke-width="1">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <h3>No Departments Found</h3>
          <p>Get started by creating your first department.</p>
          <AppButton variant="primary" @click="openModal()">Create Department</AppButton>
        </div>

        <AppPagination 
          v-if="paginationMeta && paginationMeta.last_page > 1"
          :meta="paginationMeta"
          @change="fetchDepartments"
        />
      </template>
    </div>

    <AppModal :show="showModal" :title="editingItem ? 'Edit Department' : 'New Department'" width="550px" @close="closeModal">
      <form @submit.prevent="saveDepartment" class="modal-form">
        <div class="grid-2">
          <div class="form-group">
            <label>Department Name <span class="required">*</span></label>
            <input v-model="form.name" type="text" class="form-control" required placeholder="e.g. Computer Science">
          </div>
          <div class="form-group">
            <label>Code <span class="required">*</span></label>
            <input v-model="form.code" type="text" class="form-control" required placeholder="e.g. CS">
          </div>
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" class="form-control" rows="3" placeholder="Brief overview of the department..."></textarea>
        </div>
        
        <div class="modal-actions">
          <AppButton variant="outline" @click="closeModal" :disabled="saving">Cancel</AppButton>
          <AppButton variant="primary" type="submit" :loading="saving">
            {{ editingItem ? 'Update Department' : 'Create Department' }}
          </AppButton>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showDeleteModal" title="Delete Department" width="450px" @close="showDeleteModal = false">
      <div class="confirmation-content">
        <div class="warning-icon">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" fill="none" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h3>Are you sure?</h3>
        <p>
          You are about to delete the <strong>{{ itemToDelete?.name }}</strong> department. 
          This will remove all HOD assignments and might affect linked courses and users.
        </p>
      </div>
      <template #footer>
        <div class="modal-actions centered">
          <AppButton variant="outline" @click="showDeleteModal = false">Cancel</AppButton>
          <AppButton variant="danger" @click="executeDelete" :loading="deleting">
            Delete Department
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
import { useToast } from 'vue-toastification'
import AppTable from '../../components/reusable/AppTable.vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'
import AppPagination from '../../components/reusable/AppPagination.vue'
import AppSuccessModal from '../../components/reusable/AppSuccessModal.vue'
import ToggleSwitch from '../../components/reusable/ToggleSwitch.vue'
import api from '@/api/api'

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()
}

export default {
  name: 'Departments',
  components: { 
    AppTable, 
    AppButton, 
    AppModal, 
    ToggleSwitch, 
    AppSkeleton, 
    AppPagination,
    AppSuccessModal 
  },
  setup() {
    const toast = useToast()
    
    // State
    const showModal = ref(false)
    const showDeleteModal = ref(false)
    const showSuccessModal = ref(false)
    const successMessage = ref('')
    const successTitle = ref('Success')
    
    const editingItem = ref(null)
    const itemToDelete = ref(null)
    const searchQuery = ref('')
    const loading = ref(true)
    const saving = ref(false)
    const deleting = ref(false)
    const loadingStatus = ref({})
    const paginationMeta = ref(null)
    
    // Data
    const departments = ref([])
    const statistics = ref({})
    
    // Form
    const form = ref({ 
      name: '', 
      code: '', 
      description: '', 
      status: 'active' 
    })
    
    const columns = [
      { key: 'name', label: 'Department Name', width: '25%' },
      { key: 'code', label: 'Code', width: '10%' },
      { key: 'status', label: 'Status', width: '15%' },
      { key: 'head', label: 'Head of Dept', width: '20%' },
      { key: 'description', label: 'Description', width: '20%' },
      { key: 'actions', label: 'Actions', width: '10%' }
    ]

    // Computed properties
    const filteredDepartments = computed(() => {
      if (!searchQuery.value) return departments.value
      
      const query = searchQuery.value.toLowerCase()
      return departments.value.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        (d.hod && d.hod.name.toLowerCase().includes(query)) ||
        (d.hod && d.hod.email && d.hod.email.toLowerCase().includes(query))
      )
    })

    // Methods
    const fetchDepartments = async (page = 1) => {
      loading.value = true
      
      // Delay for skeleton visualization
      await new Promise(resolve => setTimeout(resolve, 600))

      try {
        const response = await api.get(`/departments?page=${page}`)
        
        if (response.data.success) {
          // Handle standard Laravel pagination structure if present, else array
          const rawData = response.data.data.data ? response.data.data.data : response.data.data
          
          if (response.data.data.current_page) {
             paginationMeta.value = {
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                prev_page_url: response.data.data.prev_page_url,
                next_page_url: response.data.data.next_page_url
             }
          }

          departments.value = rawData.map(dept => ({
            id: dept.id,
            name: dept.name,
            code: dept.code,
            description: dept.description,
            status: dept.status,
            created_at: dept.created_at,
            hod: dept.hod || null
          }))
        } else {
          toast.error('Failed to fetch departments: ' + (response.data.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error fetching departments:', error)
        toast.error('Error loading departments')
      } finally {
        loading.value = false
      }
    }

    const fetchStatistics = async () => {
      try {
        const response = await api.get('/departments/statistics')
        if (response.data.success) {
          statistics.value = response.data.data
        }
      } catch (error) {
        console.error('Error fetching statistics:', error)
      }
    }

    const openModal = (item = null) => {
      editingItem.value = item
      if (item && item.id) {
        form.value = { 
          name: item.name || '', 
          code: item.code || '', 
          description: item.description || '',
          status: item.status || 'active'
        }
      } else {
        form.value = { 
          name: '', 
          code: '', 
          description: '', 
          status: 'active' 
        }
      }
      showModal.value = true
    }

    const triggerSuccess = (title, message) => {
      successTitle.value = title
      successMessage.value = message
      showSuccessModal.value = true
    }

    const saveDepartment = async () => {
      saving.value = true
      try {
        let response
        if (editingItem.value && editingItem.value.id) {
          response = await api.put(`/departments/${editingItem.value.id}`, form.value)
        } else {
          response = await api.post('/departments', form.value)
        }
        
        if (response.data.success) {
          closeModal()
          await fetchDepartments()
          await fetchStatistics()
          triggerSuccess('Department Saved', response.data.message || 'Department processed successfully.')
        } else {
          toast.error(response.data.message || 'Failed to save department')
        }
      } catch (error) {
        if (error.response?.data?.errors) {
          Object.values(error.response.data.errors).flat().forEach(msg => toast.error(msg))
        } else {
          toast.error('Error saving department: ' + (error.message || 'Unknown error'))
        }
      } finally {
        saving.value = false
      }
    }

    const toggleDepartmentStatus = async (department, isActive) => {
      if (!department.id) return
      
      loadingStatus.value[department.id] = true
      try {
        const newStatus = isActive ? 'active' : 'inactive'
        const response = await api.patch(`/departments/${department.id}/status`, {
          status: newStatus
        })
        
        if (response.data.success) {
          const index = departments.value.findIndex(d => d.id === department.id)
          if (index !== -1) {
            departments.value[index].status = newStatus
          }
          await fetchStatistics()
          toast.success(`Department is now ${newStatus}`)
        } else {
          toast.error('Failed to update status')
        }
      } catch (error) {
        toast.error('Error updating status')
      } finally {
        loadingStatus.value[department.id] = false
      }
    }

    const initiateDelete = (item) => {
      itemToDelete.value = item
      showDeleteModal.value = true
    }

    const executeDelete = async () => {
      deleting.value = true
      try {
        const response = await api.delete(`/departments/${itemToDelete.value.id}`)
        
        if (response.data.success) {
          showDeleteModal.value = false
          itemToDelete.value = null
          await fetchDepartments()
          await fetchStatistics()
          triggerSuccess('Deleted', 'Department deleted successfully.')
        } else {
          toast.error(response.data.message || 'Failed to delete department')
        }
      } catch (error) {
        toast.error('Error deleting department')
      } finally {
        deleting.value = false
      }
    }
    
    const closeModal = () => { 
      showModal.value = false 
      editingItem.value = null
      form.value = { name: '', code: '', description: '', status: 'active' }
    }

    // Lifecycle
    onMounted(() => {
      fetchDepartments()
      fetchStatistics()
    })

    return {
      columns,
      departments,
      filteredDepartments,
      statistics,
      searchQuery,
      showModal,
      showDeleteModal,
      showSuccessModal,
      successTitle,
      successMessage,
      editingItem,
      itemToDelete,
      form,
      loading,
      saving,
      deleting,
      loadingStatus,
      paginationMeta,
      openModal,
      saveDepartment,
      initiateDelete,
      executeDelete,
      closeModal,
      toggleDepartmentStatus,
      fetchDepartments,
      getInitials
    }
  }
}
</script>

<style scoped>
.admin-page { max-width: 1200px; margin: 0 auto; padding: var(--spacing-md); }

/* Header */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); }
.page-title { font-size: 1.75rem; font-weight: 700; color: var(--dark-color); margin-bottom: 4px; }
.page-subtitle { color: var(--gray-color); }
.icon-wrapper { margin-right: 8px; display: flex; align-items: center; }

/* Stats Row */
.stats-row {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-md); margin-bottom: var(--spacing-lg);
}
.stat-card {
  background: white; padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-light); display: flex; align-items: center; gap: 16px;
}
.stat-icon {
  width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
}
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.secondary { background: var(--secondary-soft); color: var(--secondary-color); }
.stat-icon.success { background: var(--success-soft); color: var(--success-color); }
.stat-icon.warning { background: var(--warning-soft); color: var(--warning-color); }

.stat-info { display: flex; flex-direction: column; }
.stat-info .label { font-size: 0.8rem; color: var(--gray-color); text-transform: uppercase; letter-spacing: 0.5px; }
.stat-info .value { font-size: 1.5rem; font-weight: 700; color: var(--dark-color); line-height: 1.2; }

/* Content Card */
.content-card { 
  background: white; 
  padding: var(--spacing-lg); 
  border-radius: var(--border-radius-lg); 
  box-shadow: var(--shadow-sm); 
  border: 1px solid var(--gray-light); 
  min-height: 400px;
}

.toolbar { margin-bottom: var(--spacing-lg); }
.search-box { position: relative; max-width: 300px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-color); }
.search-input { width: 100%; padding: 10px 12px 10px 36px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); transition: border-color 0.2s; }
.search-input:focus { outline: none; border-color: var(--primary-color); }

/* Table & Badges */
.badge.code { 
  background: var(--light-color); 
  color: var(--dark-color); 
  padding: 4px 8px; 
  border-radius: 4px; 
  font-weight: 600; 
  border: 1px solid var(--gray-light); 
  font-size: 0.8rem; 
  display: inline-block;
}

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-info { display: flex; flex-direction: column; }
.avatar-xs { 
  width: 32px; 
  height: 32px; 
  background: var(--primary-soft); 
  color: var(--primary-color); 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 0.8rem; 
  font-weight: 700; 
  flex-shrink: 0;
}
.text-sm { font-size: 0.9rem; font-weight: 500; color: var(--dark-color); }
.text-xs { font-size: 0.75rem; }
.text-muted { color: var(--gray-color); font-style: italic; }

.action-group { display: flex; gap: 6px; justify-content: flex-end; }
.icon-btn { 
  background: transparent; 
  border: none; 
  cursor: pointer; 
  color: var(--gray-color); 
  padding: 6px; 
  border-radius: 4px; 
  transition: all 0.2s; 
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-btn:hover { background: var(--light-color); color: var(--primary-color); }
.icon-btn.danger:hover { background: var(--danger-soft); color: var(--danger-color); }

/* Modal */
.modal-form { display: flex; flex-direction: column; gap: var(--spacing-md); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: var(--dark-color); font-size: 0.9rem; }
.form-control { 
  width: 100%; 
  padding: 10px; 
  border: 1px solid var(--gray-light); 
  border-radius: var(--border-radius-md); 
  transition: border-color 0.2s; 
  font-size: 0.9rem;
}
.form-control:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px var(--primary-soft); }
textarea.form-control { resize: vertical; min-height: 80px; }
.modal-actions { display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.modal-actions.centered { justify-content: center; }

/* Confirmation Content */
.confirmation-content { text-align: center; padding: var(--spacing-md) 0; }
.warning-icon { 
  width: 64px; height: 64px; background: rgba(229, 57, 53, 0.1); color: var(--danger-color); 
  border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-lg); 
}
.confirmation-content h3 { margin-bottom: var(--spacing-sm); color: var(--dark-color); }
.confirmation-content p { color: var(--gray-color); line-height: 1.5; }

/* Empty State */
.empty-state {
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  color: var(--gray-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.empty-state svg {
  color: var(--gray-light);
  margin-bottom: var(--spacing-sm);
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0;
}

.empty-state p {
  margin: 0;
  font-size: 0.95rem;
}

.required { color: var(--danger-color); margin-left: 2px; }
.status-toggle { padding: 8px 0; }

/* Skeleton Utils */
.skeleton-table { display: flex; flex-direction: column; gap: 1rem; }
.skeleton-header { padding: 8px 0; border-bottom: 1px solid var(--gray-light); }
.skeleton-rows { display: flex; flex-direction: column; gap: 0; }
.skeleton-row { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--gray-light); gap: 10px; }
.s-cell { display: flex; align-items: center; gap: 10px; }
.mb-1 { margin-bottom: 4px; }
.ml-2 { margin-left: 8px; }

/* Responsive */
@media (max-width: 768px) {
  .grid-2, .stats-row { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; align-items: flex-start; gap: var(--spacing-md); }
  .search-box { max-width: 100%; }
  .content-card { padding: var(--spacing-md); }
}
</style>