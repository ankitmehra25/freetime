Metadata-Driven CRM Platform
Canonical Architecture, Technology, and Execution Blueprint

Status: Draft – Frozen for Execution
Audience: AI Agents, Architects, Engineers, Cloud Platforms, Security & Compliance
Intent: Single Source of Truth (SSOT)
Guarantee: Backward compatibility is a first-class invariant

0. Executive Freeze Statement (IMPORTANT)

This document freezes the architectural direction of the platform.

All AI agents, co-pilots, and human contributors must:

Treat this as authoritative

Not reinterpret core principles

Not collapse layers for convenience

Not optimize away versioning, safety, or governance

Deviation requires explicit architectural review.

1. Platform Vision

We are building a Salesforce-class, metadata-driven CRM platform that is:

Fully configurable at runtime

Tenant-isolated by design

Localized, governed, and auditable

Safe to evolve without breaking existing data

AI-operable (machines can reason about it deterministically)

What this platform is NOT

Not a form builder

Not a UI framework

Not a low-code toy

Not a CRUD app

What it IS

A metadata runtime

A configuration control plane

A deterministic execution engine

A business modeling platform

2. Foundational Invariants (Non-Negotiable)

These are laws, not guidelines.

2.1 Metadata Over Code

All customer variability is solved through:

Schema

Metadata

Rules

Configuration

Custom code is the last resort.

2.2 Immutability + Versioning

Published artifacts are immutable

Any change → new version

Every record stores the version that created it

Backward compatibility is structural, not best-effort.

2.3 UI Is a Pure Renderer

UI:

Renders components

Emits events

Applies effects

UI NEVER:

Contains business logic

Evaluates rules

Enforces validation

2.4 Deterministic Runtime

Given:

Package

Version

Input

The runtime must always produce the same output.

This is essential for:

AI reasoning

Auditing

Compliance

Replayability

3. Platform Decomposition

The platform is split into planes, not just services.

3.1 Control Plane

Responsible for:

Authoring

Validation

Governance

Versioning

Promotion

Never handles live data writes.

Components

Admin UI

Metadata Registry

Package Manager

Policy Engine

Preview & Sandbox

3.2 Runtime Plane

Responsible for:

Data capture

Rule execution

Workflow orchestration

Event emission

Persistence

Never mutates metadata.

3.3 Presentation Plane

Responsible for:

UX

Accessibility

Localization

Theming

Zero business knowledge.

4. Canonical Architecture Diagram
flowchart TB

subgraph ControlPlane["Control Plane"]
  A1[Admin UI]
  A2[Schema Designer]
  A3[Form & Workflow Builder]
  A4[Rule DSL Authoring]
  A5[Package Publisher]
  A6[Preview / Sandbox]
end

subgraph Registry["Metadata Registry"]
  M1[Schema Registry]
  M2[UI Metadata Registry]
  M3[Rules Registry]
  M4[Validation Registry]
  M5[Localization Packs]
  M6[Version Manager]
end

subgraph Runtime["Runtime Plane"]
  R1[Version Resolver]
  R2[Rule Engine]
  R3[Validation Engine]
  R4[Workflow Engine]
  R5[Draft Engine]
  R6[Calculation Engine]
  R7[Event Dispatcher]
end

subgraph UX["Presentation Plane"]
  U1[Pure Renderer]
  U2[Event Emitter]
  U3[Effect Applier]
end

ControlPlane --> Registry
Registry --> Runtime
Runtime --> UX

5. The Package Model (Atomic Unit of Reality)

Everything is deployed as a Package.

LeadLifecyclePackage@v1
├── schema.json
├── ui.json
├── rules.json
├── validations.json
├── workflow.json
├── events.json
├── localization/

Package Rules

Immutable once published

Versioned independently

Tenant-scoped or global

Referenced by records forever

6. Schema Layer (Data Contract)
Purpose

Defines what data exists.

Does NOT define

UI

Validation

Behavior

Visibility

Evolution Rules
Change	Allowed
Add field	✅
Remove field	❌
Rename field	❌ (alias only)
Change type	❌
Field Types

