You are working on an existing FastAPI application that will become the foundation of an Enterprise Data Access Gateway.

IMPORTANT:
This is NOT a disposable proof of concept.

V0 is the permanent CORE FOUNDATION of this product.

V1, V2, V3 and all future versions MUST build on top of V0.

DO NOT create a temporary implementation that will later be thrown away.

DO NOT create a parallel architecture for V1.

DO NOT rewrite the V0 core when future capabilities are introduced.

All future capabilities must be additive extensions around the V0 security, governance, authorization and execution pipeline.


============================================================
1. BUSINESS CONTEXT
============================================================

We are building an enterprise-grade Data Access Gateway for citizen developers.

The organization has multiple data domains, data rooms, Databricks catalogs, schemas and tables.

Examples include:

- Dental
- Claims
- Provider
- Finance
- Sales
- Operations
- Other enterprise domains

Citizen developers will eventually access the gateway through an enterprise entry point such as Cloud CoWork.

A citizen developer may eventually:

- enter SQL directly
- provide the name of a table
- ask a natural-language question
- ask an AI agent to retrieve data
- ask an agent to perform data analysis

However, the gateway must NEVER grant data access.

The fundamental security rule is:

A user can query enterprise data ONLY if that user already has the required access in the organization's existing Databricks / Unity Catalog authorization model.

The gateway is an enforcement, governance and controlled-execution layer.

It is NOT an access provisioning system.

The gateway must NEVER:

- grant permissions
- modify permissions
- grant SELECT
- grant USE CATALOG
- grant USE SCHEMA
- modify Unity Catalog grants
- bypass Unity Catalog
- use a privileged service identity to access data that the requesting user cannot access
- create an application-owned permission system that replaces Unity Catalog


============================================================
2. LONG-TERM PRODUCT VISION
============================================================

The eventual architecture is:

Citizen Developer
        |
        v
Cloud CoWork / Enterprise AI Entry Point
        |
        v
Enterprise Data Access Gateway
        |
        +-- Authentication / Identity
        +-- Identity Context
        +-- Metadata Discovery
        +-- SQL Parsing / AST
        +-- Query Governance
        +-- Authorization
        +-- Query Rewriting
        +-- Audit / Observability
        |
        v
Databricks SQL Warehouse
        |
        v
Unity Catalog
        |
        +-- Catalog permissions
        +-- Schema permissions
        +-- Table/view permissions
        +-- Column-level controls
        +-- Row-level controls
        +-- ABAC / tags / policies where applicable
        |
        v
Enterprise Data

The eventual platform may later include:

- Microsoft Entra ID
- Microsoft Graph
- Cloud CoWork
- LLMs
- Natural-language-to-SQL
- Databricks Genie
- agents
- semantic layer
- ontology
- metadata services
- caching
- additional data platforms

NONE of these capabilities may bypass the V0 security boundary.


============================================================
3. NON-NEGOTIABLE ARCHITECTURAL PRINCIPLE
============================================================

V0 IS THE PERMANENT CORE.

The system must evolve like this:

V0 Core
   |
   +-- V1 adds capabilities
   |
   +-- V2 adds capabilities
   |
   +-- V3 adds capabilities
   |
   +-- Future versions add capabilities

NOT:

V0
   |
   X discard
   |
V1 rewritten system
   |
   X discard
   |
V2 rewritten system

Every future version must preserve the V0 core contracts.

The following V0 capabilities are permanent security boundaries:

1. Identity Context
2. SQL parsing
3. AST-based SQL analysis
4. SQL statement security
5. Query governance
6. Table/object extraction
7. Authorization
8. Query rewriting
9. Databricks execution
10. Audit
11. Security tests
12. Fail-closed behavior

Future components may be added before or around these layers, but they may NOT bypass these layers.


============================================================
4. PERMANENT GOVERNED QUERY PIPELINE
============================================================

Every query that can reach Databricks MUST eventually pass through:

INPUT
  |
  v
Identity Context
  |
  v
SQL / Query Representation
  |
  v
SQL Parser
  |
  v
AST
  |
  v
SQL Security
  |
  v
Object/Table/Column Discovery
  |
  v
Governance Policy Engine
  |
  v
Authorization
  |
  v
Query Rewriter
  |
  v
Databricks SQL Execution
  |
  v
Unity Catalog Final Enforcement
  |
  v
Result
  |
  v
Audit

This pipeline is permanent.

For V0, the input is direct SQL.

For future versions, the input may come from:

- Cloud CoWork
- LLM
- Genie
- agent
- another application
- natural language

But the resulting SQL MUST enter the same pipeline.

For example:

Future:

Natural Language
      |
      v
LLM
      |
      v
Generated SQL
      |
      v
V0 SQL Security
      |
      v
V0 Governance
      |
      v
V0 Authorization
      |
      v
V0 Query Rewriter
      |
      v
Databricks

NEVER:

Natural Language
      |
      v
LLM
      |
      v
Databricks


