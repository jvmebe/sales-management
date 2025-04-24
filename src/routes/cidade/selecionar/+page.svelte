<script lang="ts">
  export let data: {
    cities: Array<{
      id: number;
      city_nome: string;
      state_nome: string;
    }>;
  };

  let search = '';
  $: filteredCities = data.cities.filter(
    (c) =>
      c.city_nome.toLowerCase().includes(search.toLowerCase()) ||
      c.state_nome.toLowerCase().includes(search.toLowerCase())
  );

  function selectCity(id: number, cityName: string, stateName: string) {
    if (
      window.opener &&
      typeof window.opener.handleCitySelect === 'function'
    ) {
      window.opener.handleCitySelect(id, cityName, stateName);
    }
    window.close();
  }
</script>

<h1>Selecione uma Cidade</h1>
<input
  type="text"
  placeholder="Pesquisar cidade ou estado..."
  bind:value={search}
/>

<table>
  <thead>
    <tr>
      <th>Ação</th>
      <th>Cidade</th>
      <th>Estado</th>
    </tr>
  </thead>
  <tbody>
    {#each filteredCities as city}
      <tr>
        <td>
          <button
            type="button"
            on:click={() =>
              selectCity(city.id, city.city_nome, city.state_nome)
            }
          >
            Selecionar
          </button>
        </td>
        <td>{city.city_nome}</td>
        <td>{city.state_nome}</td>
      </tr>
    {/each}
  </tbody>
</table>
