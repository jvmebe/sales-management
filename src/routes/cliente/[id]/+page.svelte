<script lang="ts">
  import ClienteForm from '$lib/components/forms/cliente-form.svelte';
  let { data } = $props();
</script>

<h1 class="text-3xl mb-8">Novo Cliente</h1>

<ClienteForm {data}/>
