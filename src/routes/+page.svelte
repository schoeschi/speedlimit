<script lang="ts">
	import { getDistance } from 'geolib';
	import { onMount } from 'svelte';
	import Speedlimit from '$lib/Speedlimit.svelte';
	import { overpass } from 'overpass-ts';
	import ConfigDialog from '$lib/ConfigDialog.svelte';

	interface Coordinates {
		latitude: number;
		longitude: number;
	}

	let defaultSpeed = $state<number>(30);
	let movingThreshold = $state<number>(20);
	let apiEndpoint = $state<string>(import.meta.env.VITE_API_ENDPOINT || '');

	let fullscreenTrigger = $state<HTMLElement | null>(null);

	let currentSpeed: number | null = $state(null);
	let previousCoordinates: Coordinates | null = $state(null);
	let currentCoordinates: Coordinates | null = $state(null);
	let speedLimit = $derived<number>(defaultSpeed);
	let streetName = $state<string>('current road');

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
		speedLimit = parseInt(maxspeedTag, 10) || defaultSpeed;
	}

	function toggleFullscreen() {
		document.documentElement.requestFullscreen();
		fullscreenTrigger?.classList.add('hidden');
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

<main class="flex flex-col w-screen h-screen items-center justify-center gap-4 text-center">
	<button bind:this={fullscreenTrigger} onclick={toggleFullscreen}>Open fullscreen</button>
	<ConfigDialog
		bind:defaultSpeed
		bind:movingThreshold
		bind:apiEndpoint />

	<h1 class="font-bold text-4xl flex items-center gap-2">
		On {streetName}
	</h1>

	<div class="flex flex-col items-center gap-x-6 gap-y-2 md:flex-row">
		<Speedlimit {speedLimit} />
		<div class="text-4xl">
			{currentSpeed ?? 0}km/h
		</div>
	</div>
</main>
