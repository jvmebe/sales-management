<script lang="ts">
    export let columns: { label: string; key: string; class?: string }[] = [];
    export let rows: any[] = [];
    import * as Table from "$lib/components/ui/table/index.js";

  </script>
  
  <div class="m-2">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          {#each columns as column}
            <Table.Head class={column.class}>{column.label}</Table.Head>
          {/each}
          <slot name="extraHead" />
        </Table.Row>
      </Table.Header>
  
      <Table.Body>
        {#each rows as row (row.id)}
          <Table.Row>
            {#each columns as column}
              <Table.Cell>{row[column.key]}</Table.Cell>
            {/each}
            <slot name="rowExtras" {row} />
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>