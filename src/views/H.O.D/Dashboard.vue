<template>
  <div class="hod-dashboard">
    <div class="page-header">
      <div>
        <h1 class="page-title">HOD Dashboard</h1>
        <div class="title-decoration"></div><br>
        <p class="page-subtitle">Department Management <strong> {{ departmentName }} </strong></p>
      </div>
      <div class="header-actions">
        <AppButton variant="outline" @click="refreshData" :disabled="loading">
          <span v-if="loading" class="btn-loading-content">
             <AppSpinner size="sm" color="dark" /> Refreshing...
          </span>
          <span v-else class="icon-wrapper">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path></svg>
            Refresh
          </span>
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
        <div class="stat-icon primary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="stat-info">
          <span class="label">Total Students</span>
          <span class="value">{{ stats.totalStudents }}</span>
          <span v-if="stats.pendingApprovals > 0" class="trend warning">
            {{ stats.pendingApprovals }} pending
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon secondary">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
        </div>
        <div class="stat-info">
          <span class="label">Lecturers</span>
          <span class="value">{{ stats.totalLecturers }}</span>
          <span class="trend">{{ stats.activeLecturers }} active</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="label">Courses</span>
          <span class="value">{{ stats.totalCourses }}</span>
          <span class="trend">{{ stats.activeCourses }} active</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="label">Modules</span>
          <span class="value">{{ stats.totalModules }}</span>
          <span class="trend">{{ stats.activeModules }} active</span>
        </div>
      </div>
    </div>

    <h2 class="section-title">Quick Management</h2>
    
    <div v-if="loading" class="grid-3">
       <div v-for="n in 3" :key="n" class="skeleton-action-card">
          <AppSkeleton width="100%" height="100%" borderRadius="12px" />
       </div>
    </div>

    <div v-else class="grid-3">
      <div class="action-card" @click="$router.push('/hod/courses')">
        <div class="action-icon primary">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        <h3>Manage Courses</h3>
        <p>Curriculum & Programs</p>
      </div>

      <div class="action-card" @click="$router.push('/hod/modules')">
        <div class="action-icon secondary">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        </div>
        <h3>Manage Modules</h3>
        <p>Assignments & Content</p>
      </div>

      <div class="action-card" @click="$router.push('/hod/lecturers')">
        <div class="action-icon success">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle></svg>
        </div>
        <h3>Manage Lecturers</h3>
        <p>Staff & Allocations</p>
      </div>
    </div>

    <div class="content-grid">
      
      <div class="content-card">
        <div class="card-header-row">
          <div class="card-title-group">
            <h3 class="card-title">Pending Approvals</h3>
            <span class="badge warning" v-if="pendingApprovals.length > 0">
              {{ pendingApprovals.length }} new
            </span>
          </div>
          <router-link to="/hod/students" class="see-more-link">
            See All
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </router-link>
        </div>
        
        <div v-if="loading" class="skeleton-list">
           <AppSkeleton v-for="n in 3" :key="n" width="100%" height="60px" class="mb-2" borderRadius="8px" />
        </div>
        
        <div v-else class="approval-list">
          <div v-for="student in pendingApprovals" :key="student.id" class="approval-item">
            <div class="student-info">
              <div class="avatar-sm">{{ getInitials(student.name) }}</div>
              <div>
                <span class="student-name">{{ student.name }}</span>
                <span class="student-details">{{ student.program }} • {{ student.appliedDate }}</span>
              </div>
            </div>
            <div class="approval-actions">
              <button class="icon-btn success" @click="approveStudent(student.id)" title="Approve">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
            </div>
          </div>
          <div v-if="pendingApprovals.length === 0" class="empty-state small">
            <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" fill="none" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <p>All caught up!</p>
            <span>No pending approvals.</span>
          </div>
        </div>
      </div>
      
      <div class="content-card">
        <div class="card-header-row">
          <h3 class="card-title">Lecturer Overview</h3>
          <router-link to="/hod/lecturers" class="see-more-link">
            See All
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </router-link>
        </div>
        
        <div v-if="loading" class="skeleton-list">
           <AppSkeleton v-for="n in 3" :key="n" width="100%" height="60px" class="mb-2" borderRadius="8px" />
        </div>

        <div v-else class="staff-list">
          <div v-for="lecturer in departmentLecturers" :key="lecturer.id" class="staff-item">
            <div class="staff-info">
              <div class="avatar-sm" :class="getRandomColor(lecturer.id)">{{ getInitials(lecturer.name) }}</div>
              <div>
                <span class="staff-name">{{ lecturer.name }}</span>
                <span class="staff-role">{{ lecturer.role }}</span>
              </div>
            </div>
            <div class="staff-stats">
              <span class="module-count">{{ lecturer.modules }} modules</span>
              <span class="status-dot" :class="lecturer.status" :title="lecturer.status"></span>
            </div>
          </div>
          <div v-if="departmentLecturers.length === 0" class="empty-state small">
             <p>No lecturers found.</p>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="card-header-row">
          <h3 class="card-title">Recent Activity</h3>
          <span class="badge info">Latest Updates</span>
        </div>

        <div v-if="loading" class="skeleton-list">
           <AppSkeleton v-for="n in 3" :key="n" width="100%" height="60px" class="mb-2" borderRadius="8px" />
        </div>

        <div v-else class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-icon-wrapper" :class="activity.type">
              <svg v-if="activity.type === 'course'" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <svg v-else-if="activity.type === 'module'" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              <svg v-else viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.message }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>

          <div v-if="recentActivities.length === 0" class="empty-state small">
             <p>No recent activity.</p>
          </div>
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
  name: 'HodDashboard',
  components: { AppButton, AppSkeleton, AppSpinner },
  setup() {
    const loading = ref(true)
    const departmentName = ref('')
    const stats = ref({
      totalStudents: 0,
      pendingApprovals: 0,
      totalLecturers: 0,
      activeLecturers: 0,
      totalCourses: 0,
      activeCourses: 0,
      totalModules: 0,
      activeModules: 0
    })
    
    const pendingApprovals = ref([])
    const departmentLecturers = ref([])
    const recentActivities = ref([])

    const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : ''
    
    const getRandomColor = (id) => {
      const colors = ['bg-blue', 'bg-purple', 'bg-green', 'bg-orange']
      return colors[id % colors.length]
    }

    const loadDashboardData = async () => {
      loading.value = true
      try {
        const response = await api.get('/hod/dashboard-stats')
        if (response.data.success) {
           departmentName.value = response.data.department_name
           stats.value = response.data.stats
           pendingApprovals.value = response.data.pending_students
           departmentLecturers.value = response.data.lecturers
           recentActivities.value = response.data.recent_activities || []
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error)
      } finally {
        // Delay for visual smoothness
        setTimeout(() => loading.value = false, 500)
      }
    }

    const refreshData = () => {
      loadDashboardData()
    }

    const approveStudent = async (studentId) => {
      if (confirm('Approve this student?')) {
        try {
           await api.put(`/students/${studentId}/approve`)
           // Optimistic update
           pendingApprovals.value = pendingApprovals.value.filter(s => s.id !== studentId)
           stats.value.pendingApprovals--
           stats.value.totalStudents++
        } catch (e) {
           alert('Failed to approve')
        }
      }
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      loading,
      departmentName,
      stats,
      pendingApprovals,
      departmentLecturers,
      recentActivities,
      refreshData,
      approveStudent,
      getInitials,
      getRandomColor
    }
  }
}
</script>

