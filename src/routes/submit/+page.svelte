<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import LocationPicker from "$lib/components/LocationPicker.svelte";

  export let data: PageData;
  export let form: ActionData;

  let type: "hike" | "camping_site" = "hike";
  let loading = false;
  let errors: Record<string, string> = {};

  // Location fields
  let address = "";
  let city = "";
  let state = "";
  let country = "";
  let postalCode = "";
  let latitude: number | null = null;
  let longitude: number | null = null;

  // Hike-specific fields with units
  let difficulty: string = "";
  let distance: number | null = null;
  let distanceUnit: "miles" | "kilometers" = "miles";
  let duration: number | null = null;
  let durationUnit: "minutes" | "hours" = "hours";
  let elevation: number | null = null;
  let elevationUnit: "feet" | "meters" = "feet";

  // Dynamic features from database
  let selectedFeatures: string[] = [];

  // Dynamic amenities from database - build object dynamically
  let amenities: Record<string, boolean> = {};
  $: {
    if (data.amenityTypes) {
      amenities = data.amenityTypes.reduce(
        (acc: Record<string, boolean>, type: any) => {
          if (!acc[type.key]) {
            acc[type.key] = false;
          }
          return acc;
        },
        amenities,
      );
    }
  }

  // Dynamic facilities from database - build object dynamically
  let facilities: Record<string, boolean> = {};
  $: {
    if (data.facilityTypes) {
      facilities = data.facilityTypes.reduce(
        (acc: Record<string, boolean>, type: any) => {
          if (!acc[type.key]) {
            acc[type.key] = false;
          }
          return acc;
        },
        facilities,
      );
    }
  }

  function validateHikeForm(formData: FormData): boolean {
    errors = {};

    if (!formData.get("name")) {
      errors.name = "Name is required";
    }

    if (!formData.get("city") || !formData.get("state")) {
      errors.address = "City and State are required";
    }

    return Object.keys(errors).length === 0;
  }

  function validateCampingForm(formData: FormData): boolean {
    errors = {};

    if (!formData.get("name")) {
      errors.name = "Name is required";
    }

    if (!formData.get("city") || !formData.get("state")) {
      errors.address = "City and State are required";
    }

    return Object.keys(errors).length === 0;
  }
</script>

