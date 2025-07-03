    import { QuickShortcutsCard } from "@/components/home/quick-shortcuts-card";
import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { ModeToggle } from "@/components/ui/dark-mode-toggle";

    export default function HomePage() {
      return (
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Página Inicial <span className="float-end"> <ModeToggle /> </span></h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    