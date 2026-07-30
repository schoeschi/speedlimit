<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton";
  import NumberFlow from "@number-flow/svelte";

  let { speedLimit } = $props();
</script>

<div
	class="flex justify-center items-center h-48 w-48 rounded-full bg-white text-black border-red-500 aspect-square border-20 text-7xl">
	{#if speedLimit}
    <NumberFlow value={speedLimit} />
	{:else}
		<Skeleton class="w-20 h-16" />
	{/if}
</div>