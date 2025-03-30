
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Message } from "@/types";
import { parseCSV } from "@/utils/csvParser";

interface CSVUploaderProps {
  onDataLoaded?: (messages: Message[]) => void;
}

export function CSVUploader({ onDataLoaded }: CSVUploaderProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    // Check if file is CSV
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      try {
        console.log("CSV content sample:", text.substring(0, 200)); // Log sample of CSV
        const messages = await parseCSV(text, toast);
        if (messages.length === 0) {
          throw new Error("No valid messages found in the CSV file");
        }
        if (onDataLoaded) {
          onDataLoaded(messages);
        }
        toast({
          title: "CSV loaded successfully",
          description: `Loaded ${messages.length} messages`,
        });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);
        toast({
          title: "Error parsing CSV",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Could not read the file",
        variant: "destructive",
      });
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <div className="relative">
        <input
          type="file"
          id="csv-upload"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          disabled={isLoading}
        >
          <Upload className="h-4 w-4" />
          {isLoading ? 'Loading...' : 'Upload CSV'}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>Error parsing CSV</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
