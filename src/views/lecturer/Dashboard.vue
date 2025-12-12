<template>
  <div class="lecturer-dashboard">
    <div class="page-header">
      <div>
        <h1 class="page-title">Lecturer Dashboard</h1>
        <div class="title-decoration"></div><br>
        <p class="page-subtitle">Overview of your modules, students, and assessment activities.</p>
      </div>
      <div class="header-actions">
        <AppButton variant="outline" @click="fetchDashboardData" :disabled="loading">
          <span v-if="loading" class="btn-loading-content">
             <AppSpinner size="sm" color="dark" /> Refreshing...
          </span>
          <span v-else>Refresh</span>
        </AppButton>
      </div>
    </div>

    <div v-if="loading" class="stats-row">
      <div v-for="n in 4" :key="n" class="skeleton-stat-card">
         <AppSkeleton type="card" height="100%" borderRadius="12px" />
      </div>
    </div>

    <div v-else class="stats-row">
      <div class="stat-card">
        <div class="stat-icon success">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="label">Active Quizzes</span>
          <span class="value">{{ stats.active_quizzes }}</span>
          <span class="sub-text">Published</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </div>
        <div class="stat-info">
          <span class="label">Draft Quizzes</span>
          <span class="value">{{ stats.draft_quizzes }}</span>
          <span class="sub-text">Unpublished</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon primary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="stat-info">
          <span class="label">Performed</span>
          <span class="value">{{ stats.total_attempts }}</span>
          <span class="sub-text">Student Attempts</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon secondary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="label">Modules</span>
          <span class="value">{{ stats.total_modules }}</span>
          <span class="sub-text">Assigned</span>
        </div>
      </div>
    </div>

    <h2 class="section-title">Quick Actions</h2>
    
    <div v-if="loading" class="actions-grid">
       <div v-for="n in 2" :key="n" class="skeleton-action-card">
          <AppSkeleton width="100%" height="120px" borderRadius="12px" />
       </div>
    </div>

    <div v-else class="actions-grid">
      <div class="action-card" @click="$router.push('/lecturer/quizzes')">
        <div class="action-icon primary">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        <div class="action-content">
          <h3>Module Quizzes</h3>
          <p>Create new quizzes, edit drafts, or publish assessments.</p>
        </div>
        <div class="action-arrow">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>

      <div class="action-card" @click="$router.push('/lecturer/results')">
        <div class="action-icon success">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="action-content">
          <h3>Student Results</h3>
          <p>View grades, analyze performance, and download reports.</p>
        </div>
        <div class="action-arrow">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="widget-column">
        <div class="content-card">
          <div class="card-header-row">
            <h3 class="card-title">Recent Quizzes</h3>
            <router-link to="/lecturer/quizzes" class="see-more-link">View All</router-link>
          </div>
          
          <div v-if="loading" class="skeleton-list">
             <AppSkeleton v-for="n in 3" :key="n" width="100%" height="60px" class="mb-2" borderRadius="8px" />
          </div>

          <ul v-else class="action-list">
            <li v-for="quiz in recentQuizzes" :key="quiz.id" class="action-item">
              <div>
                <span class="item-title">{{ quiz.title }}</span>
                <span class="item-sub">{{ quiz.module_name }}</span>
              </div>
              <div class="meta-right">
                <span class="status-badge" :class="quiz.status">{{ quiz.status }}</span>
                <span class="date-text">{{ formatDate(quiz.created_at) }}</span>
              </div>
            </li>
            <li v-if="recentQuizzes.length === 0" class="empty-state">
              No quizzes created recently.
            </li>
          </ul>
        </div>
      </div>
      
      <div class="widget-column">
        <div class="content-card">
          <div class="card-header-row">
             <div>
                <h3 class="card-title">Student Distribution</h3>
                <p class="card-subtitle mb-0">Enrollment by Year of Study</p>
             </div>
          </div>
          
          <div v-if="loading" class="skeleton-list mt-3">
             <AppSkeleton v-for="n in 3" :key="n" width="100%" height="50px" class="mb-2" borderRadius="8px" />
          </div>

          <ul v-else class="activity-list mt-2">
             <li v-for="(count, year) in moduleDistribution" :key="year" class="distribution-item">
                <div class="dist-label">
                  <span class="year-badge">{{ formatYear(year) }}</span>
                  <span class="dist-text">Year {{ formatYear(year) }} Students</span>
                </div>
                <span class="dist-count">{{ count }}</span>
             </li>
             <li v-if="Object.keys(moduleDistribution).length === 0" class="empty-state">
                No distribution data available.
             </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import AppButton from '../../components/reusable/AppButton.vue'
import AppSkeleton from '../../components/reusable/AppSkeleton.vue'
import AppSpinner from '../../components/reusable/AppSpinner.vue'
import api from '@/api/api' 

