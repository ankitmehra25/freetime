You are a Principal Staff Engineer, AI Architect, and Enterprise SaaS CRM expert.

You have expertise in:

- OpenAI Agents SDK
- OpenAI Responses API
- Tool Calling
- Structured Outputs
- Next.js App Router
- TypeScript
- Node.js
- Enterprise CRM systems
- Dynamics CRM
- Salesforce
- HubSpot
- Metadata-driven applications
- Event-driven architectures
- Multi-tenant SaaS
- Azure AI Search
- RAG
- PostgreSQL
- MongoDB
- Redis
- Semantic Search
- Vector Search
- Enterprise Security
- RBAC
- Audit Trails

Your task is NOT simply to add AI features.

Your task is to transform our existing CRM into an AI-first CRM platform.

=================================================

CURRENT APPLICATION

=================================================

Existing stack:

- Next.js App Router
- TypeScript
- Node.js
- REST APIs
- Metadata-driven CRM
- Dynamic Forms
- Multi-tenant
- Entity configuration
- Role-based security
- Dashboards
- Leads
- Contacts
- Opportunities
- Accounts
- Activities
- Reports
- Timeline
- Tasks
- Notes
- Email Integration
- Calendar Integration

We already have all CRUD functionality.

AI must integrate into existing architecture.

DO NOT rewrite the application.

DO NOT duplicate business logic.

Reuse existing APIs.

=================================================

ARCHITECTURE GOALS

=================================================

Use ONLY

- OpenAI SDK
- Responses API
- Tool Calling
- Structured Outputs

Avoid LangChain unless absolutely necessary.

Design for future migration to multi-agent architecture.

=================================================

DELIVERABLES

=================================================

Design a production-grade AI architecture including:

1. AI Service Layer

- SDK wrappers
- Model management
- Prompt management
- Tool registry
- Agent registry
- Response parsing
- Error handling
- Retries
- Rate limiting
- Logging
- Telemetry
- Token accounting

-------------------------------------------------

2. Agent Framework

Design reusable agents.

Examples:

CRM Assistant

Lead Agent

Contact Agent

Opportunity Agent

Sales Agent

Pipeline Agent

Reporting Agent

Forecast Agent

Email Agent

Meeting Agent

Reminder Agent

Task Agent

Document Agent

Knowledge Agent

Search Agent

Customer Timeline Agent

Analytics Agent

Admin Agent

Configuration Agent

Conversation Agent

Audit Agent

Recommendation Agent

-------------------------------------------------

3. Tool Framework

Each agent should use tools instead of prompts.

Design tool interfaces.

Examples:

searchLeads()

searchContacts()

searchAccounts()

searchOpportunities()

createLead()

updateLead()

deleteLead()

createOpportunity()

convertLead()

assignLead()

scheduleMeeting()

sendEmail()

generateQuote()

generateProposal()

createTask()

closeOpportunity()

fetchDashboard()

fetchRevenue()

runReport()

searchKnowledgeBase()

semanticSearch()

vectorSearch()

saveConversation()

loadConversation()

getCustomerTimeline()

searchActivities()

fetchAuditLogs()

-------------------------------------------------

4. Global AI Search

Design an intelligent search supporting:

Natural language

Examples:

"Show all leads from Delhi"

"Customers with premium > 50000"

"Accounts with no activity"

"Policies expiring next month"

"Show all meetings with John"

"Renewals pending"

"High-value opportunities"

Support

Keyword Search

Semantic Search

Hybrid Search

Entity Search

Cross-module Search

Saved Searches

Recent Searches

Autocomplete

Suggestions

Ranking

-------------------------------------------------

5. Activity Timeline Intelligence

Design an AI-powered customer timeline.

Include:

Calls

Emails

Meetings

Notes

Tasks

Status changes

Assignments

Field changes

Document uploads

Quotes

Payments

Claims

Policies

Opportunities

Lead conversions

The AI should answer questions like:

"What happened with this customer?"

"Summarize last 90 days."

"What is blocking this deal?"

"What should I do next?"

-------------------------------------------------

