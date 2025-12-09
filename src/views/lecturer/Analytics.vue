<template>
  <div class="module-analysis-dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Module Analysis</h1>
          <p class="page-subtitle">Detailed insights and performance analytics for your modules</p>
        </div>
        <div class="header-actions">
          <button class="btn action-btn export-btn" @click="exportAnalysisReport">
            <div class="btn-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            Export Report
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats-grid">
      <div class="stat-card primary">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ modules.length }}</h3>
          <p>Total Modules</p>
          <span class="stat-trend positive">+2 this semester</span>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ overallStats.avgScore }}%</h3>
          <p>Average Score</p>
          <span class="stat-trend positive">+5% from last term</span>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ overallStats.totalStudents }}</h3>
          <p>Total Students</p>
          <span class="stat-trend positive">+12 enrolled</span>
        </div>
      </div>

      <div class="stat-card secondary">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ overallStats.passRate }}%</h3>
          <p>Overall Pass Rate</p>
          <span class="stat-trend positive">+3% improvement</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="analysis-grid">
      <!-- Module Performance Chart -->
      <div class="analysis-card full-width">
        <div class="card-header">
          <h3>Module Performance Overview</h3>
          <div class="card-actions">
            <select v-model="selectedMetric" class="metric-select">
              <option value="avgScore">Average Score</option>
              <option value="passRate">Pass Rate</option>
              <option value="completionRate">Completion Rate</option>
            </select>
          </div>
        </div>
        <div class="chart-container">
          <div class="performance-chart">
            <div 
              v-for="module in modules" 
              :key="module.id"
              class="chart-bar"
              :style="{ height: getChartHeight(module) + '%' }"
              :class="getBarColor(module)"
              @click="selectModule(module)"
            >
              <div class="bar-value">{{ getModuleMetric(module) }}%</div>
              <div class="bar-label">{{ module.code }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Module List with Detailed Stats -->
      <div class="analysis-card">
        <div class="card-header">
          <h3>Module Details</h3>
          <span class="card-subtitle">Click for detailed analysis</span>
        </div>
        <div class="module-list">
          <div 
            v-for="module in modules" 
            :key="module.id"
            class="module-list-item"
            :class="{ active: selectedModule?.id === module.id }"
            @click="selectModule(module)"
          >
            <div class="module-info">
              <h4 class="module-name">{{ module.name }}</h4>
              <span class="module-code">{{ module.code }}</span>
              <span class="module-meta">{{ module.year }} • {{ getYearLevel(module.year) }} • S{{ module.semester }}</span>
            </div>
            <div class="module-stats">
              <div class="stat">
                <span class="stat-value">{{ module.avgScore }}%</span>
                <span class="stat-label">Avg Score</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ module.passRate }}%</span>
                <span class="stat-label">Pass Rate</span>
              </div>
            </div>
            <div class="progress-indicator">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :class="getProgressClass(module.avgScore)"
                  :style="{ width: module.avgScore + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Module Deep Dive -->
      <div class="analysis-card" v-if="selectedModule">
        <div class="card-header">
          <h3>Module Analysis: {{ selectedModule.name }}</h3>
          <span class="card-subtitle">{{ selectedModule.code }}</span>
        </div>
        <div class="deep-dive-content">
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-icon success">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div class="metric-content">
                <h4>{{ selectedModule.avgScore }}%</h4>
                <p>Average Score</p>
                <span class="metric-trend" :class="getTrendClass(selectedModule.trends.avgScore)">
                  {{ selectedModule.trends.avgScore > 0 ? '+' : '' }}{{ selectedModule.trends.avgScore }}%
                </span>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon primary">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="metric-content">
                <h4>{{ selectedModule.passRate }}%</h4>
                <p>Pass Rate</p>
                <span class="metric-trend" :class="getTrendClass(selectedModule.trends.passRate)">
                  {{ selectedModule.trends.passRate > 0 ? '+' : '' }}{{ selectedModule.trends.passRate }}%
                </span>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon warning">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div class="metric-content">
                <h4>{{ selectedModule.completionRate }}%</h4>
                <p>Completion Rate</p>
                <span class="metric-trend" :class="getTrendClass(selectedModule.trends.completionRate)">
                  {{ selectedModule.trends.completionRate > 0 ? '+' : '' }}{{ selectedModule.trends.completionRate }}%
                </span>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon secondary">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="metric-content">
                <h4>{{ selectedModule.studentCount }}</h4>
                <p>Active Students</p>
                <span class="metric-trend positive">+{{ selectedModule.newStudents }} new</span>
              </div>
            </div>
          </div>

          <!-- Quiz Performance -->
          <div class="quiz-performance">
            <h4>Quiz Performance</h4>
            <div class="quiz-list">
              <div 
                v-for="quiz in selectedModule.quizzes" 
                :key="quiz.id"
                class="quiz-item"
              >
                <div class="quiz-info">
                  <span class="quiz-title">{{ quiz.title }}</span>
                  <span class="quiz-meta">{{ quiz.attempts }} attempts • {{ quiz.avgScore }}% avg</span>
                </div>
                <div class="quiz-stats">
                  <div class="score-indicator" :class="getScoreClass(quiz.avgScore)">
                    {{ quiz.avgScore }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn primary" @click="viewDetailedResults(selectedModule)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              View Detailed Results
            </button>
            <button class="btn outline" @click="exportModuleReport(selectedModule)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Export Module Report
            </button>
          </div>
        </div>
      </div>

      <!-- Performance Trends 
      <div class="analysis-card" v-if="selectedModule">
        <div class="card-header">
          <h3>Performance Trends</h3>
          <span class="card-subtitle">Last 6 months</span>
        </div>
        <div class="trends-container">
          <div class="trend-chart">
            <div class="trend-line" v-for="month in performanceTrends" :key="month.month">
              <div class="trend-month">{{ month.month }}</div>
              <div class="trend-bar">
                <div 
                  class="trend-fill score"
                  :style="{ width: month.avgScore + '%' }"
                  :title="'Avg Score: ' + month.avgScore + '%'"
                ></div>
                <div 
                  class="trend-fill pass-rate"
                  :style="{ width: month.passRate + '%' }"
                  :title="'Pass Rate: ' + month.passRate + '%'"
                ></div>
              </div>
              <div class="trend-labels">
                <span class="score-label">{{ month.avgScore }}%</span>
                <span class="pass-label">{{ month.passRate }}%</span>
              </div>
            </div>
          </div>
          <div class="trend-legend">
            <div class="legend-item">
              <div class="legend-color score"></div>
              <span>Average Score</span>
            </div>
            <div class="legend-item">
              <div class="legend-color pass-rate"></div>
              <span>Pass Rate</span>
            </div>
          </div>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ModuleAnalysis',
  setup() {
    const modules = ref([])
    const selectedModule = ref(null)
    const selectedMetric = ref('avgScore')
    const loading = ref(true)

    const overallStats = computed(() => {
      if (modules.value.length === 0) return { avgScore: 0, passRate: 0, totalStudents: 0 }
      
      const totalScore = modules.value.reduce((sum, module) => sum + module.avgScore, 0)
      const totalPassRate = modules.value.reduce((sum, module) => sum + module.passRate, 0)
      const totalStudents = modules.value.reduce((sum, module) => sum + module.studentCount, 0)
      
      return {
        avgScore: Math.round(totalScore / modules.value.length),
        passRate: Math.round(totalPassRate / modules.value.length),
        totalStudents: totalStudents
      }
    })

    const performanceTrends = ref([
      { month: 'Jan', avgScore: 72, passRate: 68 },
      { month: 'Feb', avgScore: 75, passRate: 71 },
      { month: 'Mar', avgScore: 78, passRate: 74 },
      { month: 'Apr', avgScore: 76, passRate: 72 },
      { month: 'May', avgScore: 80, passRate: 76 },
      { month: 'Jun', avgScore: 82, passRate: 78 }
    ])

    // Methods
    const getYearLevel = (academicYear) => {
      const currentYear = new Date().getFullYear()
      const yearDifference = currentYear - academicYear
      
      if (yearDifference === 0) return 'Year I'
      if (yearDifference === 1) return 'Year II'
      if (yearDifference === 2) return 'Year III'
      if (yearDifference === 3) return 'Year IV'
      return 'Graduate Level'
    }

    const getChartHeight = (module) => {
      const value = getModuleMetric(module)
      return Math.max(20, (value / 100) * 80) // Minimum 20% height for visibility
    }

    const getModuleMetric = (module) => {
      switch (selectedMetric.value) {
        case 'avgScore': return module.avgScore
        case 'passRate': return module.passRate
        case 'completionRate': return module.completionRate
        default: return module.avgScore
      }
    }

    const getBarColor = (module) => {
      const value = getModuleMetric(module)
      if (value >= 80) return 'excellent'
      if (value >= 70) return 'good'
      if (value >= 60) return 'average'
      return 'poor'
    }

    const getProgressClass = (score) => {
      if (score >= 80) return 'excellent'
      if (score >= 70) return 'good'
      if (score >= 60) return 'average'
      return 'poor'
    }

    const getScoreClass = (score) => {
      if (score >= 80) return 'excellent'
      if (score >= 70) return 'good'
      if (score >= 60) return 'average'
      return 'poor'
    }

    const getTrendClass = (trend) => {
      return trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'
    }

    const selectModule = (module) => {
      selectedModule.value = module
    }

    const viewDetailedResults = (module) => {
      // Navigate to detailed results page or open modal
      console.log('View detailed results for:', module.name)
      // this.$router.push(`/lecturer/results/module/${module.id}`)
    }

    const exportAnalysisReport = () => {
      console.log('Exporting analysis report...')
    }

    const exportModuleReport = (module) => {
      console.log('Exporting module report for:', module.name)
    }

    onMounted(() => {
      loading.value = true
      setTimeout(() => {
        // Mock data
        modules.value = [
          {
            id: 1,
            name: 'Web Programming',
            code: 'CS401',
            year: 2025,
            semester: 1,
            avgScore: 82,
            passRate: 78,
            completionRate: 92,
            studentCount: 45,
            newStudents: 5,
            trends: {
              avgScore: 5,
              passRate: 3,
              completionRate: 2
            },
            quizzes: [
              { id: 1, title: 'HTML Basics', attempts: 42, avgScore: 85 },
              { id: 2, title: 'CSS Fundamentals', attempts: 40, avgScore: 78 },
              { id: 3, title: 'JavaScript Basics', attempts: 38, avgScore: 76 }
            ]
          },
          {
            id: 2,
            name: 'Database Systems',
            code: 'CS402',
            year: 2025,
            semester: 1,
            avgScore: 78,
            passRate: 75,
            completionRate: 88,
            studentCount: 38,
            newStudents: 3,
            trends: {
              avgScore: 2,
              passRate: 4,
              completionRate: 1
            },
            quizzes: [
              { id: 4, title: 'SQL Fundamentals', attempts: 36, avgScore: 80 },
              { id: 5, title: 'Database Design', attempts: 34, avgScore: 75 }
            ]
          },
          {
            id: 3,
            name: 'Data Structures',
            code: 'CS301',
            year: 2024,
            semester: 2,
            avgScore: 75,
            passRate: 72,
            completionRate: 85,
            studentCount: 42,
            newStudents: 2,
            trends: {
              avgScore: -1,
              passRate: 1,
              completionRate: 0
            },
            quizzes: [
              { id: 6, title: 'Arrays & Lists', attempts: 40, avgScore: 78 },
              { id: 7, title: 'Trees & Graphs', attempts: 35, avgScore: 70 }
            ]
          },
          {
            id: 4,
            name: 'OOP Principles',
            code: 'CS201',
            year: 2024,
            semester: 1,
            avgScore: 85,
            passRate: 82,
            completionRate: 95,
            studentCount: 50,
            newStudents: 8,
            trends: {
              avgScore: 8,
              passRate: 6,
              completionRate: 3
            },
            quizzes: [
              { id: 8, title: 'OOP Concepts', attempts: 48, avgScore: 88 },
              { id: 9, title: 'Inheritance & Polymorphism', attempts: 45, avgScore: 82 }
            ]
          }
        ]

        // Select first module by default
        if (modules.value.length > 0) {
          selectedModule.value = modules.value[0]
        }

        loading.value = false
      }, 1000)
    })

    return {
      modules,
      selectedModule,
      selectedMetric,
      overallStats,
      performanceTrends,
      getYearLevel,
      getChartHeight,
      getModuleMetric,
      getBarColor,
      getProgressClass,
      getScoreClass,
      getTrendClass,
      selectModule,
      viewDetailedResults,
      exportAnalysisReport,
      exportModuleReport
    }
  }
}
</script>

