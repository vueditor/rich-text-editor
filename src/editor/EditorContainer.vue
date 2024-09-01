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
import EditorHeader from './EditorHeader.vue'

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
      placeholder: ({ node }) => {
        switch (node.type.name) {
          case 'heading': {
            return `Heading ${node.attrs.level - 1}`
          }
          case 'bulletList':
          case 'orderedList':
          case 'taskList': {
            return ''
          }
        }

        return 'Write something, or "/" for commands'
      },
    }),
    symbol,
    slashMenu,
  ],
  autofocus: 'start',
})
</script>

<template>
  <div class="editor-container border border-gray-100 rounded-2 border-solid bg-white focus-visible:drop-shadow hover:drop-shadow-sm">
    <EditorHeader v-if="editor" :editor="editor" />
    <EditorContent :editor="editor" />
    <EditorHandle v-if="editor" :editor="editor" />

    <!-- fix load dynamic icon -->
    <div class="hidden">
      <div class="i-mdi:format-text" />
      <div class="i-mdi:format-heading-1" />
      <div class="i-mdi:format-heading-2" />
      <div class="i-mdi:format-heading-3" />
      <div class="i-mdi:format-list-bulleted" />
      <div class="i-mdi:format-list-numbered" />
      <div class="i-mdi:format-list-checkbox" />
    </div>
  </div>
</template>

<style lang="scss">
.editor-container {
  .tiptap {
    @apply px-16 py-4 focus-visible:!outline-none;

    .ProseMirror-selectednode {
      @apply bg-blue-100/50;
    }

    [data-placeholder]::before {
      @apply content-[attr(data-placeholder)] text-gray-300 float-left h-0 pointer-events-none;
    }

    [data-name='paragraph'] {
      @apply my-0;
    }

    ol ol {
      @apply list-roman;

      & ol {
        @apply list-alpha;
      }
    }

    [data-checked] {
      @apply flex items-center gap-1;

      &[data-checked='true'] {
        @apply line-through;
      }
    }
  }
}
</style>