============================================================
5. V0 OBJECTIVE
============================================================

V0 is the first permanent foundation of this system.

V0 must prove the deterministic security and governance boundary.

The V0 user experience is intentionally simple.

The user provides:

1. user identity
2. SQL

Example:

User:

alice@company.com

SQL:

SELECT *
FROM dental_prod.claims.claim_header

The FastAPI application receives the request.

It must:

1. establish identity context
2. parse the SQL
3. generate an AST
4. determine the statement type
5. reject unsafe statement types
6. reject multiple statements
7. identify every referenced table
8. identify relevant columns
9. evaluate query governance
10. validate authorization
11. apply query limits
12. rewrite the query if necessary
13. execute ONLY the approved query
14. execute against Databricks SQL Warehouse
15. allow Unity Catalog to perform final enforcement
16. capture audit information
17. return a controlled response

V0 is intentionally small in functionality.

But V0 is NOT shallow in security.

The security, authorization and governance components must be designed as permanent production-grade foundations.


============================================================
6. EXISTING FASTAPI APPLICATION
============================================================

An existing FastAPI template already exists.

DO NOT create a new FastAPI project.

DO NOT replace the existing architecture.

DO NOT restructure the repository unnecessarily.

DO NOT introduce a second application.

First inspect the existing repository.

Understand:

- folder structure
- application entry point
- routers
- dependency injection
- Pydantic models
- configuration management
- environment handling
- logging
- exception handling
- testing framework
- middleware
- authentication scaffolding
- Docker setup
- requirements / pyproject
- existing utilities
- existing conventions

Reuse existing patterns whenever appropriate.

The goal is:

EXTEND THE EXISTING FASTAPI APPLICATION.

Not:

REBUILD THE APPLICATION.

Before making substantial changes:

1. inspect the repository
2. explain the current architecture
3. identify the existing extension points
4. map the proposed V0 components to the existing architecture
5. identify required dependencies
6. identify potential conflicts
7. identify assumptions

Do not blindly overwrite existing files.


============================================================
7. V0 ARCHITECTURE
============================================================

The target architecture is:

Existing FastAPI Application
        |
        v
Query API
        |
        v
DataAccessGateway
        |
        +------------------------+
        |                        |
        v                        v
IdentityContext            SQL Parser
                                 |
                                 v
                               AST
                                 |
                                 v
                        SQL Security Engine
                                 |
                                 v
                        Object Discovery
                                 |
                                 v
                        Governance Policy
                        Engine
                                 |
                                 v
                        Authorization
                                 |
                                 v
                        Query Rewriter
                                 |
                                 v
                        Databricks Executor
                                 |
                                 v
                         SQL Warehouse
                                 |
                                 v
                         Unity Catalog
                                 |
                                 v
                              Result

Audit and observability are cross-cutting.


============================================================
8. V0 API
============================================================

Create a primary endpoint:

POST /query

Request:

{
    "user_id": "alice@company.com",
    "sql": "SELECT * FROM dental_prod.claims.claim_header"
}

Use a strongly typed Pydantic request model.

The response should be structured.

Example:

{
    "success": true,
    "request_id": "REQ-123",
    "user_id": "alice@company.com",
    "statement_type": "SELECT",
    "tables": [
        "dental_prod.claims.claim_header"
    ],
    "authorization": {
        "allowed": true
    },
    "policy": {
        "allowed": true,
        "violations": []
    },
    "effective_sql": "SELECT * FROM dental_prod.claims.claim_header LIMIT 50",
    "execution": {
        "statement_id": "...",
        "row_count": 50
    }
}

The API should not expose unnecessary sensitive information.


============================================================
9. IDENTITY MODEL
============================================================

Create an IdentityContext abstraction.

The system must clearly distinguish:

Application User Identity

from

Actual Databricks Execution Identity.

This distinction is critical.

Passing:

user_id = "alice@company.com"

to Python does NOT automatically mean Databricks executes as Alice.

The production system must eventually support a user-delegated identity model where Databricks evaluates permissions for the actual requesting user.

For V0, if the existing environment does not yet support full user-delegated Databricks OAuth, support the organization's approved local authentication mechanism.

However:

DO NOT falsely represent a shared service principal as Alice.

Clearly model:

application_user_id

and

databricks_principal

separately.

Future identity providers should be pluggable.

Create an abstraction such as:

IdentityProvider

Potential future implementations:

LocalIdentityProvider
EntraIdentityProvider
CloudCoWorkIdentityProvider

V0 may implement only the provider required for local development.


============================================================
10. MICROSOFT GRAPH
============================================================

Microsoft Graph may eventually be used for enterprise identity context such as:

- user profile
- group membership
- organizational context

However:

Microsoft Graph is NOT the source of truth for Databricks table authorization.

Unity Catalog / Databricks remains authoritative for data access.

Do NOT implement Microsoft Graph in V0 unless it is genuinely required by the existing FastAPI authentication architecture.

Design the identity interfaces so Graph can be added later.


