<script lang="ts">
    import { onMount } from 'svelte';
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { formSchema, type FormSchema } from "./schema";
    import {
     type SuperValidated,
     type Infer,
     superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import Button from '$lib/components/ui/button/button.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    
    let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } =
     $props();
    
    const form = superForm(data.form, {
     validators: zodClient(formSchema),
    });
    
    const { form: formData, enhance } = form;

    let state_id = $state('');
    let state_nome = $state('');

    function openStatePopup() {
    window.open('/estado/selecionar', 'Selecionar Estado', 'width=600,height=400');
    }

    onMount(() => {
        // @ts-ignore
        window.handleStateSelect = (id, nome) => {
        state_id = id;
        state_nome = nome;
        };
    });

</script>
    


<form method="POST" use:enhance>
    <Form.Field {form} name="nome">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Cidade</Form.Label>
                <Input {...props} bind:value={$formData.nome} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="state_id">
        <Form.Control>
            {#snippet children({ props })}
                <Input type=hidden {...props} bind:value={state_id} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Label>Estado</Label>
    <div style="display: flex; align-items:center">
    <Input readonly bind:value={state_nome} />
    <Button style="margin: 1em" type="button" onclick={openStatePopup}>Selecionar Estado</Button>
    </div>
    <Form.Button style="float: right; margin-right: 1em;" >Salvar</Form.Button>
</form>