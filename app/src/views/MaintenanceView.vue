<template>
  <div class="maintenance-page">
    <div class="maintenance-card">
      <svg class="maintenance-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
      
      <h1 class="maintenance-title">В разработке</h1>
      <p class="maintenance-text">
        Этот раздел находится в активной разработке.<br>
        Пожалуйста, вернитесь позже.
      </p>
      
      <div class="maintenance-progress">
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <span class="progress-label">Скоро будет доступно</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.maintenance-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-lg);
  background: var(--color-bg);
}

.maintenance-card {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  max-width: 480px;
  width: 100%;
}

.maintenance-icon {
  margin: 0 auto var(--spacing-lg);
  color: var(--color-primary);
  opacity: 0.8;
}

.maintenance-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm) 0;
}

.maintenance-text {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--spacing-lg) 0;
}

.maintenance-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill {
  width: 60%;
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  animation: pulse 2s ease-in-out infinite;
}

.progress-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@media (max-width: 480px) {
  .maintenance-card {
    padding: var(--spacing-lg);
  }
  
  .maintenance-title {
    font-size: 20px;
  }
  
  .maintenance-icon {
    width: 48px;
    height: 48px;
  }
}
</style>