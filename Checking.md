Phase 1.5 — Audit and Prepare the Existing Filter Utility for Reporting

Context

We are building a metadata-driven, multi-tenant CRM.

The application ALREADY has a functioning generic filter utility. Do NOT rebuild it.

The current filtering functionality is already used by the CRM’s operational entity tables, including Lead and Opportunity.

The existing system already supports:

* Generic field filtering
* Status filtering
* Agent-based filtering/grouping
* Other existing filter operations
* Saved filters
* Saved views
* Persistence of the user’s last-applied filter state
* Tenant-specific/custom metadata fields

The user’s filter state is persisted in the database and restored when the user returns/logs back in.

The system also contains conversion information directly on the Lead entity.

For example, a converted Lead contains information conceptually similar to:

status = CONVERTED
convertedContactId = ...
convertedOpportunityId = ...

This means conversion state does NOT need to be reconstructed by traversing Lead → Contact → Opportunity relationships.

Relationship traversal that previously introduced query overhead has ALREADY BEEN REMOVED.

Do NOT reintroduce it.

⸻

1. Primary objective

The purpose of this phase is to:

1. Inspect the existing filter utility.
2. Understand and document its current architecture.
3. Verify that its filter definition is generic and reusable.
4. Verify that saved filters and saved views remain stable.
5. Verify that user filter persistence is correct.
6. Identify only the minimum changes required to make the existing filter utility a clean foundation for the future Reporting Engine.
7. Remove duplication or inconsistencies if they are found.
8. Improve test coverage where necessary.
9. Ensure that the existing filter contract can later be consumed by reporting.

This phase is NOT a new filter implementation.

It is an audit, hardening, and reporting-readiness phase.

⸻

2. Do NOT rebuild existing functionality

Do not replace the existing:

* filter utility
* filter UI
* saved filter implementation
* saved view implementation
* user filter persistence
* Lead filtering
* Opportunity filtering
* grouping behavior

unless the audit identifies a concrete defect.

Prefer minimal, targeted changes.

The existing working functionality is the baseline.

⸻

3. Important relationship decision

The CRM intentionally does NOT use relationship traversal for normal operational filtering where the required information is already present on the root entity.

For example:

Lead.status = CONVERTED

is sufficient to determine that the Lead is converted.

The Lead also contains:

convertedContactId
convertedOpportunityId

These identifiers provide the references required by the business model.

Therefore:

Lead
 ↓
Contact lookup
 ↓
Opportunity lookup
 ↓
Determine converted state

must NOT be introduced into the operational filter path.

Do not add $lookup, joins, relationship traversal, or equivalent processing merely to determine information that is already represented on the entity.

⸻

4. Understand the existing filter contract

First inspect how filters are currently represented.

Determine:

* filter object structure
* field representation
* operator representation
* value representation
* AND/OR grouping
* nested groups
* multiple-value filters
* date filters
* custom field filters
* status filters
* agent filters
* serialization/deserialization

Document the actual current contract.

Do not invent a new filter DSL if the existing one is already suitable.

⸻

5. Reporting compatibility is the primary architectural question

The most important question in this phase is:

Can the existing Filter Definition be reused by a future Reporting Query Engine?

The desired architecture is:

                   Existing Filter Definition
                              │
              ┌───────────────┼────────────────┐
              ▼               ▼                ▼
         Lead Table     Opportunity Table    Reports
                                                  │
                                                  ▼
                                           Dashboards

We do NOT want:

Lead Filter DSL
Opportunity Filter DSL
Report Filter DSL
Dashboard Filter DSL

We want one common filter representation.

⸻

6. Inspect the current grouping functionality

The current utility already supports grouping by dimensions such as:

* Agent
* Status

Understand precisely what this means today.

Determine whether grouping is:

* purely UI grouping
* database-level aggregation
* display grouping
* some combination

Do not redesign grouping in this phase.

However, document how the current grouping behavior could eventually map to reporting concepts such as:

Dimension
Group By
Measure
Aggregation

For example:

Group By:
Agent
Measure:
COUNT(Lead)

This is future reporting architecture.

Do not implement it now unless it already exists.

⸻

7. Inspect existing saved filters

Understand the current Saved Filter model.

Determine:

* how filters are stored
* how they are identified
* user ownership
* tenant ownership
* entity association
* naming
* creation/update timestamps
* serialization format
* loading behavior
* editing behavior
* deletion behavior

Verify that a Saved Filter is fundamentally a reusable representation of the existing filter definition.

