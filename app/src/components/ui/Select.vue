<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
<template>
  <select class="base-select" :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
    <slot />
  </select>
</template>
<style scoped>
.base-select { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 15px; background: #fff; cursor: pointer; }
</style>