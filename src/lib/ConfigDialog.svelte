<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Cog } from "@lucide/svelte";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { mode, setMode } from "mode-watcher";

  let checked = $state({
    get current() {
      return mode.current === "dark";
    },
    set current(checked: boolean) {
      setMode(checked ? "dark" : "light");
    }
  });

  let {
		movingThreshold = $bindable(),
		apiEndpoint = $bindable()
	} = $props();
</script>
<Dialog.Root>
  <form>
    <Dialog.Trigger>
      <Button size="icon-lg"
              variant="secondary">
        <Cog />
      </Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Edit configuration</Dialog.Title>
        <Dialog.Description>Set up your tachometer</Dialog.Description>
      </Dialog.Header>

      <div class="flex flex-col gap-2">
        <Label for="threshold">Moving threshold in meters</Label>
        <Input bind:value={movingThreshold} id="threshold" type="number" />
      </div>

      <div class="flex flex-col gap-2">
        <Label for="apiEndpoint">API endpoint</Label>
        <Input bind:value={apiEndpoint} id="apiEndpoint" type="url" />
      </div>

      <div class="flex justify-between">
        <Label for="darkModeToggle">Dark mode</Label>
        <Switch id="darkModeToggle" bind:checked={checked.current} />
      </div>

      <Dialog.Footer>
        <Dialog.Close
          type="button"
          class={buttonVariants({ variant: "default" })}
        >
          Save and close
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </form>
</Dialog.Root>