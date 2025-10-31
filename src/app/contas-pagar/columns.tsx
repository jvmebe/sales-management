"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PurchaseInstallment } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { formatDateOnly } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
};

const isVencido = (dataVencimento: string) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const vencimento = new Date(dataVencimento);
  return vencimento < hoje;
};

const StatusBadge: React.FC<{ row: any }> = ({ row }) => {
  const dataPagamento = row.getValue("data_pagamento");
  const purchaseAtivo = row.original.purchase_ativo;
  const dataVencimento = row.getValue("data_vencimento");

  if (purchaseAtivo === 0 || purchaseAtivo === false) {
    return <Badge variant="secondary">Cancelada</Badge>;
  }
  if (dataPagamento) {
    return (
      <Badge variant="default" className="bg-green-600">
        Paga
      </Badge>
    );
  }
  if (isVencido(dataVencimento as string)) {
    return <Badge variant="destructive">Vencida</Badge>;
  }
  return <Badge variant="outline">Em Aberto</Badge>;
};

export const columns: ColumnDef<PurchaseInstallment>[] = [
  {
    accessorKey: "data_vencimento",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vencimento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.getValue("data_vencimento");
      const vencido =
        !row.getValue("data_pagamento") && isVencido(data as string);
      return (
        <span className={vencido ? "text-red-600 font-medium" : ""}>
          {formatDateOnly(data as string)}
        </span>
      );
    },
  },
  {
    accessorKey: "supplier_nome",
    header: "Fornecedor",
  },
  {
    accessorKey: "numero_nota",
    header: "Nº da Nota",
  },
  {
    accessorKey: "numero_parcela",
    header: "Parcela",
  },
  {
    accessorKey: "valor_parcela",
    header: "Valor",
    cell: ({ row }) => formatCurrency(row.getValue("valor_parcela")),
  },
  {
    accessorKey: "data_pagamento",
    header: "Status",
    cell: ({ row }) => <StatusBadge row={row} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const isPago = !!row.getValue("data_pagamento");
      const isCancelada =
        row.original.purchase_ativo === 0 ||
        row.original.purchase_ativo === false;
      const id = row.original.id;

      let label = "Dar Baixa";
      if (isPago) label = "Visualizar";
      if (isCancelada) label = "Visualizar";

      return (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/contas-pagar/${id}`}>{label}</Link>
        </Button>
      );
    },
  },
];
