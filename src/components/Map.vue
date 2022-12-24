<template>
  <div class="py-8 pl-8">
    <div
      id="map"
      class="w-full h-full rounded-xl overflow-hidden transform"
    ></div>

    <template v-show="false">
      <MapPopup :item="currentPopupItem" ref="popupEl" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import mapboxgl, { LngLatLike, Map, Marker, Popup } from 'mapbox-gl'
import { SearchResults } from 'algoliasearch-helper'
import { getAlgoliaHelper } from '@/services/algolia'
import MapStore from '@/store/MapStore'
import MapPopup from '@/components/MapPopup.vue'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

export default defineComponent({
  name: 'RefinementList',

  components: {
    MapPopup,
  },

  setup() {
    const algoliaHelper = getAlgoliaHelper()

    const popupEl = ref<typeof MapPopup>()
    const currentPopupItem = ref({})

    let hits: any = []
    let map: Map
    let lastClickedMarker: Element

    const markers: Marker[] = []
    const popup: Popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12,
      maxWidth: '200px',
    })

    watch(
      () => MapStore.getState().currentObjectID,
      (currentObjectID) => {
        const hit = hits.find((hit: any) => hit.id === currentObjectID)
        onMarkerClick(hit.marker, hit)
      },
    )

    const flyToMarker = (marker: Marker) => {
      map.flyTo({
        center: marker.getLngLat(),
        zoom: 15,
        offset: [0, -100],
      })
    }

    const updatePopup = (marker: Marker) => {
      if (popupEl.value) {
        popup
          .setLngLat(marker.getLngLat())
          .setDOMContent(popupEl.value.$el)
          .addTo(map)
      }
    }

    const removePopup = () => {
      popup.remove()
    }

    const removeMarkers = () => {
      markers.forEach((marker) => marker.remove())
    }

    const addMarkers = async (results: SearchResults) => {
      const markersBounds = new mapboxgl.LngLatBounds()

      hits = results.hits

      if (!hits.length) return

      hits.forEach((hit: any) => {
        const hitCoords: LngLatLike = [hit._geoloc.lng, hit._geoloc.lat]

        const el = document.createElement('div')
        el.classList.add('marker')

        const marker = new mapboxgl.Marker(el).setLngLat(hitCoords).addTo(map)
        hit.marker = marker

        el.addEventListener('click', () => onMarkerClick(marker, hit))

        markers.push(marker)
        markersBounds.extend(hitCoords)
      })

      map.fitBounds(markersBounds, { padding: 80, maxZoom: 15, linear: true })
    }

    const updateMarkerState = (marker: Marker) => {
      if (lastClickedMarker) {
        lastClickedMarker.classList.remove('marker-active')
      }

      const markerEl = marker.getElement()
      markerEl.classList.add('marker-active')

      lastClickedMarker = markerEl
    }

    const onMarkerClick = (marker: Marker, hit: any) => {
      currentPopupItem.value = hit
      MapStore.updateObjectID(hit.id)

      updateMarkerState(marker)
      flyToMarker(marker)
      updatePopup(marker)
    }

    const onResult = ({ results }: { results: SearchResults }) => {
      removePopup()
      removeMarkers()
      addMarkers(results)
    }

    onMounted(() => {
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 15,
        scrollZoom: true,
      })

      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
        }),
        'bottom-left',
      )
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'bottom-left',
      )
      map.addControl(new mapboxgl.FullscreenControl(), 'top-right')

      algoliaHelper.on('result', onResult)
    })

    return { popupEl, currentPopupItem }
  },
})
</script>

<style lang="postcss">
.mapboxgl-canvas {
  @apply focus:outline-none;
}

.mapboxgl-popup-content {
  @apply rounded-xl p-4;
}

.mapboxgl-ctrl-group:not(:empty) {
  @apply shadow-md rounded-xl p-2;
}

.mapboxgl-ctrl-group button {
  @apply w-8 h-8 focus:outline-none transition-colors rounded-md;
}
.mapboxgl-ctrl-group button:focus:first-child,
.mapboxgl-ctrl-group button:focus:last-child,
.mapboxgl-ctrl-group button:focus:only-child {
  @apply rounded-md;
}

.mapboxgl-ctrl-group button + button {
  @apply border-none;
}

.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl {
  @apply ml-6 mb-3;
}

.mapboxgl-ctrl-top-right .mapboxgl-ctrl {
  @apply mt-6 mr-6;
}

.mapboxgl-ctrl-attrib {
  @apply hidden;
}

.marker {
  @apply w-10 h-10 cursor-pointer;
}

.marker.marker-active:after {
  @apply bg-cyan-dark;
}

.marker:hover:before {
  @apply bg-opacity-40;
}

.marker:before,
.marker:after {
  content: '';
  @apply absolute rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2;
}

.marker:before {
  @apply w-12 h-12 bg-gray-500 bg-opacity-10 transition-colors;
}

.marker:after {
  @apply w-5 h-5 bg-gray-900 border-3 border-white transition-colors;
}
</style>
