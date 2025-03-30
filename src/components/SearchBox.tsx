
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Message, TriageCategory, TriageLevel } from "@/types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onDataLoaded?: (messages: Message[]) => void;
}

export function SearchBox({ value, onChange, onDataLoaded }: SearchBoxProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        console.log("CSV content sample:", text.substring(0, 200)); // Log sample of CSV
        const messages = parseCSV(text);
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

  // Parse CSV into Message objects
  const parseCSV = (csvText: string): Message[] => {
    // Split into lines and extract headers
    const lines = csvText.split('\n');
    if (lines.length <= 1) {
      throw new Error("CSV file is empty or contains only headers");
    }

    // Try to detect the delimiter
    const firstLine = lines[0];
    let delimiter = ',';
    const possibleDelimiters = [',', ';', '\t', '|'];
    const delimiterCounts = possibleDelimiters.map(d => 
      firstLine.split(d).length - 1
    );
    const maxIndex = delimiterCounts.indexOf(Math.max(...delimiterCounts));
    if (maxIndex >= 0 && delimiterCounts[maxIndex] > 0) {
      delimiter = possibleDelimiters[maxIndex];
    }
    
    console.log("Detected delimiter:", delimiter);

    const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
    console.log("Detected headers:", headers);
    
    // Check if required columns exist
    const requiredColumns = ['message_id', 'subject', 'message', 'datetime'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Find column indices
    const idIndex = headers.indexOf('message_id');
    const subjectIndex = headers.indexOf('subject');
    const messageIndex = headers.indexOf('message');
    const datetimeIndex = headers.indexOf('datetime');

    // Parse each line into a Message object
    const messages: Message[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') continue;
      
      try {
        // Handle commas inside quoted fields
        const values: string[] = [];
        let currentValue = '';
        let insideQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === delimiter && !insideQuotes) {
            values.push(currentValue);
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue); // Add the last value
        
        // If not enough fields, pad with empty strings
        while (values.length < headers.length) {
          values.push('');
        }
        
        // Simple triage algorithm based on keywords
        // In a real app, this would be replaced with actual LLM classification
        const content = values[messageIndex]?.trim() || '';
        const subject = values[subjectIndex]?.trim() || 'No Subject';
        
        let triageLevel: TriageLevel = "Low";
        let triageCategory: TriageCategory = "Other";
        
        // Very basic keyword-based urgency detection
        if (/urgent|emergency|immediate|severe|critical|chest pain|difficulty breath/i.test(content + subject)) {
          triageLevel = "Urgent";
        } else if (/important|soon|high|abnormal|worsening/i.test(content + subject)) {
          triageLevel = "High";
        } else if (/follow[ -]?up|medication|refill|results/i.test(content + subject)) {
          triageLevel = "Medium";
        }
        
        // Basic category detection
        if (/pain|symptom|fever|sick|ill|infection|condition|health concern/i.test(content + subject)) {
          triageCategory = "Clinical";
        } else if (/medication|prescription|refill|drug|dose/i.test(content + subject)) {
          triageCategory = "Medication";
        } else if (/appointment|schedule|reschedule|cancel|availability/i.test(content + subject)) {
          triageCategory = "Administrative";
        } else if (/lab|test|result|blood|urine|sample|specimen/i.test(content + subject)) {
          triageCategory = "Lab Result";
        } else if (/follow[ -]?up|check[ -]?up|visit/i.test(content + subject)) {
          triageCategory = "Follow-up";
        } else if (/insurance|coverage|payment|bill|cost/i.test(content + subject)) {
          triageCategory = "Insurance";
        } else if (/referral|specialist|consult/i.test(content + subject)) {
          triageCategory = "Referral";
        }
        
        const message: Message = {
          id: values[idIndex]?.trim() || `csv-${i}`,
          subject: subject,
          content: content,
          datetime: values[datetimeIndex]?.trim() || new Date().toISOString(),
          triage_category: triageCategory,
          triage_level: triageLevel
        };
        
        messages.push(message);
      } catch (err) {
        console.warn(`Error parsing line ${i}:`, err);
        // Continue with next line instead of failing the whole import
      }
    }
    
    return messages;
  };

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
      </div>
      
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>Error parsing CSV</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
