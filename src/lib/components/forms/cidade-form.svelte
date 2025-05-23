<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { clientSchema, type FormSchema } from "$lib/validation/clientSchema";
  import SuperDebug, {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import Button from "$lib/components/ui/button/button.svelte";
  import FormInput from "$lib/components/form-input.svelte";
  import PickerDialog from "$lib/components/picker-dialog.svelte";
  import { browser } from "$app/environment";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(clientSchema),
  });

  const { form: formData, enhance } = form;

  console.log($formData);

  const columns = [
    { label: "ID", key: "id", class: "w-[100px]" },
    { label: "Nome", key: "nome" },
  ];

  let state = $state({
    id: $formData.state_id,
    nome: $formData.state_nome,
  });

  $effect(() => {
    state;

    $formData.state_id = state.id;
  });

  async function getStates(): Promise<any> {
    const response = await fetch("/estado");
    let cityRows = await response.json();
    return cityRows;
  }
</script>

<form method="POST">
  <div class="flex gap-4">
    <FormInput
      {form}
      label="Cidade"
      classes="w-96"
      name="nome"
      bind:userInput={$formData.nome}
    />
    <FormInput
      {form}
      label="Estado"
      readonly={true}
      classes="w-96"
      name="estado_nome"
      bind:userInput={state.nome}
    />
    <div class="mt-8 ml-0">
      <PickerDialog
        title="Escolher condição de pagamento"
        {columns}
        bind:pickedItem={state}
        getData={getStates}
        uri="estado"
      />
    </div>
  </div>
  <input
    type="hidden"
    readonly
    name="state_id"
    bind:value={$formData.state_id}
  />
  <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
</form>
<Button type="button" class="float-start" href="/cidade">Voltar</Button>
