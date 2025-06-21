<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import Label from '$lib/components/ui/label/label.svelte';
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  let {form, label, classes="", readonly=false, name, userInput = $bindable()} = $props();

</script>

<Form.Field {form} class={classes} name={name}>
    <Form.Control>
        {#snippet children({ props })}
            <Form.Label>{label}</Form.Label>
            <Input {readonly} {...props} bind:value={userInput} />
        {/snippet}
    </Form.Control>
    {#if form.$errors}<span class="invalid">{form.$errors}</span>{/if}
    <Form.FieldErrors />
</Form.Field>
