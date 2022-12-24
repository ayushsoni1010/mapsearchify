<template>
  <div>
    <figure
      class="w-full h-auto rounded-xl overflow-hidden aspect-w-16 aspect-h-8 shadow-md bg-gray-100"
      :class="{ 'animate-pulse': !loaded }"
    >
      <img
        :src="item.image_url"
        :alt="item.name"
        class="object-cover w-full h-full opacity-0 transition-opacity"
        :class="{ 'opacity-100': loaded }"
        @load="loaded = true"
      />
    </figure>

    <div class="text-sm font-medium mt-4">{{ item.name }}</div>
    <div class="text-xs text-gray-400 mt-2">
      {{ item.city }}, {{ item.skills }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { IResultItem } from "./ResultItem.vue";

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IResultItem>,
      required: true,
    },
  },

  setup() {
    const loaded = ref(false);
    return {
      loaded,
    };
  },
});
</script>
