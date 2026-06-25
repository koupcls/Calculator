<script setup lang="ts">

defineProps<{
  title: string
}>()

</script>


<template>
    <div class="section">
      <div class="section-header">
        <div class="section-title">
            <slot name="svg">
                <!-- SVG картинка -->
            </slot>
          <span>{{title}}</span>
        </div>
        <slot name="action">
            <!-- Например Switcher -->
        </slot>
      </div>
      <slot name="content">
        <!-- Содержимое секции -->
      </slot>
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

.section-title :deep(svg) {
  color: var(--color-primary);
  flex-shrink: 0;
}


@media (max-width: 768px) {
  .section {
    padding: var(--spacing-sm);
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 14px;
  }
}
</style>