<script lang="ts">
	import { browser } from '$app/environment';
	import FormInput from '$lib/components/form-input.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { citySchema } from '$lib/validation/citySchema';
	import Plus from '@lucide/svelte/icons/plus';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import StateListDialog from './state-list-dialog.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	let { data, updateList } = $props();

	const form = superForm(data.cityForm, {
		validators: zodClient(citySchema),
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

	let state = $state({
		id: $formData.state_id,
		nome: $formData.state_nome
	});

	$effect(() => {
		state;
		$formData.state_id = state.id;
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })} title="Nova Cidade">
		<Plus />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Criar Cidade</Dialog.Title>
		</Dialog.Header>
		<form method="POST" action="?/city" use:enhance class="space-y-6 py-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
				<FormInput
					{form}
					label="Nome da Cidade"
					name="nome"
					bind:userInput={$formData.nome}
				/>

				<Form.Field {form} name="state_id">
					<Label>Estado</Label>
					<div class="flex items-center gap-2 mt-1">
						<Input readonly value={state.nome} placeholder="Selecione um estado" />
						<StateListDialog {data} bind:pickedItem={state} />
					</div>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			
			<input type="hidden" readonly name="state_id" bind:value={$formData.state_id} />

			<Dialog.Footer class="mt-5">
				<Form.Button>Salvar</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>