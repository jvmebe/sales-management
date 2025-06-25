<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { productUnitSchema } from '$lib/validation/productUnitSchema';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import * as Form from '$lib/components/ui/form';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import FormInput from '$lib/components/form-input.svelte';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(productUnitSchema)
	});

	const { form: formData, enhance } = form;
</script>

<div class="mb-4 flex items-center gap-4">
	<Button href="/produto/unidade-medida" variant="outline" size="icon">
		<ArrowLeft class="h-4 w-4" />
	</Button>
	<h1 class="text-2xl font-bold">Nova Unidade de Medida</h1>
</div>

<form method="POST" use:enhance class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<FormInput {form} name="nome" label="Nome da Unidade" bind:userInput={$formData.nome} />
		<FormInput {form} name="sigla" label="Sigla" bind:userInput={$formData.sigla} />
	</div>

	<Form.Field {form} name="ativo" class="flex flex-row items-center space-x-3 space-y-0 pt-2">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex items-center gap-2">
					<Checkbox {...props} bind:checked={$formData.ativo} />
					<Label>Ativo</Label>
				</div>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<div class="flex justify-end">
		<Form.Button>Salvar Unidade</Form.Button>
	</div>
</form>