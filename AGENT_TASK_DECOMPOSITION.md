Metadata-Driven CRM Platform
Canonical Agent Work Breakdown & Execution Plan

Status: Derived from frozen ARCHITECTURE.md
Audience: AI Agents, Co-Pilots, Automation Runtimes
Rule: No agent may violate architectural invariants

0. Global Agent Instructions (READ FIRST)

All agents MUST obey:

Backward compatibility is sacred

Metadata over code

Control Plane ≠ Runtime Plane

UI is a pure renderer

Everything is versioned

No hidden logic

Deterministic execution only

If an agent cannot complete a task without breaking these, it must stop and escalate.

1. Agent Taxonomy (Roles)

Agents are specialized. No agent owns everything.

1.1 Architecture Guardian Agent

Responsibility

Enforce invariants

Review outputs of other agents

Reject unsafe shortcuts

1.2 Control Plane Agent

Responsibility

Metadata authoring systems

Versioning

Governance

Admin UI

1.3 Runtime Engine Agent

Responsibility

Deterministic execution

Rules, validation, workflow engines

Draft persistence

1.4 UX Renderer Agent

Responsibility

Pure rendering

Event emission

Accessibility & localization

MLDV component usage

1.5 Persistence & Data Agent

Responsibility

Storage models

Indexing

JSONB strategies

Migration safety

1.6 Security & Compliance Agent

Responsibility

RBAC / ABAC

Field-level security

Audit & encryption

1.7 Integration & Eventing Agent

Responsibility

APIs

Kafka / Webhooks

Data exports

1.8 AI Enablement Agent

Responsibility

AI-readability

Schema introspection

Prompt safety

Agent APIs

2. Phase-Wise Agent Task Decomposition
🟦 PHASE 1 — FOUNDATIONAL PLATFORM (Months 0–6)
2.1 Control Plane – Metadata Foundation
Tasks

Design Schema Registry data model

Implement Schema versioning rules

Implement immutable publish lifecycle

Build Metadata Registry API

Enforce compatibility checks (add-only, aliasing)

Deliverables

SchemaRegistryService

Versioned schema storage

Compatibility validator

2.2 Control Plane – Admin UI (MVP)
Tasks

Entity designer UI

Attribute editor

Version draft / publish workflow

Preview sandbox (read-only runtime)

Constraints

No runtime data writes

No business logic execution

2.3 Runtime – Entity CRUD Engine
Tasks

Version-aware entity creation

Package version stamping

Tenant context enforcement

Deterministic CRUD APIs

Deliverables

EntityRuntimeService

Version resolver

2.4 Persistence – Core Storage
Tasks

PostgreSQL schema with tenant isolation

JSONB attribute storage

Adaptive indexing strategy

Draft storage tables

2.5 Draft Engine (Critical)
Tasks

Draft lifecycle model

Autosave semantics

Resume on reload

Version pinning

Deliverables

DraftService

Draft cleanup policies

🟩 PHASE 2 — RULES, VALIDATION & WORKFLOWS (Months 6–12)
2.6 Rule Engine Agent
Tasks

Define Rule DSL (CEL-like)

Implement rule parser

Implement evaluation engine

Support rule scopes

Deterministic execution guarantees

Deliverables

RuleEngine

Rule AST model

Dependency graph builder

2.7 Validation Engine Agent
Tasks

Declarative validation definitions

Soft vs hard validation

Cross-field validation

Async validation hooks

Aggregated error reporting

2.8 Workflow & Orchestration Agent
Tasks

Multi-step workflows

Approval chains

Timers & SLAs

Version-pinned workflow execution

2.9 Admin UI – Rules & Workflow Builder
Tasks

Rule authoring DSL UI

Workflow visual builder

Simulation & preview

Safe publish gates

🟨 PHASE 3 — UX RENDERING & LOCALIZATION (Months 12–18)
2.10 UX Renderer Agent
Tasks

Pure renderer contract

Component registry (MLDV)

Event emission framework

UI effect applier

Constraints

Zero business logic

No validation logic

2.11 Localization Agent
Tasks

Locale packs

Picklist localization

RTL support

Validation message localization

2.12 Role-Based Presentation
Tasks

Role-aware UI metadata

Conditional visibility via rules

Accessibility compliance

🟧 PHASE 4 — SECURITY, MULTI-TENANCY & COMPLIANCE (Months 18–30)
2.13 Security Agent
Tasks

OAuth2 / OIDC integration

RBAC engine

ABAC policy evaluator

Field-level masking

2.14 Compliance Agent
Tasks

Audit log design

Tamper-evident chaining

Exportable compliance reports

DSR workflows

2.15 Multi-Tenant Isolation Agent
Tasks

Shared tenancy enforcement

Partitioned tenancy option

Dedicated cluster provisioning

Tenant-scoped KMS keys

🟥 PHASE 5 — INTEGRATIONS, ANALYTICS & AI (Months 30–48)
2.16 Integration Agent
Tasks

OpenAPI definitions

GraphQL schema

Webhook framework

Kafka event streams

Retry & DLQ

2.17 Analytics Agent
Tasks

Reporting engine

Saved queries

Data marts per tenant

Export to BI tools

2.18 AI Enablement Agent
Tasks

Metadata introspection APIs

Schema explanation endpoints

Rule explanation engine

AI-safe mutation APIs

3. Cross-Cutting Agent Responsibilities
3.1 Observability Agent

Metrics per tenant

Rule execution latency

Workflow bottlenecks

Cost attribution

3.2 FinOps Agent

Cost per tenant

Scaling policies

Storage optimization

3.3 Migration Agent

Version migration tools

Alias resolution

Backfill strategies

4. Agent Execution Rules

No agent modifies published metadata

No agent introduces implicit coupling

No agent bypasses version resolver

No agent writes UI logic into runtime

No agent writes business logic into UI

5. Definition of “Done” (For Agents)

A task is complete only if:

Deterministic

Version-safe

Tenant-safe

Auditable

AI-introspectable

6. How AI Agents Should Use This Document

Pick one role

Pick one phase

Pick one task

Generate code / design

Validate against ARCHITECTURE.md

Submit for guardian review

7. Final Instruction to Agents

Do not optimize for speed.
Optimize for survivability.

Backward compatibility > elegance
Determinism > cleverness
Governance > convenience
