<script lang="ts">
  import CidadeForm from '$lib/components/forms/cidade-form.svelte';
  let { data } = $props();
</script>

<div>
  <CidadeForm {data} />
</div>
