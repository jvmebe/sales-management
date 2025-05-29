<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Calendar from "$lib/components/ui/calendar/index.js";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { cn } from "$lib/utils.js";
  import {
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
    parseDate,
    today
  } from "@internationalized/date";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import { Calendar as CalendarPrimitive } from "bits-ui";

  let {label, date = $bindable()} = $props();

  let placeholder = $state<DateValue>(today(getLocalTimeZone()));


  const df = new DateFormatter("en-US", {
      dateStyle: "long",
  });

  let value = $state<DateValue | undefined>();

  const currentDate = today(getLocalTimeZone());

  const monthFmt = new DateFormatter("en-US", {
     month: "long"
   });

   const monthOptions = Array.from({ length: 12 }, (_, i) => {
     const month = currentDate.set({ month: i + 1 });
     return {
       value: month.month,
       label: monthFmt.format(month.toDate(getLocalTimeZone()))
     };
   });

   const yearOptions = Array.from({ length: 100 }, (_, i) => ({
     label: String(new Date().getFullYear() - i),
     value: new Date().getFullYear() - i
   }));

   const defaultYear = $derived(
     placeholder
       ? { value: placeholder.year, label: String(placeholder.year) }
       : undefined
   );

   const defaultMonth = $derived(
     placeholder
       ? {
           value: placeholder.month,
           label: monthFmt.format(placeholder.toDate(getLocalTimeZone()))
         }
       : undefined
   );

   const monthLabel = $derived(
       monthOptions.find((m) => m.value === defaultMonth?.value)?.label ??
         "Select a month"
     );


   $effect(() => {
     value;

     date = `${value?.year}-${value?.month}-${value?.day}`;
   })

</script>

<Form.Control>
    {#snippet children({ props })}
        <Form.Label>{label}</Form.Label>
        <Popover.Root>
            <Popover.Trigger
                {...props}
                class={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-[280px] justify-start pl-4 text-left font-normal",
                    !value && "text-muted-foreground",
                )}
            >
                {value
                    ? df.format(value.toDate(getLocalTimeZone()))
                    : ""}
                <CalendarIcon class="ml-auto size-4 opacity-50" />
            </Popover.Trigger>
            <Popover.Content class="w-auto p-0" side="top">
                <CalendarPrimitive.Root
                  type="single"
                  weekdayFormat="short"
                  class={cn("rounded-md border p-3")}
                  bind:value
                  bind:placeholder
                >
                  {#snippet children({ months, weekdays })}
                    <Calendar.Header class="flex w-full items-center justify-between gap-2">
                      <Select.Root
                        type="single"
                        value={`${defaultMonth?.value}`}
                        onValueChange={(v) => {
                          if (!placeholder) return;
                          if (v === `${placeholder.month}`) return;
                          placeholder = placeholder.set({ month: Number.parseInt(v) });
                        }}
                      >
                        <Select.Trigger aria-label="Select month" class="w-[60%]">
                          {monthLabel}
                        </Select.Trigger>
                        <Select.Content class="max-h-[200px] overflow-y-auto">
                          {#each monthOptions as { value, label } (value)}
                            <Select.Item value={`${value}`} {label} />
                          {/each}
                        </Select.Content>
                      </Select.Root>
                      <Select.Root
                        type="single"
                        value={`${defaultYear?.value}`}
                        onValueChange={(v) => {
                          if (!v || !placeholder) return;
                          if (v === `${placeholder?.year}`) return;
                          placeholder = placeholder.set({ year: Number.parseInt(v) });
                        }}
                      >
                        <Select.Trigger aria-label="Select year" class="w-[40%]">
                          {defaultYear?.label ?? "Select year"}
                        </Select.Trigger>
                        <Select.Content class="max-h-[200px] overflow-y-auto">
                          {#each yearOptions as { value, label } (value)}
                            <Select.Item value={`${value}`} {label} />
                          {/each}
                        </Select.Content>
                      </Select.Root>
                    </Calendar.Header>
                    <Calendar.Months>
                      {#each months as month (month)}
                        <Calendar.Grid>
                          <Calendar.GridHead>
                            <Calendar.GridRow class="flex">
                              {#each weekdays as weekday (weekday)}
                                <Calendar.HeadCell>
                                  {weekday.slice(0, 2)}
                                </Calendar.HeadCell>
                              {/each}
                            </Calendar.GridRow>
                          </Calendar.GridHead>
                          <Calendar.GridBody>
                            {#each month.weeks as weekDates (weekDates)}
                              <Calendar.GridRow class="mt-2 w-full">
                                {#each weekDates as date (date)}
                                  <Calendar.Cell class="select-none" {date} month={month.value}>
                                    <Calendar.Day />
                                  </Calendar.Cell>
                                {/each}
                              </Calendar.GridRow>
                            {/each}
                          </Calendar.GridBody>
                        </Calendar.Grid>
                      {/each}
                    </Calendar.Months>
                  {/snippet}
                </CalendarPrimitive.Root>
            </Popover.Content>
        </Popover.Root>
        <Form.FieldErrors />
    {/snippet}
</Form.Control>
