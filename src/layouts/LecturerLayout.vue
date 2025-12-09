<template>
  <div class="lecturer-layout">
    <!-- Mobile Overlay -->
    <div 
      v-if="isMobile && sidebarOpen" 
      class="mobile-overlay"
      @click="closeSidebar"
    ></div>
    
    <LecturerSidebar 
      :collapsed="sidebarCollapsed" 
      :mobile-open="sidebarOpen"
      :user="user"
      @toggle="toggleSidebar"
      @close="closeSidebar"
      @logout="logout"
    />
    
    <div class="main-content" :class="{ 
      'sidebar-collapsed': sidebarCollapsed && !isMobile,
      'mobile-open': sidebarOpen && isMobile
    }">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <div class="header-left">
            <button 
              v-if="isMobile"
              class="menu-btn"
              @click="toggleSidebar"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            <h1 class="page-title">{{ currentPageTitle }}</h1>
          </div>
          <div class="header-right">
            <div class="user-welcome">
              Welcome, <strong>{{ user?.name }}</strong>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="page-content">
        <router-view />
      </div>

      <!-- Footer -->
      <footer class="footer">
          <p>&copy; {{ currentYear }} QuizMaster Pro. Lecturer Portal</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import LecturerSidebar from '../components/sidebar/LecturerSidebar.vue'
import { useAuthStore } from '../stores/authStore'

export default {
  name: 'LecturerLayout',
  components: { LecturerSidebar },
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    
    const sidebarCollapsed = ref(false)
    const sidebarOpen = ref(false)
    const isMobile = ref(false)

    const currentPageTitle = computed(() => {
      const routeName = route.name
      const titles = {
        'LecturerDashboard': 'Dashboard',
        'LecturerModules': 'My Modules',
        'UploadNotes': 'Upload Notes',
        'QuizManagement': 'Manage Quizzes',
        'LecturerResults': 'View Results',
        'LecturerAnalytics': 'Analytics'
      }
      return titles[routeName] || 'QuizMaster Pro'
    })

    const logout = () => {
      authStore.logout()
      window.location.href = '/login'
    }

    const currentYear = new Date().getFullYear()

    const toggleSidebar = () => {
      if (isMobile.value) {
        sidebarOpen.value = !sidebarOpen.value
      } else {
        sidebarCollapsed.value = !sidebarCollapsed.value
      }
    }

    const closeSidebar = () => {
      sidebarOpen.value = false
    }

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
      if (isMobile.value) {
        sidebarOpen.value = false
      }
    }

    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      user: authStore.user,
      sidebarCollapsed,
      sidebarOpen,
      isMobile,
      currentPageTitle,
      currentYear,
      logout,
      toggleSidebar,
      closeSidebar
    }
  }
}
</script>

<style scoped>
.lecturer-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content.sidebar-collapsed {
  margin-left: 70px;
}

/* Mobile styles */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    width: 100%;
  }

  .main-content.mobile-open {
    transform: translateX(280px);
  }
}

/* Header */
.header {
  background: white;
  border-bottom: 1px solid var(--gray-light);
  padding: 0 24px;
  height: 70px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--dark-color);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.menu-btn:hover {
  background: var(--gray-light);
}

.menu-btn svg {
  width: 26px;
  height: 26px;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--dark-color);
}

.user-welcome {
  color: var(--gray-dark);
  font-size: 0.95rem;
}

/* Page Content */
.page-content {
  flex: 1;
  padding: 24px;
  background: #f8fafc;
}

/* Footer */
.footer {
  background: white;
  border-top: 1px solid var(--gray-light);
  padding: 20px 24px;
  text-align: center;
}

.footer p {
  margin: 0;
  color: var(--gray-color);
  font-size: 0.875rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .menu-btn {
    display: flex;
  }

  .header {
    padding: 0 16px;
    height: 60px;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .page-content {
    padding: 16px;
  }

  .footer {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .user-welcome {
    font-size: 0.875rem;
  }
  
  .page-title {
    font-size: 1.1rem;
  }
}

.page-title {
  display: none;
}
</style>