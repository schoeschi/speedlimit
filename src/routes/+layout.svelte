<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { SplashScreen } from "@capacitor/splash-screen";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  let { children } = $props();

  let isLoading = $state<boolean>(true);

  async function loadingScreen(): Promise<void> {
    await SplashScreen.hide({ fadeOutDuration: 100 });
  }

  onMount(() => {
    loadingScreen();
  });

  function handleLaunchEnd() {
    isLoading = false;
  }
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

{#if isLoading}
  <div
    class="fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-white scrollbar-none overflow-hidden"
    out:slide>
    <video src="/logo_animated.webm"
           autoplay
           muted
           playsinline
           onended={handleLaunchEnd}
           poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"></video>
  </div>
{/if}