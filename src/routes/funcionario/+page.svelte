<script lang="ts">
    export let data: { employees: Array<{ id: number; nome: string; apelido: string; email: string; cidade_nome: string }> };

    import DynamicTable from "$lib/components/table.svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import Button from "$lib/components/ui/button/button.svelte";

    const columns = [
        { label: 'ID', key: 'id', class: 'w-[100px]' },
        { label: 'Nome', key: 'nome' },
        { label: 'Apelido', key: 'apelido' },
        { label: 'Email', key: 'email' },
        { label: 'Cidade', key: 'cidade' },
    ]
  </script>

<h1 class="font-semibold text-3xl mb-10">Funcionários</h1>
  <Button style="float: right; margin-bottom: 1em" href="/funcionario/novo">Novo Funcionário</Button>

  <DynamicTable {columns} rows={data.employees}>
      <svelte:fragment slot="extraHead">
        <Table.Head class="text-right pr-16">Ações</Table.Head>
      </svelte:fragment>

      <svelte:fragment slot="rowExtras" let:row>
        <Table.Cell class="text-right">
          <Button href={`/forma-pagamento/${row.id}`}>Detalhes</Button>
        </Table.Cell>
      </svelte:fragment>
  </DynamicTable>
