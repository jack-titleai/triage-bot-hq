
# Healthcare Message Triage Schema

This document outlines the triage classification schema used in the Healthcare Inbox Triage System.

## Triage Categories

Messages are categorized by their content type:

| Category | Description | Examples |
|----------|-------------|----------|
| Clinical | Medical symptoms or clinical concerns | Pain, fever, new symptoms, worsening conditions |
| Medication | Medication-related inquiries | Refill requests, side effects, dosage questions |
| Administrative | Non-clinical administrative matters | Appointment scheduling, general inquiries |
| Lab Result | Questions about laboratory results | Abnormal values, test result inquiries |
| Follow-up | Post-visit or procedure follow-up | Post-surgery questions, treatment follow-up |
| Insurance | Insurance-related inquiries | Coverage questions, prior authorizations |
| Referral | Requests for specialist referrals | New specialist requests, referral status |
| Other | Messages that don't fit other categories | General feedback, miscellaneous |

## Triage Levels

Messages are prioritized based on urgency:

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| Urgent | Critical issues requiring immediate attention | <1 hour | Severe pain, medication reactions, concerning symptoms like chest pain |
| High | Important issues requiring prompt attention | 1-4 hours | Abnormal test results, significant symptoms, medication issues with near-term impact |
| Medium | Standard issues requiring timely response | Same day | Medication refills needed within days, non-urgent symptoms, follow-ups |
| Low | Routine matters | 1-2 business days | General questions, appointment scheduling, records requests |

## Classification Process

The classification process involves:

1. **Message Receipt**: System ingests messages from the CSV file
2. **LLM Analysis**: The LLM processes the message content to identify:
   - Key clinical terms
   - Urgency indicators
   - Patient needs
3. **Category Assignment**: Based on content analysis, a primary category is assigned
4. **Urgency Determination**: Based on several factors:
   - Presence of urgent clinical terms (e.g., "severe pain," "chest pain")
   - Timeframe mentions (e.g., "started 30 minutes ago")
   - Medication status (e.g., "ran out of medication")
   - Lab value abnormalities
5. **Triage Level Assignment**: Final urgency level is assigned

## LLM Prompt Design

The LLM is prompted to analyze each message with specific instructions:

1. Identify the primary purpose of the message
2. Recognize any clinical symptoms and their severity
3. Detect timeframe indicators
4. Assess immediate risk factors
5. Categorize the message into one of the defined categories
6. Assign an appropriate urgency level based on clinical content

## Rationale for Schema Design

This schema is designed to:

1. **Prioritize Patient Safety**: Urgent clinical matters receive immediate attention
2. **Support Clinical Workflow**: Categories align with typical healthcare team roles
3. **Enable Efficient Triage**: Clear distinctions between urgency levels
4. **Balance Workload**: Spread messages across different response timeframes
5. **Enhance Patient Care**: Ensure time-sensitive issues are handled appropriately

## Implementation Benefits

- **Reduced Response Time**: Critical messages are identified quickly
- **Improved Resource Allocation**: Staff can focus on high-priority messages
- **Consistent Handling**: Standardized approach to message classification
- **Workload Management**: Better distribution of message handling across time
- **Data Collection**: Analytics on message volumes by category and urgency

The schema is designed to be intuitive for healthcare providers while ensuring patient safety remains the top priority.