<style scoped>
.module-analysis-dashboard {
  padding: var(--spacing-md);
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: var(--spacing-xl);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--dark-color);
  margin-bottom: 4px;
}

.page-subtitle {
  color: var(--gray-color);
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Quick Stats */
.quick-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-card.primary {
  border-left-color: var(--primary-color);
}

.stat-card.success {
  border-left-color: var(--success-color);
}

.stat-card.warning {
  border-left-color: var(--warning-color);
}

.stat-card.secondary {
  border-left-color: var(--secondary-color);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.primary .stat-icon {
  background: var(--primary-soft);
  color: var(--primary-color);
}

.stat-card.success .stat-icon {
  background: var(--success-soft);
  color: var(--success-color);
}

.stat-card.warning .stat-icon {
  background: var(--warning-soft);
  color: var(--warning-color);
}

.stat-card.secondary .stat-icon {
  background: var(--secondary-soft);
  color: var(--secondary-color);
}

.stat-content h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0 0 4px 0;
  line-height: 1;
}

.stat-content p {
  margin: 0 0 4px 0;
  color: var(--gray-color);
  font-weight: 500;
}

.stat-trend {
  font-size: 0.8rem;
  font-weight: 600;
}

.stat-trend.positive {
  color: var(--success-color);
}

/* Main Analysis Grid */
.analysis-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  align-items: start;
}

