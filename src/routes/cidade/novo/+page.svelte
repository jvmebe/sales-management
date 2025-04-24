<script lang="ts">

  import type { PageData } from "./$types.js";
  import CidadeForm from "./cidade-form.svelte";
  let { data }: { data: PageData } = $props();
</script>

<div>
  <CidadeForm {data} />
</div>

