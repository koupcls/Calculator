<script setup lang="ts">
import CopyButton from '../ui/CopyButton.vue'

defineProps<{
  codedLine: string
}>()
</script>

<template>
  <div class="section">
    <div class="section-header">
      <div class="section-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="10" y1="6" x2="16" y2="6" />
          <line x1="10" y1="10" x2="16" y2="10" />
          <line x1="10" y1="14" x2="16" y2="14" />
        </svg>
        <span>Закодированная строка</span>
      </div>
      <CopyButton v-if="codedLine" :text="codedLine" />
    </div>
    
    <div class="code-container">
      <code v-if="codedLine" class="coded-line">
        {{ codedLine }}
      </code>
      <span v-else class="empty-text">
        Нет данных для отображения
      </span>
    </div>
  </div>
</template>

<style scoped>
.section {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.section-title svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

.code-container {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  max-height: 160px;
  overflow-y: auto;
  word-break: break-all;
}

.coded-line {
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.empty-text {
  font-size: 14px;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .section {
    padding: var(--spacing-sm);
  }

  .section-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
  }

  .code-container {
    padding: var(--spacing-sm);
    max-height: 120px;
  }

  .coded-line {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 14px;
  }
}
</style>