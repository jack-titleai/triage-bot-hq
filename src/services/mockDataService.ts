
import { Message, TriageCategory, TriageLevel } from "@/types";

// Sample messages that would normally come from a CSV file
const mockMessages: Message[] = [
  {
    id: "1",
    subject: "Chest Pain and Shortness of Breath",
    content: "Patient called complaining of severe chest pain radiating to left arm with shortness of breath starting 30 minutes ago. States pain is 8/10. Has history of hypertension.",
    datetime: "2023-05-15T08:23:45",
    triage_category: "Clinical",
    triage_level: "Urgent"
  },
  {
    id: "2",
    subject: "Medication Refill Request",
    content: "I need a refill of my lisinopril 10mg. I have 3 days of medication left. I've been taking it as prescribed with no side effects.",
    datetime: "2023-05-15T09:45:22",
    triage_category: "Medication",
    triage_level: "Medium"
  },
  {
    id: "3",
    subject: "Appointment Reschedule Request",
    content: "I need to reschedule my annual physical scheduled for May 20th. I'm available any day the following week in the morning.",
    datetime: "2023-05-15T10:12:05",
    triage_category: "Administrative",
    triage_level: "Low"
  },
  {
    id: "4",
    subject: "Abnormal Lab Results",
    content: "My patient portal shows abnormal results for my recent blood work. My potassium is 5.9 mEq/L which is flagged as high. Should I be concerned?",
    datetime: "2023-05-15T11:34:18",
    triage_category: "Lab Result",
    triage_level: "High"
  },
  {
    id: "5",
    subject: "Severe Allergic Reaction",
    content: "I started the new antibiotic this morning and now have a rash all over my body and my face is swelling. I took Benadryl but it's not helping.",
    datetime: "2023-05-15T13:02:56",
    triage_category: "Clinical",
    triage_level: "Urgent"
  },
  {
    id: "6",
    subject: "Insurance Coverage Question",
    content: "I received a bill for my last visit indicating my insurance didn't cover the full amount. Can someone from billing please contact me to discuss payment options?",
    datetime: "2023-05-15T14:23:11",
    triage_category: "Insurance",
    triage_level: "Low"
  },
  {
    id: "7",
    subject: "Specialist Referral Request",
    content: "I'd like to request a referral to a dermatologist for a suspicious mole on my back that has changed in appearance over the last month.",
    datetime: "2023-05-15T15:45:02",
    triage_category: "Referral",
    triage_level: "Medium"
  },
  {
    id: "8",
    subject: "Worsening Diabetes Symptoms",
    content: "My blood glucose readings have been over 300 for the past three days despite taking my insulin as prescribed. I'm feeling very fatigued and thirsty.",
    datetime: "2023-05-16T09:12:34",
    triage_category: "Clinical",
    triage_level: "High"
  },
  {
    id: "9",
    subject: "Follow-up Question After Surgery",
    content: "I had my appendectomy last week. The incision site is now red and warm to the touch, and I noticed some yellow drainage this morning. Is this normal?",
    datetime: "2023-05-16T10:24:15",
    triage_category: "Follow-up",
    triage_level: "High"
  },
  {
    id: "10",
    subject: "Medication Side Effect",
    content: "I started taking the metformin two days ago and have been experiencing severe diarrhea. Should I continue taking it or stop?",
    datetime: "2023-05-16T11:35:27",
    triage_category: "Medication",
    triage_level: "Medium"
  },
  {
    id: "11",
    subject: "Medical Records Request",
    content: "I need a copy of my medical records for the past year for an appointment with a specialist. Can you please send them to me?",
    datetime: "2023-05-16T13:47:39",
    triage_category: "Administrative",
    triage_level: "Low"
  },
  {
    id: "12",
    subject: "Severe Migraine Not Responding to Medication",
    content: "I've had a migraine for 3 days straight. My prescription medication isn't working, and I'm experiencing visual disturbances and nausea. I can't keep food down.",
    datetime: "2023-05-16T15:28:51",
    triage_category: "Clinical",
    triage_level: "Urgent"
  },
  {
    id: "13",
    subject: "Insurance Prior Authorization",
    content: "My pharmacy says they need prior authorization for my Humira prescription. Can you please submit the necessary paperwork to my insurance?",
    datetime: "2023-05-17T08:59:03",
    triage_category: "Insurance",
    triage_level: "Medium"
  },
  {
    id: "14",
    subject: "Vaccination Records",
    content: "I need my vaccination records for my new job. Specifically, they're asking for proof of COVID-19, Tdap, and MMR vaccinations.",
    datetime: "2023-05-17T10:10:15",
    triage_category: "Administrative",
    triage_level: "Low"
  },
  {
    id: "15",
    subject: "Concerning Lab Values",
    content: "My INR result from yesterday is 4.8. I'm taking warfarin 5mg daily as prescribed. Should I adjust my dose?",
    datetime: "2023-05-17T11:21:27",
    triage_category: "Lab Result",
    triage_level: "Urgent"
  }
];

// Function to get all messages
export const getAllMessages = async (): Promise<Message[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockMessages];
};

// Function to get filtered messages
export const getFilteredMessages = async (
  dateRange: { from?: Date; to?: Date },
  triageLevel: TriageLevel | "All",
  triageCategory: TriageCategory | "All",
  searchQuery: string = ""
): Promise<Message[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockMessages.filter(message => {
    const messageDate = new Date(message.datetime);
    const matchesDateRange = 
      (!dateRange.from || messageDate >= dateRange.from) && 
      (!dateRange.to || messageDate <= dateRange.to);
    
    const matchesTriageLevel = triageLevel === "All" || message.triage_level === triageLevel;
    const matchesTriageCategory = triageCategory === "All" || message.triage_category === triageCategory;
    
    const matchesSearch = searchQuery === "" || 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      message.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDateRange && matchesTriageLevel && matchesTriageCategory && matchesSearch;
  });
};

// Function to get count of messages by triage level
export const getMessageCountByTriageLevel = async (): Promise<Record<TriageLevel, number>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const counts: Record<TriageLevel, number> = {
    Urgent: 0,
    High: 0,
    Medium: 0,
    Low: 0
  };
  
  mockMessages.forEach(message => {
    counts[message.triage_level]++;
  });
  
  return counts;
};

// Function to get count of messages by category
export const getMessageCountByCategory = async (): Promise<Record<TriageCategory, number>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const counts: Record<string, number> = {};
  
  mockMessages.forEach(message => {
    if (!counts[message.triage_category]) {
      counts[message.triage_category] = 0;
    }
    counts[message.triage_category]++;
  });
  
  return counts as Record<TriageCategory, number>;
};
