import { Separator } from "@/components/ui/separator";
import SaleForm from "../form";
import { fetchClients } from "@/lib/data/clientes";
import { fetchEmployees } from "@/lib/data/funcionarios";
import { fetchProducts } from "@/lib/data/produtos";
import { fetchPaymentConditions } from "@/lib/data/condicoes-pagamento";
// Novos imports para o cadastro rápido de produto
import { fetchProductBrands } from "@/lib/data/marcas";
import { fetchProductCategories } from "@/lib/data/categorias-produto";
import { fetchProductUnits } from "@/lib/data/unidades-medida";
import { fetchSuppliers } from "@/lib/data/fornecedores";
import { fetchCities } from "@/lib/data/cidades";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchActiveCountries } from "@/lib/data/paises";

export default async function NewSalePage() {
  // Busca todos os dados em paralelo
  const [
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

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Nova Venda</h1>
        <p className="text-muted-foreground">Preencha os campos para registrar uma nova venda.</p>
      </div>
      <Separator className="my-6" />
      <SaleForm
        clients={clients}
        employees={employees}
        products={products}
        paymentConditions={paymentConditions}
        // Passando os novos dados para o cadastro rápido
        brands={brands}
        categories={categories}
        units={units}
        suppliers={suppliers}
        cities={cities}
        states={states}
        countries={countries}
      />
    </div>
  );
}
