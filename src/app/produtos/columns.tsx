"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Product } from "@/lib/definitions";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteProductButton } from "./delete-button";
import { SquarePen } from "lucide-react";

export const columns: ColumnDef<Product>[] = [
  { accessorKey: "nome", header: "Produto" },
  { accessorKey: "valor_venda", header: "Preço Venda", cell: ({ row }) => `R$ ${row.getValue("valor_venda")}` },
  { accessorKey: "estoque", header: "Estoque" },
  { accessorKey: "brand_nome", header: "Marca" },
  { accessorKey: "category_nome", header: "Categoria" },
  {
    accessorKey: "ativo",
    header: "Status",
    cell: ({ row }) => <Badge variant={row.getValue("ativo") ? "default" : "secondary"}>{row.getValue("ativo") ? "Ativo" : "Inativo"}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <a href={`/produtos/${row.original.id}/editar`}>
      <Button variant="outline">
        <SquarePen /> Editar
      </Button>
      </a>
    ),
  },
];
