<script lang="ts">
  export let data: { states: Array<{ id: number; nome: string; sigla: string }> };

  let search = '';

  $: filteredStates = data.states.filter(s =>
    s.nome.toLowerCase().includes(search.toLowerCase()) ||
    s.sigla.toLowerCase().includes(search.toLowerCase())
  );

  function selectState(id: number, nome: string) {
    if (window.opener && typeof window.opener.handleStateSelect === 'function') {
      window.opener.handleStateSelect(id, nome);
    }
    window.close();
  }
</script>

<h1>Selecione um Estado</h1>
<input type="text" placeholder="Pesquisar..." bind:value={search} />

<table>
  <thead>
    <tr>
      <th>Ação</th>
      <th>Nome</th>
      <th>Sigla</th>
    </tr>
  </thead>
  <tbody>
    {#each filteredStates as state}
      <tr>
        <td>
          <button type="button" on:click={() => selectState(state.id, state.nome)}>Selecionar</button>
        </td>
        <td>{state.nome}</td>
        <td>{state.sigla}</td>
      </tr>
    {/each}
  </tbody>
</table>
