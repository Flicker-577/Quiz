import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore' // FIXED PATH

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { requiresAuth: false }
  },
  
  // Admin Routes
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'departments',
        name: 'AdminDepartments',
        component: () => import('../views/admin/Departments.vue')
      },
      {
        path: 'hod',
        name: 'CreateHod',
        component: () => import('../views/admin/CreateHod.vue')
      },
      {
        path: 'system-settings',
        name: 'SystemSettings',
        component: () => import('../views/admin/AcademicYearManager.vue')
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('../views/admin/Settings.vue')
      }
    ]
  },
  // H.O.D Routes
  {
    path: '/hod',
    component: () => import('../layouts/HodLayout.vue'),
    meta: { requiresAuth: true, role: 'hod' },
    children: [
      {
        path: 'dashboard',
        name: 'hodDashboard',
        component: () => import('../views/H.O.D/Dashboard.vue')
      },
      {
        path: 'courses',
        name: 'hodCourses',
        component: () => import('../views/H.O.D/Courses.vue')
      },
      {
        path: 'modules',
        name: 'hodModules',
        component: () => import('../views/H.O.D/Modules.vue')
      },
      {
        path: 'lecturers',
        name: 'hodLecturers',
        component: () => import('../views/H.O.D/Lecturers.vue')
      },
      {
        path: 'students',
        name: 'hodStudents',
        component: () => import('../views/H.O.D/Students.vue')
      },
      {
        path: 'settings',
        name: 'hodSettings',
        component: () => import('../views/H.O.D/Settings.vue')
      }
    ]
  },
  // Lecturer Routes
  {
    path: '/lecturer',
    component: () => import('../layouts/LecturerLayout.vue'),
    meta: { requiresAuth: true, role: 'lecturer' },
    children: [
      {
        path: 'dashboard',
        name: 'LecturerDashboard',
        component: () => import('../views/lecturer/Dashboard.vue')
      },
      {
        path: 'modules',
        name: 'LecturerModules',
        component: () => import('../views/lecturer/Modules.vue')
      },
      {
        path: 'quizzes',
        name: 'QuizManagement',
        component: () => import('../views/lecturer/QuizManagement.vue')
      },
      {
        path: 'analytics',
        name: 'LecturerAnalytics',
        component: () => import('../views/lecturer/Analytics.vue')
      },
      {
        path: 'results',
        name: 'LecturerResults',
        component: () => import('../views/lecturer/Results.vue')
      },
      {
        path: 'settings',
        name: 'LecturerSettings',
        component: () => import('../views/lecturer/Settings.vue')
      }
    ]
  },
  // Student Routes
  {
    path: '/student',
    component: () => import('../layouts/StudentLayout.vue'),
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: 'dashboard',
        name: 'StudentDashboard',
        component: () => import('../views/student/Dashboard.vue')
      },
      {
        path: 'modules',
        name: 'StudentModules',
        component: () => import('../views/student/Modules.vue')
      },
      /*
      {
        path: 'results',
        name: 'StudentResults',
        component: () => import('../views/student/Results.vue')
      },*/
      {
        path: 'settings',
        name: 'StudentSettings',
        component: () => import('../views/student/Settings.vue')
      },
      {
        path: 'assignments',
        name: 'StudentAssignments',
        component: () => import('../views/student/Assignments.vue')
      }
    ]
  },
  // Redirect root to login
  {
    path: '/',
    redirect: '/login'
  },
  // Catch all 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// DEBUG VERSION - Add console logs to see what's happening
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  console.log('🔄 Route Navigation:', {
    from: from.path,
    to: to.path,
    requiresAuth: to.meta.requiresAuth,
    requiredRole: to.meta.role
  })

  // Initialize auth store if not already done
  if (!authStore.initialized) {
    console.log('🔄 Initializing auth store...')
    try {
      await authStore.initialize()
      console.log('✅ Auth store initialized')
    } catch (error) {
      console.log('❌ Auth initialization failed:', error)
    }
  }

  console.log('👤 User State:', {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    userRole: authStore.userRole,
    initialized: authStore.initialized
  })

  // Public routes - allow access
  if (!to.meta.requiresAuth) {
    console.log('✅ Public route - allowing access')
    return next()
  }

  // Protected routes - check authentication
  if (!authStore.isAuthenticated) {
    console.log('❌ Not authenticated - redirecting to login')
    return next('/login')
  }

  // Check role access if route requires specific role
  const requiredRole = to.meta.role
  if (requiredRole) {
    const userRole = authStore.userRole
    
    console.log(`🔐 Role Check: User has "${userRole}", Route requires "${requiredRole}"`)
    
    // If user doesn't have the required role, redirect to their dashboard
    if (userRole !== requiredRole) {
      console.log(`❌ Role mismatch - redirecting to user's dashboard`)
      const dashboardPaths = {
        admin: '/admin/dashboard',
        lecturer: '/lecturer/dashboard',
        hod: '/hod/dashboard',
        student: '/student/dashboard'
      }
      
      const redirectPath = dashboardPaths[userRole] || '/login'
      console.log(`🔄 Redirecting to: ${redirectPath}`)
      return next(redirectPath)
    }
    
    console.log('✅ Role access granted')
  }

  console.log('✅ Access granted to:', to.path)
  next()
})

export default router