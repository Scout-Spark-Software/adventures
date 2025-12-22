<script lang="ts">
	export let tabs: { id: string; label: string; count?: number }[];
	export let activeTab: string;

	function selectTab(tabId: string) {
		activeTab = tabId;
	}
</script>

<div class="border-b border-gray-200">
	<nav class="-mb-px flex space-x-8" aria-label="Tabs">
		{#each tabs as tab}
			<button
				on:click={() => selectTab(tab.id)}
				class="
          {activeTab === tab.id
					? 'border-indigo-500 text-indigo-600'
					: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
        "
				aria-current={activeTab === tab.id ? 'page' : undefined}
			>
				{tab.label}
				{#if tab.count !== undefined}
					<span
						class="
              {activeTab === tab.id
							? 'bg-indigo-100 text-indigo-600'
							: 'bg-gray-100 text-gray-900'}
              ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
            "
					>
						{tab.count}
					</span>
				{/if}
			</button>
		{/each}
	</nav>
</div>

<div class="mt-6">
	<slot />
</div>
