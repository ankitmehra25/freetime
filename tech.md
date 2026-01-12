# Technology Stack Decisions & Execution Rationale  
*(Post-Architecture Formalization)*

## Context

After formalizing the target architecture for a metadata-driven, multi-tenant, enterprise SaaS platform (Salesforce-style), we intentionally paused to decide **how to translate architecture into execution** without introducing early technical debt.

This document captures **the concrete steps and decisions** taken to select the initial technology stack and the **order of execution**, along with the rationale behind each decision.

---

## Guiding Execution Principles

Once the architecture was agreed upon, the following execution principles were locked:

1. **Architecture First, Tools Second**  
   Tools must serve the architecture, not shape it.

2. **UI-First Proof of Platform Behavior**  
   Prove metadata-driven behavior before building backend systems.

3. **Explicit Over Implicit**  
   Tenant, identity, and configuration must always be explicit, never inferred.


---

## Step 1: Decide the UI Execution Strategy

### Decision
Start with **UI-first execution**, deferring backend, persistence, and workflows.

### Rationale
- The core differentiation of the platform is **metadata-driven behavior**, not data storage.
- UI is the fastest way to demonstrate:
  - tenant isolation
  - dynamic schemas
  - configurability
- Backend-first execution would slow validation of core assumptions.


---

## Step 2: Choose the Frontend Framework

### Options Considered
- Plain React (Vite / CRA)
- Next.js

### Decision
**Next.js (App Router, React 18)**

### Rationale
- Next.js is a **runtime framework**, not just a UI library.
- App Router provides:
  - layout boundaries
  - route isolation
  - future auth and SSR hooks
- Enables clean evolution toward:
  - enterprise auth
  - public/private route separation
  - performance optimizations
- Avoids inevitable future migration from plain React to Next.js.

### Constraints Applied
- Client-side rendering only (initially)
- No server components
- No API routes
- Next.js used strictly as an application shell

---

## Step 3: Lock the Language Choice

### Decision
**TypeScript (mandatory)**

### Rationale
- The platform is **schema-driven**, not component-driven.
- TypeScript enforces:
  - metadata correctness
  - rule consistency
  - safe extensibility
- Acts as living documentation for:
  - entity schemas
  - validation rules
  - visibility conditions

This is critical for a platform that expects schema evolution.

---

## Step 4: Explicit Identity Before Authentication

### Decision
Introduce an **IdentityContext**, without implementing authentication.

### Rationale
- Authentication providers are interchangeable; identity semantics are not.
- Early auth integration would:
  - slow execution
  - obscure platform logic
- Explicit identity allows:
  - tenant context
  - role context
  - locale context
  to be modeled cleanly from Day 1.

### Implementation Choice
- Identity selected via UI
- Temporarily stored in session storage
- Injected via React Context

This design is intentionally compatible with future OIDC / PingIdentity integration.

---

## Step 5: Model Multi-Tenancy at the Metadata Layer

### Decision
Tenant-specific metadata schemas from the start.

### Rationale
- True multi-tenancy is about **configuration isolation**, not deployment.
- Prevents:
  - feature flag sprawl
  - tenant conditionals in UI
- Same codebase, different behavior per tenant.

### Outcome
All schemas are:
- tenant-scoped
- loaded via a registry
- never globally shared

---

## Step 6: Choose Metadata Storage for Early Phases

### Decision
**Static JSON files** for metadata (POC phase).

### Rationale
- Makes schemas:
  - visible
  - auditable
  - versionable
- Avoids premature database design.
- Forces clean schema contracts.
- Easily replaceable later with:
  - database
  - schema registry
  - admin UI

This is a deliberate **temporary storage**, not a permanent choice.

---

## Step 7: Introduce a Metadata Registry Abstraction

### Decision
Access metadata only through a **registry layer**, not direct imports.

### Rationale
- Centralizes:
  - tenant isolation
  - entity lookup
  - version control (future)
- Prevents UI components from coupling to storage format.
- Enables future:
  - impact analysis
  - compatibility checks
  - sandbox previews

---

## Step 8: Build a Generic Schema-Driven Renderer

### Decision
Single generic renderer: **Schema → UI**

### Rationale
- UI must not know business entities.
- Renderer understands only:
  - attribute types
  - labels
  - rules
- Enables:
  - dynamic entities
  - marketplace components
  - admin-defined models

This is the core platform capability being proven.

---

## Step 9: Add Declarative Rules Before Workflows

### Decision
Introduce **declarative validation and visibility rules** before workflows.

### Rationale
- Rules are foundational:
  - required fields
  - conditional visibility
- Workflows depend on stable rule evaluation.
- Declarative rules allow:
  - explainability
  - auditability
  - safe evolution

Rules are treated as **data**, not code.

---

## Step 10: Explicitly Defer Certain Technologies

The following were intentionally **not** introduced early:

| Technology | Reason |
|----------|-------|
Backend APIs | UI behavior must be validated first |
Databases | Schema correctness before persistence |
Redux / global state | Context + local state sufficient |
Workflow engine | Depends on stable rule layer |
GraphQL | No query complexity yet |
Design system | Visual polish is not the risk |

This restraint reduces rework and keeps execution focused.

---

## Summary

The tech stack was not chosen as a static list, but as the **result of a sequence of architectural decisions**. Each technology was selected only after validating:

- architectural alignment
- future evolution path
- enterprise readiness
- avoidance of premature complexity

This approach ensures that early POCs are both **fundable and production-safe**.

---
