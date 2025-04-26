<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let columns: { label: string; key: string; class?: string }[] = [];
    export let rows: any[] = [];
    import * as Table from "$lib/components/ui/table/index.js";
    export let showPicker: boolean = false;

    const dispatch = createEventDispatcher();

     function handlePick(payload: any) {
       dispatch('payload', payload);
     }


  </script>

<div class="m-2">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        {#if showPicker}
          <Table.Head class="w-[60px] text-center">Selecionar</Table.Head>
        {/if}
        {#each columns as column}
          <Table.Head class={column.class}>{column.label}</Table.Head>
        {/each}
        <slot name="extraHead" />
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {#each rows as row (row.id)}
        <Table.Row>
          {#if showPicker}
            <Table.Cell class="text-center">
              <slot name="picker" {row} {handlePick} />
            </Table.Cell>
          {/if}

          {#each columns as column}
            <Table.Cell>{row[column.key]}</Table.Cell>
          {/each}

          <slot name="rowExtras" {row} />
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
