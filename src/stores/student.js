// stores/studentStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/api'

export const useStudentStore = defineStore('student', () => {
  const students = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const activeCount = computed(() => students.value.filter(s => s.status === 'active').length)
  const pendingCount = computed(() => students.value.filter(s => s.status === 'pending').length)
  const graduatedCount = computed(() => students.value.filter(s => s.is_graduated).length)

  // Actions
  const fetchStudents = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get('/users?role=student')
      
      if (response.data) {
        students.value = response.data
      } else {
        throw new Error('Failed to fetch students')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Failed to fetch students:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const approveStudent = async (id) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.put(`/users/${id}`, { status: 'active' })
      
      if (response.data) {
        await fetchStudents()
        return response.data
      } else {
        throw new Error('Failed to approve student')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Failed to approve student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const approveAllStudents = async () => {
    try {
      loading.value = true
      error.value = null
      const pendingStudents = students.value.filter(s => s.status === 'pending')
      
      const promises = pendingStudents.map(student => 
        api.put(`/users/${student.id}`, { status: 'active' })
      )
      
      await Promise.all(promises)
      await fetchStudents()
      return { success: true, message: 'All pending students approved successfully' }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Failed to approve all students:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const promoteStudent = async (id, newYear, newSemester) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.put(`/users/${id}`, {
        year_of_study: newYear,
        semester: newSemester
      })
      
      if (response.data) {
        await fetchStudents()
        return response.data
      } else {
        throw new Error('Failed to promote student')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Failed to promote student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const promoteAllStudents = async () => {
    try {
      loading.value = true
      error.value = null
      const activeStudents = students.value.filter(s => s.status === 'active' && !s.is_graduated)
      
      const promotionPromises = activeStudents.map(student => {
        let newYear = student.year_of_study
        let newSemester = student.semester
        
        if (student.semester === '1') {
          newSemester = '2'
        } else {
          newSemester = '1'
          newYear = String(parseInt(newYear) + 1)
        }
        
        return api.put(`/users/${student.id}`, {
          year_of_study: newYear,
          semester: newSemester
        })
      })
      
      await Promise.all(promotionPromises)
      await fetchStudents()
      return { success: true, message: 'All active students promoted successfully' }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Failed to promote all students:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteStudent = async (id) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.delete(`/users/${id}`)
      
      if (response.data) {
        await fetchStudents()
        return response.data
      } else {
        throw new Error('Failed to delete student')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('Failed to delete student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    students,
    loading,
    error,
    activeCount,
    pendingCount,
    graduatedCount,
    fetchStudents,
    approveStudent,
    approveAllStudents,
    promoteStudent,
    promoteAllStudents,
    deleteStudent
  }
})