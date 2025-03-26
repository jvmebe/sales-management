<script lang="ts">
  import { onMount } from 'svelte';

  let nome = '';

  let state_id = '';
  let state_nome = '';


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

<h1>Nova Cidade</h1>
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
  <button type="submit">Criar Cidade</button>
</form>
<a href="/cidade">Voltar</a>
