"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, PlusCircle } from "lucide-react";
import { ALL_SHORTCUTS, Shortcut } from "@/lib/shortcuts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const STORAGE_KEY = "dashboard-shortcuts";

export function QuickShortcutsCard() {
  const [selectedShortcutIds, setSelectedShortcutIds] = useState<string[]>([]);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Carrega os atalhos salvos do localStorage
  useEffect(() => {
    const savedShortcuts = localStorage.getItem(STORAGE_KEY);
    if (savedShortcuts) {
      setSelectedShortcutIds(JSON.parse(savedShortcuts));
    } else {
      // Atalhos padrao caso seja a primeira inicializacao
      const defaultShortcuts = ["/clientes/novo", "/produtos/novo"];
      setSelectedShortcutIds(defaultShortcuts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultShortcuts));
    }
  }, []);

  const handleOpenDialog = () => {
    setTempSelectedIds([...selectedShortcutIds]);
    setDialogOpen(true);
  };

  const handleSave = () => {
    setSelectedShortcutIds(tempSelectedIds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tempSelectedIds));
    setDialogOpen(false);
  };

  const displayedShortcuts = ALL_SHORTCUTS.filter((shortcut) =>
    selectedShortcutIds.includes(shortcut.id)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Atalhos Rápidos</CardTitle>
            <CardDescription>Acesse as funções mais usadas.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleOpenDialog}>
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Personalizar Atalhos</DialogTitle>
                <DialogDescription>
                  Selecione os atalhos que você deseja exibir no painel.
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <div className="space-y-4 py-4">
                {ALL_SHORTCUTS.map((shortcut) => (
                  <div key={shortcut.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={shortcut.id}
                      checked={tempSelectedIds.includes(shortcut.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? setTempSelectedIds([...tempSelectedIds, shortcut.id])
                          : setTempSelectedIds(tempSelectedIds.filter((id) => id !== shortcut.id));
                      }}
                    />
                    <label
                      htmlFor={shortcut.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {shortcut.label}
                    </label>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                <Button type="button" onClick={handleSave}>Salvar Alterações</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {displayedShortcuts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {displayedShortcuts.map((shortcut) => (
              <Link
                key={shortcut.id}
                href={shortcut.href}
                className="flex flex-col items-center justify-center p-4 border bg-background rounded-lg h-28 text-center transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <shortcut.icon className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">{shortcut.label}</span>
              </Link>
            ))}
          </div>
        ) : (
           <div className="text-center text-sm text-muted-foreground py-4">
              Nenhum atalho selecionado. Clique no ícone de engrenagem para adicionar.
           </div>
        )}
      </CardContent>
    </Card>
  );
}
