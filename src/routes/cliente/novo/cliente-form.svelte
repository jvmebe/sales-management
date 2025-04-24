<script lang="ts">
    import CalendarIcon from "@lucide/svelte/icons/calendar";
    import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
    parseDate,
    today
  } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { onMount } from "svelte";
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { formSchema, type FormSchema } from "./schema";
    import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
    import SuperDebug, {
        type SuperValidated,
        type Infer,
        superForm,
    } from "sveltekit-superforms";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { zodClient } from "sveltekit-superforms/adapters";
    import {
    Button,
    buttonVariants
    } from "$lib/components/ui/button/index.js";
    import Label from "$lib/components/ui/label/label.svelte";
    import { browser } from "$app/environment";
    import Search from "@lucide/svelte/icons/search";

    let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } =
        $props();

    const form = superForm(data.form, {
        validators: zodClient(formSchema),
    });

    const { form: formData, enhance } = form;

    const df = new DateFormatter("en-US", {
    dateStyle: "long"
  });
 
  let value = $state<DateValue | undefined>();
 
  $effect(() => {
    value = $formData.data_nascimento ? parseDate($formData.data_nascimento) : undefined;
  });
 
  let placeholder = $state<DateValue>(today(getLocalTimeZone()));

    let cidade_id = $state("");
    let cidade_nome = $state("");
    let estado_nome = $state("");

    $formData.is_juridico = "false";
    $formData.is_ativo = "true";

    function openCityPopup() {
    window.open('/cidade/selecionar', 'Selecionar Cidade', 'width=600,height=400');
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

</script>

<form method="POST" use:enhance>
    <Form.Fieldset {form} name="is_juridico" class="space-y-3">
        <Form.Legend>Tipo de Cliente</Form.Legend>
        <RadioGroup.Root
            bind:value={$formData.is_juridico}
            class="flex flex-col space-y-1"
            name="is_juridico"
        >
            <div class="flex items-center space-x-3 space-y-0">
                <Form.Control>
                    {#snippet children({ props })}
                        <RadioGroup.Item value="false" {...props} />
                        <Form.Label class="font-normal"
                            >Pessoa Física</Form.Label
                        >
                    {/snippet}
                </Form.Control>
            </div>
            <div class="flex items-center space-x-3 space-y-0">
                <Form.Control>
                    {#snippet children({ props })}
                        <RadioGroup.Item value="true" {...props} />
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
    <Form.Field class="w-96" {form} name="nome">
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
        <Form.Field class="w-48" {form} name="cidade_id">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Estado</Form.Label>
                    <Input readonly {...props} bind:value={estado_nome} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-96 gap-4" {form} name="cidade_id">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Cidade</Form.Label>
                    <div style="display: flex;" class="gap-4">
                        <Input readonly {...props} bind:value={cidade_nome} />
                        <Button type="button" size=icon onclick={openCityPopup}><Search /></Button>
                    </div>
                    
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-2/5" {form} name="endereco">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Endereço</Form.Label>
                    <Input {...props} bind:value={$formData.endereco} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-2/5" {form} name="nome">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Complemento</Form.Label>
                    <Input {...props} bind:value={$formData.complemento} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    </div>
    <div class="flex gap-4">
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
        <Form.Field class="w-32" {form} name="rg">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>RG</Form.Label>
                    <Input {...props} bind:value={$formData.rg} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field class="w-32" {form} name="cpf">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>CPF</Form.Label>
                    <Input {...props} bind:value={$formData.cpf} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="data_nascimento" class="flex flex-col">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Date de Nascimento</Form.Label>
                <Popover.Root>
                  <Popover.Trigger
                    {...props}
                    class={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-[280px] justify-start pl-4 text-left font-normal",
                      !value && "text-muted-foreground"
                    )}
                  >
                    {value
                      ? df.format(value.toDate(getLocalTimeZone()))
                      : ""}
                    <CalendarIcon class="ml-auto size-4 opacity-50" />
                  </Popover.Trigger>
                  <Popover.Content class="w-auto p-0" side="top">
                    <Calendar
                      type="single"
                      value={value as DateValue}
                      bind:placeholder
                      minValue={new CalendarDate(1900, 1, 1)}
                      maxValue={today(getLocalTimeZone())}
                      calendarLabel="Date of birth"
                      onValueChange={(v) => {
                        if (v) {
                          $formData.data_nascimento = v.toString();
                        } else {
                          $formData.data_nascimento = "";
                        }
                      }}
                    />
                  </Popover.Content>
                </Popover.Root>
                <Form.FieldErrors />
                <input hidden value={$formData.data_nascimento} name={props.name} />
              {/snippet}
            </Form.Control>
          </Form.Field>
    </div>
</form>

{#if browser}
    <SuperDebug data={$formData} />
{/if}
