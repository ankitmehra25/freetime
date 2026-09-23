Phase 2 — Make the Generic Filter Engine Metadata- and Relationship-Aware

Context

Phase 1 established a generic Filter Utility / Filter Expression Engine.

The Phase 1 implementation should already provide:

* Filter Expression AST
* AND / OR / NOT groups
* Primitive filter conditions
* Operator registry
* Operator validation
* Runtime evaluation
* Serialization/deserialization
* Query compilation abstraction
* Automated tests

Do NOT replace or redesign the Phase 1 filter engine unless there is a concrete architectural issue that prevents this phase from being implemented correctly.

This phase extends that foundation so the filter engine can understand the CRM’s metadata-driven entity model and relationships.

⸻

1. Objective

The goal of Phase 2 is:

Make the generic filter engine capable of filtering any tenant-defined CRM entity using the entity/field metadata and relationship metadata already present in the application.

The filter engine must remain generic.

It must NOT contain hardcoded business logic such as:

if entity === "lead"
if entity === "contact"
if entity === "opportunity"

Instead, the engine should consume metadata describing:

Entity
Field
Field Type
Relationship
Relationship Cardinality
Relationship Target

and use that metadata to resolve and validate filter expressions.

⸻

2. Important architectural principle

Maintain this separation:

                    TENANT METADATA
                          │
                          │ describes
                          ▼
              ┌───────────────────────┐
              │ Entity Model          │
              │ Fields                │
              │ Relationships         │
              │ Field Types           │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Metadata Resolver     │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Generic Filter Engine │
              │                       │
              │ AST                   │
              │ Operators             │
              │ Validation            │
              │ Evaluation            │
              │ Compilation           │
              └───────────────────────┘

Metadata describes the model.

The Filter Engine performs operations against that model.

Do not move operator definitions into tenant metadata.

⸻

3. First inspect the existing metadata architecture

Before implementing anything:

Inspect the repository and identify the existing source of truth for:

* tenant configuration
* entity definitions
* field definitions
* custom fields
* field types
* enum/options
* entity relationships
* relationship cardinality
* entity identifiers
* tenant identifiers

Do not create a second metadata system if one already exists.

If the current metadata structure is insufficient for Phase 2, identify exactly what is missing and extend it minimally.

Do not replace the existing metadata architecture unnecessarily.

⸻

4. Target conceptual metadata model

The exact implementation must follow the existing project, but conceptually we need something equivalent to:

interface EntityMetadata {
  name: string;
  label: string;
  fields: FieldMetadata[];
  relationships: RelationshipMetadata[];
}

and:

interface FieldMetadata {
  name: string;
  label: string;
  type: FieldType;
  // Other existing metadata
  required?: boolean;
  nullable?: boolean;
  options?: unknown[];
}

and:

interface RelationshipMetadata {
  name: string;
  targetEntity: string;
  cardinality:
    | "one-to-one"
    | "one-to-many"
    | "many-to-one"
    | "many-to-many";
}

These are conceptual examples.

Reuse the actual metadata types and naming conventions already present in the application.

⸻

5. Metadata must be tenant-aware

This is a multi-tenant CRM.

Tenant A may have:

Lead
 ├── firstName
 ├── lastName
 ├── phone
 ├── status
 └── annualIncome

Tenant B may have:

Lead
 ├── firstName
 ├── lastName
 ├── phone
 ├── status
 ├── policyType
 ├── occupation
 └── preferredLanguage

The filter engine must resolve fields against the metadata belonging to the current tenant.

A filter submitted by Tenant A must NOT be validated against Tenant B’s metadata.

The tenant context must be explicit and trusted.

Do NOT allow the frontend to arbitrarily specify the tenant ID used for metadata resolution or query execution.

The authenticated server-side context must determine the tenant.

⸻

6. Entity-aware filter context

Extend the Phase 1 Filter Context so the engine understands the root entity.

For example:

FilterContext
tenantId
rootEntity
metadata

Conceptually:

{
  "tenantId": "tenant-a",
  "rootEntity": "lead"
}

The filter engine can then resolve:

status
product
createdAt

against:

Lead

⸻

7. Field resolution

Implement a metadata-backed field resolver.

