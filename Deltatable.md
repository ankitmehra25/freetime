V1 DELTA — ENTERPRISE ENTITLEMENT & DATA-ASSET METADATA

IMPORTANT:
You have already implemented the V1 Enterprise Citizen Data Gateway from the previous prompt.

DO NOT rebuild, rewrite, or refactor the existing V1 architecture.

DO NOT recreate existing functionality.

First inspect the current codebase and identify what already exists.

This task is ONLY to add the missing Enterprise Entitlement + Data Asset Metadata capability described below, and integrate it minimally into the existing authorization/query flow.

==================================================
1. WHY THIS CHANGE IS REQUIRED
==================================================

The enterprise architecture already contains an:

"Access Control / Table Metadata"

component.

This is NOT merely:

Business Group -> Data Product

The actual enterprise requirement is:

USER
  ->
Microsoft Entra ID / Microsoft Graph
  ->
User's LDAP / security groups
  ->
Enterprise Entitlement Metadata
  ->
Source System / SOR entitlement
  ->
Data Product
  ->
Data Hub / Physical Assets
  ->
Authorization decision

Important:

A citizen developer may NOT have direct access to the Databricks Unity Catalog/data hub.

That is expected.

For example:

A Dental business citizen developer may belong to an enterprise LDAP/group that already provides entitlement to the Dental Source/SOR.

Our gateway should be able to determine:

"Does this user already have the required enterprise entitlement to the source/business domain associated with this Data Product?"

If YES:

The gateway may authorize the user to consume the corresponding governed Data Product through this platform.

The user does NOT need direct Databricks access merely to be considered business-authorized.

Databricks/Unity Catalog remains the FINAL technical authorization boundary for the execution identity.

DO NOT bypass Unity Catalog.

==================================================
2. ADD A METADATA REPOSITORY
==================================================

Add a persistent metadata repository behind repository/service abstractions.

Do NOT hard-code this in Python dictionaries.

Do NOT make YAML the runtime source of truth.

YAML may remain seed/test configuration if it already exists.

If the current V1 uses SQLite for local development, continue using it.

Do not introduce an external database dependency just for this change.

The repository must be replaceable later with PostgreSQL/Azure SQL/etc.

==================================================
3. REQUIRED METADATA ENTITIES
==================================================

Add the following logical entities.

--------------------------------
A. Domain
--------------------------------

Fields:

- id
- name
- description
- status

Example:

DENTAL

--------------------------------
B. Source System / SOR
--------------------------------

Fields:

- id
- name
- description
- source_type
- status

Example:

DENTAL_CLAIMS_SOR

source_type:

SOR

This represents the business/source system from which the enterprise entitlement originates.

--------------------------------
C. Enterprise LDAP / Group
--------------------------------

Fields:

- id
- name
- description
- status

Examples:

DENTAL_CLAIMS_LDAP
DENTAL_BUSINESS_LDAP
DENTAL_OPERATIONS_LDAP

These are enterprise entitlement groups.

--------------------------------
D. Source Entitlement
--------------------------------

This is the IMPORTANT mapping.

Fields:

- id
- source_system_id
- ldap_group_id
- entitlement_type
- status

Example:

DENTAL_CLAIMS_SOR
       |
       +-- DENTAL_CLAIMS_LDAP
       |
       +-- DENTAL_BUSINESS_LDAP

Meaning:

Membership in one of these enterprise groups provides entitlement to the source/SOR.

Support entitlement_type such as:

QUERY

For V1, keep the model simple.

--------------------------------
E. Data Product
--------------------------------

Fields:

- id
- domain_id
- source_system_id
- name
- description
- status
- version

Example:

DENTAL
  ->
DENTAL_CLAIMS
  ->
DENTAL_CLAIMS_SOR

--------------------------------
F. Data Product Asset
--------------------------------

This represents the physical assets belonging to a logical Data Product.

Fields:

- id
- data_product_id
- data_source_id
- asset_type
- catalog
- schema
- object_name
- description
- status

Example:

DENTAL_CLAIMS
    ->
DATABRICKS
    ->
insurance.dental.claims

DENTAL_CLAIMS
    ->
DATABRICKS
    ->
insurance.dental.provider

DENTAL_CLAIMS
    ->
DATABRICKS
    ->
insurance.dental.member

asset_type:

TABLE or VIEW

--------------------------------
G. Data Source
--------------------------------

Fields:

- id
- name
- type
- environment
- connection_reference
- status

Example:

enterprise-databricks
type = DATABRICKS
environment = DEV

Design the type as extensible:

