<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { formSchema, type FormSchema } from "$lib/validation/paycondSchema";
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
        validators: zodClient(formSchema),
    });

    const { form: formData, enhance } = form;

    console.log($formData);

</script>



<form method="POST">
    <div class="flex gap-4">
        <FormInput form={form} label="Descrição" classes="w-96" name="descricao" bind:userInput={$formData.descricao}/>
    </div>
    <input type="hidden" readonly name="state_id" bind:value={$formData.state_id} />
    <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
</form>
<Button type="button" class="float-start" href="/cidade">Voltar</Button>


<Button></Button>


{#if browser}
    <SuperDebug data={$formData} />
{/if}
