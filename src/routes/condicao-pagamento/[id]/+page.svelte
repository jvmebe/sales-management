<script lang="ts">
  import CondPagForm from "$lib/components/forms/cond-pag-form.svelte";
  let { data } = $props();
</script>

<h1 class="font-semibold text-3xl mb-5">{data.form.data.descricao}</h1>

<CondPagForm {data}/>