============================================================
11. SQL PARSING
============================================================

Use a real SQL parser.

Recommended library:

sqlglot

Do NOT use regex as the primary SQL security mechanism.

The parser must generate an Abstract Syntax Tree (AST).

The AST must be used to determine:

- statement type
- number of statements
- referenced tables
- referenced columns
- SELECT *
- joins
- CTEs
- subqueries
- LIMIT
- UNION
- functions
- nested structures
- other relevant SQL constructs

The system must fail closed if it cannot confidently parse or analyze a query.


============================================================
12. READ-ONLY SQL POLICY
============================================================

The gateway is READ ONLY.

Allow:

SELECT

and safe read-only CTEs that ultimately produce SELECT.

Reject:

INSERT
UPDATE
DELETE
MERGE

CREATE
ALTER
DROP
TRUNCATE

GRANT
REVOKE

CALL
EXECUTE

and other write, DDL, DCL or procedural operations.

Do not implement this by searching for keywords.

Determine the statement type using the AST.


============================================================
13. MULTI-STATEMENT SECURITY
============================================================

Only ONE executable statement is permitted.

Reject:

SELECT * FROM dental.claims;
DELETE FROM dental.claims;

Reject:

SELECT * FROM dental.claims;
SELECT * FROM finance.payments;

Reject attempts to hide additional statements using:

- semicolons
- comments
- whitespace
- malformed syntax
- nested executable constructs

Policy:

ONE REQUEST = ONE READ-ONLY SQL STATEMENT.


============================================================
14. SQL INJECTION / BYPASS DEFENSE
============================================================

The gateway must defend against attempts to bypass governance.

Test at minimum:

- semicolon injection
- comment injection
- block comments
- multiple statements
- nested statements
- DML inside unsupported structures
- DDL attempts
- DCL attempts
- malformed SQL
- unusual whitespace
- quoted identifiers
- case variations
- unsupported procedural constructs

Examples:

SELECT * FROM dental.claims;
DELETE FROM dental.claims;

SELECT * FROM dental.claims -- malicious continuation

SELECT * FROM dental.claims /* malicious content */

SELECT * FROM dental.claims WHERE 1=1;
DROP TABLE dental.claims;

All unsafe forms must be rejected BEFORE execution.

Do not attempt to solve SQL injection using an ever-growing blacklist.

Prefer an explicit safe SQL grammar/policy and fail closed for unsupported constructs.


============================================================
15. TABLE DISCOVERY
============================================================

Every physical table referenced by the SQL must be discovered from the AST.

Example:

SELECT *
FROM dental_prod.claims.claim_header

must produce:

catalog = dental_prod
schema = claims
table = claim_header

Full identifier:

dental_prod.claims.claim_header

For:

SELECT *
FROM dental_prod.claims.claim_header c
JOIN dental_prod.provider.provider p
    ON c.provider_id = p.provider_id

discover BOTH:

dental_prod.claims.claim_header
dental_prod.provider.provider

If the parser cannot confidently identify every physical object:

REJECT THE QUERY.

Never guess.


============================================================
16. COLUMN DISCOVERY
============================================================

The system should also analyze requested columns.

Example:

SELECT claim_id, claim_amount
FROM dental_prod.claims.claim_header

should identify:

claim_id
claim_amount

For:

SELECT *

record:

select_star = true

Column governance should be represented in the architecture even though Unity Catalog remains the final enforcement mechanism for applicable column-level security and masking.

Do NOT implement an independent application-level masking system in V0.


============================================================
17. AUTHORIZATION
============================================================

Authorization is a first-class component.

Create:

AuthorizationProvider

and a Databricks / Unity Catalog implementation.

The gateway should determine whether the requesting identity is authorized for EVERY referenced table.

If a query references:

Table A
Table B
Table C

then ALL THREE must be authorized.

If:

A = authorized
B = authorized
C = unauthorized

then:

ENTIRE QUERY = DENIED

Do NOT partially execute.

Do NOT remove unauthorized tables automatically.

Do NOT rewrite a query to bypass an unauthorized table.


============================================================
18. UNITY CATALOG AUTHORIZATION
============================================================

Unity Catalog is the authoritative data authorization layer.

The gateway may perform preflight authorization using Databricks APIs where appropriate.

Potential metadata/privilege APIs include:

- catalogs
- schemas
- tables
- grants / privilege information

Create a UnityCatalogClient abstraction.

Potential methods:

get_catalog()
get_schema()
get_table()
list_tables()
get_table_privileges()

Handle:

- pagination
- 401
- 403
- 404
- rate limits
- transient failures
- malformed responses

IMPORTANT:

Metadata visibility is not automatically equivalent to data access.

Do not assume:

"table exists"

means:

"user can SELECT table".

The actual Databricks execution must remain subject to Unity Catalog enforcement.


============================================================
19. AUTHORIZATION VS GOVERNANCE
============================================================

These are separate concepts.

AUTHORIZATION asks:

"Is the user allowed to access this data?"

