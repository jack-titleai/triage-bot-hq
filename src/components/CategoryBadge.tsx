
import { TriageCategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: TriageCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const colorMap: Record<TriageCategory, string> = {
    Clinical: "bg-blue-500 hover:bg-blue-600",
    Medication: "bg-purple-500 hover:bg-purple-600",
    Administrative: "bg-gray-500 hover:bg-gray-600",
    "Lab Result": "bg-yellow-600 hover:bg-yellow-700",
    "Follow-up": "bg-green-600 hover:bg-green-700",
    Insurance: "bg-indigo-500 hover:bg-indigo-600",
    Referral: "bg-pink-500 hover:bg-pink-600",
    Other: "bg-gray-400 hover:bg-gray-500"
  };

  return (
    <Badge className={cn(colorMap[category], "text-white", className)}>
      {category}
    </Badge>
  );
}
