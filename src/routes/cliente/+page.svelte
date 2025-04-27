<script lang="ts">
  export let data: { clients: Array<{ id: number; nome: string; email: string; cidade_nome: string }> };
  console.log(data)
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import DynamicTable from "$lib/components/table.svelte";

  const columns = [
    { label: 'ID', key: 'id', class: 'w-[100px]' },
    { label: 'Nome', key: 'nome' },
    { label: 'Email', key: 'email' },
    { label: 'Cidade', key: 'cidade_nome' }
    ];
</script>

<h1 class="text-3xl">Clientes</h1>
<Button style="float: right; margin-bottom: 1em" href="/cliente/novo">Novo Cliente</Button>

<DynamicTable {columns} rows={data.clients}>
  <svelte:fragment slot="extraHead">
    <Table.Head class="text-right pr-16">Ações</Table.Head>
  </svelte:fragment>

  <svelte:fragment slot="rowExtras" let:row>
    <Table.Cell class="text-right">
      <Button href={`/cliente/${row.id}`}>Detalhes</Button>
    </Table.Cell>
  </svelte:fragment>
</DynamicTable>
