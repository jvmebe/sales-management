<script lang="ts">
    export let data: { estados: Array<{ id: number; nome: string; country_id: number; country_nome: string; country_sigla: string }> };
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Table from "$lib/components/ui/table/index.js";
  </script>

  <h1 class="font-semibold text-3xl mb-10">Estados</h1>
  <Button style="float: right; margin-bottom: 1em" href="/estado/novo">Novo Estado</Button>

  <div style="margin: 10px;">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-[100px]">ID</Table.Head>
          <Table.Head>Nome</Table.Head>
          <Table.Head>Estado</Table.Head>
          <Table.Head class="text-right" style="padding-right: 4em!important">Ações</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each  data.estados as estado }
          <Table.Row>
            <Table.Cell>{estado.id}</Table.Cell>
            <Table.Cell>{estado.nome}</Table.Cell>
            <Table.Cell>{estado.country_nome}</Table.Cell>
            <Table.Cell class="text-right"><Button href={`/estado/${estado.id}`}>Detalhes</Button></Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
