import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/api';

export const useStudentQuizStore = defineStore('studentQuiz', () => {
  // --- State ---
  const quiz = ref(null);
  const attemptId = ref(null);
  const questions = ref([]);
  const answers = ref({});
  const currentQuestionIndex = ref(0);
  
  const timeRemaining = ref(0);
  const status = ref('idle'); 
  const saveStatus = ref('');
  const submissionSuccess = ref(false);

  const timerInterval = ref(null);
  const heartbeatInterval = ref(null);
  const isOnline = ref(navigator.onLine);
  
  const violationCount = ref(0); 
  const submissionReason = ref('');

  // --- Getters ---
  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
  const totalQuestions = computed(() => questions.value.length);
  const formattedTime = computed(() => {
    const m = Math.floor(timeRemaining.value / 60);
    const s = timeRemaining.value % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  });
  const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1);

  // --- Actions ---
  async function startQuiz(quizId) {
    try {
      const res = await api.post(`/student/quizzes/${quizId}/start`);
      const data = res.data;

      quiz.value = data.quiz;
      attemptId.value = data.attempt_id;
      questions.value = data.quiz.questions;
      timeRemaining.value = data.remaining_seconds;
      
      const saved = data.saved_answers || {};
      questions.value.forEach(q => { answers.value[q.id] = saved[q.id] || null; });

      status.value = 'running';
      saveStatus.value = '';
      submissionSuccess.value = false;
      submissionReason.value = '';

      enterFullScreen(); 
      startTimers();
      setupAntiCheating();
      
    } catch (error) {
      console.error("Start failed", error);
      throw error;
    }
  }

  // --- Full Screen Management ---
  function enterFullScreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  }

  function exitFullScreen() {
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  }

  // --- Timers ---
  function startTimers() {
    if (timerInterval.value) clearInterval(timerInterval.value);
    timerInterval.value = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--;
      } else {
        // DEV MODE: Optional - comment this out if you also want to ignore time limits
        completeQuiz('Time Expired');
      }
    }, 1000);

    if (heartbeatInterval.value) clearInterval(heartbeatInterval.value);
    heartbeatInterval.value = setInterval(sendHeartbeat, 30000);
  }

  function stopTimers() {
    if (timerInterval.value) clearInterval(timerInterval.value);
    if (heartbeatInterval.value) clearInterval(heartbeatInterval.value);
    teardownAntiCheating();
  }

  async function sendHeartbeat() {
    if (!isOnline.value) return;
    try { await api.post('/quizzes/heartbeat', { attempt_id: attemptId.value }); } catch (e) { }
  }

  // --- Anti-Cheating & Event Listeners ---
  function setupAntiCheating() {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    // Listen for Fullscreen Exit (ESC key)
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  function teardownAntiCheating() {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleWindowBlur);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  }

  function updateOnlineStatus() { isOnline.value = navigator.onLine; }

  // 1. Tab Switch / Minimize
  function handleVisibilityChange() {
    // DEV MODE: Commented out to prevent auto-submit
     if (document.hidden && status.value === 'running') completeQuiz('Tab Switch/Minimize');
    if (document.hidden && status.value === 'running') {
        console.warn('DEV MODE: Tab switch detected - Auto-submit suppressed.');
    }
  }

  // 2. Window Blur (Clicking outside / Switching to VS Code)
  function handleWindowBlur() {
    // DEV MODE: Commented out to prevent auto-submit
     if (status.value === 'running') completeQuiz('Focus Lost');
    if (status.value === 'running') {
        console.warn('DEV MODE: Focus lost - Auto-submit suppressed.');
    }
  }

  // 3. Fullscreen Exit Detection (ESC key)
  function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement || 
                         document.webkitFullscreenElement || 
                         document.mozFullScreenElement || 
                         document.msFullscreenElement;

    // DEV MODE: Commented out to prevent auto-submit
  
    if (status.value === 'running' && !isFullscreen) {
      completeQuiz('Exited Fullscreen');
    }
    
    if (status.value === 'running' && !isFullscreen) {
        console.warn('DEV MODE: Fullscreen exited - Auto-submit suppressed.');
    }
  }

  // --- Submission Logic ---
  async function completeQuiz(reason = 'Normal Submission') {
    if (status.value === 'submitting' || status.value === 'submitted') return;

    stopTimers();
    // Only exit fullscreen if it was a normal submission, otherwise keep context
    if (reason === 'Normal Submission') exitFullScreen();
    
    status.value = 'submitting';
    submissionReason.value = reason;
    saveStatus.value = 'Submitting...';
    
    const payload = {
      answers: Object.keys(answers.value).map(qId => ({ questionId: qId, answer: answers.value[qId] })),
      violations: reason === 'Normal Submission' ? 0 : 1,
      submit_reason: reason
    };

    try {
      await api.post(`/student/quizzes/${quiz.value.id}/submit`, payload);
      saveStatus.value = 'Completed';
    } catch (error) {
      console.error("Submission failed", error);
      saveStatus.value = 'Error';
    } finally {
      status.value = 'submitted';
      submissionSuccess.value = true;
    }
  }

  // --- Navigation & Save ---
  function nextQuestion() { if (currentQuestionIndex.value < totalQuestions.value - 1) currentQuestionIndex.value++; }
  function prevQuestion() { if (currentQuestionIndex.value > 0) currentQuestionIndex.value--; }
  function selectQuestion(index) { currentQuestionIndex.value = index; }

  async function saveAnswer(questionId, value) {
    answers.value[questionId] = value;
    if (!questionId || value === undefined || value === null) return;
    saveStatus.value = 'Saving...';
    try {
      await api.post(`/student/quizzes/${quiz.value.id}/save-answer`, { question_id: questionId, answer: value });
      saveStatus.value = 'Saved';
      setTimeout(() => { if (saveStatus.value === 'Saved') saveStatus.value = ''; }, 2000);
    } catch (e) { saveStatus.value = 'Error'; }
  }

  return {
    quiz, questions, answers, currentQuestionIndex,
    timeRemaining, status, isOnline, saveStatus, submissionSuccess, submissionReason,
    currentQuestion, totalQuestions, formattedTime, isLastQuestion,
    startQuiz, nextQuestion, prevQuestion, selectQuestion, saveAnswer,
    completeQuiz, stopTimers
  };
});