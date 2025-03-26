<script lang="ts">
  export let data: { cities: Array<{ id: number; nome: string; state_nome: string; state_sigla: string }> };
</script>

<h1>Cidades</h1>
<a href="/cidade/novo">Nova Cidade</a>

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Nome</th>
      <th>Estado</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {#each data.cities as city}
      <tr>
        <td>{city.id}</td>
        <td>{city.nome}</td>
        <td>{city.state_nome} ({city.state_sigla})</td>
        <td>
          <a href={`/cidade/${city.id}`}>Detalhes</a>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