.analysis-card {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  border: 1px solid var(--gray-light);
}

.analysis-card.full-width {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--gray-light);
}

.card-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0;
}

.card-subtitle {
  font-size: 0.9rem;
  color: var(--gray-color);
}

.metric-select {
  padding: 6px 12px;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius-md);
  background: white;
  font-size: 0.9rem;
}

/* Performance Chart */
.chart-container {
  padding: var(--spacing-md) 0;
}

.performance-chart {
  display: flex;
  align-items: end;
  gap: var(--spacing-md);
  height: 200px;
  padding: 0 var(--spacing-md);
}

.chart-bar {
  flex: 1;
  background: var(--primary-color);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  padding: 8px 4px;
}

.chart-bar:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.chart-bar.excellent {
  background: var(--success-color);
}

.chart-bar.good {
  background: var(--primary-color);
}

.chart-bar.average {
  background: var(--warning-color);
}

.chart-bar.poor {
  background: var(--danger-color);
}

.bar-value {
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.bar-label {
  color: white;
  font-size: 0.7rem;
  font-weight: 500;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

/* Module List */
.module-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.module-list-item {
  padding: var(--spacing-md);
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--light-color);
}

.module-list-item:hover {
  border-color: var(--primary-color);
  background: white;
  transform: translateY(-1px);
}

.module-list-item.active {
  border-color: var(--primary-color);
  background: var(--primary-soft);
}

.module-info {
  margin-bottom: var(--spacing-sm);
}

.module-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0 0 4px 0;
}

