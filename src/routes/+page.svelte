<script lang="ts">
  import { getDistance } from "geolib";
  import { onMount } from "svelte";
  import { type OverpassJson, overpassJson } from "overpass-ts";
  import Speedlimit from "$lib/Speedlimit.svelte";
  import ConfigDialog from "$lib/ConfigDialog.svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { slide } from "svelte/transition";
  import FullscreenToggle from "$lib/FullscreenToggle.svelte";
  import NumberFlow from "@number-flow/svelte";
  import { browser } from "$app/env";
  import { Capacitor } from "@capacitor/core";
  import { Preferences } from "@capacitor/preferences";

  interface Coordinates {
		latitude: number;
		longitude: number;
	}

  const isNative = browser && Capacitor.isNativePlatform();

  let apiEndpoint = $state<string>('');
  let movingThreshold = $state<number>(20);

	let currentSpeed: number | null = $state(null);
	let previousCoordinates: Coordinates | null = $state(null);
	let currentCoordinates: Coordinates | null = $state(null);
	let speedLimit = $state<number | null>(null);
	let streetName = $state<string | null>(null);

  Preferences.get({ key: 'apiEndpoint' }).then(({ value }) => {
    if (value) apiEndpoint = value;
  });

  Preferences.get({ key: 'movingThreshold' }).then(({ value }) => {
    if (value) movingThreshold = parseInt(value);
  });

  $effect(() => {
    Preferences.set({ key: 'apiEndpoint', value: apiEndpoint });
  });

  $effect(() => {
    Preferences.set({ key: 'movingThreshold', value: String(movingThreshold) });
  });

  $effect(() => {
    if (apiEndpoint.trim() !== '' && currentCoordinates) {
      fetchCurrentSpeedLimit(currentCoordinates);
    }
  });

	async function fetchCurrentSpeedLimit(coordinates: Coordinates): Promise<void> {
		const query = `
        [out:json];
        way(around:15, ${coordinates.latitude}, ${coordinates.longitude})[highway][maxspeed];
        out tags;
        `;

    const data: OverpassJson = await overpassJson(query, { endpoint: apiEndpoint });

    const road = data.elements?.find((el) => {
      if (!('tags' in el) || !el.tags) return false;

      const tags = el.tags as Record<string, string | undefined>;
      const highway = tags.highway;

      return highway && !['footway', 'cycleway', 'pedestrian', 'path'].includes(highway);
    });

    const tags = road && 'tags' in road ? (road.tags as Record<string, string>) : {};

    streetName = tags.name || tags.ref || null;
    speedLimit = parseInt(tags.maxspeed) || null;
	}

	onMount(() => {
		const watchId = navigator.geolocation.watchPosition((position) => {
      currentSpeed = Math.round((position.coords.speed ?? 0) * 3.6);

      if (apiEndpoint.trim() === '') return;

      currentCoordinates = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			};
      if (!previousCoordinates) {
        previousCoordinates = currentCoordinates;
        fetchCurrentSpeedLimit(currentCoordinates);
        return;
			}

			let metersTravelled = getDistance(previousCoordinates, currentCoordinates);
      if (metersTravelled > movingThreshold) {
        fetchCurrentSpeedLimit(currentCoordinates);
        previousCoordinates = currentCoordinates;
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
  {#if !isNative}
    <FullscreenToggle />
  {/if}
</header>

<main class="flex flex-col w-screen h-screen items-center justify-center gap-4 text-center">
	<div transition:slide>
		<Speedlimit {speedLimit} />
	</div>

	{#if streetName}
    <div transition:slide>
      <Badge class="text-blue-500" variant="secondary">
        {streetName}
      </Badge>
    </div>
	{/if}
</main>

<footer class="flex justify-center fixed w-screen p-4 bottom-0 text-center text-5xl font-bold" transition:slide>
  {#if currentSpeed}
    <NumberFlow
      value={currentSpeed}
      suffix=" km/h" />
  {/if}
</footer>
