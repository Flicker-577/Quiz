<template>
  <div class="assignments-container">   
    <header class="dashboard-header mb-4">
      <div class="page-header">
      <div>
        <h1 class="page-title">Assigment</h1>
        <div class="title-decoration"></div><br>
        <p class="page-subtitle">My Assigment</p>
      </div>
    </div>
    </header>

    <div v-if="loadingQuizzes" class="stats-grid mb-4">
      <div v-for="i in 2" :key="i" class="stat-card">
        <AppSkeleton type="circle" width="56px" height="56px" class="mr-3" />
        <div class="stat-info w-100">
          <AppSkeleton type="text" width="40px" height="28px" class="mb-1" />
          <AppSkeleton type="text" width="80px" height="14px" />
        </div>
      </div>
    </div>

    <div v-else class="stats-grid mb-4">
      <div class="stat-card">
        <div class="stat-icon-wrapper primary-soft">
          <svg class="stat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ availableQuizzes.length }}</span>
          <span class="stat-label">Pending</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper success-soft">
          <svg class="stat-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ attempts.length }}</span>
          <span class="stat-label">Completed</span>
        </div>
      </div>
    </div>

    <div class="tabs-container mb-3">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'active' }"
        @click="activeTab = 'active'"
      >
        Available Quizzes
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'history' }"
        @click="activeTab = 'history'"
      >
        Attempt History
      </button>
    </div>

    <div v-if="activeTab === 'active'" class="tab-panel">
      <div v-if="loadingQuizzes" class="grid grid-3">
        <div v-for="i in 3" :key="i" class="card skeleton-card">
          <div class="card-header border-0 pb-0">
            <div class="d-flex justify-between mb-2">
              <AppSkeleton type="text" width="60px" height="20px" /> <AppSkeleton type="text" width="80px" height="20px" /> </div>
            <AppSkeleton type="text" width="80%" height="24px" class="mb-2" /> </div>
          <div class="card-body pt-0">
            <div class="d-flex align-center gap-2 mb-3">
              <AppSkeleton type="circle" width="16px" height="16px" />
              <AppSkeleton type="text" width="100px" height="14px" />
            </div>
            <div class="d-flex justify-between mt-4">
              <AppSkeleton type="text" width="100px" height="14px" />
              <AppSkeleton type="text" width="60px" height="14px" />
            </div>
            <div class="mt-4">
              <AppSkeleton type="text" width="100%" height="40px" /> </div>
          </div>
        </div>
      </div>

      <div v-else-if="availableQuizzes.length > 0" class="grid grid-3">
        <QuizCard
          v-for="quiz in availableQuizzes"
          :key="quiz.id"
          :quiz="quiz"
          @start-quiz="handleStartQuiz"
          @view-details="handleViewDetails"
        />
      </div>

      <div v-else class="empty-state card">
        <div class="empty-icon-bg">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
        <h3>No Pending Assessments</h3>
        <p>You're all caught up! Check back later.</p>
      </div>
    </div>

    <div v-if="activeTab === 'history'" class="tab-panel">
      <div v-if="loadingAttempts" class="card p-0 overflow-hidden">
        <div class="p-3 border-bottom d-flex gap-4">
           <AppSkeleton type="text" width="30%" height="20px" />
           <AppSkeleton type="text" width="20%" height="20px" />
           <AppSkeleton type="text" width="20%" height="20px" />
           <AppSkeleton type="text" width="10%" height="20px" />
        </div>
        <div v-for="j in 5" :key="j" class="p-3 border-bottom d-flex gap-4 align-center">
           <AppSkeleton type="text" width="30%" height="16px" />
           <AppSkeleton type="text" width="20%" height="16px" />
           <AppSkeleton type="text" width="20%" height="16px" />
           <div style="width: 10%">
             <AppSkeleton type="circle" width="30px" height="30px" />
           </div>
           <div style="width: 10%">
             <AppSkeleton type="text" width="60px" height="28px" />
           </div>
        </div>
      </div>

      <div v-else-if="attempts.length > 0" class="card p-0 overflow-hidden">
        <AppTable :columns="columns" :data="attempts" hover>
          <template #score="{ item }">
            <span class="score-value" :class="getScoreClass(item)">
              {{ item.score }} / {{ item.total_marks }}
            </span>
          </template>

          <template #status="{ item }">
            <span :class="['status-pill', item.status]">
              {{ formatStatus(item.status) }}
            </span>
          </template>

          <template #actions="{ item }">
            <button class="btn btn-outline btn-sm" @click="viewCorrection(item)">
              Review
            </button>
          </template>
        </AppTable>
      </div>

      <div v-else class="empty-state card">
        <div class="empty-icon-bg">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        </div>
        <h3>No History Yet</h3>
        <p>Complete a quiz to see your results here.</p>
      </div>
    </div>

    <AppModal :show="showQuizModal" full-screen @close="handleQuizCloseRequest">
      <QuizAttempt v-if="showQuizModal" @submit="handleQuizSubmit" @close="showQuizModal = false" />
    </AppModal>

    <QuizCorrectionModal :show="showCorrectionModal" :attempt="selectedAttempt" @close="showCorrectionModal = false" />
  </div>
</template>

<script setup>
// ... (Logic remains identical to previous versions) ...
import { ref, onMounted, computed } from 'vue';
import { useStudentQuizStore } from '@/stores/StudentQuizStore';
import api from '@/api/api';
import QuizCard from '../../components/student/QuizCard.vue';
import QuizAttempt from '../../components/student/QuizAttempt.vue';
import QuizCorrectionModal from '../../components/student/QuizCorrectionModal.vue';
import AppModal from '../../components/reusable/AppModal.vue';
import AppSkeleton from '../../components/reusable/AppSkeleton.vue';
import AppTable from '../../components/reusable/AppTable.vue';

