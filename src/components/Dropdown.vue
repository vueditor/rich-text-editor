<script lang="ts" setup>
import Floating from '@/components/Floating.vue'

export interface DropdownOption {
  label: string
  icon?: string
  command: () => void
}

defineProps<{
  options: DropdownOption[]
}>()

const floating = ref<InstanceType<typeof Floating>>()
function onCommand(command: DropdownOption['command']) {
  command()
  floating.value?.close()
}
</script>

<template>
  <Floating ref="floating" mode="click" placement="bottom-start">
    <slot />
    <template #floating>
      <ul class="my-0 list-none pl-0">
        <li
          v-for="item in options"
          :key="item.label"
          class="flex cursor-pointer items-center gap-1 rounded-2 px-2 py-1 transition-colors hover:bg-zinc-300"
          @click="onCommand(item.command)"
        >
          <div>
            <div :class="item.icon" />
          </div>
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </template>
  </Floating>
</template>
