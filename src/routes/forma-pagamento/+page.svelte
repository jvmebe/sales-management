<script lang="ts">
    export let data: { paymentMethods: Array<{ id: number; descricao: string }> };
  </script>
  
  <h1>Formas de Pagamento</h1>
  <a href="/forma-pagamento/novo">Nova Forma</a>
  
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Descrição</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {#each data.paymentMethods as method}
        <tr>
          <td>{method.id}</td>
          <td>{method.descricao}</td>
          <td>
            <a href={`/forma-pagamento/${method.id}`}>Detalhes</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  