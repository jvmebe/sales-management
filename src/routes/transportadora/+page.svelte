<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Table from "$lib/components/ui/table";
  import { PlusCircle, Edit } from "lucide-svelte";

  export let data;
</script>

<div class="mb-4 flex justify-between items-center">
  <h1 class="text-2xl font-bold">Transportadoras</h1>
  <Button href="/transportadora/novo">
    <PlusCircle class="mr-2 h-4 w-4" />
    Nova Transportadora
  </Button>
</div>

<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[250px]">Nome</Table.Head>
        <Table.Head>Apelido</Table.Head>
        <Table.Head>Email</Table.Head>
        <Table.Head>Cidade</Table.Head>
        <Table.Head class="w-[100px] text-right">Ações</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#if data.transportadoras && data.transportadoras.length > 0}
        {#each data.transportadoras as transportadora}
          <Table.Row>
            <Table.Cell class="font-medium">{transportadora.nome}</Table.Cell>
            <Table.Cell>{transportadora.apelido || '-'}</Table.Cell>
            <Table.Cell>{transportadora.email || '-'}</Table.Cell>
            <Table.Cell>{transportadora.cidade_nome || 'Não informada'}</Table.Cell>
            <Table.Cell class="text-right">
              <Button variant="outline" size="icon" href={`/transportadora/${transportadora.id}`}>
                <Edit class="h-4 w-4" />
                <span class="sr-only">Editar</span>
              </Button>
            </Table.Cell>
          </Table.Row>
        {/each}
      {:else}
        <Table.Row>
          <Table.Cell colspan={5} class="h-24 text-center">
            Nenhuma transportadora encontrada.
          </Table.Cell>
        </Table.Row>
      {/if}
    </Table.Body>
  </Table.Root>
</div>