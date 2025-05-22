<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { formSchema, type FormSchema } from "$lib/validation/paycondSchema";
    import SuperDebug, {
     type SuperValidated,
     type Infer,
     superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import Button from '$lib/components/ui/button/button.svelte';
    import FormInput from '$lib/components/form-input.svelte';
    import PickerDialog from '$lib/components/picker-dialog.svelte'
    import { browser } from '$app/environment';
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import Input from "../ui/input/input.svelte";
    import Label from "../ui/label/label.svelte";
    import Trash from "@lucide/svelte/icons/trash";

    let { data } = $props();

    let paymentMethods = data.paymentMethods;
    let installmentNumber:number|undefined = $state();
    let percent = $state('');
    let days = $state('');
    let pickedPayMethod = $state({
      id: 0,
      descricao: ''
    });

    async function getPayForms():Promise<any> {
          const response = await fetch('/forma-pagamento');
          let payRows = await response.json();
          return payRows;
    }

    const columns = [
       { label: 'ID', key: 'id', class: 'w-[100px]' },
       { label: 'Descrição', key: 'descricao' },
   ]

    let errors = $state({ percent: '', days: '', paymMethod: '', installmentNumber: '' })

    const form = superForm(data.form, {
        validators: zodClient(formSchema),
        dataType: 'json'
    });

    const { form:formData, enhance } = form;

    console.log($formData);

    type Installment = {
      numero: number;
      forma_pagamento_id: number;
      valor_porcentagem: number;
      dias_vencimento: number;
    };
    let installments: Installment[] = $state($formData.parcelas);
    console.log($formData.parcelas);

    function addInstallment() {
      errors = { percent: '', days: '', paymMethod: '', installmentNumber: '' }

      const p = parseFloat(percent)
      const d = parseInt(days, 10)


      let valid = true

      if (installments.some(p => p.numero === installmentNumber)) {
            errors.installmentNumber = `Parcela ${installmentNumber} já existe.`;
            valid = false;
        }

      if (percent === '' || isNaN(p)) {
        errors.percent = 'Porcentagem precisa ser um número'
        valid = false
      }
      if (days === '' || isNaN(d)) {
        errors.days = 'Dias precisa ser um número'
        valid = false
      }

      if (pickedPayMethod.id === 0) {
        errors.paymMethod = 'Escolha uma forma de pagamento'
        valid = false
      }

      if (!valid) return

      installments = [
        ...installments,
        {
          numero: installmentNumber,
          forma_pagamento_id: pickedPayMethod.id,
          valor_porcentagem: p,
          dias_vencimento: d
        }
      ];

      organizeInstallments()
    }

    function removeInstallment(i: number) {
      installments = installments.filter((_, idx) => idx !== i);
    }


    function organizeInstallments() {
        installments = [...installments]
          .sort((a, b) => a.numero - b.numero);
      }

    $effect(() => {
      installments;

      $formData.parcelas = installments;
      $formData.num_parcelas = installments.length;
    })

    console.log(data.paymentMethods);


</script>

<form use:enhance method="POST">
    <div class="flex gap-4">
        <FormInput form={form} label="Descrição" classes="w-96" name="descricao" bind:userInput={$formData.descricao}/>
    </div>



    <div class="flex flex-row gap-4">
        <div class="flex w-32 max-w-sm flex-col gap-1.5">
            <Label for="porcentagem">Número da Parcela</Label>
            <Input type="number" id="porcentagem" bind:value={installmentNumber}/>
            <p class="text-red-500 text-sm">{errors.installmentNumber}</p>
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="forma-pagamento">Forma de Pagamento</Label>
            <Input readonly type="text" id="forma-pagamento" bind:value={pickedPayMethod.descricao}/>
            <p class="text-red-500 text-sm">{errors.paymMethod}</p>
        </div>
        <div class="mt-5 ml-0">
           <PickerDialog title="Escolher forma de pagamento" columns={columns} bind:pickedItem={pickedPayMethod} getData={getPayForms} uri="forma-pagamento"/>
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="porcentagem">Porcentagem</Label>
            <Input type="number" id="porcentagem" bind:value={percent}/>
            <p class="text-red-500 text-sm">{errors.percent}</p>
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5">
            <Label for="dias">Dias</Label>
            <Input type="number" id="dias" bind:value={days}/>
            <p class="text-red-500 text-sm">{errors.days}</p>
        </div>
        <div class="mt-5 ml-0">
        <Form.Button type="button" onclick={addInstallment} style="float: right; margin-right: 1em;">Adicionar Parcela</Form.Button>
        </div>
    </div>


    {#if installments.length <= 0}

    <center><p class="m-10">Adicione uma parcela</p></center>

    {/if}


    {#if installments.length > 0}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>#</Table.Head>
            <Table.Head>Forma</Table.Head>
            <Table.Head>%</Table.Head>
            <Table.Head>Dias</Table.Head>
            <Table.Head>—</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each installments as inst, i}
            <Table.Row>
              <Table.Cell>
                <input
                  type="number"
                  name="parcela_numero"
                  value={inst.numero}
                  readonly
                />
              </Table.Cell>
              <Table.Cell>
                <Select.Root
                  type="single"
                  bind:value={inst.forma_pagamento_id}
                >
                  <Select.Trigger class="w-72">
                    {#if inst.forma_pagamento_id}
                      {#if data.paymentMethods}
                        {#each paymentMethods as m}
                          {#if m.id === inst.forma_pagamento_id}
                            {m.descricao}
                          {/if}
                        {/each}
                      {/if}
                    {:else}
                        -
                    {/if}
                  </Select.Trigger>

                  <Select.Content>
                    {#each data.paymentMethods as m}
                      <Select.Item value={m.id} label={m.descricao} />
                    {/each}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>

              <Table.Cell>
                <Input
                  type="number"
                  step="0.01"
                  name="valor_porcentagem"
                  bind:value={inst.valor_porcentagem}
                  required
                />
              </Table.Cell>
              <Table.Cell>
                <Input
                  type="number"
                  name="dias_vencimento"
                  bind:value={inst.dias_vencimento}
                  required
                />
              </Table.Cell>
              <Table.Cell>
                  <Button onclick={() => removeInstallment(i)}>
                    <Trash />
                  </Button>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    {/if}

    <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
    <input type="hidden" name="parcelas" bind:value={$formData.parcelas}/>
    <input type="hidden" name="num_parcelas" bind:value={$formData.num_parcelas}/>
</form>
<Button type="button" class="float-start" href="/condicao-pagamento">Voltar</Button>