.module-code {
  font-size: 0.8rem;
  color: var(--primary-color);
  font-weight: 600;
  background: var(--primary-soft);
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: var(--spacing-sm);
}

.module-meta {
  font-size: 0.8rem;
  color: var(--gray-color);
}

.module-stats {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--dark-color);
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--gray-color);
  text-transform: uppercase;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--gray-light);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill.excellent {
  background: var(--success-color);
}

.progress-fill.good {
  background: var(--primary-color);
}

.progress-fill.average {
  background: var(--warning-color);
}

.progress-fill.poor {
  background: var(--danger-color);
}

/* Deep Dive Content */
.deep-dive-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.metric-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--light-color);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--gray-light);
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon.success {
  background: var(--success-soft);
  color: var(--success-color);
}

.metric-icon.primary {
  background: var(--primary-soft);
  color: var(--primary-color);
}

.metric-icon.warning {
  background: var(--warning-soft);
  color: var(--warning-color);
}

.metric-icon.secondary {
  background: var(--secondary-soft);
  color: var(--secondary-color);
}

.metric-content h4 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark-color);
  margin: 0 0 2px 0;
  line-height: 1;
}

.metric-content p {
  margin: 0 0 4px 0;
  color: var(--gray-color);
  font-size: 0.9rem;
}