GOVERNANCE asks:

"Even if the user is authorized, is this query permitted under the gateway's safety policy?"

Example:

User has SELECT permission.

But user submits:

SELECT * FROM table LIMIT 1000000

Authorization:

ALLOW

Governance:

DENY

Therefore:

FINAL:

DENY

Both gates must pass.


============================================================
20. GOVERNANCE POLICY ENGINE
============================================================

Create a first-class deterministic policy engine.

Suggested abstractions:

QueryPolicyConfig
QueryPolicyEngine
PolicyDecision
PolicyViolation

The policy engine must be deterministic.

No LLM.

No probabilistic decisions.

No "probably safe" decisions.

No hidden policy logic.

All security-relevant policy decisions should be explicit and testable.


============================================================
21. V0 POLICY DEFAULTS
============================================================

Initial configuration:

default_row_limit = 50

hard_max_row_limit = 100

max_tables = 5

max_joins = 4

max_result_bytes = 10 MB

max_execution_seconds = 30

allow_select_star = true

allow_union = false

allow_cross_catalog_join = false

allow_cross_schema_join = true

allow_subqueries = true

These must be configuration-driven.

Do NOT bury policy values in random code paths.


============================================================
22. RESULT LIMIT GOVERNANCE
============================================================

If user submits:

SELECT *
FROM dental_prod.claims.claim_header

rewrite effectively to:

SELECT *
FROM dental_prod.claims.claim_header
LIMIT 50

If user submits:

LIMIT 50

allow.

If user submits:

LIMIT 100

allow.

If user submits:

LIMIT 101

DENY.

If user submits:

LIMIT 1000

DENY.

IMPORTANT:

Do NOT silently change:

LIMIT 1000

into:

LIMIT 100.

Explicit policy violations should be rejected transparently.


============================================================
23. SELECT STAR
============================================================

SELECT * is allowed in V0.

But it MUST be governed.

Example:

SELECT *
FROM dental_prod.claims.claim_header

becomes:

SELECT *
FROM dental_prod.claims.claim_header
LIMIT 50

Record:

select_star = true

limit_applied = 50

Future versions may introduce column selection or semantic policies, but V0 must still safely govern SELECT *.


============================================================
24. RESULT SIZE
============================================================

Do not rely only on row count.

A result can contain a small number of very large rows.

Therefore V0 must have a result-size control.

Target:

max_result_bytes = 10 MB

Use Databricks execution capabilities where available.

If the execution path cannot guarantee the limit, fail closed or apply the strongest enforceable control and clearly document the limitation.


============================================================
25. QUERY COMPLEXITY
============================================================

Govern query complexity.

Initial limits:

maximum physical tables = 5

maximum joins = 4

Detect and govern:

- excessive joins
- Cartesian joins
- excessive nesting
- unsupported UNION
- excessive subqueries
- excessively complex expressions

If the system cannot reliably evaluate complexity:

REJECT.


============================================================
26. CROSS-DOMAIN GOVERNANCE
============================================================

The organization has business/data domains.

Examples:

Dental
Finance
Claims
Provider

Create an extensible domain policy concept.

Example:

requesting_user_domain = dental

requested_table_domain = dental

may be allowed.

requesting_user_domain = dental

requested_table_domain = finance

may be denied by application governance.

IMPORTANT:

This is an additional governance layer.

It does NOT replace Unity Catalog authorization.

The eventual domain mapping should come from trusted metadata, tags or enterprise metadata rather than brittle table-name parsing.

V0 can use a minimal configurable domain mapping only if necessary.

Do not create a large manual permission database.


============================================================
27. QUERY REWRITER
============================================================

Create:

QueryRewriter

It must operate on the parsed query structure where practical.

Responsibilities:

- apply default LIMIT
- preserve valid LIMIT
- reject excessive LIMIT
- generate deterministic effective SQL
- avoid unsafe string concatenation
- preserve query semantics as much as possible

The original SQL and effective SQL must both be retained for audit purposes.


============================================================
28. DATABRICKS EXECUTION
============================================================

Execute queries against a Databricks SQL Warehouse.

Use the Databricks SQL Statement Execution API / Databricks SDK.

DO NOT:

- start Spark clusters for each request
- attach to an interactive notebook cluster
- create a cluster per request
- use Spark as the V0 execution mechanism

The desired execution model is:

FastAPI
   |
   v
Databricks SQL Statement Execution
   |
   v
SQL Warehouse
   |
   v
Unity Catalog
   |
   v
Data

This keeps V0 cost-effective and aligned with the eventual gateway architecture.


============================================================
29. DATABRICKS AUTHENTICATION
============================================================

Use the organization's approved Databricks authentication mechanism.

Do not hardcode:

- tokens
- passwords
- secrets
- PATs
- client secrets

Do not commit credentials.

Do not log credentials.

The eventual production direction should support user-delegated authentication / OAuth where appropriate.

If V0 uses a development identity or shared identity, explicitly document that it is a DEVELOPMENT execution identity.

