<script lang="ts">
    import { onMount } from "svelte";
    import * as Form from "$lib/components/ui/form/index.js";
    import FormInput from "$lib/components/form-input.svelte";
    import { supplierSchema, type FormSchema } from "$lib/validation/supplierSchema";
    import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
    import SuperDebug, {
        type SuperValidated,
        type Infer,
        superForm,
    } from "sveltekit-superforms";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { browser } from "$app/environment";
    import DatePicker from "$lib/components/date-picker.svelte";
    import PickerDialog from "$lib/components/picker-dialog.svelte"

    let { data } = $props();
    export const ssr = false;

    const form = superForm(data.form, {
        validators: zodClient(supplierSchema),
    });

    const { form: formData, enhance } = form;



    let date = $state($formData.data_nascimento);
    let cidade = $state({
      id: '',
      nome: '',
      state_nome: '',
    });
    let labelNome = $state("Nome");
    let labelApelido = $state("Apelido");
    let labelCpf = $state("CPF");
    let labelRg = $state("RG");
    let labelDataNasc = $state("Data de Nascimento");


    $formData.is_ativo = true;

    const cityColumns = [
      { label: 'ID', key: 'id', class: 'w-[50px]' },
      { label: 'Nome', key: 'nome' },
      { label: 'Estado', key: 'state_nome'},
      ];

    async function getCities():Promise<any> {
      const response = await fetch('/cidade');
      let cityRows = await response.json();
      console.log(cityRows);
      return cityRows;
    }

    async function getPayconditions():Promise<any> {
      const response = await fetch('/condicao-pagamento');
      let condRows = await response.json();
      console.log(condRows);
      return condRows;
    }


    $effect(() => {
      cidade.id;

      $formData.cidade_id = cidade.id;
	});

    $effect(() => {
      date;
      $formData.data_nascimento = date;
      //console.log($formData.data_nascimento);
    })

    $effect(() => {
      $formData.is_juridica;

      if($formData.is_juridica == true) {
        labelNome = "Razão Social";
        labelApelido = "Nome Fantasia";
        labelCpf = "CNPJ";
        labelRg = "Inscrição Estadual";
        labelDataNasc = "Data de Fundação";
      }

      else {
        labelNome = "Nome";
        labelApelido = "Apelido";
        labelCpf = "CPF";
        labelRg = "RG";
        labelDataNasc = "Data de Nascimento";
      }
    })

    let mounted = false;
      onMount(() => {
        mounted = true;
      });

</script>

<form method="POST" use:enhance>
    <Form.Fieldset {form} name="is_juridica" class="space-y-3">
        <Form.Legend>Tipo de Cliente</Form.Legend>
        <RadioGroup.Root
            bind:value={$formData.is_juridica}
            class="flex gap-4"
            name="is_juridica"
        >
            <div class="flex items-center space-x-3 space-y-0">
                <Form.Control>
                    {#snippet children({ props })}
                        <RadioGroup.Item value={false} {...props} />
                        <Form.Label class="font-normal"
                            >Pessoa Física</Form.Label
                        >
                    {/snippet}
                </Form.Control>
            </div>
            <div class="flex items-center space-x-3 space-y-0">
                <Form.Control>
                    {#snippet children({ props })}
                        <RadioGroup.Item value={true} {...props} />
                        <Form.Label class="font-normal"
                            >Pessoa Jurídica</Form.Label
                        >
                    {/snippet}
                </Form.Control>
            </div>
        </RadioGroup.Root>
        <Form.FieldErrors />
    </Form.Fieldset>
    <div class="flex gap-4">
        <FormInput form={form} label={labelNome} classes="w-96" name="nome" bind:userInput={$formData.nome}/>
        <FormInput form={form} label={labelApelido} classes="w-96" name="apelido" bind:userInput={$formData.apelido}/>
    </div>
    <Separator class="my-4" />
    <div class="flex gap-4">
        <FormInput form={form} label="Estado" readonly={true} classes="w-48" name="estado_nome" bind:userInput={cidade.state_nome}/>
        <FormInput form={form} label="Cidade" readonly={true} classes="w-96" name="cidade_nome" bind:userInput={cidade.nome}/>
        <div class="mt-8 ml-0">
            <PickerDialog title="Escolher cidade" columns={cityColumns} bind:pickedItem={cidade} getData={getCities} uri="cidade"/>
        </div>
        <FormInput form={form} label="Endereço" classes="w-72" name="endereco" bind:userInput={$formData.endereco}/>
        <FormInput form={form} label="Número" classes="w-24" name="numero" bind:userInput={$formData.numero}/>
    </div>
    <div class="flex gap-4">
        <FormInput form={form} label="Complemento" classes="w-2/5" name="complemento" bind:userInput={$formData.complemento}/>
        <FormInput form={form} label="Bairro" classes="w-72" name="bairro" bind:userInput={$formData.bairro}/>
        <FormInput form={form} label="CEP" classes="w-36" name="cep" bind:userInput={$formData.cep}/>
    </div>
    <Separator class="my-4" />
    <div class="flex gap-4">
        <FormInput form={form} label={labelRg} classes="w-36 flex flex-col" name="rg" bind:userInput={$formData.rg}/>
        <FormInput form={form} label={labelCpf} classes="w-36 flex flex-col" name="cpf" bind:userInput={$formData.cpf}/>
        <Form.Field {form} name="data_nascimento" class="flex flex-col">
                <DatePicker label={labelDataNasc} bind:date={date} />
        </Form.Field>
    </div>
    <div class="flex gap-4">
        <FormInput form={form} label="Email" classes="w-1/5 flex flex-col" name="email" bind:userInput={$formData.email}/>
        <FormInput form={form} label="Telefone" classes="w-1/5 flex flex-col" name="telefone" bind:userInput={$formData.telefone}/>
    </div>
    <input type="hidden" readonly name="cidade_id" bind:value={cidade.id}>
    <input type="hidden" readonly name="data_nascimento" bind:value={date}>
    <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
</form>
<br />
<br />
{#if browser}
    <SuperDebug data={$formData} />
{/if}
