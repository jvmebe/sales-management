<script lang="ts">
  import { onMount } from 'svelte';
  import FormaPagForm from '$lib/components/forms/forma-pag-form.svelte';
  let { data } = $props();
</script>

<h1 class="text-3xl mb-5">Nova forma de pagamento</h1>

<FormaPagForm {data}></FormaPagForm>
