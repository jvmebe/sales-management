<script lang="ts">
    import {Input, Button, Form, FormGroup} from '@sveltestrap/sveltestrap';

    let isDisabled: boolean = $state(true);

    let {data} = $props();
    console.log(data.condition.ID);
</script>

<Form method="POST">
    
    <FormGroup floating label="Código">
        <Input disabled={isDisabled} readonly value={data.condition.ID} name="ID" type="number" />
    </FormGroup>
    <FormGroup floating label="Nome da Condição de Pagamento">
        <Input disabled={isDisabled} value={data.condition.DESCRIPTION} name="DESCRIPTION" type="text" placeholder="Digite uma descrição" />
    </FormGroup>
    <FormGroup floating label="Quantidade de Parcelas" >
        <Input disabled={isDisabled} value={data.condition.INSTALLMENT_QTY} name="INSTALLMENT_QTY" type="number" placeholder="12" />
    </FormGroup>

	
	<Button color="primary" hidden={isDisabled}>Salvar</Button>
    <Button type="button" hidden={isDisabled} onclick={() => {isDisabled = !isDisabled}}>Cancelar</Button>
</Form>
<Button color="warning" hidden={!isDisabled} onclick={() => {isDisabled = !isDisabled}}>Editar</Button>
<Button color="danger" hidden={!isDisabled} onclick={() => {isDisabled = !isDisabled}}>Excluir</Button>