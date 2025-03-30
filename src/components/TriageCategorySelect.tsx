
import { TriageCategory } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TriageCategorySelectProps {
  value: TriageCategory | "All";
  onChange: (value: TriageCategory | "All") => void;
}

export function TriageCategorySelect({ value, onChange }: TriageCategorySelectProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="triage-category" className="text-sm font-medium">
        Category
      </label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as TriageCategory | "All")}
      >
        <SelectTrigger id="triage-category" className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          <SelectItem value="Clinical">Clinical</SelectItem>
          <SelectItem value="Medication">Medication</SelectItem>
          <SelectItem value="Administrative">Administrative</SelectItem>
          <SelectItem value="Lab Result">Lab Result</SelectItem>
          <SelectItem value="Follow-up">Follow-up</SelectItem>
          <SelectItem value="Insurance">Insurance</SelectItem>
          <SelectItem value="Referral">Referral</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
