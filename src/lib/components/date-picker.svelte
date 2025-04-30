<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  import SuperDebug, { type SuperValidated, type Infer, superForm,} from "sveltekit-superforms";
  import {
      CalendarDate,
      DateFormatter,
      type DateValue,
      getLocalTimeZone,
      parseDate,
      today,
  } from "@internationalized/date";

  let {label, date = $bindable()} = $props();

  let placeholder = $state<DateValue>(today(getLocalTimeZone()));


  const df = new DateFormatter("en-US", {
      dateStyle: "long",
  });

  let value = $state<DateValue | undefined>();

  $effect(() => {
      value = date
          ? parseDate(date)
          : undefined;
  });

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
                <Calendar
                    type="single"
                    value={value as DateValue}
                    bind:placeholder
                    minValue={new CalendarDate(1900, 1, 1)}
                    maxValue={today(getLocalTimeZone())}
                    calendarLabel=""
                    onValueChange={(v) => {
                        if (v) {
                            date =
                                v.toString();
                        } else {
                            date = "";
                        }
                    }}
                />
            </Popover.Content>
        </Popover.Root>
        <Form.FieldErrors />
    {/snippet}
</Form.Control>
