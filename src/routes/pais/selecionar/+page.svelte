<script lang="ts">
    export let data: { countries: Array<{ id: number; nome: string; sigla: string }> };
  
    let search = '';
  
    $: filteredCountries = data.countries.filter(c =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.sigla.toLowerCase().includes(search.toLowerCase())
    );
  
    function selectCountry(id: number, nome: string) {
      if (window.opener && typeof window.opener.handleCountrySelect === 'function') {
        window.opener.handleCountrySelect(id, nome);
      }
      window.close();
    }
  </script>
  
  <h1>Selecione um País</h1>
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
      {#each filteredCountries as country}
        <tr>
          <td>
            <button type="button" on:click={() => selectCountry(country.id, country.nome)}>Selecionar</button>
          </td>
          <td>{country.nome}</td>
          <td>{country.sigla}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  