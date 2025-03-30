
# Healthcare Inbox Triage System

A comprehensive message triage system for healthcare providers to efficiently manage and prioritize patient communications.

## Overview

This application helps healthcare providers by:

- Automatically classifying incoming messages based on urgency and type
- Providing a clean, intuitive dashboard for viewing and managing messages
- Offering filtering and search capabilities to quickly find relevant messages
- Displaying analytics to understand message patterns and volumes

## Structure

```
├── inbox_triage/               # Python package
│   ├── __init__.py             # Package initialization
│   ├── classifier/             # LLM message classification
│   │   ├── __init__.py
│   │   ├── model.py            # LLM integration 
│   │   └── schema.py           # Triage schema definition
│   ├── data/                   # Data handling
│   │   ├── __init__.py
│   │   ├── database.py         # Database operations
│   │   ├── loader.py           # CSV import functionality
│   │   └── sample_data.csv     # Sample data for testing
│   ├── webapp/                 # Web application
│   │   ├── __init__.py
│   │   ├── app.py              # Flask/FastAPI web app
│   │   ├── routes.py           # API routes
│   │   └── static/             # Dashboard frontend assets
│   └── cli.py                  # Command-line interface
├── pyproject.toml              # Project dependencies/metadata
├── triage_description.md       # Documentation of triage schema
├── README.md                   # Project documentation
└── tests/                      # Test suite
    ├── __init__.py
    ├── test_classifier.py
    └── test_data.py
```

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/healthcare-inbox-triage.git
cd healthcare-inbox-triage

# Install the package
pip install -e .
```

## Usage

### Command-line Interface

```bash
# Process a CSV file
inbox-triage process path/to/messages.csv

# Start the web dashboard
inbox-triage dashboard
```

### Web Dashboard

After starting the dashboard, navigate to http://localhost:5000 in your browser.

## Setting up LLM Credentials

This application uses an LLM for message classification. You'll need to obtain API credentials:

1. Register for an API key from OpenAI at https://openai.com
2. Set up your API key as an environment variable:

```bash
# Linux/Mac
export OPENAI_API_KEY="your-api-key"

# Windows
set OPENAI_API_KEY="your-api-key"
```

Alternatively, create a .env file in the project root:

```
OPENAI_API_KEY=your-api-key
```

## Development

```bash
# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest
```

## License

MIT
