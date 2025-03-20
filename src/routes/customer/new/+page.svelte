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
    <FormGroup floating label="Nome">
        <Input name="NAME" type="text" placeholder="Digite uma descrição" />
    </FormGroup>
    <FormGroup floating label="CPF/CNPJ">
        <Input name="CPFCNPJ" type="number" placeholder="12" />
    </FormGroup>
    <FormGroup>
        <Input name=""/>
    </FormGroup>

    <Button>Salvar</Button>
</Form>