6. Conversational CRM

Users should be able to ask:

Create a lead.

Convert this lead.

Assign it to Rahul.

Schedule a meeting.

Email the customer.

Generate proposal.

Show overdue opportunities.

Summarize today's meetings.

Create follow-up task.

Update premium.

Close opportunity.

Everything should be executed using tool calling.

-------------------------------------------------

7. Dashboard AI

Every dashboard should expose an AI assistant.

Examples:

Sales Dashboard

Revenue Dashboard

Management Dashboard

Branch Dashboard

Operations Dashboard

Claims Dashboard

Marketing Dashboard

Support Dashboard

The assistant should answer:

Why is revenue down?

Top performing agents?

Largest opportunities?

Deals likely to close?

Reasons for losses?

Predict next month's revenue.

-------------------------------------------------

8. Lead Intelligence

Design AI capabilities:

Lead scoring

Lead qualification

Conversation summary

Sentiment

Next best action

Duplicate detection

Assignment recommendation

Auto follow-up

Risk detection

-------------------------------------------------

9. Opportunity Intelligence

Probability prediction

Win/Loss prediction

Missing information

Suggested next actions

Competitor insights

Proposal generation

Meeting preparation

Executive summary

-------------------------------------------------

10. Reporting Intelligence

Users should ask:

Build monthly report.

Compare branches.

Show conversion trends.

Forecast revenue.

Compare salespersons.

Generate executive summary.

Export report.

-------------------------------------------------

11. Prompt Library

Create reusable prompts.

System prompts

Task prompts

Entity prompts

Validation prompts

Summarization prompts

Classification prompts

Extraction prompts

Reasoning prompts

-------------------------------------------------

12. Memory

Maintain

Conversation memory

Recent searches

User preferences

Recent entities

Pinned entities

Favorite reports

Frequently used filters

-------------------------------------------------

13. Security

Respect

Tenant isolation

RBAC

Permissions

Data masking

Audit logging

Prompt injection protection

Tool authorization

Rate limiting

PII protection

-------------------------------------------------

14. APIs

Design REST endpoints

Request schemas

Response schemas

Streaming APIs

SSE

WebSockets

-------------------------------------------------

15. Folder Structure

Generate scalable project structure.

Separate:

agents

tools

prompts

schemas

models

services

api

controllers

middleware

telemetry

logging

security

memory

search

-------------------------------------------------

16. Database Design

Conversation storage

Prompt versions

Search history

Agent execution history

AI recommendations

User feedback

Token usage

Cost tracking

-------------------------------------------------

17. AI Execution Flow

Illustrate

User

↓

Intent Detection

↓

Agent Selection

↓

Tool Planning

↓

Tool Execution

↓

Reasoning

↓

Structured Response

↓

Streaming UI

-------------------------------------------------

18. UI

Design AI components.

Examples:

Global AI Search

AI Sidebar

Floating Assistant

Chat Panel

Inline Suggestions

Context Actions

Smart Forms

Timeline Summary

Dashboard Copilot

-------------------------------------------------

19. Enterprise Readiness

Caching

Observability

OpenTelemetry

Feature Flags

Circuit Breakers

Monitoring

Retry Policies

Health Checks

Versioning

Model Routing

Fallback Models

-------------------------------------------------

20. Future Roadmap

Show how architecture evolves toward:

OpenAI Agents SDK

Multi-Agent Systems

Planning Agents

Supervisor Agents

Human Approval

Workflow Automation

Long-running Tasks

Background Agents

Without requiring major architectural rewrites.

=================================================

IMPORTANT

=================================================

Think like the architects of Salesforce Einstein, Microsoft Copilot, and HubSpot AI.

Do NOT generate toy examples.

Design an enterprise-grade AI platform.

Every recommendation should be production-ready, scalable, extensible, testable, secure, and suitable for millions of CRM records.

Provide architecture diagrams, TypeScript interfaces, folder structures, implementation strategy, sequence diagrams, API contracts, and phased rollout plans.

Whenever possible, prefer OpenAI SDK primitives over custom abstractions.
