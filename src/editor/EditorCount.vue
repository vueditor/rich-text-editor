<script lang="ts" setup>
import type { Editor } from '@tiptap/core'
import gsap from 'gsap'

const props = defineProps<{
  editor: Editor
}>()

let count = 0
const countRef = ref<HTMLDivElement>()
function updateCount() {
  setTimeout(() => {
    count = props.editor?.storage.characterCount.characters()

    gsap.to(countRef.value!, {
      duration: 1,
      innerHTML: count,
      roundProps: 'innerHTML',
      ease: 'power2.out',
    })
  })
}
const updateCountDebounce = useDebounceFn(updateCount, 1000)
props.editor?.on('update', updateCountDebounce)
onBeforeUnmount(() => {
  props.editor?.off('update', updateCountDebounce)
})
</script>

<template>
  <div class="flex items-center gap-1 text-sm" title="Characters count">
    <div class="text-base">
      <div class="i-mdi:fountain-pen-tip h-1em w-1em" />
    </div>
    <span ref="countRef">
      {{ count }}
    </span>
  </div>
</template>

<style>

</style>
