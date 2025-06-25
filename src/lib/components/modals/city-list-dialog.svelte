<script lang="ts">
  import { onMount } from "svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import DynamicTable from "$lib/components/table.svelte";
  import Search from "@lucide/svelte/icons/search";
  import Edit from "@lucide/svelte/icons/edit";
  import RefreshCcw from "@lucide/svelte/icons/refresh-ccw";
  import CityCreateDialog from "./city-create-dialog.svelte";
  import ScrollArea from "../ui/scroll-area/scroll-area.svelte";
  import Input from "../ui/input/input.svelte";


    let { data, pickedItem = $bindable() } = $props();

    let uri = "#";

    const columns = [
      { label: 'ID', key: 'id', class: 'w-[50px]' },
      { label: 'Nome', key: 'nome' },
      { label: 'Estado', key: 'state_nome'},
      ];

    let rowData:any = $state();

    async function refresh() {
        const response = await fetch("/cidade");
        let countryRows = await response.json();
        rowData = await countryRows;
    }

    onMount(() => {
        refresh();
    })

    function handleSelect(row) {
		pickedItem = row;
	}


    // --- Lógica de busca e paginação adicionada ---
	let searchValue = $state('');
	let page = $state(1);
	const pageSize = 8;

	const filteredData = $derived(
		rowData?.filter((row) => {
			const search = searchValue.toLowerCase();
			return (
				(row.nome || '').toLowerCase().includes(search) ||
				(row.state_nome || '').toLowerCase().includes(search)
			);
		}) ?? []
	);

	const pagedData = $derived(filteredData.slice((page - 1) * pageSize, page * pageSize));
	const totalPages = $derived(Math.ceil(filteredData.length / pageSize));

	function handleSearchInput(e: Event) {
		searchValue = (e.target as HTMLInputElement).value;
		page = 1;
	}


</script>

<Dialog.Root>
	<Dialog.Trigger type="button" class={buttonVariants({ variant: 'default' })}>
		<Search />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-3xl">
		<Dialog.Header>
			<Dialog.Title class="text-2xl">Escolher Cidade</Dialog.Title>
		</Dialog.Header>

		<div class="flex items-center justify-between py-4">
			<Input
				placeholder="Filtrar por cidade ou estado..."
				value={searchValue}
				oninput={handleSearchInput}
				class="max-w-sm"
			/>
			<div class="flex gap-2">
				<Button variant="outline" size="icon" onclick={refresh} title="Atualizar Lista">
					<RefreshCcw class="h-4 w-4" />
				</Button>
				<CityCreateDialog {data} updateList={refresh()} />
			</div>
		</div>

		<div class="rounded-md border">
			<ScrollArea class="h-[400px]">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[120px]">Ação</Table.Head>
							<Table.Head class="w-[80px]">ID</Table.Head>
							<Table.Head>Nome</Table.Head>
							<Table.Head>Estado</Table.Head>
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
									<Table.Cell>{row.nome}</Table.Cell>
									<Table.Cell>{row.state_nome} ({row.state_sigla})</Table.Cell>
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