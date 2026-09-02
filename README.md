# BusinessIntelligence.ai

[Visit (Biai) BusinessIntelligence.ai](https://biai-dqw9.vercel.app)
> **AI-powered KPI intelligence and business storytelling platform**

BusinessIntelligence.ai (Biai) transforms business data into meaningful insights, identifies important KPI movements, connects evidence across multiple data sources, highlights possible contributing factors, and recommends actionable next steps.

The platform is designed to answer:

> **What happened in my business, why might it have happened, and what should I do next?**

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [Supported Data Sources](#-supported-data-sources)
- [How It Works](#-how-it-works)
- [System Architecture](#-system-architecture)
- [Application Workflow](#-application-workflow)
- [Data Analysis Pipeline](#-data-analysis-pipeline)
- [AI Analysis](#-ai-analysis)
- [Evidence-Based Reasoning](#-evidence-based-reasoning)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Installation](#-installation)
- [Local Development](#-local-development)
- [Deployment](#-deployment)
- [Security](#-security)
- [Testing](#-testing)
- [Limitations](#-limitations)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

# 🚀 Overview

BusinessIntelligence.ai (Biai) bridges the gap between traditional dashboards and AI-powered decision support.

Traditional BI tools are excellent at displaying revenue, sales, customers, marketing performance, website metrics, inventory, and KPIs. However, users often still need to manually determine:

- What changed?
- Which change matters?
- What factors may be associated with the change?
- Are multiple data sources telling the same story?
- What should the business investigate or do next?

BusinessIntelligence.ai (Biai) combines deterministic data analysis with LLM-based reasoning:

```text
Business Data
      ↓
Data Processing
      ↓
KPI Analysis
      ↓
Evidence Generation
      ↓
Cross-Source Analysis
      ↓
AI Business Story
      ↓
Recommended Actions
```

---

# 🎯 Problem Statement

Businesses generate large amounts of data across different systems:

```text
Sales
Customers
Marketing
Products
Web Analytics
Inventory
```

These datasets often exist independently.

For example, a decrease in revenue could potentially be associated with:

- lower customer activity,
- declining website conversion,
- poor marketing performance,
- product availability problems,
- regional performance changes,
- or changes in product demand.

Traditional dashboards can display these metrics separately, but connecting them into a coherent business explanation often requires manual analysis.

BusinessIntelligence.ai aims to automate this process while keeping insights grounded in available evidence.

---

# 💡 Solution

The platform uses a two-stage intelligence process.

## Stage 1 — Dataset-Level Intelligence

Each uploaded dataset is independently analyzed.

```text
CSV
 ↓
Validation
 ↓
Cleaning
 ↓
KPI Calculation
 ↓
Aggregations
 ↓
Evidence
 ↓
Charts
```

## Stage 2 — Cross-Source Intelligence

After datasets are analyzed, the generated evidence is provided to an LLM.

```text
Sales Evidence
Customers Evidence
Marketing Evidence
Products Evidence
Web Analytics Evidence
Inventory Evidence
          ↓
          AI
          ↓
Cross-Source Business Story
```

This allows the system to identify relationships and supporting evidence across different business functions.

---

# 🎯 Objectives

1. Detect meaningful KPI movements.
2. Prioritize important business changes.
3. Analyze multiple business datasets independently.
4. Generate structured evidence from raw data.
5. Reconcile information across heterogeneous data sources.
6. Identify possible contributing factors.
7. Distinguish facts from hypotheses.
8. Avoid unsupported causal claims.
9. Generate actionable recommendations.
10. Communicate uncertainty and missing information explicitly.

---

# ✨ Key Features

### 📊 Multi-Source Business Intelligence

Supports six independent data categories:

- Sales
- Customers
- Products
- Marketing
- Web Analytics
- Inventory

### 📁 Independent Data Upload

Users can upload each data source independently.

The application tracks:

```text
X / 6 Data Sources Connected
```

### 🔍 Dataset-Level Analysis

Every connected dataset has its own Analyze action and produces:

- KPIs
- Aggregations
- Performance breakdowns
- Critical points
- Evidence
- Visualizations

### 📈 Interactive Visualizations

Dataset-specific charts are generated for regions, products, campaigns, customers, channels, inventory, and conversion metrics.

### 🤖 AI Business Analysis

The Analyze All with AI workflow combines analyzed evidence across connected sources and produces a business-level interpretation.

### 🎯 Evidence-Based Recommendations

Recommendations are tied to available evidence rather than generated as unsupported generic advice.

### ⚠️ Uncertainty Handling

The system explicitly identifies insufficient evidence, missing data, and relationships that cannot be established confidently.

### 🗂️ Project Management

Users can:

- Create projects
- View projects
- Open individual projects
- Delete projects

---

# 📚 Supported Data Sources

## 1. Sales

Example columns:

```text
date
order_id
customer_id
product_id
region
sales_channel
quantity
unit_price
discount
revenue
order_status
```

Example KPIs:

- Total revenue
- Quantity sold
- Average order value
- Regional revenue
- Product revenue
- Sales-channel performance

---

## 2. Customers

Example columns:

```text
customer_id
customer_segment
region
customer_type
acquisition_date
previous_revenue
current_revenue
```

Example KPIs:

- Total customers
- Previous revenue
- Current revenue
- Revenue change
- Customer segments
- Regional customer performance
- Returning customers

---

## 3. Products

Example information:

```text
product_id
product_name
category
price
cost
margin
inventory
```

Example KPIs:

- Product count
- Average price
- Average margin
- Low-stock products
- Product performance
- Inventory availability
- Top-performing products

---

## 4. Marketing

Example columns:

```text
date
campaign
region
spend
impressions
clicks
conversions
conversion_rate
```

Example KPIs:

- Total spend
- Impressions
- Clicks
- Conversions
- CTR
- Conversion rate
- Cost per conversion
- Campaign performance
- Regional performance

---

## 5. Web Analytics

Example columns:

```text
date
region
visitors
product_views
add_to_cart
orders
conversion_rate
error_rate
```

Example KPIs:

- Visitors
- Product views
- Add-to-cart events
- Orders
- Visitor conversion rate
- View-to-cart rate
- Cart-to-order rate
- Error rate
- Regional performance

---

## 6. Inventory

Example information:

```text
product_id
product_name
stock
stockout_hours
delay
```

Example KPIs:

- Total stock
- Low-stock products
- Stockout products
- Stockout hours
- Average delay
- Product-level stock availability

---

# 🔄 How It Works

```text
             User
              │
              ▼
       Create a Project
              │
              ▼
      Upload Business Data
              │
              ▼
   ┌─────────────────────────┐
   │ Select Data Source      │
   │                         │
   │ Sales                   │
   │ Customers               │
   │ Products                │
   │ Marketing               │
   │ Web Analytics           │
   │ Inventory               │
   └────────────┬────────────┘
                │
                ▼
        Analyze Dataset
                │
                ▼
       KPI + Evidence
                │
                ▼
          Visualization
                │
                ▼
       Analyze All with AI
                │
                ▼
      Cross-Source Analysis
                │
                ▼
        Business Story
                │
                ▼
       Recommendations
```

---

# 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │      Next.js Frontend   │
                    │                         │
                    │ • Authentication        │
                    │ • Projects              │
                    │ • Data Upload           │
                    │ • KPI Dashboard         │
                    │ • Charts                │
                    │ • AI Results            │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │      FastAPI Backend    │
                    │                         │
                    │ • CSV Processing        │
                    │ • Validation            │
                    │ • Pandas Analysis       │
                    │ • KPI Calculation       │
                    │ • Evidence Generation   │
                    │ • AI Orchestration      │
                    └──────────┬───────┬──────┘
                               │       │
                    ┌──────────┘       └─────────────┐
                    ▼                                ▼
          ┌─────────────────┐               ┌─────────────────┐
          │    Supabase     │               │  Hugging Face   │
          │                 │               │                 │
          │ PostgreSQL      │               │ Qwen LLM        │
          │ Authentication  │               │                 │
          │ Projects        │               │ AI Analysis     │
          └─────────────────┘               └─────────────────┘
```

---

# 🔬 Data Analysis Pipeline

The backend uses Pandas and NumPy:

```text
CSV File
   ↓
Read CSV
   ↓
Validate Columns
   ↓
Clean Column Names
   ↓
Convert Numeric Fields
   ↓
Calculate KPIs
   ↓
Aggregate Data
   ↓
Identify Important Movements
   ↓
Generate Evidence
```

The frontend uses the returned analysis to display dataset-specific KPIs and visualizations.

---

# 🤖 AI Analysis

The AI layer receives **structured evidence**, not the complete raw CSV files.

```text
Raw Data
   ↓
Pandas
   ↓
Structured Evidence
   ↓
LLM
   ↓
Business Interpretation
```

This creates a separation between:

**Deterministic computation**

and

**AI reasoning**

The user can analyze datasets individually and then select:

```text
Analyze All with AI
```

The backend combines evidence from the analyzed sources and sends it to the LLM.

---

# 🧾 AI Output

The AI analysis is designed around sections such as:

- Executive Summary
- Business Health
- Key KPIs
- What Changed
- Cross-Source Insights
- Likely Root Causes
- Risks
- Opportunities
- Recommendations
- Data Gaps
- Uncertainty

Example structure:

```json
{
  "executive_summary": "...",
  "business_health": {
    "status": "AT_RISK",
    "reason": "..."
  },
  "key_kpis": [],
  "what_changed": [],
  "cross_source_insights": [],
  "likely_root_causes": [],
  "risks": [],
  "opportunities": [],
  "recommendations": [],
  "data_gaps": [],
  "uncertainty": []
}
```

---

# ⚠️ Evidence-Based Reasoning

A key principle is:

> **Correlation does not automatically mean causation.**

If:

```text
Revenue ↓
Marketing conversions ↓
```

the system should not automatically conclude:

```text
Marketing caused revenue to decrease.
```

Instead:

```text
Marketing conversions decreased during the same period
as revenue. The available evidence suggests an association,
but it is insufficient to establish causation.
```

This helps prevent unsupported AI conclusions.

---

# 🧠 AI Guardrails

The AI analysis follows these principles:

1. **Use available evidence only.**
2. **Do not invent facts, metrics, or causes.**
3. **Separate observed facts from hypotheses.**
4. **Do not treat correlation as causation.**
5. **State when evidence is insufficient.**
6. **Tie recommendations to supporting evidence.**
7. **Highlight missing datasets and data gaps.**
8. **Avoid unsupported MoM, WoW, or YoY claims.**
9. **Identify contradictions between data sources where possible.**
10. **Use confidence to communicate evidence strength.**

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js | Web application framework |
| React | UI components |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Recharts | Data visualization |

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend language |
| FastAPI | REST API |
| Pandas | Data processing |
| NumPy | Numerical calculations |

## Database

| Technology | Purpose |
|---|---|
| Supabase | Backend platform |
| PostgreSQL | Database |
| Supabase Auth | Authentication |

## AI

| Technology | Purpose |
|---|---|
| Hugging Face Inference Providers | LLM inference |
| Qwen | Business reasoning and storytelling |

## Deployment

| Technology | Purpose |
|---|---|
| GitHub | Source control |
| Vercel | Deployment |

---

# 📂 Project Structure

A simplified structure:

```text
Biai/
│
├── app/
│   ├── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   └── ...
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── QuantitativeDataUpload.tsx
│   ├── AnalyzeData.tsx
│   └── ...
│
├── lib/
│   └── supabase/
│       └── client.ts
│
├── public/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── package.json
├── next.config.ts
├── tsconfig.json
├── .gitignore
└── README.md
```

---

# 🔌 API Endpoints

## `POST /analyze`

Analyzes an individual CSV dataset.

### Request

Multipart form data:

```text
file
data_type
```

Supported data types:

```text
sales
customers
products
marketing
web_analytics
inventory
```

### Response

```json
{
  "success": true,
  "filename": "sales.csv",
  "data_type": "sales",
  "rows": 1000,
  "columns": [],
  "analysis": {}
}
```

---

## `POST /analyze-all`

Performs cross-source AI analysis.

### Request

Structured evidence from analyzed datasets:

```json
{
  "sales": {},
  "customers": {},
  "marketing": {},
  "web_analytics": {}
}
```

### Response

Returns the generated AI business analysis.

---

# 🔑 Environment Variables

## Frontend

Create:

```text
.env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url
```

## Backend

Create:

```text
backend/.env
```

```env
HF_TOKEN=your_huggingface_token
```

---

# 🔐 Security

Never commit:

```text
.env
.env.local
backend/.env
```

to GitHub.

Recommended `.gitignore`:

```gitignore
node_modules/
.next/
out/

backend/venv/
backend/__pycache__/
__pycache__/
*.pyc

.env
.env.local
backend/.env

.vscode/
.idea/
```

The Hugging Face token must remain on the backend and must never be exposed to the browser.

---

# 💻 Installation

## Clone the Repository

```bash
git clone https://github.com/hirdeshm/Biai.git
cd Biai
```

## Install Frontend Dependencies

```bash
npm install
```

## Setup Python Backend

```bash
python -m venv backend/venv
```

### Windows

```bash
backendenv\Scriptsctivate
```

### Linux / macOS

```bash
source backend/venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

---

# ▶️ Local Development

## Start Next.js

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Start FastAPI

From the project root:

```bash
uvicorn backend.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 🔗 Frontend → Backend Communication

During local development:

```text
Next.js
http://localhost:3000
       │
       ▼
FastAPI
http://127.0.0.1:8000
```

The frontend uses:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Example:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

fetch(`${API_URL}/analyze`, {
  method: "POST",
  body: formData
});
```

---

# 🚀 Deployment

The recommended production setup is to deploy the frontend and backend separately.

```text
GitHub Repository
       │
       ├───────────────┐
       ▼               ▼
 Vercel Frontend   Vercel Backend
       │               │
    Next.js          FastAPI
       │               │
       └───────┬───────┘
               │
        Hugging Face
```

## Frontend

Deploy the Next.js application through Vercel.

Configure:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=https://your-backend-url
```

## Backend

Deploy the FastAPI application separately.

After deployment, the backend will have a URL similar to:

```text
https://your-backend.vercel.app
```

Set this URL as:

```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

---

# 🌍 CORS

The FastAPI backend should allow requests from the deployed frontend.

Example:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Replace the production URL with the actual frontend URL.

---

# 🧪 Testing

Recommended application test flow:

```text
1. Register / Login
        ↓
2. Create Project
        ↓
3. Upload Sales CSV
        ↓
4. Analyze Sales
        ↓
5. Verify KPIs and Charts
        ↓
6. Upload Marketing CSV
        ↓
7. Analyze Marketing
        ↓
8. Upload Web Analytics CSV
        ↓
9. Analyze Web Analytics
        ↓
10. Analyze All with AI
        ↓
11. Review Business Story
        ↓
12. Review Recommendations
```

---

# 📋 Data Validation

Each dataset is checked for required fields before analysis.

For example, Marketing requires:

```text
spend
impressions
clicks
conversions
```

Web Analytics requires:

```text
visitors
product_views
add_to_cart
orders
```

If required information is missing, the backend returns an error instead of producing unreliable analysis.

---

# 📌 Example Business Scenario

Suppose the platform finds:

### Sales

```text
Revenue decreased.
```

### Marketing

```text
Conversions decreased.
```

### Web Analytics

```text
Website conversion rate decreased.
```

### Inventory

```text
Several products experienced stockouts.
```

The AI may produce:

```text
Revenue performance has weakened alongside lower website
conversion and marketing conversions. Inventory data also
shows product availability constraints.

The available evidence supports an association between
these factors and the revenue decline, but it is not
sufficient to establish a single causal driver.
```

Possible actions:

```text
1. Investigate stockouts for high-revenue products.
2. Review website conversion funnel performance.
3. Evaluate campaigns with declining conversion efficiency.
4. Compare affected regions and products.
```

---

# 🧭 Design Principles

## Evidence First

Insights should be grounded in measurable data.

## Facts vs Hypotheses

Observed data should be distinguished from possible explanations.

## No Automatic Causality

Correlated movements should not automatically be presented as causal relationships.

## Explicit Uncertainty

When evidence is insufficient, the system should communicate that limitation.

## Cross-Source Reasoning

Multiple datasets should be considered together when they provide relevant evidence.

## Actionable Intelligence

The final result should help users decide what to investigate or do next.

---

# ⚠️ Limitations

BusinessIntelligence.ai is currently a Proof of Concept.

### Data Quality

Analysis quality depends on the quality and completeness of uploaded data.

### Causal Inference

The system does not automatically establish true causal relationships.

### Historical Comparisons

Meaningful time-based comparisons require appropriate date and period information.

### Dataset Availability

Missing datasets can limit the ability to explain a business movement.

### LLM Limitations

AI-generated interpretations can still contain errors and should be reviewed by business users.

### File-Based Data

The current workflow primarily uses uploaded CSV files rather than live enterprise data connections.

---

# 🔮 Future Improvements

## Data Integration

- Google Analytics
- Shopify
- Salesforce
- HubSpot
- Stripe
- SQL databases
- ERP systems
- CRM systems
- Advertising platforms

## Advanced Analytics

- Automatic anomaly detection
- Time-series analysis
- Forecasting
- Seasonality detection
- Trend detection
- Statistical significance testing
- Causal inference

## AI Improvements

- Natural-language querying
- Conversational BI
- AI-generated dashboards
- Automated executive reports
- Explainable AI reasoning
- Evidence graphs
- Confidence scoring
- Automated follow-up questions

## Notifications

Future versions could provide alerts such as:

```text
Revenue dropped significantly in Region A.
```

or:

```text
Inventory stockouts may be affecting high-revenue products.
```

## Enterprise Features

- Role-based access control
- Organization management
- Team workspaces
- Audit logs
- Data governance
- Advanced permissions
- Enterprise connectors

---

# 🤝 Contributing

Contributions are welcome.

## Create a Feature Branch

```bash
git checkout -b feature/your-feature
```

## Make Changes

Implement the feature or bug fix.

## Commit

```bash
git add .
git commit -m "Add your feature"
```

## Push

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

When reporting issues, include:

- Description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment
- Relevant logs

Never include API keys, passwords, authentication tokens, or other secrets in issues or pull requests.

---

# 📜 License

This project is intended to be released as an open-source project.

The repository should include an appropriate open-source license such as:

```text
MIT License
```

The exact license should be confirmed in the repository before production release.

---

# 🌟 Project Vision

BusinessIntelligence.ai aims to move business intelligence from:

```text
Dashboards
    ↓
Charts
    ↓
Manual Interpretation
```

towards:

```text
Business Data
      ↓
KPI Intelligence
      ↓
Evidence
      ↓
Cross-Source Reasoning
      ↓
Business Story
      ↓
Recommended Action
```

The ultimate goal is to help organizations spend less time interpreting fragmented business data and more time making informed decisions.

---

# 👨‍💻 Built With

```text
Next.js
React
TypeScript
Tailwind CSS
FastAPI
Python
Pandas
NumPy
Supabase
PostgreSQL
Hugging Face
Qwen
Vercel
GitHub
```

---

## 📫 BusinessIntelligence.ai

**Data → Intelligence → Evidence → Action**
