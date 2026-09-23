Phase 1 — Build the Generic Filter Utility / Expression Engine

Context

We are building a metadata-driven, multi-tenant CRM platform.

The CRM contains configurable entities such as:

* Lead
* Contact
* Opportunity
* Account

Each tenant can have its own entity configuration and custom fields.

The entity model is not fixed. For example, one tenant may have additional Lead fields that another tenant does not have.

We are going to build a complete reporting and analytics platform on top of this CRM.

However, do NOT implement reporting, dashboards, saved views, or analytics in this phase.

This phase is specifically about creating the foundational generic Filter Utility / Filter Expression Engine that all future reporting functionality will consume.

The goal is to build this as a reusable platform capability rather than a Lead-specific or CRM-specific implementation.

⸻

1. Core architectural principle

Keep these concerns strictly separated:

Metadata

Metadata describes the data model.

Examples:

* entities
* fields
* field types
* relationships
* tenant-specific configuration
* enum values
* labels

Filter Engine

The Filter Engine describes what operations can be performed against that data model.

Examples:

* equals
* not equals
* contains
* starts with
* ends with
* greater than
* less than
* greater than or equal
* less than or equal
* between
* in
* not in
* is empty
* is not empty

Filter Expression

The Filter Expression describes how users combine those operations.

Examples:

* AND
* OR
* NOT
* nested groups

Saved Filter

A Saved Filter is a reusable persisted Filter Expression.

Saved Filters are NOT part of Phase 1 persistence implementation unless the existing architecture already has a natural place for them. The focus in this phase is the expression model and engine.

⸻

2. Important architectural constraint

DO NOT hardcode filtering logic for:

* Lead
* Contact
* Opportunity
* Account

Do not create separate implementations such as:

* LeadFilterService
* ContactFilterService
* OpportunityFilterService

The filter engine must operate generically against an entity and field abstraction.

For example, it should be possible to evaluate:

status = QUALIFIED

without the engine knowing that status belongs to Lead.

It should work equally for:

lead.status
contact.status
opportunity.status
account.status

provided the supplied metadata/context supports that field.

⸻

3. Desired filter expression model

Design a strongly typed Filter Expression AST.

The expression model should support at minimum:

Condition

Example:

status = QUALIFIED

Conceptually:

{
  "type": "condition",
  "field": "status",
  "operator": "equals",
  "value": "QUALIFIED"
}

AND group

status = QUALIFIED
AND
product = HEALTH

Conceptually:

{
  "type": "group",
  "operator": "AND",
  "children": [
    {
      "type": "condition",
      "field": "status",
      "operator": "equals",
      "value": "QUALIFIED"
    },
    {
      "type": "condition",
      "field": "product",
      "operator": "equals",
      "value": "HEALTH"
    }
  ]
}

OR group

Support arbitrary nested OR expressions.

NOT

Support negation of an expression/group.

For example:

NOT (
    status = CONVERTED
)

⸻

4. Nested boolean expressions

The engine MUST support arbitrary nesting.

Example:

status = QUALIFIED
AND
(
    product = HEALTH
    OR
    product = LIFE
)
AND
(
    annualIncome > 2000000
    OR
    priority = HIGH
)

The expression tree must preserve the logical structure.

Do not flatten expressions in a way that loses grouping semantics.

⸻

5. Primitive operator library

Create an extensible operator abstraction/registry.

Do not scatter operator-specific logic throughout the application.

At minimum support:

Equality

* equals
* notEquals

String

* contains
* notContains
* startsWith
* endsWith

Numeric

* greaterThan
* greaterThanOrEqual
* lessThan
* lessThanOrEqual
* between

Collection

* in
* notIn

Empty/null

* isEmpty
* isNotEmpty

Design the operator system so additional operators can be added later without modifying the core expression engine.

For example, future phases may add:

* exists
* doesNotExist
* date operators
* relationship operators
* relative date operators
* geographic operators
* custom business operators

Do not implement all of those now unless the existing codebase already has a suitable abstraction.

⸻

6. Operator registry

Create a central operator registry or equivalent abstraction.

Conceptually:

