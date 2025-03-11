<script lang="ts">

export let data;
const items = data.items;

</script>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>N° Parcelas</th>
        </tr>
    </thead>
    <tbody>
        {#each items as condition }
            <tr>
                <td>{condition.ID}</td>
                <td>{condition.DESCRIPTION}</td>
                <td>{condition.INSTALLMENT_QTY}</td>
            </tr>
        {/each}
    </tbody>
</table>