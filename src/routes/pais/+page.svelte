<script lang="ts">
    export let data: { countries: Array<{ id: number; nome: string; sigla: string }> };
    import Button from "$lib/components/ui/button/button.svelte";
    import DynamicTable from "$lib/components/table.svelte";
    import * as Table from "$lib/components/ui/table/index.js";

    const columns = [
    { label: 'ID', key: 'id', class: 'w-[100px]' },
    { label: 'Nome', key: 'nome' },
    { label: 'Sigla', key: 'sigla' }
    ];

  </script>

<h1 class="font-semibold text-3xl mb-10">Países</h1>
<Button style="float: right; margin-bottom: 1em" href="/pais/novo">Novo País</Button>

<DynamicTable {columns} rows={data.countries}>
  <svelte:fragment slot="extraHead">
    <Table.Head class="text-right pr-16">Ações</Table.Head>
  </svelte:fragment>

  <svelte:fragment slot="rowExtras" let:row>
    <Table.Cell class="text-right">
      <Button href={`/pais/${row.id}`}>Detalhes</Button>
    </Table.Cell>
  </svelte:fragment>
</DynamicTable>
