<script lang="ts">
  import type { PageData } from "../$types";
  import CidadeForm from '$lib/components/forms/cidade-form.svelte';

  let { data } = $props();


</script>

<h1>Detalhes da Cidade</h1>
<CidadeForm {data}></CidadeForm>
