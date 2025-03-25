<script lang="ts">
    export let data: { estados: Array<{ id: number; nome: string; country_id: number; country_nome: string; country_sigla: string }> };
  </script>
  
  <h1>Estados</h1>
  <a href="/estado/novo">Novo Estado</a>
  
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>País</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {#each data.estados as estado}
        <tr>
          <td>{estado.id}</td>
          <td>{estado.nome}</td>
          <td>{estado.country_nome} ({estado.country_sigla})</td>
          <td>
            <a href={`/estado/${estado.id}`}>Detalhes</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  