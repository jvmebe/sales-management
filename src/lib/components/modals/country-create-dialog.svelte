<script lang="ts">
    import FormInput from "$lib/components/form-input.svelte";
    import { browser } from "$app/environment";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Form from "$lib/components/ui/form/index.js";
    import { countrySchema } from "$lib/validation/countrySchema";
    import Plus from "@lucide/svelte/icons/plus";
    import SuperDebug, {
      superForm
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { toast } from "svelte-sonner";
  
    let { data, updateList } = $props();
  
    const form = superForm(data.countryForm, {
    validators: zodClient(countrySchema),
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

  console.log($formData);

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
    <Dialog.Content class="sm:max-w-[800px]">
      <Dialog.Header>
        <Dialog.Title>Criar País</Dialog.Title>
      </Dialog.Header>
      <form method="POST" action="?/country" use:enhance>
        <div class="flex gap-4">
            <FormInput form={form} label="Nome" classes="w-96" name="nome" bind:userInput={$formData.nome}/>
            <FormInput form={form} label={"Sigla"} classes="w-24" name="sigla" bind:userInput={$formData.sigla}/>
        </div>
        {#if browser}
        <SuperDebug data={$formData} />
        {/if}
        <Dialog.Footer class="mt-5">
          <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>
  