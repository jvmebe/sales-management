"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Client } from "@/lib/definitions";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SquarePen } from "lucide-react";
import { DeleteClientButton } from "./delete-button";

export const columns: ColumnDef<Client>[] = [
  {accessorKey: "id", header:"Cód."},
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
      <a href={`/clientes/${row.original.id}/editar`}>
      <Button variant="outline">
        <SquarePen /> Editar
      </Button>
      </a>
    ),
  },
];
