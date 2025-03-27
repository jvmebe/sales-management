<script lang="ts">
  export let data: { suppliers: Array<{ id: number; nome: string; apelido: string; email: string; cidade_nome: string }> };
</script>

<h1>Fornecedores</h1>
<a href="/fornecedor/novo">Novo Fornecedor</a>

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Nome</th>
      <th>Apelido</th>
      <th>Email</th>
      <th>Cidade</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {#each data.suppliers as supplier}
      <tr>
        <td>{supplier.id}</td>
        <td>{supplier.nome}</td>
        <td>{supplier.apelido}</td>
        <td>{supplier.email}</td>
        <td>{supplier.cidade_nome}</td>
        <td>
          <a href={`/fornecedor/${supplier.id}`}>Detalhes</a>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
