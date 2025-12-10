<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-section">
        <div class="login-card">
          <div class="login-header">
            <img src="/logo-no.jpg" alt="logo" class="logo-img">
            <h2>Create Student Account</h2>
            <p>Sign up to get started</p>
          </div>

          <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <form @submit.prevent="handleRegister" class="login-form">
            
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </span>
                <input 
                  v-model="form.name"
                  type="text" 
                  class="form-control"
                  placeholder="Enter your full name"
                  required
                  :disabled="loading"
                >
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </span>
                <input 
                  v-model="form.email"
                  type="email" 
                  class="form-control"
                  placeholder="Enter your email address"
                  required
                  :disabled="loading"
                >
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Registration Number</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H8v-2h4V6h2v4h4v2z"/></svg>
                </span>
                <input 
                  v-model="form.reg_number"
                  type="text" 
                  class="form-control"
                  placeholder="e.g., 2025-04-12345"
                  required
                  :disabled="loading"
                >
              </div>
            </div>

            <div class="form-group" style="position: relative; z-index: 10;">
              <label class="form-label">Select Course</label>
              
              <div class="searchable-select" :class="{ disabled: loading || coursesLoading }">
                <div class="select-header" @click="!loading && !coursesLoading && toggleDropdown()">
                  <span class="selected-value">
                    <span v-if="coursesLoading">Loading courses...</span>
                    <span v-else>{{ selectedCourseName || '-- Select Your Course --' }}</span>
                  </span>
                  <svg class="dropdown-arrow" :class="{ rotated: showDropdown }" 
                       viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                
                <div v-if="showDropdown" class="dropdown-content">
                  <div class="search-input-wrapper">
                    <svg class="search-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input 
                      v-model="searchQuery" 
                      type="text" 
                      class="search-input" 
                      placeholder="Search courses..."
                      @click.stop
                      ref="searchInputRef"
                    >
                  </div>
                  
                  <div class="options-list">
                    <div 
                      v-for="course in filteredCourses" 
                      :key="course.id"
                      class="option-item"
                      :class="{ selected: form.course_id === course.id }"
                      @click="selectCourse(course)"
                    >
                      <div class="course-info">
                        <div class="course-name">{{ course.display_name }}</div>
                      </div>
                    </div>
                    
                    <div v-if="filteredCourses.length === 0" class="no-options">
                      No courses found matching "{{ searchQuery }}"
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                </span>
                <input 
                  v-model="form.password"
                  type="password" 
                  class="form-control"
                  placeholder="Min 8 characters"
                  required
                  :disabled="loading"
                  minlength="8"
                >
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                </span>
                <input 
                  v-model="form.password_confirmation"
                  type="password" 
                  class="form-control"
                  placeholder="Confirm your password"
                  required
                  :disabled="loading"
                >
              </div>
            </div>

            <button 
              type="submit"
              class="login-btn"
              :disabled="loading || !isFormValid || coursesLoading"
              :class="{ 'loading': loading }"
            >
              <span v-if="!loading" class="btn-text">Create Account</span>
              <span v-else class="btn-loading">
                <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                </svg>
                Registering...
              </span>
            </button>

            <div v-if="error" class="alert alert-error">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {{ error }}
            </div>
          </form>

          <div class="text-center mt-3">
            <p class="text-sm">
              Already have an account? 
              <router-link to="/login" class="font-medium text-primary-dark">
                Sign In
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // Form State
    const form = ref({
      name: '',
      email: '',
      reg_number: '',
      course_id: '',
      password: '',
      password_confirmation: ''
    })
    
    // Dropdown State
    const showDropdown = ref(false)
    const searchQuery = ref('')
    const searchInputRef = ref(null)

    // Data State
    const courses = ref([])
    const coursesLoading = ref(false)
    const loading = ref(false)
    const error = ref('')
    const successMessage = ref('')
    const debugInfo = ref('')

    // --- Computed Properties ---

    const isFormValid = computed(() => {
      return form.value.name && 
             form.value.email && 
             form.value.reg_number && 
             form.value.course_id &&
             form.value.password && 
             form.value.password_confirmation &&
             form.value.password.length >= 8
    })

    const selectedCourseName = computed(() => {
      const course = courses.value.find(c => c.id === form.value.course_id)
      return course ? course.display_name : ''
    })

    const filteredCourses = computed(() => {
      if (!searchQuery.value) return courses.value
      const lowerQuery = searchQuery.value.toLowerCase()
      return courses.value.filter(course => 
        course.display_name.toLowerCase().includes(lowerQuery)
      )
    })

    // --- Methods ---

    // Fetch available courses
    const fetchCourses = async () => {
      coursesLoading.value = true
      try {
        const response = await fetch('/api/courses')
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        courses.value = await response.json()
        debugInfo.value += `✅ Loaded ${courses.value.length} courses\n`
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        debugInfo.value += `❌ Failed to load courses: ${err.message}\n`
        error.value = 'Failed to load available courses. Please refresh the page.'
      } finally {
        coursesLoading.value = false
      }
    }

    // Dropdown Methods
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
      if (showDropdown.value) {
        searchQuery.value = ''
        setTimeout(() => searchInputRef.value?.focus(), 100)
      }
    }

    const selectCourse = (course) => {
      form.value.course_id = course.id
      showDropdown.value = false
      searchQuery.value = ''
    }

    const closeDropdown = (event) => {
      if (!event.target.closest('.searchable-select')) {
        showDropdown.value = false
      }
    }

    const handleRegister = async () => {
      loading.value = true
      error.value = ''
      successMessage.value = ''
      debugInfo.value = 'Starting registration...\n'

      if (form.value.password.length < 8) {
        error.value = 'Password must be at least 8 characters long.'
        loading.value = false
        return
      }

      if (form.value.password !== form.value.password_confirmation) {
        error.value = 'Passwords do not match.'
        loading.value = false
        return
      }

      if (!form.value.course_id) {
        error.value = 'Please select your course.'
        loading.value = false
        return
      }
      
      try {
        debugInfo.value += `Sending data to backend:\n${JSON.stringify(form.value, null, 2)}\n`
        const response = await authStore.register(form.value)

        debugInfo.value += '✅ Registration successful!\n'
        successMessage.value = response.message || 'Registration successful! Please wait for HOD approval. Redirecting to login...'
        
        // Reset form
        form.value = {
          name: '', 
          email: '', 
          reg_number: '',
          course_id: '',
          password: '', 
          password_confirmation: ''
        }

        setTimeout(() => {
          router.push('/login')
        }, 3000)
        
      } catch (err) {
        console.error('❌ Registration error:', err)
        debugInfo.value += `❌ Error: ${err.message}\n`
        
        if (err.response?.data?.errors) {
          const errors = err.response.data.errors
          const firstError = Object.values(errors)[0][0]
          error.value = firstError
        } else if (err.response?.data?.message) {
          error.value = err.response.data.message
        } else {
          error.value = err.message || 'Registration failed. Please try again.'
        }
      } finally {
        loading.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      document.addEventListener('click', closeDropdown)
      fetchCourses()
    })

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown)
    })
    
    return {
      // State
      form,
      courses,
      coursesLoading,
      loading,
      error,
      successMessage,
      debugInfo,
      // Dropdown State
      showDropdown,
      searchQuery,
      searchInputRef,
      // Computed
      isFormValid,
      selectedCourseName,
      filteredCourses,
      // Methods
      toggleDropdown,
      selectCourse,
      handleRegister,
    }
  }
}
</script>

