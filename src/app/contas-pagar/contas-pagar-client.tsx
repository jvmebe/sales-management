"use client";
import { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Badge } from "@/components/ui/badge";
import { ContasPagarStatus, PurchaseInstallment } from "@/lib/definitions";
import { FilterSelect } from "./filter-select";

const isVencido = (dataVencimento: string) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
};

export function ContasPagarClient({ allData }: { allData: PurchaseInstallment[] }) {
  const [status, setStatus] = useState<ContasPagarStatus>('aberto');

  const filteredData = useMemo(() => {
    return allData.filter(item => {
      const isPago = !!item.data_pagamento;
      const isCancelada = item.purchase_ativo === 0 || item.purchase_ativo === false;
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

  const totalAPagar = useMemo(() => {
     if (status === 'aberto' || status === 'vencido') {
        return filteredData.reduce((acc, parcela) => acc + Number(parcela.valor_parcela), 0);
     }
     return 0;
  }, [filteredData, status]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contas a Pagar</h1>
        {(status === 'aberto' || status === 'vencido') && (
          <Badge variant="destructive" className="text-lg">
            Total {status === 'vencido' ? 'Vencido' : 'em Aberto'}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAPagar)}
          </Badge>
        )}
      </div>

      {/* O FilterSelect agora atualiza o estado local 'status' */}
      <div className="mb-4">
        <FilterSelect currentStatus={status} onStatusChange={setStatus} />
      </div>

      {/* A DataTable recebe os dados já filtrados localmente */}
      <DataTable
        columns={columns}
        data={filteredData}
        filterColumn="supplier_nome"
        filterPlaceholder="Filtrar por fornecedor..."
      />
    </>
  );
}