Given:

rootEntity = lead
field = status

resolve:

lead.status

Given:

rootEntity = contact
field = city

resolve:

contact.city

The resolver must determine:

1. Does the entity exist?
2. Does the field exist?
3. What is its field type?
4. Is the field available for filtering?
5. What metadata is associated with it?

Do not rely on frontend field definitions for this validation.

The backend must resolve fields against trusted server-side metadata.

⸻

8. Custom tenant fields

Custom fields are a first-class requirement.

For example:

Tenant A:
Lead.custom_policy_type
Lead.customer_segment
Lead.annual_income

The filter engine must be able to filter these fields exactly like built-in fields.

For example:

custom_policy_type = GOLD

or:

annual_income > 2000000

No special Lead-specific code should be required.

The field resolver should treat custom fields as metadata-defined fields.

⸻

9. Field type integration

The Phase 1 operator system must now interact with field metadata.

For example:

annualIncome
type = number

allows appropriate numeric operators.

status
type = enum

allows appropriate enum-compatible operators.

createdAt
type = datetime

allows date-compatible operations.

The metadata should NOT define the operators.

Instead:

Field Metadata
       +
Operator Registry
       ↓
Operator Capability Resolution

The system should determine whether a requested operation is valid for the field type.

⸻

10. Operator compatibility

Introduce a generic capability-resolution mechanism.

For example:

number
 ├── equals
 ├── notEquals
 ├── greaterThan
 ├── greaterThanOrEqual
 ├── lessThan
 ├── lessThanOrEqual
 └── between

String:

string
 ├── equals
 ├── notEquals
 ├── contains
 ├── notContains
 ├── startsWith
 └── endsWith

Enum:

enum
 ├── equals
 ├── notEquals
 ├── in
 └── notIn

The exact compatibility rules should be implemented in the operator registry or a dedicated capability resolver.

Do not duplicate these rules in React components.

The backend is the final authority.

⸻

11. Relationship metadata

Now introduce relationship-aware field paths.

For example:

Lead
 └── Contact

Metadata might conceptually say:

Lead.contact
    targetEntity = Contact
    cardinality = many-to-one

Another relationship:

Contact
 └── Opportunities

could say:

Contact.opportunities
    targetEntity = Opportunity
    cardinality = one-to-many

The exact metadata representation must follow the existing project.

⸻

12. Relationship path resolution

The filter engine should be able to resolve paths such as:

contact.city

from:

Lead

Meaning:

Lead
  │
  └── contact
         │
         └── city

Likewise:

contact.opportunities.status

could resolve:

Lead
  │
  └── Contact
        │
        └── Opportunities
              │
              └── status

Do not hardcode these paths.

They must be derived from metadata.

⸻

13. Relationship path validation

When a filter contains:

contact.city = Delhi

validate:

Lead
  ↓
contact
  ↓
Contact
  ↓
city

If any part of the path is invalid, return a structured validation error.

Examples:

UNKNOWN_RELATIONSHIP
UNKNOWN_RELATED_ENTITY
UNKNOWN_RELATED_FIELD
INVALID_RELATIONSHIP_PATH

Example:

Lead.foo.city

must fail if foo is not a relationship.

⸻

14. Relationship conditions

Support relationship-aware conditions.

Example:

Lead.contact.city = Delhi

Conceptually:

{
  "type": "condition",
  "path": "contact.city",
  "operator": "equals",
  "value": "Delhi"
}

The AST should remain generic.

Do not introduce:

LeadContactFilter

or similar entity-specific abstractions.

⸻

15. Collection relationships

A particularly important requirement is handling one-to-many relationships.

Example:

Contact
 └── Opportunities[]

A filter such as:

Contact.opportunities.status = OPEN

is ambiguous if there are multiple opportunities.

The engine must explicitly define collection semantics.

Support a relationship existence/quantifier abstraction.

Conceptually:

Contact
WHERE
EXISTS Opportunity
WHERE Opportunity.status = OPEN

This should eventually be represented as something similar to:

{
  "type": "relationship",
  "relationship": "opportunities",
  "quantifier": "EXISTS",
  "where": {
    "type": "condition",
    "field": "status",
    "operator": "equals",
    "value": "OPEN"
  }
}

