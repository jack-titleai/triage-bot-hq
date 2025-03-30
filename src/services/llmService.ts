
import { Message, TriageCategory, TriageLevel } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Interface for the LLM service response
interface LLMClassificationResponse {
  triage_level: TriageLevel;
  triage_category: TriageCategory;
  confidence: number;
}

// Store API key in localStorage with this key
const API_KEY_STORAGE_KEY = "healthcare-triage-llm-api-key";

// Get the API key from localStorage
export const getLLMApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

// Save the API key to localStorage
export const saveLLMApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

// Clear the API key from localStorage
export const clearLLMApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

// Check if API key exists
export const hasLLMApiKey = (): boolean => {
  return !!getLLMApiKey();
};

/**
 * Classify a message using an LLM
 * This function uses the OpenAI API to classify messages
 */
export const classifyMessageWithLLM = async (
  subject: string,
  content: string
): Promise<LLMClassificationResponse> => {
  const apiKey = getLLMApiKey();
  
  if (!apiKey) {
    throw new Error("API key not found. Please set your API key.");
  }

  try {
    // Construct the prompt for the LLM
    const prompt = `
You are a medical message classifier for a healthcare provider's inbox system.
You need to classify the following message based on its content and urgency.

Subject: ${subject}
Message: ${content}

Based on the message content, classify it into:

1. Triage Level (choose exactly one):
- "Urgent": Critical issues requiring immediate attention (<1 hour)
- "High": Important issues requiring prompt attention (1-4 hours)
- "Medium": Standard issues requiring timely response (same day)
- "Low": Routine matters (1-2 business days)

2. Category (choose exactly one):
- "Clinical": Medical symptoms or clinical concerns
- "Medication": Medication-related inquiries
- "Administrative": Non-clinical administrative matters
- "Lab Result": Questions about laboratory results
- "Follow-up": Post-visit or procedure follow-up
- "Insurance": Insurance-related inquiries
- "Referral": Requests for specialist referrals
- "Other": Messages that don't fit other categories

Return your classification in this format:
{
  "triage_level": "Urgent/High/Medium/Low",
  "triage_category": "Clinical/Medication/Administrative/Lab Result/Follow-up/Insurance/Referral/Other",
  "confidence": 0.95
}
`;

    // Call the OpenAI API
    console.log("Calling OpenAI API for classification");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using a cheaper model for classification
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2, // Lower temperature for more consistent results
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("LLM API error:", error);
      throw new Error(`API error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    console.log("LLM response:", data);

    // Parse the response content
    try {
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        
        // Validate the response format
        if (!parsedResponse.triage_level || !parsedResponse.triage_category) {
          throw new Error("Invalid LLM response format");
        }
        
        return {
          triage_level: parsedResponse.triage_level as TriageLevel,
          triage_category: parsedResponse.triage_category as TriageCategory,
          confidence: parsedResponse.confidence || 0.7,
        };
      } else {
        throw new Error("Could not extract JSON from LLM response");
      }
    } catch (error) {
      console.error("Error parsing LLM response:", error);
      throw new Error("Failed to parse LLM response");
    }
  } catch (error) {
    console.error("Error classifying message with LLM:", error);
    throw error;
  }
};

// Fallback classification when LLM is not available or fails
export const classifyMessageWithRules = (
  subject: string,
  content: string
): LLMClassificationResponse => {
  const combinedText = subject + " " + content;
  let triageLevel: TriageLevel = "Low";
  let triageCategory: TriageCategory = "Other";
  
  // Basic keyword-based urgency detection
  if (/urgent|emergency|immediate|severe|critical|chest pain|difficulty breath/i.test(combinedText)) {
    triageLevel = "Urgent";
  } else if (/important|soon|high|abnormal|worsening/i.test(combinedText)) {
    triageLevel = "High";
  } else if (/follow[ -]?up|medication|refill|results/i.test(combinedText)) {
    triageLevel = "Medium";
  }
  
  // Basic category detection
  if (/pain|symptom|fever|sick|ill|infection|condition|health concern/i.test(combinedText)) {
    triageCategory = "Clinical";
  } else if (/medication|prescription|refill|drug|dose/i.test(combinedText)) {
    triageCategory = "Medication";
  } else if (/appointment|schedule|reschedule|cancel|availability/i.test(combinedText)) {
    triageCategory = "Administrative";
  } else if (/lab|test|result|blood|urine|sample|specimen/i.test(combinedText)) {
    triageCategory = "Lab Result";
  } else if (/follow[ -]?up|check[ -]?up|visit/i.test(combinedText)) {
    triageCategory = "Follow-up";
  } else if (/insurance|coverage|payment|bill|cost/i.test(combinedText)) {
    triageCategory = "Insurance";
  } else if (/referral|specialist|consult/i.test(combinedText)) {
    triageCategory = "Referral";
  }
  
  return {
    triage_level: triageLevel,
    triage_category: triageCategory,
    confidence: 0.6, // Lower confidence for rule-based classification
  };
};
