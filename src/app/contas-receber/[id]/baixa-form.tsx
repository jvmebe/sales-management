"use client";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BaixaContaReceberForm as BaixaFormType,
  BaixaContaReceberSchema,
  PaymentMethod,
  SaleInstallmentDTO,
} from "@/lib/definitions";
import { darBaixaContaReceber } from "@/lib/actions/contas-receber";
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
  parcela: SaleInstallmentDTO;
  paymentMethods: PaymentMethod[];
}

const parseDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

export function BaixaForm({ parcela, paymentMethods }: BaixaFormProps) {
  const router = useRouter();
  const isPago = !!parcela.data_pagamento;
  const isCancelada = parcela.sale_ativo === false; // Verifica boolean direto ou 0
  const isReadOnly = isPago || isCancelada;
  const dataVencimento = parseDate(parcela.data_vencimento);
  const valorParcela = Number(parcela.valor_parcela);

  const form = useForm<BaixaFormType>({
    resolver: zodResolver(BaixaContaReceberSchema),
    defaultValues: {
      id: parcela.id,
      valor_parcela: valorParcela,
      data_vencimento: dataVencimento,
      // Regra: Data de pagamento é APENAS hoje se for nova baixa
      data_pagamento: parcela.data_pagamento
        ? parseDate(parcela.data_pagamento)
        : new Date(),
      // Regra: Carrega automaticamente o método da condição
      payment_method_id: parcela.payment_method_id ?? parcela.default_payment_method_id ?? undefined,
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

  // Lógica de cálculo automático
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

    // Aplica Multa e Juros apenas se houver atraso
    if (diasAtraso > 0) {
      valorFinalMulta = multa;
      // Juros simples (percentual ao dia * dias * valor) / 100
      // Ajuste conforme sua regra de negócio (ex: juros mensais vs diários)
      // Aqui assumindo taxa diária conforme código anterior, ou mensal/30
      // Se o juros cadastrado for mensal, dividir por 30. Se for diário, manter.
      // Vamos manter a lógica simples: Valor * (Taxa * Dias / 100)
      // *Se a taxa for "0.33" (diária para 10% mês), o cálculo é direto.
      const jurosDiarioValor = valorParcela * (jurosPercent / 100);
      jurosTotalCalculado = jurosDiarioValor * diasAtraso;
    } else {
       // Se pagar em dia ou antecipado, considera o desconto
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

  // Atualiza os campos ocultos do formulário com os valores calculados
  useEffect(() => {
    form.setValue("valor_pago_calculado", totalCalculado);
    form.setValue("valor_juros_calculado", jurosTotalCalculado);
  }, [totalCalculado, jurosTotalCalculado, form]);

  const onSubmit = async (data: BaixaFormType) => {
    const result = await darBaixaContaReceber(data);
    if (result.success) {
      toast.success(result.message);
      router.push("/contas-receber");
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
            Esta parcela pertence a uma venda cancelada.
          </p>
        )}
        {isPago && (
          <p className="p-4 bg-green-600/10 text-green-700 border border-green-600 rounded-lg">
            Esta parcela foi recebida em {formatDateOnly(parcela.data_pagamento!)}{" "}
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
          <h3 className="text-lg font-medium">Recebimento</h3>

          <div className="grid md:grid-cols-4 gap-4">
            <FormField
              name="data_pagamento"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Recebimento</FormLabel>
                  {/* Campo desabilitado para forçar "Hoje", mas envia o valor no form */}
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={true}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_method_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Recebimento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    // Converte para string para o Select funcionar corretamente
                    defaultValue={field.value?.toString()}
                    value={field.value?.toString()}
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
                  <FormLabel>Multa (R$ Fixo)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    className="text-right bg-slate-50"
                    {...field}
                    readOnly // Multa fixa do cadastro é apenas leitura ou editável? Geralmente editável na baixa, mas pode travar se quiser.
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
                    className="text-right bg-slate-50"
                    {...field}
                    readOnly
                  />
                </FormItem>
              )}
            />
            <FormField
              name="valor_desconto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desconto (R$ Fixo)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    className="text-right bg-slate-50"
                    {...field}
                    readOnly
                  />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Total a Receber</FormLabel>
              <Input
                value={`R$ ${totalCalculado.toFixed(2)}`}
                disabled
                className="text-right font-bold text-lg text-green-700 border-green-200 bg-green-50"
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
          cancelHref="/contas-receber"
          isEditMode={false}
          isSubmitting={form.formState.isSubmitting}
          isDirty={form.formState.isDirty}
          // Oculta botão de salvar se for apenas leitura (já pago/cancelado)
          // Você pode precisar ajustar seu componente FormFooter para aceitar uma prop 'hideSaveButton' ou similar
          // Se não tiver, o 'disabled={isReadOnly}' no fieldset já ajuda a prevenir edições
        />
      </form>
    </Form>
  );
}
