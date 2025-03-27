<script lang="ts">
  import { onMount } from 'svelte';

  let nome = '';
  let apelido = '';
  let data_nascimento = '';
  let cpf = '';
  let rg = '';
  let email = '';
  let telefone = '';
  let endereco = '';
  let bairro = '';
  let cep = '';
  let cidade_id = '';
  let cidade_nome = '';

  let ativo = true;
  let matricula = '';
  let cargo = '';
  let salario = 0;
  let data_admissao = '';
  let turno = '';
  let carga_horaria = 0;

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

<h1>Novo Funcionário</h1>
<form method="post">
  <div>
    <label>
      Nome:
      <input type="text" name="nome" bind:value={nome} required />
    </label>
  </div>
  <div>
    <label>
      Apelido:
      <input type="text" name="apelido" bind:value={apelido} required />
    </label>
  </div>
  <div>
    <label>
      Data de Nascimento:
      <input type="date" name="data_nascimento" bind:value={data_nascimento} />
    </label>
  </div>
  <div>
    <label>
      CPF:
      <input type="text" name="cpf" bind:value={cpf} />
    </label>
  </div>
  <div>
    <label>
      RG:
      <input type="text" name="rg" bind:value={rg} />
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
      Ativo:
      <input type="checkbox" name="ativo" bind:checked={ativo} value="true" />
    </label>
  </div>
  <div>
    <label>
      Matrícula:
      <input type="text" name="matricula" bind:value={matricula} />
    </label>
  </div>
  <div>
    <label>
      Cargo:
      <input type="text" name="cargo" bind:value={cargo} />
    </label>
  </div>
  <div>
    <label>
      Salário:
      <input type="number" step="0.01" name="salario" bind:value={salario} />
    </label>
  </div>
  <div>
    <label>
      Data de Admissão:
      <input type="date" name="data_admissao" bind:value={data_admissao} />
    </label>
  </div>
  <div>
    <label>
      Turno:
      <input type="text" name="turno" bind:value={turno} />
    </label>
  </div>
  <div>
    <label>
      Carga Horária:
      <input type="number" name="carga_horaria" bind:value={carga_horaria} />
    </label>
  </div>
  <button type="submit">Criar Funcionário</button>
</form>
<a href="/funcionario">Voltar</a>
