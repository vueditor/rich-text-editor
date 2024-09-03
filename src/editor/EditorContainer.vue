<script lang="ts" setup>
import { EditorContent, useEditor } from '@tiptap/vue-3'
import starterKit from '@tiptap/starter-kit'
import taskList from '@tiptap/extension-task-list'
import taskItem from '@tiptap/extension-task-item'
import underline from '@tiptap/extension-underline'
import placeholder from '@tiptap/extension-placeholder'
import characterCount from '@tiptap/extension-character-count'

// custom extensions
import { document } from './extensions/document'
import { title } from './extensions/title'
import { heading } from './extensions/heading'
import { superscript } from './extensions/superscript'
import { subscript } from './extensions/subscript'
import { symbol } from './extensions/symbol'
import { slashMenu } from './extensions/slashMenu'

import content from './templates/intro.json'

const editor = useEditor({
  content,
  extensions: [
    starterKit.configure({
      document: false,
      heading: false,
    }),
    taskList,
    taskItem,
    underline,
    superscript,
    subscript,
    placeholder.configure({
      placeholder: ({ node }) => {
        switch (node.type.name) {
          case 'heading': {
            return `Heading ${node.attrs.level}`
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
    characterCount,
    document,
    title,
    heading,
    symbol,
    slashMenu,
  ],
  autofocus: 'start',
})
</script>

<template>
  <div class="editor-container overflow-hidden border rounded-2 border-solid border-color-base bg-color-strong focus-visible:drop-shadow hover:drop-shadow-sm">
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
@import url('@/styles/editor.scss');
</style>