.metric-trend {
  font-size: 0.8rem;
  font-weight: 600;
}

.metric-trend.positive {
  color: var(--success-color);
}

.metric-trend.negative {
  color: var(--danger-color);
}

.metric-trend.neutral {
  color: var(--gray-color);
}

/* Quiz Performance */
.quiz-performance h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--dark-color);
  margin: 0 0 var(--spacing-md) 0;
}

.quiz-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.quiz-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: var(--light-color);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--gray-light);
}

.quiz-title {
  font-weight: 500;
  color: var(--dark-color);
}

.quiz-meta {
  font-size: 0.8rem;
  color: var(--gray-color);
}

.score-indicator {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.score-indicator.excellent {
  background: var(--success-color);
}

.score-indicator.good {
  background: var(--primary-color);
}

.score-indicator.average {
  background: var(--warning-color);
}

.score-indicator.poor {
  background: var(--danger-color);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.action-buttons .btn {
  flex: 1;
}

/* Trends */
.trends-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.trend-chart {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.trend-line {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.trend-month {
  width: 40px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--dark-color);
}

.trend-bar {
  flex: 1;
  height: 20px;
  background: var(--gray-light);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.trend-fill {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: width 0.3s ease;
}

.trend-fill.score {
  background: var(--primary-color);
  z-index: 1;
}

.trend-fill.pass-rate {
  background: var(--success-color);
  z-index: 2;
  opacity: 0.8;
}

.trend-labels {
  display: flex;
  gap: var(--spacing-md);
  font-size: 0.8rem;
}

.score-label {
  color: var(--primary-color);
  font-weight: 600;
}

.pass-label {
  color: var(--success-color);
  font-weight: 600;
}

.trend-legend {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.8rem;
  color: var(--gray-color);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.score {
  background: var(--primary-color);
}

.legend-color.pass-rate {
  background: var(--success-color);
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 6px;
}

.btn.primary {
  background: var(--primary-color);
  color: white;
}

.btn.primary:hover {
  background: var(--primary-dark);
}

.btn.outline {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn.outline:hover {
  background: var(--primary-color);
  color: white;
}

.btn.action-btn {
  padding: 8px 16px;
  border: 2px solid var(--primary-color);
  background: transparent;
  color: var(--primary-color);
}

.btn.action-btn:hover {
  background: var(--primary-color);
  color: white;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .metric-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .quick-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .performance-chart {
    flex-direction: column;
    height: auto;
    gap: var(--spacing-sm);
  }
  
  .chart-bar {
    flex-direction: row;
    justify-content: space-between;
    padding: var(--spacing-sm);
    min-height: auto;
  }
  
  .bar-label {
    writing-mode: horizontal-tb;
    transform: none;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .module-stats {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .trend-line {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }
  
  .trend-labels {
    justify-content: space-between;
  }
}
</style>