<script lang="ts">
    import { onMount } from 'svelte';
  
    let nome = '';
    let sigla = '';
  
    let country_id = '';
    let country_nome = '';
  
    function openCountryPopup() {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open('/pais/selecionar', 'Selecionar País', `width=${width},height=${height},left=${left},top=${top}`);
  }
  
    onMount(() => {
      // @ts-ignore
      window.handleCountrySelect = (id, nome) => {
        country_id = id;
        country_nome = nome;
      };
    });
  </script>
  
  <h1>Novo Estado</h1>
  <form method="post">
    <div>
      <label>
        Nome:
        <input type="text" name="nome" bind:value={nome} required />
      </label>
    </div>
    <div>
      <label>
        Sigla:
        <input type="text" name="sigla" bind:value={sigla} maxlength="2" required />
      </label>
    </div>
    <div>
      <label>
        País:
        <input type="text" value={country_nome} readonly placeholder="Selecione um país" />
        <input type="hidden" name="country_id" value={country_id} />
      </label>
      <button type="button" on:click={openCountryPopup}>Selecionar País</button>
    </div>
    <button type="submit">Criar Estado</button>
  </form>
  <a href="/estado">Voltar</a>
  