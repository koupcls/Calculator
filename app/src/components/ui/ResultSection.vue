<script setup lang="ts">
import CopyButton from '../ui/CopyButton.vue'
import Section from './Section.vue';

defineProps<{
  result: string
  title: string
}>()
</script>

<template>
    <Section :title="title">
        <template #svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="10" y1="6" x2="16" y2="6" />
            <line x1="10" y1="10" x2="16" y2="10" />
            <line x1="10" y1="14" x2="16" y2="14" />
            </svg>
        </template>

        <template #action>
            <CopyButton v-if="result" :text="result" />
        </template>

        <template #content>
            <div class="result-container">
                <code v-if="result" class="result">
                    {{ result }}
                </code>
                <span v-else class="empty-text">
                    Нет данных для отображения
                </span>
            </div>
        </template>

    </Section>
</template>

<style scoped>
.result-container {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  max-height: 160px;
  overflow-y: auto;
  word-break: break-all;
}

.result {
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

</style>