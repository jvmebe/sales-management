<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';
	import { transportadoraSchema, type FormSchema } from '$lib/validation/transportadoraSchema';
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Separator } from '$lib/components/ui/separator';

	// Assumindo que estes componentes customizados existem no seu projeto
	import FormInput from '$lib/components/FormInput.svelte'; // Seu componente
	import PickerDialog from '$lib/components/PickerDialog.svelte'; // Seu componente

	export let form: SuperForm<FormSchema>;
	const { form: formData, enhance } = form;

	// Objeto local para o PickerDialog de cidade, como no seu exemplo
	let cidade = {
		id: $formData.cidade_id ?? null,
		nome: $formData.cidade_nome ?? '',
		state_nome: '' // Este campo seria preenchido pela seleção no PickerDialog
	};

	// Sincroniza o ID da cidade de volta para o formulário principal quando o picker a altera
	$: $formData.cidade_id = cidade?.id;
	$: $formData.cidade_nome = cidade?.nome;

	// Colunas para o PickerDialog de cidades, baseado nas rotas existentes 
	const cityColumns = [
		{ key: 'city_nome', label: 'Cidade' },
		{ key: 'state_nome', label: 'Estado' }
	];

	// Função para buscar cidades (exemplo)
	async function getCities() {
		const res = await fetch('/cidade'); // Endpoint que retorna a lista de cidades
		return await res.json();
	}
</script>

<Form.Fieldset class="space-y-6">
	<Form.Fieldset {form} name="is_juridico" class="space-y-3">
		<Form.Legend>Tipo de Pessoa</Form.Legend>
		<RadioGroup.Root
			bind:value={$formData.is_juridico}
			class="flex gap-4"
			name="is_juridico"
			value={true}
		>
			<div class="flex items-center space-x-3 space-y-0">
				<RadioGroup.Item value={false} id="fisica" />
				<Form.Label for="fisica" class="font-normal">Pessoa Física</Form.Label>
			</div>
			<div class="flex items-center space-x-3 space-y-0">
				<RadioGroup.Item value={true} id="juridica" />
				<Form.Label for="juridica" class="font-normal">Pessoa Jurídica</Form.Label>
			</div>
		</RadioGroup.Root>
		<Form.FieldErrors />
	</Form.Fieldset>

	<div class="flex flex-wrap gap-4">
		<FormInput
			{form}
			label="Nome / Razão Social"
			name="nome"
			classes="flex-grow min-w-[300px]"
			bind:userInput={$formData.nome}
		/>
		<FormInput
			{form}
			label="Nome Fantasia"
			name="nome_fantasia"
			classes="flex-grow min-w-[300px]"
			bind:userInput={$formData.nome_fantasia}
		/>
	</div>
	<div class="flex flex-wrap gap-4">
		<FormInput
			{form}
			label="CNPJ"
			name="cnpj"
			classes="w-full md:w-48"
			bind:userInput={$formData.cnpj}
		/>
		<FormInput
			{form}
			label="Inscrição Estadual"
			name="inscricao_estadual"
			classes="w-full md:w-48"
			bind:userInput={$formData.inscricao_estadual}
		/>
		<FormInput
			{form}
			label="RNTRC"
			name="rntrc"
			classes="w-full md:w-48"
			bind:userInput={$formData.rntrc}
		/>
	</div>

	<Separator class="my-4" />

	<h3 class="text-lg font-medium">Endereço</h3>
	<div class="flex flex-wrap items-end gap-4">
		<FormInput
			{form}
			label="Estado"
			name="estado_nome"
			readonly={true}
			classes="w-full md:w-48"
			bind:userInput={cidade.state_nome}
		/>
		<FormInput
			{form}
			label="Cidade"
			name="cidade_nome"
			readonly={true}
			classes="flex-grow min-w-[250px]"
			bind:userInput={cidade.nome}
		/>
		<div class="flex-shrink-0">
			<PickerDialog
				title="Escolher cidade"
				columns={cityColumns}
				bind:pickedItem={cidade}
				{getData}
				uri="cidade"
			/>
		</div>
	</div>
	<div class="flex flex-wrap gap-4">
		<FormInput
			{form}
			label="Endereço"
			name="endereco"
			classes="flex-grow min-w-[300px]"
			bind:userInput={$formData.endereco}
		/>
		<FormInput
			{form}
			label="Número"
			name="numero"
			classes="w-full md:w-24"
			bind:userInput={$formData.numero}
		/>
	</div>
	<div class="flex flex-wrap gap-4">
		<FormInput
			{form}
			label="Bairro"
			name="bairro"
			classes="flex-grow min-w-[200px]"
			bind:userInput={$formData.bairro}
		/>
		<FormInput
			{form}
			label="Complemento"
			name="complemento"
			classes="flex-grow min-w-[200px]"
			bind:userInput={$formData.complemento}
		/>
		<FormInput
			{form}
			label="CEP"
			name="cep"
			classes="w-full md:w-36"
			bind:userInput={$formData.cep}
		/>
	</div>

	<Separator class="my-4" />

	<h3 class="text-lg font-medium">Contato</h3>
	<div class="flex flex-wrap gap-4">
		<FormInput
			{form}
			label="Email"
			name="email"
			classes="flex-grow min-w-[250px]"
			bind:userInput={$formData.email}
		/>
		<FormInput
			{form}
			label="Telefone"
			name="telefone"
			classes="w-full md:w-48"
			bind:userInput={$formData.telefone}
		/>
	</div>

	<Separator class="my-4" />

	<Form.Field {form} name="ativo" class="flex items-center space-x-2">
		<Form.Control let:attrs>
			<Checkbox {...attrs} bind:checked={$formData.ativo} />
			<Form.Label>Transportadora Ativa</Form.Label>
		</Form.Control>
	</Form.Field>

	<input type="hidden" name="cidade_id" bind:value={$formData.cidade_id} />
</Form.Fieldset>