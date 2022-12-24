<template>
  <ul
    class="flex justify-center space-x-3 text-sm font-light"
    v-if="nbPages > 1"
  >
    <li class="prev-next">
      <a
        href="#"
        @click.prevent="prevPage"
        :class="{ disabled: isFirstPage }"
        aria-label="Previous"
      >
        <ArrowIcon />
      </a>
    </li>
    <li
      class="page"
      :class="{ 'page-current': i === currentPage }"
      v-for="i in pages"
      :key="i"
    >
      <a href="#" @click.prevent="setPage(i)">
        {{ i + 1 }}
      </a>
    </li>
    <li class="prev-next">
      <a
        href="#"
        @click.prevent="nextPage"
        :class="{ disabled: isLastPage }"
        aria-label="Next"
      >
        <ArrowIcon direction="right" />
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { getAlgoliaHelper } from '@/services/algolia'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import range from '@/utils/range'
import { SearchResults } from 'algoliasearch-helper'

export default defineComponent({
  name: 'Pagination',

  components: {
    ArrowIcon,
  },

  emits: ['update'],

  setup(props, { emit }) {
    const algoliaHelper = getAlgoliaHelper()

    const pageSize = 3
    const pageRange = 1

    const currentPage = ref(0)
    const nbPages = ref(0)
    const startPage = computed(() => Math.max(currentPage.value - pageRange, 0))
    const endPage = computed(() =>
      Math.min(
        Math.max(currentPage.value + pageRange, pageSize - 1),
        nbPages.value - 1,
      ),
    )
    const offset = computed(
      () => pageSize - (endPage.value - startPage.value + 1),
    )
    const pages = computed(() =>
      range(startPage.value - offset.value, endPage.value),
    )

    const isFirstPage = computed(() => currentPage.value === 0)
    const isLastPage = computed(() => currentPage.value === nbPages.value - 1)

    const updateCurrentPage = () => {
      currentPage.value = algoliaHelper.getPage() || 0
    }

    const updateNbPages = ({ results }: { results: SearchResults }) => {
      nbPages.value = results.nbPages
    }

    const prevPage = () => {
      if (isFirstPage.value) return
      algoliaHelper.previousPage().search()
      emit('update')
    }

    const nextPage = () => {
      if (isLastPage.value) return
      algoliaHelper.nextPage().search()
      emit('update')
    }

    const setPage = (number: number) => {
      algoliaHelper.setPage(number).search()
      emit('update')
    }

    onMounted(() => {
      algoliaHelper.on('change', updateCurrentPage)
      algoliaHelper.on('result', updateNbPages)
    })

    return {
      currentPage,
      prevPage,
      nextPage,
      setPage,
      pages,
      nbPages,
      isFirstPage,
      isLastPage,
    }
  },
})
</script>

<style lang="postcss" scoped>
.item {
  @apply w-9 h-9 rounded-md flex-shrink-0;
}

.item a {
  @apply w-full h-full flex justify-center items-center;
}

.prev-next {
  @apply item transition-colors;
}

.disabled {
  @apply text-gray-400 cursor-not-allowed;
}

.page {
  @apply item border border-gray-300 hover:bg-gray-200 transition-colors;
}

.page-current {
  @apply bg-gray-400 border-none text-white pointer-events-none;
}
</style>
