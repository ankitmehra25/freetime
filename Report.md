Phase 2 — Build the Reporting Query Engine

1. Context

We are building a metadata-driven, multi-tenant CRM platform.

The CRM currently contains entities such as:

* Lead
* Opportunity
* Contact
* Additional tenant-defined/custom fields and entities may be introduced in the future.

The platform is designed to support configurable CRM data models where tenants can define their own fields and metadata.

⸻

2. Current State — Important

Before implementing anything, understand that the current application already has a filtering foundation.

Existing functionality

The application currently supports:

* Generic filter utility
* Lead filtering
* Opportunity filtering
* Filter operators
* AND / OR filter logic
* Existing filter grouping behavior used by the operational tables
* Filtering on standard fields
* Filtering on tenant-specific/custom fields
* Saved Filters
* Persistence of Saved Filters
* Existing database query generation
* MongoDB / Azure Cosmos DB Mongo-compatible storage

What does NOT exist yet

There is currently:

* NO Reporting Engine
* NO Report Builder
* NO Dashboard Builder
* NO Dashboard widgets
* NO KPI reporting layer
* NO charting/report visualization layer
* NO Saved Views
* NO Saved Reports
* NO reporting query abstraction
* NO analytical aggregation layer
* NO journey analytics
* NO reporting-specific cross-entity joins

Do not assume any of these already exist.

⸻

3. Critical Architectural Principle

The existing filter utility is the foundation for reporting.

Do not create a second filtering system.

The architecture should become:

Existing Filter Definition
          │
          ├── Operational Lead filtering
          │
          ├── Operational Opportunity filtering
          │
          ├── Saved Filters
          │
          └── Reporting Query Engine
                    │
                    ├── Dimensions
                    ├── Measures
                    ├── Aggregations
                    └── Sorting

The Reporting Query Engine should consume the existing filter definition rather than inventing a new reporting-specific filter DSL.

⸻

4. Primary Objective

Build the backend Reporting Query Engine.

The engine should allow the system to answer questions such as:

“For Lead records matching this existing filter, group them by Status and return the count for each Status.”

Or:

“For Opportunity records matching this filter, group them by Agent and calculate the total opportunity amount.”

Or:

“Give me the total number of converted Leads matching this filter.”

The Reporting Query Engine should become the foundation for future:

* Report Builder
* KPI widgets
* Charts
* Dashboards
* Saved Reports
* Scheduled Reports
* Advanced Analytics
* Journey Analytics

Those features are future phases and must not be implemented now.

⸻

5. What the Reporting Engine Is Responsible For

The Reporting Engine should take:

Entity
+
Existing Filter
+
Dimensions
+
Measures
+
Aggregations
+
Sorting

and produce:

Normalized Reporting Result

Conceptually:

Report Query
     │
     ▼
Validate
     │
     ▼
Reuse Existing Filter Logic
     │
     ▼
Compile Reporting Query
     │
     ▼
MongoDB / Cosmos
     │
     ▼
Normalize Result

⸻

6. Important Distinction: Filtering vs Reporting

Do not confuse the existing operational filtering functionality with reporting aggregation.

For example, the existing Lead table may already allow users to filter by:

Status
Agent
Source
Created Date
Custom Fields

That does NOT mean reporting GROUP BY already exists.

Phase 2 introduces analytical grouping.

For example:

Existing operational filtering

status = QUALIFIED

means:

Return Lead records whose status is QUALIFIED.

Reporting

GROUP BY status
COUNT(*)

means:

Summarize matching Lead records by status and return the number of records in each status group.

These are different capabilities.

Do not modify the existing filtering implementation simply to implement reporting.

⸻

7. First Step — Inspect Existing Architecture

Before writing code, inspect the repository and identify:

Filtering

* Existing filter interfaces/types
* Filter definition structure
* Filter operators
* AND / OR semantics
* Existing nested grouping behavior
* Existing filter serialization
* Existing filter persistence
* Existing Saved Filter implementation
* Existing Lead filtering
* Existing Opportunity filtering

Metadata

* Entity metadata
* Field metadata
* Field types
* Custom field representation
* Tenant-specific metadata
* Existing field validation

Data access

* MongoDB/Cosmos repositories
* Existing query builders
* Existing database abstractions
* Existing query-generation utilities
* Tenant scoping
* Authorization

Application architecture

Identify where backend/domain logic currently lives.

If the application has both:

* Next.js/BFF
* NestJS/backend

