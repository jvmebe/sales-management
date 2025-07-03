"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentCondition, PaymentMethod } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentConditionCreationForm } from "@/components/forms/payment-condition-form";
import { PlusCircle } from "lucide-react";

interface PaymentConditionSelectionDialogProps {
  paymentConditions: PaymentCondition[];
  paymentMethods: PaymentMethod[];
  onSelect: (condition: PaymentCondition) => void;
}

export function PaymentConditionSelectionDialog({
  paymentConditions,
  paymentMethods,
  onSelect,
}: PaymentConditionSelectionDialogProps) {
  const router = useRouter();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const columns: ColumnDef<PaymentCondition>[] = [
    { accessorKey: "descricao", header: "Descrição" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect(row.original)}
        >
          Selecionar
        </Button>
      ),
    },
  ];

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    router.refresh();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Selecione uma Condição de Pagamento</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <DataTable
          columns={columns}
          data={paymentConditions}
          filterColumn="descricao"
          filterPlaceholder="Filtrar condições..."
        />
      </div>
      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar nova condição
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Criar Nova Condição de Pagamento</DialogTitle>
          </DialogHeader>
          <PaymentConditionCreationForm
            paymentMethods={paymentMethods}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
