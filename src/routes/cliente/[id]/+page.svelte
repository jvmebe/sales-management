<script lang="ts">
  import { onMount } from 'svelte';
  export let data: { client: {
    id: number;
    is_juridica: boolean;
    is_ativo: boolean;
    nome: string;
    apelido: string;
    cpf: string;
    rg: string;
    data_nascimento: string;
    telefone: string;
    email: string;
    endereco: string;
    bairro: string;
    cep: string;
    cidade_id: number;
    cidade_nome?: string;
  } };


  let is_juridica = data.client.is_juridica ? "true" : "false";
  let is_ativo = data.client.is_ativo;
  let nome = data.client.nome;
  let apelido = data.client.apelido;
  let cpf = data.client.cpf;
  let rg = data.client.rg;
  let data_nascimento = data.client.data_nascimento
    ? new Date(data.client.data_nascimento).toISOString().split('T')[0]
    : '';
  let telefone = data.client.telefone;
  let email = data.client.email;
  let endereco = data.client.endereco;
  let bairro = data.client.bairro;
  let cep = data.client.cep;


  let cidade_id = data.client.cidade_id ? data.client.cidade_id.toString() : '';
  let cidade_nome = data.client.cidade_nome || '';

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

  $: labelNome = is_juridica === "true" ? 'Razão Social' : 'Nome';
  $: labelApelido = is_juridica === "true" ? 'Nome Fantasia' : 'Apelido';
  $: labelCPF = is_juridica === "true" ? 'CNPJ' : 'CPF';
  $: labelRG = is_juridica === "true" ? 'Inscrição Estadual' : 'RG';
  $: labelDataNascimento = is_juridica === "true" ? 'Data Fundação' : 'Data Nascimento';
</script>

<h1>Detalhes do Cliente</h1>
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
<a href="/cliente">Voltar</a>
