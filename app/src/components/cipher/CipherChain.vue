<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCipherStore } from '../../stores/cipherStore'
import type { CipherType, CipherMode } from '../../core/cipher/storeTypes'
import Input from '../ui/Input.vue'
import AlphabetEditor from './AlphabetEditor.vue'
import AddStepForm from './AddStepForm.vue'
import StepCard from './StepCard.vue'
import Switcher from '../ui/Switcher.vue'

const store = useCipherStore()

const initialText = ref('')
const newKeyType = ref<CipherType>('vigenere')
const newKeyMode = ref<CipherMode>('encrypt')
const newKey = ref('')

watch(initialText, async (newVal) => {
  if (store.steps.length > 0) {
    store.steps[0].input = newVal
    await store.recalculateFrom(0)
  }
})

const addStep = async () => {
  if (!newKey.value.trim()) return
  
  const input = store.steps.length === 0 ? initialText.value : undefined
  const stepId = store.addStep(newKeyType.value, newKeyMode.value, newKey.value, input)
  
  newKey.value = ''
  await store.runStep(stepId)
}

const finalOutput = computed(() => 
  store.steps.length > 0 ? store.steps[store.steps.length - 1].output : null
)
</script>

<template>
  <div class="cipher-page">
    <!-- Алфавит -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
          <span>Алфавит</span>
        </div>
        <Switcher
                v-model="store.caseSensitive"
                icon="Aa"
                label="Учитывать регистр"
              />
      </div>
      <AlphabetEditor v-model="store.alphabet" :default-alphabet="store.defaultAlphabet" :case-sensetive="store.caseSensitive" placeholder="Введите символ" />
    </div>

    <!-- Начальный текст -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
          <span>Начальный текст</span>
        </div>
      </div>
      <Input 
        v-model="initialText" 
        placeholder="Введите слово или фразу..." 
        class="main-input"
      />
    </div>

    <!-- Цепочка операций -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          <span>Цепочка операций</span>
        </div>
      </div>
      
      <div v-if="store.steps.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>
        <p>Добавьте первый шаг шифрования или расшифровки</p>
      </div>

      <div class="steps-list">
        <StepCard
          v-for="(step, idx) in store.steps"
          :key="step.id"
          :step="step"
          :index="idx"
          @remove="store.removeStep(step.id)"
        />
      </div>

      <AddStepForm
        :model-value="newKey"
        :type="newKeyType"
        :mode="newKeyMode"
        :disabled="store.steps.length > 0 && !store.steps[store.steps.length - 1].output"
        @update:model-value="newKey = $event"
        @update:type="newKeyType = $event"
        @update:mode="newKeyMode = $event"
        @submit="addStep"
      />
    </div>

    <div v-if="finalOutput" class="section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Итоговый результат</span>
        </div>
      </div>
      <code class="mono result">{{ finalOutput }}</code>
    </div>
  </div>
</template>

<style scoped>
.cipher-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

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

.main-input {
  width: 100%;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
  background: var(--color-bg);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.empty-icon {
  margin: 0 auto var(--spacing-md);
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.result {
  display: block;
  padding: var(--spacing-md);
  background: color-mix(in srgb, var(--color-success) 10%, var(--color-bg-secondary));
  border: 1px solid var(--color-success);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  word-break: break-all;
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .cipher-page {
    padding: var(--spacing-sm);
    gap: var(--spacing-md);
  }

  .section {
    padding: var(--spacing-sm);
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .empty-state {
    padding: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 14px;
  }
  
  .main-input {
    font-size: 13px;
  }
}
</style>