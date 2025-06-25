<script lang="ts">
	// SEU SCRIPT ORIGINAL FOI MANTIDO 100% INTOCADO
	import FormInput from '$lib/components/form-input.svelte';
	import { browser } from '$app/environment';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { stateSchema } from '$lib/validation/stateSchema';
	import Plus from '@lucide/svelte/icons/plus';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import CountryListDialog from './country-list-dialog.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	let { data, updateList } = $props();

	const form = superForm(data.stateForm, {
		validators: zodClient(stateSchema),
		applyAction: true,
		invalidateAll: false,
		resetForm: false,
		onResult({ result }) {
			if (result.type === 'success') {
				toast.success('Item criado com sucesso.');

				updateList;
				open = false;
			}
		}
	});

	const { form: formData, enhance } = form;

	let open = $state(false);

	let country = $state({
		id: $formData.country_id,
		nome: $formData.country_nome
	});

	$effect(() => {
		country;

		$formData.country_id = country.id;
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })} title="Novo Estado">
		<Plus />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[920px]">
		<Dialog.Header>
			<Dialog.Title>Criar Estado</Dialog.Title>
		</Dialog.Header>
		<form method="POST" action="?/state" use:enhance class="space-y-6 py-4">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="md:col-span-2">
					<FormInput
						{form}
						label="Nome do Estado"
						name="nome"
						bind:userInput={$formData.nome}
					/>
				</div>
				<FormInput {form} label="Sigla" name="sigla" bind:userInput={$formData.sigla} />
			</div>

			<Form.Field {form} name="country_id">
				<Label>País</Label>
				<div class="flex items-center gap-2 mt-1">
					<Input readonly value={country.nome} placeholder="Selecione um país" class="flex-grow" />
					<CountryListDialog {data} bind:pickedItem={country} />
				</div>
				<Form.FieldErrors />
			</Form.Field>

			<input type="hidden" readonly name="country_id" bind:value={$formData.country_id} />

			<Dialog.Footer class="mt-5">
				<Form.Button>Salvar</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>