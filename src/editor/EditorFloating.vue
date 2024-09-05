<script lang="ts" setup>
import type { Placement, Strategy } from '@floating-ui/vue'
import { autoUpdate, flip, offset as offsetMiddleware, useFloating } from '@floating-ui/vue'

const props = withDefaults(defineProps<{
  placement?: Placement
  strategy?: Strategy
  offset?: number
  disabled?: boolean
}>(), {
  placement: 'top-end',
  strategy: 'fixed',
  offset: 4,
  disabled: false,
})
const emit = defineEmits(['open', 'close'])

const { placement, strategy, offset, disabled } = toRefs(props)

const referenceRef = ref<HTMLDivElement>()
const floatingRef = ref<HTMLDivElement>()
const { floatingStyles } = useFloating(referenceRef, floatingRef, {
  placement: placement.value,
  strategy: strategy.value,
  middleware: [flip(), offsetMiddleware(offset.value)],
  whileElementsMounted: autoUpdate,
})

const zIndex = ref(100)
const { nextZIndex } = useZIndex()

const visible = ref(false)
const visibleDebounced = refDebounced(visible, 300)
function open() {
  if (disabled.value) {
    return
  }

  zIndex.value = nextZIndex()
  visible.value = true
  emit('open')
}
function close() {
  visible.value = false
  emit('close')
}
watch(disabled, (disabled) => {
  if (disabled) {
    close()
  }
})

const isReferenceHover = useElementHover(referenceRef)
const isFloatingRefHover = useElementHover(floatingRef)
const isHover = computed(() => isReferenceHover.value || isFloatingRefHover.value)
watch(isHover, (isHover) => {
  if (isHover) {
    open()
  }
  else {
    close()
  }
}, {
  immediate: true,
})

onClickOutside(referenceRef, () => {
  close()
}, {
  ignore: [floatingRef],
})

defineExpose({
  open,
  close,
  visible,
})
</script>

<template>
  <div ref="referenceRef" class="inline-block" :class="{ 'cursor-not-allowed': disabled }">
    <slot />
    <Teleport to="body">
      <Transition name="fade">
        <div v-show="visibleDebounced" ref="floatingRef" class="border rounded-2 border-solid px-2 py-1 shadow-md transition-transform border-color-base bg-color-strong" :style="{ ...floatingStyles, zIndex }">
          <slot name="floating" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
