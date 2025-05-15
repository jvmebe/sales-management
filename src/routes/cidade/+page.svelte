<script lang="ts">
  export let data: { cities: Array<{ id: number; nome: string; state_nome: string; state_sigla: string }> };
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import DynamicTable from "$lib/components/table.svelte";

  const columns = [
    { label: 'ID', key: 'id', class: 'w-[100px]' },
    { label: 'Nome', key: 'nome' },
    { label: 'Estado', key: 'state_nome' }
    ];


</script>

<h1 class="font-semibold text-3xl mb-10">Cidades</h1>
<Button style="float: right; margin-bottom: 1em" href="/cidade/novo">Nova Cidade</Button>

<DynamicTable {columns} rows={data.cities}>
  <svelte:fragment slot="extraHead">
    <Table.Head class="text-right pr-16">Ações</Table.Head>
  </svelte:fragment>

  <svelte:fragment slot="rowExtras" let:row>
    <Table.Cell class="text-right">
      <Button href={`/cidade/${row.id}`}>Detalhes</Button>
    </Table.Cell>
  </svelte:fragment>
</DynamicTable>
