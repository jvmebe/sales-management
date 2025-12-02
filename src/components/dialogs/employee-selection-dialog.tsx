"use client";

import { useState } from "react";
import { Employee } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

type SelectionMode = 'single' | 'multiple';

interface EmployeeSelectionDialogProps {
  employees: Employee[];
  onSelect: (employee: Employee | Employee[]) => void;
  selectionMode?: SelectionMode;
}

export function EmployeeSelectionDialog({
  employees,
  onSelect,
  selectionMode = 'single',
}: EmployeeSelectionDialogProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);

  const handleToggleSelect = (employee: Employee) => {
    setSelectedEmployees(prev =>
      prev.find(e => e.id === employee.id)
        ? prev.filter(e => e.id !== employee.id)
        : [...prev, employee]
    );
  };

  const columns: ColumnDef<Employee>[] = [
    ...(selectionMode === 'multiple' ? [{
        id: "select",
        header: ({ table }: { table: any }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
                table.toggleAllPageRowsSelected(!!value);
                setSelectedEmployees(value ? employees : []);
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
    { accessorKey: "nome", header: "Funcionário" },
    { accessorKey: "cargo", header: "Cargo" },
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
    <div className="flex flex-col h-full">
      <DialogHeader>
        <DialogTitle>Selecione um Vendedor</DialogTitle>
      </DialogHeader>

      <div className="py-4 flex-1 overflow-auto">
        <DataTable
            columns={columns}
            data={employees}
            filterColumn="nome"
            filterPlaceholder="Filtrar funcionários..."
        />
      </div>

      {selectionMode === 'multiple' && (
        <div className="flex justify-end pt-2">
            <Button onClick={() => onSelect(selectedEmployees)}>
                Confirmar Seleção ({selectedEmployees.length})
            </Button>
        </div>
      )}
    </div>
  );
}
