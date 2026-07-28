<script>
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let {
		defaultSpeed = $bindable(),
		movingThreshold = $bindable(),
		apiEndpoint = $bindable()
	} = $props();
</script>
<Dialog.Root>
	<Dialog.Trigger>
		<Badge>Open config</Badge>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit configuration</Dialog.Title>
			<Dialog.Description>Set up your tachometer</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-2">
			<Label for="defaultSpeed">Default speed</Label>
			<Input id="defaultSpeed" type="number" bind:value={defaultSpeed} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="threshold">Moving threshold in meters</Label>
			<Input id="threshold" type="number" bind:value={movingThreshold} />
		</div>
		<div class="flex flex-col gap-2">
			<Label for="apiEndpoint">API endpoint</Label>
			<Input id="apiEndpoint" type="url" bind:value={apiEndpoint} />
		</div>
	</Dialog.Content>
</Dialog.Root>