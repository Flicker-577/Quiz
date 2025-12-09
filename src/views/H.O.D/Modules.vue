<template>
  <div class="hod-modules">
    <div class="page-header">
      <div>
        <h1 class="page-title">Module Management</h1>
        <div class="title-decoration"></div><br>
        <p class="page-subtitle">Manage modules, assign to courses and lecturers in your department</p>
      </div>
      <button class="create-btn" @click="openCreateModal()">
        <span class="icon-wrapper">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </span>
        Create Module
      </button>
    </div>

    <div class="stats-row">
      <div v-for="(stat, index) in statsDisplay" :key="index" class="stat-card">
        <div :class="['stat-icon', stat.colorClass]">
          <span v-html="stat.icon"></span>
        </div>
        <div class="stat-info">
          <span v-if="!statsLoading" class="value">{{ stat.value }}</span>
          <AppSkeleton v-else width="40px" height="28px" class="mb-1" />
          <span class="label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div class="tabs-wrapper">
      <div class="tabs">
        <button 
          :class="['tab', { active: activeTab === 'modules' }]" 
          @click="activeTab = 'modules'"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          All Modules
        </button>
        <button 
          :class="['tab', { active: activeTab === 'assignments' }]" 
          @click="activeTab = 'assignments'"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
          Course Assignments
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'modules'" class="tab-content">
      <div class="content-card">
        <div class="toolbar">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              v-model="modulesSearch" 
              placeholder="Search modules..." 
              class="search-input"
              @input="fetchModules(1)"
            >
          </div>
        </div>

        <div v-if="modulesLoading" class="modules-grid">
          <div v-for="n in 6" :key="n" class="module-card skeleton-card">
             <div class="card-body">
               <AppSkeleton width="60%" height="24px" class="mb-3" />
               <AppSkeleton width="100%" height="100px" />
             </div>
          </div>
        </div>

        <div v-else-if="modules.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" fill="none" stroke-width="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
          <h3>No Modules Found</h3>
          <p>Create your first module to get started.</p>
          <button class="create-btn primary" @click="openCreateModal()">Create Module</button>
        </div>

        <div v-else class="modules-grid">
          <div v-for="module in modules" :key="module.id" class="module-card">
            <div class="card-decoration primary-gradient"></div>
            <div class="card-body">
              <div class="module-header">
                <div class="module-badge">
                  <span class="module-code-badge">{{ module.code }}</span>
                  <span class="credits-badge">{{ module.credits }} Cr</span>
                </div>
                <div class="module-actions">
                  <button class="icon-btn" @click="openEditModal(module)" title="Edit">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button class="icon-btn danger" @click="initiateDeleteModule(module)" title="Delete">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>

              <h3 class="module-name">{{ module.name }}</h3>
              <p class="module-desc-text">{{ module.description || 'No description provided.' }}</p>

              <div class="module-stats">
                <div class="stat-item">
                  <div class="stat-icon"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg></div>
                  <div class="stat-content">
                    <span class="stat-value">{{ module.course_assignments_count || 0 }}</span>
                    <span class="stat-label">Courses</span>
                  </div>
                </div>
              </div>

              <div class="card-actions">
                <button class="action-btn outline" @click="openDetailsModal(module)">View Details</button>
                <button class="action-btn primary" @click="openAssignmentModal(module)">Assign</button>
              </div>
            </div>
          </div>
        </div>
        
        <AppPagination :meta="modulesPaginator" @change="fetchModules" />
      </div>
    </div>

    <div v-if="activeTab === 'assignments'" class="tab-content">
      <div class="content-card">
        <div class="toolbar">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" v-model="assignmentsSearch" placeholder="Search assignments..." class="search-input" @input="fetchAssignments(1)">
          </div>
          <div class="filter-group">
            <select v-model="assignmentsYear" class="filter-select" @change="fetchAssignments(1)">
              <option value="">All Years</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
            <select v-model="assignmentsSemester" class="filter-select" @change="fetchAssignments(1)">
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
        </div>

        <div v-if="assignmentsLoading" class="assignments-grid">
           <div v-for="n in 6" :key="n" class="assignment-card skeleton-card">
             <div class="card-body">
               <AppSkeleton width="100%" height="24px" class="mb-2" />
               <AppSkeleton width="60%" height="16px" class="mb-4" />
               <AppSkeleton width="100%" height="40px" />
             </div>
           </div>
        </div>

        <div v-else-if="assignments.length === 0" class="empty-state">
           <div class="empty-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" fill="none" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
          </div>
          <h3>No Assignments Found</h3>
          <p>Assign modules to courses to get started.</p>
        </div>

        <div v-else class="assignments-grid">
          <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
            <div class="card-decoration" :style="getSemesterGradient(assignment.semester)"></div>
            <div class="card-body">
              <div class="assignment-header">
                <div class="assignment-badge">
                  <span class="year-badge">Y{{ assignment.year }}</span>
                  <span class="semester-badge">S{{ assignment.semester }}</span>
                </div>
                <div class="assignment-actions">
                  <button class="icon-btn" title="Reassign Lecturer" @click="openReassignModal(assignment)">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </button>
                  <button class="icon-btn danger" title="Remove" @click="initiateRemoveAssignment(assignment)">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>

              <div class="info-group">
                <label>Module</label>
                <div><strong>{{ assignment.module?.code }}</strong> - {{ assignment.module?.name }}</div>
              </div>
              
              <div class="info-group">
                <label>Course</label>
                <div><strong>{{ assignment.course?.code }}</strong> - {{ assignment.course?.name }}</div>
              </div>

              <div class="info-group">
                <label>Lecturer</label>
                <div v-if="assignment.lecturer" class="lecturer-chip">
                  <div class="avatar-xs">{{ getInitials(assignment.lecturer.name) }}</div>
                  <span>{{ assignment.lecturer.name }}</span>
                </div>
                <div v-else class="unassigned-text">Unassigned</div>
              </div>
            </div>
          </div>
        </div>

        <AppPagination :meta="assignmentsPaginator" @change="fetchAssignments" />
      </div>
    </div>

    <AppModal :show="showModuleModal" :title="editingModule ? 'Edit Module' : 'Create New Module'" width="600px" @close="closeModuleModal">
      <div v-if="moduleError" class="modal-error">{{ moduleError }}</div>
      <form @submit.prevent="saveModule" class="modal-form">
        <div class="form-group">
          <label class="form-label">Module Name *</label>
          <input v-model="moduleForm.name" type="text" class="form-control" required placeholder="e.g. Advanced Web Programming">
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Code *</label>
            <input v-model="moduleForm.code" type="text" class="form-control" required placeholder="e.g. CS401">
          </div>
          <div class="form-group">
            <label class="form-label">Credits *</label>
            <select v-model.number="moduleForm.credits" class="form-control" required>
              <option v-for="c in [2,3,4,5,6,10,15,20]" :key="c" :value="c">{{ c }} Credits</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea v-model="moduleForm.description" class="form-control" rows="3"></textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn outline" @click="closeModuleModal" :disabled="moduleLoading">Cancel</button>
          <button type="submit" class="btn primary" :disabled="moduleLoading">
             <span v-if="moduleLoading" class="spinner-small"></span> {{ editingModule ? 'Save Changes' : 'Create Module' }}
          </button>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showDetailsModal" title="Module Assignments" width="650px" @close="closeDetailsModal">
      <div v-if="detailsLoading" class="p-3">
        <AppSkeleton width="100%" height="150px" />
      </div>
      <div v-else-if="selectedModuleDetails">
        <div class="details-header mb-4">
          <h2>{{ selectedModuleDetails.code }} - {{ selectedModuleDetails.name }}</h2>
          <p class="text-muted">{{ selectedModuleDetails.description }}</p>
        </div>

        <h4 class="section-title">Assigned Lecturers & Courses</h4>
        
        <div v-if="selectedModuleDetails.course_assignments && selectedModuleDetails.course_assignments.length > 0" class="assignments-list">
          <div v-for="assign in selectedModuleDetails.course_assignments" :key="assign.id" class="detail-item">
            <div class="detail-left">
              <div class="course-info">
                <span class="badge-blue">{{ assign.course.code }}</span>
                <span class="course-name">{{ assign.course.name }}</span>
              </div>
              <div class="academic-info">
                 Year {{ assign.year }} | Semester {{ assign.semester }}
              </div>
            </div>
            <div class="detail-right">
              <label>Lecturer</label>
              <div v-if="assign.lecturer" class="lecturer-pill">
                <span class="avatar-xxs">{{ getInitials(assign.lecturer.name) }}</span>
                {{ assign.lecturer.name }}
              </div>
              <div v-else class="unassigned-pill">Unassigned</div>
            </div>
          </div>
        </div>
        <div v-else class="empty-details">
          <p>No courses assigned to this module yet.</p>
        </div>
      </div>
    </AppModal>

    <AppModal :show="showAssignmentModal" :title="`Assign: ${selectedModule?.code}`" width="500px" @close="closeAssignmentModal">
      <div v-if="assignmentError" class="modal-error">{{ assignmentError }}</div>
      <form @submit.prevent="assignModuleToCourse" class="modal-form">
        <div class="form-group">
          <label class="form-label">Academic Session *</label>
          <select v-model="assignmentForm.academic_session_id" class="form-control" required>
            <option value="">Select Session</option>
            <option v-for="session in academicSessions" :key="session.id" :value="session.id">
              {{ session.name }} {{ session.is_current ? '(Current)' : '' }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Course *</label>
          <select v-model="assignmentForm.course_id" class="form-control" required>
            <option value="">Select Course</option>
            <option v-for="course in availableCourses" :key="course.id" :value="course.id">
              {{ course.code }} - {{ course.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Lecturer (Optional)</label>
          <select v-model="assignmentForm.lecturer_id" class="form-control">
            <option value="">Unassigned</option>
            <option v-for="lecturer in departmentLecturers" :key="lecturer.id" :value="lecturer.id">
              {{ lecturer.name }}
            </option>
          </select>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Year *</label>
            <select v-model.number="assignmentForm.year" class="form-control" required>
              <option v-for="y in 5" :key="y" :value="y">Year {{ y }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Semester *</label>
            <select v-model="assignmentForm.semester" class="form-control" required>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn outline" @click="closeAssignmentModal" :disabled="assignmentLoading">Cancel</button>
          <button type="submit" class="btn primary" :disabled="assignmentLoading">
            <span v-if="assignmentLoading" class="spinner-small"></span> Assign
          </button>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showReassignModal" title="Reassign Lecturer" width="400px" @close="closeReassignModal">
      <div v-if="reassignError" class="modal-error">{{ reassignError }}</div>
      <form @submit.prevent="reassignLecturer" class="modal-form">
        <div class="form-group">
          <label class="form-label">Select New Lecturer</label>
          <select v-model="reassignForm.lecturer_id" class="form-control" required>
            <option value="">Unassigned</option>
            <option v-for="lecturer in departmentLecturers" :key="lecturer.id" :value="lecturer.id">
              {{ lecturer.name }}
            </option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn outline" @click="closeReassignModal">Cancel</button>
          <button type="submit" class="btn primary" :disabled="reassignLoading">
             <span v-if="reassignLoading" class="spinner-small"></span> Save
          </button>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showDeleteModal" :title="deleteTitle" width="450px" @close="showDeleteModal = false">
      <div v-if="deleteError" class="modal-error mb-3">{{ deleteError }}</div>
      <div class="confirmation-content">
        <h3>Are you sure?</h3>
        <p v-html="deleteMessage"></p>
      </div>
      <template #footer>
        <div class="modal-actions centered">
          <button class="btn outline" @click="showDeleteModal = false">Cancel</button>
          <button class="btn danger" @click="executeDelete" :disabled="deleteLoading">
            <span v-if="deleteLoading" class="spinner-small"></span> {{ deleteConfirmText }}
          </button>
        </div>
      </template>
    </AppModal>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppModal from '../../components/reusable/AppModal.vue'
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'
import AppPagination from '../../components/reusable/AppPagination.vue'
import api from '@/api/api'

export default {
  name: 'HodModules',
  components: { AppModal, AppSkeleton, AppPagination },
  setup() {
    const router = useRouter()

    // --- State ---
    const activeTab = ref('modules')
    const statsLoading = ref(true)
    const stats = ref({})

    // Modules
    const modules = ref([])
    const modulesLoading = ref(true)
    const modulesSearch = ref('')
    const modulesPaginator = ref({})

    // Assignments
    const assignments = ref([])
    const assignmentsLoading = ref(true)
    const assignmentsSearch = ref('')
    const assignmentsYear = ref('')
    const assignmentsSemester = ref('')
    const assignmentsPaginator = ref({})

    // Dropdowns
    const availableCourses = ref([])
    const departmentLecturers = ref([])
    const availableYears = ref([])
    const academicSessions = ref([])

    // Forms
    const moduleForm = ref({ name: '', code: '', credits: 10, description: '' })
    const assignmentForm = ref({ 
       module_id: '', course_id: '', lecturer_id: '', 
       academic_session_id: '', year: 1, semester: '1' 
    })
    const reassignForm = ref({ lecturer_id: '' })

    // Modals & Loaders
    const showModuleModal = ref(false)
    const showAssignmentModal = ref(false)
    const showReassignModal = ref(false)
    const showDeleteModal = ref(false)
    
    // NEW: Details Modal
    const showDetailsModal = ref(false)
    const detailsLoading = ref(false)
    
    const moduleLoading = ref(false)
    const assignmentLoading = ref(false)
    const reassignLoading = ref(false)
    const deleteLoading = ref(false)
    
    const moduleError = ref('')
    const assignmentError = ref('')
    const reassignError = ref('')
    const deleteError = ref('')

    // Selection
    const editingModule = ref(null)
    const selectedModule = ref(null)
    const selectedAssignment = ref(null)
    // NEW: Selected Module for Details
    const selectedModuleDetails = ref(null) 

    const itemToDelete = ref(null)
    const deleteType = ref('')

    // --- Computed ---
    const statsDisplay = computed(() => [
      { 
        label: 'Total Modules', value: stats.value.total_modules || 0, 
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
        colorClass: 'primary'
      },
      { 
        label: 'Assigned', value: stats.value.assigned_modules || 0, 
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>',
        colorClass: 'warning'
      },
      { 
        label: 'Total Credits', value: modules.value.reduce((acc, m) => acc + (m.credits || 0), 0), 
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        colorClass: 'secondary'
      }
    ])

    const deleteTitle = computed(() => deleteType.value === 'module' ? 'Delete Module' : 'Remove Assignment')
    const deleteMessage = computed(() => {
      if(!itemToDelete.value) return ''
      return deleteType.value === 'module' 
        ? `Delete <strong>${itemToDelete.value.name}</strong>?`
        : `Remove assignment for <strong>${itemToDelete.value.module?.code}</strong>?`
    })
    const deleteConfirmText = computed(() => deleteType.value === 'module' ? 'Delete' : 'Remove')

    // --- Methods ---
    const getInitials = (n) => n ? n.substring(0,2).toUpperCase() : 'NA'
    const getSemesterGradient = (s) => ({ background: s == 1 ? 'linear-gradient(135deg, #1E88E5, #1565C0)' : 'linear-gradient(135deg, #8E24AA, #6A1B9A)' })

    // Fetching
    const fetchStatistics = async () => {
       try {
         const res = await api.get('/hod/modules/statistics')
         stats.value = res.data
         statsLoading.value = false
       } catch(e) { console.error(e) }
    }

    const fetchModules = async (page = 1) => {
       modulesLoading.value = true
       try {
          const res = await api.get('/hod/modules', { params: { page, search: modulesSearch.value } })
          modules.value = res.data.modules.data
          // Pass the entire paginator object (without data)
          modulesPaginator.value = res.data.modules
       } catch(e) { console.error(e) } 
       finally { setTimeout(() => modulesLoading.value = false, 300) } 
    }

    const fetchAssignments = async (page = 1) => {
       assignmentsLoading.value = true
       try {
          const params = { page, search: assignmentsSearch.value, year: assignmentsYear.value, semester: assignmentsSemester.value }
          const res = await api.get('/hod/modules/assignments', { params })
          assignments.value = res.data.assignments.data
          assignmentsPaginator.value = res.data.assignments
          
          if(res.data.filters) {
             availableYears.value = res.data.filters.available_years
             availableCourses.value = res.data.filters.available_courses
             departmentLecturers.value = res.data.filters.department_lecturers
             academicSessions.value = res.data.filters.academic_sessions
          }
       } catch(e) { console.error(e) }
       finally { setTimeout(() => assignmentsLoading.value = false, 300) }
    }

    // Modal Actions
    const openCreateModal = () => {
       editingModule.value = null
       moduleForm.value = { name: '', code: '', credits: 10, description: '' }
       moduleError.value = ''
       showModuleModal.value = true
    }

    const openEditModal = (m) => {
       editingModule.value = m
       moduleForm.value = { ...m }
       moduleError.value = ''
       showModuleModal.value = true
    }

    const saveModule = async () => {
       moduleLoading.value = true
       try {
          if(editingModule.value) await api.put(`/hod/modules/${editingModule.value.id}`, moduleForm.value)
          else await api.post('/hod/modules', moduleForm.value)
          
          closeModuleModal()
          fetchModules()
       } catch(e) { moduleError.value = e.response?.data?.message || 'Failed' }
       finally { moduleLoading.value = false }
    }

    // NEW: Open Details Modal Logic
    const openDetailsModal = async (module) => {
      selectedModuleDetails.value = null
      showDetailsModal.value = true
      detailsLoading.value = true
      
      try {
        const res = await api.get(`/hod/modules/${module.id}`)
        selectedModuleDetails.value = res.data.module
      } catch (error) {
        console.error("Failed to fetch module details", error)
      } finally {
        detailsLoading.value = false
      }
    }
    const closeDetailsModal = () => {
      showDetailsModal.value = false
      selectedModuleDetails.value = null
    }

    const openAssignmentModal = (m) => {
       selectedModule.value = m
       // Default to current session if available
       const currentSession = academicSessions.value.find(s => s.is_current)
       assignmentForm.value = { 
          module_id: m.id, course_id: '', lecturer_id: '', 
          academic_session_id: currentSession ? currentSession.id : '', 
          year: 1, semester: '1' 
       }
       assignmentError.value = ''
       showAssignmentModal.value = true
    }

    const assignModuleToCourse = async () => {
       assignmentLoading.value = true
       try {
          await api.post('/hod/modules/assign-course', assignmentForm.value)
          closeAssignmentModal()
          fetchAssignments()
       } catch(e) { assignmentError.value = e.response?.data?.message || 'Failed' }
       finally { assignmentLoading.value = false }
    }

    const openReassignModal = (a) => {
       selectedAssignment.value = a
       reassignForm.value = { lecturer_id: a.lecturer_id || '' }
       showReassignModal.value = true
    }

    const reassignLecturer = async () => {
       reassignLoading.value = true
       try {
          await api.put(`/hod/modules/assignments/${selectedAssignment.value.id}/reassign`, reassignForm.value)
          showReassignModal.value = false
          fetchAssignments()
       } catch(e) { reassignError.value = 'Failed' }
       finally { reassignLoading.value = false }
    }

    const initiateDeleteModule = (m) => {
       itemToDelete.value = m
       deleteType.value = 'module'
       deleteError.value = ''
       showDeleteModal.value = true
    }

    const initiateRemoveAssignment = (a) => {
       itemToDelete.value = a
       deleteType.value = 'assignment'
       deleteError.value = ''
       showDeleteModal.value = true
    }

    const executeDelete = async () => {
       deleteLoading.value = true
       try {
          if(deleteType.value === 'module') await api.delete(`/hod/modules/${itemToDelete.value.id}`)
          else await api.delete(`/hod/modules/assignments/${itemToDelete.value.id}`)
          
          showDeleteModal.value = false
          deleteType.value === 'module' ? fetchModules() : fetchAssignments()
       } catch(e) { deleteError.value = e.response?.data?.message || 'Failed' }
       finally { deleteLoading.value = false }
    }
    
    const closeModuleModal = () => showModuleModal.value = false
    const closeAssignmentModal = () => showAssignmentModal.value = false
    const closeReassignModal = () => showReassignModal.value = false

    // Watchers
    let debounce
    watch(modulesSearch, () => {
       clearTimeout(debounce)
       debounce = setTimeout(() => fetchModules(1), 500)
    })
    watch(assignmentsSearch, () => {
       clearTimeout(debounce)
       debounce = setTimeout(() => fetchAssignments(1), 500)
    })

    onMounted(() => {
       fetchStatistics()
       fetchModules()
       fetchAssignments()
    })

    return {
       activeTab, stats, statsLoading, statsDisplay,
       modules, modulesLoading, modulesSearch, modulesPaginator,
       assignments, assignmentsLoading, assignmentsSearch, assignmentsPaginator,
       assignmentsYear, assignmentsSemester, availableYears, availableCourses, departmentLecturers, academicSessions,
       moduleForm, assignmentForm, reassignForm,
       showModuleModal, showAssignmentModal, showReassignModal, showDeleteModal,
       showDetailsModal, detailsLoading, // NEW Exports
       moduleLoading, assignmentLoading, reassignLoading, deleteLoading,
       moduleError, assignmentError, reassignError, deleteError,
       editingModule, selectedModule, selectedModuleDetails, // NEW Export
       deleteTitle, deleteMessage, deleteConfirmText,
       getInitials, getSemesterGradient,
       fetchModules, fetchAssignments,
       openCreateModal, openEditModal, saveModule,
       openDetailsModal, closeDetailsModal, // NEW Export
       openAssignmentModal, assignModuleToCourse,
       openReassignModal, reassignLecturer,
       initiateDeleteModule, initiateRemoveAssignment, executeDelete,
       closeModuleModal, closeAssignmentModal, closeReassignModal
    }
  }
}
</script>

<style scoped>
/* Page Layout */
.hod-modules { max-width: 1400px; margin: 0 auto; padding: var(--spacing-md); }

/* Header */
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: 10px; }
.page-title { font-size: 2.0rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); }

.create-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: var(--border-radius-md); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
.create-btn:hover { background: var(--primary-dark); transform: translateY(-1px); }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-xl); }
.stat-card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); display: flex; align-items: center; gap: 16px; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.warning { background: var(--warning-soft); color: var(--warning-color); }
.stat-icon.secondary { background: var(--secondary-soft); color: var(--secondary-color); }
.stat-info .value { font-size: 1.5rem; font-weight: 700; color: var(--dark-color); display: block; }
.stat-info .label { font-size: 0.8rem; color: var(--gray-color); text-transform: uppercase; }

