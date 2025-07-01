"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { City } from "@/lib/definitions";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SquarePen } from "lucide-react";

export const columns: ColumnDef<City>[] = [
  {
    accessorKey: "nome",
    header: "Nome da Cidade",
  },
  {
    accessorKey: "state_nome",
    header: "Estado",
  },
   {
    accessorKey: "state_sigla",
    header: "UF",
  },
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
      <a href={`/cidades/${row.original.id}/editar`}>
      <Button variant="outline">
        <SquarePen /> Editar
      </Button>
      </a>
    ),
  },
];
