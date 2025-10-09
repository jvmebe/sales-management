"use client";

import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cancelPurchase } from "@/lib/actions/compras";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function CancelPurchaseButton({ id, children }: { id: number, children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      const result = await cancelPurchase(id, reason);
      if (result?.success) {
        toast.success(result.message);
        router.push("/compras");
      } else {
        toast.error("Erro ao cancelar", { description: result.message });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar Compra</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. A compra será marcada como inativa. Por favor, informe o motivo do cancelamento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid w-full gap-1.5">
            <Label htmlFor="reason">Motivo do Cancelamento</Label>
            <Textarea
                id="reason"
                placeholder="Descreva o motivo aqui..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick} disabled={isPending || reason.length < 5}>
            {isPending ? "Cancelando..." : "Confirmar Cancelamento"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}