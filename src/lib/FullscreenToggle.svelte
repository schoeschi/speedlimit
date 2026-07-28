<script lang="ts">
  import { Maximize, Minimize } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index.js";

  let isFullscreen = $state<boolean>(false);

  function toggleFullscreen() {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }

    isFullscreen = !isFullscreen;
  }
</script>

<Button onclick={toggleFullscreen}
        size="icon-lg"
        variant="secondary">
  {#if isFullscreen}
    <Minimize />
  {:else}
    <Maximize />
  {/if}
</Button>