<style scoped>
/* Base Layout */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-none);
  position: relative;
  font-family: var(--font-family);
  padding: 20px;
}

.login-wrapper {
  max-width: 480px; 
  width: 100%;
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  margin: 20px;
  z-index: 2;
  position: relative;
}

.logo-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  box-shadow: 0 0 0 4px var(--primary-soft);
  object-fit: cover;
}

.login-section {
  padding: 50px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.login-header p {
  color: var(--gray-color);
  font-size: 0.95rem;
}

.login-form {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: var(--dark-color);
  font-weight: 600;
  font-size: 0.9rem;
  margin-left: 2px;
}

/* --- UPDATED DROPDOWN STYLES TO MATCH INPUTS --- */
.searchable-select {
    position: relative;
    width: 100%;
}

.searchable-select.disabled {
    opacity: 0.7;
    pointer-events: none;
}

.select-header {
    padding: 14px 16px;
    border: 1.5px solid #e2e8f0; /* Match Input Border */
    border-radius: var(--border-radius-lg);
    background: white;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;
}

.select-header:hover, .select-header:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px var(--primary-soft); /* Match Input Focus */
}

.selected-value {
    color: var(--dark-color);
    font-size: 0.95rem;
}

.dropdown-arrow {
    transition: transform 0.2s;
    color: var(--gray-color);
}

