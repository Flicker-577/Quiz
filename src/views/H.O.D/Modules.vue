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

    <div v-if="statsLoading" class="stats-row">
      <div v-for="n in 3" :key="n" class="skeleton-stat-card">
         <AppSkeleton type="card" height="100%" borderRadius="12px" />
      </div>
    </div>

    <div v-else class="stats-row">
      <div v-for="(stat, index) in statsDisplay" :key="index" class="stat-card">
        <div :class="['stat-icon', stat.colorClass]">
          <span v-html="stat.icon"></span>
        </div>
        <div class="stat-info">
          <span class="value">{{ stat.value }}</span>
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
          All Modules
        </button>
        <button 
          :class="['tab', { active: activeTab === 'assignments' }]" 
          @click="activeTab = 'assignments'"
        >
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
                  <button class="icon-btn" title="Reassign" @click="openReassignModal(assignment)">
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
             <span v-if="moduleLoading" class="btn-loading-content"><AppSpinner size="sm" color="light" /> Saving...</span>
             <span v-else>{{ editingModule ? 'Save Changes' : 'Create Module' }}</span>
          </button>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showAssignmentModal" :title="`Assign: ${selectedModule?.code}`" width="550px" @close="closeAssignmentModal">
      <div v-if="assignmentError" class="modal-error">{{ assignmentError }}</div>
      <form @submit.prevent="assignModuleToCourse" class="modal-form">
        
        <div class="form-group dropdown-container" ref="sessionDropdownRef">
          <label class="form-label">Academic Session *</label>
          <div class="custom-select" @click="toggleDropdown('session')" :class="{ active: dropdowns.session.open }">
            <div class="selected-text">{{ getSessionLabel(assignmentForm.academic_session_id) || 'Select Session' }}</div>
            <span class="arrow">▼</span>
          </div>
          <div v-if="dropdowns.session.open" class="dropdown-menu">
            <div class="search-wrap">
               <input v-model="dropdowns.session.search" placeholder="Search..." class="dd-search" @click.stop ref="sessionSearchInput">
            </div>
            <div class="options-list">
               <div v-for="sess in filteredSessions" :key="sess.id" class="option-item" @click="selectItem('session', sess.id)">
                  {{ sess.name }} <span v-if="sess.is_current" class="badge-mini">Current</span>
               </div>
               <div v-if="filteredSessions.length === 0" class="no-results">No results</div>
            </div>
          </div>
        </div>

        <div class="form-group dropdown-container" ref="courseDropdownRef">
          <label class="form-label">Course *</label>
          <div class="custom-select" @click="toggleDropdown('course')" :class="{ active: dropdowns.course.open }">
            <div class="selected-text">{{ getCourseLabel(assignmentForm.course_id) || 'Select Course' }}</div>
            <span class="arrow">▼</span>
          </div>
          <div v-if="dropdowns.course.open" class="dropdown-menu">
            <div class="search-wrap">
               <input v-model="dropdowns.course.search" placeholder="Search..." class="dd-search" @click.stop ref="courseSearchInput">
            </div>
            <div class="options-list">
               <div v-for="course in filteredCourses" :key="course.id" class="option-item" @click="selectItem('course', course.id)">
                  <span class="opt-code">{{ course.code }}</span> {{ course.name }}
               </div>
               <div v-if="filteredCourses.length === 0" class="no-results">No results</div>
            </div>
          </div>
        </div>

        <div class="form-group dropdown-container" ref="lecturerDropdownRef">
          <label class="form-label">Lecturer (Optional)</label>
          <div class="custom-select" @click="toggleDropdown('lecturer')" :class="{ active: dropdowns.lecturer.open }">
            <div class="selected-text">{{ getLecturerLabel(assignmentForm.lecturer_id) || 'Unassigned' }}</div>
            <span class="arrow">▼</span>
          </div>
          <div v-if="dropdowns.lecturer.open" class="dropdown-menu">
            <div class="search-wrap">
               <input v-model="dropdowns.lecturer.search" placeholder="Search..." class="dd-search" @click.stop ref="lecturerSearchInput">
            </div>
            <div class="options-list">
               <div class="option-item" @click="selectItem('lecturer', '')">Unassigned</div>
               <div v-for="lect in filteredLecturers" :key="lect.id" class="option-item" @click="selectItem('lecturer', lect.id)">
                  {{ lect.name }}
               </div>
               <div v-if="filteredLecturers.length === 0" class="no-results">No results</div>
            </div>
          </div>
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
            <span v-if="assignmentLoading" class="btn-loading-content"><AppSpinner size="sm" color="light" /> Assigning...</span>
            <span v-else>Assign</span>
          </button>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showReassignModal" title="Reassign Lecturer" width="400px" @close="closeReassignModal">
      <div v-if="reassignError" class="modal-error">{{ reassignError }}</div>
      <form @submit.prevent="reassignLecturer" class="modal-form">
        <div class="form-group dropdown-container" ref="reassignDropdownRef">
          <label class="form-label">Select New Lecturer</label>
          <div class="custom-select" @click="toggleDropdown('reassign')" :class="{ active: dropdowns.reassign.open }">
            <div class="selected-text">{{ getLecturerLabel(reassignForm.lecturer_id) || 'Unassigned' }}</div>
            <span class="arrow">▼</span>
          </div>
          <div v-if="dropdowns.reassign.open" class="dropdown-menu">
            <div class="search-wrap">
               <input v-model="dropdowns.reassign.search" placeholder="Search..." class="dd-search" @click.stop ref="reassignSearchInput">
            </div>
            <div class="options-list">
               <div class="option-item" @click="selectReassignItem('')">Unassigned</div>
               <div v-for="lect in filteredReassignLecturers" :key="lect.id" class="option-item" @click="selectReassignItem(lect.id)">
                  {{ lect.name }}
               </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn outline" @click="closeReassignModal">Cancel</button>
          <button type="submit" class="btn primary" :disabled="reassignLoading">
             <span v-if="reassignLoading" class="btn-loading-content"><AppSpinner size="sm" color="light" /> Saving...</span>
             <span v-else>Save</span>
          </button>
        </div>
      </form>
    </AppModal>

    <AppModal :show="showDeleteModal" :title="deleteTitle" width="450px" @close="showDeleteModal = false">
      <div class="confirmation-content">
        <h3>Are you sure?</h3>
        <p v-html="deleteMessage"></p>
      </div>
      <template #footer>
        <div class="modal-actions centered">
          <button class="btn outline" @click="showDeleteModal = false">Cancel</button>
          <button class="btn danger" @click="executeDelete" :disabled="deleteLoading">
            <span v-if="deleteLoading" class="btn-loading-content"><AppSpinner size="sm" color="light" /> Processing...</span>
            <span v-else>{{ deleteConfirmText }}</span>
          </button>
        </div>
      </template>
    </AppModal>

  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import AppModal from '../../components/reusable/AppModal.vue'
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'
import AppPagination from '../../components/reusable/AppPagination.vue'
import AppSpinner from '../../components/reusable/AppSpinner.vue'
import api from '@/api/api'

