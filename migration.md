# Metadata CRM — NestJS Domain API + Worker Migration
## Architecture Implementation Prompt / Source of Truth

> **Purpose:** This document is the implementation prompt and architectural source of truth for creating the new backend repository for the Metadata CRM. It defines the target architecture, boundaries, domain APIs, authentication/authorization integration, multi-tenancy, metadata/configuration model, asynchronous workers, CSV lead ingestion, event-driven architecture, reliability requirements, and migration constraints.
>
> **Important:** Do not redesign the architecture while implementing it. Where a detail is explicitly marked as a decision, preserve it. Where a detail is marked as an open decision, document alternatives and do not silently choose a materially different architecture.

---

# 1. Objective

Create a new backend repository that separates the current Next.js application into:

1. **Next.js**
   - UI / presentation
   - BFF
   - browser-facing APIs
   - session/cookie handling
   - PingFederate integration at the web boundary

2. **NestJS**
   - CRM domain APIs
   - domain/application business logic
   - authorization enforcement
   - tenant resolution/enforcement
   - MongoDB access
   - metadata consumption
   - transactional operations
   - event/outbox production
   - orchestration of asynchronous jobs

3. **Worker runtime**
   - asynchronous, long-running, CPU/memory-intensive processing
   - large CSV lead ingestion
   - parsing, normalization, validation, deduplication and persistence
   - future large/batch workloads
   - must not block HTTP request processing

4. **Queue / Event infrastructure**
   - job dispatch for workers
   - event-driven integration with external systems
   - reliable event publication using an outbox pattern

The initial backend should be a **modular monolith**, not microservices. The domain should be modular internally so that individual modules/services can be extracted later if justified.

---

# 2. Target Architecture

```text
                                      ┌──────────────────────┐
                                      │       Browser        │
                                      └──────────┬───────────┘
                                                 │
                                    PingFederate / enterprise IdP
                                                 │
                                                 ▼
                                      ┌──────────────────────┐
                                      │       Next.js         │
                                      │     UI + BFF          │
                                      │                      │
                                      │ - Presentation       │
                                      │ - Session/cookie     │
                                      │ - BFF APIs           │
                                      │ - UI aggregation     │
                                      └──────────┬───────────┘
                                                 │
                                  authenticated trusted request
                                  + required PingFederate header
                                                 │
                                                 ▼
                                      ┌──────────────────────┐
                                      │      NestJS API       │
                                      │    CRM Domain API     │
                                      │                      │
                                      │ Lead                  │
                                      │ Contact               │
                                      │ Opportunity           │
                                      │ Quote                 │
                                      │ Application           │
                                      │ Metadata/Config       │
                                      │ Authorization         │
                                      │ Import orchestration  │
                                      │ Event/Outbox          │
                                      └──────────┬───────────┘
                                                 │
                              ┌──────────────────┼──────────────────┐
                              │                  │                  │
                              ▼                  ▼                  ▼
                       Tenant MongoDB       Blob Storage      Queue / Event Bus
                              │                  │                  │
                              │                  │                  ▼
                              │                  │             ┌───────────┐
                              │                  │             │  Workers  │
                              │                  │             └─────┬─────┘
                              │                  │                   │
                              │                  │                   ▼
                              │                  │              MongoDB
                              │                  │
                              │                  ▼
                              │             Versioned metadata
                              │
                              ▼
                           Outbox
                              │
                              ▼
                         Event Bus
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
             External     Integration   Other consumers
             systems        layer
```

---

# 3. Core Architectural Principles

## 3.1 Next.js is the BFF and presentation layer

Next.js should own:

- UI
- React/server components as appropriate
- presentation concerns
- browser-facing BFF endpoints
- session/cookie handling
- interaction with PingFederate at the web boundary
- frontend-specific response aggregation/transformation
- frontend-specific caching
- frontend navigation/rendering concerns

Next.js should **not** own CRM domain persistence or the authoritative CRM business logic after migration.

The browser should not directly access NestJS domain APIs unless explicitly approved as a future architecture.

The normal path is:

```text
Browser
  -> Next.js BFF
  -> NestJS Domain API
  -> MongoDB
```

---

# 4. NestJS Responsibility

NestJS is the authoritative CRM backend/domain boundary.

It owns:

- domain APIs
- domain/application services
- business rules
- domain validation
- authorization enforcement
- tenant isolation enforcement
- persistence
- transactional operations
- metadata consumption
- event/outbox creation
- asynchronous job creation/orchestration
- integration-facing backend operations where appropriate

NestJS should be implemented as a **modular monolith**.

Do not split Lead, Contact, Opportunity, Quote, Application etc. into separate deployable microservices at this stage.

Recommended logical modules:

```text
src/
  modules/
    lead/
    contact/
    opportunity/
    quote/
    application/
    import/
    metadata/
    authorization/
    tenant/
    events/
    outbox/
    health/
```

Exact folder naming can evolve, but ownership boundaries must remain explicit.

---

# 5. Worker Responsibility

Workers are a separate runtime from the NestJS HTTP API.

Workers must be used for workloads such as:

- large CSV ingestion
- CSV parsing
- chunking
- normalization
- bulk validation
- large-scale deduplication
- batch persistence
- large exports
- scheduled/batch processing
- external-system synchronization where processing is long-running
- future CPU/memory-intensive jobs