const store = useStudentQuizStore();
const activeTab = ref('active');
const loadingQuizzes = ref(true);
const loadingAttempts = ref(true);
const quizzes = ref([]); 
const attempts = ref([]); 
const showQuizModal = ref(false);
const showCorrectionModal = ref(false);
const selectedAttempt = ref(null);

const columns = [
  { key: 'quiz_title', label: 'Assessment', width: '35%' },
  { key: 'module_name', label: 'Module', width: '25%' },
  { key: 'finished_at', label: 'Date', width: '20%' },
  { key: 'score', label: 'Score', width: '10%' },
];

const availableQuizzes = computed(() => quizzes.value.filter(q => q.status !== 'completed' && q.status !== 'graded'));

onMounted(() => { loadData(); });
function loadData() { loadQuizzes(); loadAttempts(); }

async function loadQuizzes() {
  loadingQuizzes.value = true;
  try { const res = await api.get('/student/quizzes'); quizzes.value = res.data; } 
  catch (err) { console.error(err); } finally { loadingQuizzes.value = false; }
}
async function loadAttempts() {
  loadingAttempts.value = true;
  try { const res = await api.get('/student/quiz-attempts'); attempts.value = res.data; } 
  catch (err) { console.error(err); } finally { loadingAttempts.value = false; }
}

async function handleStartQuiz(quiz) {
  try { await store.startQuiz(quiz.id); showQuizModal.value = true; } 
  catch (err) { alert(err.response?.data?.message || 'Error'); loadData(); }
}

function handleQuizSubmit() { showQuizModal.value = false; loadData(); activeTab.value = 'history'; window.scrollTo({ top: 0, behavior: 'smooth' }); }
function handleQuizCloseRequest() { if (store.status === 'running') { store.completeQuiz('Navigated Away'); } else { showQuizModal.value = false; loadData(); activeTab.value = 'history'; } }
async function viewCorrection(attempt) { try { const res = await api.get(`/student/quiz-attempts/${attempt.id}`); selectedAttempt.value = res.data; showCorrectionModal.value = true; } catch(e) { alert("Error loading results."); } }
function handleViewDetails() { activeTab.value = 'history'; }

function formatStatus(status) { const map = { 'graded': 'Graded', 'completed': 'Submitted', 'in_progress': 'Pending' }; return map[status] || status; }
function getScoreClass(item) { if (!item.total_marks) return ''; return (item.score / item.total_marks) >= 0.5 ? 'text-success' : 'text-danger'; }
</script>

<style scoped>
/* Reuse all styles from variables.css logic */
.assigment-container { max-width: 1200px; margin: 0 auto; padding: var(--spacing-md); }
.page-header { margin-bottom: var(--spacing-lg); }
.page-title { font-size: 2rem; font-weight: 700; color: var(--dark-color); margin-bottom: 0.5rem; }
.title-decoration { width: 60px; height: 4px; background: var(--gradient-primary); border-radius: 2px; }
.page-subtitle { color: var(--gray-color); }
.mb-1 { margin-bottom: 4px; } .mb-2 { margin-bottom: 8px; } .mb-3 { margin-bottom: 12px; }

/* Stats */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--spacing-lg); }
.stat-card {
  background: white; border-radius: var(--border-radius-lg); padding: var(--spacing-lg);
  display: flex; align-items: center; gap: var(--spacing-md);
  box-shadow: var(--shadow-sm); border: 1px solid var(--gray-light);
}
.stat-icon-wrapper { width: 56px; height: 56px; border-radius: var(--border-radius-md); display: flex; align-items: center; justify-content: center; }
.stat-icon-wrapper.primary-soft { background: var(--primary-soft); color: var(--primary-color); }
.stat-icon-wrapper.success-soft { background: var(--success-soft); color: var(--success-color); }
.stat-svg { width: 28px; height: 28px; }
.stat-value { font-size: var(--font-size-2xl); font-weight: 800; color: var(--dark-color); }
.stat-label { font-size: var(--font-size-sm); color: var(--gray-color); font-weight: 500; }

/* Tabs */
.tabs-container { display: flex; gap: var(--spacing-sm); background: var(--gray-light); padding: 4px; border-radius: var(--border-radius-md); width: fit-content; }
.tab-btn {
  padding: 10px 24px; border: none; background: transparent; color: var(--gray-dark);
  font-weight: 600; border-radius: var(--border-radius-sm); cursor: pointer; transition: all 0.2s;
}
.tab-btn.active { background: white; color: var(--primary-color); box-shadow: var(--shadow-sm); }

/* Skeleton Helpers */
.skeleton-card {
  background: white; border-radius: var(--border-radius-lg); padding: var(--spacing-md);
  border: 1px solid var(--gray-light); box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; height: 100%;
}
.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.w-100 { width: 100%; }
.border-0 { border: 0 !important; }
.pb-0 { padding-bottom: 0 !important; }
.pt-0 { padding-top: 0 !important; }
.mr-3 { margin-right: 1rem; }

/* Status */
.status-pill { padding: 4px 12px; border-radius: 99px; font-size: var(--font-size-xs); font-weight: 700; text-transform: uppercase; }
.status-pill.graded { background: var(--success-soft); color: var(--success-dark); }
.status-pill.completed { background: var(--primary-soft); color: var(--primary-dark); }

/* Empty State */
.empty-state { text-align: center; padding: var(--spacing-xl); }
.empty-icon-bg { width: 80px; height: 80px; background: var(--light-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-md); }
.empty-icon { width: 40px; height: 40px; color: var(--gray-color); }
</style>