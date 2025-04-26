<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import DynamicTable from "$lib/components/table.svelte";
  import Search from "@lucide/svelte/icons/search";

  let {columns, title, data = $bindable(), pickedItem = $bindable()} = $props();

  console.log(data)

</script>

<Dialog.Root>
  <Dialog.Trigger type=button class={buttonVariants({ variant: "default" })}><Search /></Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[600px]">
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
        <Button onclick={() => console.log(data)}></Button>
        <DynamicTable {columns} rows={data} showPicker={true}>
            <svelte:fragment slot="picker" let:row let:handlePick>
                <Dialog.Close class="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded" onclick={() => {pickedItem = row;}}>
                  Escolher
                </Dialog.Close>
              </svelte:fragment>

              <svelte:fragment slot="extraHead">
                <Table.Head class="text-right pr-16">Ações</Table.Head>
              </svelte:fragment>

              <svelte:fragment slot="rowExtras" let:row>
                <Table.Cell class="text-right">
                  <a href={`/pais/${row.id}`} class="text-blue-600 hover:underline">Detalhes</a>
                </Table.Cell>
              </svelte:fragment>
        </DynamicTable>
    </div>
    <Dialog.Footer>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
