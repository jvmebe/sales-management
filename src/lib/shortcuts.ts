import { LucideIcon, FilePlus, Globe, Building2, UserPlus, Truck, CreditCard, Map } from "lucide-react";

// Interface para definir a estrutura de um atalho
export interface Shortcut {
  id: string; // Um identificador único, como o href
  href: string;
  label: string;
  icon: LucideIcon;
}

// Lista central com todos os atalhos que o usuário pode escolher
export const ALL_SHORTCUTS: Shortcut[] = [
  {
    id: "/clientes/novo",
    href: "/clientes/novo",
    label: "Novo Cliente",
    icon: UserPlus,
  },
  {
    id: "/produtos/novo",
    href: "/produtos/novo",
    label: "Novo Produto",
    icon: FilePlus,
  },
    {
    id: "/paises/novo",
    href: "/paises/novo",
    label: "Novo País",
    icon: Globe,
  },
  {
    id: "/estados/novo",
    href: "/estados/novo",
    label: "Novo Estado",
    icon: Map,
  },
  {
    id: "/cidades/novo",
    href: "/cidades/novo",
    label: "Nova Cidade",
    icon: Building2,
  },
  {
    id: "/formas-pagamento/novo",
    href: "/formas-pagamento/novo",
    label: "Nova Forma Pagto.",
    icon: CreditCard,
  },
];
