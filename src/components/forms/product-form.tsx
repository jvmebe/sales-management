"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import {
  ProductForm as ProductFormType,
  ProductSchema,
  ProductBrand,
  ProductCategory,
  ProductUnit,
  Supplier,
  City,
  State,
  Country,
} from "@/lib/definitions";
import { createProduct } from "@/lib/actions/produtos";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Reutiliza os dialogs de seleção existentes para as dependências
import { BrandSelectionDialog } from "@/components/dialogs/brand-selection-dialog";
import { CategorySelectionDialog } from "@/components/dialogs/category-selection-dialog";
import { UnitSelectionDialog } from "@/components/dialogs/unit-selection-dialog";
import { SupplierSelectionDialog } from "@/components/dialogs/supplier-selection-dialog";

interface ProductCreationFormProps {
  brands: ProductBrand[];
  categories: ProductCategory[];
  units: ProductUnit[];
  suppliers: Supplier[];
  cities: City[];
  states: State[];
  countries: Country[];
  onSuccess: () => void;
}

export function ProductCreationForm({
  brands,
  categories,
  units,
  suppliers,
  cities,
  states,
  countries,
  onSuccess,
}: ProductCreationFormProps) {
  const [dialogsOpen, setDialogsOpen] = useState({
    brand: false,
    category: false,
    unit: false,
    supplier: false,
  });

  const [selectedNames, setSelectedNames] = useState({
    brand: "",
    category: "",
    unit: "",
    suppliers: [] as string[],
  });

  const form = useForm<ProductFormType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      ativo: true,
      valor_compra: 0,
      valor_venda: 0,
      estoque: 0,
      supplier_ids: [],
      nome: "",
      descricao: "",
      codigo_barras: "",
      brand_id: undefined,
      category_id: undefined,
      unit_id: undefined,
    },
  });

  const onSubmit = async (data: ProductFormType) => {
    const result = await createProduct(data);
    if (result.success) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error("Erro ao salvar produto", { description: result.message });
    }
  };

  return (
    <div className="overflow-y-auto max-h-[80vh] p-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-2">
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <FormLabel>Ativo</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="nome"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Produto*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
              name="codigo_barras"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cód. Barras</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                </FormItem>
              )}
            />
             <FormField
              name="estoque"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estoque Inicial</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <h3 className="text-sm font-medium text-muted-foreground">Classificação</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="unit_id"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Unidade*</FormLabel>
                  <Dialog
                    open={dialogsOpen.unit}
                    onOpenChange={(isOpen) =>
                      setDialogsOpen((p) => ({ ...p, unit: isOpen }))
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start font-normal"
                      >
                        {selectedNames.unit || "Selecione"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <UnitSelectionDialog
                        units={units}
                        onSelect={(item) => {
                          field.onChange(item.id);
                          setSelectedNames((p) => ({ ...p, unit: item.nome }));
                          setDialogsOpen((p) => ({ ...p, unit: false }));
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="brand_id"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Marca*</FormLabel>
                  <Dialog
                    open={dialogsOpen.brand}
                    onOpenChange={(isOpen) =>
                      setDialogsOpen((p) => ({ ...p, brand: isOpen }))
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start font-normal"
                      >
                        {selectedNames.brand || "Selecione"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <BrandSelectionDialog
                        brands={brands}
                        onSelect={(item) => {
                          field.onChange(item.id);
                          setSelectedNames((p) => ({ ...p, brand: item.nome }));
                          setDialogsOpen((p) => ({ ...p, brand: false }));
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="category_id"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Categoria*</FormLabel>
                  <Dialog
                    open={dialogsOpen.category}
                    onOpenChange={(isOpen) =>
                      setDialogsOpen((p) => ({ ...p, category: isOpen }))
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start font-normal"
                      >
                        {selectedNames.category || "Selecione"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <CategorySelectionDialog
                        categories={categories}
                        onSelect={(item) => {
                          field.onChange(item.id);
                          setSelectedNames((p) => ({
                            ...p,
                            category: item.nome,
                          }));
                          setDialogsOpen((p) => ({ ...p, category: false }));
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              name="supplier_ids"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fornecedores</FormLabel>
                  <Dialog
                    open={dialogsOpen.supplier}
                    onOpenChange={(isOpen) =>
                      setDialogsOpen((p) => ({ ...p, supplier: isOpen }))
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start font-normal truncate"
                      >
                        {selectedNames.suppliers.length > 0
                            ? `${selectedNames.suppliers.length} selecionado(s)`
                            : "Selecione"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl flex flex-col h-[80vh]">
                      <SupplierSelectionDialog
                        suppliers={suppliers}
                        cities={cities}
                        states={states}
                        countries={countries}
                        selectionMode="multiple"
                        onSelect={(selected) => {
                          const selectedSuppliers = Array.isArray(selected) ? selected : [selected];
                          field.onChange(selectedSuppliers.map(s => s.id));
                          setSelectedNames((p) => ({
                            ...p,
                            suppliers: selectedSuppliers.map(s => s.nome),
                          }));
                          setDialogsOpen((p) => ({ ...p, supplier: false }));
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <h3 className="text-sm font-medium text-muted-foreground">Valores</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="valor_compra"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compra (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="valor_venda"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venda (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Salvando..." : "Salvar Produto"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
