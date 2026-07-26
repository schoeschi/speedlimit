<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {getDistance} from "geolib";
    import {onMount} from "svelte";
    import Speedlimit from "$lib/Speedlimit.svelte";
    import {overpass} from "overpass-ts";
    import {Badge} from "$lib/components/ui/badge/index.js";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";

    interface Coordinates {
        latitude: number;
        longitude: number;
    }

    let defaultSpeed: number = $state(30);
    let apiEndpoint: string = $derived(import.meta.env.VITE_apiEndpoint);

    let movingThreshold: number = $state(20);
    let speedLimit: number = $derived(defaultSpeed);

    let streetName: string = $state("current road")

    let fullscreenTrigger: HTMLElement;
    let configTrigger: HTMLElement;

    let currentCoordinates: Coordinates | null = $state(null);
    let currentSpeed: number = $state(0);
    let previousCoordinates: Coordinates | null = $state(null);

    async function fetchCurrentSpeedlimit(coordinates: Coordinates): Promise<void> {
        const query = `
        [out:json][timeout:5];
        way(around:15, ${coordinates.latitude}, ${coordinates.longitude})[highway][maxspeed];
        out tags;
        `;

        const res = await overpass(query, {endpoint: apiEndpoint});
        const data = await res.json();

        const road = data.elements?.find((el: { tags: { highway: string; }; }) =>
            el.tags?.highway && !['footway', 'cycleway', 'pedestrian', 'path'].includes(el.tags.highway)
        );

        streetName = road?.tags?.name || road?.tags?.ref || "current road";

        const maxspeedTag: string = road?.tags?.maxspeed;
        speedLimit = parseInt(maxspeedTag, 10) || defaultSpeed;
    }

    function fullscreen() {
        document.documentElement.requestFullscreen();
        fullscreenTrigger.remove();
        configTrigger.remove();
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
    <button bind:this={fullscreenTrigger} onclick={fullscreen}>Open fullscreen</button>

    <Dialog.Root bind:this={configTrigger}>
        <Dialog.Trigger>
            <Badge>Open config</Badge>
        </Dialog.Trigger>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>Edit configuration</Dialog.Title>
                <Dialog.Description>Set up your tachometer</Dialog.Description>
            </Dialog.Header>

            <div class="flex flex-col gap-2">
                <Label for="apiEndpoint">Default speed</Label>
                <Input id="apiEndpoint" type="number" bind:value={defaultSpeed}/>
            </div>
            <div class="flex flex-col gap-2">
                <Label for="threshold">Moving threshold in meters</Label>
                <Input id="threshold" type="number" bind:value={movingThreshold}/>
            </div>
            <div class="flex flex-col gap-2">
                <Label for="apiEndpoint">API endpoint</Label>
                <Input id="apiEndpoint" type="url" bind:value={apiEndpoint}/>
            </div>
        </Dialog.Content>
    </Dialog.Root>

    <h1 class="font-bold text-4xl flex items-center gap-2">
        On {streetName}
    </h1>

    <div class="flex items-center gap-6">
        <Speedlimit {speedLimit}/>
        <div class="text-4xl">
            {currentSpeed}km/h
        </div>
    </div>
</main>
