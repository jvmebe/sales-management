<script lang="ts">
  export let data: { employees: Array<{ id: number; nome: string; apelido: string; email: string; cidade_nome: string }> };
</script>

<h1>Funcionários</h1>
<a href="/funcionario/novo">Novo Funcionário</a>

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
    {#each data.employees as emp}
      <tr>
        <td>{emp.id}</td>
        <td>{emp.nome}</td>
        <td>{emp.apelido}</td>
        <td>{emp.email}</td>
        <td>{emp.cidade_nome}</td>
        <td>
          <a href={`/funcionario/${emp.id}`}>Detalhes</a>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
