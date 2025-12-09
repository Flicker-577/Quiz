<template>
  <div class="app-loader" v-if="loading">
    <div class="loader-container">
      <!-- Animated SVG Logo - New Style -->
      <svg class="loader-logo" width="320" height="120" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="50%" stop-color="#8b5cf6" />
            <stop offset="100%" stop-color="#3b82f6" />
          </linearGradient>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#60a5fa" />
            <stop offset="100%" stop-color="#a78bfa" />
          </linearGradient>
        </defs>
        
        <!-- Background Circuit Lines -->
        <path d="M20,20 L80,20 L80,40 L120,40" stroke="rgba(59, 130, 246, 0.2)" stroke-width="1" fill="none" class="circuit-line" />
        <path d="M280,60 L240,60 L240,80 L200,80" stroke="rgba(139, 92, 246, 0.2)" stroke-width="1" fill="none" class="circuit-line" />
        
        <!-- Main Terminal Container -->
        <rect x="60" y="30" width="200" height="60" rx="8" fill="#0f172a" stroke="url(#glowGradient)" stroke-width="2" class="terminal-box" />
        
        <!-- Terminal Header -->
        <rect x="60" y="30" width="200" height="20" rx="8" fill="#1e293b" />
        <circle cx="75" cy="40" r="3" fill="#ef4444" />
        <circle cx="85" cy="40" r="3" fill="#f59e0b" />
        <circle cx="95" cy="40" r="3" fill="#10b981" />
        
        <!-- Terminal Content -->
        <g class="terminal-content">
          <!-- Command Line -->
          <text x="70" y="55" font-family="'Courier New', monospace" font-size="10" fill="#93c5fd">
            <tspan x="70" y="55">$ </tspan>
            <tspan fill="#60a5fa">loading QuizMasterPro...</tspan>
          </text>
          
          <!-- Progress Indicator -->
          <text x="70" y="70" font-family="'Courier New', monospace" font-size="10" fill="#93c5fd">
            <tspan x="70" y="70">[</tspan>
            <tspan class="progress-dots">●●●</tspan>
            <tspan x="115" y="70">]</tspan>
          </text>
          
          <!-- Status Text -->
          <text x="70" y="85" font-family="'Courier New', monospace" font-size="10" fill="#10b981" class="status-text">
            Initializing systems...
          </text>
        </g>
        
        <!-- Floating Code Elements -->
        <text x="30" y="105" font-family="'Courier New', monospace" font-size="8" fill="#6b7280" class="floating-code">
          &lt;div&gt;
        </text>
        <text x="270" y="25" font-family="'Courier New', monospace" font-size="8" fill="#6b7280" class="floating-code">
          &lt;/script&gt;
        </text>
      </svg>

      <!-- Enhanced Loading Bar -->
      <div class="loading-bar">
        <div class="loading-progress"></div>
      </div>

      <p class="loading-text">Preparing your experience...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLoader',
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    // Simulate loading process
    setTimeout(() => {
      this.$emit('loaded');
    }, 3000);
  }
}
</script>

<style scoped>
.app-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-warning);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-container {
  text-align: center;
  animation: fadeIn 0.8s ease-in-out;
}

.loader-logo {
  animation: float 4s ease-in-out infinite;
}

/* Terminal box glow animation */
.terminal-box {
  animation: terminalGlow 2s ease-in-out infinite alternate;
}

/* Circuit lines animation */
.circuit-line {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawCircuit 3s ease-in-out infinite;
}

/* Progress dots animation */
.progress-dots {
  animation: pulseDots 1.5s ease-in-out infinite;
}

/* Status text animation */
.status-text {
  opacity: 0;
  animation: statusFade 2s ease-in-out infinite;
}

/* Floating code elements */
.floating-code {
  opacity: 0;
  animation: floatCode 4s ease-in-out infinite;
}

.floating-code:nth-child(6) {
  animation-delay: 1s;
}

/* Enhanced loading bar */
.loading-bar {
  width: 250px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 25px auto;
  overflow: hidden;
  position: relative;
}

.loading-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 2s ease-in-out infinite;
}

.loading-progress {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6);
  background-size: 200% 100%;
  border-radius: 3px;
  animation: loadingProgress 2.5s ease-in-out, gradientShift 2s ease-in-out infinite;
}

.loading-text {
  color: #cbd5e1;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  margin-top: 15px;
  opacity: 0.8;
  letter-spacing: 1px;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-8px) rotate(0.5deg); }
  66% { transform: translateY(4px) rotate(-0.5deg); }
}

@keyframes terminalGlow {
  0% { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5)); }
  100% { filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.8)); }
}

@keyframes drawCircuit {
  0% { stroke-dashoffset: 100; opacity: 0; }
  50% { opacity: 0.6; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}

@keyframes pulseDots {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes statusFade {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

@keyframes floatCode {
  0%, 100% { opacity: 0; transform: translateY(0px); }
  50% { opacity: 0.7; transform: translateY(-10px); }
}

@keyframes loadingProgress {
  0% { width: 0%; }
  100% { width: 100%; }
}

@keyframes gradientShift {
  0% { background-position: 200% 0%; }
  100% { background-position: -200% 0%; }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
</style>