Do **not** execute a million-row import inside an HTTP request.

Do **not** keep an HTTP request open while a CSV is being processed.

The correct pattern is:

```text
Client
  -> POST import
  -> NestJS creates Import record
  -> file is stored in Blob Storage
  -> NestJS publishes/enqueues job
  -> HTTP returns Import ID + QUEUED status
  -> Worker processes asynchronously
```

---

# 6. Domain Model

The current CRM domain is:

```text
Lead
  |
  | conversion
  v
Contact
  |
  +---- Opportunity 1
  |
  +---- Opportunity 2
  |
  +---- Opportunity N

Opportunity
  |
  +---- exactly one Quote
              |
              | conversion
              v
          exactly one Application
```

Important current business semantics:

- A Lead can be converted into a Contact.
- A converted Lead results in a Contact.
- A Contact can have multiple Opportunities.
- Each Opportunity contains one Quote.
- A Quote can be converted into an Application.
- The Application ultimately represents the policy/application outcome.
- Lead information may initially be incomplete.
- Lead ingestion does not require all information needed for conversion.
- An agent is responsible for contacting/nurturing the Lead and collecting additional information.
- Lead conversion is an explicit business operation, not simply a database update.

---

# 7. Domain API Ownership

The following are examples of NestJS domain APIs.

## Lead

```http
GET    /api/v1/leads
GET    /api/v1/leads/:leadId
POST   /api/v1/leads
PATCH  /api/v1/leads/:leadId
DELETE /api/v1/leads/:leadId

POST   /api/v1/leads/:leadId/assign
POST   /api/v1/leads/:leadId/convert
```

## Contact

```http
GET    /api/v1/contacts
GET    /api/v1/contacts/:contactId
POST   /api/v1/contacts
PATCH  /api/v1/contacts/:contactId
```

## Opportunity

```http
GET    /api/v1/opportunities
GET    /api/v1/opportunities/:opportunityId
POST   /api/v1/opportunities
PATCH  /api/v1/opportunities/:opportunityId
```

## Quote

```http
GET    /api/v1/quotes/:quoteId
POST   /api/v1/opportunities/:opportunityId/quotes
PATCH  /api/v1/quotes/:quoteId
POST   /api/v1/quotes/:quoteId/convert
```

## Application

```http
GET    /api/v1/applications/:applicationId
PATCH  /api/v1/applications/:applicationId
```

These are examples, not permission to invent unrelated APIs. Follow existing CRM API contracts during migration wherever they already exist.

### Important

Do not separate APIs by HTTP verb such as:

```text
GET -> Next.js
POST -> NestJS
```

That is not an architectural boundary.

The boundary is:

```text
Next.js = web/BFF experience
NestJS = CRM domain
Worker = asynchronous processing
```

---

# 8. Next.js BFF API Pattern

The browser-facing API can remain in Next.js:

```text
Browser
  -> Next.js /api/...
  -> NestJS /api/v1/...
```

Example:

```text
Browser
  GET /api/leads/L123
       |
       v
Next.js BFF
       |
       v
NestJS
  GET /api/v1/leads/L123
```

The BFF may:

- validate the browser/session context
- resolve user context
- forward trusted identity/context headers
- aggregate backend responses
- shape data for the UI
- hide internal service topology
- provide frontend-specific endpoints
- avoid exposing NestJS directly to the browser

The BFF must not duplicate CRM business rules.

---

# 9. Authentication

## 9.1 Identity Provider

The enterprise identity provider is **PingFederate**.

Current web authentication uses a browser cookie/session mechanism and a trusted header injected by the enterprise edge/identity infrastructure.

The exact PingFederate mechanism must be preserved during migration unless explicitly redesigned.

## 9.2 Authentication flow

Expected web path:

```text
Browser
  |
  | authenticated request
  | cookie
  v
PingFederate / enterprise security layer
  |
  | trusted identity header
  v
Next.js BFF
  |
  | forward required trusted identity information
  v
NestJS
```

NestJS must not trust arbitrary client-supplied identity headers.

The backend must only accept identity information from a trusted network path / trusted proxy configuration.

Implement explicit trusted-proxy/network assumptions and document them.

---

# 10. Authorization

Authorization is different from authentication.

Authentication answers:

> Who is the user?

Authorization answers:

> What is this user allowed to do for this tenant/entity/record?

NestJS must be the authoritative authorization enforcement point for domain operations.

Examples:

```text
Can user read Lead?
Can user update Lead?
Can user assign Lead?
Can user convert Lead?
Can user read Contact?
Can user create Opportunity?
Can user modify Quote?
Can user convert Quote?
```

Next.js may perform authorization checks for:

- UI visibility
- early rejection
- reducing unnecessary backend calls
- hiding unauthorized actions

But Next.js is **not** the authoritative security boundary.

Every NestJS domain endpoint must enforce authorization.

Do not rely on:

```text
Next.js authorization only
```

because future consumers may include:

- mobile
- integration services
- batch jobs
- internal tools
- external systems

The domain backend must remain secure independently of the BFF.

---

# 11. Mobile Architecture

There is an existing mobile/BFF scenario.

The intended direction is:

```text
Mobile
  -> existing mobile BFF / API boundary
  -> NestJS Domain API
  -> MongoDB
```

