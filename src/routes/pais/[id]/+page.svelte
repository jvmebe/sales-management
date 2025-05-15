<script lang="ts">
    import PaisForm from "$lib/components/forms/pais-form.svelte";
    let { data } = $props();
</script>

<h1>Detalhes do País</h1>

<PaisForm {data} />
