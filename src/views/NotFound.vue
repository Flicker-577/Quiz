<template>
  <div class="not-found-container">
    <!-- Background Animation -->
    <div class="background-animation">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>

    <div class="not-found-content">
      <!-- Animated 404 -->
      <div class="error-number">
        <span class="digit">4</span>
        <div class="zero">
          <div class="inner-circle"></div>
        </div>
        <span class="digit">4</span>
      </div>

      <!-- Main Message -->
      <div class="error-message">
        <h1>Page Not Found</h1>
        <p>Oops! The page you're looking for seems to have wandered off into the digital void.</p>
      </div>

      <!-- Animated Illustration -->
      <div class="illustration">
        <div class="astronaut">
          <div class="helmet">
            <div class="visor"></div>
          </div>
          <div class="body"></div>
          <div class="left-arm"></div>
          <div class="right-arm"></div>
          <div class="left-leg"></div>
          <div class="right-leg"></div>
        </div>
        <div class="floating-rocks">
          <div class="rock rock-1"></div>
          <div class="rock rock-2"></div>
          <div class="rock rock-3"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <AppButton 
          variant="primary" 
          size="large"
          @click="goHome"
          class="home-btn"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </template>
          Back to Home
        </AppButton>

        <AppButton 
          variant="outline" 
          size="large"
          @click="goBack"
          class="back-btn"
        >
          <template #icon>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </template>
          Go Back
        </AppButton>
      </div>

      <!-- Quick Links -->
      <div class="quick-links">
        <p>Or try one of these pages:</p>
        <div class="links">
          <router-link 
            v-if="userRole === 'admin'" 
            to="/admin/dashboard" 
            class="link-item"
          >
            <div class="link-icon admin">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L5 9.5V15.5L3 16V18L9 16.5V18H15V16.5L21 18V16L19 15.5V9.5L21 9Z"/>
              </svg>
            </div>
            <span>Admin Dashboard</span>
          </router-link>

          <router-link 
            v-if="userRole === 'lecturer'" 
            to="/lecturer/dashboard" 
            class="link-item"
          >
            <div class="link-icon lecturer">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span>Lecturer Dashboard</span>
          </router-link>

          <router-link 
            v-if="userRole === 'student'" 
            to="/student/dashboard" 
            class="link-item"
          >
            <div class="link-icon student">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M18 2h-8L4.02 8 4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 6h-2V4h2v4zm3 0h-2V4h2v4zm3 0h-2V4h2v4z"/>
              </svg>
            </div>
            <span>Student Dashboard</span>
          </router-link>

          <router-link to="/login" class="link-item">
            <div class="link-icon login">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span>Login Page</span>
          </router-link>
        </div>
      </div>

      <!-- Support Section -->
      <div class="support-section">
        <p>Need help? <a href="mailto:support@quizmaster.com" class="support-link">Contact Support</a></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import AppButton from '../components/reusable/AppButton.vue'

