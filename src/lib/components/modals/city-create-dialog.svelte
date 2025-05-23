<script lang="ts">
  import FormInput from "$lib/components/form-input.svelte";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Form from "$lib/components/ui/form/index.js";
  import { citySchema } from "$lib/validation/citySchema";
  import Plus from "@lucide/svelte/icons/plus";
  import SuperDebug, { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import StateListDialog from "./state-list-dialog.svelte";
  import { browser } from "$app/environment";
  import { toast } from "svelte-sonner";

  let { data, updateList } = $props();

  const form = superForm(data.cityForm, {
    validators: zodClient(citySchema),
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

  console.log($formData);

  let open = $state(false);

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
</script>

<Dialog.Root bind:open={open}>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
    ><Plus /></Dialog.Trigger
  >
  <Dialog.Content class="sm:max-w-[800px]">
    <Dialog.Header>
      <Dialog.Title>Criar Cidade</Dialog.Title>
    </Dialog.Header>
    <form method="POST" action="?/city" use:enhance>
      <div class="flex gap-4">
        <FormInput
          {form}
          label="Cidade"
          classes="w-2/5"
          name="nome"
          bind:userInput={$formData.nome}
        />
        <FormInput
          {form}
          label="Estado"
          readonly={true}
          classes="w-2/5"
          name="estado_nome"
          bind:userInput={state.nome}
        />
        <div class="mt-8 ml-0">
          <StateListDialog {data} bind:pickedItem={state} />
        </div>
      </div>
      <input
        type="hidden"
        readonly
        name="state_id"
        bind:value={$formData.state_id}
      />

      {#if browser}
        <SuperDebug data={$formData} />
      {/if}

      <Dialog.Footer class="mt-5">
        <Form.Button type="submit" style="float: right; margin-right: 1em;"
          >Salvar</Form.Button
        >
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
