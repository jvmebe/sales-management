<script lang="ts">
  import FuncionarioForm from '$lib/components/forms/funcionario-form.svelte';
  let { data } = $props();


  import { onMount } from 'svelte';

 
</script>

<h1 class="font-semibold text-3xl mb-5">Novo Funcionário</h1>

<FuncionarioForm {data} />
