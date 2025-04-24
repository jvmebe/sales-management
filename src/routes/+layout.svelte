<script lang="ts">
 import '../app.css';
 import * as Sidebar from "$lib/components/ui/sidebar/index.js";
 import AppSidebar from "$lib/components/app-sidebar.svelte";
 import AutoBreadcrumb from '$lib/components/breadcrumb.svelte';

 let { children } = $props();
</script>

<style>
   header {
      display: flex;
      align-items: center;
      justify-content: left;
      padding-bottom: 10px;
      margin-top: 1em;
      margin-left: 1em;
   }

   .child-body {
      padding: 2em;
      width: 100%;
   }

</style>


<Sidebar.Provider>
 <AppSidebar />
 <main style="width: 100%">
   <header>
      <Sidebar.Trigger />
      <AutoBreadcrumb /></header>
   <div class="child-body">
      {@render children?.()}
   </div>
    
 </main>
</Sidebar.Provider>
