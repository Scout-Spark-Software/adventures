<script lang="ts">
  import type { PageData } from "./$types";
  import HikeCard from "$lib/components/HikeCard.svelte";
  import CampingSiteCard from "$lib/components/CampingSiteCard.svelte";
  import logo from "$lib/assets/Scout-Spark-Hiking.png";
  export let data: PageData;
</script>

<svelte:head>
  <title>Scouts Adventures - Discover Hikes & Camping Sites</title>
</svelte:head>

<div class="min-h-screen bg-slate-50">
  <!-- Hero Section -->
  <div
    class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
  >
    <!-- Topographic Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="topo"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              stroke-width="0.5"
              class="text-white"
            />
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="none"
              stroke="currentColor"
              stroke-width="0.5"
              class="text-white"
            />
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="currentColor"
              stroke-width="0.5"
              class="text-white"
            />
            <circle
              cx="50"
              cy="50"
              r="10"
              fill="none"
              stroke="currentColor"
              stroke-width="0.5"
              class="text-white"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo)" />
      </svg>
    </div>

    <!-- Gradient Overlays -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-r from-sky-900/20 to-transparent"
    ></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Column: Text Content -->
        <div class="text-center lg:text-left">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-sky-600/20 border border-sky-500/30 rounded-full text-sky-300 text-sm font-medium mb-6"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
              />
            </svg>
            For Scouts & Outdoor Enthusiasts
          </div>

          <h1
            class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6"
          >
            Your Compass to
            <span
              class="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 mt-2"
            >
              Epic Adventures
            </span>
          </h1>

          <p class="text-xl text-slate-300 mb-4 max-w-2xl lg:max-w-none">
            Navigate extraordinary hiking trails and discover perfect camping
            sites
          </p>
          <p class="text-base text-slate-400 mb-10 max-w-2xl lg:max-w-none">
            Community-curated adventures from scouts who've been there
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href="/hikes"
              class="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Explore Adventures
              <svg
                class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="/submit"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-lg transition-all"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Share Your Trail
            </a>
          </div>

          <!-- Stats -->
          <div
            class="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-700"
          >
            <div>
              <div class="text-3xl font-bold text-sky-400">150+</div>
              <div class="text-sm text-slate-400 mt-1">Trails</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-sky-400">75+</div>
              <div class="text-sm text-slate-400 mt-1">Campsites</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-sky-400">1000+</div>
              <div class="text-sm text-slate-400 mt-1">Scouts</div>
            </div>
          </div>
        </div>

        <!-- Right Column: Visual Element -->
        <div class="hidden lg:block relative">
          <!-- Floating Cards -->
          <div class="relative h-[500px]">
            <!-- Card 1 -->
            <div
              class="absolute top-0 right-0 w-72 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform"
            >
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="text-white font-semibold">
                    Mountain Peak Trail
                  </div>
                  <div class="text-slate-400 text-sm">5.2 miles • Hard</div>
                </div>
              </div>
              <div class="flex gap-1">
                {#each [1, 2, 3, 4, 5] as _}
                  <svg
                    class="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                {/each}
              </div>
            </div>

            <!-- Card 2 -->
            <div
              class="absolute bottom-20 left-0 w-64 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform"
            >
              <div class="flex items-center gap-3 mb-2">
                <div
                  class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div>
                  <div class="text-white font-semibold">Pine Grove Camp</div>
                  <div class="text-slate-400 text-sm">Featured Site</div>
                </div>
              </div>
              <div class="text-slate-300 text-sm">
                Perfect basecamp with lake access
              </div>
            </div>

            <!-- Compass Decoration -->
            <div
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-20"
            >
              <svg
                class="w-full h-full animate-spin-slow"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.5"
                  class="text-sky-400"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="0.5"
                  class="text-sky-400"
                />
                <path
                  d="M50 5 L55 48 L50 50 L45 48 Z"
                  fill="currentColor"
                  class="text-sky-400"
                />
                <path
                  d="M50 95 L55 52 L50 50 L45 52 Z"
                  fill="currentColor"
                  class="text-sky-400"
                />
                <path
                  d="M5 50 L48 45 L50 50 L48 55 Z"
                  fill="currentColor"
                  class="text-sky-400"
                />
                <path
                  d="M95 50 L52 45 L50 50 L52 55 Z"
                  fill="currentColor"
                  class="text-sky-400"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom wave decoration -->
    <div class="absolute bottom-0 w-full">
      <svg
        viewBox="0 0 1200 120"
        class="w-full h-16 sm:h-20"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 L0,80 Q300,120 600,80 T1200,80 L1200,0 Z"
          fill="#f8fafc"
        />
      </svg>
    </div>
  </div>

  <!-- Featured Hikes -->
  {#if data.featuredHikes && data.featuredHikes.length > 0}
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <svg
              class="w-8 h-8 text-sky-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            Featured Hikes
          </h2>
          <p class="mt-1 text-slate-600">
            Handpicked trails for your next adventure
          </p>
        </div>
        <a
          href="/hikes"
          class="group inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 font-semibold transition-colors"
        >
          View All
          <svg
            class="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </div>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each data.featuredHikes as hike}
          <HikeCard {hike} />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Featured Camping Sites -->
  {#if data.featuredCampingSites && data.featuredCampingSites.length > 0}
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2
              class="text-3xl font-bold text-slate-900 flex items-center gap-3"
            >
              <svg
                class="w-8 h-8 text-sky-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Featured Camping Sites
            </h2>
            <p class="mt-1 text-slate-600">
              Perfect basecamp locations for scouts
            </p>
          </div>
          <a
            href="/camping"
            class="group inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 font-semibold transition-colors"
          >
            View All
            <svg
              class="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each data.featuredCampingSites as campingSite}
            <CampingSiteCard {campingSite} />
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Empty State -->
  {#if (!data.featuredHikes || data.featuredHikes.length === 0) && (!data.featuredCampingSites || data.featuredCampingSites.length === 0)}
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <svg
        class="w-24 h-24 mx-auto text-slate-300 mb-6"
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
      <h3 class="text-2xl font-semibold text-slate-900 mb-2">
        No Adventures Yet
      </h3>
      <p class="text-slate-600 text-lg mb-6">
        Be the first to share an amazing trail or camping site!
      </p>
      <a
        href="/submit"
        class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-lg"
      >
        Submit an Adventure
      </a>
    </div>
  {/if}
</div>