Do not redesign Saved Filters.

⸻

8. Inspect existing Saved Views

Understand exactly what a Saved View currently contains.

It may contain some combination of:

Filter
Columns
Sorting
Grouping
Other UI state

Document the actual implementation.

Verify that Saved Views consume the same underlying filter representation rather than maintaining a completely separate filtering mechanism.

If duplication exists, identify it.

Only refactor if the change is safe and clearly beneficial.

⸻

9. Inspect user filter persistence

There is already a database collection that persists the user’s most recently applied filter state.

Verify the complete flow:

User changes filter
       ↓
Filter state updated
       ↓
State persisted
       ↓
User leaves application
       ↓
User returns/logs in
       ↓
Persisted state retrieved
       ↓
Filter restored

Verify this behavior for the relevant entities/pages.

Do not replace the persistence implementation.

⸻

10. Tenant-specific metadata

The CRM is metadata-driven and multi-tenant.

Verify that the existing filter utility can work against tenant-specific fields.

Example:

Tenant A:

Lead.customerSegment
Lead.annualIncome

Tenant B:

Lead.policyType
Lead.occupation

The filtering implementation must remain generic.

There must be no hardcoded field names such as:

if field === "customerSegment"

unless the field is genuinely a system-level field.

⸻

11. Review operator implementation

Inspect how existing operators are defined.

Determine:

* whether operators are centralized
* whether frontend/backend share the same semantics
* how values are validated
* how operators are mapped to database queries
* whether custom fields use the same operators
* whether there is duplicated operator logic

Do NOT rebuild the operator framework unless required.

The desired architecture is conceptually:

Field
  +
Operator
  +
Value
    ↓
Filter Condition

and:

Condition
    ↓
Query Builder
    ↓
Database Query

⸻

12. Review boolean grouping

Verify that the current system correctly supports the semantics of:

A AND B
A OR B

and nested combinations such as:

A AND (B OR C)

and:

(A OR B) AND (C OR D)

Do not flatten nested groups if doing so changes semantics.

Add regression tests if required.

⸻

13. Review filter serialization

The filter representation needs to be stable because it is already persisted.

Verify:

Filter Object
   ↓
JSON serialization
   ↓
Database
   ↓
JSON deserialization
   ↓
Filter Object

must preserve semantics.

If a filter contains:

AND
 ├── Status = Converted
 └── Agent = John

the persisted version must reconstruct the same logical expression.

⸻

14. Review backward compatibility

Existing persisted filters and views are important.

Do not make a breaking change to the filter schema without a migration strategy.

If the current schema is already suitable:

do not change it.

If there are deficiencies, determine the minimum backward-compatible extension required.

⸻

15. Review API boundaries

Determine how the frontend sends filters to the backend.

The preferred conceptual flow is:

Frontend
   ↓
Filter Definition
   ↓
Backend Validation
   ↓
Query Builder
   ↓
MongoDB/Cosmos

The frontend must NOT construct arbitrary database queries.

Verify that the backend remains the authority for:

* field validation
* operator validation
* value validation
* tenant context
* query generation

⸻

16. Review database query generation

Inspect how the existing filters are translated into MongoDB/Cosmos queries.

Determine whether:

* query generation is centralized
* filters are translated consistently
* nested conditions are handled correctly
* indexes are being used
* pagination works correctly
* sorting works correctly

Do not redesign the database layer.

Only fix concrete issues discovered during the audit.

⸻

17. Performance baseline

Since relationship traversal has already been removed, do not spend this phase rebuilding relationship optimization.

Instead, establish a baseline for the current operational filtering path.

Look at:

* common Lead filters
* common Opportunity filters
* Agent filters
* Status filters
* custom-field filters
* sorting
* pagination

Identify obvious performance issues if they exist.

Do not introduce speculative caching or data projections.

⸻

18. Index awareness

Inspect indexes relevant to the existing filter queries.

Pay particular attention to fields commonly used for filtering:

tenantId
status
agent/owner
createdAt
product

and other heavily used fields.

Do not create a large number of indexes automatically.

Only recommend index changes where there is evidence that they are needed.

⸻

19. MongoDB/Cosmos compatibility

The production system may use MongoDB-compatible CosmosDB.

Review any changes against the actual production data platform.

Do not introduce MongoDB functionality that is unsupported or inefficient in the production environment.

If there is a known MongoDB/Cosmos difference relevant to the filter implementation, document it.

