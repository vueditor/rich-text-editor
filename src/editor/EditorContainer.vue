<script lang="ts" setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import starterKit from '@tiptap/starter-kit'
import taskList from '@tiptap/extension-task-list'
import taskItem from '@tiptap/extension-task-item'
import placeholder from '@tiptap/extension-placeholder'

// custom extensions
import { symbol } from './extensions/symbol'
import { EditorHandle } from './extensions/handle'
import { slashMenu } from './extensions/slashMenu'

const editor = useEditor({
  extensions: [
    starterKit.configure({
      heading: {
        levels: [1, 2, 3, 4],
      },
    }),
    taskList,
    taskItem,
    placeholder.configure({
      placeholder: 'Write something, or "/" for commands',
    }),
    symbol,
    slashMenu,
  ],
  autofocus: 'start',
})
</script>

<template>
  <div class="editor-container">
    <EditorContent :editor="editor" />
    <EditorHandle v-if="editor" :editor="editor" />
  </div>
</template>

<style lang="scss">
.editor-container {
  .tiptap {
    @apply bg-white px-12 py-4 focus-visible:outline-none border border-solid border-gray-100 rounded-2 hover:drop-shadow-sm focus-visible:!drop-shadow;

    p.is-empty::before {
      @apply content-[attr(data-placeholder)] text-gray-300 float-left h-0 pointer-events-none;
    }

    [data-name="paragraph"] {
      @apply  my-0;
    }
  }
}
</style>
