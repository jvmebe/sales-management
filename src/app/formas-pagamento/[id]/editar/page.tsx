import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchPaymentMethodById } from "@/lib/data/formas-pagamento";
import PaymentMethodForm from "../../pagamento-form";

export default async function EditPaymentMethodPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const data = await fetchPaymentMethodById(id);
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Editar Forma de Pagamento</h1>
      </div>
      <Separator className="my-6" />
      <PaymentMethodForm initialData={data} />
    </div>
  );
}
