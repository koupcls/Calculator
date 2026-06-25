<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCipherStore } from '../stores/cipherStore'
import type { CipherType, CipherMode } from '../core/cipher/storeTypes'
import Input from '../components/ui/Input.vue'
import KeyManager from '../components/cipher/KeyManager.vue'
import AlphabetEditor from '../components/cipher/AlphabetEditor.vue'
import AddStepForm from '../components/cipher/AddStepForm.vue'
import StepCard from '../components/cipher/StepCard.vue'
import Switcher from '../components/ui/Switcher.vue'
import Section from '../components/ui/Section.vue'
import ResultSection from '../components/ui/ResultSection.vue'

const store = useCipherStore()

const initialText = ref('')
const newKeyType = ref<CipherType>('vigenere')
const newKeyMode = ref<CipherMode>('encrypt')
const selectedKeyId = ref('')

watch(initialText, async (newVal) => {
  if (store.steps.length > 0) {
    store.steps[0].input = newVal
    await store.recalculateFrom(0)
  }
})

watch(() => store.keys, (keys) => {
  if (keys.length > 0) {
    const firstValid = keys.find(k => k.value.trim())
    if (firstValid) selectedKeyId.value = firstValid.id    
    else {
      selectedKeyId.value = ''  
    }
  }
  else {
    selectedKeyId.value = ''
  }
}, { deep: true, immediate: true })

const addStep = async () => {
  if (!selectedKeyId.value) return
  
  const input = store.steps.length === 0 ? initialText.value : undefined
  const stepId = store.addStep(newKeyType.value, newKeyMode.value, selectedKeyId.value, input)
  
  selectedKeyId.value = ''
  await store.runStep(stepId)
}

const finalOutput = computed(() => 
  store.steps.length > 0 ? store.steps[store.steps.length - 1].output?.replaceAll(' ', '_') : null
)
</script>

<template>
  <div class="cipher-page">
    
    <Section title="Алфавит">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
      </template>
      <template #content>
        <AlphabetEditor v-model="store.alphabet" :default-alphabet="store.defaultAlphabet" :case-sensetive="store.caseSensitive" placeholder="Введите символ" />
      </template>
    </Section>

    <Section title="Начальный текст">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
      </template>
      <template #action>
        <Switcher 
          v-model="store.caseSensitive" 
          label="Учитывать регистр" 
          class="case-switcher"
        />
      </template>
      <template #content>
        <Input 
          v-model="initialText" 
          placeholder="Введите слово или фразу..." 
          class="main-input"
        />
      </template>
    </Section>

    <Section title="Ключи шифрования">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </template>
      <template #content>
        <KeyManager />
      </template>
    </Section>

    <Section title="Цепочка операций">
      <template #svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
      </template>
      <template #content>
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
          :model-value="selectedKeyId"
          :type="newKeyType"
          :mode="newKeyMode"
          :disabled="store.steps.length > 0 && !store.steps[store.steps.length - 1].output"
          @update:model-value="selectedKeyId = $event"
          @update:type="newKeyType = $event"
          @update:mode="newKeyMode = $event"
          @submit="addStep"
        />
      </template>
    </Section>

    <ResultSection v-if="finalOutput" title="Итоговый результат" :result="finalOutput" />
  </div>
</template>

<style scoped>
.cipher-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.main-input {
  width: 100%;
  font-size: 14px;
}

.empty-state {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-bg);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
}

.empty-icon {
  margin: 0 auto var(--spacing-md);
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

@media (max-width: 768px) {
  .cipher-page {
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
  }

  .empty-state {
    padding: var(--spacing-lg);
  }
}
</style>