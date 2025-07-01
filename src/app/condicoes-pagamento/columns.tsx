"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PaymentCondition } from "@/lib/definitions";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SquarePen } from "lucide-react";

export const columns: ColumnDef<PaymentCondition>[] = [
  { accessorKey: "descricao", header: "Descrição" },
  { accessorKey: "num_parcelas", header: "Nº de Parcelas" },
  {
    accessorKey: "ativo",
    header: "Status",
    cell: ({ row }) => <Badge variant={row.getValue("ativo") ? "default" : "secondary"}>{row.getValue("ativo") ? "Ativo" : "Inativo"}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <a href={`/condicoes-pagamento/${row.original.id}/editar`}>
      <Button variant="outline">
        <SquarePen /> Editar
      </Button>
      </a>
    ),
  },
];
