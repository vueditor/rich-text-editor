<script setup lang="ts">
import Editor from '@/editor/EditorContainer.vue'
</script>

<template>
  <div class="h-full bg-slate-50">
    <main class="h-full p-12">
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
</style>
