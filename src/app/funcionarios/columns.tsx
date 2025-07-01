"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Employee } from "@/lib/definitions";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SquarePen } from "lucide-react";
import { DeleteEmployeeButton } from "./delete-button";

export const columns: ColumnDef<Employee>[] = [
  { accessorKey: "nome", header: "Nome" },
  { accessorKey: "cargo", header: "Cargo" },
  { accessorKey: "telefone", header: "Telefone" },
  { accessorKey: "cidade_nome", header: "Cidade" },
  {
    accessorKey: "ativo",
    header: "Status",
    cell: ({ row }) => (<Badge variant={row.getValue("ativo") ? "default" : "secondary"}>{row.getValue("ativo") ? "Ativo" : "Inativo"}</Badge>),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <a href={`/funcionarios-pagamento/${row.original.id}/editar`}>
      <Button variant="outline">
        <SquarePen /> Editar
      </Button>
      </a>
    ),
  },
];
