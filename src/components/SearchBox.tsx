
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Message, TriageCategory, TriageLevel } from "@/types";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onDataLoaded?: (messages: Message[]) => void;
}

export function SearchBox({ value, onChange, onDataLoaded }: SearchBoxProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

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
        const messages = parseCSV(text);
        if (onDataLoaded) {
          onDataLoaded(messages);
        }
        toast({
          title: "CSV loaded successfully",
          description: `Loaded ${messages.length} messages`,
        });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error parsing CSV",
          description: "The CSV format is invalid or missing required columns",
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

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Check if required columns exist
    const requiredColumns = ['message_id', 'subject', 'message', 'datetime'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Parse each line into a Message object
    return lines.slice(1)
      .filter(line => line.trim() !== '')
      .map((line, index) => {
        // Handle commas inside quoted fields
        const values: string[] = [];
        let currentValue = '';
        let insideQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue);
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue); // Add the last value
        
        // Find column indices
        const idIndex = headers.indexOf('message_id');
        const subjectIndex = headers.indexOf('subject');
        const messageIndex = headers.indexOf('message');
        const datetimeIndex = headers.indexOf('datetime');
        
        // Simple triage algorithm based on keywords
        // In a real app, this would be replaced with actual LLM classification
        const content = values[messageIndex].trim();
        const subject = values[subjectIndex].trim();
        
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
        
        return {
          id: values[idIndex].trim() || `csv-${index + 1}`,
          subject: subject || "No Subject",
          content: content || "No Content",
          datetime: values[datetimeIndex].trim() || new Date().toISOString(),
          triage_category: triageCategory,
          triage_level: triageLevel
        };
      });
  };

  return (
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
          Upload CSV
        </Button>
      </div>
    </div>
  );
}
