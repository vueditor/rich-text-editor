<script lang="ts" setup>
const isDark = useDark()
const toggleDark = useToggle(isDark)
function enableTransitions() {
  return 'startViewTransition' in document
    && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}
async function toToggleDark({ clientX: x, clientY: y }: MouseEvent) {
  if (!enableTransitions()) {
    toggleDark(!isDark.value)
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )}px at ${x}px ${y}px)`,
  ]
  await document.startViewTransition(async () => {
    toggleDark(!isDark.value)
    await nextTick()
  }).ready
  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
    },
  )
}
</script>

<template>
  <div class="cursor-pointer rounded p-1 transition-colors hover:bg-color-hover-soft" @click="toToggleDark">
    <Transition name="slide-up" mode="out-in">
      <div v-if="isDark" class="i-ph:moon h-1em w-1em" />
      <div v-else class="i-ph:sun h-1em w-1em" />
    </Transition>
  </div>
</template>

<style>

</style>
