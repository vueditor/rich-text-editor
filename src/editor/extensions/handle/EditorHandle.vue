<script lang="ts" setup>
import { Editor } from '@tiptap/vue-3'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { handlePlugin, handlePluginKey } from './handlePlugin'
import { NODE_GROUP } from '@/editor/utils/constants'

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

function triggerSlashMenu(e: MouseEvent) {
  const { view } = props.editor!

  const posInfo = view.posAtCoords({
    left: e.clientX + 64,
    top: e.clientY,
  })
  if (!posInfo) {
    return
  }

  const { doc } = view.state
  const resolvedPos = doc.resolve(posInfo.pos)
  const pos = resolvedPos.before(1)
  const node = doc.nodeAt(pos)

  if (!node) {
    return
  }

  if (node.textContent) {
    props.editor!.chain().setNodeSelection(pos).createParagraphNear().insertContent('/').focus().run()
    return
  }

  if (node.type.spec.group?.includes(NODE_GROUP.LIST)) {
    props.editor!.chain().focus(pos + 3).insertContent('/').run()
    return
  }

  props.editor!.chain().focus(pos).insertContent('/').run()
}
</script>

<template>
  <Teleport to="body">
    <div id="editor-handle" ref="handleRef" class="fixed left-0 top-0 flex items-center transition-transform transition-duration-300 ease-in-out -translate-y-32">
      <div class="cursor-pointer rounded-1 p-1 text-base transition-colors hover:bg-color-hover-strong" @click="triggerSlashMenu">
        <div class="i-ic:round-plus h-1em w-1em" />
      </div>
      <div class="cursor-pointer rounded-1 p-1 text-base transition-colors hover:hover:bg-color-hover-strong" draggable="true">
        <div class="i-icon-park-outline:drag h-1em w-1em" />
      </div>
    </div>
  </Teleport>
</template>
