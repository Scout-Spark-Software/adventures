<script lang="ts">
  export let title: string;
  export let icon: string;
  export let description: string = "";
</script>

<div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
  <div
    class="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-gray-200"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0"
      >
        <svg
          class="w-5 h-5 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {@html icon}
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{title}</h3>
        {#if description}
          <p class="text-sm text-gray-600 mt-0.5">{description}</p>
        {/if}
      </div>
    </div>
  </div>
  <div class="px-6 py-5">
    <slot />
  </div>
</div>
