<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { clientSchema, type FormSchema } from "$lib/validation/clientSchema";
    import SuperDebug, {
     type SuperValidated,
     type Infer,
     superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import Button from '$lib/components/ui/button/button.svelte';
    import FormInput from '$lib/components/form-input.svelte';
    import PickerDialog from '$lib/components/picker-dialog.svelte'
    import { browser } from '$app/environment';

    let { data } = $props();

    const form = superForm(data.form, {
        validators: zodClient(clientSchema),
    });

    const { form: formData, enhance } = form;

</script>



<form method="POST">
    <div class="flex gap-4">
        <FormInput form={form} label="Descrição" classes="w-96" name="descricao" bind:userInput={$formData.descricao}/>
    </div>
    <input type="hidden" readonly name="state_id" bind:value={$formData.state_id} />
    <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
</form>
<Button type="button" class="float-start" href="/forma-pagamento">Voltar</Button>
