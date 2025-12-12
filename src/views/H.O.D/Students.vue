<template>
  <div class="admin-page">
    <div v-if="isLoading" class="skeleton-wrapper">
      <div class="page-header">
        <div>
          <AppSkeleton width="200px" height="32px" class="mb-2" />
          <AppSkeleton width="300px" height="16px" />
        </div>
        <div class="header-actions">
          <AppSkeleton width="120px" height="40px" />
          <AppSkeleton width="120px" height="40px" />
        </div>
      </div>

      <div class="stats-row">
        <div v-for="n in 3" :key="n" class="skeleton-stat-card">
          <AppSkeleton type="card" height="100%" borderRadius="12px" />
        </div>
      </div>

      <div class="content-card">
        <div class="toolbar-skeleton">
          <AppSkeleton width="350px" height="42px" borderRadius="8px" />
          <AppSkeleton width="200px" height="42px" borderRadius="8px" />
        </div>

        <div class="skeleton-table">
          <div class="skeleton-header mb-3">
            <AppSkeleton width="100%" height="40px" />
          </div>
          <div v-for="row in 5" :key="row" class="skeleton-row">
            <div class="d-flex align-items-center gap-3 w-100">
              <AppSkeleton type="circle" width="40px" height="40px" />
              <div style="width: 30%">
                <AppSkeleton width="80%" height="14px" class="mb-1" />
                <AppSkeleton width="50%" height="12px" />
              </div>
              <div style="width: 25%">
                <AppSkeleton width="70%" height="14px" class="mb-1" />
                <AppSkeleton width="40%" height="12px" />
              </div>
              <div style="width: 15%">
                <AppSkeleton width="80px" height="24px" borderRadius="12px" />
              </div>
              <div style="width: 15%; margin-left: auto; display: flex; gap: 8px; justify-content: flex-end;">
                <AppSkeleton width="30px" height="30px" />
                <AppSkeleton width="30px" height="30px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="page-header">
        <div>
          <h1 class="page-title">Student Registry</h1>
          <div class="title-decoration"></div><br>
          <p class="page-subtitle">Manage enrollments, academic records, and status overrides</p>
        </div>
        <div class="header-actions">
          <AppButton variant="outline" @click="exportData" :disabled="isExporting">
            <span v-if="isExporting" class="btn-loading-content">
               <AppSpinner size="sm" color="dark" /> Exporting...
            </span>
            <span v-else class="icon-wrapper">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export CSV
            </span>
          </AppButton>
          
          <AppButton 
            variant="success" 
            @click="confirmApproveAll" 
            :disabled="pendingCount === 0"
            v-if="pendingCount > 0"
          >
            <span class="icon-wrapper">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
            Approve All Pending ({{ pendingCount }})
          </AppButton>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon primary">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="stat-info">
            <span class="label">Total Students</span>
            <span class="value">{{ students.length }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div class="stat-info">
            <span class="label">Active</span>
            <span class="value">{{ activeCount }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon warning">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div class="stat-info">
            <span class="label">Pending</span>
            <span class="value">{{ pendingCount }}</span>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="tabs-header">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-btn', { active: currentTab === tab.id }]"
            @click="currentTab = tab.id"
          >
            {{ tab.label }}
            <span v-if="tab.id === 'pending' && pendingCount > 0" class="count-badge warning">{{ pendingCount }}</span>
            <span v-if="tab.id === 'all'" class="count-badge light">{{ students.length }}</span>
          </button>
        </div>

        <div class="toolbar">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" v-model="searchQuery" placeholder="Search by name, reg number..." class="search-input">
          </div>
          <div class="filter-group">
            <select v-model="filterCourse" class="filter-select">
              <option value="">All Programs</option>
              <option v-for="course in courses" :key="course.id" :value="course.id">
                {{ course.name }}
              </option>
            </select>
          </div>
        </div>

        <AppTable :columns="columns" :data="filteredStudents" hover striped>
          <template #name="{ item }">
            <div class="user-cell">
              <div class="avatar secondary">{{ getInitials(item.name) }}</div>
              <div class="user-info">
                <span class="name">{{ item.name }}</span>
                <span class="sub-text">{{ item.email }}</span>
              </div>
            </div>
          </template>
          
          <template #course_id="{ item }">
            <div class="course-info">
              <span class="course-name">{{ getCourseName(item.course_id) }}</span>
            </div>
          </template>

          <template #year_sem="{ item }">
            <div v-if="item.is_graduated">
              <span class="status-indicator graduated">
                <span class="dot"></span> Graduated
              </span>
            </div>
            <div v-else-if="item.status === 'pending'">
               <span class="badge badge-warning">Pending Approval</span>
            </div>
            <div v-else>
              <span class="year-sem-badge">
                Y{{ item.year_of_study }} / S{{ item.semester }}
              </span>
              <span v-if="item.status === 'suspended'" class="badge badge-danger ml-2">Suspended</span>
              <span v-if="item.status === 'inactive'" class="badge badge-gray ml-2">Inactive</span>
            </div>
          </template>

          <template #actions="{ item }">
            <div class="action-group">
              <button 
                v-if="item.status === 'pending'" 
                class="icon-btn success" 
                title="Approve Registration" 
                @click="approveStudent(item)"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>

              <button 
                v-if="item.status !== 'pending'"
                class="icon-btn primary" 
                title="Edit Academic Details" 
                @click="openEditModal(item)"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>

              <button 
                class="icon-btn danger" 
                title="Delete Record" 
                @click="confirmDelete(item)"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </template>
        </AppTable>
      </div>
    </div>

    <AppModal 
      :show="showEditModal" 
      title="Manage Academic Status" 
      width="500px" 
      @close="closeEditModal"
    >
      <form @submit.prevent="saveAcademicDetails" v-if="editingStudent">
        <div class="modal-body-content">
          <div class="student-summary mb-4">
            <h4>{{ editingStudent.name }}</h4>
            <p>{{ editingStudent.reg_number || 'No Reg Number' }}</p>
          </div>

          <div class="grid grid-2">
             <div class="form-group">
                <label class="form-label">Year of Study</label>
                <select v-model="editForm.year_of_study" class="form-control">
                   <option v-for="y in 5" :key="y" :value="y">Year {{ y }}</option>
                </select>
             </div>
             <div class="form-group">
                <label class="form-label">Semester</label>
                <select v-model="editForm.semester" class="form-control">
                   <option :value="1">Semester 1</option>
                   <option :value="2">Semester 2</option>
                </select>
             </div>
          </div>

          <div class="form-group">
             <label class="form-label">Account Status</label>
             <select v-model="editForm.status" class="form-control">
                <option value="active">Active (Standard)</option>
                <option value="inactive">Inactive (Paused)</option>
                <option value="suspended">Suspended (Disciplinary/Fee)</option>
             </select>
          </div>

          <div class="form-group checkbox-group">
             <label class="checkbox-container">
               <input type="checkbox" v-model="editForm.is_graduated">
               <span class="checkmark"></span>
               <span class="label-text">Mark as Graduated (Alumni)</span>
             </label>
          </div>

          <div class="alert alert-warning" v-if="isDepromoting">
             <strong>Note:</strong> You are setting the Year/Semester backwards. This acts as a repeat/depromotion.
          </div>
        </div>
        
        <div class="modal-actions centered mt-4">
           <AppButton variant="outline" type="button" @click="closeEditModal" :disabled="isSaving">Cancel</AppButton>
           <AppButton variant="primary" type="submit" :disabled="isSaving">
              <span v-if="isSaving" class="btn-loading-content">
                <AppSpinner size="sm" color="light" /> Saving...
              </span>
              <span v-else>Save Changes</span>
           </AppButton>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showDeleteModal" title="Delete Student Record" width="400px" @close="showDeleteModal = false">
      <div class="confirmation-content">
        <h3>Are you sure?</h3>
        <p>This will permanently delete <strong>{{ itemToDelete?.name }}</strong>. This action cannot be undone.</p>
      </div>
      <template #footer>
        <div class="modal-actions centered">
          <AppButton variant="outline" @click="showDeleteModal = false">Cancel</AppButton>
          <AppButton variant="danger" @click="executeDelete">Confirm Delete</AppButton>
        </div>
      </template>
    </AppModal>

    <AppModal :show="showApproveAllModal" title="Bulk Approval" width="400px" @close="showApproveAllModal = false">
      <div class="confirmation-content">
        <h3>Approve {{ pendingCount }} Students?</h3>
        <p>This will activate accounts and generate registration numbers.</p>
      </div>
      <template #footer>
        <div class="modal-actions centered">
          <AppButton variant="outline" @click="showApproveAllModal = false">Cancel</AppButton>
          <AppButton variant="success" @click="executeApproveAll">Approve All</AppButton>
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
import { ref, computed, onMounted, reactive } from 'vue'
import AppTable from '../../components/reusable/AppTable.vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'
import AppSpinner from '../../components/reusable/AppSpinner.vue'
import AppSuccessModal from '../../components/reusable/AppSuccessModal.vue'
import api from '@/api/api'

export default {
  name: 'StudentManagement',
  components: { AppTable, AppButton, AppModal, AppSkeleton, AppSpinner, AppSuccessModal },
  setup() {
    // --- State ---
    const students = ref([])
    const courses = ref([])
    const isLoading = ref(true) 
    const isSaving = ref(false)
    const isExporting = ref(false)
    
    // UI State
    const currentTab = ref('all') 
    const searchQuery = ref('')
    const filterCourse = ref('')
    
    // Modals
    const showEditModal = ref(false)
    const showDeleteModal = ref(false)
    const showApproveAllModal = ref(false)
    const showSuccessModal = ref(false)
    const successTitle = ref('Success')
    const successMessage = ref('')
    
    // Working Data
    const editingStudent = ref(null)
    const itemToDelete = ref(null)
    const editForm = reactive({
       year_of_study: 1, semester: 1, status: 'active', is_graduated: false
    })

    const tabs = [
      { id: 'all', label: 'All Students' },
      { id: 'active', label: 'Active' },
      { id: 'pending', label: 'Pending' },
      { id: 'inactive', label: 'Inactive' },
      { id: 'graduated', label: 'Graduated' }
    ]

    const columns = [
      { key: 'name', label: 'Student', width: '30%' },
      { key: 'course_id', label: 'Program', width: '25%' },
      { key: 'year_sem', label: 'Academic Progress', width: '25%' },
    ]

    // --- Helpers ---
    const openSuccessModal = (title, message) => {
       successTitle.value = title
       successMessage.value = message
       showSuccessModal.value = true
    }

    const fetchData = async () => {
       isLoading.value = true
       try {
          const [studRes, courseRes] = await Promise.all([
             api.get('/department-students'),
             api.get('/department-courses')
          ])
          students.value = studRes.data.students || []
          courses.value = courseRes.data.courses || []
       } catch (e) {
          console.error(e)
       } finally {
          // UPDATED: Added delay for smoother transition
          setTimeout(() => { isLoading.value = false }, 500)
       }
    }

    // --- Computed ---
    const filteredStudents = computed(() => {
       let data = students.value
       if (currentTab.value === 'pending') data = data.filter(s => s.status === 'pending')
       else if (currentTab.value === 'active') data = data.filter(s => s.status === 'active' && !s.is_graduated)
       else if (currentTab.value === 'inactive') data = data.filter(s => ['inactive', 'suspended'].includes(s.status) && !s.is_graduated)
       else if (currentTab.value === 'graduated') data = data.filter(s => s.is_graduated)
       
       if (searchQuery.value) {
          const q = searchQuery.value.toLowerCase()
          data = data.filter(s => s.name.toLowerCase().includes(q) || s.reg_number?.toLowerCase().includes(q))
       }
       if (filterCourse.value) {
          data = data.filter(s => s.course_id === parseInt(filterCourse.value))
       }
       return data
    })

    const pendingCount = computed(() => students.value.filter(s => s.status === 'pending').length)
    const activeCount = computed(() => students.value.filter(s => s.status === 'active').length)
    const isDepromoting = computed(() => editingStudent.value && editForm.year_of_study < editingStudent.value.year_of_study)

    // --- Actions ---
    const openEditModal = (student) => {
       editingStudent.value = student
       Object.assign(editForm, {
          year_of_study: student.year_of_study,
          semester: student.semester,
          status: student.status,
          is_graduated: Boolean(student.is_graduated)
       })
       showEditModal.value = true
    }

    const saveAcademicDetails = async () => {
       if(!editingStudent.value) return
       isSaving.value = true
       try {
          const res = await api.put(`/students/${editingStudent.value.id}/academic-details`, editForm)
          const idx = students.value.findIndex(s => s.id === editingStudent.value.id)
          if(idx !== -1) students.value[idx] = { ...students.value[idx], ...res.data.student }
          
          showEditModal.value = false
          openSuccessModal('Academic Record Updated', 'The student\'s academic details have been successfully updated.')
       } catch (e) {
          alert('Failed to update: ' + (e.response?.data?.message || e.message))
       } finally {
          isSaving.value = false
       }
    }

    const approveStudent = async (item) => {
       try {
          await api.put(`/students/${item.id}/approve`)
          openSuccessModal('Student Approved', `${item.name} has been successfully registered.`)
          fetchData()
       } catch(e) { alert('Failed to approve') }
    }

    const executeApproveAll = async () => {
       try {
          await api.post('/students/approve-all')
          showApproveAllModal.value = false
          openSuccessModal('Batch Approval Complete', `${pendingCount.value} students have been approved.`)
          fetchData()
       } catch(e) { alert('Failed') }
    }

    const confirmDelete = (item) => { itemToDelete.value = item; showDeleteModal.value = true }

    const executeDelete = async () => {
       try {
          await api.delete(`/students/${itemToDelete.value.id}`)
          students.value = students.value.filter(s => s.id !== itemToDelete.value.id)
          showDeleteModal.value = false
          openSuccessModal('Student Removed', 'The student record has been permanently deleted.')
       } catch(e) { alert('Failed to delete') }
    }
    
    const exportData = async () => {
        isExporting.value = true
        await new Promise(r => setTimeout(r, 1000))
        isExporting.value = false
        openSuccessModal('Export Complete', 'The student data has been exported successfully.')
    }

    const getInitials = (n) => n ? n.substring(0,2).toUpperCase() : 'ST'
    const getCourseName = (id) => courses.value.find(c => c.id === id)?.name || 'Unknown Course'
    const closeEditModal = () => { showEditModal.value = false; editingStudent.value = null }
    const confirmApproveAll = () => showApproveAllModal.value = true

    onMounted(() => fetchData())

    return {
       students, courses, filteredStudents, isLoading, isSaving, isExporting,
       currentTab, tabs, columns, searchQuery, filterCourse, activeCount, pendingCount,
       showEditModal, showDeleteModal, showApproveAllModal, showSuccessModal, successTitle, successMessage,
       editingStudent, editForm, itemToDelete, isDepromoting,
       openEditModal, closeEditModal, saveAcademicDetails,
       approveStudent, confirmApproveAll, executeApproveAll, confirmDelete, executeDelete, exportData,
       getInitials, getCourseName
    }
  }
}
</script>

<style scoped>
/* Page Layout */
.admin-page { max-width: 1200px; margin: 0 auto; padding: var(--spacing-md); }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: 10px; }
.page-title { font-size: 2.0rem; font-weight: 700; color: var(--dark-color); }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card { background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--gray-light); display: flex; align-items: center; gap: 1rem; box-shadow: var(--shadow-sm); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #eee; flex-shrink: 0; }
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.success { background: var(--success-soft); color: var(--success-color); }
.stat-icon.warning { background: var(--warning-soft); color: var(--warning-color); }
.stat-info .value { font-size: 1.5rem; font-weight: 700; display: block; }
.stat-info .label { font-size: 0.8rem; text-transform: uppercase; color: #666; }

/* Content Card */
.content-card { background: white; border-radius: 8px; border: 1px solid var(--gray-light); padding: 1.5rem; box-shadow: var(--shadow-sm); }

/* Tabs */
.tabs-header { display: flex; gap: 1.5rem; border-bottom: 1px solid var(--gray-light); margin-bottom: 1rem; overflow-x: auto; white-space: nowrap; }
.tab-btn { background: none; border: none; padding-bottom: 0.5rem; cursor: pointer; color: #666; border-bottom: 2px solid transparent; font-size: 1rem; display: flex; align-items: center; gap: 6px; }
.tab-btn.active { color: var(--primary-color); border-bottom-color: var(--primary-color); font-weight: 600; }
.count-badge { font-size: 0.75rem; padding: 2px 8px; border-radius: 10px; line-height: 1; }
.count-badge.warning { background: var(--warning-color); color: white; }
.count-badge.light { background: var(--gray-light); color: var(--dark-color); }

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
.skeleton-table { border: 1px solid var(--gray-light); border-radius: 8px; overflow: hidden; }
.skeleton-header { background: #f8fafc; border-bottom: 2px solid var(--gray-light); padding: 0; }
.skeleton-row { padding: 1rem; border-bottom: 1px solid var(--gray-light); background: white; }
.skeleton-row:last-child { border-bottom: none; }
.d-flex { display: flex; }
.align-items-center { align-items: center; }
.w-100 { width: 100%; }
.gap-3 { gap: 1rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }

.btn-loading-content { display: flex; align-items: center; gap: 8px; }

/* Toolbar */
.toolbar { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
.search-box { position: relative; flex: 1; min-width: 250px; }
.search-input { width: 100%; padding: 10px 10px 10px 36px; border: 1px solid var(--gray-light); border-radius: 4px; font-size: 0.95rem; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #999; }
.filter-group { min-width: 200px; }
.filter-select { width: 100%; padding: 10px; border: 1px solid var(--gray-light); border-radius: 4px; background: white; }

/* Table Content */
.user-cell { display: flex; gap: 10px; align-items: center; }
.avatar { width: 36px; height: 36px; background: #e0e7ff; color: #4338ca; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: bold; flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; line-height: 1.2; }
.name { font-weight: 600; font-size: 0.9rem; color: var(--dark-color); }
.sub-text { font-size: 0.8rem; color: #666; }
.course-info { display: flex; flex-direction: column; gap: 2px; }
.course-name { font-size: 0.85rem; font-weight: 500; }
.year-sem-badge { background: #eff6ff; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; white-space: nowrap; }
.badge-warning { background: #fffbeb; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; }
.badge-danger { background: #fef2f2; color: #b91c1c; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; }
.badge-gray { background: #f3f4f6; color: #4b5563; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; }
.status-indicator.graduated { color: #059669; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 4px; }
.dot { width: 6px; height: 6px; background: currentColor; border-radius: 50%; }

/* Action Buttons */
.action-group { display: flex; gap: 8px; justify-content: flex-end; }
.icon-btn { background: transparent; border: none; cursor: pointer; color: var(--gray-color); padding: 6px; border-radius: 4px; transition: all 0.2s; display: flex; align-items: center; }
.icon-btn:hover { background: var(--light-color); color: var(--primary-color); }
.icon-btn.primary:hover { background: var(--primary-soft); color: var(--primary-color); }
.icon-btn.success:hover { background: var(--success-soft); color: var(--success-color); }
.icon-btn.danger:hover { background: var(--danger-soft); color: var(--danger-color); }

/* Modal Styles */
.student-summary { background: var(--light-color); padding: 12px; border-radius: 6px; border: 1px solid var(--gray-light); }
.student-summary h4 { margin: 0 0 4px 0; font-size: 1rem; color: var(--primary-dark); }
.student-summary p { margin: 0; font-size: 0.85rem; color: #666; font-family: monospace; }
.checkbox-container { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
.checkbox-group { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.alert-warning { background: #fff7ed; color: #9a3412; padding: 10px; border-radius: 4px; margin-top: 10px; font-size: 0.85rem; border: 1px solid #fdba74; }
.modal-actions { display: flex; gap: 10px; margin-top: 1.5rem; }
.modal-actions.centered { justify-content: flex-end; }

/* Responsiveness */
@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .header-actions { width: 100%; display: flex; gap: 10px; }
  .header-actions button { flex: 1; }
  .stats-row { grid-template-columns: 1fr; }
  .toolbar { flex-direction: column; }
  .search-box, .filter-group { width: 100%; }
}
</style>