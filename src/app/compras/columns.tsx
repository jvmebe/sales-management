"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Purchase } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SquarePen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<Purchase>[] = [
    { accessorKey: "id", header: "Cód." },
    { accessorKey: "numero_nota", header: "Nº da Nota" },
    { accessorKey: "supplier_nome", header: "Fornecedor" },
    {
        accessorKey: "data_emissao",
        header: "Data de Emissão",
        cell: ({ row }) => formatDate(row.getValue("data_emissao")),
    },
    {
      accessorKey: "ativo",
      header: "Status",
      cell: ({ row }) => <Badge variant={row.getValue("ativo") ? "default" : "secondary"}>{row.getValue("ativo") ? "Ativo" : "Inativo"}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <a href={`/compras/${row.original.id}/editar`}>
        <Button variant="outline">
          <SquarePen /> Detalhes
        </Button>
        </a>
      ),
    },
  ];
