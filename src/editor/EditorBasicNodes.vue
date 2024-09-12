<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()
const { editor } = toRefs(props)

const nodes = [
  {
    label: 'Link',
    icon: 'i-mdi:link',
    isActivated: () => editor.value.isActive('link'),
    toggle: () => editor.value.chain().focus().setLink().run(),
  },
]
</script>

<template>
  <div class="flex items-center gap-1">
    <div
      v-for="item in nodes"
      :key="item.label"
      class="cursor-pointer rounded p-1 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700"
      :class="{ 'bg-blue-600 text-white': item.isActivated() }"
      :title="item.label"
      @click="item.toggle"
    >
      <div class="h-1em w-1em" :class="item.icon" />
    </div>
  </div>
</template>

<style>

</style>
