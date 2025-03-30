
# Healthcare Inbox Triage System

A comprehensive message triage system for healthcare providers to efficiently manage and prioritize patient communications.

## Overview

This application helps healthcare providers by:

- Automatically classifying incoming messages based on urgency and type
- Providing a clean, intuitive dashboard for viewing and managing messages
- Offering filtering and search capabilities to quickly find relevant messages
- Displaying analytics to understand message patterns and volumes

## Project Structure

```
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── ui/                   # UI components from shadcn/ui
│   │   ├── DashboardStats.tsx    # Dashboard statistics
│   │   ├── MessageCard.tsx       # Message display component
│   │   ├── MessageList.tsx       # List of messages
│   │   ├── SearchBox.tsx         # Search functionality
│   │   ├── TileCounter.tsx       # Count displays
│   │   ├── TriageBadge.tsx       # Triage level indicator
│   │   ├── CategoryBadge.tsx     # Message category indicator
│   │   └── PieChart.tsx          # Chart visualization
│   ├── pages/                    # Application pages
│   ├── services/                 # Data services
│   │   └── mockDataService.ts    # Mock data provider
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # Main type definitions
│   ├── lib/                      # Utility functions
│   └── App.tsx                   # Main application component
├── public/                       # Static assets
└── index.html                    # HTML entry point
```

## Features

- **Message Triage**: Messages are classified by urgency (Urgent, High, Medium, Low) and category (Clinical, Medication, etc.)
- **Interactive Dashboard**: Visual overview of message distribution
- **Advanced Filtering**: Filter by date range, triage level, and category
- **Search Functionality**: Quickly find messages with text search
- **Responsive Design**: Works on desktop and mobile devices

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/healthcare-inbox-triage.git
cd healthcare-inbox-triage

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

After starting the development server, navigate to http://localhost:8080 in your browser.

### Dashboard

The main dashboard shows an overview of all messages, with filtering options and statistics.

### Message Management

- Click on a message to expand and view its full content
- Use the search box to find specific messages
- Filter messages by date range, urgency level, or category

## Development

```bash
# Run tests
npm test

# Build for production
npm run build
```

## Triage Classification System

The system uses the following classification scheme:

### Triage Levels:
- **Urgent**: Requires immediate attention (within hours)
- **High**: Should be addressed within 24 hours
- **Medium**: Should be addressed within 2-3 days
- **Low**: Can be addressed within a week

### Message Categories:
- **Clinical**: Related to symptoms, conditions, or health concerns
- **Medication**: Prescription refills, medication questions
- **Administrative**: Scheduling, general inquiries
- **Lab Result**: Lab test results or questions
- **Follow-up**: Post-appointment follow-up
- **Insurance**: Coverage questions or issues
- **Referral**: Specialist referral requests
- **Other**: Messages that don't fit other categories

For more details, see the [triage description](./triage_description.md).

## License

MIT