/* Tabs */
.tabs-wrapper { margin-bottom: var(--spacing-lg); border-bottom: 1px solid var(--gray-light); }
.tabs { display: flex; gap: var(--spacing-md); padding-bottom: var(--spacing-sm); }
.tab { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: none; border: none; font-size: 0.95rem; font-weight: 500; color: var(--gray-color); cursor: pointer; border-radius: 6px; }
.tab.active { color: var(--primary-color); background: var(--primary-soft); font-weight: 600; }

/* Toolbar */
.toolbar { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.search-box { position: relative; width: 100%; max-width: 320px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-color); }
.search-input { width: 100%; padding: 10px 12px 10px 36px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); font-size: 0.9rem; }
.filter-group { display: flex; gap: 10px; }
.filter-select { padding: 10px; border: 1px solid var(--gray-light); border-radius: var(--border-radius-md); min-width: 150px; background: white; }

/* Grid Layouts */
.modules-grid, .assignments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }

/* Cards */
.module-card, .assignment-card { background: white; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s; }
.module-card:hover, .assignment-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--primary-light); }
.card-decoration { height: 4px; width: 100%; }
.card-decoration.primary-gradient { background: linear-gradient(135deg, #1E88E5, #1565C0); }
.card-body { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }

/* Module Content */
.module-header, .assignment-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.module-badge, .assignment-badge { display: flex; gap: 6px; }
.module-code-badge { font-weight: 700; background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }
.credits-badge { background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 600; }
.module-name { font-size: 1.15rem; font-weight: 700; color: var(--dark-color); margin: 0 0 10px 0; line-height: 1.4; }
.module-desc-text { font-size: 0.9rem; color: #666; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 1rem; }
.card-actions { margin-top: auto; display: flex; gap: 8px; }

/* Assignment Info */
.info-group { margin-bottom: 0.8rem; }
.info-group label { font-size: 0.75rem; color: #888; text-transform: uppercase; display: block; margin-bottom: 2px; }
.lecturer-chip { display: flex; align-items: center; gap: 6px; }
.avatar-xs { width: 24px; height: 24px; background: #dbeafe; color: #1e40af; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; }

/* Buttons */
.action-btn { flex: 1; padding: 8px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
.action-btn.primary { background: var(--primary-color); color: white; }
.action-btn.outline { border-color: var(--gray-light); background: transparent; color: #444; }
.action-btn.outline:hover { background: #f9fafb; border-color: #ccc; }
.icon-btn { background: transparent; border: none; padding: 4px; color: #888; cursor: pointer; transition: 0.2s; border-radius: 4px; }
.icon-btn:hover { background: #f3f4f6; color: var(--primary-color); }
.icon-btn.danger:hover { color: var(--danger-color); }

/* Modals */
.modal-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group label { display: block; margin-bottom: 0.4rem; font-weight: 500; font-size: 0.9rem; }
.form-control { width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem; }
.btn { padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; border: none; }
.btn.primary { background: var(--primary-color); color: white; }
.btn.outline { border: 1px solid #ddd; background: white; color: #333; }
.btn.danger { background: var(--danger-color); color: white; }
.modal-error { background: #fef2f2; color: #991b1b; padding: 10px; border-radius: 6px; border: 1px solid #fecaca; margin-bottom: 1rem; }

/* Styles for Details Modal */
.details-header { border-bottom: 1px solid var(--gray-light); padding-bottom: 1rem; }
.details-header h2 { margin: 0 0 5px 0; font-size: 1.5rem; color: var(--dark-color); }
.section-title { font-size: 1rem; font-weight: 600; color: var(--gray-dark); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
.assignments-list { display: flex; flex-direction: column; gap: 10px; }
.detail-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f9fafb; border-radius: 8px; border: 1px solid var(--gray-light); }
.detail-left { display: flex; flex-direction: column; gap: 4px; }
.course-info { display: flex; align-items: center; gap: 8px; }
.badge-blue { background: #dbeafe; color: #1e40af; font-weight: 700; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; }
.course-name { font-weight: 600; color: var(--dark-color); }
.academic-info { font-size: 0.85rem; color: var(--gray-color); }
.detail-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.detail-right label { font-size: 0.7rem; color: var(--gray-color); text-transform: uppercase; }
.lecturer-pill { display: flex; align-items: center; gap: 6px; background: white; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--gray-light); font-size: 0.9rem; font-weight: 500; }
.avatar-xxs { width: 20px; height: 20px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; }
.unassigned-pill { background: #f3f4f6; color: #6b7280; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-style: italic; }
.empty-details { text-align: center; color: var(--gray-color); padding: 2rem; font-style: italic; }

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .toolbar { flex-direction: column; }
  .search-box { max-width: 100%; }
  .modules-grid, .assignments-grid { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
  .detail-item { flex-direction: column; align-items: flex-start; gap: 10px; }
  .detail-right { align-items: flex-start; width: 100%; }
}
</style>