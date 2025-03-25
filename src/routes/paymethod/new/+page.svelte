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
    <FormGroup floating label="Descrição">
        <Input
            name="DESCRIPTION"
            type="text"
            placeholder="Digite uma descrição"
        />
    </FormGroup>

    <Button>Salvar</Button>
</Form>
