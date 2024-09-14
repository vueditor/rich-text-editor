<script lang="ts" setup>
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps<NodeViewProps>()
const { extension, node } = toRefs(props)

const languageClass = `${extension.value.options?.languageClassPrefix}${node.value.attrs.language}`
</script>

<template>
  <NodeViewWrapper as="pre" class="rounded p-2 focus-visible:!outline-none">
    <NodeViewContent as="code" :class="languageClass" class="font-mono" />
  </NodeViewWrapper>
</template>

<style>

</style>
