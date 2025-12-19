<script lang="ts">
  import type { PageData } from "./$types";
  import FavoriteButton from "$lib/components/FavoriteButton.svelte";
  import ModerationBadge from "$lib/components/ModerationBadge.svelte";

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.campingSite.name} - Scouts Adventures</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {data.campingSite.name}
            </h1>
            <ModerationBadge status={data.campingSite.status} />
          </div>
          <FavoriteButton
            campingSiteId={data.campingSite.id}
            userId={data.userId}
          />
        </div>

        {#if data.campingSite.description}
          <div class="prose max-w-none mb-6">
            <p class="text-gray-700">{data.campingSite.description}</p>
          </div>
        {/if}

        {#if data.address}
          <div class="mb-6 pb-6 border-b">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Location</h3>
            <div class="text-gray-700">
              {#if data.address.address}
                <p>{data.address.address}</p>
              {/if}
              <p>
                {#if data.address.city}{data.address
                    .city}{/if}{#if data.address.city && data.address.state},
                {/if}{#if data.address.state}{data.address.state}{/if}
                {#if data.address.postalCode}
                  {data.address.postalCode}{/if}
              </p>
              {#if data.address.country}
                <p>{data.address.country}</p>
              {/if}
              {#if data.address.latitude && data.address.longitude}
                <p class="text-sm text-gray-500 mt-2">
                  Coordinates: {data.address.latitude}, {data.address.longitude}
                </p>
              {/if}
            </div>
          </div>
        {/if}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {#if data.campingSite.capacity}
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Capacity</h3>
              <p class="text-gray-900">{data.campingSite.capacity}</p>
            </div>
          {/if}
          {#if data.campingSite.reservationInfo}
            <div class="md:col-span-2">
              <h3 class="text-sm font-medium text-gray-500 mb-1">
                Reservation Info
              </h3>
              <p class="text-gray-900">{data.campingSite.reservationInfo}</p>
            </div>
          {/if}
        </div>

        {#if data.campingSite.amenities && typeof data.campingSite.amenities === "object"}
          <div class="mb-6 pb-6 border-b">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Amenities</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              {#if data.campingSite.amenities.water}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Water
                </div>
              {/if}
              {#if data.campingSite.amenities.electricity}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Electricity
                </div>
              {/if}
              {#if data.campingSite.amenities.restrooms}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Restrooms
                </div>
              {/if}
              {#if data.campingSite.amenities.showers}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Showers
                </div>
              {/if}
              {#if data.campingSite.amenities.wifi}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  WiFi
                </div>
              {/if}
              {#if data.campingSite.amenities.firePits}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Fire Pits
                </div>
              {/if}
              {#if data.campingSite.amenities.picnicTables}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Picnic Tables
                </div>
              {/if}
              {#if data.campingSite.amenities.trashDisposal}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Trash Disposal
                </div>
              {/if}
            </div>
          </div>
        {/if}

        {#if data.campingSite.facilities && typeof data.campingSite.facilities === "object"}
          <div class="mb-6 pb-6 border-b">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Facilities</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              {#if data.campingSite.facilities.rvSites}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  RV Sites
                </div>
              {/if}
              {#if data.campingSite.facilities.tentSites}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Tent Sites
                </div>
              {/if}
              {#if data.campingSite.facilities.cabins}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Cabins
                </div>
              {/if}
              {#if data.campingSite.facilities.playground}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Playground
                </div>
              {/if}
              {#if data.campingSite.facilities.boatLaunch}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Boat Launch
                </div>
              {/if}
              {#if data.campingSite.facilities.fishing}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Fishing
                </div>
              {/if}
              {#if data.campingSite.facilities.swimming}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Swimming
                </div>
              {/if}
              {#if data.campingSite.facilities.hikingTrails}
                <div class="flex items-center text-gray-700">
                  <svg
                    class="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Hiking Trails
                </div>
              {/if}
            </div>
          </div>
        {/if}

        {#if data.files && data.files.length > 0}
          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Images & Documents
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              {#each data.files as file}
                {#if file.fileType === "image"}
                  <img
                    src={file.fileUrl}
                    alt={file.fileName}
                    class="w-full h-48 object-cover rounded-lg"
                  />
                {:else}
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    class="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <p class="text-sm font-medium text-gray-900">
                      {file.fileName}
                    </p>
                  </a>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
