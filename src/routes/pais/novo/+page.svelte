<script lang="ts">
  import PaisForm from '$lib/components/forms/pais-form.svelte'
  let { data } = $props();
</script>

<h1 class="font-semibold text-3xl mb-5">Novo País</h1>
<PaisForm {data} />
