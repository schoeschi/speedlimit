<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
  import NumberFlow from "@number-flow/svelte";

	let { speedLimit } = $props();
</script>

<div
	class="flex justify-center items-center h-48 w-48 rounded-full border-[#F00001] aspect-square border-30 text-6xl">
	{#if speedLimit}
    <NumberFlow value={speedLimit} />
	{:else}
		<Skeleton class="w-20 h-16" />
	{/if}
</div>