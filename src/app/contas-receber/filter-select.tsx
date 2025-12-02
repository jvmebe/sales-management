"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContasPagarStatus } from "@/lib/definitions"; // Reutilizando o tipo, pois os status são os mesmos

const statusOptions: Record<ContasPagarStatus, string> = {
  aberto: "Em Aberto",
  vencido: "Vencidas",
  pago: "Recebidas", // Alterado label para contexto de venda
  cancelado: "Canceladas",
  todas: "Todas",
};

interface FilterSelectProps {
  currentStatus: ContasPagarStatus;
  onStatusChange: (status: ContasPagarStatus) => void;
}

export function FilterSelect({ currentStatus, onStatusChange }: FilterSelectProps) {
  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => onStatusChange(value as ContasPagarStatus)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filtrar por status..." />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusOptions).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
