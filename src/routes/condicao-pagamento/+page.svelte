<script lang="ts">
    export let data: { conditions: Array<{ id: number; descricao: string; num_parcelas: number }> };
  </script>
  
  <h1>Condições de Pagamento</h1>
  <a href="/condicao-pagamento/novo">Nova Condição</a>
  
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Descrição</th>
        <th>Número de Parcelas</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {#each data.conditions as condition}
        <tr>
          <td>{condition.id}</td>
          <td>{condition.descricao}</td>
          <td>{condition.num_parcelas}</td>
          <td>
            <a href={`/condicao-pagamento/${condition.id}`}>Detalhes</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  