<style scoped>
/* Page Layout */
.hod-dashboard { max-width: 1400px; margin: 0 auto; padding: var(--spacing-md); }

/* Header */
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: 10px; }
.page-title { font-size: 2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); }
.header-actions { display: flex; gap: var(--spacing-sm); }
.icon-wrapper { margin-right: 8px; display: flex; align-items: center; gap: 6px; }

/* Statistics */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-xl); }
.stat-card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); display: flex; align-items: center; gap: 16px; transition: transform 0.2s ease; }
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon.secondary { background: var(--secondary-soft); color: var(--secondary-color); }
.stat-icon.success { background: var(--success-soft); color: var(--success-color); }
.stat-icon.warning { background: var(--warning-soft); color: var(--warning-color); }
.stat-info { display: flex; flex-direction: column; flex: 1; }
.stat-info .label { font-size: 0.8rem; color: var(--gray-color); text-transform: uppercase; margin-bottom: 4px; }
.stat-info .value { font-size: 1.75rem; font-weight: 700; color: var(--dark-color); line-height: 1.2; margin-bottom: 2px; }
.trend { font-size: 0.75rem; font-weight: 500; color: var(--gray-color); }
.trend.warning { color: var(--warning-color); font-weight: 600; }

/* NEW SKELETON STYLES */
.skeleton-stat-card {
  height: 100px;
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  border: 1px solid var(--gray-light);
}
.skeleton-action-card {
  height: 140px;
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  border: 1px solid var(--gray-light);
}
.mb-2 { margin-bottom: 8px; }
.btn-loading-content { display: flex; align-items: center; gap: 8px; }

/* Section Title */
.section-title { font-size: 1.2rem; font-weight: 600; color: var(--dark-color); margin-bottom: var(--spacing-md); }

