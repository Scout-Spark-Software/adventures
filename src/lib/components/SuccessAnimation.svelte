<script lang="ts">
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  export let message: string = "Success!";
</script>

<div
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
>
  <div
    transition:scale={{ duration: 400, easing: quintOut }}
    class="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4"
  >
    <div class="flex flex-col items-center">
      <div
        class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce"
      >
        <svg
          class="w-10 h-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
      <p class="text-gray-600 text-center mb-6">{message}</p>
      <p class="text-sm text-gray-500">Redirecting to your submission...</p>
    </div>
  </div>
</div>
