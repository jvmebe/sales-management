<script lang="ts">
  import EstadoForm from "$lib/components/forms/estado-form.svelte";
  let { data } = $props();
</script>

<h1>Detalhes do Estado</h1>

<EstadoForm {data} />