determine the appropriate existing backend boundary for reporting.

Do not perform a broader Next.js/NestJS migration as part of this phase.

⸻

8. Do Not Create Parallel Architecture

If an equivalent implementation already exists, reuse it.

Do NOT create:

* A second filter utility
* A second metadata system
* A second repository abstraction unnecessarily
* A second tenant-isolation mechanism
* A second authorization system
* A second query-generation framework

The Reporting Query Engine should extend the existing architecture.

⸻

9. Reporting Query Model

Introduce a generic reporting query abstraction.

The exact TypeScript names should follow the project’s existing conventions.

Conceptually:

type ReportQuery = {
  entity: string;
  filter?: ExistingFilterDefinition;
  dimensions?: ReportDimension[];
  measures?: ReportMeasure[];
  sort?: ReportSort[];
  pagination?: ReportPagination;
};

Do not copy these interfaces blindly.

First inspect the existing codebase and create the smallest appropriate abstraction.

⸻

10. Entity

The query must identify the root CRM entity being reported on.

Examples:

lead
opportunity

Initially focus on entities that already have operational filtering support.

The architecture should be extensible to additional metadata-driven entities later.

⸻

11. Existing Filter

The report query must accept the existing filter definition.

Example:

{
  "entity": "lead",
  "filter": {
    "... existing filter structure ..."
  }
}

Do not create a reporting-specific filter format.

The following must have identical logical semantics:

Existing Lead Filter

and:

The same filter used inside a Report Query

⸻

12. Saved Filters

Saved Filters already exist in the application.

The Reporting Engine should be designed so that an existing Saved Filter can be used as the filter input to a report.

Conceptually:

Saved Filter
     │
     ▼
Existing Filter Definition
     │
     ▼
Reporting Query

However:

Do not redesign Saved Filters.

Do not create Saved Reports.

Do not create Saved Views.

The only requirement is that the reporting architecture can consume the existing filter definition.

⸻

13. Dimensions

Introduce the concept of a reporting dimension.

A dimension represents a field by which the result can be grouped.

Examples:

Status
Agent
Source
Product
Region
Lead Type
Created Date
Custom Field

Example:

{
  "dimensions": [
    {
      "field": "status"
    }
  ]
}

⸻

14. Multiple Dimensions

The engine should support multiple dimensions.

Example:

Dimensions:
Agent
Status

and:

Measure:
COUNT(*)

Conceptual result:

Agent A | NEW        | 120
Agent A | QUALIFIED  | 85
Agent A | CONVERTED  | 40
Agent B | NEW        | 150
Agent B | QUALIFIED  | 91
Agent B | CONVERTED  | 55

The result must retain all dimension values.

⸻

15. Measures

Introduce the concept of a reporting measure.

A measure represents a calculated value.

Initially support:

COUNT
DISTINCT_COUNT
SUM
AVG
MIN
MAX

where supported by the field type and database.

Example:

{
  "type": "COUNT",
  "field": "*",
  "alias": "leadCount"
}

⸻

16. COUNT

Support record count:

COUNT(*)

This must represent:

Number of records matching the filter.

When dimensions are present:

GROUP BY status
COUNT(*)

must represent the number of matching records within each status group.

Do not accidentally implement this as a count of non-null values of an arbitrary field.

⸻

17. DISTINCT_COUNT

Support:

DISTINCT_COUNT(field)

where supported.

Examples:

DISTINCT_COUNT(contactId)
DISTINCT_COUNT(agentId)
DISTINCT_COUNT(source)

This can later support metrics such as:

* Unique contacts
* Unique agents
* Unique sources

If there are database-specific limitations, document them rather than implementing incorrect behavior.

⸻

18. SUM

Support numeric fields.

Example:

SUM(opportunityAmount)

or a tenant-specific numeric field.

Do not allow:

SUM(status)
SUM(agentName)

unless the metadata explicitly indicates that the field is numerically aggregatable.

⸻

19. AVG

Support numeric fields where appropriate.

Example:

AVG(opportunityAmount)

Invalid example:

AVG(status)
AVG(agentName)

⸻

20. MIN / MAX

Support these where the field type makes the operation meaningful.

Examples:

MIN(opportunityAmount)
MAX(opportunityAmount)

Date fields may also be valid depending on the metadata/query implementation.

Use the existing metadata/type system to determine validity.

⸻

21. Metadata-Driven Reporting

The Reporting Engine must be metadata-driven.

Do NOT hardcode:

if (field === "status") ...
if (field === "agentId") ...
if (field === "loanAmount") ...

Instead, resolve fields using the existing metadata system.

Conceptually:

Entity
   │
   ▼
Field Metadata
   │
   ├── Field Type
   ├── Queryable
   ├── Groupable
   └── Aggregatable

Use the existing metadata model wherever possible.

⸻

22. Custom/Tenant-Specific Fields

Tenant-specific fields must work through the same metadata-driven mechanism.

For example, if Tenant A defines:

customerSegment

the reporting engine should be able to use it as a dimension if the metadata and storage model support grouping.

If a tenant defines:

loanAmount

as a numeric field, the reporting engine should be able to support:

SUM(loanAmount)
AVG(loanAmount)

where appropriate.

Do not introduce tenant-specific hardcoding.

⸻

23. Field Capability Validation

Before executing a report, validate:

Entity

* Exists
* User is authorized to report on it

Dimension

* Field exists
* Field belongs to entity
* Field is queryable
* Field is groupable

Measure

* Field exists
* Field belongs to entity
* Aggregation is compatible with field type

Sort

* Field/measure exists in the resulting report

Return structured validation errors.

⸻

24. Example Validation Errors

Use existing project error conventions where possible.

Conceptually:

INVALID_ENTITY
INVALID_FIELD
INVALID_DIMENSION
INVALID_MEASURE
INVALID_AGGREGATION
INVALID_SORT
INVALID_FILTER
UNSUPPORTED_OPERATION
UNAUTHORIZED_FIELD
QUERY_TOO_COMPLEX

Do not allow invalid queries to reach the database.

⸻

25. Query Compilation

Separate:

Report Query Definition

from:

Database Query

The frontend must never construct MongoDB/Cosmos aggregation pipelines.

The architecture should conceptually be:

Report Query
      │
      ▼
Validation
      │
      ▼
Query Compilation
      │
      ▼
Database Query / Aggregation
      │
      ▼
Execution
      │
      ▼
Normalized Report Result

⸻

26. Reuse Existing Filter Query Generation

This is critical.

If the existing filter system already converts:

Filter Definition

into a MongoDB/Cosmos-compatible query condition, reuse that implementation.

Do not rewrite filter-to-database translation inside the Reporting Engine.

Conceptually:

Existing Filter Definition
           │
           ▼
Existing Filter Compiler
           │
           ▼
$match / database filter
           │
           ▼
Reporting Aggregation

This prevents operational filtering and reporting from drifting apart.

⸻

27. MongoDB / Cosmos Implementation

The current reporting implementation should target the existing MongoDB / Azure Cosmos DB Mongo-compatible storage.

Reuse existing database access conventions.

For aggregation-based reports, use the database to perform aggregation where practical.

Conceptually:

$match
   ↓
$group
   ↓
$project
   ↓
$sort

Use only the stages necessary for the requested query.

Do not blindly create a fixed pipeline for every report.

⸻

28. Filter Before Aggregation

Where appropriate, the query should follow:

Filter
  ↓
Reduce matching records
  ↓
Group
  ↓
Aggregate
  ↓
Sort

Avoid:

Load entire dataset
  ↓
Aggregate in Node.js

unless there is a specific architectural reason.

The database should perform aggregation wherever practical.

⸻

29. No Relationship Traversal

This is an explicit requirement.

Do NOT automatically introduce:

Lead
 ↓
Contact
 ↓
Opportunity

lookups.

The existing application intentionally does not use relationship traversal for normal operational filtering because it adds query complexity and performance overhead without sufficient user value.

The same principle applies here.

If a business state is already represented on the root entity, use that field directly.

For example:

Lead.status = CONVERTED

is authoritative.

Do not reconstruct conversion state by looking up Contact or Opportunity.

Existing fields such as:

convertedContactId
convertedOpportunityId
sourceLeadId

can be used directly where appropriate, but do not turn them into automatic joins.

Advanced cross-entity analytics are a future phase.

⸻

30. Sorting

Support sorting by:

Dimensions

Example:

status ASC

Measures

Example:

leadCount DESC

Example:

GROUP BY agent
COUNT(*)
ORDER BY COUNT(*) DESC

The query compiler should correctly resolve measure aliases where necessary.

⸻

31. Pagination

Design pagination carefully.

There are two different use cases:

Detail-style reporting

Potentially requires record pagination.

Aggregated reporting

Pagination applies to grouped results, not raw CRM records.