Never claim that a shared identity represents the requesting user.


============================================================
30. FAIL-CLOSED SECURITY
============================================================

The gateway must fail closed.

If any security-critical condition is unknown:

DENY.

Examples:

SQL cannot be parsed
→ DENY

Table extraction is ambiguous
→ DENY

Authorization cannot be established
→ DENY

Identity is ambiguous
→ DENY

Policy evaluation fails
→ DENY

Security metadata unavailable
→ DENY where the missing information is necessary for the decision

Never:

unknown = allowed

Always prefer:

unknown = denied


============================================================
31. AUDIT
============================================================

Every query request must generate an audit event.

Create:

AuditEvent

At minimum:

request_id
timestamp
application_user_id
databricks_principal
original_sql
normalized_sql
effective_sql
statement_type
tables
columns
select_star
authorization_result
policy_result
policy_version
execution_status
statement_id
rows_returned
execution_time_ms
error_code

Never log:

- passwords
- tokens
- client secrets
- API keys
- full sensitive datasets

For V0, local JSONL or structured application logging is acceptable.

Design the interface so production can later send audit events to centralized enterprise logging.


============================================================
32. ERROR MODEL
============================================================

Create structured error codes.

At minimum:

INVALID_SQL
MULTIPLE_STATEMENTS
UNSUPPORTED_STATEMENT
DML_NOT_ALLOWED
DDL_NOT_ALLOWED
DCL_NOT_ALLOWED
TABLE_NOT_FOUND
TABLE_ACCESS_DENIED
COLUMN_ACCESS_DENIED
TOO_MANY_TABLES
TOO_MANY_JOINS
QUERY_TOO_COMPLEX
LIMIT_REQUIRED
LIMIT_EXCEEDED
RESULT_TOO_LARGE
QUERY_TIMEOUT
CROSS_DOMAIN_ACCESS_DENIED
DATABRICKS_AUTHENTICATION_ERROR
DATABRICKS_AUTHORIZATION_ERROR
DATABRICKS_EXECUTION_ERROR
POLICY_ERROR
INTERNAL_ERROR

Do not expose internal stack traces.


============================================================
33. CORE DOMAIN INTERFACES
============================================================

Design V0 with interfaces that support future versions.

At minimum consider:

IdentityProvider

SQLParser

AuthorizationProvider

MetadataProvider

PolicyEngine

QueryRewriter

QueryExecutor

AuditSink

DataAccessGateway

Future implementations can be added without changing the gateway contract.

For example:

IdentityProvider

V0:
Local / configured identity

Future:
EntraIdentityProvider
CloudCoWorkIdentityProvider

SQL generation:

V0:
Manual SQL input

Future:
LLMSQLGenerator
GenieSQLGenerator
AgentSQLGenerator

All generated SQL must still enter the same V0 security pipeline.


============================================================
34. CORE DATA MODELS
============================================================

Create strongly typed models.

At minimum:

IdentityContext

QueryRequest

ParsedQuery

TableReference

ColumnReference

AuthorizationResult

PolicyViolation

PolicyDecision

EffectiveQuery

QueryExecutionResult

AuditEvent

Use Pydantic or dataclasses according to existing project conventions.


============================================================
35. DATA ACCESS GATEWAY
============================================================

The most important application service should be:

DataAccessGateway

Conceptually:

gateway.execute(
    user_id=user_id,
    sql=sql
)

Internally:

execute()
    |
    +-- resolve identity
    |
    +-- parse SQL
    |
    +-- validate statement
    |
    +-- extract tables
    |
    +-- extract columns
    |
    +-- evaluate governance
    |
    +-- authorize
    |
    +-- rewrite
    |
    +-- execute
    |
    +-- audit
    |
    +-- return structured result

This service must be independent from FastAPI as much as practical.

FastAPI should be the transport/API layer.

This is important because future consumers will include:

- Cloud CoWork
- agents
- notebooks
- internal applications
- automated services

The DataAccessGateway should remain reusable.


============================================================
36. FASTAPI RESPONSIBILITY
============================================================

FastAPI should handle:

- HTTP
- request validation
- authentication middleware eventually
- routing
- response serialization
- HTTP error mapping
- API documentation

FastAPI should NOT contain:

- SQL security logic
- authorization logic
- governance logic
- query rewriting logic
- Databricks-specific business logic

Those belong in domain/application services.


============================================================
37. FUTURE CLOUD COWORK INTEGRATION
============================================================

Cloud CoWork is a future consumer.

Do NOT implement Cloud CoWork in V0.

The future flow:

Citizen Developer
      |
      v
Cloud CoWork
      |
      v
Enterprise Data Access Gateway
      |
      v
DataAccessGateway
      |
      v
V0 Security Pipeline
      |
      v
Databricks

Cloud CoWork must not have a direct Databricks credential capable of bypassing the gateway.


============================================================
38. FUTURE LLM INTEGRATION
============================================================

No LLM in V0.

