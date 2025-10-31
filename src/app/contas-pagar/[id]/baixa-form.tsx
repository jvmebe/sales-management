"use client";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BaixaParcelaForm as BaixaFormType,
  BaixaParcelaSchema,
  PaymentMethod,
  PurchaseInstallment,
} from "@/lib/definitions";
import { darBaixaParcela } from "@/lib/actions/contas-pagar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { FormFooter } from "@/components/ui/form-footer";
import { formatDateOnly } from "@/lib/utils";
import { differenceInDays } from "date-fns";

interface BaixaFormProps {
  parcela: PurchaseInstallment;
  paymentMethods: PaymentMethod[];
}

const parseDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

export function BaixaForm({ parcela, paymentMethods }: BaixaFormProps) {
  const router = useRouter();
  const isPago = !!parcela.data_pagamento;
  const isCancelada =
    parcela.purchase_ativo === 0 || parcela.purchase_ativo === false;
  const isReadOnly = isPago || isCancelada;
  const dataVencimento = parseDate(parcela.data_vencimento);
  const valorParcela = Number(parcela.valor_parcela);

  const form = useForm<BaixaFormType>({
    resolver: zodResolver(BaixaParcelaSchema),
    defaultValues: {
      id: parcela.id,
      valor_parcela: valorParcela,
      data_vencimento: dataVencimento,
      data_pagamento: parcela.data_pagamento
        ? parseDate(parcela.data_pagamento)
        : new Date(),
      payment_method_id: parcela.payment_method_id ?? undefined,
      valor_multa: isPago
        ? (parcela.valor_multa ?? 0)
        : (parcela.default_multa ?? 0),
      valor_juros: isPago ? 0 : (parcela.default_juros_percent ?? 0),
      valor_desconto: isPago
        ? (parcela.valor_desconto ?? 0)
        : (parcela.default_desconto ?? 0),

      observacao: parcela.observacao ?? "",

      valor_juros_calculado: isPago ? (parcela.valor_juros ?? 0) : 0,
      valor_pago_calculado: Number(parcela.valor_pago) ?? valorParcela,
    },
  });

  const watched = useWatch({ control: form.control });

  const { totalCalculado, jurosTotalCalculado } = useMemo(() => {
    const dataPagamento = watched.data_pagamento;
    if (!dataPagamento)
      return { totalCalculado: valorParcela, jurosTotalCalculado: 0 };

    const diasAtraso = differenceInDays(dataPagamento, dataVencimento);

    const multa = Number(watched.valor_multa) || 0;
    const jurosPercent = Number(watched.valor_juros) || 0;
    const desconto = Number(watched.valor_desconto) || 0;

    let jurosTotalCalculado = 0;
    let valorFinalDesconto = 0;
    let valorFinalMulta = 0;

    if (diasAtraso > 0) {
      valorFinalMulta = multa;
      const jurosDiarioValor = valorParcela * (jurosPercent / 100);
      jurosTotalCalculado = jurosDiarioValor * diasAtraso;
    } else if (diasAtraso < 0) {
      valorFinalDesconto = desconto;
    }

    const total =
      valorParcela + valorFinalMulta + jurosTotalCalculado - valorFinalDesconto;

    return {
      totalCalculado: parseFloat(total.toFixed(2)),
      jurosTotalCalculado: parseFloat(jurosTotalCalculado.toFixed(2)),
    };
  }, [
    watched.data_pagamento,
    watched.valor_multa,
    watched.valor_juros,
    watched.valor_desconto,
    dataVencimento,
    valorParcela,
  ]);

  useEffect(() => {
    form.setValue("valor_pago_calculado", totalCalculado);
    form.setValue("valor_juros_calculado", jurosTotalCalculado);
  }, [totalCalculado, jurosTotalCalculado, form]);

  const onSubmit = async (data: BaixaFormType) => {
    const result = await darBaixaParcela(data);
    if (result.success) {
      toast.success(result.message);
      router.push("/contas-pagar");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        id="baixa-form"
      >
        {isCancelada && (
          <p className="p-4 bg-destructive/10 text-destructive-foreground border border-destructive rounded-lg">
            Esta parcela pertence a uma compra cancelada.
          </p>
        )}
        {isPago && (
          <p className="p-4 bg-green-600/10 text-green-700 border border-green-600 rounded-lg">
            Esta parcela foi paga em {formatDateOnly(parcela.data_pagamento!)}{" "}
            no valor de R$ {Number(parcela.valor_pago).toFixed(2)}.
          </p>
        )}

        <fieldset disabled={isReadOnly} className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <FormItem>
              <FormLabel>Valor Original</FormLabel>
              <Input
                value={`R$ ${valorParcela.toFixed(2)}`}
                disabled
                className="text-right"
              />
            </FormItem>
            <FormItem>
              <FormLabel>Data de Vencimento</FormLabel>
              <Input value={formatDateOnly(dataVencimento)} disabled />
            </FormItem>
          </div>

          <Separator />
          <h3 className="text-lg font-medium">Pagamento</h3>

          <div className="grid md:grid-cols-4 gap-4">
            <FormField
              name="data_pagamento"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Pagamento</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_method_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem
                          key={method.id}
                          value={method.id.toString()}
                        >
                          {method.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <FormField
              name="valor_multa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Multa (Valor Fixo)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    className="text-right"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormField
              name="valor_juros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Juros (% ao dia)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    className="text-right"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormField
              name="valor_desconto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desconto (Valor Fixo)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    className="text-right"
                    {...field}
                  />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Valor Total a Pagar</FormLabel>
              <Input
                value={`R$ ${totalCalculado.toFixed(2)}`}
                disabled
                className="text-right font-bold text-lg"
              />
            </FormItem>
          </div>

          <FormField
            name="observacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observação</FormLabel>
                <Textarea {...field} />
              </FormItem>
            )}
          />
        </fieldset>

        <FormFooter
          formId="baixa-form"
          cancelHref="/contas-pagar"
          isEditMode={false}
          isSubmitting={form.formState.isSubmitting}
          isDirty={form.formState.isDirty}
          showSaveButton={!isReadOnly}
        />
      </form>
    </Form>
  );
}
