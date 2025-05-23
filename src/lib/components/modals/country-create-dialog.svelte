<script lang="ts">
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import CidadeForm from "$lib/components/forms/cidade-form.svelte";
    import { superValidate } from "sveltekit-superforms";
    import Plus from "@lucide/svelte/icons/plus";
    import * as Form from "$lib/components/ui/form/index.js";
    import { stateSchema, type FormSchema } from "$lib/validation/stateSchema";
    import SuperDebug, {
      type SuperValidated,
      type Infer,
      superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import FormInput from "$lib/components/form-input.svelte";
    import PickerDialog from "$lib/components/picker-dialog.svelte";
    import { browser } from "$app/environment";
    import StateListDialog from "./state-list-dialog.svelte";
  
    let { data } = $props();
  
    const form = superForm(data.countryForm, {
    validators: zodClient(stateSchema),
    });

  const { form: formData, enhance } = form;

  console.log($formData);

  const columns = [
    { label: "ID", key: "id", class: "w-[100px]" },
    { label: "Nome", key: "nome" },
  ];

  let country = $state({
    id: $formData.country_id,
    nome: $formData.country_nome,
  });

  $effect(() => {
    country;

    $formData.country_id = country.id;
  });

  async function getCountries(): Promise<any> {
    const response = await fetch("/pais");
    let countryRows = await response.json();
    return countryRows;
  }
  </script>
  
  <Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
      ><Plus /></Dialog.Trigger
    >
    <Dialog.Content class="sm:max-w-[800px]">
      <Dialog.Header>
        <Dialog.Title>Criar País</Dialog.Title>
      </Dialog.Header>
      <form method="POST" use:enhance>
        <div class="flex gap-4">
            <FormInput form={form} label="Nome" classes="w-96" name="nome" bind:userInput={$formData.nome}/>
            <FormInput form={form} label={"Sigla"} classes="w-24" name="sigla" bind:userInput={$formData.sigla}/>
        </div>
        <Dialog.Footer class="mt-5">
          <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>
  