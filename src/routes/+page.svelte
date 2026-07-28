<script lang="ts">
	import { getDistance } from 'geolib';
	import { onMount } from 'svelte';
	import { overpass } from 'overpass-ts';
	import Speedlimit from '$lib/Speedlimit.svelte';
	import ConfigDialog from '$lib/ConfigDialog.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Maximize, Minimize } from '@lucide/svelte';

	interface Coordinates {
		latitude: number;
		longitude: number;
	}

	let movingThreshold = $state<number>(20);
	let apiEndpoint = $state<string>(import.meta.env.VITE_API_ENDPOINT || '');

	let isFullscreen = $state<boolean>(false);

	let currentSpeed: number | null = $state(null);
	let previousCoordinates: Coordinates | null = $state(null);
	let currentCoordinates: Coordinates | null = $state(null);
	let speedLimit = $derived<number | null>(null);
	let streetName = $state<string | null>(null);

	async function fetchCurrentSpeedlimit(coordinates: Coordinates): Promise<void> {
		const query = `
        [out:json][timeout:5];
        way(around:15, ${coordinates.latitude}, ${coordinates.longitude})[highway][maxspeed];
        out tags;
        `;

		const res = await overpass(query, { endpoint: apiEndpoint });
		const data = await res.json();

		const road = data.elements?.find((el: { tags: { highway: string; }; }) =>
			el.tags?.highway && !['footway', 'cycleway', 'pedestrian', 'path'].includes(el.tags.highway)
		);

		streetName = road?.tags?.name || road?.tags?.ref || 'current road';

		const maxspeedTag: string = road?.tags?.maxspeed;
		speedLimit = parseInt(maxspeedTag, 10) || null;
	}

	function toggleFullscreen() {
		if (isFullscreen) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}

		isFullscreen = !isFullscreen;
	}

	onMount(() => {
		const watchId = navigator.geolocation.watchPosition((position) => {
			currentCoordinates = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			};
			if (!previousCoordinates) {
				previousCoordinates = currentCoordinates;
				fetchCurrentSpeedlimit(currentCoordinates);
				return;
			}

			let metersTravelled = getDistance(previousCoordinates, currentCoordinates);

			if (metersTravelled > movingThreshold) {
				previousCoordinates = currentCoordinates;
				currentSpeed = position.coords.speed;
				fetchCurrentSpeedlimit(currentCoordinates);
			}
		}, () => {
		}, {
			enableHighAccuracy: true
		});

		return () => navigator.geolocation.clearWatch(watchId);
	});
</script>

<header class="fixed top-0 flex items-center justify-end w-screen p-4 gap-2">
	<ConfigDialog
		bind:apiEndpoint
		bind:movingThreshold />

	<Button onclick={toggleFullscreen}
	        size="icon-lg"
	        variant="secondary">
		{#if isFullscreen}
			<Minimize />
		{:else}
			<Maximize />
		{/if}
	</Button>
</header>

<main class="flex flex-col w-screen h-screen items-center justify-center gap-4 text-center">
	<div class="flex flex-col items-center gap-x-6 gap-y-2 md:flex-row">
		<Speedlimit {speedLimit} />
	</div>

	{#if streetName}
		<Badge>
			{streetName}
		</Badge>
	{/if}
</main>

<footer
	class={`flex justify-center fixed w-screen p-4 bottom-0 text-center text-5xl font-bold ${currentSpeed == null ? 'hidden' : ''}`}>
	{currentSpeed ?? 0} km/h
</footer>