Future flow:

User:
"Show me the first 50 dental claims."

        |
        v

LLM

        |
        v

SELECT *
FROM dental_prod.claims.claim_header
LIMIT 50

        |
        v

V0 SQL Parser
        |
        v
V0 Governance
        |
        v
V0 Authorization
        |
        v
V0 Query Rewriter
        |
        v
Databricks

The LLM output is UNTRUSTED input.

Treat LLM-generated SQL exactly like user-entered SQL.

Never trust the LLM to enforce security.


============================================================
39. FUTURE ONTOLOGY / SEMANTIC LAYER
============================================================

A future semantic layer may understand concepts such as:

Claim
Member
Provider
Policy
Customer
Opportunity
Account

and relationships such as:

Claim -> belongs to -> Member
Claim -> submitted by -> Provider

A future ontology / semantic layer may improve SQL generation.

But it MUST NOT become the security boundary.

Future:

Semantic Layer
      |
      v
SQL Generation
      |
      v
V0 SQL Security
      |
      v
V0 Governance
      |
      v
V0 Authorization
      |
      v
Databricks

Security remains deterministic.


============================================================
40. FUTURE METADATA ARCHITECTURE
============================================================

V0 should retrieve metadata from Databricks / Unity Catalog as required.

Do not create a large application-owned metadata database in V0.

Future versions may introduce:

MetadataProvider
    |
    +-- UnityCatalogMetadata
    +-- CachedMetadata
    +-- EnterpriseMetadata
    +-- SemanticMetadata

The abstraction must allow these to be added later.

Do not make future metadata architecture a prerequisite for V0.


============================================================
41. SECURITY TESTING
============================================================

Security testing is a mandatory part of V0.

Create automated tests for:

SQL parsing
statement classification
multiple statements
DML
DDL
DCL
SQL injection attempts
table extraction
column extraction
authorization
governance
limits
query complexity
query rewriting
fail-closed behavior

Test at minimum:

1. Authorized SELECT
2. Unauthorized SELECT
3. SELECT with WHERE
4. SELECT with ORDER BY
5. SELECT with LIMIT
6. SELECT with JOIN
7. SELECT with CTE
8. INSERT
9. UPDATE
10. DELETE
11. MERGE
12. CREATE
13. ALTER
14. DROP
15. TRUNCATE
16. GRANT
17. REVOKE
18. CALL
19. EXECUTE
20. SELECT + DELETE
21. SELECT + SELECT
22. SELECT + DROP
23. Comment injection
24. Block comment injection
25. Semicolon injection
26. Malformed SQL
27. DML hidden in unsupported constructs
28. Too many tables
29. Too many joins
30. Cartesian join
31. SELECT without LIMIT
32. LIMIT 50
33. LIMIT 100
34. LIMIT 101
35. LIMIT 1000
36. Unauthorized JOIN table
37. Cross-domain query
38. SELECT *
39. Result size violation
40. Authorization service unavailable


============================================================
42. SECURITY INVARIANTS
============================================================

These must be tested explicitly.

Invariant 1:

NO rejected query reaches Databricks.

Invariant 2:

NO unauthorized table reaches Databricks.

Invariant 3:

NO DML reaches Databricks.

Invariant 4:

NO DDL reaches Databricks.

Invariant 5:

NO DCL reaches Databricks.

Invariant 6:

NO multi-statement request reaches Databricks.

Invariant 7:

NO query above the hard row limit reaches Databricks.

Invariant 8:

If authorization cannot be established, the query does not execute.

Invariant 9:

If SQL cannot be parsed safely, the query does not execute.

Invariant 10:

Future LLM-generated SQL must pass the exact same security pipeline.


============================================================
43. MOCKING / TEST ARCHITECTURE
============================================================

Policy tests should not require a real Databricks connection.

Mock the executor.

Prove:

Rejected request
    |
    X
Executor never called

Authorized request
    |
    v
Executor called exactly once

This makes the security boundary testable and deterministic.

Integration tests can separately validate Databricks connectivity.


============================================================
44. OBSERVABILITY
============================================================

Capture:

request_id
latency
policy evaluation latency
authorization latency
Databricks execution latency
rows returned
errors
policy violations
authorization failures

Use the existing FastAPI application's logging conventions.

Do not introduce an external observability platform in V0 unless already present in the template.


============================================================
45. PROJECT STRUCTURE
============================================================

Adapt to the existing FastAPI template.

Conceptually, the architecture should contain:

API
    query routes

Application
    DataAccessGateway

Domain
    models
    policies
    interfaces

Infrastructure
    Databricks client
    Unity Catalog client
    audit implementation

Security
    SQL parser
    SQL policy
    authorization

Tests
    unit
    integration
    security

Do not blindly create this exact folder structure if the existing template uses another clean convention.

Preserve the existing architecture.


============================================================
46. IMPLEMENTATION SEQUENCE
============================================================

DO NOT implement everything in one giant change.

Work incrementally.

