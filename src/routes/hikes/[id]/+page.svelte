<script lang="ts">
  import type { PageData } from "./$types";
  import FavoriteButton from "$lib/components/FavoriteButton.svelte";
  import ModerationBadge from "$lib/components/ModerationBadge.svelte";
  import LocationMap from "$lib/components/LocationMap.svelte";

  export let data: PageData;

  $: isAdmin = data.userRole === "admin";
</script>

<svelte:head>
  <title>{data.hike.name} - Scouts Adventures</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Hero Image Section -->
  <div
    class="relative h-72 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 overflow-hidden"
  >
    <!-- Decorative mountain/hill shapes -->
    <div class="absolute inset-0">
      <svg
        class="absolute bottom-0 w-full h-64"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 Q300,10 600,60 T1200,60 L1200,120 L0,120 Z"
          fill="rgba(255,255,255,0.1)"
        />
      </svg>
      <svg
        class="absolute bottom-0 w-full h-48"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 Q200,20 400,80 T800,80 T1200,80 L1200,120 L0,120 Z"
          fill="rgba(255,255,255,0.15)"
        />
      </svg>
      <svg
        class="absolute bottom-0 w-full h-32"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,90 Q150,50 300,90 T600,90 T900,90 T1200,90 L1200,120 L0,120 Z"
          fill="rgba(255,255,255,0.2)"
        />
      </svg>
    </div>

    <!-- Overlay Content -->
    <div
      class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8"
    >
      <div class="w-full">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <ModerationBadge status={data.hike.status} />
              {#if data.hike.difficulty}
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm
                  {data.hike.difficulty === 'easy'
                    ? 'bg-green-100/90 text-green-800'
                    : data.hike.difficulty === 'moderate'
                      ? 'bg-yellow-100/90 text-yellow-800'
                      : data.hike.difficulty === 'hard'
                        ? 'bg-orange-100/90 text-orange-800'
                        : 'bg-red-100/90 text-red-800'}"
                >
                  {data.hike.difficulty.charAt(0).toUpperCase() +
                    data.hike.difficulty.slice(1).replace("_", " ")}
                </span>
              {/if}
            </div>
            <h1
              class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-2"
            >
              {data.hike.name}
            </h1>
            {#if data.address}
              <div class="flex items-center text-white/90 text-lg drop-shadow">
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {data.address
                    .city}{#if data.address.city && data.address.state},
                  {/if}{data.address.state}
                </span>
              </div>
            {/if}
          </div>
          <div class="flex items-center gap-3">
            {#if data.userId}
              <a
                href="/hikes/{data.hike.id}/edit"
                class="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg shadow-lg hover:bg-white transition-colors"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>{isAdmin ? "Edit" : "Suggest Edit"}</span>
              </a>
            {/if}
            <FavoriteButton hikeId={data.hike.id} userId={data.userId} />
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="flex flex-wrap gap-3 mt-6">
          {#if data.hike.distance}
            <div
              class="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg"
            >
              <div class="flex items-center gap-2">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <div>
                  <div class="text-xs text-gray-500">Distance</div>
                  <div class="font-semibold text-gray-900">
                    {data.hike.distance}
                  </div>
                </div>
              </div>
            </div>
          {/if}
          {#if data.hike.duration}
            <div
              class="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg"
            >
              <div class="flex items-center gap-2">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div class="text-xs text-gray-500">Duration</div>
                  <div class="font-semibold text-gray-900">
                    {data.hike.duration}
                  </div>
                </div>
              </div>
            </div>
          {/if}
          {#if data.hike.elevation}
            <div
              class="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg"
            >
              <div class="flex items-center gap-2">
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
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                <div>
                  <div class="text-xs text-gray-500">Elevation Gain</div>
                  <div class="font-semibold text-gray-900">
                    {data.hike.elevation}
                  </div>
                </div>
              </div>
            </div>
          {/if}
          {#if data.hike.trailType}
            <div
              class="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg"
            >
              <div class="flex items-center gap-2">
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <div>
                  <div class="text-xs text-gray-500">Trail Type</div>
                  <div class="font-semibold text-gray-900">
                    {data.hike.trailType}
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Column -->
      <div class="lg:col-span-2 space-y-6">
        {#if data.hike.description}
          <div class="bg-white shadow rounded-lg p-5">
            <h2 class="text-xl font-bold text-gray-900 mb-3">
              About This Trail
            </h2>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed">
                {data.hike.description}
              </p>
            </div>
          </div>
        {/if}

        {#if data.hike.features && Array.isArray(data.hike.features) && data.hike.features.length > 0}
          <div class="bg-white shadow rounded-lg p-5">
            <h2 class="text-xl font-bold text-gray-900 mb-3">Features</h2>
            <div class="flex flex-wrap gap-2">
              {#each data.hike.features as feature}
                <span
                  class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  <svg
                    class="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Trail Conditions & Access -->
        {#if data.hike.dogFriendly || data.hike.waterSources || (data.hike.bestSeason && data.hike.bestSeason.length > 0) || data.hike.permitsRequired || data.hike.parkingInfo}
          <div class="bg-white shadow rounded-lg p-5">
            <h2
              class="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2"
            >
              <svg
                class="w-6 h-6 text-indigo-600"
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
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {#if data.hike.dogFriendly}
                <div class="flex items-start gap-3">
                  <div
                    class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">
                      Dog-Friendly
                    </dt>
                    <dd class="text-gray-900 font-medium">Yes</dd>
                  </div>
                </div>
              {/if}
              {#if data.hike.waterSources}
                <div class="flex items-start gap-3">
                  <div
                    class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <svg
                      class="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">
                      Water Sources
                    </dt>
                    <dd class="text-gray-900 font-medium">
                      Available on trail
                    </dd>
                  </div>
                </div>
              {/if}
              {#if data.hike.bestSeason && Array.isArray(data.hike.bestSeason) && data.hike.bestSeason.length > 0}
                <div class="md:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 mb-2">
                    Best Season to Visit
                  </dt>
                  <dd class="flex flex-wrap gap-2">
                    {#each data.hike.bestSeason as season}
                      <span
                        class="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg border border-indigo-200 capitalize"
                      >
                        {season}
                      </span>
                    {/each}
                  </dd>
                </div>
              {/if}
              {#if data.hike.permitsRequired}
                <div class="md:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 mb-2">
                    Permits/Passes Required
                  </dt>
                  <dd
                    class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg"
                  >
                    <div class="flex items-start gap-2">
                      <svg
                        class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span class="text-gray-900"
                        >{data.hike.permitsRequired}</span
                      >
                    </div>
                  </dd>
                </div>
              {/if}
              {#if data.hike.parkingInfo}
                <div class="md:col-span-2">
                  <dt class="text-sm font-medium text-gray-500 mb-2">
                    Parking Information
                  </dt>
                  <dd class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p class="text-gray-900 whitespace-pre-wrap">
                      {data.hike.parkingInfo}
                    </p>
                  </dd>
                </div>
              {/if}
            </dl>
          </div>
        {/if}

        {#if data.files && data.files.length > 0}
          <div class="bg-white shadow rounded-lg p-5">
            <h2 class="text-xl font-bold text-gray-900 mb-3">
              Images & Documents
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              {#each data.files as file}
                {#if file.fileType === "image"}
                  <img
                    src={file.fileUrl}
                    alt={file.fileName}
                    class="w-full h-48 object-cover rounded-lg shadow hover:shadow-lg transition-shadow"
                  />
                {:else}
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    class="block p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-indigo-300 transition-colors"
                  >
                    <svg
                      class="w-8 h-8 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {file.fileName}
                    </p>
                  </a>
                {/if}
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        {#if data.address}
          <div class="bg-white shadow rounded-lg p-5 sticky top-6">
            <h2
              class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Location Details
            </h2>

            <!-- Map -->
            {#if data.address.latitude && data.address.longitude}
              <div class="mb-4">
                <LocationMap
                  latitude={data.address.latitude}
                  longitude={data.address.longitude}
                  height="250px"
                />
              </div>
              <div class="flex gap-2 mb-4">
                <a
                  href="https://www.openstreetmap.org/?mlat={data.address
                    .latitude}&mlon={data.address.longitude}#map=15/{data
                    .address.latitude}/{data.address.longitude}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  OpenStreetMap
                </a>
              </div>
            {/if}

            <div class="space-y-3 text-gray-700">
              {#if data.address.address}
                <p class="font-medium">{data.address.address}</p>
              {/if}
              <p>
                {#if data.address.city}{data.address
                    .city}{/if}{#if data.address.city && data.address.state},
                {/if}{#if data.address.state}{data.address.state}{/if}
                {#if data.address.postalCode}
                  {data.address.postalCode}
                {/if}
              </p>
              {#if data.address.country}
                <p>{data.address.country}</p>
              {/if}
              {#if data.address.latitude && data.address.longitude}
                <div class="pt-3 border-t border-gray-200">
                  <p class="text-xs text-gray-500 mb-2">GPS Coordinates</p>
                  <p class="text-sm font-mono bg-gray-50 p-2 rounded mb-2">
                    {data.address.latitude}, {data.address.longitude}
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query={data
                      .address.latitude},{data.address.longitude}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open in Google Maps
                  </a>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
