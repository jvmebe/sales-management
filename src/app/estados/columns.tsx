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
// import { DeleteStateButton } from "./delete-button";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/estados/${row.original.id}/edit`}>Editar</Link>
          </DropdownMenuItem>
          {/* <DeleteStateButton id={row.original.id}>
            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-red-600 ...">
              Excluir
            </div>
          </DeleteStateButton> */}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];