Do not blindly apply operational table pagination to aggregated reports.

The result contract should make this distinction clear.

⸻

32. Result Contract

Create a normalized reporting result.

The exact implementation should follow existing project conventions, but conceptually:

type ReportResult = {
  columns: ReportColumn[];
  rows: Record<string, unknown>[];
  metadata: ReportResultMetadata;
  pagination?: ReportPagination;
};

Example:

{
  "columns": [
    {
      "field": "status",
      "type": "dimension"
    },
    {
      "field": "leadCount",
      "type": "measure"
    }
  ],
  "rows": [
    {
      "status": "NEW",
      "leadCount": 4200
    },
    {
      "status": "QUALIFIED",
      "leadCount": 3100
    }
  ]
}

The result should be generic enough for future:

* Tables
* Charts
* KPI cards
* Dashboard widgets

Do not build those consumers yet.

⸻

33. Totals

Where appropriate, design the result contract so that report totals can be supported.

For example:

Status       Count
------------------
NEW          4200
QUALIFIED    3100
CONVERTED    2800
------------------
TOTAL        10100

Do not introduce expensive duplicate queries unnecessarily.

If totals are not implemented in the first version, document the limitation and ensure the architecture can support them later.

⸻

34. Date Dimensions

The engine should be designed to support date-based dimensions in the future.

Examples:

Created Date
Updated Date

and eventually:

Day
Week
Month
Quarter
Year

Do not build a complete date-bucketing framework unless it is straightforward and naturally supported by the existing metadata/query architecture.

The important requirement is that the architecture must not prevent this future capability.

⸻

35. Tenant Isolation

Every reporting query must respect tenant boundaries.

Tenant isolation must be enforced server-side.

Never rely on the frontend to provide:

tenantId = ...

as the security mechanism.

Reuse the existing trusted tenant-scoping mechanism.

⸻

36. Authorization

Reporting must respect the existing authorization model.

Do not create a new reporting-specific authorization system.

If users cannot access certain entities or fields operationally, reporting must not provide a backdoor to those records.

Reuse existing authorization/access-control mechanisms.

⸻

37. API Boundary

Reporting execution must happen on the backend.

Expose an API/service using the existing project conventions.

Conceptually:

POST /reports/query

But do not assume this exact endpoint.

Inspect the existing API architecture and follow its conventions.

The frontend should submit a structured report definition.

It must NOT submit:

* MongoDB aggregation pipelines
* Raw MongoDB operators
* Database queries
* Arbitrary expressions

⸻

38. Security Against Arbitrary Queries

Never accept arbitrary MongoDB expressions from the client.

Do not allow clients to submit:

$lookup
$function
$where
$expr
raw aggregation stages

or equivalent database-specific constructs.

The client provides a typed reporting definition.

The backend validates it and generates the database query.

⸻

39. Query Complexity Limits

Introduce reasonable guardrails where necessary.

Potential limits include:

* Maximum dimensions
* Maximum measures
* Maximum grouping combinations
* Maximum result rows
* Maximum page size

Do not introduce arbitrary restrictions without understanding the application’s requirements.

If limits are introduced, make them configurable.

⸻

40. Performance

Review performance carefully.

Inspect:

* Existing indexes
* Existing filter query performance
* Existing field storage model
* Existing custom field query behavior
* Aggregation behavior
* Expected data volume

Avoid:

* Full collection scans where avoidable
* Loading complete records into Node.js for aggregation
* Unnecessary lookups
* Repeated queries
* Fetching fields that are not required for the report

Do NOT introduce yet:

* Redis reporting cache
* Data warehouse
* OLAP database
* Materialized reporting database
* Reporting data lake
* Event-driven reporting projections

Those are future optimization decisions and should only be introduced based on measured requirements.

⸻

41. Observability

Use the existing logging/telemetry approach.

Where appropriate capture:

* Report entity
* Query complexity
* Execution duration
* Number of result groups
* Aggregation types

Do not log complete CRM records or unnecessary sensitive/PII data.

Do not introduce a new observability platform for this phase.

⸻

42. Testing

Add comprehensive tests.

Existing filter integration

Verify:

* Existing filters work inside reports
* AND logic
* OR logic
* Nested groups where supported
* Existing operators
* Custom fields

⸻

Dimensions

Test:

* Single dimension
* Multiple dimensions
* Standard fields
* Custom fields

⸻

Measures

Test:

* COUNT
* DISTINCT_COUNT
* SUM
* AVG
* MIN
* MAX

