<script lang="ts">
    import { enhance } from '$app/forms';
  </script>
  
  <h1>Novo País</h1>
  <form method="post" use:enhance>
    <div>
      <label>
        Nome:
        <input type="text" name="nome" required />
      </label>
    </div>
    <div>
      <label>
        Sigla:
        <input type="text" name="sigla" maxlength="2" required />
      </label>
    </div>
    <button type="submit">Criar País</button>
  </form>
  <a href="/pais">Voltar</a>
  