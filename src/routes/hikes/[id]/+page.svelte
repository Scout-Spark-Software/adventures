<script lang="ts">
  import type { PageData } from "./$types";
  import FavoriteButton from "$lib/components/FavoriteButton.svelte";
  import ModerationBadge from "$lib/components/ModerationBadge.svelte";

  export let data: PageData;
</script>

<svelte:head>
  <title>{data.hike.name} - Scouts Adventures</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {data.hike.name}
            </h1>
            <ModerationBadge status={data.hike.status} />
          </div>
          <FavoriteButton hikeId={data.hike.id} userId={data.userId} />
        </div>

        {#if data.hike.description}
          <div class="prose max-w-none mb-6">
            <p class="text-gray-700">{data.hike.description}</p>
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
          {#if data.hike.difficulty}
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Difficulty</h3>
              <p class="text-gray-900">{data.hike.difficulty}</p>
            </div>
          {/if}
          {#if data.hike.distance}
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Distance</h3>
              <p class="text-gray-900">{data.hike.distance}</p>
            </div>
          {/if}
          {#if data.hike.duration}
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Duration</h3>
              <p class="text-gray-900">{data.hike.duration}</p>
            </div>
          {/if}
          {#if data.hike.elevation}
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Elevation</h3>
              <p class="text-gray-900">{data.hike.elevation}</p>
            </div>
          {/if}
          {#if data.hike.trailType}
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Trail Type</h3>
              <p class="text-gray-900">{data.hike.trailType}</p>
            </div>
          {/if}
        </div>

        {#if data.hike.features && Array.isArray(data.hike.features) && data.hike.features.length > 0}
          <div class="mb-6 pb-6 border-b">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Features</h3>
            <div class="flex flex-wrap gap-2">
              {#each data.hike.features as feature}
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {feature}
                </span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Trail Conditions & Access -->
        {#if data.hike.dogFriendly || data.hike.waterSources || (data.hike.bestSeason && data.hike.bestSeason.length > 0) || data.hike.permitsRequired || data.hike.parkingInfo}
          <div class="mb-6 pb-6 border-b">
            <h2
              class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2"
            >
              <svg
                class="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Trail Conditions & Access
            </h2>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#if data.hike.dogFriendly}
                <div>
                  <dt class="text-sm font-medium text-gray-500">
                    Dog-Friendly
                  </dt>
                  <dd class="text-gray-900 flex items-center gap-1">
                    <svg
                      class="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Yes
                  </dd>
                </div>
              {/if}
              {#if data.hike.waterSources}
                <div>
                  <dt class="text-sm font-medium text-gray-500">
                    Water Sources
                  </dt>
                  <dd class="text-gray-900 flex items-center gap-1">
                    <svg
                      class="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Available
                  </dd>
                </div>
              {/if}
              {#if data.hike.bestSeason && Array.isArray(data.hike.bestSeason) && data.hike.bestSeason.length > 0}
                <div class="md:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 mb-1">
                    Best Season
                  </dt>
                  <dd class="flex flex-wrap gap-2">
                    {#each data.hike.bestSeason as season}
                      <span
                        class="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full capitalize"
                      >
                        {season}
                      </span>
                    {/each}
                  </dd>
                </div>
              {/if}
              {#if data.hike.permitsRequired}
                <div class="md:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 mb-1">
                    Permits/Passes Required
                  </dt>
                  <dd
                    class="text-gray-900 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded"
                  >
                    {data.hike.permitsRequired}
                  </dd>
                </div>
              {/if}
              {#if data.hike.parkingInfo}
                <div class="md:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 mb-1">
                    Parking Information
                  </dt>
                  <dd class="text-gray-900 whitespace-pre-wrap">
                    {data.hike.parkingInfo}
                  </dd>
                </div>
              {/if}
            </dl>
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
