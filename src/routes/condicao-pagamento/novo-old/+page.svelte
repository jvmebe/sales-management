<script lang="ts">
  import { enhance } from '$app/forms';
  export let data: { paymentMethods: Array<{ id: number; descricao: string }> };

  let descricao = '';
  let numParcelas = 0;
  let defaultPaymentMethod = data.paymentMethods[0]?.id || 0;

  type Installment = {
    parcela_numero: number;
    forma_pagamento: number;
    valor_porcentagem: number;
    dias_vencimento: number;
  };
  let installments: Installment[] = [];
  let errorMessage = '';

  $: totalPercentage = parseFloat(
    installments
      .reduce((sum, inst) => sum + Number(inst.valor_porcentagem), 0)
      .toFixed(2)
  );

  function addInstallment() {
    installments = [
      ...installments,
      {
        parcela_numero: installments.length + 1,
        forma_pagamento: defaultPaymentMethod,
        valor_porcentagem: 0,
        dias_vencimento: 0
      }
    ];
    numParcelas = installments.length;
  }

  function removeInstallment(index: number) {
    installments = installments.filter((_, i) => i !== index)
      .map((inst, idx) => ({ ...inst, parcela_numero: idx + 1 }));
    numParcelas = installments.length;
  }

  function generateInstallments() {
    const n = numParcelas;
    if (!n || n <= 0) {
      installments = [];
      return;
    }
    // parcela base arredondada para 2 casas
    const base = parseFloat((100 / n).toFixed(2));
    let temp: Installment[] = Array(n)
      .fill(null)
      .map((_, i) => ({
        parcela_numero: i + 1,
        forma_pagamento: defaultPaymentMethod,
        valor_porcentagem: base,
        dias_vencimento: 0
      }));
    // ajusta última parcela para compensar soma ≠ 100
    const total = parseFloat((base * n).toFixed(2));
    const diff = parseFloat((100 - total).toFixed(2));
    temp[n - 1].valor_porcentagem = parseFloat(
      (temp[n - 1].valor_porcentagem + diff).toFixed(2)
    );
    installments = temp;
  }

  function handleSubmit(event: Event) {
    if (totalPercentage !== 100) {
      event.preventDefault();
      alert(`A soma das porcentagens deve ser 100%. Atualmente: ${totalPercentage}%`);
    }
  }

  function onError({ data }: { data: any }) {
    if (data) errorMessage = data.error;
  }
</script>

<h1>Criar Nova Condição de Pagamento</h1>
{#if errorMessage}
  <p style="color: red;">{errorMessage}</p>
{/if}

<form method="post" use:enhance on:submit={handleSubmit}>
  <div>
    <label>
      Descrição:
      <input type="text" name="descricao" bind:value={descricao} />
    </label>
  </div>

  <div>
    <label>
      Forma de Pagamento Padrão:
      <select bind:value={defaultPaymentMethod}>
        {#each data.paymentMethods as m}
          <option value={m.id}>{m.descricao}</option>
        {/each}
      </select>
    </label>
  </div>

  <div>
    <label>
      Número de Parcelas:
      <input type="number" name="num_parcelas" bind:value={numParcelas} min="1" required />
    </label>
    <button type="button" on:click={generateInstallments}>Gerar Parcelas</button>
  </div>

  <h2>Parcelas</h2>
  <button type="button" on:click={addInstallment}>Adicionar Parcela Manualmente</button>

  {#if installments.length > 0}
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Forma</th>
          <th>%</th>
          <th>Dias</th>
          <th>—</th>
        </tr>
      </thead>
      <tbody>
        {#each installments as inst, i}
          <tr>
            <td>
              <input
                type="number"
                name="parcela_numero"
                value={inst.parcela_numero}
                readonly
              />
            </td>
            <td>
              <select name="forma_pagamento" bind:value={inst.forma_pagamento}>
                {#each data.paymentMethods as m}
                  <option value={m.id}>{m.descricao}</option>
                {/each}
              </select>
            </td>
            <td>
              <input
                type="number"
                step="0.01"
                name="valor_porcentagem"
                bind:value={inst.valor_porcentagem}
                required
              />
            </td>
            <td>
              <input
                type="number"
                name="dias_vencimento"
                bind:value={inst.dias_vencimento}
                required
              />
            </td>
            <td>
              <button type="button" on:click={() => removeInstallment(i)}>
                Remover
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <p>Total: {totalPercentage}%</p>
  {/if}

  <button type="submit">Criar Condição</button>
</form>
<a href="/condicao-de-pagamento">Voltar</a>
