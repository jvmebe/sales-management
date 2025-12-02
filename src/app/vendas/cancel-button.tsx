"use client";

import { useTransition } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cancelSale } from "@/lib/actions/vendas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";

export function CancelSaleButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelSale(id);
      if (result.success) {
        toast.success(result.message);
        router.push("/vendas"); // Volta para lista
      } else {
        toast.error("Erro ao cancelar", { description: result.message });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
            <Ban className="mr-2 h-4 w-4" />
            Cancelar Venda
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar Venda #{id}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá estornar o estoque dos produtos e inativar o registro financeiro. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isPending ? "Cancelando..." : "Confirmar Cancelamento"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