Do not force mobile traffic through the web-oriented Next.js BFF if that creates an inappropriate coupling.

The NestJS backend is the shared CRM domain boundary.

Authentication/authorization for mobile must use the appropriate mobile identity mechanism while still enforcing the same domain authorization policies.

Do not weaken tenant isolation for mobile.

---

# 12. Multi-Tenancy

Multi-tenancy is a first-class architectural requirement.

Current model:

```text
Tenant A
  -> Tenant A database
      -> collections

Tenant B
  -> Tenant B database
      -> collections
```

Continue supporting tenant-isolated database/collection access as currently designed unless a separate migration explicitly changes the persistence topology.

Every request/job/event must have an explicit tenant context.

Minimum conceptual context:

```text
TenantContext
  tenantId
  userId / actorId
  roles / permissions as appropriate
  correlationId
  requestId / jobId
```

Never trust a tenant ID supplied arbitrarily by the browser.

Tenant identity must be derived from the authenticated/trusted context.

Every repository/database operation must execute within the correct tenant context.

Workers must carry tenant context explicitly in the job payload or trusted job metadata.

Example:

```json
{
  "jobId": "IMP-123",
  "tenantId": "TENANT-A",
  "type": "LEAD_IMPORT",
  "metadataVersion": "v17"
}
```

A worker must never process a job against the wrong tenant database.

---

# 13. Tenant Isolation Requirements

Implement safeguards at multiple levels:

1. Authentication/trusted identity
2. Tenant resolution
3. Authorization
4. Repository/database selection
5. Job payload
6. Event payload
7. Logging/observability

Never construct tenant database access from arbitrary request body values.

Avoid APIs such as:

```json
{
  "tenantId": "some-other-tenant"
}
```

being treated as authoritative.

Tenant context must be established server-side.

---

# 14. Metadata Architecture

Current state:

```text
Tenant DB
  -> metadata collection
```

Target direction:

```text
Versioned Metadata
      |
      v
Blob Storage / Configuration Store
      |
      v
Metadata retrieval/cache
      |
      +---- Next.js
      +---- NestJS
      +---- Workers
```

Metadata is configuration, not transactional CRM business data.

It drives:

- form structure
- field configuration
- validation
- visibility
- dependencies
- workflow flags
- tenant-specific behavior
- other configurable CRM behavior

The application/domain code remains responsible for business logic.

Do not move all business logic into metadata.

---

# 15. Metadata Versioning

Metadata must be versioned.

A job/request must be associated with the metadata version it used when required for deterministic processing.

Example:

```text
Tenant A
  Metadata v17
       |
       +-- Import IMP-123 starts

Metadata v18 published
       |
       +-- New requests use v18

Import IMP-123
       |
       +-- continues using v17
```

Do not allow a long-running job to unpredictably switch metadata versions halfway through processing.

---

# 16. Metadata Session Cache

The current architectural direction is:

> Fetch tenant configuration once at login/session initialization and cache it for the duration of the session.

However, implement this carefully.

There are two different caches:

### UI/session metadata cache

Used by Next.js/UI for fast rendering.

Lifecycle:

```text
Login
  -> fetch metadata
  -> cache
  -> use during session
  -> invalidate on logout/session expiry
```

### Backend metadata cache

NestJS/workers should have their own server-side cache because they are independent runtimes.

Do not assume Next.js in-memory session state is visible to NestJS.

Recommended principle:

```text
Authoritative source
        |
        v
Versioned metadata
        |
        +---- Next.js cache
        |
        +---- NestJS cache
        |
        +---- Worker cache
```

All caches must be safely invalidatable/reloadable when metadata versions change.

For long-running jobs, pin the metadata version in the job.

---

# 17. Metadata Cache Warning

Do not make "until logout" the only cache invalidation mechanism.

Administrators may publish new metadata while users are logged in.

Therefore support:

- versioning
- explicit invalidation
- TTL as a safety mechanism
- version-aware cache refresh
- session-level reuse where appropriate

The exact cache technology is an implementation decision.

Do not assume process-local memory is sufficient in a horizontally scaled NestJS deployment.

If multiple NestJS instances exist:

```text
NestJS-1 cache != NestJS-2 cache
```

unless a shared/distributed cache or version-aware retrieval strategy is used.

---

# 18. Existing Dependency Engine

The CRM currently has a dependency engine responsible for:

- validation
- visibility
- form behavior
- metadata-driven dependencies

Preserve this responsibility during migration.

The dependency engine should become a reusable domain/application component.

Do not duplicate its rules between:

```text
Next.js
NestJS
Worker
```

Prefer one canonical implementation that can be invoked by the relevant runtime.

For example:

```text
LeadApplicationService
       |
       v
DependencyEngine
       |
       v
TenantMetadata(version)
```

Workers must use equivalent domain validation where the imported data requires it.

---

# 19. Workflow Logic

Current workflow business logic is coded in the application.

Metadata contains flags that enable/disable workflow steps.

Preserve this separation:

```text
Code
  = workflow business rules

Metadata
  = tenant-specific configuration / feature flags / step enablement
```

Do not migrate workflow business logic wholesale into metadata.

NestJS should become the authoritative runtime for CRM domain workflows.

---

# 20. Lead Ingestion Sources

