<script lang="ts" setup>
import type { Editor, Range } from '@tiptap/vue-3'
import type { SlashMenuItem } from './extensions/slashMenu'
import { slashMenuItems } from './extensions/slashMenu'
import Floating from '@/components/Floating.vue'

const props = defineProps<{
  editor: Editor
}>()
const { editor } = toRefs(props)

const disabled = computed(() => !editor.value.view.editable)

const findItemByLabel = (label: string) => slashMenuItems.find(item => item.label === label)
const activatedItem = computed(() => {
  if (editor.value.isActive('heading', { level: 2 })) {
    return findItemByLabel('Heading 1')
  }
  if (editor.value.isActive('heading', { level: 3 })) {
    return findItemByLabel('Heading 2')
  }
  if (editor.value.isActive('heading', { level: 4 })) {
    return findItemByLabel('Heading 3')
  }
  if (editor.value.isActive('bulletList')) {
    return findItemByLabel('Bulleted list')
  }
  if (editor.value.isActive('orderedList')) {
    return findItemByLabel('Numbered list')
  }
  if (editor.value.isActive('taskList')) {
    return findItemByLabel('To-do list')
  }

  return findItemByLabel('Text')
})

const floatingRef = ref<InstanceType<typeof Floating>>()
function onClickItem(item: SlashMenuItem) {
  const selection = editor.value.view.state.selection
  const range: Range = {
    from: selection.to,
    to: selection.to,
  }
  item.command(editor.value, range)
  floatingRef.value?.close()
}
</script>

<template>
  <Floating ref="floatingRef" mode="click" placement="bottom-start" :disabled="disabled">
    <div class="flex cursor-pointer items-center gap-1 rounded-2 px-2 py-1 text-sm font-600 transition-colors hover:bg-color-hover-soft text-color-primary" :class="{ 'cursor-not-allowed !bg-transparent': disabled }" :title="activatedItem?.desc">
      <span> {{ activatedItem?.label }}</span>
      <div class="text-xl transition-transform transition-duration-300" :class="{ 'rotate-x-180': !!floatingRef?.visible }">
        <div class="i-iconamoon:arrow-down-2 h-1em w-1em" />
      </div>
    </div>
    <template #floating>
      <ul class="my-0 list-none p-0">
        <li
          v-for="item in slashMenuItems" :key="item.label" class="flex cursor-pointer items-center gap-1 rounded-2 px-2 py-1 transition-colors hover:bg-color-hover-strong"
          :class="{ 'text-color-primary': item.label === activatedItem?.label }"
          :title="item.desc"
          @click="onClickItem(item)"
        >
          <div class="rounded p-1 text-xs shadow">
            <div :class="item.icon" />
          </div>
          <span> {{ item.label }}</span>
        </li>
      </ul>
    </template>
  </Floating>
</template>
