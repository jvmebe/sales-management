<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import CityListDialog from "$lib/components/modals/city-list-dialog.svelte";

  let { data } = $props();

</script>

<CityListDialog {data}/>
