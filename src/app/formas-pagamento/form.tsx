"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  PaymentMethod,
  PaymentMethodForm as PaymentMethodFormType,
  PaymentMethodSchema,
} from "@/lib/definitions";
import {
  createPaymentMethod,
  updatePaymentMethod,
} from "@/lib/actions/formas-pagamento";
import { formatDate } from "@/lib/utils";
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
import { DeletePaymentMethodButton } from "./delete-button";
import { Separator } from "@/components/ui/separator";
import { FormFooter } from "@/components/ui/form-footer";

interface PaymentMethodFormProps {
  initialData?: PaymentMethod;
}

export default function PaymentMethodForm({
  initialData,
}: PaymentMethodFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const FORM_ID = "pay-form";

  const deleteButton = isEditMode ? (
    <DeletePaymentMethodButton id={initialData.id}>
      <Button variant="destructive" type="button">
        Excluir
      </Button>
    </DeletePaymentMethodButton>
  ) : undefined;

  const form = useForm<PaymentMethodFormType>({
    resolver: zodResolver(PaymentMethodSchema),
    defaultValues: {
      descricao: initialData?.descricao || "",
      ativo: initialData?.ativo ?? true,
    },
  });

  const {
    formState: { errors, isDirty, isSubmitting },
  } = form;

  const onSubmit = async (data: PaymentMethodFormType) => {
    const action = isEditMode
      ? updatePaymentMethod(initialData.id, data)
      : createPaymentMethod(data);

    const result = await action;

    if (result.success) {
      toast.success(result.message);
      router.push("/formas-pagamento");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
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
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Dinheiro, Cartão de Crédito"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            cancelHref="/formas-pagamento"
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
