import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/api'

export const useLecturerStore = defineStore('lecturer', () => {
  // State
  const lecturers = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getLecturerById = (id) => {
    return lecturers.value.find(lecturer => lecturer.id === id)
  }

  const getActiveLecturers = () => {
    return lecturers.value.filter(lecturer => lecturer.status === 'active')
  }

  const getInactiveLecturers = () => {
    return lecturers.value.filter(lecturer => lecturer.status === 'inactive')
  }

  // Actions
  const fetchLecturers = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get('/department-lecturers')
      
      if (response.data.success) {
        lecturers.value = response.data.lecturers
        console.log('📚 Lecturers fetched and stored:', lecturers.value.length)
      } else {
        throw new Error(response.data.message || 'Failed to fetch lecturers')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('❌ Error fetching lecturers:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createLecturer = async (lecturerData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/lecturer/register', lecturerData)
      
      if (response.data.success) {
        // Add the new lecturer to the store
        lecturers.value.push(response.data.lecturer)
        console.log('✅ Lecturer created and added to store:', response.data.lecturer.name)
        return response.data.lecturer
      } else {
        throw new Error(response.data.message || 'Failed to create lecturer')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('❌ Error creating lecturer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateLecturer = async (id, lecturerData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.put(`/lecturer/${id}`, lecturerData)
      
      if (response.data.success) {
        // Update the lecturer in the store
        const index = lecturers.value.findIndex(lecturer => lecturer.id === id)
        if (index !== -1) {
          lecturers.value[index] = response.data.lecturer
        }
        console.log('✅ Lecturer updated in store:', response.data.lecturer.name)
        return response.data.lecturer
      } else {
        throw new Error(response.data.message || 'Failed to update lecturer')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('❌ Error updating lecturer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteLecturer = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.delete(`/lecturer/${id}`)
      
      if (response.data.success) {
        // Remove the lecturer from the store
        lecturers.value = lecturers.value.filter(lecturer => lecturer.id !== id)
        console.log('🗑️ Lecturer deleted from store, ID:', id)
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to delete lecturer')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      console.error('❌ Error deleting lecturer:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleLecturerStatus = async (id) => {
    try {
      const lecturer = getLecturerById(id)
      if (!lecturer) {
        throw new Error('Lecturer not found')
      }

      const newStatus = lecturer.status === 'active' ? 'inactive' : 'active'
      
      return await updateLecturer(id, {
        name: lecturer.name,
        email: lecturer.email,
        phone: lecturer.phone,
        is_active: newStatus === 'active'
      })
    } catch (err) {
      console.error('❌ Error toggling lecturer status:', err)
      throw err
    }
  }

  // Search lecturers by name or email
  const searchLecturers = (query) => {
    if (!query) return lecturers.value
    
    const lowerQuery = query.toLowerCase()
    return lecturers.value.filter(lecturer =>
      lecturer.name.toLowerCase().includes(lowerQuery) ||
      lecturer.email.toLowerCase().includes(lowerQuery) ||
      (lecturer.phone && lecturer.phone.includes(query))
    )
  }

  // Filter lecturers by status
  const filterLecturersByStatus = (status) => {
    if (!status) return lecturers.value
    return lecturers.value.filter(lecturer => lecturer.status === status)
  }

  // Clear store data
  const clearStore = () => {
    lecturers.value = []
    error.value = null
  }

  return {
    // State
    lecturers,
    loading,
    error,
    
    // Getters
    getLecturerById,
    getActiveLecturers,
    getInactiveLecturers,
    
    // Actions
    fetchLecturers,
    createLecturer,
    updateLecturer,
    deleteLecturer,
    toggleLecturerStatus,
    searchLecturers,
    filterLecturersByStatus,
    clearStore
  }
})