Leads may enter the CRM through:

1. Manual creation
2. CSV import
3. External systems
4. Contact/lead capture pages
5. Future integration sources

The minimum lead data from external sources may be insufficient for conversion.

This is expected.

The Lead domain must support:

```text
Lead created
  -> assigned
  -> contacted
  -> nurtured
  -> enriched
  -> qualified
  -> converted
```

Do not require full Contact/Opportunity information at initial Lead ingestion unless current business rules explicitly require it.

---

# 21. Canonical Lead ID

The CRM owns its internal canonical Lead ID.

External systems may provide their own lead identifier.

Store external identifiers as source-specific references, e.g.:

```text
leadId
sourceSystem
externalLeadId
```

Do not replace the CRM canonical identifier with an external system identifier.

This is important for:

- deduplication
- integrations
- idempotency
- event correlation
- reconciliation

---

# 22. Duplicate Lead Handling

Deduplication is a first-class requirement.

Do not assume that:

```text
externalLeadId
```

is sufficient for deduplication.

Depending on tenant configuration and available fields, deduplication may involve combinations such as:

```text
email
phone
externalLeadId
source
normalized identity fields
```

The exact matching rules must be configurable/tenant-aware where appropriate.

Deduplication must be deterministic and observable.

For large CSVs:

```text
CSV
  -> normalize
  -> derive dedup keys
  -> compare against existing records
  -> compare within current import
  -> classify
  -> persist
```

Possible outcomes:

```text
CREATED
DUPLICATE
REJECTED
UPDATED
```

The exact behavior must follow existing CRM business rules.

Do not silently overwrite existing leads unless the import contract explicitly allows it.

---

# 23. Large CSV Upload Architecture

A large CSV must **not** pass through Next.js or NestJS as one giant request body.

Recommended flow:

```text
Browser
   |
   | multipart upload / resumable upload as appropriate
   v
Blob Storage
   |
   | upload completed
   v
Next.js BFF
   |
   v
NestJS Import API
   |
   | create Import record
   | validate tenant/user
   | store file reference
   | enqueue job
   v
Queue
   |
   v
Worker
   |
   +-- stream CSV from Blob
   +-- parse
   +-- normalize
   +-- validate
   +-- deduplicate
   +-- batch
   +-- persist
   +-- update progress
   +-- emit events/outbox
```

Do not load the entire CSV into memory.

Use streaming/chunked processing.

---

# 24. Multipart Upload

The implementation must be designed for large files.

Prefer direct-to-Blob upload or a controlled upload flow where possible:

```text
Browser
  -> request upload session
  -> Next.js/NestJS returns signed upload information
  -> Browser uploads directly to Blob Storage
  -> notify upload completion
  -> create import job
```

Avoid:

```text
Browser
  -> Next.js
  -> NestJS
  -> Blob
```

for very large files if it unnecessarily doubles network traffic and memory/connection pressure.

The final design must ensure:

- authenticated upload
- tenant isolation
- file size limits
- allowed file type/content validation
- malware/security scanning where required by platform policy
- upload expiration
- cleanup of abandoned uploads
- immutable file reference for processing
- correlation with Import ID

---

# 25. Import Lifecycle

Create an Import aggregate/entity.

Example states:

```text
CREATED
UPLOADING
UPLOADED
QUEUED
PROCESSING
COMPLETED
COMPLETED_WITH_ERRORS
FAILED
CANCELLED
```

Store:

```text
importId
tenantId
createdBy
source
blobPath
fileName
fileSize
metadataVersion
status
totalRows
processedRows
createdCount
duplicateCount
rejectedCount
updatedCount (if supported)
errorCount
startedAt
completedAt
failureReason
```

Do not expose internal storage paths unnecessarily to clients.

---

# 26. Worker Processing Model

Workers should process in batches.

Example conceptual flow:

```text
Worker
  |
  +-- claim job
  |
  +-- load metadata version
  |
  +-- stream blob
  |
  +-- parse rows
  |
  +-- normalize rows
  |
  +-- validate rows
  |
  +-- derive dedup keys
  |
  +-- deduplicate within file
  |
  +-- deduplicate against tenant DB
  |
  +-- persist valid batch
  |
  +-- record row-level errors
  |
  +-- update import progress
  |
  +-- publish domain events/outbox entries
  |
  +-- mark job complete
```

Do not create one queue message per CSV row unless there is a demonstrated need. Prefer chunk/batch jobs.

---

# 27. Worker Scalability

Workers must be horizontally scalable.

```text
Queue
  |
  +---- Worker 1
  +---- Worker 2
  +---- Worker 3
  +---- Worker N
```

Use controlled concurrency.

Do not scale workers without considering MongoDB write capacity and tenant fairness.

Support:

- retries
- exponential backoff
- dead-letter handling
- idempotency
- job visibility/lease
- cancellation where practical
- graceful shutdown
- checkpoint/progress tracking

---

# 28. Multi-Tenant Worker Fairness

A single large tenant import must not starve all other tenants.

Consider tenant-aware:

- concurrency limits
- queue partitioning
- job priority
- rate limiting
- batch sizes

Example:

```text
Tenant A -> 10M rows
Tenant B -> normal CRM activity
```

Tenant A's import must not make Tenant B's interactive CRM unusable.

