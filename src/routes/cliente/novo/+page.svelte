<script lang="ts">
  import ClienteForm from '$lib/components/forms/cliente-form.svelte';
  let { data } = $props();
</script>

<h1 class="font-semibold text-3xl mb-5">Novo Cliente</h1>

<ClienteForm {data}/>