export default {
  name: 'NotFound',
  components: { AppButton },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userRole = ref(null)

    const goHome = () => {
      // Redirect to appropriate dashboard based on user role
      if (authStore.isAuthenticated) {
        switch (authStore.userRole) {
          case 'admin':
            router.push('/admin/dashboard')
            break
          case 'lecturer':
            router.push('/lecturer/dashboard')
            break
          case 'student':
            router.push('/student/dashboard')
            break
          default:
            router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }

    const goBack = () => {
      router.back()
    }

    onMounted(() => {
      userRole.value = authStore.userRole
    })

    return {
      userRole,
      goHome,
      goBack
    }
  }
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Background Animation */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  top: 20%;
  right: 20%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

/* Main Content */
.not-found-content {
  text-align: center;
  color: white;
  z-index: 2;
  position: relative;
  max-width: 600px;
  width: 100%;
}

/* Error Number */
.error-number {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  perspective: 1000px;
}

.digit {
  font-size: 8rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: bounce 2s ease-in-out infinite;
}

.digit:nth-child(1) {
  animation-delay: 0s;
}

.digit:nth-child(3) {
  animation-delay: 0.2s;
}

.zero {
  position: relative;
  width: 120px;
  height: 120px;
  border: 8px solid white;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: rotate 4s linear infinite;
}

.inner-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  opacity: 0.2;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Error Message */
.error-message {
  margin-bottom: 40px;
}

.error-message h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.error-message p {
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

/* Illustration */
.illustration {
  position: relative;
  height: 200px;
  margin: 40px 0;
}

.astronaut {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float-astronaut 3s ease-in-out infinite;
}

.helmet {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  position: relative;
  margin: 0 auto 10px;
}

.visor {
  position: absolute;
  top: 15px;
  left: 10px;
  width: 40px;
  height: 25px;
  background: #4fd1c7;
  border-radius: 10px;
}

.body {
  width: 50px;
  height: 60px;
  background: white;
  border-radius: 20px;
  margin: 0 auto;
}

.left-arm, .right-arm {
  position: absolute;
  width: 20px;
  height: 40px;
  background: white;
  border-radius: 10px;
  top: 70px;
}

.left-arm {
  left: -15px;
  transform: rotate(-30deg);
}

.right-arm {
  right: -15px;
  transform: rotate(30deg);
}

.left-leg, .right-leg {
  position: absolute;
  width: 20px;
  height: 40px;
  background: white;
  border-radius: 10px;
  top: 125px;
}

.left-leg {
  left: 5px;
  transform: rotate(10deg);
}

.right-leg {
  right: 5px;
  transform: rotate(-10deg);
}

.floating-rocks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.rock {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
}

.rock-1 {
  width: 30px;
  height: 30px;
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.rock-2 {
  width: 20px;
  height: 20px;
  top: 60%;
  right: 25%;
  animation-delay: 1s;
}

.rock-3 {
  width: 25px;
  height: 25px;
  bottom: 30%;
  left: 30%;
  animation-delay: 2s;
}

@keyframes float-astronaut {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    transform: translate(-50%, -55%) rotate(5deg);
  }
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.home-btn, .back-btn {
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.home-btn:hover, .back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Quick Links */
.quick-links {
  margin-bottom: 30px;
}

.quick-links p {
  font-size: 1.1rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.link-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.link-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link-icon.admin {
  background: rgba(79, 70, 229, 0.3);
  border: 1px solid rgba(79, 70, 229, 0.5);
}

.link-icon.lecturer {
  background: rgba(6, 182, 212, 0.3);
  border: 1px solid rgba(6, 182, 212, 0.5);
}

.link-icon.student {
  background: rgba(16, 185, 129, 0.3);
  border: 1px solid rgba(16, 185, 129, 0.5);
}

.link-icon.login {
  background: rgba(139, 92, 246, 0.3);
  border: 1px solid rgba(139, 92, 246, 0.5);
}

.link-item span {
  font-weight: 500;
}

/* Support Section */
.support-section {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 20px;
}

.support-section p {
  font-size: 1rem;
  opacity: 0.8;
}

.support-link {
  color: white;
  text-decoration: underline;
  font-weight: 500;
}

.support-link:hover {
  color: #e5e7eb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .error-number {
    gap: 10px;
  }

  .digit {
    font-size: 5rem;
  }

  .zero {
    width: 80px;
    height: 80px;
    border-width: 6px;
  }

  .inner-circle {
    width: 40px;
    height: 40px;
  }

  .error-message h1 {
    font-size: 2rem;
  }

  .error-message p {
    font-size: 1.1rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .home-btn, .back-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .links {
    grid-template-columns: 1fr;
  }

  .illustration {
    height: 150px;
    margin: 30px 0;
  }

  .helmet {
    width: 40px;
    height: 40px;
  }

  .visor {
    width: 25px;
    height: 15px;
    top: 10px;
    left: 7px;
  }

  .body {
    width: 35px;
    height: 45px;
  }

  .left-arm, .right-arm {
    width: 15px;
    height: 30px;
    top: 55px;
  }

  .left-leg, .right-leg {
    width: 15px;
    height: 30px;
    top: 95px;
  }
}

@media (max-width: 480px) {
  .digit {
    font-size: 4rem;
  }

  .zero {
    width: 60px;
    height: 60px;
    border-width: 4px;
  }

  .inner-circle {
    width: 30px;
    height: 30px;
  }

  .error-message h1 {
    font-size: 1.75rem;
  }

  .error-message p {
    font-size: 1rem;
  }
}
</style>