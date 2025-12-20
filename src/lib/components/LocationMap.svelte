<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type L from "leaflet";

  export let latitude: number;
  export let longitude: number;
  export let height = "300px";

  let mapContainer: HTMLDivElement;
  let map: L.Map | null = null;
  let marker: L.Marker | null = null;
  let leaflet: typeof L | null = null;

  onMount(async () => {
    // Dynamically import Leaflet to avoid SSR issues
    leaflet = (await import("leaflet")).default;

    // Initialize map
    map = leaflet.map(mapContainer).setView([latitude, longitude], 13);

    // Add OpenStreetMap tiles
    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      })
      .addTo(map);

    // Add marker
    marker = leaflet.marker([latitude, longitude]).addTo(map);
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

  // Update map when coordinates change
  $: if (map && leaflet && latitude && longitude) {
    map.setView([latitude, longitude], 13);
    if (marker) {
      marker.setLatLng([latitude, longitude]);
    } else {
      marker = leaflet.marker([latitude, longitude]).addTo(map);
    }
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />
</svelte:head>

<div bind:this={mapContainer} style="height: {height};" class="w-full rounded-lg"></div>

<style>
  :global(.leaflet-container) {
    font-family: inherit;
    border-radius: 0.5rem;
  }
</style>
