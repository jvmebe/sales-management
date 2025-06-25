<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { productSchema } from '$lib/validation/productSchema';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import * as Form from '$lib/components/ui/form';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Select from '$lib/components/ui/select';
	import FormInput from '$lib/components/form-input.svelte';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(productSchema)
	});

	const { form: formData, enhance } = form;

	const selectedBrandName = $derived(data.brands.find((b) => b.id === $formData.brand_id)?.nome);
	const selectedCategoryName = $derived(
		data.categories.find((c) => c.id === $formData.category_id)?.nome
	);
	const selectedUnitName = $derived(data.units.find((u) => u.id === $formData.unit_id)?.nome);
	const selectedSupplierName = $derived(
		data.suppliers.find((s) => s.id === $formData.supplier_id)?.nome
	);

	$effect(() => {
		const custo = $formData.valor_compra;
		const venda = $formData.valor_venda;
		if (custo > 0 && venda > 0) {
			const lucro = ((venda - custo) / custo) * 100;
			$formData.percentual_lucro = parseFloat(lucro.toFixed(2));
		}
	});
</script>

<div class="mb-4 flex items-center gap-4">
	<Button href="/produto" variant="outline" size="icon">
		<ArrowLeft class="h-4 w-4" />
	</Button>
	<h1 class="text-2xl font-bold">Novo Produto</h1>
</div>

<form method="POST" use:enhance class="space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<FormInput {form} name="nome" label="Nome do Produto" bind:userInput={$formData.nome} />
		<FormInput
			{form}
			name="codigo_barras"
			label="Código de Barras"
			bind:userInput={$formData.codigo_barras}
		/>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<Form.Field {form} name="brand_id">
			<Form.Control>
				{#snippet children({ props })}
					<Label>Marca</Label>
					<Select.Root bind:value={$formData.brand_id} name={props.name} type="single">
						<Select.Trigger {...props} class="w-full mt-1">
							{selectedBrandName ?? 'Selecione a marca'}
						</Select.Trigger>
						<Select.Content>
							{#each data.brands as brand}
								<Select.Item value={brand.id}>{brand.nome}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="category_id">
			<Form.Control>
				{#snippet children({ props })}
					<Label>Categoria</Label>
					<Select.Root bind:value={$formData.category_id} name={props.name} type="single">
						<Select.Trigger {...props} class="w-full mt-1">
							{selectedCategoryName ?? 'Selecione a categoria'}
						</Select.Trigger>
						<Select.Content>
							{#each data.categories as category}
								<Select.Item value={category.id}>{category.nome}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="unit_id">
			<Form.Control>
				{#snippet children({ props })}
					<Label>Unidade de Medida</Label>
					<Select.Root bind:value={$formData.unit_id} name={props.name} type="single">
						<Select.Trigger {...props} class="w-full mt-1">
							{selectedUnitName ?? 'Selecione a unidade'}
						</Select.Trigger>
						<Select.Content>
							{#each data.units as unit}
								<Select.Item value={unit.id}>{unit.nome} ({unit.sigla})</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="supplier_id">
			<Form.Control>
				{#snippet children({ props })}
					<Label>Fornecedor</Label>
					<Select.Root bind:value={$formData.supplier_id} name={props.name} type="single">
						<Select.Trigger {...props} class="w-full mt-1">
							{selectedSupplierName ?? 'Selecione o fornecedor'}
						</Select.Trigger>
						<Select.Content>
							{#each data.suppliers as supplier}
								<Select.Item value={supplier.id}>{supplier.nome}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<FormInput
			{form}
			name="valor_compra"
			label="Valor de Compra"
			type="number"
			bind:userInput={$formData.valor_compra}
		/>
		<FormInput
			{form}
			name="valor_venda"
			label="Valor de Venda"
			type="number"
			bind:userInput={$formData.valor_venda}
		/>
		<FormInput
			{form}
			name="percentual_lucro"
			label="% Lucro"
			type="number"
			bind:userInput={$formData.percentual_lucro}
		/>
	</div>

	<div class="flex items-end gap-4">
		<FormInput
			{form}
			name="estoque"
			label="Estoque Inicial"
			type="number"
			bind:userInput={$formData.estoque}
		/>
		<Form.Field {form} name="ativo" class="flex flex-row items-center space-x-3 space-y-0 pb-2">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex items-center gap-2">
						<Checkbox {...props} bind:checked={$formData.ativo} />
						<Label>Ativo</Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
	</div>

	<div class="flex justify-end">
		<Form.Button>Salvar Produto</Form.Button>
	</div>
</form>