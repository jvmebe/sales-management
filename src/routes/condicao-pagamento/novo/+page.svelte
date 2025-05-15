<script lang="ts">
  import { enhance } from '$app/forms';
  import CondPagForm from '$lib/components/forms/cond-pag-form.svelte';

  let { data } = $props();


</script>

<h1>Criar Nova Condição de Pagamento</h1>

<CondPagForm {data} />


<a href="/condicao-de-pagamento">Voltar</a>
