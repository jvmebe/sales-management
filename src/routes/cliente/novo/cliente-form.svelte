<script lang="ts">
    import {
        CalendarDate,
        DateFormatter,
        type DateValue,
        getLocalTimeZone,
        parseDate,
        today,
    } from "@internationalized/date";
    import { onMount } from "svelte";
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { formSchema, type FormSchema } from "$lib/validation/clientSchema";
    import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
    import SuperDebug, {
        type SuperValidated,
        type Infer,
        superForm,
    } from "sveltekit-superforms";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import Label from "$lib/components/ui/label/label.svelte";
    import { browser } from "$app/environment";
    import Search from "@lucide/svelte/icons/search";
    import DatePicker from "$lib/components/date-picker.svelte";
    import PickerDialog from "$lib/components/picker-dialog.svelte"

    let { data } = $props();

    let dataRows = data.conditions;



    const form = superForm(data.form, {
        validators: zodClient(formSchema),
    });

    const { form: formData, enhance } = form;



    let cidade_id = $state(0);
    let cidade_nome = $state("");
    let estado_nome = $state("");
    let cond_pag = $state({
      id: '',
      descricao: '',
    });


    $formData.is_juridica = false;
    $formData.is_ativo = true;

    const columns = [
      { label: 'ID', key: 'id', class: 'w-[50px]' },
      { label: 'Descrição', key: 'descricao' },
      { label: 'Núm. Parcelas', key: 'numero_parcelas', class: 'w-[80px]' },
      ];

    function openCityPopup() {
        window.open(
            "/cidade/selecionar",
            "Selecionar Cidade",
            "width=600,height=400",
        );
    }

    onMount(() => {
        // @ts-ignore
        window.handleCitySelect = (id, cityName, stateName) => {
            cidade_id = id;
            cidade_nome = cityName;
            estado_nome = stateName;
            $formData.cidade_id = cidade_id;
        };
    });

    $effect(() => {
      cond_pag.id;

      $formData.cond_pag_id = cond_pag.id;
	});


</script>

<form method="POST" use:enhance>
    <Form.Fieldset {form} name="is_juridica" class="space-y-3">
        <Form.Legend>Tipo de Cliente</Form.Legend>
        <RadioGroup.Root
            bind:value={$formData.is_juridica}
            class="flex flex-col space-y-1"
            name="is_juridica"
        >
            <div class="flex items-center space-x-3 space-y-0">
                <Form.Control>
                    {#snippet children({ props })}
                        <RadioGroup.Item value={false} {...props} />
                        <Form.Label class="font-normal"
                            >Pessoa Física</Form.Label
                        >
                    {/snippet}
                </Form.Control>
            </div>
            <div class="flex items-center space-x-3 space-y-0">
                <Form.Control>
                    {#snippet children({ props })}
                        <RadioGroup.Item value={true} {...props} />
                        <Form.Label class="font-normal"
                            >Pessoa Jurídica</Form.Label
                        >
                    {/snippet}
                </Form.Control>
            </div>
        </RadioGroup.Root>
        <Form.FieldErrors />
    </Form.Fieldset>
    <div class="flex gap-4">
        <Form.Field class="w-96" {form} name="nome">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Nome</Form.Label>
                    <Input {...props} bind:value={$formData.nome} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-96" {form} name="apelido">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Apelido</Form.Label>
                    <Input {...props} bind:value={$formData.apelido} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    </div>
    <Separator class="my-4" />
    <div class="flex gap-4">
        <Form.Field class="w-48" {form} name="cidade_nome">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Estado</Form.Label>
                    <Input readonly {...props} bind:value={estado_nome} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-96 gap-4" {form} name="cidade_nome">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Cidade</Form.Label>
                    <div style="display: flex;" class="gap-4">
                        <Input readonly {...props} bind:value={cidade_nome} />
                        <Button
                            type="button"
                            size="icon"
                            onclick={openCityPopup}><Search /></Button
                        >
                    </div>
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-full" {form} name="endereco">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Endereço</Form.Label>
                    <Input {...props} bind:value={$formData.endereco} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-36" {form} name="numero">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Número</Form.Label>
                    <Input {...props} bind:value={$formData.numero} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    </div>
    <div class="flex gap-4">
        <Form.Field class="w-2/5" {form} name="complemento">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Complemento</Form.Label>
                    <Input {...props} bind:value={$formData.complemento} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-72" {form} name="bairro">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Bairro</Form.Label>
                    <Input {...props} bind:value={$formData.bairro} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-48" {form} name="cep">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>CEP</Form.Label>
                    <Input {...props} bind:value={$formData.cep} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    </div>
    <Separator class="my-4" />
    <div class="flex gap-4">
        <Form.Field class="w-32 flex flex-col" {form} name="rg">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>RG</Form.Label>
                    <Input {...props} bind:value={$formData.rg} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-32 flex flex-col" {form} name="cpf">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>CPF</Form.Label>
                    <Input {...props} bind:value={$formData.cpf} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="data_nascimento" class="flex flex-col">
            <DatePicker label="Data de Nascimento" bind:date={$formData.data_nascimento} />
        </Form.Field>
    </div>
    <div class="flex gap-4">
        <Form.Field class="w-2/5" {form} name="email">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Email</Form.Label>
                    <Input {...props} bind:value={$formData.email} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-2/5" {form} name="telefone">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Telefone</Form.Label>
                    <Input {...props} bind:value={$formData.telefone} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    </div>
    <Form.Field class="w-2/5" {form} name="limite_credito">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Limite de Crédito</Form.Label>
                <Input {...props} bind:value={$formData.limite_credito} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field class="w-2/5" {form} name="cond_pag_id">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Condição de Pagamento</Form.Label>
                <Input {...props} bind:value={cond_pag.descricao} />
                <PickerDialog title="Escolher condição de pagamento" columns={columns} data={dataRows} bind:pickedItem={cond_pag}/>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <input type="hidden" readonly name="cidade_id" value="{cidade_id}">
    <input type="hidden" readonly name="cond_pag_id" bind:value={cond_pag.id}>
    <Form.Button style="float: right; margin-right: 1em;">Salvar</Form.Button>
</form>
<br />
<br />
{#if browser}
    <SuperDebug data={$formData} />
{/if}
