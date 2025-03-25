<script lang="ts">
    export let data: { country: { id: number; nome: string; sigla: string } };
    import { enhance } from '$app/forms';
  </script>
  
  <h1>Detalhes do País</h1>
  <form method="post" use:enhance>
    <div>
      <label>
        Nome:
        <input type="text" name="nome" bind:value={data.country.nome} required />
      </label>
    </div>
    <div>
      <label>
        Sigla:
        <input type="text" name="sigla" bind:value={data.country.sigla} maxlength="2" required />
      </label>
    </div>
    <button type="submit" name="action" value="update">Atualizar</button>
    <button type="submit" name="action" value="delete" on:click|preventDefault={() => {
      if (confirm('Confirma a exclusão?')) {
        (document.getElementById('deleteForm') as HTMLFormElement).submit();
      }
    }}>Excluir</button>
  </form>
  
  <form id="deleteForm" method="post" style="display: none;">
    <input type="hidden" name="action" value="delete" />
  </form>
  
  <a href="/pais">Voltar</a>
  