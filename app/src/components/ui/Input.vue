<script setup lang="ts">
defineProps<{ modelValue: string; placeholder?: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
<template>
  <input class="base-input" :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :placeholder="placeholder" />
</template>
<style scoped>
.base-input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 15px; transition: border-color 0.2s; }
.base-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
</style>