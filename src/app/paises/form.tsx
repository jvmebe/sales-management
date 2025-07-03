"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Country, CountryForm, CountrySchema } from "@/lib/definitions";
import { createCountry, updateCountry } from "@/lib/actions/paises";
import { formatDate } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DeleteCountryButton } from "./delete-button";
import { Separator } from "@/components/ui/separator";
import { FormFooter } from "@/components/ui/form-footer";

interface CountryFormProps {
  initialData?: Country;
}

export default function CountryForm({ initialData }: CountryFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const formId = "country-form";

  const form = useForm<CountryForm>({
    resolver: zodResolver(CountrySchema),
    defaultValues: {
      nome: initialData?.nome || "",
      sigla: initialData?.sigla || "",
      ativo: initialData?.ativo ?? true,
    },
  });

  const FORM_ID = "city-form";

  const deleteButton = isEditMode ? (
    <DeleteCountryButton id={initialData.id}>
      <Button variant="destructive" type="button">
        Excluir
      </Button>
    </DeleteCountryButton>
  ) : undefined;

  const {
    formState: { isDirty, isSubmitting },
  } = form;

  const onSubmit = async (data: CountryForm) => {
    const action = isEditMode
      ? updateCountry(initialData.id, data)
      : createCountry(data);
    const result = await action;
    if (result.success) {
      toast.success(result.message);
      router.push("/paises");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  return (
    <>
      <div className="mx-auto max-w-2xl pb-24">
        <Form {...form}>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Brasil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sigla"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sigla*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: BR" maxLength={2} {...field} />
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
              cancelHref="/paises"
              isEditMode={isEditMode}
              isSubmitting={isSubmitting}
              isDirty={isDirty}
              deleteButton={deleteButton}
            />
          </form>
        </Form>
      </div>
    </>
  );
}
