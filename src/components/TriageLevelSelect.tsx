
import { TriageLevel } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TriageLevelSelectProps {
  value: TriageLevel | "All";
  onChange: (value: TriageLevel | "All") => void;
}

export function TriageLevelSelect({ value, onChange }: TriageLevelSelectProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="triage-level" className="text-sm font-medium">
        Triage Level
      </label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as TriageLevel | "All")}
      >
        <SelectTrigger id="triage-level" className="w-[180px]">
          <SelectValue placeholder="All Levels" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Levels</SelectItem>
          <SelectItem value="Urgent">Urgent</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
