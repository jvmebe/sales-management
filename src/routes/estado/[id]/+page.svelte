<script lang="ts">
    export let data: {
        state: {
            id: number;
            nome: string;
            sigla: string;
            country_id: number;
            country_nome: string;
        };
    };
    import { onMount } from "svelte";

    let nome = data.state.nome;
    let sigla = data.state.sigla;
    let country_id = data.state.country_id.toString();
    let country_nome = data.state.country_nome;

    function openCountryPopup() {
        window.open("/pais/selecionar", "Selecionar País", "width=600,height=400");
    }

    onMount(() => {
        // @ts-ignore
        window.handleCountrySelect = (id, nome) => {
            country_id = id;
            country_nome = nome;
        };
    });
</script>

<h1>Detalhes do Estado</h1>
<form method="post">
    <div>
        <label>
            Nome:
            <input type="text" name="nome" bind:value={nome} required />
        </label>
    </div>
    <div>
        <label>
            Sigla:
            <input
                type="text"
                name="sigla"
                bind:value={sigla}
                maxlength="2"
                required
            />
        </label>
    </div>
    <div>
        <label>
            País:
            <input
                type="text"
                value={country_nome}
                readonly
                placeholder="Selecione um país"
            />
            <input type="hidden" name="country_id" value={country_id} />
        </label>
        <button type="button" on:click={openCountryPopup}
            >Selecionar País</button
        >
    </div>
    <button type="submit" name="action" value="update">Atualizar</button>
    <button
        type="submit"
        name="action"
        value="delete"
        on:click|preventDefault={() => {
            if (confirm("Confirma a exclusão?")) {
                (
                    document.getElementById("deleteForm") as HTMLFormElement
                ).submit();
            }
        }}>Excluir</button
    >
</form>

<form id="deleteForm" method="post" style="display: none;">
    <input type="hidden" name="action" value="delete" />
</form>

<a href="/estado">Voltar</a>
