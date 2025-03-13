<script lang="ts">
import {Button, Table} from '@sveltestrap/sveltestrap';
export let data;
const items = data.items;

</script>

<Table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>N° Parcelas</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each items as condition }
            <tr>
                <td>{condition.ID}</td>
                <td>{condition.DESCRIPTION}</td>
                <td>{condition.INSTALLMENT_QTY}</td>
                <td><Button href="paycondition/{condition.ID}/details">Detalhes</Button></td>
            </tr>
        {/each}
    </tbody>
</Table>
<Button href="/paycondition/new" color="primary">Novo</Button>