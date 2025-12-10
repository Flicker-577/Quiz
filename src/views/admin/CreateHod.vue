<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Heads of Department</h1>
        <p class="page-subtitle">Manage HODs, department assignments, and system access</p>
      </div>
      <div class="header-actions">
        <AppButton variant="outline">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          </span>
          Export List
        </AppButton>
        
        <AppButton variant="primary" @click="openModal()">
          <span class="icon-wrapper">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          </span>
          Register HOD
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
          <span class="label">Total HODs</span>
          <span class="value">{{ hods.length }}</span>
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
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="label">Departments Covered</span>
          <span class="value">{{ assignedDepartmentsCount }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="content-card">
      <div class="toolbar-skeleton">
        <AppSkeleton width="300px" height="42px" borderRadius="8px" />
        <AppSkeleton width="200px" height="42px" borderRadius="8px" />
      </div>
      <div class="table-skeleton">
        <AppSkeleton width="100%" height="50px" borderRadius="4px" style="margin-bottom: 10px" />
        <AppSkeleton :count="5" width="100%" height="60px" borderRadius="4px" />
      </div>
    </div>

    <div v-else class="content-card">
      <div class="toolbar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" v-model="searchQuery" placeholder="Search by name or email..." class="search-input">
        </div>
        <div class="filter-group">
          <select v-model="filterDept" class="filter-select">
            <option value="">All Departments</option>
            <option v-for="dept in departmentStore.departmentOptions" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
      </div>

      <AppTable :columns="columns" :data="filteredHods" hover striped>
        <template #name="{ item }">
          <div class="user-cell">
            <div class="avatar" :class="getRandomColor(item.id)">
              {{ getInitials(item.name) }}
            </div>
            <div class="user-info">
              <span class="name">{{ item.name }}</span>
              <span class="email">{{ item.email }}</span>
              <span class="role-badge">HOD</span>
            </div>
          </div>
        </template>
        <template #department_name="{ item }">
          <span class="badge dept">{{ item.department_name }}</span>
        </template>
        <template #phone="{ item }">
          <span class="phone">{{ item.phone || 'N/A' }}</span>
        </template>
        <template #is_active="{ item }">
          <span class="status-indicator" :class="item.is_active ? 'active' : 'inactive'">
            <span class="dot"></span> {{ item.is_active ? 'Active' : 'Inactive' }}
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
        :meta="paginationMeta" 
        @change="handlePageChange"
      />
    </div>

    <AppModal 
      :show="showModal" 
      :title="editingItem ? 'Edit HOD Profile' : 'Register New HOD'" 
      width="600px"
      @close="closeModal"
    >
      <form @submit.prevent="saveHod" class="modal-form">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input v-model="form.name" class="form-control" required placeholder="e.g. Dr. John Smith">
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input v-model="form.email" type="email" class="form-control" required placeholder="john.smith@university.edu">
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
            <span class="toggle-switch-text">
              {{ form.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Assign Department</label>
          <div class="searchable-select">
            <div class="select-header" @click="toggleDepartmentDropdown">
              <span class="selected-value">
                {{ selectedDepartmentName || '-- Select Department --' }}
              </span>
              <svg class="dropdown-arrow" :class="{ rotated: showDepartmentDropdown }" 
                   viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            
            <div v-if="showDepartmentDropdown" class="dropdown-content">
              <div class="search-input-wrapper">
                <svg class="search-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  v-model="departmentSearch" 
                  type="text" 
                  class="search-input" 
                  placeholder="Search departments..."
                  @click.stop
                >
              </div>
              
              <div class="options-list">
                <div 
                  v-for="dept in availableDepartments" 
                  :key="dept.id"
                  class="option-item"
                  :class="{ selected: form.department_id === dept.id, unavailable: dept.has_hod }"
                  @click="selectDepartment(dept)"
                >
                  <div class="department-info">
                    <div class="avatar-xs">{{ getInitials(dept.name) }}</div>
                    <div>
                      <div class="department-name">{{ dept.name }}</div>
                      <div class="department-code">{{ dept.code }}</div>
                      <div v-if="dept.has_hod" class="department-status">
                        <small class="text-warning">Already has HOD</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="availableDepartments.length === 0" class="no-options">
                  No departments available
                </div>
              </div>
            </div>
          </div>
          <div v-if="form.department_id && selectedDepartmentHasHod" class="warning-message">
            ⚠️ This department already has an assigned HOD. Assigning a new HOD will replace the current one.
          </div>
        </div>

        <div class="info-message">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Default password will be set to the email address. User can change it after first login.
        </div>
        
        <div class="modal-actions">
          <AppButton variant="outline" @click="closeModal" type="button">Cancel</AppButton>
          <AppButton variant="primary" type="submit" :disabled="!form.department_id || departmentStore.loading || isSubmitting">
            <span v-if="departmentStore.loading || isSubmitting" class="btn-loading-content">
              <AppSpinner size="sm" color="light" /> Saving...
            </span>
            <span v-else>{{ editingItem ? 'Save Changes' : 'Register HOD' }}</span>
          </AppButton>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showDeleteModal" title="Remove Head of Department" width="450px" @close="showDeleteModal = false">
      <div class="confirmation-content">
        <div class="warning-icon">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" fill="none" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="18" y1="8" x2="23" y2="13"></line>
            <line x1="23" y1="8" x2="18" y2="13"></line>
          </svg>
        </div>
        <h3>Revoke HOD Access?</h3>
        <p>
          You are about to remove <strong>{{ itemToDelete?.name }}</strong> as Head of Department for 
          <strong>{{ itemToDelete?.department_name }}</strong>. 
          They will lose access to the HOD dashboard immediately.
        </p>
      </div>
      <template #footer>
        <div class="modal-actions centered">
          <AppButton variant="outline" @click="showDeleteModal = false">Cancel</AppButton>
          <AppButton variant="danger" @click="executeDelete" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="btn-loading-content">
              <AppSpinner size="sm" color="light" /> Removing...
            </span>
            <span v-else>Remove HOD</span>
          </AppButton>
        </div>
      </template>
    </AppModal>

    <AppSuccessModal 
      :show="showSuccessModal" 
      :title="successModalTitle" 
      :message="successModalMessage" 
      @close="showSuccessModal = false" 
    />

  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDepartmentStore } from '@/stores/department'
import api from '@/api/api'

// Import Reusable Components
import AppTable from '../../components/reusable/AppTable.vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'
import AppPagination from '../../components/reusable/AppPagination.vue'
import AppSpinner from '../../components/reusable/AppSpinner.vue'
import AppSuccessModal from '../../components/reusable/AppSuccessModal.vue'

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()
}

export default {
  name: 'HodManagement',
  components: { 
    AppTable, 
    AppButton, 
    AppModal, 
    AppSkeleton, 
    AppPagination, 
    AppSpinner, 
    AppSuccessModal 
  },
  setup() {
    const departmentStore = useDepartmentStore()

    // UI States
    const loading = ref(true)
    const isSubmitting = ref(false)
    const showModal = ref(false)
    const showDeleteModal = ref(false)
    
    // Success Modal State
    const showSuccessModal = ref(false)
    const successModalTitle = ref('Success!')
    const successModalMessage = ref('')

    // Data States
    const hods = ref([])
    const editingItem = ref(null)
    const itemToDelete = ref(null)
    const searchQuery = ref('')
    const filterDept = ref('')
    
    // Pagination
    const paginationMeta = ref({
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    })

    // Department selection
    const showDepartmentDropdown = ref(false)
    const departmentSearch = ref('')
    
    const form = ref({ 
      name: '', 
      email: '', 
      phone: '',
      department_id: '', 
      is_active: true
    })
    
    const columns = [
      { key: 'name', label: 'HOD Profile', width: '35%' },
      { key: 'department_name', label: 'Department', width: '20%' },
      { key: 'phone', label: 'Phone', width: '15%' },
      { key: 'is_active', label: 'Status', width: '15%' },
    ]

    // --- METHODS ---

    const fetchHods = async (page = 1) => {
      try {
        loading.value = true
        const response = await api.get('/hods') // Add ?page=${page} if backend supports it
        
        if (response.data.success) {
          const rawHods = response.data.hods || []
          hods.value = rawHods.map(hod => ({
            ...hod,
            department_name: hod.department_name || (hod.department ? hod.department.name : 'N/A'),
            is_active: hod.is_active !== undefined ? hod.is_active : hod.status === 'active'
          }))

          if (response.data.meta) {
            paginationMeta.value = response.data.meta
          }
        }
      } catch (error) {
        console.error('Failed to fetch HODs:', error)
      } finally {
        setTimeout(() => { loading.value = false }, 500)
      }
    }

    const handlePageChange = (newPage) => {
      fetchHods(newPage)
    }

    const saveHod = async () => {
      try {
        isSubmitting.value = true
        
        const hodData = {
          name: form.value.name,
          email: form.value.email,
          phone: form.value.phone,
          department_id: form.value.department_id,
          is_active: form.value.is_active
        }

        let response;
        if (editingItem.value) {
          response = await api.put(`/hod/${editingItem.value.id}`, hodData)
        } else {
          response = await api.post('/hod/register', hodData)
        }
        
        if (response.data.success) {
          await fetchHods()
          await departmentStore.fetchDepartments()
          showModal.value = false
          resetForm()
          
          successModalTitle.value = editingItem.value ? 'Profile Updated' : 'HOD Registered'
          successModalMessage.value = response.data.message || 'Saved successfully.'
          showSuccessModal.value = true
        }
        
      } catch (error) {
        console.error('Failed to save HOD:', error)
        handleError(error)
      } finally {
        isSubmitting.value = false
      }
    }

    // --- FIX: initiateDelete was missing or misplaced previously ---
    const initiateDelete = (item) => {
      itemToDelete.value = item
      showDeleteModal.value = true
    }

    const executeDelete = async () => {
      if (!itemToDelete.value) return
      
      try {
        isSubmitting.value = true
        const response = await api.delete(`/hod/${itemToDelete.value.id}`)
        
        if (response.data.success) {
          await fetchHods()
          await departmentStore.fetchDepartments()
          showDeleteModal.value = false
          itemToDelete.value = null
          
          successModalTitle.value = 'HOD Removed'
          successModalMessage.value = 'Access revoked successfully.'
          showSuccessModal.value = true
        }
      } catch (error) {
        console.error('Failed to delete HOD:', error)
        handleError(error)
      } finally {
        isSubmitting.value = false
      }
    }

    const handleError = (error) => {
      if (error.response && error.response.status === 422) {
        // Validation Error (The 422 you are seeing)
        const errors = error.response.data.errors
        let errorMessage = 'Validation Error:\n'
        if (errors) {
            Object.keys(errors).forEach(field => {
            errorMessage += `• ${errors[field].join(', ')}\n`
            })
        } else {
            errorMessage += error.response.data.message
        }
        alert(errorMessage)
      } else {
        alert(error.response?.data?.message || error.message || 'An error occurred')
      }
    }

    const resetForm = () => {
      form.value = { 
        name: '', 
        email: '', 
        phone: '', 
        department_id: '', 
        is_active: true
      }
      editingItem.value = null
    }

    const openModal = (item = null) => {
      editingItem.value = item
      if (item) {
        form.value = { 
          name: item.name, 
          email: item.email,
          phone: item.phone || '',
          department_id: item.department_id,
          is_active: item.is_active !== undefined ? item.is_active : item.status === 'active'
        }
      } else {
        resetForm()
      }
      showModal.value = true
      showDepartmentDropdown.value = false
      departmentSearch.value = ''
    }

    const closeModal = () => { 
      showModal.value = false 
      showDepartmentDropdown.value = false
      resetForm()
    }

    // --- Computed ---
    const activeCount = computed(() => hods.value.filter(h => h.is_active).length)
    
    const assignedDepartmentsCount = computed(() => {
      const assignedDepts = new Set(hods.value.filter(h => h.is_active).map(h => h.department_id))
      return assignedDepts.size
    })

    const selectedDepartmentName = computed(() => {
      if (!form.value.department_id) return ''
      const dept = departmentStore.getDepartmentById(form.value.department_id)
      return dept ? dept.name : ''
    })

    const availableDepartments = computed(() => {
      const filtered = departmentStore.searchDepartments(departmentSearch.value)
      return filtered.map(dept => {
        const hasHod = departmentStore.departments.some(d => 
          d.id === dept.id && d.has_hod
        )
        return { ...dept, has_hod: hasHod }
      })
    })

    const selectedDepartmentHasHod = computed(() => {
      if (!form.value.department_id) return false
      const dept = departmentStore.getDepartmentById(form.value.department_id)
      return dept ? dept.has_hod : false
    })

    const filteredHods = computed(() => {
      return hods.value.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                              h.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                              (h.phone && h.phone.includes(searchQuery.value))
        const matchesDept = filterDept.value ? h.department_id === parseInt(filterDept.value) : true
        return matchesSearch && matchesDept
      })
    })

    // UI Helpers
    const toggleDepartmentDropdown = () => {
      showDepartmentDropdown.value = !showDepartmentDropdown.value
      if (showDepartmentDropdown.value) {
        departmentSearch.value = ''
      }
    }

    const selectDepartment = (dept) => {
      if (dept.has_hod && !editingItem.value) {
        if (!confirm(`Department ${dept.name} already has an active HOD. Do you want to replace them?`)) {
          return
        }
      }
      form.value.department_id = dept.id
      showDepartmentDropdown.value = false
      departmentSearch.value = ''
    }

    const closeDropdown = (event) => {
      if (!event.target.closest('.searchable-select')) {
        showDepartmentDropdown.value = false
      }
    }

    const getRandomColor = (id) => {
      const colors = ['bg-blue', 'bg-purple', 'bg-green', 'bg-orange']
      return colors[id % colors.length]
    }

    // Lifecycle
    onMounted(async () => {
      document.addEventListener('click', closeDropdown)
      await Promise.all([
        departmentStore.fetchDepartments(),
        fetchHods()
      ])
    })

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown)
    })

    return {
      departmentStore,
      loading,
      isSubmitting,
      
      // Modals
      showModal,
      showDeleteModal,
      showSuccessModal,
      successModalTitle,
      successModalMessage,
      
      // Data
      hods,
      filteredHods,
      form,
      editingItem,
      itemToDelete,
      
      // Filters
      searchQuery,
      filterDept,
      
      // Department Dropdown
      showDepartmentDropdown,
      departmentSearch,
      selectedDepartmentName,
      availableDepartments,
      selectedDepartmentHasHod,
      
      // Stats
      activeCount,
      assignedDepartmentsCount,
      
      // Methods
      getInitials,
      getRandomColor,
      openModal,
      closeModal,
      saveHod,
      initiateDelete, // IMPORTANT: Now definitely exported
      executeDelete,
      toggleDepartmentDropdown,
      selectDepartment,
      
      // Pagination
      paginationMeta,
      handlePageChange,
      
      // Columns
      columns
    }
  }
}
</script>