.dropdown-arrow.rotated {
    transform: rotate(180deg);
}

.dropdown-content {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: var(--border-radius-md);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 100;
    margin-top: 4px;
    overflow: hidden;
}

.search-input-wrapper {
    position: relative;
    padding: 8px;
    border-bottom: 1px solid #e2e8f0;
}

.search-input-wrapper .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-color);
}

.search-input-wrapper .search-input {
    width: 100%;
    padding: 10px 10px 10px 36px;
    border: none;
    background: #f8fafc;
    border-radius: var(--border-radius-md);
    outline: none;
    font-size: 0.9rem;
}

.options-list {
    max-height: 220px;
    overflow-y: auto;
}

.option-item {
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid #f1f5f9;
}

.option-item:last-child {
    border-bottom: none;
}

.option-item:hover {
    background: var(--primary-soft);
}

.option-item.selected {
    background: var(--primary-soft);
    border-left: 3px solid var(--primary-color);
}

.course-name {
    font-weight: 500;
    color: var(--dark-color);
    font-size: 0.9rem;
}

.no-options {
    padding: 16px;
    text-align: center;
    color: var(--gray-color);
    font-style: italic;
    font-size: 0.9rem;
}
/* --- END DROPDOWN STYLES --- */

/* --- UPDATED INPUT STYLES --- */
.input-group {
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8; /* Lighter gray initially */
  z-index: 2;
  transition: color 0.3s ease;
}

/* Highlight icon when input is focused */
.input-group:focus-within .input-icon {
  color: var(--primary-color);
}

.form-control {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1.5px solid #e2e8f0;
  border-radius: var(--border-radius-lg);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
  color: var(--dark-color);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px var(--primary-soft);
}

.form-control:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.8;
}

.form-control::placeholder {
  color: #cbd5e1;
}

/* --- UPDATED BUTTON STYLES --- */
.login-btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--border-radius-lg);
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  position: relative;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 52px;
  margin-top: 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  background: var(--gray-color);
}

.login-btn.loading {
  cursor: wait;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: var(--border-radius-md);
  font-size: 0.9rem;
  margin-top: 16px;
  margin-bottom: 24px;
}

.alert-error {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.text-center { text-align: center; }
.mt-3 { margin-top: 20px; }
.text-sm { font-size: 0.9rem; color: var(--gray-color); }
.font-medium { font-weight: 600; }
.text-primary-dark { color: var(--primary-dark); text-decoration: none; transition: color 0.2s; }
.text-primary-dark:hover { color: var(--primary-color); text-decoration: underline; }

@media (max-width: 480px) {
  .login-wrapper {
    margin: 10px;
    box-shadow: none;
    border: 1px solid #f1f5f9;
  }
  .login-section {
    padding: 30px 20px;
  }
  .login-container {
    background: white;
    align-items: flex-start;
  }
}
</style>