interface FilterOperator {
  id: string;
  label: string;
  validateValue(
    value: unknown,
    context: FilterContext
  ): ValidationResult;
  evaluate(
    actualValue: unknown,
    expectedValue: unknown
  ): boolean;
  compile(
    condition: FilterCondition,
    context: FilterContext
  ): QueryExpression;
}

Adapt this interface to the existing project’s coding conventions rather than blindly copying it.

The important architectural requirements are:

1. Operators are independently defined.
2. Operators can be registered.
3. Operators can be validated.
4. Operators can eventually be compiled into a database query.
5. Operators can be reused by different entities.
6. Adding an operator should not require changing the core expression parser.

⸻

7. Do not couple the engine to MongoDB/CosmosDB

The Filter Engine should not directly construct MongoDB queries inside its core domain layer.

Instead, establish a compiler/adapter abstraction.

Conceptually:

Filter Expression
       │
       ▼
Filter Engine
       │
       ▼
Query Compiler
       │
       ├── MongoDB/Cosmos implementation
       └── Future implementations

For example:

FilterExpression
      ↓
FilterCompiler
      ↓
MongoQueryCompiler

The exact abstraction should follow the existing project’s architecture.

The goal is to prevent the domain-level filter model from becoming tightly coupled to MongoDB syntax.

⸻

8. Runtime evaluation

The engine should support evaluating a Filter Expression against an in-memory record/object.

Example:

Record:

{
  "status": "QUALIFIED",
  "product": "HEALTH",
  "annualIncome": 2500000
}

Expression:

status = QUALIFIED
AND
product = HEALTH
AND
annualIncome > 2000000

Result:

true

This runtime evaluator is important for:

* unit testing
* preview functionality
* validating filter behavior
* future client-side/local evaluation where appropriate

Do NOT use client-side evaluation as the primary database filtering strategy for large datasets.

⸻

9. Filter validation

Create a dedicated validation layer.

It should detect things such as:

Unknown field

field = somethingThatDoesNotExist

Unknown operator

operator = unsupportedOperator

Missing value

annualIncome > null

when the operator requires a value.

Invalid value type

Example:

annualIncome > "hello"

Invalid operator/value combination

Example:

annualIncome contains "abc"

if contains is not supported by the numeric field semantics.

Invalid expression structure

Examples:

* empty AND group
* malformed OR group
* missing children
* malformed condition
* invalid nested expression

The validation result should be structured and machine-readable.

For example:

{
  "valid": false,
  "errors": [
    {
      "code": "INVALID_VALUE_TYPE",
      "field": "annualIncome",
      "operator": "greaterThan",
      "message": "Expected numeric value"
    }
  ]
}

⸻

10. Metadata interaction

Phase 1 must remain generic, but design the engine so it can consume field metadata.

Do NOT make the metadata system responsible for defining every possible filter operation.

Instead:

Field Metadata
       +
Operator Registry
       +
Filter Expression
       ↓
Filter Validation

For example, metadata may say:

{
  "name": "annualIncome",
  "type": "number"
}

The operator registry defines:

greaterThan
lessThan
between
equals

The filter capability resolver can determine whether a given operator makes sense for the field.

This separation is mandatory.

⸻

11. Field types

Design the system so it can work with generic field types.

At minimum account for:

string
number
boolean
date
datetime
enum
array
object
reference

Do not over-engineer support for every possible field type if the current CRM metadata system does not have them yet.

However, the abstractions must not prevent future field types from being added.

⸻

12. Relative date architecture

If the existing CRM already has date fields, design the expression model so future relative-date filters can be supported.

Examples:

Today
Yesterday
Tomorrow
This Week
Last Week
This Month
Last Month
Last 7 Days
Last 30 Days
This Quarter

Do not hardcode these into individual UI components.

If implemented in this phase, represent them as semantic filter values rather than pre-calculating them in the frontend.

For example:

{
  "field": "createdAt",
  "operator": "greaterThanOrEqual",
  "value": {
    "type": "relativeDate",
    "period": "LAST_30_DAYS"
  }
}

If relative dates are deferred, ensure the AST can accommodate them later without breaking compatibility.

⸻

13. Custom filter composition

The engine must support users combining primitive conditions into reusable expressions.

