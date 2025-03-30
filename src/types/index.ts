
export interface Message {
  id: string;
  subject: string;
  content: string;
  datetime: string;
  triage_category: TriageCategory;
  triage_level: TriageLevel;
  expanded?: boolean;
}

export type TriageCategory = 
  | "Clinical"
  | "Medication"
  | "Administrative"
  | "Lab Result"
  | "Follow-up"
  | "Insurance"
  | "Referral"
  | "Other";

export type TriageLevel = 
  | "Urgent"
  | "High"
  | "Medium"
  | "Low";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface FilterState {
  dateRange: DateRange;
  triageLevel: TriageLevel | "All";
  triageCategory: TriageCategory | "All";
  searchQuery: string;
}
