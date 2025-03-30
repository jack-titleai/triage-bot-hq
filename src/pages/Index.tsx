
import { useState, useEffect, useCallback } from "react";
import { getFilteredMessages } from "@/services/mockDataService";
import { Message, TriageLevel, TriageCategory, FilterState, DateRange } from "@/types";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { TriageLevelSelect } from "@/components/TriageLevelSelect";
import { TriageCategorySelect } from "@/components/TriageCategorySelect";
import { SearchBox } from "@/components/SearchBox";
import { MessageList } from "@/components/MessageList";
import { DashboardStats } from "@/components/DashboardStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Inbox, BarChart2 } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: undefined, to: undefined },
    triageLevel: "All",
    triageCategory: "All",
    searchQuery: "",
  });

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFilteredMessages(
        filters.dateRange,
        filters.triageLevel,
        filters.triageCategory,
        filters.searchQuery
      );
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDateRangeChange = (dateRange: DateRange) => {
    setFilters({ ...filters, dateRange });
  };

  const handleTriageLevelChange = (triageLevel: TriageLevel | "All") => {
    setFilters({ ...filters, triageLevel });
  };

  const handleTriageCategoryChange = (triageCategory: TriageCategory | "All") => {
    setFilters({ ...filters, triageCategory });
  };

  const handleSearchChange = (searchQuery: string) => {
    setFilters({ ...filters, searchQuery });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-medical-dark">Healthcare Inbox Triage</h1>
          <p className="text-medical-secondary">Efficiently manage and prioritize incoming messages</p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="inbox" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="inbox" className="flex items-center">
              <Inbox className="mr-2 h-4 w-4" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="inbox" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-between">
                <DateRangeSelector 
                  dateRange={filters.dateRange}
                  onDateRangeChange={handleDateRangeChange}
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <TriageLevelSelect
                    value={filters.triageLevel}
                    onChange={handleTriageLevelChange}
                  />
                  <TriageCategorySelect
                    value={filters.triageCategory}
                    onChange={handleTriageCategoryChange}
                  />
                  <SearchBox
                    value={filters.searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Messages ({messages.length})</h2>
              </div>
              <Separator className="mb-4" />
              <MessageList messages={messages} isLoading={isLoading} />
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Message Analytics</h2>
              <DashboardStats />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
