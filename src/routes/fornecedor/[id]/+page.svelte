<script lang="ts">
  import { onMount } from 'svelte';
  export let data: { supplier: {
    id: number;
    is_juridico: boolean;
    ativo: boolean;
    nome: string;
    apelido: string;
    cpf: string;
    rg: string;
    data_nascimento: string;
    email: string;
    telefone: string;
    endereco: string;
    bairro: string;
    cep: string;
    cidade_id: number;
    cidade_nome?: string;
    inscricao_municipal: string;
    inscricao_estadual_substituto: string;
  } };

  let is_juridico = data.supplier.is_juridico ? "true" : "false";
  let ativo = data.supplier.ativo;
  let nome = data.supplier.nome;
  let apelido = data.supplier.apelido;
  let cpf = data.supplier.cpf;
  let rg = data.supplier.rg;
  let data_nascimento = data.supplier.data_nascimento ? new Date(data.supplier.data_nascimento).toISOString().split('T')[0] : '';
  let email = data.supplier.email;
  let telefone = data.supplier.telefone;
  let endereco = data.supplier.endereco;
  let bairro = data.supplier.bairro;
  let cep = data.supplier.cep;
  let cidade_id = data.supplier.cidade_id ? data.supplier.cidade_id.toString() : '';
  let cidade_nome = data.supplier.cidade_nome || '';
  let inscricao_municipal = data.supplier.inscricao_municipal;
  let inscricao_estadual_substituto = data.supplier.inscricao_estadual_substituto;

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

  $: labelNome = is_juridico === "true" ? 'Razão Social' : 'Nome';
  $: labelApelido = is_juridico === "true" ? 'Nome Fantasia' : 'Apelido';
  $: labelCPF = is_juridico === "true" ? 'CNPJ' : 'CPF';
  $: labelRG = is_juridico === "true" ? 'Inscrição Estadual' : 'RG';
  $: labelDataNascimento = is_juridico === "true" ? 'Data Fundação' : 'Data Nascimento';
</script>

<h1>Detalhes do Fornecedor</h1>
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
      <input type="text" name="inscricao_estadual_substituto" bind:value={inscricao_estadual_substituto} />
    </label>
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
<a href="/fornecedor">Voltar</a>
