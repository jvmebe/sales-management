<script lang="ts">
  import { onMount } from 'svelte';
  import FornecedorForm from '$lib/components/forms/fornecedor-form.svelte';
  let { data } = $props();
</script>

<h1 class="font-semibold text-3xl mb-5">Novo Fornecedor</h1>

<FornecedorForm {data}></FornecedorForm>
