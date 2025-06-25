<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { clientSchema } from "$lib/validation/clientSchema";
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, Trash2 } from "lucide-svelte";
  import { Label } from "$lib/components/ui/label";
  import * as Form from "$lib/components/ui/form";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Input } from "$lib/components/ui/input";
  import FormInput from "$lib/components/form-input.svelte";
  import CityListDialog from "$lib/components/modals/city-list-dialog.svelte";
  import PaymentConditionListDialog from "$lib/components/modals/payment-condition-list-dialog.svelte";
  import DatePicker from "$lib/components/date-picker.svelte";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(clientSchema),
  });
  const { form: formData, enhance } = form;

  const isJuridica = $derived($formData.is_juridica);
  const labelDoc1 = $derived(isJuridica ? "CNPJ" : "CPF");
  const labelDoc2 = $derived(isJuridica ? "Inscrição Estadual" : "RG");
  const labelNome = $derived(isJuridica ? "Razão Social" : "Nome Completo");
  const labelApelido = $derived(isJuridica ? "Nome Fantasia" : "Apelido");
  const labelData = $derived(
    isJuridica ? "Data de Fundação" : "Data de Nascimento"
  );

  let selectedCity = $state({
    id: data.client.cidade_id,
    nome: data.client.cidade_nome,
  });
  let selectedPaymentCondition = $state({
    id: data.client.cond_pag_id,
    descricao: data.client.cond_pag_descricao,
  });

  $effect(() => {
    if (selectedCity) $formData.cidade_id = selectedCity.id;
  });
  $effect(() => {
    if (selectedPaymentCondition)
      $formData.cond_pag_id = selectedPaymentCondition.id;
  });

  function formatDate(dateString: string | null | undefined) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("pt-BR");
  }

  function confirmDelete(e: Event) {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) {
      e.preventDefault();
    }
  }
</script>

<div class="mb-4 flex items-center gap-4">
  <Button href="/cliente" variant="outline" size="icon"
    ><ArrowLeft class="h-4 w-4" /></Button
  >
  <h1 class="text-2xl font-bold">Editar Cliente: {data.client.nome}</h1>
</div>

<form
  method="POST"
  action="?/update"
  use:enhance
  class="space-y-6"
  id="update-form"
>
  <div class="flex items-center space-x-6 pt-2">
    <Form.Field
      {form}
      name="is_juridica"
      class="flex flex-row items-center space-x-3 space-y-0"
      ><Form.Control
        >{#snippet children({ props })}<div class="flex items-center gap-2">
            <Checkbox {...props} bind:checked={$formData.is_juridica} /><Label
              >Pessoa Jurídica</Label
            >
          </div>{/snippet}</Form.Control
      ></Form.Field
    >
    <Form.Field
      {form}
      name="is_ativo"
      class="flex flex-row items-center space-x-3 space-y-0"
      ><Form.Control
        >{#snippet children({ props })}<div class="flex items-center gap-2">
            <Checkbox {...props} bind:checked={$formData.is_ativo} /><Label
              >Ativo</Label
            >
          </div>{/snippet}</Form.Control
      ></Form.Field
    >
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormInput
      {form}
      name="nome"
      label={labelNome}
      bind:userInput={$formData.nome}
    /><FormInput
      {form}
      name="apelido"
      label={labelApelido}
      bind:userInput={$formData.apelido}
    />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormInput
      {form}
      name="cpf"
      label={labelDoc1}
      bind:userInput={$formData.cpf}
    /><FormInput
      {form}
      name="rg"
      label={labelDoc2}
      bind:userInput={$formData.rg}
    />
    <Form.Field {form} name="data_nascimento" class="flex flex-col mt-2.5">
      <DatePicker
        label="Data de Nascimento"
        bind:date={$formData.data_nascimento}
      />
      <input type="hidden" name="data_nascimento" bind:value={$formData.data_nascimento}> 
    </Form.Field>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormInput
      {form}
      name="email"
      label="Email"
      type="email"
      bind:userInput={$formData.email}
    /><FormInput
      {form}
      name="telefone"
      label="Telefone"
      bind:userInput={$formData.telefone}
    />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
    <div class="md:col-span-4">
      <FormInput
        {form}
        name="endereco"
        label="Endereço"
        bind:userInput={$formData.endereco}
      />
    </div>
    <FormInput
      {form}
      name="numero"
      label="Número"
      type="number"
      bind:userInput={$formData.numero}
    />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormInput
      {form}
      name="bairro"
      label="Bairro"
      bind:userInput={$formData.bairro}
    /><FormInput {form} name="cep" label="CEP" bind:userInput={$formData.cep} />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Form.Field {form} name="cidade_id"
      ><Label>Cidade</Label>
      <div class="flex items-center gap-2 mt-1">
        <Input
          readonly
          value={selectedCity?.nome || ""}
          placeholder="Selecione uma cidade"
        /><CityListDialog bind:pickedItem={selectedCity} {data} />
      </div>
      <Form.FieldErrors /></Form.Field
    >
    <Form.Field {form} name="cond_pag_id"
      ><Label>Condição de Pagamento</Label>
      <div class="flex items-center gap-2 mt-1">
        <Input
          readonly
          value={selectedPaymentCondition?.descricao || ""}
          placeholder="Selecione uma condição"
        /><PaymentConditionListDialog
          bind:pickedItem={selectedPaymentCondition}
          {data}
        />
      </div>
      <Form.FieldErrors /></Form.Field
    >
  </div>
  <input type="hidden" name="cidade_id" bind:value={$formData.cidade_id} />
  <input type="hidden" name="cond_pag_id" bind:value={$formData.cond_pag_id} />
  <div class="max-w-xs">
    <FormInput
      {form}
      name="limite_credito"
      label="Limite de Crédito (R$)"
      type="number"
      bind:userInput={$formData.limite_credito}
    />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
    <div>
      <Label class="text-sm font-medium text-muted-foreground"
        >Data de Cadastro</Label
      >
      <p class="text-sm mt-1">{formatDate(data.client.data_cadastro)}</p>
    </div>
    <div>
      <Label class="text-sm font-medium text-muted-foreground"
        >Última Edição</Label
      >
      <p class="text-sm mt-1">{formatDate(data.client.data_ultima_edicao)}</p>
    </div>
  </div>
</form>

<div class="flex justify-between items-center mt-8">
  <form method="POST" action="?/delete" use:enhance>
    <Button variant="destructive" type="submit" on:click={confirmDelete}
      ><Trash2 class="mr-2 h-4 w-4" />Deletar</Button
    >
  </form>
  <Button type="submit" form="update-form">Salvar Alterações</Button>
</div>
