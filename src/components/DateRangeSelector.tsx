
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangeSelector({ dateRange, onDateRangeChange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !dateRange.from && !dateRange.to && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            "Select date range"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange.from}
          selected={{
            from: dateRange.from,
            to: dateRange.to,
          }}
          onSelect={(range) => {
            onDateRangeChange({
              from: range?.from,
              to: range?.to,
            });
          }}
          className={cn("p-3 pointer-events-auto")}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
