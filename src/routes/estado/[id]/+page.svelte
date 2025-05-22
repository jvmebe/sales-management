<script lang="ts">
  import EstadoForm from "$lib/components/forms/estado-form.svelte";
  let { data } = $props();
</script>

<h1 class="font-semibold text-3xl mb-5">{data.form.data.nome}</h1>

<EstadoForm {data} />
