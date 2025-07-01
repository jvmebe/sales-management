"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ProductBrand } from "@/lib/definitions";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SquarePen } from "lucide-react";
import { DeleteProductBrandButton } from "./delete-button";

export const columns: ColumnDef<ProductBrand>[] = [
  { accessorKey: "nome", header: "Nome da Marca" },
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
      <a href={`/marcas/${row.original.id}/editar`}>
      <Button variant="outline">
        <SquarePen /> Editar
      </Button>
      </a>
    ),
  },
];
