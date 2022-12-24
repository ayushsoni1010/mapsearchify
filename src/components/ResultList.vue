<template>
  <section class="relative gradient-overflow">
    <div class="h-full pl-8 pr-8 pt-8 overflow-auto" ref="scrollEl">
      <ResultStats class="ml-4 mb-2" />

      <transition-group
        name="result-list"
        tag="ol"
        class="grid grid-cols-1 gap-2 relative"
      >
        <li
          v-for="(item, i) in items"
          :key="item.id"
          class="inline-block"
          :style="`--item-position: ${getItemPosition(i)}`"
          :ref="(el) => setItemRef(el, item)"
        >
          <ResultItem :item="item" />
        </li>
      </transition-group>

      <Pagination class="mt-5 pb-8" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { SearchResults } from "algoliasearch-helper";
import { getAlgoliaHelper } from "@/services/algolia";
import ResultItem, { IResultItem } from "@/components/ResultItem.vue";
import ResultStats from "@/components/ResultStats.vue";
import Pagination from "@/components/Pagination.vue";
import MapStore from "@/store/MapStore";

export default defineComponent({
  name: "ResultList",

  components: {
    ResultItem,
    ResultStats,
    Pagination,
  },

  setup() {
    const algoliaHelper = getAlgoliaHelper();

    const items = ref<IResultItem[]>([]);
    const scrollEl = ref<Element>();

    const itemRefs: Record<string, Element> = {};
    const setItemRef = (el: Element, item: IResultItem) => {
      itemRefs[item.id] = el;
    };

    const getHits = ({ results }: { results: SearchResults }) => {
      items.value = results.hits;
      scrollToTop();
    };

    const getItemPosition = (index: number) => {
      const nbColumns = 1;
      const row = Math.floor(index / nbColumns) + 1;
      const column = (index % nbColumns) + 1;
      return `${row} / ${column} / ${row} / ${column}`;
    };

    const scrollToTop = () => {
      scrollEl.value?.scrollTo({ top: 0, behavior: "smooth" });
    };

    watch(
      () => MapStore.getState().currentObjectID,
      (currentObjectID) => {
        if (currentObjectID) {
          itemRefs[currentObjectID].scrollIntoView({
            block: "start",
            behavior: "smooth",
          });
        }
      }
    );

    onMounted(() => {
      algoliaHelper.on("result", getHits);
    });

    return { items, getItemPosition, scrollEl, setItemRef };
  },
});
</script>

<style lang="postcss">
.result-list-enter-from,
.result-list-leave-to {
  @apply opacity-0;
}

.result-list-enter-active,
.result-list-leave-active {
  @apply transition-opacity;
}

.result-list-leave-active {
  @apply absolute w-full;
  grid-area: var(--item-position);
}

.result-list-move {
  @apply transition-transform ease-in-out;
}
</style>
