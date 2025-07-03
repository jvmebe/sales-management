"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  disabled?: boolean;
  disableFutureDates?: boolean
}

export function DatePicker({ value, onChange, disabled, disableFutureDates }: DatePickerProps) {

  const disableDate = (date: Date) => {
    const tooEarly = date < new Date("1900-01-01");
    const inFuture = date > new Date();
    return disableFutureDates ? tooEarly || inFuture : tooEarly;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
         <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={disableDate}
                    captionLayout="dropdown"
                    locale={ptBR}
                  />
      </PopoverContent>
    </Popover>
  );
}
