<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton";
  import NumberFlow from "@number-flow/svelte";

  let { speedLimit } = $props();
</script>

<div
	class="flex justify-center items-center h-52 w-52 rounded-full bg-white text-black border-red-500 aspect-square border-20 text-8xl font-medium">
	{#if speedLimit}
    <NumberFlow value={speedLimit} />
	{:else}
		<Skeleton class="w-20 h-16" />
	{/if}
</div>