<script lang="ts">
    import  * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";;
    import { page } from '$app/stores';
    import { derived } from 'svelte/store';
    import { Root } from "./ui/avatar";
  
    const breadcrumbs = derived(page, ($page) => {
      const segments = $page.url.pathname.split('/').filter(Boolean);
      let path = '';
      return segments.map((segment, index) => {
        path += `/${segment}`;
        return {
          name: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: path,
          isLast: index === segments.length - 1
        };
      });
    });
</script>

<style>
    div {
        padding-left: 1em;
    }
</style>
<div>
<Breadcrumb.Root class="text-xl">
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Início</Breadcrumb.Link>
      </Breadcrumb.Item>
  
      {#each $breadcrumbs as crumb, index (crumb.href)}
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          {#if crumb.isLast}
            <Breadcrumb.Page>{crumb.name}</Breadcrumb.Page>
          {:else}
            <Breadcrumb.Link href={crumb.href}>{crumb.name}</Breadcrumb.Link>
          {/if}
        </Breadcrumb.Item>
      {/each}
    </Breadcrumb.List>
  </Breadcrumb.Root>
</div>
  