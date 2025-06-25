<script lang="ts">
	import { onMount } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import Search from '@lucide/svelte/icons/search';
	import RefreshCcw from '@lucide/svelte/icons/refresh-ccw';
	import Edit from '@lucide/svelte/icons/edit';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	// Assumindo que teremos um modal de criação correspondente
	//import PaymentConditionCreateDialog from './PaymentConditionCreateDialog.svelte';

	// Props do componente
	let { data, pickedItem = $bindable() } = $props();

	let uri = '/condicao-pagamento';

	// --- Lógica de busca e paginação ---
	let rowData: any[] = $state([]);
	let searchValue = $state('');
	let page = $state(1);
	const pageSize = 8;

	async function refresh() {
		const response = await fetch('/condicao-pagamento'); // Endpoint correto
		rowData = await response.json();
		page = 1;
	}

	onMount(() => {
		refresh();
	});

	const filteredData = $derived(
		rowData?.filter((row) => {
			const search = searchValue.toLowerCase();
			return (
				(row.descricao || '').toLowerCase().includes(search) ||
				(row.num_parcelas || '').toString().includes(search)
			);
		}) ?? []
	);

	const pagedData = $derived(filteredData.slice((page - 1) * pageSize, page * pageSize));
	const totalPages = $derived(Math.ceil(filteredData.length / pageSize));

	function handleSearchInput(e: Event) {
		searchValue = (e.target as HTMLInputElement).value;
		page = 1;
	}

	function handleSelect(row) {
		pickedItem = row;
	}
</script>

<Dialog.Root>
	<Dialog.Trigger type="button" class={buttonVariants({ variant: 'default' })}>
		<Search />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-3xl">
		<Dialog.Header>
			<Dialog.Title class="text-2xl">Escolher Condição de Pagamento</Dialog.Title>
		</Dialog.Header>

		<div class="flex items-center justify-between py-4">
			<Input
				placeholder="Filtrar por descrição ou nº de parcelas..."
				value={searchValue}
				oninput={handleSearchInput}
				class="max-w-sm"
			/>
			<div class="flex gap-2">
				<Button variant="outline" size="icon" onclick={refresh} title="Atualizar Lista">
					<RefreshCcw class="h-4 w-4" />
				</Button>
				<!-- <PaymentConditionCreateDialog {data} on:success={refresh} /> --> 
			</div>
		</div>

		<div class="rounded-md border">
			<ScrollArea class="h-[400px]">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[120px]">Ação</Table.Head>
							<Table.Head class="w-[80px]">ID</Table.Head>
							<Table.Head>Descrição</Table.Head>
							<Table.Head>Nº Parcelas</Table.Head>
							<Table.Head class="w-[80px] text-right">Detalhes</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if pagedData.length > 0}
							{#each pagedData as row (row.id)}
								<Table.Row>
									<Table.Cell>
										<Dialog.Close>
											<Button size="sm" onclick={() => handleSelect(row)}>Selecionar</Button>
										</Dialog.Close>
									</Table.Cell>
									<Table.Cell class="font-medium">{row.id}</Table.Cell>
									<Table.Cell>{row.descricao}</Table.Cell>
									<Table.Cell>{row.num_parcelas}</Table.Cell>
									<Table.Cell class="text-right">
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={`${uri}/${row.id}`}
											class={buttonVariants({ variant: 'outline', size: 'icon' })}
											title="Ver Detalhes"
										>
											<Edit class="h-4 w-4" />
										</a>
									</Table.Cell>
								</Table.Row>
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={5} class="h-24 text-center"
									>Nenhum resultado encontrado.</Table.Cell
								>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			</ScrollArea>
		</div>

		<Dialog.Footer class="flex items-center justify-end space-x-4 pt-4 sm:justify-end">
			<span class="text-sm text-muted-foreground">
				Página {page} de {totalPages > 0 ? totalPages : 1}
			</span>
			<Button
				variant="outline"
				size="sm"
				onclick={() => (page > 1 ? page-- : null)}
				disabled={page <= 1}
			>
				Anterior
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => (page < totalPages ? page++ : null)}
				disabled={page >= totalPages}
			>
				Próxima
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>