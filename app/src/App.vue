<script setup lang="ts">
import Header from './components/layout/Header.vue';
import MobileNav from './components/layout/MobileNav.vue';
</script>

<template>
  <div class="app-wrapper">
    <Header />
    
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade-pure" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <MobileNav /> 
  </div>
</template>

<style>
.fade-pure-enter-from,
.fade-pure-leave-to {
  opacity: 0;
}
.fade-pure-enter-active {
  transition: opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-pure-leave-active {
  transition: opacity 0.15s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>