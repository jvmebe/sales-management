import { fetchParcelaById } from "@/lib/data/contas-pagar";
import { fetchActivePaymentMethods } from "@/lib/data/formas-pagamento";
import { notFound } from "next/navigation";
import { BaixaForm } from "./baixa-form";
import { Separator } from "@/components/ui/separator";

export default async function DarBaixaPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [parcela, paymentMethods] = await Promise.all([
    fetchParcelaById(id),
    fetchActivePaymentMethods(),
  ]);

  if (!parcela) notFound();

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Baixa de Parcela</h1>
        <p className="text-muted-foreground">
          Fornecedor: {parcela.supplier_nome} | Nota: {parcela.numero_nota} |
          Parcela: {parcela.numero_parcela}
        </p>
      </div>
      <Separator className="my-6" />
      <BaixaForm parcela={parcela} paymentMethods={paymentMethods} />
    </div>
  );
}
