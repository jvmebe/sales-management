import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import SaleForm from "../form";
import { fetchSaleById } from "@/lib/data/vendas";
import { fetchClients } from "@/lib/data/clientes";
import { fetchEmployees } from "@/lib/data/funcionarios";
import { fetchProducts } from "@/lib/data/produtos";
import { fetchPaymentConditions } from "@/lib/data/condicoes-pagamento";

export default async function ViewSalePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [sale, clients, employees, products, paymentConditions] = await Promise.all([
    fetchSaleById(id),
    fetchClients(),
    fetchEmployees(),
    fetchProducts(),
    fetchPaymentConditions(),
  ]);

  if (!sale) notFound();

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Detalhes da Venda #{sale.id}</h1>
        <p className="text-muted-foreground">Visualização dos detalhes. Cancelamento disponível no rodapé.</p>
      </div>
      <Separator className="my-6" />
      <SaleForm
        initialData={sale}
        readOnly={true}
        clients={clients}
        employees={employees}
        products={products}
        paymentConditions={paymentConditions}
      />
    </div>
  );
}
