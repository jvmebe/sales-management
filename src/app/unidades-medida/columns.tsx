"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ProductUnit } from "@/lib/definitions";
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
import { DeleteProductUnitButton } from "./delete-button";
import { SquarePen } from "lucide-react";

export const columns: ColumnDef<ProductUnit>[] = [
  { accessorKey: "id", header: "Cód."},
  { accessorKey: "nome", header: "Nome" },
  { accessorKey: "sigla", header: "Sigla" },
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
      <a href={`/unidades-medida/${row.original.id}/editar`}>
      <Button variant="outline">
        <SquarePen /> Editar
      </Button>
      </a>
    ),
  },
];
