
import { useEffect, useState } from "react";
import { getMessageCountByTriageLevel, getMessageCountByCategory } from "@/services/mockDataService";
import { TriageLevel, TriageCategory } from "@/types";
import { TileCounter } from "./TileCounter";
import { PieChart } from "./PieChart";
import { AlertCircle, Clock, Activity, CheckCircle } from "lucide-react";

export function DashboardStats() {
  const [triageCounts, setTriageCounts] = useState<Record<TriageLevel, number> | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<TriageCategory, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [triageData, categoryData] = await Promise.all([
          getMessageCountByTriageLevel(),
          getMessageCountByCategory()
        ]);
        
        setTriageCounts(triageData);
        setCategoryCounts(categoryData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const triageChartData = triageCounts ? [
    { name: "Urgent", value: triageCounts.Urgent, color: "#DC2626" },
    { name: "High", value: triageCounts.High, color: "#F97316" },
    { name: "Medium", value: triageCounts.Medium, color: "#F59E0B" },
    { name: "Low", value: triageCounts.Low, color: "#10B981" }
  ] : [];

  const categoryChartData = categoryCounts ? Object.entries(categoryCounts).map(([category, count]) => {
    const colorMap: Record<string, string> = {
      Clinical: "#3B82F6",
      Medication: "#8B5CF6",
      Administrative: "#6B7280",
      "Lab Result": "#EAB308",
      "Follow-up": "#22C55E",
      Insurance: "#6366F1",
      Referral: "#EC4899",
      Other: "#9CA3AF"
    };
    
    return {
      name: category,
      value: count,
      color: colorMap[category] || "#9CA3AF"
    };
  }) : [];

  if (isLoading || !triageCounts) {
    return <div className="h-48 flex items-center justify-center">Loading statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TileCounter 
          title="Urgent" 
          count={triageCounts.Urgent}
          color="bg-triage-urgent"
          icon={<AlertCircle className="h-6 w-6 text-white" />}
        />
        <TileCounter 
          title="High Priority" 
          count={triageCounts.High}
          color="bg-triage-high"
          icon={<Activity className="h-6 w-6 text-white" />}
        />
        <TileCounter 
          title="Medium Priority" 
          count={triageCounts.Medium}
          color="bg-triage-medium"
          icon={<Clock className="h-6 w-6 text-white" />}
        />
        <TileCounter 
          title="Low Priority" 
          count={triageCounts.Low}
          color="bg-triage-low"
          icon={<CheckCircle className="h-6 w-6 text-white" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart 
          data={triageChartData} 
          title="Messages by Triage Level" 
        />
        <PieChart 
          data={categoryChartData} 
          title="Messages by Category" 
        />
      </div>
    </div>
  );
}
