<script lang="ts">
    export let data: { countries: Array<{ id: number; nome: string; sigla: string }> };
  </script>
  
  <h1>Países</h1>
  <a href="/pais/novo">Novo País</a>
  
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>Sigla</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {#each data.countries as country}
        <tr>
          <td>{country.id}</td>
          <td>{country.nome}</td>
          <td>{country.sigla}</td>
          <td>
            <a href={`/pais/${country.id}`}>Detalhes</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  