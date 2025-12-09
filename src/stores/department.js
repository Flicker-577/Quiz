// stores/department.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/api'

export const useDepartmentStore = defineStore('department', () => {
  // State
  const departments = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const activeDepartments = computed(() => 
    departments.value.filter(dept => dept.status === 'active')
  )

  const departmentOptions = computed(() => {
    return departments.value.map(dept => ({
      id: dept.id,
      name: dept.name,
      code: dept.code,
      has_hod: dept.has_hod || false,
      description: dept.description || ''
    }))
  })

  const departmentsWithHods = computed(() =>
    departments.value.filter(dept => dept.has_hod)
  )

  const departmentsWithoutHods = computed(() =>
    departments.value.filter(dept => !dept.has_hod)
  )

  const totalDepartments = computed(() => departments.value.length)
  const totalActiveDepartments = computed(() => activeDepartments.value.length)

  // Actions
  const fetchDepartments = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/departments/active')
      
      if (response.data.success) {
        departments.value = response.data.data.map(dept => ({
          id: dept.id,
          name: dept.name,
          code: dept.code,
          description: dept.description,
          has_hod: dept.has_hod || false,
          status: 'active' // Since we're fetching active departments
        }))
      } else {
        throw new Error(response.data.message || 'Failed to fetch departments')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Failed to fetch departments:', err)
      
      // Try fallback to regular departments endpoint
      try {
        console.log('Trying fallback to /departments endpoint...')
        const fallbackResponse = await api.get('/departments')
        if (fallbackResponse.data.success) {
          departments.value = fallbackResponse.data.data.map(dept => ({
            id: dept.id,
            name: dept.name,
            code: dept.code,
            description: dept.description,
            has_hod: !!dept.hod, // Check if department has HOD
            status: dept.status || 'active'
          }))
        }
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr)
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDepartmentsDropdown = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/departments/dropdown')
      
      if (response.data.success) {
        departments.value = response.data.data.map(dept => ({
          id: dept.id,
          name: dept.name,
          code: dept.code,
          has_hod: dept.has_hod || false,
          status: 'active'
        }))
      } else {
        throw new Error(response.data.message || 'Failed to fetch departments dropdown')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Failed to fetch departments dropdown:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getDepartmentById = (id) => {
    return departments.value.find(dept => dept.id == id)
  }

  const getDepartmentByName = (name) => {
    return departments.value.find(dept => 
      dept.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  const searchDepartments = (query) => {
    if (!query) return departmentOptions.value
    const searchTerm = query.toLowerCase()
    return departmentOptions.value.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm) ||
      (dept.code && dept.code.toLowerCase().includes(searchTerm)) ||
      (dept.description && dept.description.toLowerCase().includes(searchTerm))
    )
  }

  // Initialize store
  const initialize = async () => {
    await fetchDepartments()
  }

  return {
    // State
    departments,
    loading,
    error,

    // Getters
    activeDepartments,
    departmentOptions,
    departmentsWithHods,
    departmentsWithoutHods,
    totalDepartments,
    totalActiveDepartments,

    // Actions
    fetchDepartments,
    fetchDepartmentsDropdown,
    getDepartmentById,
    getDepartmentByName,
    searchDepartments,
    initialize
  }
})