where applicable.

⸻

Sorting

Test:

* Dimension ascending
* Dimension descending
* Measure ascending
* Measure descending

⸻

Validation

Test:

* Invalid entity
* Invalid field
* Invalid dimension
* Invalid measure
* Invalid aggregation
* Invalid field type
* Invalid sort
* Unauthorized field
* Invalid filter

⸻

Tenant isolation

Verify that a report cannot return records belonging to another tenant.

⸻

Regression

Verify that the new reporting implementation does not break:

* Existing Lead filtering
* Existing Opportunity filtering
* Saved Filters
* Existing filter persistence
* Existing grouping/filter behavior
* Existing APIs

⸻

43. Example Acceptance Scenarios

The following scenarios must work.

Scenario 1 — Total Leads

Entity:
Lead
Measures:
COUNT(*)

Expected:

Total Leads = N

⸻

Scenario 2 — Leads by Status

Entity:
Lead
Dimensions:
Status
Measures:
COUNT(*)

Expected:

NEW          4200
QUALIFIED    3100
CONVERTED    2800
LOST         2442

Values above are illustrative only.

⸻

Scenario 3 — Leads by Agent

Entity:
Lead
Dimensions:
Agent
Measures:
COUNT(*)

Expected:

One result row per Agent.

⸻

Scenario 4 — Leads by Agent and Status

Dimensions:
Agent
Status
Measure:
COUNT(*)

Expected:

One result row per Agent + Status combination.

⸻

Scenario 5 — Filtered Report

Existing filter:

status = QUALIFIED

Reporting query:

Dimension:
Agent
Measure:
COUNT(*)

Expected:

Only QUALIFIED Lead records are included in the aggregation.

⸻

Scenario 6 — Saved Filter Reuse

Take an existing Saved Filter.

Use its existing filter definition inside a report.

Expected:

The report operates on exactly the same logical set of records selected by the existing filter.

Do not create a new Saved Filter implementation.

⸻

Scenario 7 — Converted Leads

Filter:

status = CONVERTED

Expected:

Reporting uses the Lead’s existing status field.

Do NOT perform:

Lead → Contact → Opportunity

lookups to determine conversion state.

⸻

Scenario 8 — Numeric Custom Field

Given a tenant-specific numeric field:

loanAmount

support:

SUM(loanAmount)
AVG(loanAmount)

if the metadata defines the field as numeric and aggregatable.

⸻

44. Explicitly Out of Scope

Do NOT implement any of the following in Phase 2:

UI

* Report Builder UI
* Dashboard Builder
* Charts
* KPI widgets
* Dashboard widgets
* Drag-and-drop reporting UI

Persistence

* Saved Reports
* Saved Views
* Report templates
* Scheduled reports

Advanced analytics

* Journey analytics
* Funnel analytics
* Attribution
* Conversion journey
* Cross-entity analytics
* Lead → Contact → Opportunity joins
* Complex relationship traversal

Infrastructure

* Data warehouse
* Data lake
* OLAP database
* Materialized reporting database
* Redis reporting cache
* Reporting event pipeline

Other

* CSV export
* Excel export
* PDF reporting
* Email reports
* Power BI integration
* Calculated/formula fields
* Arbitrary database expressions
* New filter engine
* New metadata system

⸻

45. Implementation Sequence

Implement in the following order.

Step 1 — Repository investigation

Identify and document:

* Existing filter system
* Existing Saved Filters
* Metadata system
* Query generation
* Database access
* Tenant isolation
* Authorization
* Backend/API boundary

Do not modify anything yet.

⸻

Step 2 — Define Reporting Query Contract

Create the minimal query abstraction supporting:

Entity
Filter
Dimensions
Measures
Sort

Add pagination only where justified.

⸻

Step 3 — Reporting Validation

Validate:

* Entity
* Dimensions
* Measures
* Aggregations
* Field types
* Sort
* Existing filter
* Authorization

⸻

Step 4 — Integrate Existing Filter Compiler

Reuse the existing filter-to-database query generation.

Do not duplicate it.

⸻

Step 5 — Implement Database Aggregation

Implement the MongoDB/Cosmos aggregation required for:

COUNT
SUM
AVG
MIN
MAX
DISTINCT_COUNT

where supported.

⸻

Step 6 — Implement Dimensions

Support:

Single dimension
Multiple dimensions

⸻

Step 7 — Sorting

Support:

Dimension sorting
Measure sorting

