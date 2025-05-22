<script lang="ts">
  import { enhance } from '$app/forms';
  import CondPagForm from '$lib/components/forms/cond-pag-form.svelte';

  let { data } = $props();

</script>

<h1 class="font-semibold text-3xl mb-10" >Criar Nova Condição de Pagamento</h1>

<CondPagForm {data} />
