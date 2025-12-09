<template>
  <div class="student-page">
    <div class="page-header">
      <div v-if="loading">
        <AppSkeleton type="text" width="250px" height="32px" class="mb-2" />
        <AppSkeleton type="text" width="180px" height="20px" />
      </div>
      <div v-else>
        <h1 class="page-title">Student Dashboard</h1>
        <div class="title-decoration"></div><br>
        <p class="page-subtitle">Welcome back, {{ student.firstName }}!</p>
      </div>
    </div>

    <div v-if="loading" class="stats-row">
      <div v-for="i in 3" :key="i" class="stat-card skeleton-card">
        <AppSkeleton type="circle" width="48px" height="48px" />
        <div class="stat-info-skeleton">
          <AppSkeleton type="text" width="80px" height="14px" class="mb-1" />
          <AppSkeleton type="text" width="40px" height="28px" />
        </div>
      </div>
    </div>

    <div v-else class="stats-row">
      <div class="stat-card">
        <div class="stat-icon primary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        </div>
        <div class="stat-info">
          <span class="label">Enrolled Modules</span>
          <span class="value">{{ stats.enrolled_modules }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
        </div>
        <div class="stat-info">
          <span class="label">Available Quizzes</span>
          <span class="value">{{ stats.available_quizzes }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="label">Completed Quizzes</span>
          <span class="value">{{ stats.completed_quizzes }}</span>
        </div>
      </div>
    </div>

    <h2 class="section-title">Quick Actions</h2>
    
    <div v-if="loading" class="grid-3">
      <div v-for="i in 3" :key="i" class="action-card skeleton-card">
        <AppSkeleton type="circle" width="48px" height="48px" class="mb-2" />
        <AppSkeleton type="text" width="120px" height="20px" class="mb-2" />
        <AppSkeleton type="text" width="100%" height="16px" class="mb-3" />
        <AppSkeleton type="text" width="100px" height="36px" />
      </div>
    </div>

    <div v-else class="grid-3">
      <div class="action-card">
        <div class="action-icon primary">
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
        </div>
        <h3>My Modules</h3>
        <p>Access lecture notes and module content.</p>
        <AppButton variant="outline" @click="$router.push('/student/modules')">View Modules</AppButton>
      </div>
      
      <div class="action-card">
        <div class="action-icon warning">
           <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <h3>Take Quiz</h3>
        <p>Complete pending assignments and tests.</p>
        <AppButton variant="outline" @click="$router.push('/student/quizzes')">Go to Quizzes</AppButton>
      </div>
      
      <div class="action-card">
        <div class="action-icon secondary">
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </div>
        <h3>Settings</h3>
        <p>Manage your profile and account security.</p>
        <AppButton variant="outline" @click="$router.push('/student/settings')">Open Settings</AppButton>
      </div>
    </div>

    <div class="content-card full-width-widget mt-4">
      <h3 class="card-title">Recent Activity</h3>
      <p class="card-subtitle">Latest updates from your courses and quizzes.</p>
      
      <div v-if="loading" class="activity-skeleton-list">
        <div v-for="i in 3" :key="i" class="activity-item-skeleton">
          <AppSkeleton type="circle" width="40px" height="40px" />
          <div class="flex-1">
            <AppSkeleton type="text" width="60%" height="16px" class="mb-1" />
            <AppSkeleton type="text" width="20%" height="12px" />
          </div>
        </div>
      </div>
      
      <ul v-else-if="recentActivity.length > 0" class="activity-list">
        <li v-for="item in recentActivity" :key="item.id" class="activity-item">
          <div class="activity-icon" :class="item.type">
            <svg v-if="item.type === 'quiz_graded'" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <svg v-else-if="item.type === 'announcement'" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <svg v-else viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <div class="activity-text">
            <span v-html="item.text"></span>
            <span class="activity-time">{{ item.time }}</span>
          </div>
        </li>
      </ul>
      <div v-else class="empty-state">No recent activity found.</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/api' 
import AppButton from '../../components/reusable/AppButton.vue'
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'

export default {
  name: 'StudentDashboard',
  components: { AppButton, AppSkeleton },
  setup() {
    const router = useRouter()
    
    // Data State
    const student = ref({ firstName: '', name: '' })
    const stats = ref({ enrolled_modules: 0, available_quizzes: 0, completed_quizzes: 0 })
    const recentActivity = ref([])
    const loading = ref(true)

    // Fetch Method
    const fetchDashboardData = async () => {
      loading.value = true
      try {
        const response = await api.get('/student/dashboard')
        student.value = response.data.user
        stats.value = response.data.stats || { enrolled_modules: 0, available_quizzes: 0, completed_quizzes: 0 }
        recentActivity.value = response.data.recentActivity
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        // Minimal delay to prevent flicker if API is too fast
        setTimeout(() => loading.value = false, 300)
      }
    }

    onMounted(() => {
      fetchDashboardData()
    })

    return {
      student,
      stats,
      recentActivity,
      loading
    }
  }
}
</script>

<style scoped>
.student-page { max-width: 1200px; margin: 0 auto; padding: var(--spacing-md); }
.page-header { margin-bottom: var(--spacing-lg); }
.page-title { font-size: 2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); }
.mb-1 { margin-bottom: 4px; } .mb-2 { margin-bottom: 8px; } .mb-3 { margin-bottom: 12px; }

/* Grid Layouts - Used for Real & Skeleton */
.stats-row {
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-md); 
  margin-bottom: var(--spacing-lg);
}
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-md); }