The exact schema is up to the implementation, but the semantic distinction is mandatory.

Do not silently assume that a collection relationship behaves like a single object.

⸻

16. Relationship quantifiers

Design the model to support at minimum:

EXISTS
NOT_EXISTS

For example:

Contacts who have at least one open opportunity.

and:

Contacts who have no open opportunities.

Future phases may add:

ALL
ANY
COUNT

Do not overbuild these if they are not needed immediately.

But the architecture should not prevent them.

⸻

17. Lead → Contact → Opportunity use case

This phase must support the data model that the CRM actually uses.

Conceptually:

Lead
 ├── Contact
 └── Opportunity

and potentially:

Lead
   ↓
Contact
   ↓
Opportunity

depending on the actual relationship metadata.

The important use cases should be representable without hardcoded CRM logic.

Examples:

Example 1

Lead.status = QUALIFIED

Example 2

Lead.product = HEALTH
AND
Lead.contact.city = Delhi

Example 3

Lead
WHERE
related Opportunity exists
AND
Opportunity.status = OPEN

Example 4

Contact
WHERE
Opportunity exists
AND
Opportunity.value > 5000000

Example 5

Lead
WHERE
Contact exists
AND
Contact.city = Delhi
AND
Opportunity exists
AND
Opportunity.status = WON

These must be represented generically through metadata and the filter expression system.

⸻

18. Query compilation

Extend the Phase 1 query compiler so relationship-aware expressions can be compiled.

The core architecture should remain:

Filter AST
     │
     ▼
Metadata Resolver
     │
     ▼
Validated Expression
     │
     ▼
Query Compiler
     │
     ▼
Database Adapter

The compiler should understand concepts such as:

field condition
nested boolean group
relationship condition
EXISTS
NOT_EXISTS

but it should NOT contain CRM business rules.

⸻

19. Database-specific implementation

Use the existing MongoDB/Cosmos data-access architecture.

Do not expose database-specific syntax to the frontend.

The frontend sends something like:

{
  "type": "condition",
  "path": "contact.city",
  "operator": "equals",
  "value": "Delhi"
}

The backend determines how to retrieve the data.

Potential implementations may involve:

* direct field filtering
* MongoDB aggregation
* $lookup
* $elemMatch
* $exists
* joins/lookups
* denormalized fields

Use the approach compatible with the existing data model and CosmosDB production constraints.

Do not introduce an unnecessary abstraction layer if the existing repository already has an appropriate query/data-access abstraction.

⸻

20. Do not assume all relationships require $lookup

The implementation must inspect how relationships are actually stored.

For example, if Lead contains:

{
  "contactId": "contact-123"
}

and Contact contains:

{
  "_id": "contact-123"
}

then relationship resolution may require a lookup or another query strategy.

If the application already stores denormalized reporting fields, those may be preferable for certain operations.

Do not blindly implement $lookup everywhere.

First understand the current data model.

⸻

21. Relationship query safety

Relationship filters must be validated before compilation.

Prevent:

* arbitrary collection names
* arbitrary database fields
* arbitrary database operators
* arbitrary Mongo aggregation fragments

Only metadata-defined:

entities
fields
relationships

may be traversed.

The user should never be able to submit:

{
  "collection": "someInternalCollection"
}

or:

{
  "$where": "..."
}

as part of a filter.

⸻

22. Tenant isolation

Tenant isolation must be enforced independently of the user’s filter.

For every query:

Authenticated Tenant Context
        │
        ▼
Authorization / Tenant Scope
        │
        ▼
Query

The user filter is an additional condition.

It must never replace or override tenant scoping.

For example:

Tenant A
AND
User Filter

not:

User Filter

where the user is allowed to choose the tenant.

⸻

23. Metadata caching

Metadata will likely be accessed frequently.

Investigate the existing metadata caching strategy.

If appropriate, introduce a metadata resolver/cache that avoids repeatedly loading the same tenant metadata for every condition.

For example:

Request
  ↓
Tenant Metadata
  ↓
Metadata Context
  ↓
Resolve 20 filter conditions

rather than:

condition 1 → load metadata
condition 2 → load metadata
condition 3 → load metadata
...

