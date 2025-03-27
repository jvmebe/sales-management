<script lang="ts">
  import { onMount } from 'svelte';
  export let data: { employee: {
    id: number;
    nome: string;
    apelido: string;
    data_nascimento: string;
    cpf: string;
    rg: string;
    email: string;
    telefone: string;
    endereco: string;
    bairro: string;
    cep: string;
    cidade_id: number;
    cidade_nome?: string;
    ativo: boolean;
    matricula: string;
    cargo: string;
    salario: number;
    data_admissao: string;
    turno: string;
    carga_horaria: number;
  } };

  let nome = data.employee.nome;
  let apelido = data.employee.apelido;
  let data_nascimento = data.employee.data_nascimento ? new Date(data.employee.data_nascimento).toISOString().split('T')[0] : '';
  let cpf = data.employee.cpf;
  let rg = data.employee.rg;
  let email = data.employee.email;
  let telefone = data.employee.telefone;
  let endereco = data.employee.endereco;
  let bairro = data.employee.bairro;
  let cep = data.employee.cep;
  let cidade_id = data.employee.cidade_id ? data.employee.cidade_id.toString() : '';
  let cidade_nome = data.employee.cidade_nome || '';
  let ativo = data.employee.ativo;
  let matricula = data.employee.matricula;
  let cargo = data.employee.cargo;
  let salario = data.employee.salario;
  let data_admissao = data.employee.data_admissao ? new Date(data.employee.data_admissao).toISOString().split('T')[0] : '';
  let turno = data.employee.turno;
  let carga_horaria = data.employee.carga_horaria;

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

<h1>Detalhes do Funcionário</h1>
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
<a href="/funcionario">Voltar</a>
