"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Client } from "@/lib/definitions";
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
import { DeleteClientButton } from "./delete-button";

export const columns: ColumnDef<Client>[] = [
  { accessorKey: "nome", header: "Nome / Razão Social" },
  { accessorKey: "cidade_nome", header: "Cidade" },
  { accessorKey: "telefone", header: "Telefone" },
  {
    accessorKey: "ativo",
    header: "Status",
    cell: ({ row }) => (<Badge variant={row.getValue("ativo") ? "default" : "secondary"}>{row.getValue("ativo") ? "Ativo" : "Inativo"}</Badge>),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem asChild><Link href={`/clientes/${row.original.id}/editar`}>Editar</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
