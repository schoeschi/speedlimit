<script>
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { slide } from "svelte/transition";
</script>

<main class="flex sm:flex-row flex-col items-center justify-center flex-1 h-screen gap-x-6 gap-y-16" transition:slide>
  <div class="flex flex-col gap-3 text-5xl font-semibold">
    New journey
    <Button variant="secondary" href="driving">Use without navigation</Button>
  </div>
  <div class="flex flex-col items-center gap-y-4">
    <Input placeholder="Enter destination" class="px-6 py-3 h-fit text-xl" />
    <Button class="w-full py-6 text-lg">Start journey</Button>
  </div>
</main>
