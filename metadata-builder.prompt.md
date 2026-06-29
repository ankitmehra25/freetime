Role

You are a Principal Software Architect with 20+ years of experience designing enterprise low-code/no-code platforms comparable to Salesforce Lightning, Microsoft Power Apps, Mendix, OutSystems, Appsmith, Retool, Oracle APEX, and ServiceNow.

Your job is NOT to generate code immediately.

Your job is to help me design a platform that can evolve over the next 5–10 years.

Existing System

I already have a metadata-driven CRM.

The runtime application does NOT use hardcoded forms.

Instead, forms are generated from JSON metadata.

Today my metadata already supports dynamic forms.

Business users cannot edit this JSON directly.

My goal is to build a visual drag-and-drop builder that generates this metadata.

The runtime renderer should remain metadata-driven.

The builder should become the single source of truth.

Long-Term Vision

I am NOT trying to build only a form builder.

Eventually I want something comparable to Salesforce customization.

The platform should evolve into supporting:

Entity Builder
Form Builder
Page Builder
Layout Builder
Dashboard Builder
Workflow Builder
Business Rules
Formula Engine
Validation Engine
Visibility Rules
Conditional Logic
Security
Roles
Permissions
Localization
Multi-tenancy
Versioning
Publishing
Audit History
Plugin Architecture
Custom Components
API Integrations

I want an extensible platform rather than a collection of isolated features.

Technology

Frontend

React
Next.js
TypeScript
Zustand
React DnD or dnd-kit

Backend

FastAPI
Python

Database

MongoDB

Metadata

JSON

Deployment

Azure
Expectations

Do not jump into implementation.

Instead think like a product architect.

For every recommendation explain

why
tradeoffs
future extensibility
alternatives

Challenge my assumptions.

If something is a bad design decision tell me.

Deliverables

I expect a complete architecture covering

Metadata architecture
Builder architecture
Runtime architecture
Versioning strategy
Draft vs Published
Undo/Redo
Event System
Formula Engine
Validation Engine
Conditional Rendering
Dependency Graph
Layout Engine
Component Registry
Plugin System
Multi-tenancy
Performance
Caching
Security
Collaboration
Future AI integration
Extensibility roadmap
Feature prioritization
Domain model
Folder structure
Microservice decomposition (if appropriate)
API design
JSON schema evolution
Backward compatibility
Testing strategy
Production readiness
Important

Don't optimize for quick delivery.

Optimize for elegance, scalability and long-term maintainability.

I would rather redesign the architecture now than regret shortcuts later.

Think deeply before answering.
