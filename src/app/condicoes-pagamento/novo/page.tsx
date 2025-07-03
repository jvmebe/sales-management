import { Separator } from "@/components/ui/separator";
import PaymentConditionForm from "../form";
import { fetchActivePaymentMethods } from "@/lib/data/formas-pagamento";

export default async function NewPaymentConditionPage() {
  const paymentMethods = await fetchActivePaymentMethods();

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Nova Condição de Pagamento</h1>
      </div>
      <Separator className="my-6" />
      <PaymentConditionForm paymentMethods={paymentMethods} />
    </div>
  );
}
