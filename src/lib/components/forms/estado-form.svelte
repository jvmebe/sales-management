<script lang="ts">
  import FormInput from "$lib/components/form-input.svelte";
  import PickerDialog from "$lib/components/picker-dialog.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import { stateSchema } from "$lib/validation/stateSchema";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import CountryListDialog from "../modals/country-list-dialog.svelte";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(stateSchema),
    applyAction: true,
    onResult({ result }) {
      if (result.type === "success") {
        toast.success("Cidade criada com sucesso.");
        setTimeout(() => goto('/cidade'), 0);
      }
    },
  });

  const { form: formData, enhance } = form;

  let country = $state({
    id: $formData.country_id,
    nome: $formData.country_nome,
  });

  $effect(() => {
    country;

    $formData.country_id = country.id;
  });
</script>

<form use:enhance action="?/create" method="POST">
  <div class="flex gap-4">
    <FormInput
      {form}
      label="Estado"
      classes="w-96"
      name="nome"
      bind:userInput={$formData.nome}
    />
    <FormInput
      {form}
      label="Sigla"
      classes="w-36"
      name="sigla"
      bind:userInput={$formData.sigla}
    />
    <FormInput
      {form}
      label="País"
      readonly={true}
      classes="w-96"
      name="pais_nome"
      bind:userInput={country.nome}
    />
    <div class="mt-8 ml-0">
      <CountryListDialog {data} bind:pickedItem={country} />
    </div>
  </div>
  <input
    type="hidden"
    readonly
    name="country_id"
    bind:value={$formData.country_id}
  />
  <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
</form>
<Button type="button" class="float-start" href="/estado">Voltar</Button>
