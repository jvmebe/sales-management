"use server";

import pool from "@/lib/db";
import { SaleForm, SaleSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function createSale(data: SaleForm) {
  // 1. Validação dos dados no servidor (Segurança)
  const result = SaleSchema.safeParse(data);

  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, message: firstError || "Erro de validação." };
  }

  const { items, installments, ...saleData } = result.data;

  // Calcula o valor total no servidor para garantir integridade
  const valorTotalCalculado = items.reduce((acc, item) => acc + (item.quantidade * item.valor_unitario), 0);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 2. Inserir o cabeçalho da Venda
    const [saleResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO sale (client_id, employee_id, data_emissao, payment_condition_id, valor_total, ativo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        saleData.client_id,
        saleData.employee_id,
        saleData.data_emissao,
        saleData.payment_condition_id,
        valorTotalCalculado,
        true // ativo
      ]
    );
    const saleId = saleResult.insertId;

    // 3. Processar Itens e Baixar Estoque
    for (const item of items) {
      // Bloqueia a linha do produto para evitar condição de corrida (dois vendedores vendendo o último item ao mesmo tempo)
      const [productRows] = await connection.execute<RowDataPacket[]>(
        `SELECT estoque, nome FROM product WHERE id = ? FOR UPDATE`,
        [item.product_id]
      );

      if (productRows.length === 0) {
        throw new Error(`Produto ID ${item.product_id} não encontrado.`);
      }

      const currentProduct = productRows[0];

      // Validação de Estoque (Opcional: remova se permitir estoque negativo)
      if (currentProduct.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto "${currentProduct.nome}". Disponível: ${currentProduct.estoque}.`);
      }

      // Insere o item da venda
      await connection.execute(
        `INSERT INTO sale_item (sale_id, product_id, quantidade, valor_unitario) VALUES (?, ?, ?, ?)`,
        [saleId, item.product_id, item.quantidade, item.valor_unitario]
      );

      // Baixa o estoque
      await connection.execute(
        `UPDATE product SET estoque = estoque - ? WHERE id = ?`,
        [item.quantidade, item.product_id]
      );
    }

    // 4. Inserir Parcelas (Contas a Receber)
    if (installments.length > 0) {
        // Validação básica do total das parcelas vs total da venda
        const totalParcelas = installments.reduce((acc, inst) => acc + inst.valor_parcela, 0);
        // Margem de erro de 1 centavo devido a arredondamento
        if (Math.abs(totalParcelas - valorTotalCalculado) > 0.05) {
             throw new Error(`O total das parcelas (R$ ${totalParcelas.toFixed(2)}) não bate com o total da venda (R$ ${valorTotalCalculado.toFixed(2)}). Recalcule as parcelas.`);
        }

        const installmentValuesPlaceholder = installments.map(() => '(?, ?, ?, ?)').join(', ');
        const installmentSql = `INSERT INTO sale_installment (sale_id, numero_parcela, data_vencimento, valor_parcela) VALUES ${installmentValuesPlaceholder}`;

        const installmentValues = installments.flatMap(inst => [
            saleId,
            inst.numero_parcela,
            inst.data_vencimento,
            inst.valor_parcela
        ]);

        await connection.execute(installmentSql, installmentValues);
    }

    await connection.commit();

    // Revalida as páginas para atualizar o estoque na lista de produtos e o financeiro
    revalidatePath("/produtos");
    revalidatePath("/vendas");

    return { success: true, message: "Venda realizada com sucesso!" };

  } catch (error: any) {
    await connection.rollback();
    console.error("Erro ao criar venda:", error);
    return { success: false, message: error.message || "Erro no banco ao processar a venda." };
  } finally {
    connection.release();
  }
}

export async function cancelSale(id: number) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Verifica se a venda existe e está ativa
    const [sales] = await connection.execute<RowDataPacket[]>(
      `SELECT ativo FROM sale WHERE id = ? FOR UPDATE`,
      [id]
    );

    if (sales.length === 0) throw new Error("Venda não encontrada.");
    if (!sales[0].ativo) throw new Error("Esta venda já está cancelada.");

    // 2. Busca os itens para estornar o estoque
    const [items] = await connection.execute<RowDataPacket[]>(
      `SELECT product_id, quantidade FROM sale_item WHERE sale_id = ?`,
      [id]
    );

    // 3. Devolve os produtos ao estoque
    for (const item of items) {
      await connection.execute(
        `UPDATE product SET estoque = estoque + ? WHERE id = ?`,
        [item.quantidade, item.product_id]
      );
    }

    // 4. Marca a venda como inativa (Cancelada)
    await connection.execute(
      `UPDATE sale SET ativo = FALSE WHERE id = ?`,
      [id]
    );

    // Opcional: Se quiser "cancelar" as parcelas no financeiro, poderia marcar status lá também.
    // Como seu modelo de installmet não tem status próprio (depende da venda),
    // apenas inativar a venda já deve filtrar no "Contas a Receber" se a query checar sale.ativo.

    await connection.commit();
    revalidatePath("/vendas");
    revalidatePath("/produtos"); // Atualiza estoque na listagem
    return { success: true, message: "Venda cancelada e estoque estornado com sucesso!" };

  } catch (error: any) {
    await connection.rollback();
    return { success: false, message: error.message || "Erro ao cancelar venda." };
  } finally {
    connection.release();
  }
}
