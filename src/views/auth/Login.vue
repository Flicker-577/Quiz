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
          <div class="features">
            <div class="feature">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>AI-Generated Quizzes</span>
            </div>
            <div class="feature">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Automated Marking</span>
            </div>
            <div class="feature">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-section">
        <div class="login-card">
          <div class="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
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
              <label class="form-label">Password</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </span>
                <input 
                  v-model="form.password"
                  type="password" 
                  class="form-control"
                  placeholder="Enter your password"
                  required
                  :disabled="loading"
                >
              </div>
            </div>

            <!-- Remember Me Checkbox -->
            <div class="form-options">
              <label class="checkbox-label">
                <input 
                  v-model="form.remember"
                  type="checkbox"
                  :disabled="loading"
                >
                <span class="checkmark"></span>
                Remember me
              </label>
            </div>

            <button 
              type="submit"
              class="login-btn"
              :disabled="loading || !form.email || !form.password"
              :class="{ 'loading': loading }"
            >
              <span v-if="!loading" class="btn-text">Sign In</span>
              <span v-else class="btn-loading">
                <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                </svg>
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
              Don't have an account? 
              <router-link to="/register" class="font-medium text-primary-dark">
                Sign up
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      email: '',
      password: '',
      remember: false
    })
    
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      
      try {
        console.log('🔐 Login with remember:', form.value.remember)
        
        // Call the login action from your store
        await authStore.login(form.value)
        
        console.log('✅ Login successful, user:', authStore.user)
        
        // Check if user data is properly loaded
        if (!authStore.user) {
          throw new Error('User data not loaded after login')
        }

        // Get user role from store
        const userRole = authStore.user.role
        
        console.log('👤 User role:', userRole)
        
        // Define redirect paths based on role
        const redirectPaths = {
          admin: '/admin/dashboard',
          lecturer: '/lecturer/dashboard',
          hod: '/hod/dashboard',
          student: '/student/dashboard'
        }
        
        const redirectPath = redirectPaths[userRole]
        
        if (redirectPath) {
          console.log('🔄 Redirecting to:', redirectPath)
          // Let the global loader handle the page transition
          await router.replace(redirectPath)
        } else {
          error.value = `No dashboard available for role: ${userRole}`
          console.error('Unknown user role:', userRole)
          await authStore.logout()
        }
        
      } catch (err) {
        console.error('❌ Login error:', err)
        error.value = authStore.error || 'Login failed. Please try again.'
      } finally {
        loading.value = false
      }
    }
    
    return {
      form,
      loading,
      error,
      handleLogin,
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

.features {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--font-size-base);
}

.feature svg {
  color: var(--success-color);
}

.login-section {
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin-bottom: 24px;
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
}

.alert-error {
  background: var(--danger-soft);
  color: var(--danger-dark);
  border: 1px solid var(--danger-light);
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

.form-options {
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--dark-color);
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--gray-light);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  background: white;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label input[type="checkbox"]:disabled + .checkmark {
  background-color: var(--gray-light);
  border-color: var(--gray-light);
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .login-wrapper {
    grid-template-columns: 1fr;
    margin: 10px;
  }

  .brand-section {
    padding: 40px 20px;
    display: none;
  }

  .login-section {
    padding: 40px 20px;
  }

  .logo {
    flex-direction: column;
    text-align: center;
  }

  .logo h1 {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .login-header h2 {
    font-size: var(--font-size-xl);
  }
}
</style>