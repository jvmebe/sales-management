import { fetchAllContas } from "@/lib/data/contas-pagar";
import { ContasPagarClient } from "./contas-pagar-client";

export default async function ContasPagarPage() {
  const allData = await fetchAllContas();

  return (
    <div className="container mx-auto py-10">
      <ContasPagarClient allData={allData} />
    </div>
  );
}
