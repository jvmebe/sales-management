<script lang="ts">
    import FormInput from "$lib/components/form-input.svelte";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Form from "$lib/components/ui/form/index.js";
    import { stateSchema } from "$lib/validation/stateSchema";
    import Plus from "@lucide/svelte/icons/plus";
    import {
      superForm
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import CountryListDialog from "./country-list-dialog.svelte";
  
    let { data } = $props();
  
    const form = superForm(data.stateForm, {
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
        <Dialog.Title>Criar Estado</Dialog.Title>
      </Dialog.Header>
      <form method="POST" use:enhance>
        <div class="flex gap-4">
            <FormInput
              {form}
              label="Estado"
              classes="w-2/5"
              name="nome"
              bind:userInput={$formData.nome}
            />
            <FormInput
              {form}
              label="Sigla"
              classes="w-16"
              name="sigla"
              bind:userInput={$formData.sigla}
            />
            <FormInput
              {form}
              label="País"
              readonly={true}
              classes="w-2/5"
              name="pais_nome"
              bind:userInput={country.nome}
            />
            <div class="mt-8 ml-0">
                <CountryListDialog {data}/>
            </div>
          </div>
        <Dialog.Footer class="mt-5">
          <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>
  