PHASE 0A — REPOSITORY ANALYSIS

First:

- inspect repository
- understand architecture
- identify extension points
- identify existing dependencies
- identify configuration
- identify authentication
- identify testing
- identify logging

Do not modify files during this analysis step.

Return:

1. current architecture
2. proposed V0 mapping
3. files to add
4. files to modify
5. dependencies to add
6. risks and assumptions

Then wait for implementation direction if the environment requires it.


PHASE 0B — DOMAIN FOUNDATION

Implement:

- request models
- identity context
- policy models
- authorization models
- execution models
- error model


PHASE 0C — SQL SECURITY

Implement:

- SQL parser
- AST
- statement classification
- multi-statement detection
- table extraction
- column extraction
- SELECT * detection


PHASE 0D — GOVERNANCE

Implement:

- read-only policy
- table limits
- join limits
- LIMIT rules
- result-size policy
- cross-domain policy
- complexity checks


PHASE 0E — AUTHORIZATION

Implement:

- AuthorizationProvider
- UnityCatalogClient abstraction
- Databricks authorization integration
- fail-closed behavior


PHASE 0F — QUERY REWRITING

Implement:

- default LIMIT
- hard LIMIT
- safe query transformation


PHASE 0G — EXECUTION

Implement:

- Databricks SQL Warehouse executor
- statement execution
- polling/retrieval
- result mapping


PHASE 0H — AUDIT

Implement:

- request IDs
- structured audit events
- security events


PHASE 0I — FASTAPI

Expose:

POST /query


PHASE 0J — TESTING

Implement the full security test suite.


PHASE 0K — END-TO-END

Run:

authorized SELECT
unauthorized SELECT
DELETE
DROP
multi-statement
LIMIT violation
unauthorized JOIN

After each phase:

- run tests
- inspect failures
- fix failures
- ensure no security invariant has regressed
- do not proceed if security tests fail


============================================================
47. V0 DEMONSTRATION
============================================================

The final V0 should support:

POST /query

{
    "user_id": "alice@company.com",
    "sql": "SELECT * FROM dental_prod.claims.claim_header"
}

Pipeline:

Request
  |
  v
Identity
  |
  v
AST
  |
  v
SELECT only
  |
  v
Table discovery
  |
  v
Authorization
  |
  v
Governance
  |
  v
LIMIT 50
  |
  v
Databricks
  |
  v
Unity Catalog
  |
  v
Result

Expected:

ALLOW

Effective SQL:

SELECT *
FROM dental_prod.claims.claim_header
LIMIT 50


============================================================
48. NEGATIVE DEMONSTRATIONS
============================================================

DELETE:

DELETE FROM dental_prod.claims.claim_header

Expected:

DML_NOT_ALLOWED


DROP:

DROP TABLE dental_prod.claims.claim_header

Expected:

DDL_NOT_ALLOWED


Multiple statements:

SELECT * FROM dental_prod.claims.claim_header;
DELETE FROM dental_prod.claims.claim_header;

Expected:

MULTIPLE_STATEMENTS


Unauthorized table:

SELECT *
FROM finance_prod.payments.transactions

Expected:

TABLE_ACCESS_DENIED


Excessive LIMIT:

SELECT *
FROM dental_prod.claims.claim_header
LIMIT 1000

Expected:

LIMIT_EXCEEDED


Unauthorized JOIN:

SELECT *
FROM dental_prod.claims.claim_header c
JOIN finance_prod.payments.transactions p
    ON c.claim_id = p.claim_id

Expected:

TABLE_ACCESS_DENIED

The executor must NOT be called for any of these.


============================================================
49. COST PRINCIPLES
============================================================

V0 must be cost-effective.

DO NOT:

- start Spark clusters for each request
- create clusters dynamically
- maintain unnecessary always-on compute
- introduce unnecessary databases
- introduce unnecessary microservices
- introduce an LLM
- introduce vector infrastructure

Use:

FastAPI locally
+
Databricks SQL Warehouse
+
Unity Catalog
+
Databricks APIs

The goal is to prove the architecture without unnecessary infrastructure.


============================================================
50. FUTURE VERSION EVOLUTION
============================================================

V0:

Direct SQL
+
FastAPI
+
Security
+
Governance
+
Authorization
+
Databricks

V1:

Add:

- Entra ID
- Microsoft Graph context
- richer metadata
- metadata caching
- enterprise identity
- better audit
- additional policy configuration

But preserve V0.

V2:

Add:

- Cloud CoWork
- natural language
- LLM
- NL-to-SQL

But every generated SQL statement must pass through V0.

V3:

Add:

- agents
- Genie
- semantic layer
- ontology
- business entities
- business metrics

But every executable query must still pass through:

AST
→ Governance
→ Authorization
→ Rewrite
→ Databricks

Future versions may additionally add:

- additional data platforms
- export controls
- approval workflows
- advanced cost governance
- data classification
- policy-as-code
- enterprise metadata
- advanced observability

All must extend the V0 core.


