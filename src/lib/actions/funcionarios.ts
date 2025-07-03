"use server";
import { query } from "@/lib/db";
import { EmployeeForm, EmployeeSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
import { format } from 'date-fns';

const FIELDS = 'nome, apelido, cpf, rg, email, telefone, endereco, numero, complemento, bairro, cidade_id, cep, ativo, matricula, cargo, salario, turno, carga_horaria, data_nascimento, data_admissao';

function formatData(data: EmployeeForm) {
    const { data_nascimento, data_admissao, ...rest } = data;
    const formattedBirthDate = data_nascimento ? format(data_nascimento, 'yyyy-MM-dd') : null;
    const formattedAdmissionDate = data_admissao ? format(data_admissao, 'yyyy-MM-dd') : null;
    return { ...rest, data_nascimento: formattedBirthDate, data_admissao: formattedAdmissionDate };
}

export async function createEmployee(data: EmployeeForm) {
  const result = EmployeeSchema.safeParse(data);
  if (!result.success) return { success: false, message: "Erro de validação." };

  const fields = formatData(result.data);
  console.log(fields);
  try {
    await query(`INSERT INTO employee (${FIELDS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      Object.values(fields)
    );
    revalidatePath("/funcionarios");
    return { success: true, message: "Funcionário criado com sucesso!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Erro no banco: Falha ao criar funcionário." };
  }
}

export async function updateEmployee(id: number, data: EmployeeForm) {
    const result = EmployeeSchema.safeParse(data);
    if (!result.success) return { success: false, message: "Erro de validação." };

    const fields = formatData(result.data); // 'fields' is the object with your employee data

    try {
        await query(`
            UPDATE employee SET nome = ?, apelido = ?, data_nascimento = ?, cpf = ?, rg = ?, email = ?, telefone = ?, endereco = ?, numero = ?, complemento = ?, bairro = ?, cidade_id = ?, cep = ?, ativo = ?, matricula = ?, cargo = ?, salario = ?, data_admissao = ?, turno = ?, carga_horaria = ?
            WHERE id = ?`,
            [
                fields.nome,
                fields.apelido,
                fields.data_nascimento,
                fields.cpf,
                fields.rg,
                fields.email,
                fields.telefone,
                fields.endereco,
                fields.numero,
                fields.complemento,
                fields.bairro,
                fields.cidade_id,
                fields.cep,
                fields.ativo,
                fields.matricula,
                fields.cargo,
                fields.salario,
                fields.data_admissao,
                fields.turno,
                fields.carga_horaria,
                id
            ]
        );
        revalidatePath("/funcionarios");
        return { success: true, message: "Funcionário atualizado com sucesso!" };
    } catch (error) {
      console.log(error);
        return { success: false, message: "Erro no banco: Falha ao atualizar." };
    }
}

export async function deleteEmployee(id: number) {
    try {
        await query(`DELETE FROM employee WHERE id = ?`, [id]);
        revalidatePath("/funcionarios");
        return { success: true, message: "Funcionário excluído com sucesso." };
    } catch (error) {
        return { success: false, message: "Existem dados associados a este funcionário!" };
    }
}
