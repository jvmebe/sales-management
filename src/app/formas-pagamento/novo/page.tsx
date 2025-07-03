import { Separator } from "@/components/ui/separator";
import PaymentMethodForm from "../form";

export default function NewPaymentMethodPage() {
  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Nova Forma de Pagamento</h1>
        <p className="text-muted-foreground">
          Preencha o campo abaixo para adicionar um novo registro.
        </p>
      </div>
      <Separator className="my-6" />
      <PaymentMethodForm />
    </div>
  );
}