Text

Number

Currency

Boolean

Enum

Date / Time

Reference

File

Calculated

Object

Array

7. UI Metadata Layer
Purpose

Defines how data is presented.

Responsibilities

Step sequencing

Layout

Grouping

Review pages

Role-based presentation

Example
{
  "steps": [
    { "id": "personal", "fields": ["firstName", "phone"] },
    { "id": "company", "fields": ["company", "industry"] },
    { "id": "review", "mode": "summary" }
  ]
}

8. Rule Engine (Core Intelligence)
Rule Scopes

Global

Workflow

Step

Component

Field

Event Triggers

onLoad

onChange

onEnterStep

onExitStep

onSubmitAttempt

onValidate

onSave

Rule Capabilities

Conditional visibility

Calculations

Dependencies

Guards

Transitions

DSL Characteristics

Declarative

Side-effect free

Deterministic

CEL-like syntax

9. Validation Engine
Validation Modes

Soft (warnings)

Hard (blocking)

Validation Types

Required

Regex

Range

Cross-field

Async

Composite

Strategy

No blocking during entry

Full validation at submit

Aggregated error reporting

10. Workflow & Orchestration
Supported Concepts

Multi-step flows

Approval chains

SLAs

Escalations

Timers

Human-in-loop

Versioning

Workflow logic is versioned

Running instances are pinned to version

11. Draft Persistence (Critical UX Capability)
Why Drafts Exist

Prevent data loss

Support reloads

Enable long workflows

Draft Model
{
  "draftId": "...",
  "entity": "Lead",
  "packageVersion": "v1",
  "data": {},
  "lastStep": "company"
}

12. Multi-Tenant Architecture
Isolation Modes

Shared DB (Row-level tenancy)

Partitioned DB

Dedicated Cluster (Premium)

Tenant Context

Propagated end-to-end

Enforced at DB, API, Cache

Data Residency

Region-pinned tenants

Geo-fencing

Encryption domain per tenant

13. Localization & Internationalization
Supported

Labels per locale

Picklists per locale

RTL

Pluralization

Date / currency formats

Validation messages per language

14. Security & Governance
Identity

OAuth2 / OIDC

SSO

SCIM

Authorization

RBAC

ABAC

Field-level security

Data Protection

TLS 1.2+

AES-256 at rest

Tenant-scoped keys

KMS / HSM backed

Auditing

Tamper-evident logs

Configuration audit trail

Exportable compliance logs

15. Integration & APIs
API-First

OpenAPI

GraphQL

Eventing

Kafka / Event Grid

Webhooks

Retry + DLQ

Data Export

CSV / Parquet

BI connectors

Data lake integration

16. Observability & Ops
Metrics

Per tenant

Per workflow

Per rule

Tracing

End-to-end

Tenant-aware

SLOs

99.9% standard

99.95% premium

17. Technology Stack (Stability-First)
Frontend

React

TypeScript

Headless UI

Internal MLDV component library

Backend

Java 21 + Spring Boot

Deterministic execution

Strong typing

Persistence

PostgreSQL (JSONB)

Redis

Object Storage

Optional MongoDB for document workloads

Infra

Kubernetes

Blue/Green deploys

Feature flags

18. AI-Readiness (Explicit Design Goal)

This platform is designed for AI agents to:

Inspect metadata

Generate schemas

Write rules

Simulate workflows

Generate UI

Assist migration

Why AI Can Reason About This

No hidden logic

No implicit coupling

Deterministic contracts

Explicit schemas

19. Roadmap (4–5 Year Horizon)
Phase 1

Core entities

Metadata engine

Validation

Drafts

RBAC

Phase 2

Workflows

Sandboxes

Version promotion

Events

Phase 3

Advanced analytics

Marketplace

Configurable UI engine

Phase 4

AI-assisted modeling

Data quality intelligence

Data residency expansion

Phase 5

Agent-native CRM

Autonomous workflows

Industry vertical packs

20. Final Architectural Law

Backward compatibility is the backbone of this platform.

Everything else bends around this.
