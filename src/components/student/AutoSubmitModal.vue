<template>
  <div v-if="visible" class="overlay strict-overlay">
    <div class="overlay-content card border-top-danger">
      
      <div v-if="!store.submissionSuccess">
        <div class="icon-wrapper">
          <svg class="icon-svg spin text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
        </div>
        <h3 class="card-title mb-2">Auto-Submitting...</h3>
        <p class="text-gray mb-3">System detected a violation ({{ store.submissionReason }}).</p>
      </div>

      <div v-else>
        <div class="icon-wrapper">
           <svg class="icon-svg text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
             <polyline points="22 4 12 14.01 9 11.01"></polyline>
           </svg>
        </div>
        <h3 class="card-title mb-2">Quiz Submitted</h3>
        <p class="text-gray mb-3">Your answers have been recorded.</p>
        
        <div class="alert alert-danger" v-if="store.submissionReason">
          Reason: {{ store.submissionReason }}
        </div>
        
        <button class="btn btn-success w-100 mt-3" @click="$emit('confirm')">
          Return to History
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useStudentQuizStore } from '@/stores/studentQuizStore';
const props = defineProps({ visible: Boolean });
defineEmits(['confirm']);
const store = useStudentQuizStore();
</script>

<style scoped>
.overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(30, 41, 59, 0.9); backdrop-filter: blur(5px); }
.overlay-content { width: 90%; max-width: 450px; text-align: center; animation: popIn 0.3s ease; }
.border-top-danger { border-top: 5px solid var(--danger-color); }
.icon-svg { width: 64px; height: 64px; }
.spin { animation: spin 1s linear infinite; }
.text-primary { color: var(--primary-color); }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
</style>