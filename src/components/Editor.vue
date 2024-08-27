<script lang="ts" setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const editor = useEditor({
  extensions: [StarterKit],
})
</script>

<template>
  <div>
    <EditorContent :editor="editor" />
  </div>
</template>

<style>

</style>
