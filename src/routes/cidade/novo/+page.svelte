<script lang="ts">
  import CidadeForm from '$lib/components/forms/cidade-form.svelte';
  let { data } = $props();
</script>

<div>
  <h1 class="font-semibold text-3xl mb-5">Nova Cidade</h1>
  <CidadeForm {data} />
</div>
