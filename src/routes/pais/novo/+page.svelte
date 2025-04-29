<script lang="ts">
  import PaisForm from '$lib/components/forms/pais-form.svelte'
  let { data } = $props();
</script>

<h1>Novo País</h1>
<PaisForm {data} />
<a href="/pais">Voltar</a>