export default {
  name: 'HodModules',
  components: { AppModal, AppSkeleton, AppPagination, AppSpinner },
  setup() {
    // --- State ---
    const activeTab = ref('modules')
    const statsLoading = ref(true)
    const stats = ref({})
    
    // Modules State
    const modules = ref([])
    const modulesLoading = ref(true)
    const modulesSearch = ref('')
    const modulesPaginator = ref({})

    // Assignments State
    const assignments = ref([])
    const assignmentsLoading = ref(true)
    const assignmentsSearch = ref('')
    const assignmentsYear = ref('')
    const assignmentsSemester = ref('')
    const assignmentsPaginator = ref({})

    // Data Lists
    const availableCourses = ref([])
    const departmentLecturers = ref([])
    const availableYears = ref([])
    const academicSessions = ref([])

    // Forms
    const moduleForm = ref({ name: '', code: '', credits: 10, description: '' })
    const assignmentForm = ref({ module_id: '', course_id: '', lecturer_id: '', academic_session_id: '', year: 1, semester: '1' })
    const reassignForm = ref({ lecturer_id: '' })

    // Modals
    const showModuleModal = ref(false)
    const showAssignmentModal = ref(false)
    const showReassignModal = ref(false)
    const showDeleteModal = ref(false)
    const showDetailsModal = ref(false)
    
    // Loaders & Errors
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
    const selectedModuleDetails = ref(null) 
    const itemToDelete = ref(null)
    const deleteType = ref('')

    // --- Dropdown Management ---
    const dropdowns = reactive({
      session: { open: false, search: '' },
      course: { open: false, search: '' },
      lecturer: { open: false, search: '' },
      reassign: { open: false, search: '' }
    })
    
    const sessionDropdownRef = ref(null)
    const courseDropdownRef = ref(null)
    const lecturerDropdownRef = ref(null)
    const reassignDropdownRef = ref(null)
    const sessionSearchInput = ref(null)
    const courseSearchInput = ref(null)
    const lecturerSearchInput = ref(null)
    const reassignSearchInput = ref(null)

    // --- Computed ---
    const statsDisplay = computed(() => [
      { label: 'Total Modules', value: stats.value.total_modules || 0, icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>', colorClass: 'primary' },
      { label: 'Assigned', value: stats.value.assigned_modules || 0, icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>', colorClass: 'warning' },
      { label: 'Total Credits', value: modules.value.reduce((acc, m) => acc + (m.credits || 0), 0), icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>', colorClass: 'secondary' }
    ])

    const deleteTitle = computed(() => deleteType.value === 'module' ? 'Delete Module' : 'Remove Assignment')
    const deleteMessage = computed(() => {
      if(!itemToDelete.value) return ''
      return deleteType.value === 'module' ? `Delete <strong>${itemToDelete.value.name}</strong>?` : `Remove assignment for <strong>${itemToDelete.value.module?.code}</strong>?`
    })
    const deleteConfirmText = computed(() => deleteType.value === 'module' ? 'Delete' : 'Remove')

    // Filtered Options for Custom Selects
    const filteredSessions = computed(() => {
       const q = dropdowns.session.search.toLowerCase()
       return academicSessions.value.filter(s => s.name.toLowerCase().includes(q))
    })
    const filteredCourses = computed(() => {
       const q = dropdowns.course.search.toLowerCase()
       return availableCourses.value.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
    })
    const filteredLecturers = computed(() => {
       const q = dropdowns.lecturer.search.toLowerCase()
       return departmentLecturers.value.filter(l => l.name.toLowerCase().includes(q))
    })
    const filteredReassignLecturers = computed(() => {
       const q = dropdowns.reassign.search.toLowerCase()
       return departmentLecturers.value.filter(l => l.name.toLowerCase().includes(q))
    })

    // --- Methods ---
    const getInitials = (n) => n ? n.substring(0,2).toUpperCase() : 'NA'
    const getSemesterGradient = (s) => ({ background: s == 1 ? 'linear-gradient(135deg, #1E88E5, #1565C0)' : 'linear-gradient(135deg, #8E24AA, #6A1B9A)' })

    // Label Getters for Custom Select
    const getSessionLabel = (id) => academicSessions.value.find(s => s.id === id)?.name
    const getCourseLabel = (id) => { const c = availableCourses.value.find(x => x.id === id); return c ? `${c.code} - ${c.name}` : '' }
    const getLecturerLabel = (id) => departmentLecturers.value.find(l => l.id === id)?.name

    // Custom Dropdown Logic
    const toggleDropdown = (key) => {
       // Close others
       Object.keys(dropdowns).forEach(k => { if(k !== key) dropdowns[k].open = false })
       
       dropdowns[key].open = !dropdowns[key].open
       if(dropdowns[key].open) {
          dropdowns[key].search = ''
          nextTick(() => {
             if(key === 'session') sessionSearchInput.value?.focus()
             if(key === 'course') courseSearchInput.value?.focus()
             if(key === 'lecturer') lecturerSearchInput.value?.focus()
             if(key === 'reassign') reassignSearchInput.value?.focus()
          })
       }
    }

    const selectItem = (type, id) => {
       if(type === 'session') assignmentForm.value.academic_session_id = id
       if(type === 'course') assignmentForm.value.course_id = id
       if(type === 'lecturer') assignmentForm.value.lecturer_id = id
       dropdowns[type].open = false
    }

    const selectReassignItem = (id) => {
       reassignForm.value.lecturer_id = id
       dropdowns.reassign.open = false
    }

    const closeAllDropdowns = (e) => {
       if(sessionDropdownRef.value && !sessionDropdownRef.value.contains(e.target)) dropdowns.session.open = false
       if(courseDropdownRef.value && !courseDropdownRef.value.contains(e.target)) dropdowns.course.open = false
       if(lecturerDropdownRef.value && !lecturerDropdownRef.value.contains(e.target)) dropdowns.lecturer.open = false
       if(reassignDropdownRef.value && !reassignDropdownRef.value.contains(e.target)) dropdowns.reassign.open = false
    }

    // --- API Calls ---
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

    const openDetailsModal = async (module) => {
      selectedModuleDetails.value = null
      showDetailsModal.value = true
      detailsLoading.value = true
      try {
        const res = await api.get(`/hod/modules/${module.id}`)
        selectedModuleDetails.value = res.data.module
      } catch (error) { console.error(error) } finally { detailsLoading.value = false }
    }
    const closeDetailsModal = () => { showDetailsModal.value = false; selectedModuleDetails.value = null }

    const openAssignmentModal = (m) => {
       selectedModule.value = m
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
          // Send array of course_ids (single selected wrapped in array)
          const payload = { ...assignmentForm.value, course_ids: [assignmentForm.value.course_id] }
          delete payload.course_id 

          await api.post('/hod/modules/assign-course', payload)
          closeAssignmentModal()
          fetchAssignments()
       } catch(e) { 
          if(e.response?.data?.errors?.course_ids) assignmentError.value = e.response.data.errors.course_ids[0]
          else assignmentError.value = e.response?.data?.message || 'Failed' 
       }
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

    const initiateDeleteModule = (m) => { itemToDelete.value = m; deleteType.value = 'module'; deleteError.value = ''; showDeleteModal.value = true }
    const initiateRemoveAssignment = (a) => { itemToDelete.value = a; deleteType.value = 'assignment'; deleteError.value = ''; showDeleteModal.value = true }

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
    watch(modulesSearch, () => { clearTimeout(debounce); debounce = setTimeout(() => fetchModules(1), 500) })
    watch(assignmentsSearch, () => { clearTimeout(debounce); debounce = setTimeout(() => fetchAssignments(1), 500) })

    onMounted(() => {
       fetchStatistics()
       fetchModules()
       fetchAssignments()
       document.addEventListener('click', closeAllDropdowns)
    })
    
    onUnmounted(() => {
       document.removeEventListener('click', closeAllDropdowns)
    })

    return {
       activeTab, stats, statsLoading, statsDisplay,
       modules, modulesLoading, modulesSearch, modulesPaginator,
       assignments, assignmentsLoading, assignmentsSearch, assignmentsPaginator,
       assignmentsYear, assignmentsSemester, availableYears, availableCourses, departmentLecturers, academicSessions,
       moduleForm, assignmentForm, reassignForm,
       showModuleModal, showAssignmentModal, showReassignModal, showDeleteModal,
       showDetailsModal, detailsLoading, 
       moduleLoading, assignmentLoading, reassignLoading, deleteLoading,
       moduleError, assignmentError, reassignError, deleteError,
       editingModule, selectedModule, selectedModuleDetails, 
       deleteTitle, deleteMessage, deleteConfirmText,
       getInitials, getSemesterGradient,
       fetchModules, fetchAssignments,
       openCreateModal, openEditModal, saveModule,
       openDetailsModal, closeDetailsModal,
       openAssignmentModal, assignModuleToCourse,
       openReassignModal, reassignLecturer,
       initiateDeleteModule, initiateRemoveAssignment, executeDelete,
       closeModuleModal, closeAssignmentModal, closeReassignModal,
       // Custom Select
       dropdowns, toggleDropdown, selectItem, selectReassignItem,
       sessionDropdownRef, courseDropdownRef, lecturerDropdownRef, reassignDropdownRef,
       sessionSearchInput, courseSearchInput, lecturerSearchInput, reassignSearchInput,
       filteredSessions, filteredCourses, filteredLecturers, filteredReassignLecturers,
       getSessionLabel, getCourseLabel, getLecturerLabel
    }
  }
}
</script>

<style scoped>
/* Base Layout */
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

/* Grid & Cards */
.modules-grid, .assignments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.module-card, .assignment-card { background: white; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s; }
.module-card:hover, .assignment-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--primary-light); }
.card-decoration { height: 4px; width: 100%; }
.card-decoration.primary-gradient { background: linear-gradient(135deg, #1E88E5, #1565C0); }
.card-body { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }
.module-header, .assignment-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.module-badge, .assignment-badge { display: flex; gap: 6px; }
.module-code-badge { font-weight: 700; background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; }
.credits-badge { background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 600; }
.year-badge, .semester-badge { padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; background: #e0e7ff; color: #4338ca; }
.module-name { font-size: 1.15rem; font-weight: 700; color: var(--dark-color); margin: 0 0 10px 0; line-height: 1.4; }
.module-desc-text { font-size: 0.9rem; color: #666; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 1rem; }
.info-group { margin-bottom: 0.8rem; }
.info-group label { font-size: 0.75rem; color: #888; text-transform: uppercase; display: block; margin-bottom: 2px; }
.card-actions { margin-top: auto; display: flex; gap: 8px; }
.action-btn, .btn { flex: 1; padding: 8px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: 0.2s; }
.primary, .btn.primary { background: var(--primary-color); color: white; }
.outline, .btn.outline { border-color: var(--gray-light); background: transparent; color: #444; }
.danger, .btn.danger { background: var(--danger-color); color: white; }
.icon-btn { background: transparent; border: none; padding: 4px; color: #888; cursor: pointer; transition: 0.2s; border-radius: 4px; }
.icon-btn:hover { background: #f3f4f6; color: var(--primary-color); }
.icon-btn.danger:hover { color: var(--danger-color); }
.lecturer-chip { display: flex; align-items: center; gap: 6px; }
.avatar-xs { width: 24px; height: 24px; background: #dbeafe; color: #1e40af; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; }

/* Custom Searchable Dropdown Styles */
.dropdown-container { position: relative; }
.custom-select {
  width: 100%; padding: 10px 12px; border: 1px solid var(--gray-light);
  border-radius: 8px; background: white; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.9rem; transition: border 0.2s;
}
.custom-select:hover, .custom-select.active { border-color: var(--primary-color); }
.custom-select .arrow { font-size: 0.7rem; color: #999; }
.dropdown-menu {
  position: absolute; top: 100%; left: 0; right: 0; z-index: 100;
  background: white; border: 1px solid var(--gray-light);
  border-radius: 8px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
}
.search-wrap { padding: 8px; border-bottom: 1px solid var(--gray-light); }
.dd-search {
  width: 100%; padding: 6px 10px; border: 1px solid var(--gray-light);
  border-radius: 4px; font-size: 0.85rem; outline: none;
}
.options-list { max-height: 200px; overflow-y: auto; }
.option-item {
  padding: 8px 12px; font-size: 0.9rem; color: var(--dark-color);
  cursor: pointer; transition: background 0.2s;
}
.option-item:hover { background: #f3f4f6; color: var(--primary-color); }
.no-results { padding: 10px; text-align: center; color: #999; font-size: 0.85rem; }
.badge-mini { font-size: 0.7rem; background: #dcfce7; color: #166534; padding: 1px 6px; border-radius: 4px; margin-left: 6px; }
.opt-code { font-weight: 600; color: #666; margin-right: 4px; }

/* Skeleton */
.skeleton-stat-card { height: 100px; background: white; border-radius: 12px; overflow: hidden; border: 1px solid var(--gray-light); }
.skeleton-card { background: white; border-radius: 12px; border: 1px solid var(--gray-light); padding: 1.25rem; }
.btn-loading-content { display: flex; align-items: center; gap: 8px; }
.empty-state { text-align: center; padding: 3rem; color: var(--gray-color); }
.empty-icon { color: var(--gray-light); margin-bottom: 1rem; }

/* Modal specific */
.form-group { margin-bottom: 1rem; }
.form-label { display: block; margin-bottom: 0.4rem; font-weight: 500; font-size: 0.9rem; }
.form-control { width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem; }
.modal-error { background: #fef2f2; color: #991b1b; padding: 10px; border-radius: 6px; margin-bottom: 1rem; font-size: 0.9rem; }

@media (max-width: 768px) {
  .modules-grid, .assignments-grid { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
}
</style>