<style scoped>
/* Reuse existing styles */
.admin-page { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: var(--spacing-md); 
}

.page-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: var(--spacing-lg); 
}

.page-title { 
    font-size: 1.75rem; 
    font-weight: 700; 
    color: var(--dark-color); 
    margin-bottom: 4px; 
}

.page-subtitle { color: var(--gray-color); }
.header-actions { display: flex; gap: var(--spacing-sm); }
.icon-wrapper { margin-right: 8px; display: flex; align-items: center; }

/* Stats Row & Skeletons */
.stats-row {
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md); 
    margin-bottom: var(--spacing-lg);
}

.skeleton-stat-card {
  height: 100px;
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.stat-card {
    background: white; 
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-lg); 
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--gray-light); 
    display: flex; 
    align-items: center; 
    gap: 16px;
}

.stat-icon {
    width: 48px; height: 48px; border-radius: 12px; 
    display: flex; align-items: center; justify-content: center;
}
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.secondary { background: var(--secondary-soft); color: var(--secondary-color); }
.stat-icon.success { background: var(--success-soft); color: var(--success-color); }

.stat-info { display: flex; flex-direction: column; }
.stat-info .label { font-size: 0.8rem; color: var(--gray-color); text-transform: uppercase; letter-spacing: 0.5px; }
.stat-info .value { font-size: 1.5rem; font-weight: 700; color: var(--dark-color); line-height: 1.2; }

