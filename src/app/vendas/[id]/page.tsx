import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import SaleForm from "../form";
import { fetchSaleById } from "@/lib/data/vendas";
import { fetchClients } from "@/lib/data/clientes";
import { fetchEmployees } from "@/lib/data/funcionarios";
import { fetchProducts } from "@/lib/data/produtos";
import { fetchPaymentConditions } from "@/lib/data/condicoes-pagamento";
// Novos imports
import { fetchProductBrands } from "@/lib/data/marcas";
import { fetchProductCategories } from "@/lib/data/categorias-produto";
import { fetchProductUnits } from "@/lib/data/unidades-medida";
import { fetchSuppliers } from "@/lib/data/fornecedores";
import { fetchCities } from "@/lib/data/cidades";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchActiveCountries } from "@/lib/data/paises";
import { SaleForm as SaleFormType } from "@/lib/definitions";

export default async function SaleDetailsPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [
    sale,
    clients,
    employees,
    products,
    paymentConditions,
    brands,
    categories,
    units,
    suppliers,
    cities,
    states,
    countries
  ] = await Promise.all([
    fetchSaleById(id),
    fetchClients(),
    fetchEmployees(),
    fetchProducts(),
    fetchPaymentConditions(),
    fetchProductBrands(),
    fetchProductCategories(),
    fetchProductUnits(),
    fetchSuppliers(),
    fetchCities(),
    fetchActiveStates(),
    fetchActiveCountries(),
  ]);

  if (!sale) notFound();

  // Mapeia os dados do banco para o formato do formulário (especialmente datas)
  const formData: SaleFormType & { ativo: boolean } = {
    ...sale,
    // Garante que a data seja um objeto Date para o DatePicker
    data_emissao: new Date(sale.data_emissao),
    items: sale.items.map(item => ({
      ...item,
      valor_unitario: Number(item.valor_unitario),
      quantidade: Number(item.quantidade)
    })),
    installments: sale.installments.map(inst => ({
      ...inst,
      data_vencimento: new Date(inst.data_vencimento),
      valor_parcela: Number(inst.valor_parcela)
    })),
  };

  // Define se será somente leitura (ex: se a venda estiver cancelada ou finalizada)
  const isReadOnly = !sale.ativo;

  return (
    <div className="form-container">
       <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold">Venda #{sale.numero_nota}</h1>
        </div>
      </div>
      <Separator className="my-6" />
      <SaleForm
        initialData={formData}
        clients={clients}
        employees={employees}
        products={products}
        paymentConditions={paymentConditions}
        brands={brands}
        categories={categories}
        units={units}
        suppliers={suppliers}
        cities={cities}
        states={states}
        countries={countries}
        readOnly={isReadOnly}
      />
    </div>
  );
}
