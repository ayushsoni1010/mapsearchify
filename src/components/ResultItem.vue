<template>
  <button
    class="w-full hover:bg-gray-100 transition-colors rounded-xl p-4 focus:outline-none"
    @click="onClick"
  >
    <div class="flex flex-col text-left">
      <figure
        class="h-auto w-full rounded-xl overflow-hidden aspect-w-16 aspect-h-10 shadow-md bg-gray-100"
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

      <div class="mt-5 flex flex-col space-y-1">
        <div class="flex items-center space-x-2 text-sm">
          <span
            class="w-6 h-6 flex items-center justify-center text-cyan-dark bg-cyan-light rounded-lg"
          >
            <StarIcon class="w-3 h-3" />
          </span>

          <span class="font-medium text-cyan-dark">{{ item.city }}</span>
          <div class="w-0.5 h-0.5 bg-black rounded-full"></div>
          <span class="ml-2">{{ item.name }}</span>

          <!-- <div>
            {{ item.reviews_count }} review{{
              item.reviews_count > 1 ? "s" : ""
            }}
          </div> -->
        </div>

        <div class="text-sm text-gray-400">{{ item.skills }}</div>
      </div>
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import StarIcon from "@/components/icons/StarIcon.vue";
import MapStore from "@/store/MapStore";

export interface IResultItem {
  id: string;
  name: string;
  username: string;
  city: string;
  email: string;
  designation: string;
  gender: string;
  image_url: string;
  skills: string;
  color: string;
  date: string;
  _geoloc: string;
}

export default defineComponent({
  name: "ResultItem",

  components: {
    StarIcon,
  },

  props: {
    item: {
      type: Object as PropType<IResultItem>,
      required: true,
    },
  },

  setup(props) {
    const loaded = ref(false);

    const onClick = () => {
      MapStore.updateObjectID(props.item.id);
    };

    return { loaded, onClick };
  },
  // mounted() {
  //   console.log(this.$props.item);
  // },
});
</script>
