
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Message } from "@/types";
import { CSVUploader } from "@/components/CSVUploader";
import { SettingsButton } from "@/components/SettingsButton";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onDataLoaded?: (messages: Message[]) => void;
}

export function SearchBox({ value, onChange, onDataLoaded }: SearchBoxProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-8 w-[280px]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <CSVUploader onDataLoaded={onDataLoaded} />
        <SettingsButton />
      </div>
    </div>
  );
}
