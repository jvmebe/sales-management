import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchPaymentConditionById } from "@/lib/data/condicoes-pagamento";
import { fetchActivePaymentMethods } from "@/lib/data/formas-pagamento";
import PaymentConditionForm from "../../form";

export default async function EditPaymentConditionPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [condition, paymentMethods] = await Promise.all([
    fetchPaymentConditionById(id),
    fetchActivePaymentMethods(),
  ]);

  if (!condition) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Editar Condição de Pagamento</h1>
      </div>
      <Separator className="my-6" />
      <PaymentConditionForm initialData={condition} paymentMethods={paymentMethods} />
    </div>
  );
}
