<template>
  <svg width="1em" height="1em" viewBox="0 0 256 256" :class="[direction]">
    <path
      d="M224 128a8 8 0 0 1-8 8H59.314l58.343 58.343a8 8 0 0 1-11.314 11.314l-72-72a8 8 0 0 1 0-11.314l72-72a8 8 0 0 1 11.314 11.314L59.314 120H216a8 8 0 0 1 8 8z"
      fill="currentColor"
    ></path>
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ArrowIcon',

  props: {
    direction: {
      type: String as PropType<'left' | 'right'>,
      default: 'left',
    },
  },
})
</script>

<style lang="postcss" scoped>
.right {
  @apply transform rotate-180;
}
</style>