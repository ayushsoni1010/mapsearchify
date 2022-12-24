<template>
  <div
    class="h-28 border-b border-gray-100 focus-within:border-gray-300 focus-within:bg-gray-50 hover:border-gray-300 transition-colors"
  >
    <form
      action=""
      role="search"
      class="w-full h-full relative"
      @submit.prevent
    >
      <input
        class="w-full h-full pl-32 bg-transparent outline-none text-3xl placeholder-gray-300"
        type="search"
        :placeholder="placeholder"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        :maxlength="100"
        autofocus
        v-model="query"
      />
      <button
        type="submit"
        title="Submit the search query"
        class="icon-btn left-0"
      >
        <SearchIcon class="icon" />
      </button>

      <button
        type="reset"
        title="Reset the search query"
        class="icon-btn right-4"
        @click="query = ''"
      >
        <!-- <CloseIcon v-show="query" class="icon" /> -->
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { getAlgoliaHelper } from "@/services/algolia";
import SearchIcon from "@/components/icons/SearchIcon.vue";
import CloseIcon from "@/components/icons/CloseIcon.vue";

export default defineComponent({
  name: "SearchBar",

  components: {
    SearchIcon,
    CloseIcon,
  },

  setup() {
    const algoliaHelper = getAlgoliaHelper();
    const query = ref("");

    const placeholderLetterDelay = 100;
    const placeholderWordDelay = 500;
    const placeholderWords = ["name", "city"];

    const placeholderWord = ref("");
    const placeholder = computed(
      () => `Search for people by ${placeholderWord.value}`
    );

    let currentPlaceholderWordIdx = 0;

    const updatePlaceholder = () => {
      placeholderWord.value = "";

      let currentPlaceholderLetterIdx = 1;
      const currentPlaceholderWord =
        placeholderWords[currentPlaceholderWordIdx];
      const currentPlaceholderWordLength = currentPlaceholderWord.length;

      const placeholderInterval = setInterval(() => {
        if (currentPlaceholderLetterIdx > currentPlaceholderWordLength) {
          clearInterval(placeholderInterval);
          currentPlaceholderWordIdx =
            (currentPlaceholderWordIdx + 1) % placeholderWords.length;

          setTimeout(() => {
            updatePlaceholder();
          }, placeholderWordDelay);

          return;
        }

        const currentPlaceholderLetters = currentPlaceholderWord.slice(
          0,
          currentPlaceholderLetterIdx
        );
        currentPlaceholderLetterIdx++;
        placeholderWord.value = currentPlaceholderLetters;
      }, placeholderLetterDelay);
    };

    onMounted(() => {
      watch(
        query,
        () => {
          algoliaHelper.setQuery(query.value).search();
        },
        { immediate: true }
      );

      updatePlaceholder();
    });

    return {
      query,
      placeholder,
    };
  },
});
</script>

<style lang="postcss" scoped>
.icon-btn {
  @apply absolute top-1/2 w-28 h-full flex justify-center items-center transform -translate-y-1/2 hover:bg-gray-100 transition-colors focus:outline-none;
}

.icon {
  @apply w-6 h-6 fill-current text-gray-400;
}
</style>
