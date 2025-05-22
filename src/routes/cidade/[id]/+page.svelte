<script lang="ts">
  import type { PageData } from "../$types";
  import CidadeForm from '$lib/components/forms/cidade-form.svelte';

  let { data } = $props();


</script>

<h1 class="font-semibold text-3xl mb-10">{data.form.data.nome}</h1>
<CidadeForm {data}></CidadeForm>
