<script lang="ts">
    export let data: { conditions: Array<{ id: number; descricao: string; num_parcelas: number }> };
    import DynamicTable from "$lib/components/table.svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import Button from "$lib/components/ui/button/button.svelte";

    const columns = [
        { label: 'ID', key: 'id', class: 'w-[100px]' },
        { label: 'Descrição', key: 'descricao' },
    ]
  </script>

  <h1 class="text-3xl">Condições de Pagamento</h1>
  <Button style="float: right; margin-bottom: 1em" href="/condicao-pagamento/novo">Nova Forma</Button>

  <DynamicTable {columns} rows={data.conditions}>
      <svelte:fragment slot="extraHead">
        <Table.Head class="text-right pr-16">Ações</Table.Head>
      </svelte:fragment>

      <svelte:fragment slot="rowExtras" let:row>
        <Table.Cell class="text-right">
          <Button href={`/condicao-pagamento/${row.id}`}>Detalhes</Button>
        </Table.Cell>
      </svelte:fragment>
  </DynamicTable>
