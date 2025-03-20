<script lang="ts">
    import {
        Button,
        Input,
        FormGroup,
        Form,
        Table,
    } from "@sveltestrap/sveltestrap";
</script>

<Form method="POST">
    <FormGroup floating label="Nome da Condição de Pagamento">
        <Input
            name="DESCRIPTION"
            type="text"
            placeholder="Digite uma descrição"
        />
    </FormGroup>
    <FormGroup floating label="Quantidade de Parcelas">
        <Input name="INSTALLMENT_QTY" type="number" placeholder="12" />
    </FormGroup>

    <h2>Parcelas</h2>

    <Table>
        <thead>
            <tr>
                <th>N° Parcela</th>
                <th>Prazo</th>
                <th>Percentual</th>
                <th>Forma Pagamento</th>
            </tr>
        </thead>
        <tbody> </tbody>
    </Table>

    <Button>Salvar</Button>
</Form>
