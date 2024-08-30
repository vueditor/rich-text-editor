<script lang="ts" setup>
import { Editor } from '@tiptap/vue-3'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { handlePlugin, handlePluginKey } from './handlePlugin'

const props = defineProps({
  editor: Editor,
})

const handleRef = ref<HTMLDivElement>()
onMounted(() => {
  props.editor?.registerPlugin(handlePlugin({
    element: handleRef.value!,
  }))
})
onBeforeUnmount(() => {
  props.editor?.unregisterPlugin(handlePluginKey)
})
</script>

<template>
  <div id="editor-handle" ref="handleRef" class="fixed transition-top transition-duration-300">
    <div class="cursor-pointer rounded-1 p-1 text-base transition-colors hover:(bg-slate-100 ring-1 ring-gray-200)" draggable="true">
      <div class="i-icon-park-outline:drag h-1em w-1em" />
    </div>
  </div>
</template>
