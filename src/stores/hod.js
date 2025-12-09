import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/api'

export const useHodStore = defineStore('hod', () => {
  // State
  const students = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const activeCount = () => students.value.filter(s => s.status === 'active').length
  const pendingCount = () => students.value.filter(s => s.status === 'pending').length
  const graduatedCount = () => students.value.filter(s => s.is_graduated).length

  const getStudentById = (id) => {
    return students.value.find(student => student.id === id)
  }

  const getPendingStudents = () => {
    return students.value.filter(student => student.status === 'pending')
  }

  const getActiveStudents = () => {
    return students.value.filter(student => student.status === 'active' && !student.is_graduated)
  }

  const getGraduatedStudents = () => {
    return students.value.filter(student => student.is_graduated)
  }

  // Actions
  const fetchStudents = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/department-students')
      
      if (response.data.success) {
        students.value = response.data.students
        console.log('📚 Students fetched and stored:', students.value.length)
        console.log('🔍 API Debug Info:', response.data.debug_info)
        
        // Return the response for debugging
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch students')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('❌ Error fetching students:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const approveStudent = async (studentId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.put(`/students/${studentId}/approve`)
      
      if (response.data.success) {
        // Update the student in the store
        const index = students.value.findIndex(student => student.id === studentId)
        if (index !== -1) {
          students.value[index] = response.data.student
        }
        console.log('✅ Student approved:', response.data.student.name)
        return response.data.student
      } else {
        throw new Error(response.data.message || 'Failed to approve student')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('❌ Error approving student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const approveAllStudents = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/students/approve-all')
      
      if (response.data.success) {
        // Refresh the entire list
        await fetchStudents()
        console.log('✅ All students approved')
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to approve all students')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('❌ Error approving all students:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const promoteStudent = async (studentId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.put(`/students/${studentId}/promote`)
      
      if (response.data.success) {
        // Update the student in the store
        const index = students.value.findIndex(student => student.id === studentId)
        if (index !== -1) {
          students.value[index] = response.data.student
        }
        console.log('✅ Student promoted:', response.data.student.name)
        return response.data.student
      } else {
        throw new Error(response.data.message || 'Failed to promote student')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('❌ Error promoting student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const promoteAllStudents = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/students/promote-all')
      
      if (response.data.success) {
        // Refresh the entire list
        await fetchStudents()
        console.log('✅ All students promoted')
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to promote all students')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('❌ Error promoting all students:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteStudent = async (studentId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.delete(`/students/${studentId}`)
      
      if (response.data.success) {
        // Remove the student from the store
        students.value = students.value.filter(student => student.id !== studentId)
        console.log('🗑️ Student deleted:', studentId)
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to delete student')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('❌ Error deleting student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search students by name, email, or registration number
  const searchStudents = (query) => {
    if (!query) return students.value
    
    const lowerQuery = query.toLowerCase()
    return students.value.filter(student =>
      student.name.toLowerCase().includes(lowerQuery) ||
      student.email.toLowerCase().includes(lowerQuery) ||
      (student.reg_number && student.reg_number.toLowerCase().includes(lowerQuery))
    )
  }

  // Filter students by status
  const filterStudentsByStatus = (status) => {
    if (!status) return students.value
    return students.value.filter(student => student.status === status)
  }

  // Clear store data
  const clearStore = () => {
    students.value = []
    error.value = null
  }

  return {
    // State
    students,
    loading,
    error,
    
    // Getters
    activeCount,
    pendingCount,
    graduatedCount,
    getStudentById,
    getPendingStudents,
    getActiveStudents,
    getGraduatedStudents,
    
    // Actions
    fetchStudents,
    approveStudent,
    approveAllStudents,
    promoteStudent,
    promoteAllStudents,
    deleteStudent,
    searchStudents,
    filterStudentsByStatus,
    clearStore
  }
})