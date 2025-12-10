<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-section">
        <div class="login-card">
          <div class="login-header">
            <img src="/logo-no.jpg" alt="logo" class="logo-img">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20">
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
                  <svg viewBox="0 0 24 24" width="20" height="20">
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
        await authStore.login(form.value)
        
        if (!authStore.user) {
          throw new Error('User data not loaded after login')
        }

        const userRole = authStore.user.role
        
        const redirectPaths = {
          admin: '/admin/dashboard',
          lecturer: '/lecturer/dashboard',
          hod: '/hod/dashboard',
          student: '/student/dashboard'
        }
        
        const redirectPath = redirectPaths[userRole]
        
        if (redirectPath) {
          await router.replace(redirectPath)
        } else {
          error.value = `No dashboard available for role: ${userRole}`
          await authStore.logout()
        }
        
      } catch (err) {
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-none); 
  position: relative;
  min-height: 100vh; /* Ensures full height centering */
  font-family: var(--font-family);
  padding: 20px;
}

.login-wrapper {
  max-width: 440px; /* Slightly wider for better breathing room */
  width: 100%;
  background: white;
  border-radius: var(--border-radius-xl);
  /* Modern, softer shadow */
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  overflow: hidden;
  margin: 20px;
}

.logo-img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  /* Using a box shadow instead of double border looks cleaner */
  box-shadow: 0 0 0 4px var(--primary-soft);
  object-fit: cover;
  margin-bottom: 10px;
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
  margin-bottom: 35px;
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
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: var(--dark-color);
  font-weight: 600;
  font-size: 0.9rem;
  margin-left: 2px;
}

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

/* Magic: Highlight icon when input is focused */
.input-group:focus-within .input-icon {
  color: var(--primary-color);
}

.form-control {
  width: 100%;
  padding: 14px 16px 14px 48px; /* Balanced padding */
  border: 1.5px solid #e2e8f0; /* Subtle border */
  border-radius: var(--border-radius-lg);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: #fff;
  color: var(--dark-color);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px var(--primary-soft); /* Soft ring effect */
}

.form-control::placeholder {
  color: #cbd5e1;
}

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
  min-height: 50px;
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

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: var(--border-radius-md);
  font-size: 0.9rem;
  margin-top: 20px;
}

.alert-error {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.text-center { text-align: center; }
.mt-3 { margin-top: 20px; }
.text-sm { font-size: 0.9rem; color: var(--gray-color); }
.font-medium { font-weight: 600; }
.text-primary-dark { color: var(--primary-dark); text-decoration: none; transition: color 0.2s; }
.text-primary-dark:hover { color: var(--primary-color); text-decoration: underline; }

.form-options {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--gray-color);
  user-select: none;
  transition: color 0.2s;
}

.checkbox-label:hover {
  color: var(--dark-color);
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
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
  top: 1px;
  width: 4px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

@media (max-width: 480px) {
  .login-section { padding: 30px 20px; }
  .login-wrapper { margin: 10px; box-shadow: none; border: 1px solid #f1f5f9; }
  .login-container { background: white; align-items: flex-start; }
}
</style>