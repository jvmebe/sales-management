<script lang="ts">
    import { onMount } from 'svelte';
    import EstadoForm from '$lib/components/forms/estado-form.svelte';
    let {data} = $props();
  </script>

<h1 class="font-semibold text-3xl mb-10">Novo Estado</h1>

<EstadoForm {data} />
