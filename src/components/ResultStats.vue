<template>
  <div class="text-sm flex font-light">
    <img
      src="@/assets/images/algolia-logo.svg"
      alt="Algolia"
      class="w-5 h-5 mr-2"
      width="20"
      height="20"
    />
    <span>
      <template v-if="stats.nbHits !== 0">
        <b>{{ nbHitsFormatted }}</b> result{{
          stats.nbHits > 1 ? 's' : ''
        }}
        found in {{ stats.processingTime }} ms
      </template>

      <template v-else>No results</template>
    </span>
  </div>
</template>

<script lang="ts">
import { SearchResults } from 'algoliasearch-helper'
import ResultItem from '@/components/ResultItem.vue'
import { getAlgoliaHelper } from '@/services/algolia'
import { computed, defineComponent, onMounted, reactive } from 'vue'

export default defineComponent({
  name: 'ResultStats',

  components: {
    ResultItem,
  },

  setup() {
    const algoliaHelper = getAlgoliaHelper()

    const stats = reactive({
      processingTime: 0,
      nbHits: 0,
    })

    const nbHitsFormatted = computed(() => stats.nbHits.toLocaleString())

    const updateStats = ({ results }: { results: SearchResults }) => {
      stats.processingTime = results.processingTimeMS
      stats.nbHits = results.nbHits
    }

    onMounted(() => {
      algoliaHelper.on('result', updateStats)
    })

    return { stats, nbHitsFormatted }
  },
})
</script>