export default {
  name: 'LecturerDashboard',
  components: { AppButton, AppSkeleton, AppSpinner },
  setup() {
    const loading = ref(true)
    const stats = ref({
      total_modules: 0,
      total_students: 0,
      active_quizzes: 0,
      draft_quizzes: 0,
      total_attempts: 0
    })
    const recentQuizzes = ref([])
    const moduleDistribution = ref({})

    const fetchDashboardData = async () => {
      loading.value = true
      try {
        const response = await api.get('/lecturer/statistics-dashboard')
        if (response.data.success) {
          stats.value = response.data.statistics
          recentQuizzes.value = response.data.recent_quizzes
          moduleDistribution.value = response.data.module_distribution
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error)
      } finally {
        // Delay for smoother transition
        setTimeout(() => { loading.value = false }, 500)
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString()
    }

    const formatYear = (key) => {
      return key.replace('year_', '')
    }

    onMounted(() => {
      fetchDashboardData()
    })

    return {
      loading,
      stats,
      recentQuizzes,
      moduleDistribution,
      fetchDashboardData,
      formatDate,
      formatYear
    }
  }
}
</script>

<style scoped>
.lecturer-dashboard { max-width: 1400px; margin: 0 auto; padding: var(--spacing-md); }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-lg); }
.page-title { font-size: 2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); }

/* Stats Row */
.stats-row {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-md); margin-bottom: var(--spacing-xl);
}
.stat-card {
  background: white; padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-light); display: flex; align-items: center; gap: 16px;
}
.stat-icon {
  width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.secondary { background: var(--secondary-soft); color: var(--secondary-color); }
.stat-icon.success { background: var(--success-soft); color: var(--success-color); }
.stat-icon.warning { background: var(--warning-soft); color: var(--warning-color); }
.stat-info { display: flex; flex-direction: column; flex: 1; }
.stat-info .label { font-size: 0.8rem; color: var(--gray-color); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.stat-info .value { font-size: 1.75rem; font-weight: 700; color: var(--dark-color); line-height: 1.2; }
.sub-text { font-size: 0.8rem; color: var(--gray-color); margin-top: 2px; }

/* NEW SKELETON STYLES */
.skeleton-stat-card {
  height: 100px;
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}
.skeleton-action-card {
  height: 120px;
  overflow: hidden;
  border-radius: var(--border-radius-lg);
}
.btn-loading-content { display: flex; align-items: center; gap: 8px; }

/* Quick Actions */
.section-title { font-size: 1.25rem; font-weight: 600; color: var(--dark-color); margin-bottom: var(--spacing-md); }

.actions-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md); margin-bottom: var(--spacing-xl);
}
.action-card {
  background: white; border: 1px solid var(--gray-light); border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg); display: flex; align-items: center; gap: 16px;
  cursor: pointer; transition: all 0.2s ease; box-shadow: var(--shadow-sm);
}
.action-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--primary-light); }
.action-icon {
  width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.action-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.action-icon.success { background: var(--success-soft); color: var(--success-color); }
.action-content { flex: 1; }
.action-content h3 { font-size: 1.1rem; font-weight: 600; color: var(--dark-color); margin-bottom: 4px; }
.action-content p { font-size: 0.9rem; color: var(--gray-color); line-height: 1.4; margin: 0; }
.action-arrow { color: var(--gray-color); transition: transform 0.2s; }
.action-card:hover .action-arrow { transform: translateX(4px); color: var(--primary-color); }

/* Content Grid */
.grid-2 { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
  gap: var(--spacing-md); 
  margin-top: var(--spacing-lg); 
}
.widget-column { display: flex; flex-direction: column; gap: var(--spacing-md); }
.content-card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); height: 100%; }
.card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--gray-light); padding-bottom: 0.5rem; }
.card-title { font-size: 1.1rem; font-weight: 600; color: var(--dark-color); margin: 0; }
.see-more-link { font-size: 0.85rem; color: var(--primary-color); text-decoration: none; font-weight: 600; }
.card-subtitle { font-size: 0.9rem; color: var(--gray-color); margin-bottom: var(--spacing-md); }

/* Lists */
.action-list, .activity-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; }
.action-item, .distribution-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--gray-light); }
.action-item:last-child, .distribution-item:last-child { border-bottom: none; }
.item-title { font-weight: 600; color: var(--dark-color); display: block; }
.item-sub { font-size: 0.85rem; color: var(--gray-color); }
.meta-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.date-text { font-size: 0.75rem; color: var(--gray-color); }
.status-badge { font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; text-transform: capitalize; font-weight: 500; }
.status-badge.published { background: var(--success-soft); color: var(--success-color); }
.status-badge.draft { background: var(--gray-light); color: var(--gray-dark); }
.status-badge.closed { background: var(--warning-soft); color: var(--warning-color); }
.dist-label { display: flex; align-items: center; gap: 10px; }
.year-badge { width: 32px; height: 32px; background: var(--primary-soft); color: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
.dist-text { font-weight: 500; color: var(--dark-color); }
.dist-count { font-weight: 700; font-size: 1.1rem; color: var(--dark-color); }
.empty-state { text-align: center; padding: 2rem; color: var(--gray-color); font-style: italic; }
.mb-0 { margin-bottom: 0 !important; }
.mb-2 { margin-bottom: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-2 { margin-top: 0.5rem; }

@media (max-width: 768px) {
  .page-header { flex-direction: column; gap: 10px; }
  .grid-2 { grid-template-columns: 1fr; }
  .actions-grid { grid-template-columns: 1fr; }
}
</style>