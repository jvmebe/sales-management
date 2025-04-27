<script lang="ts">
  import { onMount } from "svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import DynamicTable from "$lib/components/table.svelte";
  import Search from "@lucide/svelte/icons/search";
  import RefreshCcw from "@lucide/svelte/icons/refresh-ccw";
  import Plus from "@lucide/svelte/icons/plus";

  let {columns, title, pickedItem = $bindable(), getData = () => {}, uri} = $props();

  let data:any = $state();

  async function refresh() {
    data = await getData();
  }

  onMount(async () => {
      await refresh()
      console.log('testdata', data);
	});



</script>

<Dialog.Root>
  <Dialog.Trigger type=button class={buttonVariants({ variant: "default" })}><Search /></Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[600px] min-h-[300px]">
    <Dialog.Header>
      <Dialog.Title class="text-2xl">{title}</Dialog.Title>
      <div class="flex gap-4">
          <Button onclick={async () => {await refresh()}}><RefreshCcw /></Button>
          <Button target="_blank" href={`/${uri}/novo`}><Plus /></Button>
      </div>

    </Dialog.Header>
    <div class="grid gap-4 py-4">
        <DynamicTable {columns} rows={data} showPicker={true}>
            <svelte:fragment slot="picker" let:row let:handlePick>
                <Dialog.Close class={buttonVariants({ variant: "default" })} onclick={() => {pickedItem = row;}}>
                  Escolher
                </Dialog.Close>
              </svelte:fragment>

              <svelte:fragment slot="extraHead">
                <Table.Head class="text-right pr-16">Ações</Table.Head>
              </svelte:fragment>

              <svelte:fragment slot="rowExtras" let:row>
                <Table.Cell class="text-right">
                  <a target="_blank" href={`/pais/${row.id}`} class={buttonVariants({ variant: "default" })}>Detalhes</a>
                </Table.Cell>
              </svelte:fragment>
        </DynamicTable>
    </div>
    <Dialog.Footer>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
