"use client";

import { useState } from "react";
import { Client } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

type SelectionMode = 'single' | 'multiple';

interface ClientSelectionDialogProps {
  clients: Client[];
  onSelect: (client: Client | Client[]) => void;
  selectionMode?: SelectionMode;
  // Props adicionais caso queira implementar o botão de "Novo Cliente" aqui dentro futuramente:
  // cities?: City[];
  // states?: State[];
  // countries?: Country[];
}

export function ClientSelectionDialog({
  clients,
  onSelect,
  selectionMode = 'single', // Padrão single para vendas
}: ClientSelectionDialogProps) {
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);

  const handleToggleSelect = (client: Client) => {
    setSelectedClients(prev =>
      prev.find(c => c.id === client.id)
        ? prev.filter(c => c.id !== client.id)
        : [...prev, client]
    );
  };

  const columns: ColumnDef<Client>[] = [
    ...(selectionMode === 'multiple' ? [{
        id: "select",
        header: ({ table }: { table: any }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
                table.toggleAllPageRowsSelected(!!value);
                setSelectedClients(value ? clients : []);
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }: { row: any }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
                row.toggleSelected(!!value)
                handleToggleSelect(row.original);
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }] : []),
    { accessorKey: "nome", header: "Cliente" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "cidade_nome", header: "Cidade" },
    ...(selectionMode === 'single' ? [{
        id: "actions",
        cell: ({ row }: { row: any }) => (
            <Button variant="outline" size="sm" onClick={() => onSelect(row.original)}>
                Selecionar
            </Button>
        )
    }] : [])
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <DialogHeader>
        <DialogTitle>Selecione um Cliente</DialogTitle>
      </DialogHeader>

      <div className="py-4 flex-1 overflow-auto">
        <DataTable
            columns={columns}
            data={clients}
            filterColumn="nome"
            filterPlaceholder="Filtrar clientes..."
        />
      </div>

      {selectionMode === 'multiple' && (
        <div className="flex justify-end pt-2">
            <Button onClick={() => onSelect(selectedClients)}>
                Confirmar Seleção ({selectedClients.length})
            </Button>
        </div>
      )}
    </div>
  );
}
