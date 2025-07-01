"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Globe,
  Map,
  Building2,
  CreditCard,
  ChevronDown,
  Package2,
  MapPin,
  Boxes,
  DollarSign,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "../ui/button";

/*
* Estrutura de dados da navbar. Suporta itens simples e grupos. Itens individuas podem ter icones, porem isso nao foi implementado na interface por enquanto.
*/
const menuConfig = [
  {
    type: "single",
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    type: "group",
    label: "Cadastros",
    icon: Users,
    items: [
      {
        href: "/clientes",
        label: "Clientes",
        icon: Globe,
      },
      {
        href: "/fornecedores",
        label: "Fornecedores",
        icon: Map,
      },
      {
        href: "/funcionarios",
        label: "Funcionários",
        icon: Building2,
      },
      {
        href: "/transportadoras",
        label: "Transportadoras",
        icon: Building2,
      },
    ],
  },
  {
    type: "group",
    label: "Locais",
    icon: MapPin,
    items: [
      {
        href: "/paises",
        label: "Países",
        icon: Globe,
      },
      {
        href: "/estados",
        label: "Estados",
        icon: Map,
      },
      {
        href: "/cidades",
        label: "Cidades",
        icon: Building2,
      },
    ],
  },
  {
    type: "group",
    label: "Produtos",
    icon: Boxes,
    items: [
      {
        href: "/produtos",
        label: "Produtos",
        icon: CreditCard,
      },
      {
        href: "/categorias",
        label: "Categorias"
      },
      {
        href: "/marcas",
        label: "Marcas"
      },
      {
        href: "/unidades-medida",
        label: "Unidades de Medida"
      }
    ],
  },
  {
    type: "group",
    label: "Financeiro",
    icon: DollarSign,
    items: [
      {
        href: "/formas-pagamento",
        label: "Formas de Pagamento",
        icon: CreditCard,
      },
      {
        href: "/condicoes-pagamento",
        label: "Condições de Pagamento"
      }
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  // Funcao para verificar se o grupo deve estar aberto
  const isGroupActive = (items: any[]) => {
    return items.some((item) => pathname.startsWith(item.href));
  };

  return (
    <aside className="hidden md:block sticky overflow-y-auto top-0 h-screen border-r bg-[#f9fbfd] z-20">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 h-20 font-semibold">
            <span className="">Sistema de Vendas</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {menuConfig.map((item, index) =>
              item.type === "single" ? (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    { "bg-muted text-primary": pathname === item.href }
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ) : (
                <Collapsible
                  key={index}
                  defaultOpen={isGroupActive(item.items)}
                  className="flex flex-col gap-1"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-between w-full px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </div>
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8 flex flex-col gap-1">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-xs",
                          { "bg-muted text-primary": pathname.startsWith(subItem.href) }
                        )}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
}
