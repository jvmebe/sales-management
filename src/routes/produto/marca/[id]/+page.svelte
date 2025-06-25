<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { productBrandSchema } from '$lib/validation/productBrandSchema';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, Trash2 } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import * as Form from '$lib/components/ui/form';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import FormInput from '$lib/components/form-input.svelte';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(productBrandSchema)
	});

	const { form: formData, enhance } = form;

	function formatDate(dateString: string | null | undefined) {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleString('pt-BR');
	}

	// Usando o padrão corrigido para o confirm delete
	function confirmDelete(e: Event) {
		if (!confirm('Tem certeza que deseja deletar esta marca?')) {
			e.preventDefault();
		}
	}
</script>

<div class="mb-4 flex items-center gap-4">
	<Button href="/produto/marca" variant="outline" size="icon">
		<ArrowLeft class="h-4 w-4" />
	</Button>
	<h1 class="text-2xl font-bold">Editar Marca: {data.brand.nome}</h1>
</div>

<form method="POST" action="?/update" use:enhance class="space-y-6" id="update-form">
	<FormInput {form} name="nome" label="Nome da Marca" bind:userInput={$formData.nome} />

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

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
		<div>
			<Label class="text-sm font-medium text-muted-foreground">Data de Cadastro</Label>
			<p class="text-sm mt-1">{formatDate(data.brand.data_cadastro)}</p>
		</div>
		<div>
			<Label class="text-sm font-medium text-muted-foreground">Última Edição</Label>
			<p class="text-sm mt-1">{formatDate(data.brand.data_ultima_edicao)}</p>
		</div>
	</div>
</form>

<div class="flex justify-between items-center mt-8">
	<form method="POST" action="?/delete" use:enhance>
		<Button variant="destructive" type="submit" onclick={confirmDelete}>
			<Trash2 class="mr-2 h-4 w-4" />
			Deletar
		</Button>
	</form>

	<Button type="submit" form="update-form"> Salvar Alterações </Button>
</div>