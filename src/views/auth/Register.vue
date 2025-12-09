<template>
  <div class="login-container">
    <!-- Background Animation -->
    <div class="background-animation">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="login-wrapper">
      <!-- Left Side - Branding -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="logo">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="currentColor" d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L5 9.5V15.5L3 16V18L9 16.5V18H15V16.5L21 18V16L19 15.5V9.5L21 9ZM15 16H9V14H15V16ZM15 12H9V10H15V12Z"/>
              </svg>
            </div>
            <h1>QuizMaster Pro</h1>
          </div>
          <div class="brand-text">
            <h2>AI-Powered Quiz Management System</h2>
            <p>Transform education with intelligent quiz generation, automated marking, and real-time analytics.</p>
          </div>
        </div>
      </div>

      <!-- Right Side - Registration Form -->
      <div class="login-section">
        <div class="login-card">
          <div class="login-header">
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
                  <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
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
                  <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
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
                  <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H8v-2h4V6h2v4h4v2z"/></svg>
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

            <!-- Course Selection Dropdown -->
            <div class="form-group">
              <label class="form-label">Select Course</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
                </span>
                <select 
                  v-model="form.course_id"
                  class="form-control"
                  required
                  :disabled="loading || coursesLoading"
                >
                  <option value="">-- Select Your Course --</option>
                  <option 
                    v-for="course in courses" 
                    :key="course.id" 
                    :value="course.id"
                  >
                    {{ course.display_name }}
                  </option>
                </select>
              </div>
              <div v-if="coursesLoading" class="loading-text">
                Loading courses...
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                </span>
                <input 
                  v-model="form.password"
                  type="password" 
                  class="form-control"
                  placeholder="Enter your password (min 8 characters)"
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
                  <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      name: '',
      email: '',
      reg_number: '',
      course_id: '',
      password: '',
      password_confirmation: ''
    })
    
    const courses = ref([])
    const coursesLoading = ref(false)
    const loading = ref(false)
    const error = ref('')
    const successMessage = ref('')
    const debugInfo = ref('')

    const isFormValid = computed(() => {
      return form.value.name && 
             form.value.email && 
             form.value.reg_number && 
             form.value.course_id &&
             form.value.password && 
             form.value.password_confirmation &&
             form.value.password.length >= 8
    })

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
          debugInfo.value += `Validation errors: ${JSON.stringify(errors, null, 2)}\n`
        } else if (err.response?.data?.message) {
          error.value = err.response.data.message
          debugInfo.value += `Backend message: ${err.response.data.message}\n`
        } else {
          error.value = err.message || 'Registration failed. Please try again.'
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchCourses()
    })
    
    return {
      form,
      courses,
      coursesLoading,
      loading,
      error,
      successMessage,
      debugInfo,
      isFormValid,
      handleRegister,
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-none);
  position: relative;
  overflow: hidden;
  font-family: var(--font-family);
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -100px;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 20%;
}

.login-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  margin: 20px;
  z-index: 2;
  position: relative;
}

.brand-section {
  background: var(--gradient-primary);
  color: white;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-content {
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: 40px;
}

.logo-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: var(--border-radius-lg);
  backdrop-filter: blur(10px);
}

.logo h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin: 0;
}

.brand-text h2 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: 15px;
}

.brand-text p {
  font-size: var(--font-size-base);
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 40px;
}

.login-section {
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 8px;
}

.login-header p {
  color: var(--gray-color);
  font-size: var(--font-size-base);
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: var(--dark-color);
  font-weight: 500;
  font-size: var(--font-size-sm);
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: var(--gray-color);
  z-index: 2;
}

.form-control {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid var(--gray-light);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.form-control:disabled {
  background-color: var(--gray-light);
  cursor: not-allowed;
  opacity: 0.7;
}

.login-btn {
  width: 100%;
  padding: 16px;
  font-size: var(--font-size-base);
  font-weight: 600;
  border-radius: var(--border-radius-lg);
  transition: all 0.3s ease;
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
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-btn.loading {
  cursor: wait;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
  margin-top: 16px;
  margin-bottom: 16px;
}

.alert-error {
  background: var(--danger-soft);
  color: var(--danger-dark);
  border: 1px solid var(--danger-light);
}

.alert-success {
  background: var(--success-soft);
  color: var(--success-dark);
  border: 1px solid var(--success-light);
}

.debug-info {
  margin-top: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-xs);
  max-height: 200px;
  overflow-y: auto;
}

.debug-info summary {
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 8px;
}

.debug-info pre {
  white-space: pre-wrap;
  word-break: break-all;
  font-size: var(--font-size-xs);
}

.text-center {
  text-align: center;
}

.mt-3 {
  margin-top: var(--spacing-lg);
}

.text-sm {
  font-size: var(--font-size-sm);
}

.font-medium {
  font-weight: 500;
}

.text-primary-dark {
  color: var(--primary-dark);
  text-decoration: none;
}

.text-primary-dark:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-wrapper {
    grid-template-columns: 1fr;
    margin: 10px;
  }

  .brand-section {
    display: none;
  }

  .login-section {
    padding: 40px 20px;
  }

  .debug-info {
    font-size: var(--font-size-xxs);
  }
}

@media (max-width: 480px) {
  .login-header h2 {
    font-size: var(--font-size-xl);
  }
}

/* Add these new styles to your existing CSS */

.loading-text {
  font-size: 0.875rem;
  color: var(--gray-color);
  margin-top: 0.5rem;
  font-style: italic;
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 40px;
}

select.form-control:disabled {
  background-color: var(--gray-light);
  cursor: not-allowed;
  opacity: 0.7;
}
</style>