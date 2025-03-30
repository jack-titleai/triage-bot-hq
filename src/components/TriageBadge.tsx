
import { TriageLevel } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TriageBadgeProps {
  level: TriageLevel;
  className?: string;
}

export function TriageBadge({ level, className }: TriageBadgeProps) {
  const colorMap: Record<TriageLevel, string> = {
    Urgent: "bg-triage-urgent text-white hover:bg-triage-urgent/90",
    High: "bg-triage-high text-white hover:bg-triage-high/90",
    Medium: "bg-triage-medium text-white hover:bg-triage-medium/90",
    Low: "bg-triage-low text-white hover:bg-triage-low/90"
  };

  return (
    <Badge className={cn(colorMap[level], className)}>
      {level}
    </Badge>
  );
}
