import { fetchAllContasReceber } from "@/lib/data/contas-receber";
import { ContasReceberClient } from "./contas-receber-client";

export default async function ContasReceberPage() {
  const allData = await fetchAllContasReceber();

  return (
    <div className="container mx-auto py-10">
      <ContasReceberClient allData={allData} />
    </div>
  );
}
