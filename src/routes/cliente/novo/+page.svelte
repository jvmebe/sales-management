<script lang="ts">
  import { onMount } from 'svelte';
  import ClienteForm from './cliente-form.svelte';
  import type { PageData } from '../$types';

  let { data } = $props();

  let is_juridica = "false";
  let is_ativo = true;

  let nome = '';
  let apelido = '';
  let cpf = '';
  let rg = '';
  let data_nascimento = '';
  let telefone = '';
  let email = '';
  let endereco = '';
  let bairro = '';
  let cep = '';

  let cidade_id = '';
  let cidade_nome = '';

  function openCityPopup() {
    window.open('/cidade/selecionar', 'Selecionar Cidade', 'width=600,height=400');
  }

  onMount(() => {
    // @ts-ignore
    window.handleCitySelect = (id, nome) => {
      cidade_id = id;
      cidade_nome = nome;
    };
  });

</script>

<h1>Novo Cliente</h1>

<ClienteForm {data}/>

<form method="post">
  <fieldset>
    <legend>Tipo de Cliente</legend>
    <label>
      <input type="radio" name="is_juridica" value="false" bind:group={is_juridica} />
      Pessoa Física
    </label>
    <label>
      <input type="radio" name="is_juridica" value="true" bind:group={is_juridica} />
      Pessoa Jurídica
    </label>
  </fieldset>

  <div>
    <label>
      <input type="checkbox" name="is_ativo" bind:checked={is_ativo} value="true" />
      Cliente Ativo
    </label>
  </div>

  <div>
    <label>Nome:
      <input type="text" name="nome" bind:value={nome} required />
    </label>
  </div>
  <div>
    <label>Apelido:
      <input type="text" name="apelido" bind:value={apelido} required />
    </label>
  </div>
  <div>
    <label>CPF:
      <input type="text" name="cpf" bind:value={cpf} />
    </label>
  </div>
  <div>
    <label>RG:
      <input type="text" name="rg" bind:value={rg} />
    </label>
  </div>
  <div>
    <label>Data Nasc:
      <input type="date" name="data_nascimento" bind:value={data_nascimento} />
    </label>
  </div>
  <div>
    <label>
      Telefone:
      <input type="text" name="telefone" bind:value={telefone} />
    </label>
  </div>
  <div>
    <label>
      Email:
      <input type="email" name="email" bind:value={email} />
    </label>
  </div>
  <div>
    <label>
      Endereço:
      <input type="text" name="endereco" bind:value={endereco} />
    </label>
  </div>
  <div>
    <label>
      Bairro:
      <input type="text" name="bairro" bind:value={bairro} />
    </label>
  </div>
  <div>
    <label>
      CEP:
      <input type="text" name="cep" bind:value={cep} />
    </label>
  </div>
  <div>
    <label>
      Cidade:
      <input type="text" value={cidade_nome} readonly placeholder="Selecione uma cidade" />
      <input type="hidden" name="cidade_id" value={cidade_id} />
    </label>
    <button type="button" on:click={openCityPopup}>Selecionar Cidade</button>
  </div>
  <button type="submit">Criar Cliente</button>
</form>
<a href="/cliente">Voltar</a>