The implementation should document how worker concurrency and MongoDB pressure are controlled.

---

# 29. Idempotency

All asynchronous jobs must be safely retryable.

For example:

```text
Import IMP-123
  -> worker fails after 500k rows
  -> retry
```

The retry must not create 500k duplicate Leads.

Use idempotency keys based on appropriate stable identifiers, such as:

```text
tenantId + importId + row identity
```

or a stronger domain-specific idempotency strategy.

Do not rely solely on application memory to prevent duplicates.

---

# 30. Domain Events

The CRM should emit events for meaningful business state changes.

Candidate events include:

```text
LeadCreated
LeadUpdated
LeadAssigned
LeadConverted

ContactCreated
ContactUpdated

OpportunityCreated
OpportunityUpdated

QuoteCreated
QuoteUpdated
QuoteConverted

ApplicationCreated
ApplicationUpdated
ApplicationSubmitted
```

The final event catalogue should be derived from actual business requirements rather than creating an event for every database update.

---

# 31. Event Envelope

Use a canonical event envelope.

Conceptually:

```json
{
  "eventId": "uuid",
  "eventType": "LeadCreated",
  "eventVersion": 1,
  "occurredAt": "2026-08-26T00:00:00Z",
  "tenantId": "tenant-123",
  "source": "metadata-crm",
  "correlationId": "uuid",
  "causationId": "uuid",
  "actor": {
    "type": "USER",
    "id": "user-123"
  },
  "data": {}
}
```

The exact event schema can evolve, but the following are mandatory concepts:

- globally unique event ID
- event type
- event version
- timestamp
- tenant ID
- source
- correlation ID
- causation ID where applicable
- actor/source context where appropriate
- domain payload

---

# 32. Event Data vs Metadata

Do not put metadata itself into every event.

Events describe **what happened**.

Metadata describes **how the tenant's configurable application behaves**.

Example:

```text
Event:
LeadCreated
  leadId
  tenantId
  relevant lead data
```

Not:

```text
LeadCreated
  + entire tenant metadata document
```

If an external consumer needs metadata, expose metadata through an appropriate configuration mechanism/API or include a metadata version/reference where useful.

---

# 33. Event Payload Strategy

Events should contain enough information for consumers to act without requiring unnecessary synchronous calls.

At minimum, include:

- canonical CRM ID
- tenant ID
- event type/version
- relevant changed/business data
- timestamps
- source/correlation identifiers

Do not automatically put every database field into every event.

The event contract must be intentional and versioned.

---

# 34. Outbox Pattern

Do not implement:

```text
save DB record
   ↓
publish event
```

as two unrelated operations.

Failure scenario:

```text
MongoDB save succeeds
Event Bus publish fails
```

Now the system state changed but the integration event disappeared.

Instead:

```text
MongoDB transaction
  |
  +-- domain entity change
  |
  +-- outbox event
  |
  COMMIT
       |
       v
Outbox Publisher
       |
       v
Event Bus
```

Where supported by the persistence model, entity state and outbox record should be committed atomically.

The outbox publisher must be retryable and idempotent.

---

# 35. External System Integration

External systems may:

- provide Leads
- consume CRM events
- provide data that enriches CRM records
- participate in downstream workflows

Do not couple the CRM domain directly to every external system.

Prefer:

```text
CRM
  -> Domain Event
  -> Event Bus
  -> Integration Consumer
  -> External System
```

For inbound events:

```text
External System
  -> Integration Boundary
  -> validate/normalize
  -> CRM command/domain operation
```

External system IDs should be stored as external references, not used as CRM canonical IDs.

---

# 36. Event Ordering

Do not assume global event ordering.

Where ordering matters, define the ordering key explicitly, for example:

```text
tenantId + aggregateType + aggregateId
```

Consumers must tolerate:

- retries
- duplicates
- delayed events
- out-of-order delivery where the infrastructure allows it

Use event versioning and idempotent consumers.

---

# 37. API Idempotency

For externally retried POST operations, support idempotency where appropriate.

Especially:

```text
POST /leads
POST /leads/:id/convert
POST /imports
POST /quotes/:id/convert
```

The exact idempotency semantics must be defined per command.

---

# 38. Lead Conversion

Lead conversion is a domain operation.

It should not be implemented as:

```text
PATCH lead status = CONVERTED
```

It is a business transaction involving:

```text
Lead
  ->
Contact
  +
Opportunity
```

The service must:

1. validate the Lead
2. validate eligibility
3. apply metadata/dependency rules
4. create/update the Contact as defined by business rules
5. create the Opportunity
6. update Lead conversion state
7. create appropriate outbox events
8. commit consistently

The operation must be idempotent or protected against duplicate conversion attempts.

---

# 39. Quote → Application

Quote conversion is also a domain operation.

Conceptually:

```text
Opportunity
   |
   +-- Quote
         |
         | convert
         v
      Application
```

The operation must enforce:

- quote eligibility
- tenant authorization
- metadata-driven validation
- workflow flags
- correct Opportunity association
- duplicate conversion protection
- appropriate domain events

---

# 40. MongoDB Ownership

After migration:

> **NestJS is the authoritative application runtime that directly owns domain database access.**

Next.js should not independently modify CRM domain collections.

