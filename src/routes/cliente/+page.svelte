<script lang="ts">
  export let data: { clients: Array<{ id: number; nome: string; email: string; cidade_nome: string }> };
</script>

<h1>Clientes</h1>
<a href="/cliente/novo">Novo Cliente</a>

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Nome</th>
      <th>Email</th>
      <th>Cidade</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {#each data.clients as client}
      <tr>
        <td>{client.id}</td>
        <td>{client.nome}</td>
        <td>{client.email}</td>
        <td>{client.cidade_nome}</td>
        <td>
          <a href={`/cliente/${client.id}`}>Detalhes</a>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