⸻

20. Metadata relationship handling

Relationship metadata can continue to exist as part of the CRM metadata model.

However, it should NOT automatically participate in operational filtering.

The architecture should allow:

Metadata
 ├── Entity
 ├── Fields
 └── Relationships

while operational filtering currently uses primarily:

Entity
 └── Fields

Relationships may become important later for advanced reporting and analytics.

Do not implement relationship-based reporting in this phase.

⸻

21. Future reporting integration

Document exactly how the future Reporting Engine can consume the current filter.

For example:

Report Definition
{
    entity: "lead",
    filter: <existing filter definition>,
    groupBy: [...],
    measures: [...]
}

The important requirement is:

Report Filter
        =
Existing Filter Definition

Do not create a second report-specific filter format.

⸻

22. Identify gaps

At the end of the audit, explicitly classify findings as:

No change required

The current implementation is already suitable.

Minor hardening

Small changes required for correctness or maintainability.

Reporting prerequisite

A change is needed before reporting can safely consume the filter utility.

Future enhancement

Useful later but not required now.

Do not implement future enhancements just because they are identified.

⸻

23. Testing

Run the existing test suite.

Add regression tests where necessary for:

Basic filters

* equals
* not equals
* contains
* numeric comparisons
* date filters
* enum filters

Grouping

* Agent
* Status

Boolean logic

* AND
* OR
* nested conditions

Custom fields

Tenant-specific fields.

Saved filters

Create → persist → retrieve → restore.

Saved views

Create → persist → retrieve → restore.

User persistence

Last-used filter restoration.

Conversion filtering

Verify that:

Lead.status = CONVERTED

works directly without relationship traversal.

Verify that:

convertedContactId
convertedOpportunityId

remain available as entity fields where appropriate.

⸻

24. Explicitly do NOT implement

This phase must NOT implement:

* Reporting Engine
* Report Builder
* Dashboard Builder
* Dashboard widgets
* KPI cards
* Analytics
* Funnel reports
* Lead → Contact → Opportunity reporting
* Relationship joins for reporting
* Scheduled reports
* Export infrastructure
* Data warehouse
* Reporting projections
* New relationship query engine

Those belong to future phases.

⸻

25. Implementation process

Follow this sequence.

Step 1 — Inspect

Inspect the existing filtering, saved views, saved filters, persistence, metadata, and database query paths.

Step 2 — Document

Create a concise architecture map and identify the actual filter contract.

Step 3 — Assess

Determine whether the current filter representation is suitable for reporting.

Step 4 — Test

Run the existing tests and identify missing regression coverage.

Step 5 — Harden

Make only necessary changes.

Step 6 — Verify

Verify Lead, Opportunity, saved filters, saved views, grouping, and user persistence.

Step 7 — Reporting readiness

Document the exact interface that the future Reporting Query Engine should consume.

Step 8 — Stop

Do not begin reporting implementation.

⸻

26. Final acceptance criteria

Phase 1.5 is complete when:

Existing functionality works

* Lead filters work.
* Opportunity filters work.
* Agent grouping works.
* Status grouping works.
* Saved filters work.
* Saved views work.
* Last-used filter persistence works.
* Tenant-specific/custom fields work.

Conversion filtering is direct

A converted Lead can be filtered directly using:

status = CONVERTED

without resolving Contact or Opportunity relationships.

Relationship overhead is absent

Do not reintroduce the previously removed relationship traversal into the operational filtering path.

Filter contract is understood

The actual filter definition is documented.

Filter contract is reusable

The same filter definition can be embedded into a future report definition.

Persistence is stable

Existing saved filters/views continue to work.

Tests pass

Existing tests pass and necessary regression tests have been added.

No unnecessary redesign

The existing filter utility remains recognizable and functional; this phase does not become a rewrite.

⸻

27. Final output required from the coding agent

At completion, report:

1. Existing filter architecture discovered.
2. Actual filter definition/schema.
3. Existing operators.
4. Existing grouping behavior.
5. Saved Filter implementation.
6. Saved View implementation.
7. User filter persistence implementation.
8. Custom-field handling.
9. Database query-generation flow.
10. Any issues discovered.
11. Changes made.
12. Tests added.
13. Test results.
14. Performance observations.
15. Exact recommendation for the next Reporting Engine phase.
16. The proposed interface between the existing Filter Utility and the future Reporting Engine.

Do not proceed to the Reporting Engine automatically.

Stop after Phase 1.5.