⸻

Step 8 — Result Mapping

Create the normalized Reporting Result contract.

⸻

Step 9 — API Integration

Expose the reporting query through the appropriate existing backend/API boundary.

⸻

Step 10 — Tests

Add unit and integration tests.

⸻

Step 11 — Performance Review

Test representative reports if realistic data is available.

Review:

* Query execution time
* Database operations
* Index usage
* Aggregation behavior
* Memory usage

Do not perform speculative optimization.

⸻

46. Definition of Done

Phase 2 is complete when:

Reporting Engine

A reusable Reporting Query Engine exists.

Existing Filter Reuse

The engine consumes the existing filter definition.

There is no second filter DSL.

Dimensions

The engine supports:

* Single dimension
* Multiple dimensions
* Standard fields
* Supported custom fields

Measures

The engine supports:

* COUNT
* DISTINCT_COUNT where supported
* SUM
* AVG
* MIN
* MAX

Validation

Invalid report definitions are rejected before database execution.

Database

MongoDB/Cosmos performs aggregation where practical.

Security

* Tenant isolation is enforced
* Authorization is respected
* Raw database queries cannot be submitted

Performance

* Existing filtering logic is reused
* Filtering occurs before aggregation where appropriate
* Unnecessary relationship lookups are avoided
* No unnecessary in-memory aggregation

Compatibility

Existing functionality continues to work:

* Lead filtering
* Opportunity filtering
* Saved Filters
* Existing filter persistence
* Existing operational grouping/filtering

Tests

Tests cover:

* Filters
* Dimensions
* Multiple dimensions
* Aggregations
* Custom fields
* Sorting
* Validation
* Tenant isolation
* Regression

⸻

47. Final Output Required From the Coding Agent

At the end of Phase 2, provide:

1. Architecture discovered

Explain the existing:

* Filter system
* Saved Filter implementation
* Metadata system
* Query/data-access layer
* Backend/API architecture

2. Reporting architecture implemented

Show the actual architecture, for example:

Reporting API
      ↓
Reporting Service
      ↓
Validation
      ↓
Existing Filter Compiler
      ↓
Reporting Query Compiler
      ↓
MongoDB/Cosmos
      ↓
Result Mapper

Use the actual architecture implemented.

3. Final TypeScript contracts

Show the actual types/interfaces created for:

ReportQuery
ReportDimension
ReportMeasure
ReportSort
ReportResult

or their equivalent names.

4. Supported functionality

List:

* Supported entities
* Dimensions
* Measures
* Aggregations
* Sorting
* Pagination
* Supported field types

5. Existing filter integration

Explain exactly how the existing filter system is reused.

6. Saved Filter integration

Explain how an existing Saved Filter can be used as the filter input for reporting.

Do not claim Saved Views exist.

7. API

Show:

* Endpoint
* Request structure
* Response structure

8. Database implementation

Explain how the MongoDB/Cosmos query or aggregation is generated.

9. Metadata integration

Explain how standard and custom fields are resolved.

10. Security

Explain:

* Tenant isolation
* Authorization
* Validation
* Raw-query protection

11. Testing

List:

* Tests added
* Scenarios covered
* Regression results

12. Performance

Report:

* Representative execution times where available
* Important indexes
* Identified bottlenecks

13. Files changed

List the important files/modules changed.

14. Future extension points

Explain briefly how this foundation can later support:

Report Builder
Dashboard Builder
KPI widgets
Charts
Date bucketing
Calculated metrics
Saved Reports
Journey Analytics
Reporting projections

without implementing them now.

⸻

Final Instruction

Implement only Phase 2 — Reporting Query Engine.

Do not jump ahead into:

* Report Builder UI
* Dashboards
* Charts
* Saved Reports
* Saved Views
* Journey Analytics
* Cross-entity joins
* Data warehouse
* Advanced analytics

Most importantly:

Reuse the existing filter utility.

Reuse the existing Saved Filter definition where applicable.

Do not create a second filtering system.

Do not assume Saved Views exist. They do not currently exist.

Do not treat the existing Agent/Status operational filtering/grouping behavior as an existing reporting GROUP BY implementation. Phase 2 introduces analytical dimensions and aggregation.

Do not reintroduce Lead → Contact → Opportunity relationship traversal simply because those relationships exist.

Do not bypass the existing backend/data-access architecture.

First inspect the existing codebase, then implement incrementally, test thoroughly, and stop when Phase 2 is complete.