/* Content Card & Skeletons */
.content-card { 
    background: white; 
    padding: var(--spacing-lg); 
    border-radius: var(--border-radius-lg); 
    box-shadow: var(--shadow-sm); 
    border: 1px solid var(--gray-light); 
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

.toolbar { 
    display: flex; justify-content: space-between; gap: var(--spacing-md); 
    margin-bottom: var(--spacing-lg); flex-wrap: wrap; 
}
.search-box { position: relative; width: 100%; max-width: 320px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-color); }
.search-input { width: 100%; padding: 10px 12px 10px 36px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); transition: border-color 0.2s; }
.search-input:focus { outline: none; border-color: var(--primary-color); }
.filter-select { padding: 10px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); min-width: 180px; background: white; }

/* Table Styles */
.user-cell { display: flex; align-items: center; gap: 12px; }
.avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; color: white; }
.bg-blue { background: linear-gradient(135deg, #667eea, #764ba2); }
.bg-purple { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
.bg-green { background: linear-gradient(135deg, #10b981, #059669); }
.bg-orange { background: linear-gradient(135deg, #f97316, #ea580c); }
.user-info { display: flex; flex-direction: column; }
.name { font-weight: 600; color: var(--dark-color); font-size: 0.95rem; }
.email { font-size: 0.8rem; color: var(--gray-color); }
.role-badge { background: var(--primary-soft); color: var(--primary-color); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; margin-top: 2px; display: inline-block; }
.badge { padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.badge.dept { background: var(--light-color); color: var(--gray-dark); border: 1px solid var(--gray-light); }
.phone { color: var(--gray-color); font-size: 0.9rem; }
.status-indicator { font-size: 0.8rem; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; }
.status-indicator .dot { width: 8px; height: 8px; border-radius: 50%; }
.status-indicator.active { color: var(--success-dark); }
.status-indicator.active .dot { background: var(--success-color); }
.status-indicator.inactive { color: var(--gray-color); }
.status-indicator.inactive .dot { background: var(--gray-color); }
.action-group { display: flex; gap: 6px; }
.icon-btn { background: transparent; border: none; cursor: pointer; color: var(--gray-color); padding: 6px; border-radius: 4px; transition: all 0.2s; }
.icon-btn:hover { background: var(--light-color); color: var(--primary-color); }
.icon-btn.danger:hover { background: var(--danger-soft); color: var(--danger-color); }

/* Modal & Form */
.modal-form { display: flex; flex-direction: column; gap: var(--spacing-md); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: var(--dark-color); font-size: 0.9rem; }
.form-control { width: 100%; padding: 10px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); transition: border-color 0.2s; }
.form-control:focus { outline: none; border-color: var(--primary-color); }
.modal-actions { display: flex; justify-content: flex-end; gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.modal-actions.centered { justify-content: center; }
.confirmation-content { text-align: center; padding: var(--spacing-md) 0; }
.warning-icon { width: 64px; height: 64px; background: rgba(229, 57, 53, 0.1); color: var(--danger-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-lg); }
.confirmation-content h3 { margin-bottom: var(--spacing-sm); color: var(--dark-color); }
.confirmation-content p { color: var(--gray-color); line-height: 1.5; }
.warning-message { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 8px 12px; border-radius: var(--border-radius-md); margin-top: 8px; font-size: 0.85rem; }
.info-message { background: var(--primary-soft); border: 1px solid var(--primary-color); color: var(--primary-dark); padding: 12px; border-radius: var(--border-radius-md); display: flex; align-items: center; gap: 8px; font-size: 0.85rem; margin-top: 8px; }
.info-message svg { flex-shrink: 0; }

/* Button Spinner Alignment */
.btn-loading-content { display: flex; align-items: center; gap: 8px; }

/* Toggle & Select styles (same as before) */
.toggle-switch-container { display: flex; align-items: center; gap: var(--spacing-sm); background: var(--light-color); padding: var(--spacing-md); border-radius: var(--border-radius-md); border: 1px solid var(--gray-light); }
.toggle-switch-checkbox { height: 0; width: 0; visibility: hidden; }
.toggle-switch-label { cursor: pointer; width: 40px; height: 22px; background: var(--gray-color); display: block; border-radius: 100px; position: relative; flex-shrink: 0; }
.toggle-switch-label::after { content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: 0.3s; }
.toggle-switch-checkbox:checked + .toggle-switch-label { background: var(--success-color); }
.toggle-switch-checkbox:checked + .toggle-switch-label::after { left: calc(100% - 2px); transform: translateX(-100%); }
.toggle-switch-text { font-size: 0.9rem; color: var(--dark-color); }
.searchable-select { position: relative; width: 100%; }
.select-header { padding: 10px 12px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); background: white; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: border-color 0.2s; }
.select-header:hover { border-color: var(--primary-color); }
.selected-value { color: var(--dark-color); font-size: 0.9rem; }
.dropdown-arrow { transition: transform 0.2s; color: var(--gray-color); }
.dropdown-arrow.rotated { transform: rotate(180deg); }
.dropdown-content { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); box-shadow: var(--shadow-lg); z-index: 1000; margin-top: 4px; overflow: hidden; }
.search-input-wrapper { position: relative; padding: 8px; border-bottom: 1px solid var(--gray-light); }
.search-input-wrapper .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); }
.search-input-wrapper .search-input { padding-left: 32px; border: none; background: var(--light-color); }
.search-input-wrapper .search-input:focus { border: none; box-shadow: none; }
.options-list { max-height: 200px; overflow-y: auto; }
.option-item { padding: 12px 16px; cursor: pointer; transition: background-color 0.2s; border-bottom: 1px solid var(--gray-light); }
.option-item:last-child { border-bottom: none; }
.option-item:hover { background: var(--primary-soft); }
.option-item.selected { background: var(--primary-soft); border-left: 3px solid var(--primary-color); }
.option-item.unavailable { opacity: 0.6; }
.option-item.unavailable:hover { background: #f8f9fa; cursor: not-allowed; }
.department-info { display: flex; align-items: center; gap: 12px; }
.avatar-xs { width: 28px; height: 28px; background: var(--primary-soft); color: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; }
.department-name { font-weight: 600; color: var(--dark-color); font-size: 0.9rem; }
.department-code { font-size: 0.8rem; color: var(--gray-color); margin-top: 2px; }
.department-status { margin-top: 2px; }
.text-warning { color: #856404; }
.no-options { padding: 16px; text-align: center; color: var(--gray-color); font-style: italic; }

@media (max-width: 768px) {
    .grid-2 { grid-template-columns: 1fr; }
    .toolbar { flex-direction: column; align-items: stretch; }
    .search-box { max-width: 100%; }
    .stats-row { grid-template-columns: 1fr; }
    .page-header { flex-direction: column; gap: var(--spacing-md); align-items: flex-start; }
    .header-actions { width: 100%; justify-content: flex-start; }
}
</style>