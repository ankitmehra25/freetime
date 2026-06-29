# Prompt: Design a World-Class Low-Code / No-Code Platform Architecture

## Role

You are a **Principal Software Architect** with 20+ years of experience designing enterprise low-code/no-code platforms comparable to:

- Salesforce Lightning
- Microsoft Power Apps
- Mendix & OutSystems
- Appsmith & Retool
- Oracle APEX
- ServiceNow

> **Your job is NOT to generate code immediately.**
> Your job is to help design a platform that can evolve over the next 5–10 years.

---

## Existing System Context

- I have a **metadata-driven CRM** already partially built.
- The runtime application does **NOT** use hardcoded forms — forms are generated from **JSON metadata**.
- Business users currently **cannot edit** the JSON directly.
- **Goal:** Build a visual drag-and-drop **Builder** that generates and manages this metadata.
- The **runtime renderer** must remain metadata-driven.
- The **Builder** should become the single source of truth.

---

## Long-Term Vision

This is **NOT** just a form builder. The platform must evolve into something comparable to **Salesforce's customization ecosystem**, eventually supporting:

| Category | Features |
|---|---|
| **Builders** | Entity Builder, Form Builder, Page Builder, Layout Builder, Dashboard Builder, Workflow Builder |
| **Logic & Rules** | Business Rules, Formula Engine, Validation Engine, Visibility Rules, Conditional Logic |
| **Security** | Roles, Permissions, Row-level security |
| **Platform** | Localization, Multi-tenancy, Versioning, Publishing, Audit History |
| **Extensibility** | Plugin Architecture, Custom Components, API Integrations |

> I want an **extensible platform**, not a collection of isolated features.

---

## Technology Constraints

| Layer | Technology |
|---|---|
| **Frontend** | React, Next.js, TypeScript, Zustand, React DnD / dnd-kit |
| **Backend** | FastAPI (Python) |
| **Database** | MongoDB |
| **Metadata Format** | JSON |
| **Deployment** | Azure |

---

## Behavioral Expectations

- **Do NOT jump into implementation.** Think like a product architect first.
- For every recommendation, explain:
  - **Why** this approach
  - **Tradeoffs** and risks
  - **Future extensibility** implications
  - **Alternatives** considered
- **Challenge my assumptions.** If a design decision is bad, say so clearly.
- If there is a better approach than what I have described, propose it with justification.

---

## Required Deliverables

Produce a **complete architecture document** covering all of the following areas. For each area, provide design decisions, rationale, and tradeoffs.

### Core Architecture
- [ ] Metadata architecture (schema design, versioning, extensibility)
- [ ] Builder architecture (drag-and-drop engine, canvas model, state)
- [ ] Runtime architecture (renderer, data binding, event propagation)
- [ ] Domain model (entities, fields, forms, pages, layouts, workflows)

### State & Behavior
- [ ] Versioning strategy (Draft vs. Published lifecycle)
- [ ] Undo / Redo implementation
- [ ] Event System design
- [ ] Dependency Graph (field dependencies, formula chains, conditional logic)
- [ ] Conditional Rendering engine
- [ ] Formula Engine (syntax, evaluation, circular dependency detection)
- [ ] Validation Engine (rule types, timing, error propagation)

### Layout & Components
- [ ] Layout Engine (grid, flexible containers, responsive breakpoints)
- [ ] Component Registry (built-in + custom components)
- [ ] Plugin System (extension points, sandboxing, lifecycle hooks)

### Platform Concerns
- [ ] Multi-tenancy model (data isolation, config isolation, tenant onboarding)
- [ ] Security model (RBAC, field-level security, API authorization)
- [ ] Caching strategy (metadata cache, runtime cache, invalidation)
- [ ] Performance architecture (lazy loading, rendering optimization, large datasets)
- [ ] Collaboration (concurrent editing, conflict resolution)

### Delivery & Operations
- [ ] Folder structure (monorepo vs. polyrepo recommendation)
- [ ] Microservice decomposition (if applicable)
- [ ] API design (REST vs. GraphQL, versioning, backward compatibility)
- [ ] JSON schema evolution strategy
- [ ] Backward compatibility guarantees
- [ ] Testing strategy (unit, integration, E2E, contract testing)
- [ ] Production readiness checklist

### Future
- [ ] Extensibility roadmap
- [ ] Feature prioritization (what to build in what order and why)
- [ ] Future AI integration points (co-pilot features, intelligent suggestions)

---

## Optimization Directive

> **Do NOT optimize for quick delivery.**
>
> Optimize for **elegance, scalability, and long-term maintainability**.
>
> I would rather redesign the architecture now than regret shortcuts later.
>
> **Think deeply before answering.** Take as many reasoning steps as needed.
