import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const departments = ref([])
  const courses = ref([])
  const modules = ref([])
  const lecturers = ref([])
  
  function addDepartment(department) {
    departments.value.push({
      id: Date.now().toString(),
      ...department,
      createdAt: new Date().toISOString()
    })
  }
  
  function addCourse(course) {
    courses.value.push({
      id: Date.now().toString(),
      ...course,
      createdAt: new Date().toISOString()
    })
  }
  
  function addModule(module) {
    modules.value.push({
      id: Date.now().toString(),
      ...module,
      createdAt: new Date().toISOString()
    })
  }
  
  function registerLecturer(lecturer) {
    lecturers.value.push({
      id: Date.now().toString(),
      ...lecturer,
      password: 'default123',
      createdAt: new Date().toISOString()
    })
  }
  
  function assignModuleToLecturer(lecturerId, moduleId) {
    const lecturer = lecturers.value.find(l => l.id === lecturerId)
    if (lecturer) {
      if (!lecturer.assignedModules) {
        lecturer.assignedModules = []
      }
      lecturer.assignedModules.push(moduleId)
    }
  }
  
  return {
    departments,
    courses,
    modules,
    lecturers,
    addDepartment,
    addCourse,
    addModule,
    registerLecturer,
    assignModuleToLecturer
  }
})