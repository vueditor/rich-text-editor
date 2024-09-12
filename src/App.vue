<script setup lang="ts">
import Editor from '@/editor/EditorContainer.vue'
</script>

<template>
  <div class="h-full bg-gray-100 dark:bg-gray-900">
    <main class="h-full">
      <Editor />
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
