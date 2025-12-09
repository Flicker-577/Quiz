<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': collapsed, 'mobile-open': mobileOpen }">

    <!-- SIDEBAR HEADER -->
    <div class="sidebar-header">

      <!-- Show logo ONLY when NOT collapsed -->
      <div v-if="!collapsed" class="logo">
        <h3>QuizMaster</h3>
        <span class="role">Lecturer</span>
      </div>

      <!-- Toggle button -->
      <button v-if="!mobileOpen" class="toggle-btn" @click="$emit('toggle')">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor"
            d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button>

      <!-- Close button for mobile -->
      <button v-if="mobileOpen" class="close-btn" @click="$emit('close')">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor"
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

    </div>

    <!-- NAV LINKS -->
    <nav class="sidebar-nav">

      <router-link to="/lecturer/dashboard" class="nav-item" data-tooltip="Dashboard" @click="handleNavClick">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
        <span class="nav-text">Dashboard</span>
      </router-link>

      <router-link to="/lecturer/modules" class="nav-item" data-tooltip="Manage Quizzes" @click="handleNavClick">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" 
            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
        <span class="nav-text">My Module</span>
      </router-link>

      <router-link to="/lecturer/quizzes" class="nav-item" data-tooltip="Manage Quizzes" @click="handleNavClick">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor"
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
        </svg>
        <span class="nav-text">Manage Quizzes</span>
      </router-link>

      <router-link to="/lecturer/results" class="nav-item" data-tooltip="View Results" @click="handleNavClick">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor"
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
        </svg>
        <span class="nav-text">View Results</span>
      </router-link>

      <!-- Analytics Link
      <router-link to="/lecturer/analytics" class="nav-item" data-tooltip="Analytics" @click="handleNavClick">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor"
            d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" />
        </svg>
        <span class="nav-text">Analytics</span>
      </router-link>
      -->

      <router-link to="/lecturer/settings" class="nav-item" @click="handleNavClick" data-tooltip="Settings">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22L2.74 8.87a.49.49 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
        <span class="nav-text">Settings</span>
      </router-link>
    </nav>

    <!-- FOOTER -->
    <div class="sidebar-footer">
      <button class="logout-btn" @click="$emit('logout')" :data-tooltip="collapsed ? 'Logout' : null">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor"
            d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
        <span v-if="!collapsed" class="logout-text">Logout</span>
      </button>
    </div>

  </aside>
</template>

<script>
export default {
  name: 'LecturerSidebar',
  props: {
    collapsed: Boolean,
    mobileOpen: Boolean,
    user: Object
  },
  emits: ['toggle', 'close', 'logout'],
  methods: {
    handleNavClick() {
      if (this.mobileOpen) {
        this.$emit('close')
      }
    },
    getUserInitials() {
      if (!this.user?.name) return 'L'
      return this.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: white;
  border-right: 1px solid var(--gray-light);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: width 0.3s ease;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  position: relative;
  overflow: hidden;
}

.logo {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  flex: 1;
}

.logo-hidden {
  opacity: 0;
  visibility: hidden;
  width: 0;
  flex: 0;
}

.logo h3 {
  margin: 0;
  color: var(--primary-color);
  font-size: 1.25rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.role {
  font-size: 0.75rem;
  color: var(--gray-color);
  display: block;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.toggle-btn, .close-btn {
  background: none;
  border: none;
  color: var(--gray-color);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-left: auto;
}

.toggle-btn:hover, .close-btn:hover {
  background: var(--gray-light);
  color: var(--dark-color);
}

.toggle-btn svg, .close-btn svg {
  width: 22px;
  height: 22px;
}

/* When sidebar is collapsed, center the toggle button */
.sidebar-collapsed .sidebar-header {
  justify-content: center;
  padding: 20px 12px;
}

.sidebar-collapsed .toggle-btn {
  margin-left: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  color: var(--gray-dark);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  position: relative;
}

.nav-item:hover {
  background: var(--primary-soft);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
}

.nav-item.router-link-active {
  background: var(--primary-soft);
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  font-weight: 600;
}

.nav-item svg {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

/* Make icons even larger when sidebar is expanded */
.sidebar:not(.sidebar-collapsed) .nav-item svg {
  width: 26px;
  height: 26px;
}

.nav-text {
  white-space: nowrap;
  transition: opacity 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
}

.sidebar-collapsed .nav-text {
  opacity: 0;
  width: 0;
}

/* Make icons more prominent on hover and active states */
.nav-item:hover svg,
.nav-item.router-link-active svg {
  transform: scale(1.1);
}

/* Tooltip for collapsed state */
.nav-item::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: var(--dark-color);
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1001;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-weight: 500;
}

.sidebar-collapsed .nav-item:hover::after {
  opacity: 1;
  visibility: visible;
  left: calc(100% + 10px);
}

/* Tooltip for logout button */
.logout-btn::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: var(--dark-color);
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1001;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-weight: 500;
}

.sidebar-collapsed .logout-btn:hover::after {
  opacity: 1;
  visibility: visible;
  left: calc(100% + 10px);
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--gray-light);
  position: relative;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--danger-soft);
  color: var(--danger-color);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  justify-content: center;
  position: relative;
}

.logout-btn:hover {
  background: var(--danger-color);
  color: white;
}

.logout-btn svg {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.logout-text {
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.sidebar-collapsed .logout-text {
  opacity: 0;
  width: 0;
}

/* Mobile styles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 280px;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-collapsed {
    width: 280px;
  }

  /* Disable tooltips on mobile */
  .nav-item::after,
  .logout-btn::after {
    display: none;
  }

  /* Show logo on mobile even when collapsed */
  .sidebar.mobile-open .logo-hidden {
    opacity: 1;
    visibility: visible;
    width: auto;
    flex: 1;
  }

  .sidebar.mobile-open .sidebar-header {
    justify-content: space-between;
    padding: 20px;
  }

  .sidebar.mobile-open .toggle-btn {
    margin-left: auto;
  }

  /* Mobile specific icon sizing */
  .sidebar.mobile-open .nav-item svg {
    width: 28px;
    height: 28px;
  }
  
  .sidebar.mobile-open .nav-item {
    padding: 18px 20px;
    gap: 18px;
  }
  
  .sidebar.mobile-open .nav-text {
    font-size: 1.1rem;
  }
  
  /* Make header icons larger on mobile */
  .sidebar.mobile-open .sidebar-header svg {
    width: 24px;
    height: 24px;
  }
  
  /* Make logout icon larger on mobile */
  .sidebar.mobile-open .logout-btn svg {
    width: 22px;
    height: 22px;
  }
}

/* Enhanced hover effects for better interactivity */
.nav-item:hover svg {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.logout-btn:hover svg {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Active state enhancement */
.nav-item.router-link-active svg {
  filter: brightness(0.9);
  transform: scale(1.05);
}
</style>