DATABRICKS
SQL_SERVER
AZURE_SQL
ORACLE
SALESFORCE
API

Only DATABRICKS needs to exist/operate in V1.

NEVER store credentials/secrets in this metadata.

==================================================
4. USER IDENTITY IS DIFFERENT FROM ENTERPRISE ENTITLEMENT
==================================================

Do NOT create a permanent application-owned user-to-LDAP authorization model as the final source of truth.

For the POC, a local/mock identity provider can provide:

alice@company.com
    ->
DENTAL_CLAIMS_LDAP

But the architecture must support:

Microsoft Graph
    ->
user
    ->
group memberships
    ->
enterprise LDAP/groups

later.

Therefore create/use an abstraction such as:

IdentityProvider

and make the authorization service consume:

UserIdentityContext

containing:

- user_id
- email
- groups

Do not scatter Microsoft Graph logic throughout the application.

==================================================
5. AUTHORIZATION ALGORITHM
==================================================

Implement this deterministic authorization flow:

Step 1:
Resolve authenticated user.

Step 2:
Get the user's enterprise groups/LDAPs.

Example:

alice@company.com

groups:

[
  DENTAL_CLAIMS_LDAP,
  DENTAL_BUSINESS_LDAP
]

Step 3:
Resolve the requested Data Product.

Example:

DENTAL_CLAIMS

Step 4:
Resolve the Data Product's Source System.

DENTAL_CLAIMS
    ->
DENTAL_CLAIMS_SOR

Step 5:
Look up Source Entitlement metadata.

Example:

DENTAL_CLAIMS_SOR
    ->
DENTAL_CLAIMS_LDAP
    ->
QUERY

Step 6:
Check whether the user's groups intersect with the groups entitled to that source.

If:

User groups =
[DENTAL_CLAIMS_LDAP]

and:

Source entitlement groups =
[DENTAL_CLAIMS_LDAP]

then:

BUSINESS ENTITLEMENT = ALLOWED

Otherwise:

BUSINESS ENTITLEMENT = DENIED

==================================================
6. IMPORTANT SECURITY DISTINCTION
==================================================

Do NOT interpret:

Business entitlement = ALLOWED

as:

Databricks permission = ALLOWED

They are two different security decisions.

Business entitlement:

"Is this user entitled to consume this Data Product through our Enterprise Data Gateway?"

Technical authorization:

"Can the execution identity technically access this physical asset?"

For Databricks:

Business entitlement
       +
SQL/data-product guardrails
       +
Unity Catalog technical authorization
       =
successful execution

Never bypass Unity Catalog.

==================================================
7. DATA PRODUCT ASSET SCOPE
==================================================

The Data Product Asset metadata MUST be used by the SQL guardrail layer.

Example:

User is authorized for:

DENTAL_CLAIMS

Metadata:

DENTAL_CLAIMS
    ->
insurance.dental.claims
insurance.dental.provider
insurance.dental.member

Generated SQL:

SELECT claim_id
FROM insurance.dental.claims
LIMIT 100

PASS

Generated SQL:

SELECT policy_id
FROM insurance.life.policy
LIMIT 100

FAIL

Reason:

Referenced physical asset is not part of the authorized Data Product.

This check must happen BEFORE execution.

==================================================
8. DO NOT DUPLICATE UNITY CATALOG ACLs
==================================================

The metadata repository must NOT store:

user -> table -> SELECT

as a replacement for Unity Catalog.

Instead:

Enterprise Metadata:

LDAP
  ->
SOR
  ->
Data Product
  ->
Physical Asset

Databricks:

Execution Identity
  ->
Unity Catalog
  ->
Catalog
  ->
Schema
  ->
Table
  ->
Column
  ->
Technical privileges

Keep these layers independent.

==================================================
9. REPOSITORY INTERFACES
==================================================

Create or extend repository abstractions such as:

DomainRepository

SourceSystemRepository

EnterpriseGroupRepository

SourceEntitlementRepository

DataProductRepository

DataProductAssetRepository

DataSourceRepository

The authorization service should use these repositories.

Do NOT directly query database tables from API endpoints.

Suggested methods:

get_user_groups(user_id)

get_source_entitlements(source_system_id)

get_data_product(data_product_id)

get_data_product_source(data_product_id)

get_data_product_assets(data_product_id)

is_user_entitled_to_data_product(user_id, data_product_id)

==================================================
10. API / DEBUGGING ENDPOINTS
==================================================

Extend:

GET /me/access

It should now show the entitlement resolution.

Example:

{
  "user": "alice@company.com",
  "groups": [
    "DENTAL_CLAIMS_LDAP"
  ],
  "entitlements": [
    {
      "source_system": "DENTAL_CLAIMS_SOR",
      "data_products": [
        "DENTAL_CLAIMS"
      ],
      "access": "QUERY"
    }
  ]
}

Also provide:

GET /data-products

GET /data-products/{id}

GET /data-products/{id}/assets

These endpoints are metadata endpoints only.

Do not expose raw data through them.

==================================================
11. SEED DATA
==================================================

Create minimal Dental test data.

Domain:

DENTAL

Source:

DENTAL_CLAIMS_SOR

Enterprise groups:

DENTAL_CLAIMS_LDAP
DENTAL_BUSINESS_LDAP
PET_CLAIMS_LDAP

Source entitlement:

DENTAL_CLAIMS_SOR
    ->
DENTAL_CLAIMS_LDAP
    ->
QUERY

DENTAL_CLAIMS_SOR
    ->
DENTAL_BUSINESS_LDAP
    ->
QUERY

Data Product:

DENTAL_CLAIMS

Data Product source:

DENTAL_CLAIMS
    ->
DENTAL_CLAIMS_SOR

Assets:

DENTAL_CLAIMS
    ->
insurance.dental.claims

DENTAL_CLAIMS
    ->
insurance.dental.provider

DENTAL_CLAIMS
    ->
insurance.dental.member

Test users:

alice@company.com
    ->
DENTAL_CLAIMS_LDAP

bob@company.com
    ->
PET_CLAIMS_LDAP

Expected:

Alice:
    DENTAL_CLAIMS = ALLOWED

Bob:
    DENTAL_CLAIMS = DENIED

==================================================
12. QUERY FLOW INTEGRATION
==================================================

Modify the existing V1 query orchestrator minimally.

The final flow should be:

Request
  ->
Identity
  ->
Enterprise Group Resolution
  ->
Source Entitlement
  ->
Data Product Entitlement
  ->
Semantic Resolution
  ->
Genie / LLM
  ->
SQL AST Validation
  ->
Data Product Asset Scope Validation
  ->
Databricks
  ->
Unity Catalog
  ->
Result
  ->
Audit

If business entitlement fails:

STOP immediately.

Do NOT call Genie.

Do NOT call OpenAI.

Do NOT execute Databricks.

==================================================
13. TESTS
==================================================

Add only focused tests for this delta.

Test:

1. User with DENTAL_CLAIMS_LDAP can access DENTAL_CLAIMS.
2. User with DENTAL_BUSINESS_LDAP can access DENTAL_CLAIMS.
3. User with PET_CLAIMS_LDAP cannot access DENTAL_CLAIMS.
4. User with no enterprise group cannot access DENTAL_CLAIMS.
5. Authorized user can resolve Dental assets.
6. Unauthorized physical table is rejected by asset scope validation.
7. Business authorization happens before Genie/LLM invocation.
8. Business entitlement does not bypass Unity Catalog technical authorization.
9. Existing V0 SQL guardrails continue to work.
10. Existing V1 tests continue to pass.

==================================================
14. DO NOT DO THESE THINGS
==================================================

DO NOT:

- Rewrite the V1 architecture.
- Replace existing working code unnecessarily.
- Build a UI.
- Build Microsoft Graph integration yet if credentials/access are unavailable.
- Build SQL Server/Azure SQL adapters.
- Build a new LLM.
- Build a new Genie implementation.
- Build a complex policy engine.
- Duplicate Unity Catalog permissions.
- Store user-to-table ACLs.
- Store secrets in metadata.
- Introduce microservices.
- Introduce a new database technology if the existing V1 persistence layer can support this model.

==================================================
15. IMPLEMENTATION APPROACH
==================================================

Before changing code:

1. Inspect the existing V1 implementation.
2. Identify existing persistence/database models.
3. Identify existing repository/service abstractions.
4. Reuse them.
5. Add only the missing entities, repositories, services, seed data, API changes, and tests.

Keep the change small and incremental.

Do not regenerate the entire project.

At the end, provide a concise summary of:

- Files added
- Files modified
- Database/schema changes
- New metadata entities
- Authorization flow changes
- Tests added
- How Microsoft Graph will plug into the IdentityProvider later

Most importantly:

The V1 metadata repository must establish this enterprise relationship:

USER
  ->
ENTERPRISE LDAP/GROUP
  ->
SOURCE/SOR ENTITLEMENT
  ->
DATA PRODUCT
  ->
DATA PRODUCT ASSETS
  ->
PHYSICAL DATA HUB TABLES

This is the missing Access Control / Table Metadata capability from the enterprise architecture.