/* Quick Actions Grid */
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-xl); }
.action-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); padding: var(--spacing-lg); display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--spacing-sm); cursor: pointer; transition: all 0.2s ease; }
.action-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--primary-light); }
.action-card h3 { font-size: 1.1rem; font-weight: 600; color: var(--dark-color); margin-top: 4px; }
.action-card p { font-size: 0.9rem; color: var(--gray-color); margin-bottom: 4px; }
.action-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.action-icon.primary { background: var(--primary-soft); color: var(--primary-color); }
.action-icon.secondary { background: var(--secondary-soft); color: var(--secondary-color); }
.action-icon.success { background: var(--success-soft); color: var(--success-color); }

/* Main Content Grid */
.content-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
  gap: var(--spacing-lg); 
  margin-top: var(--spacing-lg); 
}

/* Content Cards */
.content-card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light); height: 100%; display: flex; flex-direction: column; }
.card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); border-bottom: 1px solid var(--gray-light); padding-bottom: 10px; }
.card-title-group { display: flex; align-items: center; gap: 10px; }
.card-title { font-size: 1.1rem; font-weight: 600; color: var(--dark-color); margin: 0; }
.badge { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.badge.warning { background: var(--warning-soft); color: var(--warning-color); }
.badge.info { background: var(--primary-soft); color: var(--primary-color); }
.see-more-link { display: flex; align-items: center; gap: 4px; font-size: 0.85rem; font-weight: 600; color: var(--primary-color); text-decoration: none; transition: gap 0.2s; }
.see-more-link:hover { gap: 6px; }

/* Lists */
.approval-list, .staff-list, .activity-list { display: flex; flex-direction: column; gap: var(--spacing-md); flex: 1; }
.approval-item, .staff-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--light-color); border-radius: 8px; border: 1px solid var(--gray-light); transition: background 0.2s; }
.approval-item:hover, .staff-item:hover { background: #f8fafc; }

/* Activity Items */
.activity-item { display: flex; gap: 12px; align-items: flex-start; padding-bottom: 12px; border-bottom: 1px solid var(--gray-light); }
.activity-item:last-child { border-bottom: none; }
.activity-icon-wrapper { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: var(--gray-light); color: var(--gray-color); }
.activity-icon-wrapper.course { background: var(--primary-soft); color: var(--primary-color); }
.activity-icon-wrapper.module { background: var(--secondary-soft); color: var(--secondary-color); }
.activity-icon-wrapper.student { background: var(--success-soft); color: var(--success-color); }
.activity-content { flex: 1; }
.activity-text { font-size: 0.9rem; color: var(--dark-color); margin: 0 0 4px 0; line-height: 1.4; }
.activity-time { font-size: 0.75rem; color: var(--gray-color); display: block; }

.student-info, .staff-info { display: flex; align-items: center; gap: 12px; }
.avatar-sm { width: 36px; height: 36px; border-radius: 50%; background: var(--primary-soft); color: var(--primary-color); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.8rem; flex-shrink: 0; }
.student-name, .staff-name { font-weight: 600; color: var(--dark-color); display: block; font-size: 0.9rem; }
.student-details, .staff-role { font-size: 0.8rem; color: var(--gray-color); }

.icon-btn { background: white; border: 1px solid var(--gray-light); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.icon-btn.success:hover { background: var(--success-color); color: white; border-color: var(--success-color); }

.staff-stats { text-align: right; }
.module-count { display: block; font-size: 0.8rem; color: var(--gray-color); margin-bottom: 2px; }
.status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
.status-dot.active { background: var(--success-color); box-shadow: 0 0 4px var(--success-light); }
.status-dot.inactive { background: var(--gray-color); }

/* Empty State */
.empty-state { text-align: center; padding: 2rem; color: var(--gray-color); display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; }
.empty-state svg { color: var(--gray-light); margin-bottom: 10px; }
.empty-state p { font-weight: 600; color: var(--dark-color); margin-bottom: 2px; }
.empty-state span { font-size: 0.85rem; }
.empty-state.small { padding: 1.5rem; }

/* Avatar Colors */
.bg-blue { background: #e0e7ff; color: #4338ca; }
.bg-purple { background: #f3e8ff; color: #7e22ce; }
.bg-green { background: #dcfce7; color: #15803d; }
.bg-orange { background: #ffedd5; color: #c2410c; }

/* Responsive */
@media (max-width: 900px) {
  .content-grid { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .stats-row, .grid-3 { grid-template-columns: 1fr; }
  .approval-item { flex-direction: column; align-items: flex-start; gap: 10px; }
  .approval-actions { width: 100%; display: flex; justify-content: flex-end; }
}
</style>