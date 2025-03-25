<!-- src/routes/forma-de-pagamento/[id]/+page.svelte -->
<script lang="ts">
    export let data: { paymentMethod: { id: number; descricao: string } };
    import { enhance } from '$app/forms';
  </script>
  
  <h1>Detalhes da Forma de Pagamento</h1>
  <form method="post" use:enhance>
    <label>
      Descrição:
      <input type="text" name="descricao" value="{data.paymentMethod.descricao}" required />
    </label>
    <button type="submit" name="action" value="update">Atualizar</button>
    <button type="submit" name="action" value="delete" on:click|preventDefault={() => {
      if (confirm('Confirma a exclusão?')) {
        // Força o envio do formulário para exclusão
        (document.getElementById('deleteForm') as HTMLFormElement).submit();
      }
    }}>Excluir</button>
  </form>
  
  <!-- Formulário oculto para ação de exclusão -->
  <form id="deleteForm" method="post" style="display: none;">
    <input type="hidden" name="action" value="delete" />
  </form>
  
  <a href="/forma-pagamento">Voltar</a>
  