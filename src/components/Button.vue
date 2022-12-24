<template>
  <button
    type="submit"
    :title="title"
    class="border border-gray-300 rounded-lg px-4 py-2 text-sm font-light transition-colors hover:bg-gray-100 focus:outline-none"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Button",

  props: {
    // type: {
    //   type: String,
    //   default: 'button',
    // },

    title: {
      type: String,
      default: "",
    },
  },

  emits: ["click"],
});
</script>
