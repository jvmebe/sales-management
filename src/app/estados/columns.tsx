"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { State } from "@/lib/definitions";
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
import { SquarePen } from "lucide-react";

export const columns: ColumnDef<State>[] = [
  { accessorKey: "nome", header: "Nome" },
  { accessorKey: "sigla", header: "UF" },
  { accessorKey: "country_nome", header: "País" },
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
      
      <a href={`/estados/${row.original.id}/editar`}>
      <Button variant="outline">
        <SquarePen /> Editar
      </Button>
      </a>

      
    ),
  },
];