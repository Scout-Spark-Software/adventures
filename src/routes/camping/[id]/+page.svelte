<script lang="ts">
  import type { PageData } from "./$types";
  import FavoriteButton from "$lib/components/FavoriteButton.svelte";
  import ModerationBadge from "$lib/components/ModerationBadge.svelte";
  import Tabs from "$lib/components/Tabs.svelte";
  import NotesSection from "$lib/components/NotesSection.svelte";

  export let data: PageData;

  $: isAdmin = data.userRole === "admin";

  let activeTab = "details";
  let notesCount = data.notesCount;

  $: tabs = [
    { id: "details", label: "Details" },
    { id: "notes", label: "Notes", count: notesCount },
  ];

  function handleNotesCountChanged(event: CustomEvent<number>) {
    notesCount = event.detail;
  }
</script>

<svelte:head>
  <title>{data.campingSite.name} - Scouts Adventures</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <Tabs {tabs} bind:activeTab>
      {#if activeTab === "details"}
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                  {data.campingSite.name}
                </h1>
                <ModerationBadge status={data.campingSite.status} />
              </div>
              <div class="flex items-center gap-3">
                {#if data.userId}
                  <a
                    href="/camping/{data.campingSite.id}/edit"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
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
                <FavoriteButton
                  campingSiteId={data.campingSite.id}
                  userId={data.userId}
                />
              </div>
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
                      Coordinates: {data.address.latitude}, {data.address
                        .longitude}
                    </p>
                  {/if}
                </div>
              </div>
            {/if}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {#if data.campingSite.capacity}
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">
                    Capacity
                  </h3>
                  <p class="text-gray-900">{data.campingSite.capacity}</p>
                </div>
              {/if}
              {#if data.campingSite.reservationInfo}
                <div class="md:col-span-2">
                  <h3 class="text-sm font-medium text-gray-500 mb-1">
                    Reservation Info
                  </h3>
                  <p class="text-gray-900">
                    {data.campingSite.reservationInfo}
                  </p>
                </div>
              {/if}
            </div>

            {#if data.campingSite.amenities && typeof data.campingSite.amenities === "object"}
              <div class="mb-6 pb-6 border-b">
                <h3 class="text-lg font-medium text-gray-900 mb-3">
                  Amenities
                </h3>
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
                <h3 class="text-lg font-medium text-gray-900 mb-3">
                  Facilities
                </h3>
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

            <!-- Cost Information -->
            {#if data.campingSite.costPerNight || data.campingSite.baseFee}
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Cost & Fees
                </h2>
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {#if data.campingSite.baseFee}
                    <div>
                      <dt class="text-sm font-medium text-gray-500">
                        Base Fee
                      </dt>
                      <dd class="text-2xl font-bold text-gray-900">
                        ${parseFloat(data.campingSite.baseFee).toFixed(2)}
                      </dd>
                    </div>
                  {/if}
                  {#if data.campingSite.costPerNight}
                    <div>
                      <dt class="text-sm font-medium text-gray-500">
                        Cost Per Night
                      </dt>
                      <dd class="text-2xl font-bold text-gray-900">
                        ${parseFloat(data.campingSite.costPerNight).toFixed(2)}
                      </dd>
                    </div>
                  {/if}
                </dl>
              </div>
            {/if}

            <!-- Site Policies & Information -->
            {#if data.campingSite.siteType || data.campingSite.petPolicy || data.campingSite.firePolicy || data.campingSite.reservationRequired !== null || data.campingSite.operatingSeasonStart || data.campingSite.operatingSeasonEnd}
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Site Policies
                </h2>
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {#if data.campingSite.siteType}
                    <div>
                      <dt class="text-sm font-medium text-gray-500">
                        Site Type
                      </dt>
                      <dd class="text-gray-900 capitalize">
                        {data.campingSite.siteType.replace(/_/g, " ")}
                      </dd>
                    </div>
                  {/if}
                  {#if data.campingSite.petPolicy}
                    <div>
                      <dt class="text-sm font-medium text-gray-500">
                        Pet Policy
                      </dt>
                      <dd
                        class="text-gray-900 capitalize flex items-center gap-2"
                      >
                        {#if data.campingSite.petPolicy === "allowed"}
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
                        {:else if data.campingSite.petPolicy === "not_allowed"}
                          <svg
                            class="w-4 h-4 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        {/if}
                        {data.campingSite.petPolicy.replace(/_/g, " ")}
                      </dd>
                    </div>
                  {/if}
                  {#if data.campingSite.firePolicy}
                    <div>
                      <dt class="text-sm font-medium text-gray-500">
                        Fire Policy
                      </dt>
                      <dd class="text-gray-900 capitalize">
                        {data.campingSite.firePolicy.replace(/_/g, " ")}
                      </dd>
                    </div>
                  {/if}
                  {#if data.campingSite.reservationRequired !== null}
                    <div>
                      <dt class="text-sm font-medium text-gray-500">
                        Reservation
                      </dt>
                      <dd class="text-gray-900">
                        {data.campingSite.reservationRequired
                          ? "Required"
                          : "Not Required"}
                      </dd>
                    </div>
                  {/if}
                  {#if data.campingSite.operatingSeasonStart || data.campingSite.operatingSeasonEnd}
                    <div class="md:col-span-2">
                      <dt class="text-sm font-medium text-gray-500 mb-1">
                        Operating Season
                      </dt>
                      <dd class="text-gray-900">
                        {#if data.campingSite.operatingSeasonStart && data.campingSite.operatingSeasonEnd}
                          {data.campingSite.operatingSeasonStart} - {data
                            .campingSite.operatingSeasonEnd}
                        {:else if data.campingSite.operatingSeasonStart}
                          From {data.campingSite.operatingSeasonStart}
                        {:else}
                          Until {data.campingSite.operatingSeasonEnd}
                        {/if}
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
      {:else if activeTab === "notes"}
        <NotesSection
          campingSiteId={data.campingSite.id}
          userId={data.userId}
          on:notesCountChanged={handleNotesCountChanged}
        />
      {/if}
    </Tabs>
  </div>
</div>
