import { Separator } from "@/components/ui/separator";
import SaleForm from "../form";
import { fetchClients } from "@/lib/data/clientes";
import { fetchEmployees } from "@/lib/data/funcionarios";
import { fetchProducts } from "@/lib/data/produtos";
import { fetchPaymentConditions } from "@/lib/data/condicoes-pagamento";

export default async function NewSalePage() {
  const [clients, employees, products, paymentConditions] = await Promise.all([
    fetchClients(),
    fetchEmployees(),
    fetchProducts(),
    fetchPaymentConditions(),
  ]);

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Nova Venda</h1>
        <p className="text-muted-foreground">Preencha os dados, adicione produtos e gere as parcelas para finalizar.</p>
      </div>
      <Separator className="my-6" />
      <SaleForm
        clients={clients}
        employees={employees}
        products={products}
        paymentConditions={paymentConditions}
      />
    </div>
  );
}
