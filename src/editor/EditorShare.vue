<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'
import type { HashRecord } from './extensions/hashRecord'

const props = defineProps<{
  editor: Editor
}>()

const { copy, copied } = useClipboard()

function handleCopy() {
  const doc = props.editor.getJSON()

  const record: HashRecord = {
    doc,
  }

  const hash = `#${zipStr(JSON.stringify(record))}`
  copy(`${location.origin}/${hash}`)
}
</script>

<template>
  <div class="cursor-pointer rounded p-1 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700" title="Toggle theme" @click="handleCopy">
    <Transition name="slide-up" mode="out-in">
      <div v-if="copied" class="i-mdi:success-circle h-1em w-1em bg-green-500" />
      <div v-else class="i-mdi:share-outline h-1em w-1em" />
    </Transition>
  </div>
</template>

<style>

</style>
