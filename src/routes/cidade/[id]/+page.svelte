<script lang="ts">
  import { onMount } from 'svelte';
  export let data: { city: { id: number; nome: string; state_id: number; state_nome: string; state_sigla: string } };

  let nome = data.city.nome;
  let state_id = data.city.state_id.toString();
  let state_nome = data.city.state_nome;

  function openStatePopup() {
    window.open('/estado/selecionar', 'Selecionar Estado', 'width=600,height=400');
  }

  onMount(() => {
    // @ts-ignore
    window.handleStateSelect = (id, nome) => {
      state_id = id;
      state_nome = nome;
    };
  });
</script>

<h1>Detalhes da Cidade</h1>
<form method="post">
  <div>
    <label>
      Nome:
      <input type="text" name="nome" bind:value={nome} required />
    </label>
  </div>
  <div>
    <label>
      Estado:
      <input type="text" value={state_nome} readonly placeholder="Selecione um estado" />
      <input type="hidden" name="state_id" value={state_id} />
    </label>
    <button type="button" on:click={openStatePopup}>Selecionar Estado</button>
  </div>
  <button type="submit" name="action" value="update">Atualizar</button>
  <button type="submit" name="action" value="delete" on:click|preventDefault={() => {
    if (confirm('Confirma a exclusão?')) {
      (document.getElementById('deleteForm') as HTMLFormElement).submit();
    }
  }}>Excluir</button>
</form>

<form id="deleteForm" method="post" style="display: none;">
  <input type="hidden" name="action" value="delete" />
</form>
<a href="/cidade">Voltar</a>
