"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { SaleListDTO } from "@/lib/data/vendas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<SaleListDTO>[] = [
    { accessorKey: "id", header: "Cód." },
    { accessorKey: "client_nome", header: "Cliente" },
    { accessorKey: "employee_nome", header: "Vendedor" },
    {
        accessorKey: "data_emissao",
        header: "Data",
        cell: ({ row }) => formatDate(row.getValue("data_emissao")),
    },
    {
        accessorKey: "valor_total",
        header: "Total",
        cell: ({ row }) => `R$ ${Number(row.getValue("valor_total")).toFixed(2)}`,
    },
    {
      accessorKey: "ativo",
      header: "Status",
      cell: ({ row }) => <Badge variant={row.getValue("ativo") ? "default" : "destructive"}>{row.getValue("ativo") ? "Ativa" : "Cancelada"}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Link href={`/vendas/${row.original.id}`}>
            <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" /> Detalhes
            </Button>
        </Link>
      ),
    },
];
