<script lang="ts">
  import { onMount } from 'svelte';
  import ClienteForm from './cliente-form.svelte';
  import type { PageData } from '../$types';

  let { data } = $props();
</script>

<h1 class="text-3xl mb-8">Novo Cliente</h1>

<ClienteForm {data}/>
