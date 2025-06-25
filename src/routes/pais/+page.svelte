<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input'; // Importamos o Input
	import { PlusCircle, Edit } from 'lucide-svelte';

	let { data } = $props();

	let searchValue = $state('');
	let page = $state(1);
	const pageSize = 10;
	
	const filteredData = $derived(
		data.countries?.filter((country) =>
			country.nome.toLowerCase().includes(searchValue.toLowerCase())
		) ?? []
	);


	const pagedData = $derived(
		filteredData.slice((page - 1) * pageSize, page * pageSize)
	);


	const totalPages = $derived(Math.ceil(filteredData.length / pageSize));

  
    function handleSearchInput(e: Event) {
        searchValue = (e.target as HTMLInputElement).value;
        page = 1;
    }
</script>

<div class="mb-4 flex justify-between items-center">
	<h1 class="text-2xl font-bold">Países</h1>
	<Button href="/pais/novo">
		<PlusCircle class="mr-2 h-4 w-4" />
		Novo País
	</Button>
</div>

<div class="flex items-center py-4">
	<Input
		placeholder="Filtrar por nome..."
		value={searchValue}
        oninput={handleSearchInput}
		class="max-w-sm"
	/>
</div>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[100px]">ID</Table.Head>
				<Table.Head>Nome</Table.Head>
				<Table.Head>Sigla</Table.Head>
				<Table.Head class="w-[100px] text-right">Ações</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if pagedData.length > 0}
				{#each pagedData as country (country.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{country.id}</Table.Cell>
						<Table.Cell>{country.nome}</Table.Cell>
						<Table.Cell>{country.sigla}</Table.Cell>
						<Table.Cell class="text-right">
							<Button variant="outline" size="icon" href={`/pais/${country.id}`}>
								<Edit class="h-4 w-4" />
								<span class="sr-only">Editar</span>
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={4} class="h-24 text-center">
						Nenhum resultado encontrado.
					</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</div>

<div class="flex items-center justify-end space-x-4 py-4">
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
</div>