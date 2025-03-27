<script lang="ts">
  export let data: { cities: Array<{ id: number; nome: string }> };

  let search = '';

  $: filteredCities = data.cities.filter(city =>
    city.nome.toLowerCase().includes(search.toLowerCase())
  );

  function selectCity(id: number, nome: string) {
    if (window.opener && typeof window.opener.handleCitySelect === 'function') {
      window.opener.handleCitySelect(id, nome);
    }
    window.close();
  }
</script>

<h1>Selecione uma Cidade</h1>
<input type="text" placeholder="Pesquisar..." bind:value={search} />

<table>
  <thead>
    <tr>
      <th>Ação</th>
      <th>Nome</th>
    </tr>
  </thead>
  <tbody>
    {#each filteredCities as city}
      <tr>
        <td>
          <button type="button" on:click={() => selectCity(city.id, city.nome)}>Selecionar</button>
        </td>
        <td>{city.nome}</td>
      </tr>
    {/each}
  </tbody>
</table>
