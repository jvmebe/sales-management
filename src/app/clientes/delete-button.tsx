"use client";

import { useTransition } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteClient } from "@/lib/actions/clientes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteClientButton({ id, children }: { id: number, children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const handleClick = () => {
    startTransition(async () => {
      const result = await deleteClient(id);
      if (result?.success) {
        toast.success(result.message);
        useRouter().replace('/clientes')
      } else {
        toast.error("Erro ao excluir", { description: result.message });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleClick} disabled={isPending}>{isPending ? "Excluindo..." : "Continuar"}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
