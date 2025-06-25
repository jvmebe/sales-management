    import { QuickShortcutsCard } from "@/components/home/quick-shortcuts-card";
import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from "@/components/ui/card";
import { Settings } from "lucide-react";

    export default function HomePage() {
      return (
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Página Inicial</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Vendas Hoje
                </CardTitle>
                {/* Ícone de vendas aqui */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 1,250.00</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% em relação a ontem
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Novos Clientes
                </CardTitle>
                {/* Ícone de clientes aqui */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12</div>
                <p className="text-xs text-muted-foreground">
                  +5 na última hora
                </p>
              </CardContent>
            </Card>
             {/* Você pode adicionar mais cards de resumo aqui */}
          </div>
          <div className="mt-8">
             <Card>
                <CardHeader>
                    <CardTitle>Bem-vindo ao Sistema!</CardTitle>
                    <CardDescription>
                        Utilize a barra de navegação à esquerda para acessar os módulos de cadastros.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Este é o seu painel central.</p>
                </CardContent>
             </Card>
          </div>
          <div className="mt-8" >
            <QuickShortcutsCard />
          </div>
          
        </div>
      );
    }
    