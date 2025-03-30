
import { Message } from "@/types";
import { classifyMessageWithLLM, classifyMessageWithRules, hasLLMApiKey } from "@/services/llmService";

/**
 * Parses a CSV file into an array of Message objects
 */
export const parseCSV = async (csvText: string, toast: any): Promise<Message[]> => {
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

  // Check for LLM API key and determine classification method
  const hasKey = hasLLMApiKey();
  
  if (hasKey) {
    console.log("✅ Valid OpenAI API key found - Using LLM for message classification");
    toast({
      title: "Using AI classification",
      description: "Processing all messages with OpenAI for accurate triage",
    });
  } else {
    console.log("⚠️ No valid OpenAI API key - Using rule-based classification");
    toast({
      title: "Using rule-based classification",
      description: "Set up an OpenAI API key to enable AI-based message classification",
    });
  }

  // Parse each line into a Message object
  const messages: Message[] = [];
  
  // Track progress for large files
  const totalLines = lines.length - 1;
  let processedLines = 0;
  let lastProgressUpdate = 0;
  
  // Tracking for classification methods
  let llmClassificationsCount = 0;
  let ruleClassificationsCount = 0;
  
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
      
      const content = values[messageIndex]?.trim() || '';
      const subject = values[subjectIndex]?.trim() || 'No Subject';
      
      // Classify message with LLM when API key is available, otherwise use rule-based
      let classification;
      
      if (hasKey) {
        try {
          console.log(`Classifying message ${processedLines + 1} using LLM`);
          classification = await classifyMessageWithLLM(subject, content);
          llmClassificationsCount++;
        } catch (error) {
          console.error("LLM classification failed, falling back to rules:", error);
          classification = classifyMessageWithRules(subject, content);
          ruleClassificationsCount++;
        }
      } else {
        console.log(`Using rule-based classification for message ${processedLines + 1}`);
        classification = classifyMessageWithRules(subject, content);
        ruleClassificationsCount++;
      }
      
      const message: Message = {
        id: values[idIndex]?.trim() || `csv-${i}`,
        subject: subject,
        content: content,
        datetime: values[datetimeIndex]?.trim() || new Date().toISOString(),
        triage_category: classification.triage_category,
        triage_level: classification.triage_level
      };
      
      messages.push(message);
      
      // Update progress for large files
      processedLines++;
      const progress = Math.floor((processedLines / totalLines) * 100);
      if (progress >= lastProgressUpdate + 10) {
        lastProgressUpdate = progress;
        console.log(`Processing: ${progress}% complete (${processedLines}/${totalLines})`);
      }
    } catch (err) {
      console.error(`Error parsing line ${i}:`, err);
      // Continue with next line instead of failing the whole import
    }
  }
  
  console.log(`Classification complete: ${llmClassificationsCount} messages via LLM, ${ruleClassificationsCount} via rules`);
  
  if (hasKey && llmClassificationsCount === 0) {
    console.error("⚠️ No messages were classified using LLM despite having an API key!");
    toast({
      title: "LLM classification issue",
      description: "Failed to use LLM for classification. Check console for details.",
      variant: "destructive"
    });
  }
  
  return messages;
};
