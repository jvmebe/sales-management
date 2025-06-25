<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { PlusCircle, Edit } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';

	let { data } = $props();

	let searchValue = $state('');
	let page = $state(1);
	const pageSize = 10;

	const filteredData = $derived(
		data.products?.filter((product) => {
			const search = searchValue.toLowerCase();
			const nome = (product.nome || '').toLowerCase();
			const brand = (product.brand_name || '').toLowerCase();
			const category = (product.category_name || '').toLowerCase();

			return nome.includes(search) || brand.includes(search) || category.includes(search);
		}) ?? []
	);

	const pagedData = $derived(filteredData.slice((page - 1) * pageSize, page * pageSize));
	const totalPages = $derived(Math.ceil(filteredData.length / pageSize));

	function handleSearchInput(e: Event) {
		searchValue = (e.target as HTMLInputElement).value;
		page = 1;
	}

	function formatCurrency(value: number) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}
</script>

<div class="mb-4 flex justify-between items-center">
	<h1 class="text-2xl font-bold">Produtos</h1>
	<Button href="/produto/novo">
		<PlusCircle class="mr-2 h-4 w-4" />
		Novo Produto
	</Button>
</div>

<div class="flex items-center py-4">
	<Input
		placeholder="Filtrar por nome, marca ou categoria..."
		value={searchValue}
		oninput={handleSearchInput}
		class="max-w-sm"
	/>
</div>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Nome</Table.Head>
				<Table.Head>Marca</Table.Head>
				<Table.Head>Categoria</Table.Head>
				<Table.Head>Valor Venda</Table.Head>
				<Table.Head>Estoque</Table.Head>
				<Table.Head>Ativo</Table.Head>
				<Table.Head class="w-[100px] text-right">Ações</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if pagedData.length > 0}
				{#each pagedData as product (product.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{product.nome}</Table.Cell>
						<Table.Cell>{product.brand_name || '-'}</Table.Cell>
						<Table.Cell>{product.category_name || '-'}</Table.Cell>
						<Table.Cell>{formatCurrency(product.valor_venda)}</Table.Cell>
						<Table.Cell>{product.estoque}</Table.Cell>
						<Table.Cell>
							{#if product.ativo}
								<Badge>Sim</Badge>
							{:else}
								<Badge variant="destructive">Não</Badge>
							{/if}
						</Table.Cell>
						<Table.Cell class="text-right">
							<Button variant="outline" size="icon" href={`/produto/${product.id}`}>
								<Edit class="h-4 w-4" />
								<span class="sr-only">Editar</span>
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={7} class="h-24 text-center"> Nenhum produto encontrado. </Table.Cell>
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