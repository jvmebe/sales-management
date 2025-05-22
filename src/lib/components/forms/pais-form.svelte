<script lang="ts">
    import { onMount } from "svelte";
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import FormInput from "$lib/components/form-input.svelte";
    import { formSchema, type FormSchema } from "$lib/validation/countrySchema";
    import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
    import SuperDebug, {
        type SuperValidated,
        type Infer,
        superForm,
    } from "sveltekit-superforms";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { browser } from "$app/environment";
    import DatePicker from "$lib/components/date-picker.svelte";
    import PickerDialog from "$lib/components/picker-dialog.svelte"
    import Label from "$lib/components/ui/label/label.svelte";

    let { data } = $props();

    const form = superForm(data.form, {
        validators: zodClient(formSchema),
    });

    const { form: formData, enhance } = form;

</script>

<form method="POST" use:enhance>
    <div class="flex gap-4">
        <FormInput form={form} label="Nome" classes="w-96" name="nome" bind:userInput={$formData.nome}/>
        <FormInput form={form} label={"Sigla"} classes="w-24" name="sigla" bind:userInput={$formData.sigla}/>
    </div>
    <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
</form>
<Button type="button" class="float-start" href="/pais">Voltar</Button>
