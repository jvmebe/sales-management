<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import FormInput from "$lib/components/form-input.svelte";
    import { countrySchema, type FormSchema } from "$lib/validation/countrySchema";
    import { superForm } from "sveltekit-superforms";
    import Button from "$lib/components/ui/button/button.svelte";
    import { zodClient } from "sveltekit-superforms/adapters";

    let { data } = $props();

    const form = superForm(data.form, {
        validators: zodClient(countrySchema),
    });

    const { form: formData, enhance } = form;

</script>

<form method="POST" use:enhance>
    <div class="flex gap-4">
        <FormInput form={form} label="País" classes="w-96" name="nome" bind:userInput={$formData.nome}/>
        <FormInput form={form} label="Sigla" classes="w-24" name="sigla" bind:userInput={$formData.sigla}/>
    </div>
    <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
</form>
<Button type="button" class="float-start" href="/pais">Voltar</Button>