The worker may access MongoDB as part of the asynchronous processing architecture, but should use shared domain/application/repository abstractions and enforce the same tenant/security rules.

Target:

```text
Next.js
   -> NestJS
       -> MongoDB

Worker
   -> shared application/domain infrastructure
       -> MongoDB
```

Avoid uncontrolled direct database writes from arbitrary worker scripts.

---

# 41. Repository/Data Access

Introduce explicit repositories/data-access abstractions where useful.

Examples:

```text
LeadRepository
ContactRepository
OpportunityRepository
QuoteRepository
ApplicationRepository
ImportRepository
OutboxRepository
```

Repositories must be tenant-aware.

Avoid passing tenant IDs through every method if a trusted request/job context abstraction can safely establish tenant context.

However, make tenant context explicit enough that cross-tenant access is difficult to accidentally introduce.

---

# 42. Transaction Boundaries

Identify transactional boundaries explicitly.

Examples:

### Lead conversion

```text
Lead + Contact + Opportunity + outbox
```

should be consistent.

### Quote conversion

```text
Quote + Application + outbox
```

should be consistent.

### CSV batch

A batch can have its own transaction boundary.

Do not attempt one MongoDB transaction spanning millions of rows.

---

# 43. API Error Contract

Define a consistent error response.

It should support:

- machine-readable error code
- human-readable message
- correlation/request ID
- validation errors
- authorization errors
- tenant errors
- conflict/idempotency errors

Example conceptual structure:

```json
{
  "code": "LEAD_ALREADY_CONVERTED",
  "message": "Lead has already been converted.",
  "correlationId": "..."
}
```

Do not leak:

- database internals
- stack traces
- secrets
- tenant data
- implementation details

---

# 44. Observability

Implement structured logging from day one.

Every request/job/event should be traceable using:

```text
requestId
correlationId
causationId
tenantId
userId/actorId where appropriate
jobId
importId where applicable
eventId
```

Logs must not expose sensitive customer information unnecessarily.

Never log:

- authentication cookies
- tokens
- secrets
- authorization headers
- passwords
- full sensitive payloads unless explicitly approved

---

# 45. Metrics

At minimum track:

### API

```text
request count
latency
p50
p95
p99
error rate
status codes
```

### Worker

```text
jobs queued
jobs running
jobs completed
jobs failed
retry count
processing duration
rows processed
rows/sec
```

### Import

```text
total rows
processed rows
created
duplicates
rejected
errors
duration
throughput
```

### Tenant

Track tenant-aware resource consumption where useful.

---

# 46. Health Checks

Expose separate health semantics:

```text
/liveness
/readiness
```

Readiness should verify required dependencies sufficiently to accept traffic.

Do not make liveness fail merely because MongoDB is temporarily unavailable; otherwise orchestration may cause unnecessary restart loops.

Workers should have equivalent health/readiness behavior.

---

# 47. Security

Implement:

- secure headers
- strict CORS where applicable
- request validation
- payload limits
- rate limiting where appropriate
- trusted proxy configuration
- secret management through the platform's secret store
- no secrets in source code
- no tokens/cookies in logs
- tenant isolation
- authorization enforcement
- dependency vulnerability scanning
- secure file upload handling

For CSV uploads:

- validate file type
- enforce size limits
- validate structure
- protect against malicious CSV content/formula injection where exported later
- scan files where required
- prevent path traversal
- use generated storage keys rather than user-provided paths

---

# 48. Configuration

Separate:

### Application configuration

Environment/platform configuration:

```text
MongoDB connection
Queue connection
Event bus connection
Blob configuration
authentication configuration
timeouts
limits
feature toggles
```

from:

### Tenant metadata

Tenant-specific business configuration:

```text
forms
fields
visibility
validation
workflow flags
dependencies
```

Do not treat tenant metadata as environment variables.

Do not hardcode tenant-specific behavior in the application.

---

# 49. Metadata Publication Pipeline

The future metadata model should support:

```text
Developer/Admin changes metadata
        |
        v
Validation
        |
        v
Version
        |
        v
Publish artifact
        |
        v
Blob Storage
        |
        v
Consumers retrieve/cache
```

Metadata publication must be versioned and auditable.

The backend should be able to identify exactly which metadata version it used for important operations.

---

# 50. Migration Strategy

Do not perform a big-bang rewrite unless unavoidable.

Recommended migration sequence:

## Phase 1 — Establish repository and architecture

Create:

```text
NestJS API
Worker runtime
Shared domain/application libraries
Infrastructure abstractions
Tenant context
Authentication/authorization middleware/guards
Observability
Health checks
CI/CD
```

## Phase 2 — Establish persistence boundary

Move/introduce:

```text
MongoDB repositories
Tenant database resolver
transaction patterns
outbox
```

## Phase 3 — Migrate low-risk domain APIs

Start with read APIs:

```text
GET leads
GET lead
GET contacts
GET contact
GET opportunities
GET opportunity
```

Then migrate writes.

## Phase 4 — Migrate domain commands

Examples:

```text
create Lead
update Lead
assign Lead
convert Lead
create Opportunity
create Quote
convert Quote
```

## Phase 5 — Introduce worker

Start with CSV import.

## Phase 6 — Introduce event-driven integration

Implement:

```text
Outbox
 -> Event publisher
 -> Event Bus
```

