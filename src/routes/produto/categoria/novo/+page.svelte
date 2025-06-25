<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { productCategorySchema } from '$lib/validation/productCategorySchema';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea'; // Usaremos Textarea para a descrição
	import { Checkbox } from '$lib/components/ui/checkbox';
	import FormInput from '$lib/components/form-input.svelte';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(productCategorySchema)
	});

	const { form: formData, enhance } = form;
</script>

<div class="mb-4 flex items-center gap-4">
	<Button href="/produto/categoria" variant="outline" size="icon">
		<ArrowLeft class="h-4 w-4" />
	</Button>
	<h1 class="text-2xl font-bold">Nova Categoria de Produto</h1>
</div>

<form method="POST" use:enhance class="space-y-6">
	<FormInput {form} name="nome" label="Nome da Categoria" bind:userInput={$formData.nome} />

	<Form.Field {form} name="descricao">
		<Form.Control>
			{#snippet children({ props })}
				<Label>Descrição</Label>
				<Textarea
					{...props}
					bind:value={$formData.descricao}
					placeholder="Digite uma breve descrição para a categoria (opcional)"
					class="mt-1"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

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
		<Form.Button>Salvar Categoria</Form.Button>
	</div>
</form>