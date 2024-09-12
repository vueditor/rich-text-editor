<script lang="ts" setup>
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper } from '@tiptap/vue-3'
import { test } from 'linkifyjs'

const props = defineProps<NodeViewProps>()
const { editor, node } = toRefs(props)

function replaceImage() {
  const src = window.prompt(`Input image url to replace: ${node.value.attrs.src}`, '')
  if (src === null) {
    return
  }

  if (!test(src, 'url')) {
    alert('Invalid image src.')
  }

  props.updateAttributes({
    src,
  })
}
</script>

<template>
  <NodeViewWrapper>
    <EditorFloating mode="hover" :disabled="!editor.isEditable">
      <img :src="node.attrs.src" class="object-scale-down">
      <template #floating>
        <div
          class="h-8 flex items-center gap-1"
        >
          <a class="inline-block max-w-80 cursor-pointer truncate rounded-1.5 px-2 py-0.5 text-sm text-blue-600 transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700" :href="node.attrs.src" target="_blank">{{ node.attrs.src }}</a>
          <div title="Replace" class="cursor-pointer rounded-2 p-1 text-base transition-colors hover:bg-zinc-300 dark:hover:bg-zinc-700" @click="replaceImage">
            <div class="i-material-symbols:replace-image-outline h-1em w-1em" />
          </div>
        </div>
      </template>
    </EditorFloating>
  </NodeViewWrapper>
</template>

<style>

</style>
