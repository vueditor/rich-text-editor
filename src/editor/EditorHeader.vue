<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import { destr } from 'destr'
import type { DropdownOption } from '../components/Dropdown.vue'
import { downloadHTML } from '../utils/download'

const props = defineProps<{
  editor: Editor
}>()
const { editor } = toRefs(props)

function importContent() {
  uploadFile('.json,.txt,.html', (content, file) => {
    if (file.type.includes('json')) {
      editor.value.chain().setContent(destr(content)).focus('end').run()
    }
    else {
      editor.value.chain().setContent(content).focus('end').run()
    }
  })
}

const downloadOptions: DropdownOption[] = [
  {
    label: 'Export JSON',
    icon: 'i-bi:filetype-json w-1em h-1em',
    command: () => {
      const json = editor.value.getJSON()
      downloadJSON('editor-json-content', json)
    },
  },
  {
    label: 'Export HTML',
    icon: 'i-akar-icons:html-fill w-1em h-1em w-1em h-1em w-1em h-1em',
    command: () => {
      const html = editor.value.getHTML()
      downloadHTML('editor-html-content', html)
    },
  },
  {
    label: 'Export TXT',
    icon: 'i-bxs:file-txt w-1em h-1em w-1em h-1em',
    command: () => {
      const text = editor.value.getText()
      downloadTXT('editor-text-content', text)
    },
  },
]
</script>

<template>
  <header class="flex items-center justify-between px-14 py-2 bg-color-soft text-color-base">
    <div class="flex">
      <EditorNodeSelect :editor="editor" />
      <div class="mx-2 divider-y h-6 bg-zinc-300 dark:bg-zinc-500" />
      <EditorBasicMarks :editor="editor" />
      <div class="mx-2 divider-y h-6 bg-zinc-300 dark:bg-zinc-500" />
      <EditorBasicNodes :editor="editor" />
    </div>
    <div class="flex items-center">
      <EditorCount v-if="editor" :editor="editor" />
      <div class="mx-2 divider-y h-6 bg-zinc-300 dark:bg-zinc-500" />
      <EditorToggle :editor="editor" />
      <div class="mx-2 divider-y h-6 bg-zinc-300 dark:bg-zinc-500" />
      <div class="cursor-pointer rounded p-1 transition-colors hover:bg-color-hover-soft" title="Upload" @click="importContent">
        <div class="i-ic:round-upload h-1em w-1em" />
      </div>
      <Dropdown :options="downloadOptions">
        <div class="cursor-pointer rounded p-1 transition-colors hover:bg-color-hover-soft" title="Download">
          <div class="i-ic:round-download h-1em w-1em" />
        </div>
      </Dropdown>
      <div class="mx-2 divider-y h-6 bg-zinc-300 dark:bg-zinc-500" />
      <EditorTheme />
      <div class="mx-2 divider-y h-6 bg-zinc-300 dark:bg-zinc-500" />
      <EditorShare :editor="editor" />
      <a href="https://github.com/vueditor/rich-text-editor.git" target="_blank">
        <div class="cursor-pointer rounded p-1 transition-colors hover:bg-color-hover-soft text-color-base" title="Github">
          <div class="i-mdi:github h-1em w-1em" />
        </div>
      </a>
    </div>
  </header>
</template>

<style>

</style>