============================================================
51. ARCHITECTURAL COMPATIBILITY RULE
============================================================

When implementing ANY future feature, ask:

"Can this capability be added without changing the fundamental V0 security pipeline?"

If YES:

Implement it as an extension.

If NO:

DO NOT rewrite V0.

Instead:

1. identify the incompatibility
2. design an abstraction/interface
3. preserve the existing V0 contract
4. add a new implementation
5. maintain backward compatibility
6. preserve all V0 security tests

Never solve future requirements by deleting or bypassing the V0 core.


============================================================
52. CODE QUALITY
============================================================

Use:

- Python 3.11+
- type hints
- Pydantic or dataclasses
- dependency injection
- clean interfaces
- structured logging
- unit tests
- integration tests
- deterministic policies
- explicit error handling

Avoid:

- giant files
- giant functions
- business logic inside FastAPI routes
- global mutable state
- regex-based SQL security
- hardcoded credentials
- hardcoded authorization
- hidden security behavior
- duplicated Databricks clients
- unnecessary dependencies


============================================================
53. DOCUMENTATION
============================================================

Create or update README documentation explaining:

1. What the Enterprise Data Access Gateway is.
2. What V0 provides.
3. Why V0 is the permanent core.
4. Architecture.
5. Security model.
6. Authorization model.
7. Governance model.
8. Local setup.
9. Environment variables.
10. How to run FastAPI locally.
11. How to access /docs.
12. How to execute a query.
13. Security test strategy.
14. How future versions extend V0.

Clearly document:

"V0 is not a throwaway prototype."


============================================================
54. DEFINITION OF DONE
============================================================

V0 is complete only when:

[ ] Existing FastAPI template is preserved.

[ ] No parallel application was created.

[ ] Core DataAccessGateway exists independently of FastAPI.

[ ] Identity abstraction exists.

[ ] SQL AST parsing exists.

[ ] Only SELECT/read-only statements are allowed.

[ ] DML is blocked.

[ ] DDL is blocked.

[ ] DCL is blocked.

[ ] Multiple statements are blocked.

[ ] SQL injection/bypass tests exist.

[ ] All physical tables are discovered.

[ ] All referenced tables are authorized.

[ ] Unauthorized tables cause full query rejection.

[ ] Query governance is deterministic.

[ ] SELECT * is governed.

[ ] Default LIMIT = 50.

[ ] Hard LIMIT = 100.

[ ] Explicit LIMIT > 100 is rejected.

[ ] Query complexity is bounded.

[ ] Result-size governance exists.

[ ] Cross-domain governance exists as an extensible policy.

[ ] Authorization failures fail closed.

[ ] SQL parsing failures fail closed.

[ ] Databricks SQL Warehouse is used for execution.

[ ] Spark clusters are not started for queries.

[ ] Unity Catalog remains final enforcement.

[ ] No application permission-grant mechanism exists.

[ ] No credentials are hardcoded.

[ ] No secrets are logged.

[ ] Audit events exist.

[ ] Security invariants are tested.

[ ] Blocked queries never reach the executor.

[ ] Future LLM-generated SQL can enter the existing pipeline without redesign.

[ ] Architecture supports additive V1/V2/V3 development.

[ ] V0 code is reusable and not notebook-specific.


============================================================
55. FINAL ARCHITECTURAL PRINCIPLE
============================================================

The most important design principle for this project is:

THE INPUT CAN CHANGE.
THE INTELLIGENCE CAN CHANGE.
THE INTERFACE CAN CHANGE.
THE SEMANTIC LAYER CAN CHANGE.

BUT THE SECURITY BOUNDARY MUST REMAIN.

Today:

Human
  |
  v
SQL
  |
  v
V0 Core

Tomorrow:

Cloud CoWork
  |
  v
Natural Language
  |
  v
LLM
  |
  v
SQL
  |
  v
V0 Core

Later:

Cloud CoWork
  |
  v
Agent
  |
  v
Ontology / Semantic Layer
  |
  v
SQL
  |
  v
V0 Core

The V0 core is therefore the permanent governed execution boundary.

Build it as a real foundation, not as a temporary POC.

Do not optimize for minimum code.

Optimize for:

- correctness
- security
- deterministic governance
- extensibility
- testability
- backward compatibility
- enterprise readiness


============================================================
56. FIRST ACTION
============================================================

DO NOT START CODING IMMEDIATELY.

First inspect the existing FastAPI repository.

Do not modify any files in the first step.

Report:

1. Existing architecture
2. Existing FastAPI entry point
3. Existing routers
4. Existing configuration system
5. Existing authentication/authorization components
6. Existing dependency management
7. Existing test structure
8. Existing logging/error handling
9. Recommended V0 integration points
10. Files that should be created
11. Files that should be modified
12. Dependencies that should be added
13. Any architectural conflicts or risks

Then propose the implementation plan.

After that, implement V0 incrementally, preserving the existing FastAPI template and treating the V0 security/governance core as permanent.
