<template>
  <div class="card quiz-card" :class="cardStatusClass">
    <div class="card-header">
      <div class="course-info">
        <span class="course-code">{{ quiz.course_code || 'CS101' }}</span>
        <span class="course-name">{{ quiz.course || 'Unknown Course' }}</span>
      </div>
      <div class="status-indicator" :class="statusColorClass">
        <span class="status-dot"></span>
        <span class="status-text">{{ statusLabel }}</span>
      </div>
    </div>
    
    <div class="card-body">
      <h3 class="quiz-title" :title="quiz.title">{{ quiz.title }}</h3>
      
      <div class="meta-row">
        <div class="meta-item" title="Duration">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{{ durationDisplay }}</span>
        </div>
        <div class="meta-item" title="Questions">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>{{ quiz.questions_count || 0 }} Qs</span>
        </div>
        <div class="meta-item" title="Total Marks">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2h-4c0-1.1-.9-2-2-2h-4C6.9 0 6 2 6 2H2v7"></path>
          </svg>
          <span>{{ quiz.total_marks || 0 }} Pts</span>
        </div>
      </div>

      <div class="context-box" :class="contextClass">
        
        <div v-if="computedStatus === 'upcoming'" class="context-content">
          <span class="context-label">Starts in</span>
          <CountdownTimer :targetTime="quiz.startTime" @finished="refreshStatus" />
        </div>

        <div v-else-if="computedStatus === 'open'" class="context-content warning">
          <span class="context-label">Ends in</span>
          <CountdownTimer :targetTime="quiz.endTime" @finished="handleExpired" />
        </div>

        <div v-else-if="computedStatus === 'completed'" class="context-content success">
          <span class="context-label">Score</span>
          <span class="context-value">{{ quiz.score }} / {{ quiz.total_marks }}</span>
        </div>

        <div v-else-if="computedStatus === 'closed'" class="context-content muted">
          <span class="context-label">Closed</span>
          <span class="context-value">{{ formatDate(quiz.endTime) }}</span>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <button 
        v-if="canStart"
        class="action-btn primary"
        @click="$emit('start-quiz', quiz)"
      >
        <span>{{ computedStatus === 'in_progress' ? 'Resume Quiz' : 'Start Quiz' }}</span>
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>

      <button 
        v-else-if="computedStatus === 'completed' || computedStatus === 'graded'"
        class="action-btn outline"
        @click="$emit('view-details', quiz)"
      >
        View Details
      </button>

      <div v-else class="status-message">
        {{ actionButtonLabel }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import CountdownTimer from '../../components/student/CountdownTimer.vue';

const props = defineProps({
  quiz: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['start-quiz', 'view-details', 'expired']);

const now = ref(Date.now());
const timer = ref(null);

// --- Reactive Status Logic ---
const computedStatus = computed(() => {
  if (props.quiz.status === 'graded' || props.quiz.status === 'completed') return 'completed';
  if (props.quiz.status === 'in_progress') return 'in_progress';

  // Time based checks
  if (props.quiz.endTime && now.value > new Date(props.quiz.endTime).getTime()) {
    return 'closed';
  }
  if (props.quiz.startTime && now.value < new Date(props.quiz.startTime).getTime()) {
    return 'upcoming';
  }
  return 'open';
});

// --- UI Helpers ---
const canStart = computed(() => {
  // Only allow start if Open or In Progress. 
  // If Completed, this is false.
  return computedStatus.value === 'open' || computedStatus.value === 'in_progress';
});

const durationDisplay = computed(() => {
  const mins = Math.floor(props.quiz.duration_minutes || props.quiz.duration / 60);
  return mins >= 60 ? `${(mins/60).toFixed(1)}h` : `${mins}m`;
});

const statusLabel = computed(() => {
  const map = {
    upcoming: 'Upcoming',
    open: 'Active',
    in_progress: 'In Progress',
    completed: 'Graded',
    closed: 'Closed'
  };
  return map[computedStatus.value] || props.quiz.status;
});

const actionButtonLabel = computed(() => {
  if (computedStatus.value === 'upcoming') return `Opens ${formatDate(props.quiz.startTime)}`;
  if (computedStatus.value === 'closed') return 'Submission Closed';
  return 'Not Available';
});

// --- Styling Classes ---
const cardStatusClass = computed(() => `is-${computedStatus.value}`);

const statusColorClass = computed(() => {
  const map = {
    upcoming: 'text-info',
    open: 'text-success',
    in_progress: 'text-warning',
    completed: 'text-primary',
    closed: 'text-muted'
  };
  return map[computedStatus.value];
});

const contextClass = computed(() => {
  const map = {
    upcoming: 'ctx-info',
    open: 'ctx-warning',
    in_progress: 'ctx-warning',
    completed: 'ctx-success',
    closed: 'ctx-gray'
  };
  return map[computedStatus.value];
});

// --- Lifecycle ---
function refreshStatus() {
  now.value = Date.now();
}

function handleExpired() {
  refreshStatus();
  emit('expired'); // Notify parent to reload lists
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

onMounted(() => {
  timer.value = setInterval(() => {
    now.value = Date.now();
  }, 10000); 
});

onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style scoped>
.quiz-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  height: 100%;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

/* --- Header --- */
.card-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
  background: #ffffff;
}

.course-info {
  display: flex;
  flex-direction: column;
}

.course-code {
  font-size: 0.7rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.course-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 20px;
  background: #f9fafb;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

/* Status Colors */
.text-info { color: #0ea5e9; background: #e0f2fe; }
.text-success { color: #10b981; background: #dcfce7; }
.text-warning { color: #f59e0b; background: #fef3c7; }
.text-primary { color: #6366f1; background: #e0e7ff; }
.text-muted { color: #9ca3af; background: #f3f4f6; }

/* --- Body --- */
.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 16px;
}

.quiz-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-row {
  display: flex;
  gap: 16px;
  color: #6b7280;
  font-size: 0.85rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

/* --- Context Box (Timer/Score) --- */
.context-box {
  margin-top: auto;
  padding: 12px 16px;
  border-radius: 8px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.context-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.context-label {
  color: #6b7280;
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 600;
}

.context-value {
  color: #111827;
  font-weight: 700;
}

/* Context Themes */
.ctx-warning { background: #fffbeb; color: #b45309; }
.ctx-info { background: #f0f9ff; color: #0369a1; }
.ctx-success { background: #f0fdf4; color: #15803d; }
.ctx-gray { background: #f3f4f6; color: #4b5563; }

/* --- Footer --- */
.card-footer {
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
  background: #fff;
}

.action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.action-btn.primary {
  background: #4f46e5;
  color: white;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.action-btn.primary:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.action-btn.outline {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.action-btn.outline:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.status-message {
  text-align: center;
  font-size: 0.85rem;
  color: #9ca3af;
  padding: 8px;
  font-weight: 500;
  background: #f9fafb;
  border-radius: 6px;
}
</style>