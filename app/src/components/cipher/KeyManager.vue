<script setup lang="ts">
import { useCipherStore } from '../../stores/cipherStore'
import Input from '../ui/Input.vue'
import Button from '../ui/Button.vue'

const store = useCipherStore()
</script>

<template>
  <div class="keys-list">
    <div v-for="(keyItem, idx) in store.keys" :key="keyItem.id" class="key-row">
      <div class="key-index">{{ idx + 1 }}</div>
      <div class="input-wrapper">
        <Input 
          :model-value="keyItem.value"
          @update:model-value="store.updateKey(keyItem.id, $event)"
          :placeholder="`Ключ ${idx + 1}`"
        />
      </div>
      
      <Button 
        v-if="idx === store.keys.length - 1" 
        variant="secondary" 
        @click="store.addKeyInput"
        class="key-action-btn"
      >
        +
      </Button>
      <Button 
        v-if="store.keys.length > 1" 
        variant="secondary" 
        @click="store.removeKeyInput(keyItem.id)"
        class="key-action-btn remove-btn"
      >
        &times;
      </Button>
    </div>
  </div>
</template>

<style scoped>
.keys-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.key-row {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.key-index {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--color-text-muted);
  width: 20px;
  text-align: center;
}

.input-wrapper {
  flex: 1;
  border-radius: var(--radius-sm);
  transition: border-color var(--transition);
}

.input-wrapper.has-blank-error :deep(input) {
  border-color: var(--color-error) !important;
  box-shadow: 0 0 0 1px var(--color-error);
}

.key-action-btn {
  height: 38px;
  width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  padding: 0;
  flex-shrink: 0;
}

.remove-btn {
  color: var(--color-text-muted);
}
.remove-btn:hover {
  color: var(--color-error);
  border-color: var(--color-error);
}
</style>
