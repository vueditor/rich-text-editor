<script lang="ts" setup>
import type { Editor } from '@tiptap/core'
import EditorNodeSelect from './EditorNodeSelect.vue'

defineProps<{
  editor: Editor
}>()
</script>

<template>
  <header class="bg-slate-100 px-16 py-2">
    <EditorNodeSelect :editor="editor" />
  </header>
</template>

<style>

</style>
