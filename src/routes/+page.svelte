<script lang="ts">
	import { dndzone } from "svelte-dnd-action";

	let shortcuts = [];

	function handleDrop(event) {
		const { items, info } = event.detail;
		if (info.trigger === 'drop') {
			// Clone the item instead of moving
			const newItem = { ...info.source.item, id: generateUniqueId() };
			shortcuts = [...shortcuts, newItem];
		}
}

</script>

<div
	use:dndzone={{ items: shortcuts, type: 'shortcut' }}
	on:consider={handleDrop}
	on:finalize={handleDrop}
	class="shortcut-dropzone"
>
	{#each shortcuts as shortcut (shortcut.id)}
		<div class="shortcut-item">
			<a href={shortcut.url}>{shortcut.title}</a>
		</div>
	{/each}
</div>