Example:

Filter A:
status = QUALIFIED

Filter B:

annualIncome > 2000000

Combined:

Filter A
AND
Filter B

The core expression model should make this possible.

Do not create a special hardcoded mechanism for every custom filter.

A custom filter is fundamentally a persisted/composed expression.

⸻

14. Filter references

Design the expression architecture so future phases can support reusable filter references.

For example:

High Value Customer

could represent:

annualIncome > 2000000

and another filter could eventually reference it:

High Value Customer
AND
status = QUALIFIED

You do not necessarily need to implement persistence or filter references in Phase 1.

But do not design the AST in a way that makes this impossible later.

⸻

15. Query compilation abstraction

Create a clean boundary between:

Filter AST

and:

Database query

For example:

FilterExpression
       │
       ▼
FilterCompiler
       │
       ▼
QueryRepresentation
       │
       ▼
Mongo/Cosmos Adapter

The exact implementation should follow the existing architecture.

The compiler should be responsible for recursively translating:

AND
OR
NOT
condition

into the target query representation.

The core expression model must remain database-independent.

⸻

16. Security considerations

Do not allow raw database query fragments from the frontend.

The frontend/user should only be able to submit the supported Filter Expression structure.

Never accept arbitrary MongoDB operators such as:

$where
$function

or arbitrary raw query JSON from users.

The backend must:

1. Validate the expression.
2. Validate fields.
3. Validate operators.
4. Validate values.
5. Compile only supported operations.
6. Apply authorization constraints independently.

Do not treat the user’s filter as an authorization mechanism.

Authorization/data-scope filters will be introduced/integrated later.

⸻

17. Frontend utility

If the existing CRM has a frontend filter builder, refactor/build it around the same expression model.

The UI should be capable of rendering:

[Field] [Operator] [Value]

and:

+ Add Condition
+ Add Group

A group should allow:

ALL
ANY
NONE

or equivalent representations of:

AND
OR
NOT

The UI must generate the Filter AST.

The UI must NOT directly generate MongoDB queries.

⸻

18. Example UI behavior

The user should be able to construct:

ALL conditions:
Status          is          Qualified
Product         is one of   Health, Life
Annual Income   greater than 20,00,000

Then create:

ANY of the following:
Region = North
Region = West

Resulting expression:

AND
├── Status = Qualified
├── Product IN [Health, Life]
├── Annual Income > 2000000
└── OR
    ├── Region = North
    └── Region = West

The resulting AST is what gets persisted/transmitted.

⸻

19. Serialization

The Filter Expression must be serializable/deserializable.

We need to be able to:

UI
 ↓
JSON
 ↓
API
 ↓
Filter Engine
 ↓
AST

and:

AST
 ↓
JSON
 ↓
UI

without losing logical meaning.

Define a stable versionable schema.

For example:

{
  "version": 1,
  "type": "group",
  "operator": "AND",
  "children": []
}

The exact schema can differ based on existing project conventions.

The important requirement is that the schema is versioned so future changes can be handled safely.

⸻

20. Normalization

Consider introducing an expression normalization step.

For example:

status = Qualified
AND
( product = Health )

could be normalized into a canonical structure.

Normalization should make expressions:

* predictable
* easier to compare
* easier to cache later
* easier to test
* easier to compile

Do not perform aggressive logical transformations unless they are proven safe.

Preserve semantics.

⸻

21. Testing requirements

This phase must have extensive unit tests.

Test every primitive operator.

Test:

equals
notEquals
contains
notContains
startsWith
endsWith
greaterThan
greaterThanOrEqual
lessThan
lessThanOrEqual
between
in
notIn
isEmpty
isNotEmpty

Test combinations:

AND
OR
NOT
nested AND
nested OR
AND inside OR
OR inside AND
multiple levels of nesting

Test validation:

invalid field
invalid operator
invalid value
invalid value type
missing value
malformed expression

Test serialization/deserialization.

Test runtime evaluation.

Test query compilation.

Test edge cases:

null
undefined
empty string
empty arrays
zero
false
negative numbers
boundary values
dates

Do not only test happy paths.

⸻

22. Performance considerations

Do not prematurely optimize.