/* Cards */
.stat-card, .action-card {
  background: white; 
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg); 
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-light); 
}
.stat-card { display: flex; align-items: center; gap: 16px; transition: transform 0.2s; }
.stat-card:not(.skeleton-card):hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.action-card { display: flex; flex-direction: column; gap: var(--spacing-xs); transition: all 0.2s ease; }
.action-card:not(.skeleton-card):hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }

/* Icons & Text */
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.success { background: var(--success-soft); color: var(--success-color); }
.stat-icon.warning { background: var(--warning-soft); color: var(--warning-color); }

.stat-info { display: flex; flex-direction: column; }
.stat-info .label { font-size: 0.8rem; color: var(--gray-color); text-transform: uppercase; font-weight: 600; }
.stat-info .value { font-size: 1.75rem; font-weight: 700; color: var(--dark-color); margin-top: 4px; }

.action-card h3 { font-size: 1.1rem; font-weight: 600; color: var(--dark-color); margin-top: var(--spacing-sm); }
.action-card p { font-size: 0.9rem; color: var(--gray-color); flex-grow: 1; margin-bottom: var(--spacing-md); }
.action-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--light-color); color: var(--gray-dark); }
.action-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.action-icon.warning { background: var(--warning-soft); color: var(--warning-color); }
.action-icon.secondary { background: var(--secondary-soft); color: var(--secondary-color); }

/* Activity & Widget */
.section-title { font-size: 1.25rem; font-weight: 600; color: var(--dark-color); margin: var(--spacing-md) 0; }
.mt-4 { margin-top: var(--spacing-lg); }
.content-card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); }
.card-title { font-size: 1.1rem; font-weight: 600; color: var(--dark-color); }
.card-subtitle { font-size: 0.9rem; color: var(--gray-color); margin-bottom: var(--spacing-md); }

.activity-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; }
.activity-item { display: flex; align-items: flex-start; gap: var(--spacing-md); padding: var(--spacing-md) 0; border-bottom: 1px solid var(--gray-light); }
.activity-item:last-child { border-bottom: none; }
.activity-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.activity-icon.quiz_graded { background: var(--success-soft); color: var(--success-color); }
.activity-icon.announcement { background: var(--secondary-soft); color: var(--secondary-color); }
.activity-text { font-size: 0.9rem; color: var(--dark-color); line-height: 1.5; }
.activity-time { display: block; font-size: 0.8rem; color: var(--gray-color); margin-top: 2px; }

/* Skeleton Specifics */
.activity-skeleton-list { display: flex; flex-direction: column; gap: 16px; }
.activity-item-skeleton { display: flex; gap: 16px; align-items: center; padding: 8px 0; }
.flex-1 { flex: 1; }
.empty-state { text-align: center; color: var(--gray-color); padding: 20px; }

@media (max-width: 768px) { .grid-3 { grid-template-columns: 1fr; } }
</style>