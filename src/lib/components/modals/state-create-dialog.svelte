<script lang="ts">
  import FormInput from "$lib/components/form-input.svelte";
  import { browser } from "$app/environment";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Form from "$lib/components/ui/form/index.js";
  import { stateSchema } from "$lib/validation/stateSchema";
  import Plus from "@lucide/svelte/icons/plus";
  import { toast } from "svelte-sonner";
  import SuperDebug, { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import CountryListDialog from "./country-list-dialog.svelte";

  let { data, updateList } = $props();

  const form = superForm(data.stateForm, {
    validators: zodClient(stateSchema),
    applyAction: true,
    invalidateAll: false,
    resetForm: false,
    onResult({ result }) {
      if (result.type === "success") {
        toast.success("Item criado com sucesso.");

        updateList;
        open = false;
      }
    },
  });

  const { form: formData, enhance } = form;

  let open = $state(false);

  let country = $state({
    id: $formData.country_id,
    nome: $formData.country_nome,
  });

  $effect(() => {
    country;

    $formData.country_id = country.id;
  });
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
    ><Plus /></Dialog.Trigger
  >
  <Dialog.Content class="sm:max-w-[920px]">
    <Dialog.Header>
      <Dialog.Title>Criar Estado</Dialog.Title>
    </Dialog.Header>
    <form method="POST" action="?/state" use:enhance>
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
        <input
          type="hidden"
          readonly
          name="country_id"
          bind:value={$formData.country_id}
        />
        <div class="mt-8 ml-0">
          <CountryListDialog {data} bind:pickedItem={country} />
        </div>
      </div>
      {#if browser}
        <SuperDebug data={$formData} />
      {/if}
      <Dialog.Footer class="mt-5">
        <Form.Button style="float: right; margin-right: 1em;"
          >Salvar</Form.Button
        >
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