However, avoid designs that recursively traverse or clone huge object graphs unnecessarily.

The AST should be immutable or treated as immutable where practical.

Avoid repeated metadata lookup during a single expression evaluation/compilation.

Consider a compilation context/cache later, but do not introduce unnecessary infrastructure in Phase 1.

⸻

23. Code organization

First inspect the existing repository and determine where the current:

* metadata model
* entity definitions
* API layer
* services
* utilities
* frontend components
* data access layer

already live.

Do NOT create an unrelated parallel architecture if an appropriate existing module can be extended.

The desired conceptual structure is something similar to:

filtering/
├── domain/
│   ├── expressions/
│   ├── operators/
│   ├── validation/
│   └── types/
│
├── evaluation/
│
├── compilation/
│
├── metadata/
│
└── ui/

Adapt the physical folder structure to the existing repository conventions.

⸻

24. What NOT to implement in Phase 1

Do NOT implement:

* dashboards
* dashboard widgets
* report builder
* report persistence
* saved views
* analytics
* charts
* aggregations
* KPIs
* Lead conversion funnel
* Lead → Contact → Opportunity analytics
* scheduled reports
* exports
* email reports
* data warehouse/reporting projections

Do not introduce unnecessary infrastructure for these future capabilities.

However, ensure the Filter Engine has clean interfaces that future phases can consume.

⸻

25. Acceptance criteria

Phase 1 is complete only when:

Expression model

We can represent arbitrary nested:

AND
OR
NOT
conditions

Operators

Operators are implemented through an extensible registry rather than scattered conditional logic.

Validation

Invalid expressions are rejected with structured errors.

Runtime evaluation

Expressions can be evaluated against an in-memory record.

Compilation

Expressions can be translated through an abstraction into a database query representation without coupling the domain model directly to MongoDB syntax.

Serialization

Expressions can safely round-trip:

object → JSON → object

Metadata

The filter engine can consume generic field metadata without making metadata responsible for defining the complete operator system.

Extensibility

A new operator can be introduced without rewriting the core filter engine.

Reusability

Nothing in the implementation assumes the entity is Lead.

The same engine must be usable for:

Lead
Contact
Opportunity
Account
future tenant-defined entities

Testing

The operator library, AST, validation, evaluation, serialization, and compilation have comprehensive automated tests.

⸻

26. Before writing code

First inspect the existing codebase.

Identify:

1. Current metadata/entity configuration.
2. Existing field definitions.
3. Existing API structure.
4. Existing MongoDB/Cosmos data-access layer.
5. Existing frontend table/filter components.
6. Existing TypeScript types.
7. Existing validation framework.
8. Existing test framework.
9. Existing service/repository patterns.

Then produce a short implementation plan specific to this repository.

Do NOT start by rewriting existing architecture.

Reuse existing conventions where appropriate.

⸻

27. Implementation approach

Implement this incrementally:

Step 1

Inspect repository and existing metadata architecture.

Step 2

Define Filter Expression types.

Step 3

Define operator abstraction and registry.

Step 4

Implement primitive operators.

Step 5

Implement nested boolean expression handling.

Step 6

Implement validation.

Step 7

Implement runtime evaluation.

Step 8

Implement serialization/deserialization.

Step 9

Implement database query compilation abstraction.

Step 10

Integrate with the existing data layer without exposing raw database query construction to the UI.

Step 11

Add frontend filter-builder integration if an existing filter UI exists.

Step 12

Add comprehensive tests.

Step 13

Run existing tests and type checking.

Step 14

Provide a final implementation summary.

⸻

28. Final deliverables

At the end of Phase 1, provide:

1. Files/modules created.
2. Files/modules modified.
3. Filter Expression schema.
4. Operator registry design.
5. Supported operators.
6. Validation behavior.
7. Runtime evaluator behavior.
8. Query compiler abstraction.
9. Frontend integration, if implemented.
10. Test coverage/results.
11. Any architectural decisions made.
12. Any assumptions.
13. Any issues or limitations.
14. Recommendations for Phase 2.

Do not proceed into Phase 2 unless explicitly instructed.

The next phase will build metadata-aware relationship filtering on top of this foundation.
