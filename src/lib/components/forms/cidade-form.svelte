<script lang="ts">
  import { goto } from "$app/navigation";
  import FormInput from "$lib/components/form-input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Form from "$lib/components/ui/form/index.js";
  import { citySchema } from "$lib/validation/citySchema";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import StateListDialog from "../modals/state-list-dialog.svelte";

  let { data } = $props();

  const form = superForm(data.form, {
    validators: zodClient(citySchema),
    applyAction: true,
    onResult({ result }) {
      if (result.type === "success") {
        toast.success("Cidade criada com sucesso.");
        setTimeout(() => goto('/cidade'), 0);
      }
    },
  });

  const { form: formData, enhance } = form;

  console.log($formData);

  let state = $state({
    id: $formData.state_id,
    nome: $formData.state_nome,
  });

  $effect(() => {
    state;

    $formData.state_id = state.id;
  });
</script>

<form method="POST" action="?/create" use:enhance>
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
      <StateListDialog {data} bind:pickedItem={state} />
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
