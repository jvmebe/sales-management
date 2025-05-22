<script lang="ts">
    export let data: { paymentMethods: Array<{ id: number; descricao: string }> };
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import DynamicTable from "$lib/components/table.svelte";

    const columns = [
        { label: 'ID', key: 'id', class: 'w-[100px]' },
        { label: 'Descrição', key: 'descricao' },
    ]

</script>

<h1 class="font-semibold text-3xl mb-10">Formas de Pagamento</h1>
<Button style="float: right; margin-bottom: 1em" href="/forma-pagamento/novo">Nova Forma</Button>

<DynamicTable {columns} rows={data.paymentMethods}>
    <svelte:fragment slot="extraHead">
      <Table.Head class="text-right pr-16">Ações</Table.Head>
    </svelte:fragment>

    <svelte:fragment slot="rowExtras" let:row>
      <Table.Cell class="text-right">
        <Button href={`/forma-pagamento/${row.id}`}>Detalhes</Button>
      </Table.Cell>
    </svelte:fragment>
</DynamicTable>
