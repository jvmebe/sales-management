<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { PlusCircle, Edit } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';

	let { data } = $props();

	// --- Estado para a busca e paginação ---
	let searchValue = $state('');
	let page = $state(1);
	const pageSize = 10;

	// --- Lógica reativa ---
	const filteredData = $derived(
		data.units?.filter((unit) => {
			const search = searchValue.toLowerCase();
			const nome = (unit.nome || '').toLowerCase();
			const sigla = (unit.sigla || '').toLowerCase();

			return nome.includes(search) || sigla.includes(search);
		}) ?? []
	);

	const pagedData = $derived(filteredData.slice((page - 1) * pageSize, page * pageSize));

	const totalPages = $derived(Math.ceil(filteredData.length / pageSize));

	function handleSearchInput(e: Event) {
		searchValue = (e.target as HTMLInputElement).value;
		page = 1;
	}
</script>

<div class="mb-4 flex justify-between items-center">
	<h1 class="text-2xl font-bold">Unidades de Medida</h1>
	<Button href="/produto/unidade-medida/novo">
		<PlusCircle class="mr-2 h-4 w-4" />
		Nova Unidade
	</Button>
</div>

<div class="flex items-center py-4">
	<Input
		placeholder="Filtrar por nome ou sigla..."
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
				<Table.Head>Ativo</Table.Head>
				<Table.Head class="w-[100px] text-right">Ações</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if pagedData.length > 0}
				{#each pagedData as unit (unit.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{unit.id}</Table.Cell>
						<Table.Cell>{unit.nome}</Table.Cell>
						<Table.Cell>{unit.sigla}</Table.Cell>
						<Table.Cell>
							{#if unit.ativo}
								<Badge>Sim</Badge>
							{:else}
								<Badge variant="destructive">Não</Badge>
							{/if}
						</Table.Cell>
						<Table.Cell class="text-right">
							<Button variant="outline" size="icon" href={`/produto/unidade-medida/${unit.id}`}>
								<Edit class="h-4 w-4" />
								<span class="sr-only">Editar</span>
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={5} class="h-24 text-center"> Nenhuma unidade encontrada. </Table.Cell>
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