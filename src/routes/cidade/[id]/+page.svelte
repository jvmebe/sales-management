<script lang="ts">
  import type { PageData } from "../$types";
    import CidadeForm from "./cidade-form.svelte";

  let { data } = $props();

  console.log(data.form)


</script>

<h1>Detalhes da Cidade</h1>
<CidadeForm {data}></CidadeForm>
