<script lang="ts">
    import { enhance } from '$app/forms';
  </script>
  
  <h1>Criar Nova Forma de Pagamento</h1>
  <form method="post" use:enhance>
    <label>
      Descrição:
      <input type="text" name="descricao" required />
    </label>
    <button type="submit">Criar</button>
  </form>
  