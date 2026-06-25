<script setup lang="ts">
import Button from '../components/ui/Button.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="page home-page">
    
    <header class="hero">
      <h1 class="hero-title">Инструменты Сжатия и Шифрования</h1>
      <p class="hero-subtitle">
        Интерактивный калькулятор и визуализатор для работы с алгоритмами сжатия, шифрования и кодирования в рамках теории информации.
      </p>
      
      <a href="https://github.com/koupcls/Calculator" target="_blank" rel="noopener noreferrer" class="github-link">
        <Button class="btn-github">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          <span>GitHub Репозиторий</span>
        </Button>
      </a>
    </header>

    <main class="navigation-grid">
      <h2 class="nav-title">Выберите раздел:</h2>
      
      <div class="chips-container">
        <Button @click="goTo('/trees')" class="chip-btn">
          <span>Хаффман и Шеннон</span>
        </Button>
        
        <Button @click="goTo('/cipher')" class="chip-btn">
          <span>Шифрование</span>
        </Button>
        
        <Button @click="goTo('/compression')" class="chip-btn">
          <span>Алгоритмы сжатия</span>
        </Button>
      </div>
    </main>

  </div>
</template>

<style scoped>
.home-page {
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px); /* Чтобы контент центрировался по вертикали */
  text-align: center;
}

/* Стилизация Hero */
.hero {
  max-width: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
  letter-spacing: -0.025em;
  margin: 0;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.github-link {
  text-decoration: none;
  margin-top: var(--spacing-xs);
}

.btn-github {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  /* Если у твоей кнопки дефолтный фон яркий, можно сделать её более нейтральной */
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-github:hover {
  background: var(--color-border);
}

/* Секция с кнопками переходов */
.navigation-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}

.nav-title {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  font-weight: 600;
  margin: 0;
}

/* Контейнер для чипсов */
.chips-container {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: center;
}

/* Превращаем Button в "Чипсы" */
.chip-btn {
  border-radius: 100px; /* Делаем их овальными как классические чипсы */
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  /* Эффект легких "чипсов" на чистом фоне сайта */
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.chip-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff; /* Или цвет текста для основного экшена */
  transform: translateY(-1px);
}

/* Адаптив под мобилки */
@media (max-width: 640px) {
  .hero-title {
    font-size: 1.75rem;
  }
  
  .hero-subtitle {
    font-size: 14px;
  }
  
  .chips-container {
    flex-direction: column;
    width: 100%;
    max-width: 280px; /* На мобилке кнопки выстроятся в аккуратный стек */
  }
  
  .chip-btn {
    width: 100%;
  }
}
</style>