and migrate external integration flows.

## Phase 7 — Remove old Next.js domain implementations

Only after traffic and functional parity have been verified.

---

# 51. Backward Compatibility

During migration, Next.js may temporarily support both:

```text
Old implementation
New NestJS backend
```

Use controlled routing/feature flags to migrate endpoint-by-endpoint.

Do not duplicate business logic indefinitely.

The migration must have a clear endpoint ownership matrix:

```text
Endpoint
Current owner
Target owner
Migration status
Consumer
Authentication
Authorization
Database
Event behavior
```

---

# 52. API Contract Preservation

Where possible, preserve existing external contracts.

Migration should change the implementation boundary without unnecessarily changing:

- request schema
- response schema
- error contract
- identifiers
- business semantics

If a breaking API change is required, explicitly version it.

---

# 53. Event Contract Preservation

Event contracts are also APIs.

Once published externally:

```text
LeadCreated v1
```

must be treated as a compatibility contract.

Do not casually rename/remove fields.

Use:

```text
eventVersion
```

and additive evolution where possible.

---

# 54. Testing Strategy

Implement:

### Unit tests

- domain rules
- dependency engine
- authorization policies
- deduplication
- metadata resolution
- conversion logic

### Integration tests

- MongoDB
- tenant isolation
- repositories
- outbox
- queue
- Blob Storage integration

### API tests

- authentication
- authorization
- tenant isolation
- validation
- domain operations

### Worker tests

- large files
- malformed rows
- duplicate rows
- retries
- partial failures
- idempotent retry
- metadata version pinning

### Contract tests

- Next.js ↔ NestJS
- CRM ↔ external integrations
- event consumers

---

# 55. Performance Expectations

Do not optimize only for average latency.

Measure:

```text
p50
p95
p99
max
```

for interactive APIs.

For workers measure:

```text
rows/sec
batch latency
CPU
memory
MongoDB throughput
queue latency
```

Test with realistic tenant sizes.

Include:

- small tenant
- medium tenant
- very large tenant
- simultaneous imports
- concurrent interactive traffic during imports

---

# 56. Failure Scenarios To Design Explicitly

The implementation must document behavior for:

1. MongoDB unavailable
2. Queue unavailable
3. Event Bus unavailable
4. Blob unavailable
5. metadata unavailable
6. metadata version missing
7. worker crash
8. API crash during domain transaction
9. worker crash mid-import
10. duplicate job delivery
11. duplicate event delivery
12. out-of-order events
13. user retries POST
14. user retries conversion
15. tenant metadata changes during import
16. abandoned upload
17. malformed CSV
18. duplicate CSV upload
19. two agents converting same Lead
20. tenant isolation violation attempt

---

# 57. Concurrency Requirements

Protect domain operations from races.

Example:

```text
Agent A -> convert Lead L123
Agent B -> convert Lead L123
```

Only one conversion should succeed.

Similarly:

```text
Worker A -> process row X
Worker B -> process row X
```

must not create duplicate Leads.

Use appropriate:

- unique indexes
- atomic updates
- optimistic concurrency
- idempotency keys
- transaction boundaries

Do not depend only on application-level checks such as:

```text
if (!exists) create
```

because concurrent requests can both pass the check.

---

# 58. API Versioning

Use an explicit backend API version:

```text
/api/v1/...
```

Do not expose internal module names as API contracts.

---

# 59. Dependency Rules

The architecture should enforce:

```text
Controller
   ↓
Application Service
   ↓
Domain
   ↓
Repository / Infrastructure
```

Do not allow controllers to directly contain large business workflows.

Do not allow repositories to contain business decisions.

Do not allow workers to bypass domain rules without an explicit documented reason.

---

# 60. Suggested NestJS Module Structure

Conceptually:

```text
src/
├── main.ts
│
├── modules/
│   ├── lead/
│   │   ├── controllers/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── dto/
│   │
│   ├── contact/
│   ├── opportunity/
│   ├── quote/
│   ├── application/
│   │
│   ├── import/
│   │
│   ├── metadata/
│   │
│   ├── authorization/
│   ├── tenant/
│   ├── events/
│   └── outbox/
│
├── common/
│   ├── auth/
│   ├── tenant-context/
│   ├── logging/
│   ├── errors/
│   ├── tracing/
│   └── validation/
│
└── infrastructure/
    ├── mongodb/
    ├── blob/
    ├── queue/
    └── event-bus/
```

Do not over-engineer every module into dozens of layers if the codebase does not justify it. Preserve the dependency direction and domain ownership.

---

# 61. Suggested Worker Structure

```text
workers/
└── lead-import/
    ├── parser/
    ├── normalizer/
    ├── validator/
    ├── deduplication/
    ├── batching/
    ├── persistence/
    ├── progress/
    └── events/
```

Future workers can be added:

```text
workers/
├── lead-import/
├── large-export/
├── external-sync/
└── scheduled-processing/
```

Workers should reuse shared domain/application/infrastructure components rather than copying CRM logic.

---

# 62. Shared Code

Prefer a shared package/workspace structure for code that must be consistent across API and worker runtimes.

Potential shared packages:

```text
packages/
├── domain/
├── application/
├── contracts/
├── metadata/
├── tenant-context/
├── persistence/
└── observability/
```

