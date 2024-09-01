<script lang="ts" setup>
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()
const { editor } = toRefs(props)

const isEditable = ref(!!editor.value.isEditable)
const text = computed(() => isEditable.value ? 'Enabled' : 'Disabled')
function toggleEditorStatus() {
  editor.value.setEditable(!isEditable.value)
  isEditable.value = !isEditable.value
}
</script>

<template>
  <div class="cursor-pointer rounded-2 px-2 py-1 text-sm font-600 transition-colors hover:bg-color-hover-soft" @click="toggleEditorStatus">
    {{ text }}
  </div>
</template>

<style>

</style>
