<!-- src/routes/fornecedor/novo/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  // Trabalhamos com is_juridico como string: "true" para PJ, "false" para PF
  let is_juridico = "false"; // Pessoa física selecionada por padrão
  let ativo = true;

  // Campos comuns
  let nome = '';
  let apelido = '';
  let cpf = '';
  let rg = '';
  let data_nascimento = '';
  let email = '';
  let telefone = '';
  let endereco = '';
  let bairro = '';
  let cep = '';

  // Campos adicionais
  let inscricao_municipal = '';
  let inscricao_estadual_substituto = '';

  // Seleção de cidade
  let cidade_id = '';
  let cidade_nome = '';

  function openCityPopup() {
    window.open('/cidade/selecionar', 'Selecionar Cidade', 'width=600,height=400');
  }

  onMount(() => {
    // Expor a função para o popup de cidade
    // @ts-ignore
    window.handleCitySelect = (id, nome) => {
      cidade_id = id;
      cidade_nome = nome;
    };
  });

  // Rótulos dinâmicos conforme o tipo de fornecedor
  $: labelNome = is_juridico === "true" ? 'Razão Social' : 'Nome';
  $: labelApelido = is_juridico === "true" ? 'Nome Fantasia' : 'Apelido';
  $: labelCPF = is_juridico === "true" ? 'CNPJ' : 'CPF';
  $: labelRG = is_juridico === "true" ? 'Inscrição Estadual' : 'RG';
  $: labelDataNascimento = is_juridico === "true" ? 'Data Fundação' : 'Data Nascimento';
</script>

<h1>Novo Fornecedor</h1>
<form method="post">
  <fieldset>
    <legend>Tipo de Fornecedor</legend>
    <label>
      <input type="radio" name="is_juridico" value="false" bind:group={is_juridico} />
      Pessoa Física
    </label>
    <label>
      <input type="radio" name="is_juridico" value="true" bind:group={is_juridico} />
      Pessoa Jurídica
    </label>
  </fieldset>

  <div>
    <label>
      <input type="checkbox" name="ativo" bind:checked={ativo} value="true" />
      Ativo
    </label>
  </div>
  <div>
    <label>{labelNome}:
      <input type="text" name="nome" bind:value={nome} required />
    </label>
  </div>
  <div>
    <label>{labelApelido}:
      <input type="text" name="apelido" bind:value={apelido} required />
    </label>
  </div>
  <div>
    <label>{labelCPF}:
      <input type="text" name="cpf" bind:value={cpf} />
    </label>
  </div>
  <div>
    <label>{labelRG}:
      <input type="text" name="rg" bind:value={rg} />
    </label>
  </div>
  <div>
    <label>{labelDataNascimento}:
      <input type="date" name="data_nascimento" bind:value={data_nascimento} />
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
      Telefone:
      <input type="text" name="telefone" bind:value={telefone} />
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
  <div>
    <label>
      Inscrição Municipal:
      <input type="text" name="inscricao_municipal" bind:value={inscricao_municipal} />
    </label>
  </div>
  <div>
    <label>
      Inscrição Estadual Substituto Tributário:
      <input type="text" name="inscricao_estadual_substituto_tributario" bind:value={inscricao_estadual_substituto} />
    </label>
  </div>
  <button type="submit">Criar Fornecedor</button>
</form>
<a href="/fornecedor">Voltar</a>