Avoid sharing framework-specific code unnecessarily.

The goal is:

```text
NestJS
  + shared domain/application

Worker
  + shared domain/application
```

not:

```text
Worker
  + duplicated Lead logic
```

---

# 63. What NOT To Build

Do not:

- create microservices for every CRM entity
- put business logic in Next.js BFF routes
- put million-row processing in HTTP requests
- trust client-provided tenant IDs
- trust arbitrary identity headers
- publish events directly after DB writes without reliability handling
- load entire CSV files into memory
- create one HTTP request per CSV row
- create one queue message per row without justification
- duplicate authorization policies
- duplicate metadata/business rules
- embed full metadata in every event
- store secrets in metadata
- use external IDs as CRM canonical IDs
- silently change existing business semantics during migration
- perform uncontrolled direct MongoDB writes from workers

---

# 64. Definition of Done

The new backend architecture is considered ready when:

- [ ] Next.js is clearly separated as UI/BFF.
- [ ] NestJS owns migrated CRM domain APIs.
- [ ] Domain business logic is no longer duplicated in Next.js.
- [ ] Authorization is enforced by NestJS.
- [ ] Authentication/trusted PingFederate context is correctly propagated.
- [ ] Mobile/API consumers can use the domain backend appropriately.
- [ ] Tenant context is enforced end-to-end.
- [ ] Tenant DB isolation is tested.
- [ ] Metadata retrieval is versioned.
- [ ] Metadata caching is implemented safely.
- [ ] Long-running tasks run outside HTTP request lifecycles.
- [ ] CSV uploads use Blob Storage.
- [ ] CSV processing is streaming/chunked.
- [ ] CSV deduplication is deterministic and idempotent.
- [ ] Import progress is observable.
- [ ] Worker retries are safe.
- [ ] Outbox is implemented.
- [ ] Domain events are versioned.
- [ ] Event publication is retryable.
- [ ] External integrations consume stable contracts.
- [ ] APIs have consistent error contracts.
- [ ] Structured logging/tracing exists.
- [ ] Metrics exist for API and worker workloads.
- [ ] Health/readiness endpoints exist.
- [ ] API and worker tests cover tenant isolation and failure scenarios.
- [ ] Existing API contracts are preserved or explicitly versioned.
- [ ] Migration can be performed incrementally.
- [ ] Old Next.js domain implementations can be removed after cutover.

---

# 65. Final Architectural Decision

The target architecture is:

```text
                 ┌────────────────────────┐
                 │        Next.js         │
                 │                        │
                 │ UI + BFF + Web Session │
                 └───────────┬────────────┘
                             │
                             ▼
                 ┌────────────────────────┐
                 │        NestJS          │
                 │                        │
                 │ Modular CRM Backend    │
                 │                        │
                 │ Lead                   │
                 │ Contact                │
                 │ Opportunity            │
                 │ Quote                  │
                 │ Application            │
                 │ Metadata               │
                 │ Authorization          │
                 │ Tenant Context         │
                 │ Outbox                 │
                 └───────────┬────────────┘
                             │
                             ▼
                       Tenant MongoDB

        Blob Storage
             │
             ▼
        Import / Jobs
             │
             ▼
           Queue
             │
             ▼
          Workers
             │
             ▼
        MongoDB / Outbox

        Outbox
           │
           ▼
       Event Bus
           │
           ▼
    External Systems
```

### Architectural rationale

- **Next.js** remains optimized for the web experience.
- **NestJS** provides an independently scalable, independently deployable CRM domain backend.
- **Workers** provide independent scaling and failure isolation for long-running workloads.
- **MongoDB** remains the tenant data store, with NestJS as the authoritative domain access layer.
- **Blob Storage** becomes the appropriate location for large ingestion files and versioned metadata artifacts.
- **Queue** decouples HTTP requests from long-running processing.
- **Outbox + Event Bus** provides reliable event-driven integration.
- **Tenant context** is mandatory across API, worker, database and event boundaries.
- **Metadata** remains configuration, not business logic.
- **Business logic** remains in code, with metadata controlling tenant-specific configuration and enabled workflow behavior.
- **Authorization** is enforced at the domain boundary and must not rely solely on Next.js.
- **The backend remains a modular monolith** initially; microservice decomposition is deferred until justified by actual scale/team/domain boundaries.
- **Migration should be incremental**, preserving existing contracts wherever practical.

---

# 66. Implementation Instruction

Build the new repository according to this architecture.

Before implementing any major component:

1. Inspect the existing CRM repository/contracts where available.
2. Identify the existing API contract and business behavior.
3. Preserve existing behavior unless a deliberate architecture migration requires change.
4. Map each existing domain API to its new NestJS module.
5. Identify all existing authentication and authorization assumptions.
6. Identify all tenant-resolution/database-selection logic.
7. Identify all metadata consumers.
8. Identify all events/integrations already present.
9. Identify long-running operations that belong in workers.
10. Produce a migration matrix before deleting/replacing existing implementation.

When uncertain, prefer:

```text
explicit boundary
+
tenant isolation
+
idempotency
+
observability
+
incremental migration
```

over a clever but fragile implementation.

The architecture must remain scalable, multi-tenant, secure, observable, and capable of supporting future external-system integrations without requiring another major backend migration.
