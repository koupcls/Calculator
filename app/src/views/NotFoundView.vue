<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '../components/ui/Button.vue'

const router = useRouter()

const goHome = () => {
  router.push('/trees')
}
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">Страница не найдена</h1>
      <p class="error-description">
        Извините, запрашиваемая страница не существует или была перемещена.
      </p>
      
      <Button 
        variant="primary" 
        size="lg" 
        class="home-button" 
        @click="goHome"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Вернуться на главную
      </Button>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--spacing-md);
  background: var(--color-bg);
}

.not-found-content {
  text-align: center;
  max-width: 500px;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  line-height: 1;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  opacity: 0.3;
  letter-spacing: -5px;
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-md) 0;
}

.error-description {
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--spacing-xl) 0;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-description {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 60px;
  }

  .error-title {
    font-size: 20px;
  }
}
</style>
