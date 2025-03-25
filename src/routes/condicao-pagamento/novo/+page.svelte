<script lang="ts">
    export let data: { paymentMethods: Array<{ id: number; descricao: string }> };
  
    let descricao = '';
    let numParcelas: number = 0;
  
    type Installment = {
      parcela_numero: number;
      forma_pagamento: number;
      valor_porcentagem: number;
      dias_vencimento: number;
    };
  
    let installments: Installment[] = [];
    let errorMessage: string = '';
  
    $: totalPercentage = installments.reduce((sum, inst) => sum + inst.valor_porcentagem, 0);
  
    function addInstallment() {
      installments = [
        ...installments,
        {
          parcela_numero: installments.length + 1,
          forma_pagamento: data.paymentMethods[0]?.id || 0,
          valor_porcentagem: 0,
          dias_vencimento: 0
        }
      ];
      numParcelas = installments.length;
    }
  
    function removeInstallment(index: number) {
      installments = installments.filter((_, i) => i !== index);
      installments = installments.map((inst, idx) => ({ ...inst, parcela_numero: idx + 1 }));
      numParcelas = installments.length;
    }
  
    function generateInstallments() {
      const n = numParcelas;
      if (!n || n <= 0) {
        installments = [];
        return;
      }
      let defaultPercentage = Math.floor((100 / n) * 100) / 100;
      let tempInstallments: Installment[] = [];
      for (let i = 1; i < n; i++) {
        tempInstallments.push({
          parcela_numero: i,
          forma_pagamento: data.paymentMethods[0]?.id || 0,
          valor_porcentagem: defaultPercentage,
          dias_vencimento: 0
        });
      }
      let lastPercentage = parseFloat((100 - defaultPercentage * (n - 1)).toFixed(2));
      tempInstallments.push({
        parcela_numero: n,
        forma_pagamento: data.paymentMethods[0]?.id || 0,
        valor_porcentagem: lastPercentage,
        dias_vencimento: 0
      });
      installments = tempInstallments;
    }
  
    function handleSubmit(event: Event) {
      if (totalPercentage !== 100) {
        event.preventDefault();
        alert(`A soma das porcentagens deve ser igual a 100%. Atualmente está em ${totalPercentage}%.`);
      }
    }
  </script>
  
  <h1>Criar Nova Condição de Pagamento</h1>
  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}
  <form method="post" on:submit={handleSubmit}>
    <div>
      <label>
        Descrição:
        <input type="text" name="descricao" bind:value={descricao} required />
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
            <th>Número da Parcela</th>
            <th>Forma de Pagamento</th>
            <th>Valor da Parcela (%)</th>
            <th>Dias para Vencimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {#each installments as installment, index}
            <tr>
              <td>
                <input type="number" name="parcela_numero" value={installment.parcela_numero} readonly />
              </td>
              <td>
                <select name="forma_pagamento">
                  {#each data.paymentMethods as method}
                    <option value={method.id} selected={installment.forma_pagamento === method.id}>
                      {method.descricao}
                    </option>
                  {/each}
                </select>
              </td>
              <td>
                <input type="number" step="0.01" name="valor_porcentagem" bind:value={installment.valor_porcentagem} required />
              </td>
              <td>
                <input type="number" name="dias_vencimento" bind:value={installment.dias_vencimento} required />
              </td>
              <td>
                <button type="button" on:click={() => removeInstallment(index)}>Remover</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <p>Total das porcentagens: {totalPercentage}%</p>
    {/if}
  
    <button type="submit">Criar Condição</button>
  </form>
  <a href="/condicao-de-pagamento">Voltar</a>
  