<svelte:head>
  <title>Submit Adventure - Scouts Adventures</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Submit New Adventure</h1>

    <div class="bg-white shadow rounded-lg p-6">
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <select
          bind:value={type}
          class="block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="hike">Hike</option>
          <option value="camping_site">Camping Site</option>
        </select>
      </div>

      {#if type === "hike"}
        <form
          method="POST"
          action="?/submitHike"
          use:enhance={() => {
            return async ({ result, update }) => {
              loading = false;
              await update();
            };
          }}
          on:submit={(e) => {
            const formData = new FormData(e.currentTarget);
            if (!validateHikeForm(formData)) {
              e.preventDefault();
              return;
            }
            loading = true;
          }}
        >
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 border-b pb-2">
                Basic Information
              </h3>

              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {#if errors.name}
                  <p class="mt-1 text-sm text-red-600">{errors.name}</p>
                {/if}
              </div>

              <div>
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
            </div>

            <!-- Location Information -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Location Information
              </h3>
              <LocationPicker
                bind:address
                bind:city
                bind:state
                bind:country
                bind:postalCode
                bind:latitude
                bind:longitude
              />
              {#if errors.address}
                <p class="mt-1 text-sm text-red-600">{errors.address}</p>
              {/if}
            </div>

            <!-- Trail Details -->
            <div class="border-t pt-6 space-y-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Trail Details
              </h3>

              <div>
                <label
                  for="difficulty"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  bind:value={difficulty}
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select difficulty...</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                  <option value="very_hard">Very Hard</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    for="distance"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Distance
                  </label>
                  <div class="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      id="distance"
                      name="distance"
                      bind:value={distance}
                      placeholder="5.2"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <select
                      name="distance_unit"
                      bind:value={distanceUnit}
                      class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="miles">mi</option>
                      <option value="kilometers">km</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    for="duration"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration
                  </label>
                  <div class="flex gap-2">
                    <input
                      type="number"
                      step="0.5"
                      id="duration"
                      name="duration"
                      bind:value={duration}
                      placeholder="2.5"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <select
                      name="duration_unit"
                      bind:value={durationUnit}
                      class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="minutes">min</option>
                      <option value="hours">hrs</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    for="elevation"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Elevation Gain
                  </label>
                  <div class="flex gap-2">
                    <input
                      type="number"
                      step="1"
                      id="elevation"
                      name="elevation"
                      bind:value={elevation}
                      placeholder="500"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <select
                      name="elevation_unit"
                      bind:value={elevationUnit}
                      class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="feet">ft</option>
                      <option value="meters">m</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    for="trail_type"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Trail Type
                  </label>
                  <input
                    type="text"
                    id="trail_type"
                    name="trail_type"
                    placeholder="Loop, Out & Back, Point to Point"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <!-- Features -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Features</h3>
              <div class="grid grid-cols-2 gap-3">
                {#each data.featureTypes as feature}
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      value={feature.name}
                      bind:group={selectedFeatures}
                      class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span class="ml-2 text-sm text-gray-700"
                      >{feature.name}</span
                    >
                  </label>
                {/each}
              </div>
              <input
                type="hidden"
                name="features"
                value={JSON.stringify(selectedFeatures)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Hike"}
            </button>
          </div>
        </form>
      {:else}
        <form
          method="POST"
          action="?/submitCampingSite"
          use:enhance={() => {
            return async ({ result, update }) => {
              loading = false;
              await update();
            };
          }}
          on:submit={(e) => {
            const formData = new FormData(e.currentTarget);
            if (!validateCampingForm(formData)) {
              e.preventDefault();
              return;
            }
            loading = true;
          }}
        >
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 border-b pb-2">
                Basic Information
              </h3>

              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {#if errors.name}
                  <p class="mt-1 text-sm text-red-600">{errors.name}</p>
                {/if}
              </div>

              <div>
                <label
                  for="description"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
            </div>

            <!-- Location Information -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Location Information
              </h3>
              <LocationPicker
                bind:address
                bind:city
                bind:state
                bind:country
                bind:postalCode
                bind:latitude
                bind:longitude
              />
              {#if errors.address}
                <p class="mt-1 text-sm text-red-600">{errors.address}</p>
              {/if}
            </div>

            <!-- Site Details -->
            <div class="border-t pt-6 space-y-4">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Site Details
              </h3>

              <div>
                <label
                  for="capacity"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Capacity (number of people/tents)
                </label>
                <input
                  type="text"
                  id="capacity"
                  name="capacity"
                  placeholder="20 people or 10 tents"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  for="reservation_info"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reservation Info
                </label>
                <textarea
                  id="reservation_info"
                  name="reservation_info"
                  rows="3"
                  placeholder="How to make reservations, website, phone number, etc."
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
            </div>

            <!-- Amenities -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
              <div class="grid grid-cols-2 gap-3">
                {#each data.amenityTypes as amenity}
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      bind:checked={amenities[amenity.key]}
                      class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span class="ml-2 text-sm text-gray-700"
                      >{amenity.name}</span
                    >
                  </label>
                {/each}
              </div>
              <input
                type="hidden"
                name="amenities"
                value={JSON.stringify(amenities)}
              />
            </div>

            <!-- Facilities -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Facilities</h3>
              <div class="grid grid-cols-2 gap-3">
                {#each data.facilityTypes as facility}
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      bind:checked={facilities[facility.key]}
                      class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span class="ml-2 text-sm text-gray-700"
                      >{facility.name}</span
                    >
                  </label>
                {/each}
              </div>
              <input
                type="hidden"
                name="facilities"
                value={JSON.stringify(facilities)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Camping Site"}
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
</div>
