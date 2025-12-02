"use client";
import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Badge } from "@/components/ui/badge";
import { ContasPagarStatus, SaleInstallmentDTO } from "@/lib/definitions";
import { FilterSelect } from "./filter-select";

const isVencido = (dataVencimento: string) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
};

export function ContasReceberClient({ allData }: { allData: SaleInstallmentDTO[] }) {
  const [status, setStatus] = useState<ContasPagarStatus>('aberto');

  const filteredData = useMemo(() => {
    return allData.filter(item => {
      const isPago = !!item.data_pagamento;
      const isCancelada = item.sale_ativo === 0 || item.sale_ativo === false;
      const vencido = isVencido(item.data_vencimento);

      switch (status) {
        case 'pago':
          return isPago;
        case 'vencido':
          return !isPago && !isCancelada && vencido;
        case 'cancelado':
          return isCancelada;
        case 'todas':
          return true;
        case 'aberto':
        default:
          return !isPago && !isCancelada && !vencido;
      }
    });
  }, [allData, status]);

  const totalAReceber = useMemo(() => {
     if (status === 'aberto' || status === 'vencido') {
        return filteredData.reduce((acc, parcela) => acc + Number(parcela.valor_parcela), 0);
     }
     return 0;
  }, [filteredData, status]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contas a Receber</h1>
        {(status === 'aberto' || status === 'vencido') && (
          <Badge className="text-lg bg-green-600 hover:bg-green-700">
            Total {status === 'vencido' ? 'Vencido' : 'a Receber'}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAReceber)}
          </Badge>
        )}
      </div>

      <div className="mb-4">
        <FilterSelect currentStatus={status} onStatusChange={setStatus} />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        filterColumn="client_nome"
        filterPlaceholder="Filtrar por cliente..."
      />
    </>
  );
}
