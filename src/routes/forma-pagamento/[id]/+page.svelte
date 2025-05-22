<script lang="ts">
  let { data } = $props();
  import FormaPagForm from "$lib/components/forms/forma-pag-form.svelte";
</script>

<h1 class="font-semibold text-3xl mb-5">{data.form.data.descricao}</h1>

<FormaPagForm {data} />
