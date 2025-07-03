"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Product,
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
import { createProduct, updateProduct } from "@/lib/actions/produtos";
import { formatDate } from "@/lib/utils";

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
import { DeleteProductButton } from "./delete-button";

import { BrandSelectionDialog } from "@/components/dialogs/brand-selection-dialog";
import { CategorySelectionDialog } from "@/components/dialogs/category-selection-dialog";
import { UnitSelectionDialog } from "@/components/dialogs/unit-selection-dialog";
import { SupplierSelectionDialog } from "@/components/dialogs/supplier-selection-dialog";
import { FormFooter } from "@/components/ui/form-footer";

interface ProductFormProps {
  initialData?: Product;
  brands: ProductBrand[];
  categories: ProductCategory[];
  units: ProductUnit[];
  suppliers: Supplier[];
  cities: City[];
  states: State[];
  countries: Country[];
}

export default function ProductForm({
  initialData,
  brands,
  categories,
  units,
  suppliers,
  cities,
  states,
  countries,
}: ProductFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [dialogsOpen, setDialogsOpen] = useState({
    brand: false,
    category: false,
    unit: false,
    supplier: false,
  });

  const [selectedNames, setSelectedNames] = useState({
    brand: initialData
      ? brands.find((b) => b.id === initialData.brand_id)?.nome
      : undefined,
    category: initialData
      ? categories.find((c) => c.id === initialData.category_id)?.nome
      : undefined,
    unit: initialData
      ? units.find((u) => u.id === initialData.unit_id)?.nome
      : "",
    supplier: initialData
      ? suppliers.find((s) => s.id === initialData.supplier_id)?.nome
      : undefined,
  });

  const form = useForm<ProductFormType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData || {
      ativo: true,
      valor_compra: 0,
      valor_venda: 0,
      estoque: 0,
    },
  });

  const FORM_ID = "product-form";

  const {
    formState: { errors, isDirty, isSubmitting },
  } = form;

  const deleteButton = isEditMode ? (
    <DeleteProductButton id={initialData.id}>
      <Button variant="destructive" type="button">
        Excluir
      </Button>
    </DeleteProductButton>
  ) : undefined;

  const onSubmit = async (data: ProductFormType) => {
    const action = isEditMode
      ? updateProduct(initialData.id, data)
      : createProduct(data);
    const result = await action;
    if (result.success) {
      toast.success(result.message);
      router.push("/produtos");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          id={FORM_ID}
        >
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
          <Separator />
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
          <FormField
            name="descricao"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />
          <h3 className="text-lg font-medium">Detalhes e Classificação</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              name="unit_id"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Unidade de Medida*</FormLabel>
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
                        {selectedNames.unit || "Selecione uma unidade"}
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
                        {selectedNames.brand || "Selecione uma marca"}
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
                        {selectedNames.category || "Selecione uma categoria"}
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
              name="supplier_id"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fornecedor*</FormLabel>
                  <Dialog
                    open={dialogsOpen.supplier}
                    onOpenChange={(isOpen) =>
                      setDialogsOpen((p) => ({ ...p, supplier: isOpen }))
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start font-normal"
                      >
                        {selectedNames.supplier || "Selecione um fornecedor"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl flex flex-col">
                      <SupplierSelectionDialog
                        suppliers={suppliers}
                        cities={cities}
                        states={states}
                        countries={countries}
                        onSelect={(item) => {
                          field.onChange(item.id);
                          setSelectedNames((p) => ({
                            ...p,
                            supplier: item.nome,
                          }));
                          setDialogsOpen((p) => ({ ...p, supplier: false }));
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <h3 className="text-lg font-medium">Valores e Estoque</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              name="codigo_barras"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cód. Barras</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="valor_compra"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Compra</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="valor_venda"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Venda</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="estoque"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditMode ? "Estoque" : "Estoque Inicial"}
                </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditMode && (
            <>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Data de Criação
                  </p>
                  <p className="text-sm">
                    {formatDate(initialData.data_criacao)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Última Modificação
                  </p>
                  <p className="text-sm">
                    {formatDate(initialData.data_modificacao)}
                  </p>
                </div>
              </div>
            </>
          )}

          <FormFooter
            formId={FORM_ID}
            cancelHref="/produtos"
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            deleteButton={deleteButton}
          />
        </form>
      </Form>
    </div>
  );
}
