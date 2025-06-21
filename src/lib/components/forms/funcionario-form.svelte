<script lang="ts">
  import { onMount } from "svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import FormInput from "$lib/components/form-input.svelte";
  import { employeeSchema } from "$lib/validation/employeeSchema";
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
  import PickerDialog from "$lib/components/picker-dialog.svelte";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import CityCreateDialog from "../modals/city-create-dialog.svelte";
  import CityListDialog from "../modals/city-list-dialog.svelte";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(employeeSchema),
    applyAction: true,
    onError({result}) {
        console.log(result)
    },
    onResult({ result }) {
      if (result.type === "success") {
        toast.success("Cidade criada com sucesso.");
        setTimeout(() => goto("/cidade"), 0);
      }
      if (result.type === "error") {
        console.log(form.allErrors);
        console.log(form.errors);
      }
    },
  });

  const { form: formData, enhance } = form;

  let cidade = $state({
    id: "",
    nome: "",
    state_nome: "",
  });

  $effect(() => {
    cidade.id;

    $formData.cidade_id = cidade.id;
  });

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

<form method="POST" action="?/create" use:enhance>
  <div class="items-top flex space-x-2 mt-10 ml-end float-right">
    <Checkbox bind:checked={$formData.ativo} />
    <div class="grid gap-1.5 leading-none">
      <Label
        for="terms1"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Ativo
      </Label>
    </div>
  </div>
  <div class="flex gap-4">
    <FormInput
      {form}
      label="Nome"
      classes="w-96"
      name="nome"
      bind:userInput={$formData.nome}
    />
    <FormInput
      {form}
      label="Apelido"
      classes="w-96"
      name="apelido"
      bind:userInput={$formData.apelido}
    />
  </div>
  <Separator class="my-4" />
  <div class="flex gap-4">
    <FormInput
      {form}
      label="Estado"
      readonly={true}
      classes="w-48"
      name="estado_nome"
      bind:userInput={cidade.state_nome}
    />
    <FormInput
      {form}
      label="Cidade"
      readonly={true}
      classes="w-96"
      name="cidade_nome"
      bind:userInput={cidade.nome}
    />
    <div class="mt-8 ml-0">
      <CityListDialog {data} bind:pickedItem={cidade} />
    </div>
    <FormInput
      {form}
      label="Endereço"
      classes="w-72"
      name="endereco"
      bind:userInput={$formData.endereco}
    />
    <FormInput
      {form}
      label="Número"
      classes="w-24"
      name="numero"
      bind:userInput={$formData.numero}
    />
  </div>
  <div class="flex gap-4">
    <FormInput
      {form}
      label="Complemento"
      classes="w-2/5"
      name="complemento"
      bind:userInput={$formData.complemento}
    />
    <FormInput
      {form}
      label="Bairro"
      classes="w-72"
      name="bairro"
      bind:userInput={$formData.bairro}
    />
    <FormInput
      {form}
      label="CEP"
      classes="w-36"
      name="cep"
      bind:userInput={$formData.cep}
    />
  </div>
  <Separator class="my-4" />
  <div class="flex gap-4">
    <FormInput
      {form}
      label="RG"
      classes="w-36 flex flex-col"
      name="rg"
      bind:userInput={$formData.rg}
    />
    <FormInput
      {form}
      label="CPF"
      classes="w-36 flex flex-col"
      name="cpf"
      bind:userInput={$formData.cpf}
    />
    <Form.Field {form} name="data_nascimento" class="flex flex-col">
      <DatePicker
        label="Data de Nascimento"
        bind:date={$formData.data_nascimento}
      />
      <input type="hidden" name="data_nascimento" bind:value={$formData.data_nascimento}> 
    </Form.Field>
    <FormInput
      {form}
      label="Email"
      classes="w-1/5 flex flex-col"
      name="email"
      bind:userInput={$formData.email}
    />
    <FormInput
      {form}
      label="Telefone"
      classes="w-1/5 flex flex-col"
      name="telefone"
      bind:userInput={$formData.telefone}
    />
  </div>
  <Separator class="my-4" />
  <div class="flex gap-4">
    <FormInput
      {form}
      label="Turno"
      classes="w-1/5"
      name="matricula"
      bind:userInput={$formData.turno}
    />
    <FormInput
      {form}
      label="Matrícula"
      classes="w-1/5"
      name="matricula"
      bind:userInput={$formData.matricula}
    />
    <FormInput
      {form}
      label="Cargo"
      classes="w-72"
      name="cargo"
      bind:userInput={$formData.cargo}
    />
    <FormInput
      {form}
      label="Salario"
      classes="w-36"
      name="cep"
      bind:userInput={$formData.salario}
    />
    <FormInput
      {form}
      label="Carga Horária"
      classes="w-36"
      name="carga_horaria"
      bind:userInput={$formData.carga_horaria}
    />
    <Form.Field {form} name="data_admissao" class="flex flex-col mt-2.5">
      <DatePicker
        label="Data de Admissão"
        bind:date={$formData.data_admissao}
      />
    </Form.Field>
    <Form.Field {form} name="data_demissao" class="flex flex-col mt-2.5">
      <DatePicker
        label="Data de Demissão"
        bind:date={$formData.data_demissao}
      />
    </Form.Field>
  </div>
  <div class="flex gap-4"></div>
  <Form.Button type="submit" style="float: right; margin-right: 1em;">Salvar</Form.Button>
</form>
<Button type="button" class="float-start" href="/funcionario">Voltar</Button>
{#if browser}
<SuperDebug data={$formData} />
{/if}