Do not introduce distributed caching infrastructure unless the existing application requires it.

An in-request cache or existing application cache may be sufficient at this stage.

⸻

24. Metadata version awareness

If the current metadata system supports versioning, respect it.

If it does not, do not build an entirely new metadata versioning system in this phase.

However, make sure filter validation occurs against the current tenant metadata.

A filter referencing:

customFieldX

must fail gracefully if that field no longer exists.

The system should produce a useful error such as:

FILTER_FIELD_NOT_FOUND

rather than generating a broken database query.

⸻

25. Frontend filter builder

Extend the Phase 1 filter builder to use metadata dynamically.

The UI should:

1. Load available fields for the current entity.
2. Display standard fields.
3. Display tenant-specific custom fields.
4. Display appropriate operators.
5. Render the appropriate value editor.
6. Allow nested AND/OR groups.
7. Allow relationship traversal.
8. Allow relationship conditions.

Example:

Lead
Field:
[ Contact ▼ ]
Relationship:
[ City ▼ ]
Operator:
[ equals ▼ ]
Value:
[ Delhi ]

or:

Lead
Related Opportunity
    [ exists ▼ ]
    Status
    [ equals ▼ ]
    [ Open ]

The frontend must generate the same Filter AST used by the backend.

Do not duplicate filter semantics in the UI.

⸻

26. Dynamic field/value controls

The filter builder should use field metadata to choose the appropriate UI control.

Examples:

string → text input
number → numeric input
boolean → boolean selector
enum → select/multi-select
date → date picker
datetime → datetime picker
reference → entity selector

This is UI behavior derived from metadata.

It does not change the generic operator architecture.

⸻

27. Relationship picker

For relationship fields, the UI should be able to navigate the metadata graph.

For example:

Lead
  ↓
Contact
  ↓
City

The user should not need to know the underlying database structure.

The UI should display business-friendly labels:

Contact → City

while the expression stores the canonical metadata path.

⸻

28. Canonical field paths

Establish a canonical representation for paths.

For example:

contact.city

or an equivalent structured representation.

Prefer a structured internal representation where ambiguity is possible.

For example:

{
  "path": [
    "contact",
    "city"
  ]
}

This can be safer than relying entirely on dot-separated strings.

Choose whichever fits the existing architecture, but ensure paths can be serialized reliably.

⸻

29. Do not implement reporting yet

Even though this phase makes relationship-aware filtering possible, do NOT implement:

* report builder
* grouping
* aggregations
* dashboard widgets
* dashboard filters
* charts
* KPIs
* saved reports
* saved views
* analytics

Those belong to later phases.

The output of this phase is a robust reusable filtering foundation.

⸻

30. Testing requirements

Add comprehensive automated tests.

Metadata resolution

Test:

valid entity
invalid entity
valid field
invalid field
custom field
invalid custom field
valid relationship
invalid relationship
nested relationship

Operator compatibility

Test:

number + greaterThan
number + between
string + contains
enum + in
boolean + equals

and invalid combinations.

Relationship paths

Test:

lead.contact.city
contact.opportunities.status

and invalid paths.

Relationship quantifiers

Test:

EXISTS
NOT_EXISTS

for one-to-many relationships.

Nested expressions

Test:

AND
OR
NOT
relationship conditions inside AND
relationship conditions inside OR
nested relationship groups

Tenant isolation

Test that:

Tenant A metadata

cannot be used to query:

Tenant B data

Runtime evaluation

Test relationship-aware expressions against representative in-memory structures where practical.

Query compilation

Verify that the compiler produces the expected database query representation.

Do not couple unit tests unnecessarily to exact low-level MongoDB syntax if the abstraction is intentionally database-independent. Add targeted integration tests where exact database behavior matters.

⸻

31. Performance tests

At minimum, evaluate:

* metadata resolution for large field sets
* nested expression validation
* deep relationship paths
* multiple relationship conditions
* large AND/OR expressions

Do not prematurely optimize.

However, identify potentially expensive operations and document them.

⸻

32. Error model

Establish structured errors for this phase.

Examples:

UNKNOWN_ENTITY
UNKNOWN_FIELD
UNKNOWN_RELATIONSHIP
INVALID_RELATIONSHIP_PATH
INVALID_OPERATOR
INVALID_OPERATOR_FOR_FIELD_TYPE
INVALID_VALUE
INVALID_RELATIONSHIP_QUANTIFIER
METADATA_NOT_FOUND
TENANT_CONTEXT_REQUIRED

Do not expose internal database errors directly to the frontend.

⸻

33. Backward compatibility

Phase 1 filters must continue to work.

For example:

{
  "type": "condition",
  "field": "status",
  "operator": "equals",
  "value": "QUALIFIED"
}

must continue working after Phase 2.

Relationship-aware functionality should be an extension rather than a breaking redesign.

If the AST schema must change, introduce an explicit version/migration strategy.

⸻

34. Implementation process

Follow this sequence.

Step 1 — Inspect

Inspect:

* Phase 1 implementation
* existing metadata
* entity definitions
* tenant configuration
* relationships
* data models
* repositories/data access
* existing frontend filter UI

Do not code immediately.

Step 2 — Map existing metadata

Document:

Entity
Field
Field type
Relationship
Relationship target
Relationship cardinality
Custom field representation

Step 3 — Design integration

Determine exactly how Phase 1 consumes metadata.

Do not duplicate metadata.

Step 4 — Implement metadata resolver

Create/reuse a resolver capable of:

entity → field
entity → relationship
relationship path → target field

Step 5 — Implement operator capability resolution

Connect field metadata to the Phase 1 operator registry.

Step 6 — Implement relationship expressions

Add relationship-aware conditions and quantifiers.

Step 7 — Extend query compilation

Compile relationship-aware expressions through the existing database abstraction.

Step 8 — Extend frontend

Make the filter builder dynamically navigate metadata.

Step 9 — Security

Ensure tenant scope and server-side metadata validation are enforced.

Step 10 — Tests

Add unit/integration tests.

Step 11 — Regression

Run all Phase 1 tests and existing application tests.

Step 12 — Review

Check that no entity-specific filtering logic has leaked into the generic engine.

⸻

35. Architectural quality checks

Before declaring the phase complete, verify:

No entity-specific filter services

Avoid:

LeadFilterService
ContactFilterService
OpportunityFilterService

unless there is a legitimate business-specific reason unrelated to generic filtering.

No duplicated filter logic

The frontend and backend should not implement separate definitions of what an operator means.

No raw DB filters from frontend

Frontend sends Filter AST only.

No tenant ID supplied as an authorization mechanism

Tenant scope comes from authenticated context.

No metadata duplication

Reuse the existing metadata source of truth.

No dashboard/reporting implementation

Those belong to future phases.

⸻

36. Acceptance criteria

Phase 2 is complete when the following are true.

Entity filtering

The generic filter engine can filter any metadata-defined entity.

Example:

Lead.status = Qualified

works without Lead-specific filter code.

Custom fields

Tenant-defined fields can be filtered.

Example:

Lead.customPolicyType = GOLD

works through metadata.

Relationship filtering

The engine can resolve:

Lead.contact.city = Delhi

based entirely on metadata.

Collection relationship filtering

The engine can express:

Contact has an Opportunity
where Opportunity.status = OPEN

using a generic relationship/quantifier mechanism.

Nested filtering

The engine supports combinations such as:

Lead.status = Qualified
AND
(
    Lead.product = Health
    OR
    Lead.product = Life
)
AND
Lead.contact.city = Delhi
AND
Lead has Opportunity where status = Open

Tenant awareness

The engine resolves metadata using the authenticated tenant context.

Frontend

The filter builder dynamically renders:

* fields
* custom fields
* operators
* values
* relationships

from metadata.

Database

The backend compiles the filter into an appropriate query without exposing raw database syntax to the client.

Backward compatibility

All Phase 1 functionality continues to work.

Tests

All new and existing tests pass.

⸻

37. Explicitly stop after Phase 2

Do not implement Phase 3 automatically.

Phase 3 will introduce:

* persisted Saved Filters
* reusable filter definitions
* Saved Views
* user-specific default filters
* columns
* sorting
* view-level configuration
* sharing/ownership

Those should be implemented separately after Phase 2 has been reviewed.
