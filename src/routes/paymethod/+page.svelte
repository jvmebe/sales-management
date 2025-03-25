<script lang="ts">
    import { Button, Table } from "@sveltestrap/sveltestrap";
    let { data } = $props();
    console.log(data.items);
</script>

<Button href="/paycondition/new" color="primary">Novo</Button>
<br />
<Table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody>
        {#each data.items as item}
            <tr>
                <td>{item.ID}</td>
                <td>{item.DESCRIPTION}</td>
                <td>
                    <Button href="paymethod/{item.ID}/details">Detalhes</Button>
                </td>
            </tr>
        {/each}
    </tbody>
</Table>
