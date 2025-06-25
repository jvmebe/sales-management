"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ProductCategory } from "@/lib/definitions";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteProductCategoryButton } from "./delete-button";

export const columns: ColumnDef<ProductCategory>[] = [
  { accessorKey: "nome", header: "Nome da Categoria" },
  { accessorKey: "descricao", header: "Descrição" },
  {
    accessorKey: "ativo",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("ativo") ? "default" : "secondary"}>
        {row.getValue("ativo") ? "Ativo" : "Inativo"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem asChild><Link href={`/categorias/${row.original.id}/editar`}>Editar</Link></DropdownMenuItem>
          <DeleteProductCategoryButton id={row.original.id}>
             <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 w-full">Excluir</div>
          </DeleteProductCategoryButton>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
