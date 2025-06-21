<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { transportadoraSchema } from '$lib/validation/transportadoraSchema';

	// Componentes
	import FormInput from '$lib/components/form-input.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from 'lucide-svelte';

	let {data} = $props();

	const form = superForm(data.form, {
		validators: zodClient(transportadoraSchema)
	});

	const { form: formData, enhance } = form;

	const isJuridica = $derived($formData.is_juridico);

	const labelNome = $derived(isJuridica ? 'Razão Social' : 'Nome Completo');
	const labelApelido = $derived(isJuridica ? 'Nome Fantasia' : 'Apelido');
	const labelDocumento1 = $derived(isJuridica ? 'CNPJ' : 'CPF');
	const labelDocumento2 = $derived(isJuridica ? 'IE (Inscrição Estadual)' : 'RG');
	const labelData = $derived(isJuridica ? 'Data de Fundação' : 'Data de Nascimento');
</script>

<div class="mb-4 flex items-center gap-4">
	<Button href="/transportadora" variant="outline" size="icon">
		<ArrowLeft class="h-4 w-4" />
	</Button>
	<h1 class="text-2xl font-bold">Nova Transportadora</h1>
</div>

<form method="POST" use:enhance class="space-y-6">
	<div class="flex items-center space-x-6 pt-2">
		<Form.Field {form} name="is_juridico" class="flex flex-row items-center space-x-3 space-y-0">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex items-center gap-2">
						<Checkbox {...props} bind:checked={$formData.is_juridico} />
						<Form.Label>Pessoa Jurídica</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<FormInput {form} name="nome" label={labelNome} bind:userInput={$formData.nome} classes="col-span-2" />
		<FormInput {form} name="apelido" label={labelApelido} bind:userInput={$formData.apelido} />
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<FormInput {form} name="cpf" label={labelDocumento1} bind:userInput={$formData.cpf} />
		<FormInput {form} name="rg" label={labelDocumento2} bind:userInput={$formData.rg} />
		<FormInput {form} name="data_nascimento" label={labelData} type="date" bind:userInput={$formData.data_nascimento} />
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<FormInput {form} name="email" label="Email" type="email" bind:userInput={$formData.email} />
		<FormInput {form} name="telefone" label="Telefone" bind:userInput={$formData.telefone} />
	</div>

	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<FormInput {form} name="endereco" label="Endereço" bind:userInput={$formData.endereco} classes="col-span-3" />
		<FormInput {form} name="numero" label="Número" type="number" bind:userInput={$formData.numero} />
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<FormInput {form} name="bairro" label="Bairro" bind:userInput={$formData.bairro} />
		<FormInput {form} name="cep" label="CEP" bind:userInput={$formData.cep} />
		<FormInput {form} name="cidade_id" label="Cidade (ID)" type="number" bind:userInput={$formData.cidade_id} />
	</div>

	<div class="flex items-center space-x-6 pt-2">
		<Form.Field {form} name="ativo" class="flex flex-row items-center space-x-3 space-y-0">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex items-center gap-2">
						<Checkbox {...props} bind:checked={$formData.ativo} />
						<Form.Label>Ativo</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
	</div>

	<div class="flex justify-end">
		<Form.Button>Salvar</Form.Button>
	</div>
</form>