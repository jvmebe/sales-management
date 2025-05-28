<script lang="ts">
  import { onMount } from "svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import DynamicTable from "$lib/components/table.svelte";
  import Search from "@lucide/svelte/icons/search";
  import RefreshCcw from "@lucide/svelte/icons/refresh-ccw";
  import CityCreateDialog from "./city-create-dialog.svelte";
  import ScrollArea from "../ui/scroll-area/scroll-area.svelte";


    let { data, pickedItem = $bindable() } = $props();

    let uri = "#";

    const columns = [
      { label: 'ID', key: 'id', class: 'w-[50px]' },
      { label: 'Nome', key: 'nome' },
      { label: 'Estado', key: 'state_nome'},
      ];

    let rowData:any = $state();

    async function refresh() {
        const response = await fetch("/cidade");
        let countryRows = await response.json();
        rowData = await countryRows;
    }

    onMount(() => {
        refresh();
    })

</script>

<Dialog.Root>
  <Dialog.Trigger type="button" class={buttonVariants({ variant: "default" })}
    ><Search /></Dialog.Trigger
  >
  <Dialog.Content class="sm:max-w-[600px] min-h-[300px]">
    <Dialog.Header>
      <Dialog.Title class="text-2xl">Escolher Cidade</Dialog.Title>
    </Dialog.Header>
    <div class="flex gap-4">
      <Button
        onclick={async () => {
          await refresh();
        }}><RefreshCcw /></Button
      >
      <CityCreateDialog {data} updateList={refresh()}/>
    </div>
    <div class="grid gap-4 py-4">
        <ScrollArea class="h-[500px]">
            <DynamicTable {columns} rows={rowData} showPicker={true}>
                <svelte:fragment slot="picker" let:row let:handlePick>
                    <Dialog.Close
                        class={buttonVariants({ variant: "default" })}
                        onclick={() => {
                            pickedItem = row;
                        }}
                    >
                        Escolher
                    </Dialog.Close>
                </svelte:fragment>

                <svelte:fragment slot="extraHead">
                    <Table.Head class="text-right pr-16">Ações</Table.Head>
                </svelte:fragment>

                <svelte:fragment slot="rowExtras" let:row>
                    <Table.Cell class="text-right">
                        <a
                            target="_blank"
                            href={`/${uri}/${row.id}`}
                            class={buttonVariants({ variant: "default" })}
                            >Detalhes</a
                        >
                    </Table.Cell>
                </svelte:fragment>
            </DynamicTable>
        </ScrollArea>
    </div>
    <Dialog.Footer></Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>