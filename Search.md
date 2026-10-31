Global Semantic Search — Enterprise CRM Platform Architecture and Implementation Plan

ROLE AND EXPECTATIONS

Act as a Principal Software Architect, Staff Engineer, Search Infrastructure Specialist, and AI Platform Engineer.

You are responsible for architecting a production-grade Global Search capability for an existing metadata-driven, multi-tenant CRM platform.

This is not a proof of concept, hackathon implementation, or an isolated AI experiment.

Global Search is intended to become a major platform capability and potentially a differentiating feature of the CRM product. The implementation must be scalable, secure, backward-compatible, metadata-driven, cost-conscious, observable, resilient, and maintainable.

We intend to use a strong reasoning model to plan the entire initiative before implementation.

IMPORTANT: You are currently operating in PLAN MODE.

Do not implement anything yet.

Do not modify source files, create migrations, install packages, change infrastructure, or make code changes.

Your first responsibility is to thoroughly investigate the existing repositories and produce a comprehensive architecture and implementation plan.

Do not assume that a capability exists simply because it is described in this prompt. Verify everything against the actual codebase, configuration, dependency versions, infrastructure definitions, and available documentation.

Where information is missing, explicitly identify the gap rather than inventing an implementation detail.

⸻

1. EXISTING PRODUCT AND ARCHITECTURE CONTEXT

We are building a metadata-driven, multi-tenant CRM platform with configurable entities, attributes, relationships, workflows, filters, and reporting.

The platform is designed to support multiple business domains, including:

* Lead and opportunity management.
* Insurance management.
* Loan and financial services management.
* Custom tenant-defined entities and attributes.
* Configurable workflows and business processes.

The platform must support different tenants having different metadata definitions while maintaining backward compatibility.

Existing technology stack

Investigate and verify the actual implementation of the following technologies.

Frontend

* Next.js.
* React.
* TypeScript.
* Existing CRM global navigation and search interfaces.
* Existing filter and table components.

Backend

* NestJS.
* Existing API architecture and modules.
* MongoDB-compatible database connections.
* Existing authentication and authorization infrastructure.

Database

We have existing connectivity abstractions/configurations for:

1. Azure Cosmos DB for MongoDB vCore / Azure DocumentDB.
2. Azure Cosmos DB for MongoDB RU-based API.

Both deployment types must be considered in the proposed architecture.

Do not assume that they expose identical MongoDB commands, aggregation stages, index types, or vector-search capabilities.

Investigate their actual compatibility and feature support.

Messaging and asynchronous processing

* RabbitMQ.
* Existing tenant-scoped outbox events.
* Existing consumers and event workflows.
* Existing lead create, update, and conversion lifecycle events.
* Existing lifecycle email and other event-processing workflows.

The NestJS API is already involved in publishing and consuming selected lifecycle events. A separate tenant API also consumes lead lifecycle events.

Do not introduce a competing event architecture without first understanding the existing implementation.

AI infrastructure

Our organization provides an internal AI wrapper API.

This wrapper is already integrated into the CRM for an existing chatbot.

It provides:

1. Chat completion endpoint.
2. Embedding endpoint.
3. Enterprise guardrails.
4. PII/SPI redaction layers.
5. Organization-approved model access and governance.

We must reuse these existing integrations wherever appropriate.

Do not introduce direct OpenAI SDK calls, direct third-party model calls, or a new embedding provider without explicit architectural justification.

The AI wrapper is a governed enterprise integration, not simply a model endpoint.

⸻

2. EXISTING SEARCH CAPABILITIES

The CRM already has:

1. Keyword-based search.
2. Structured filter-based search.
3. Metadata-driven filters.
4. Entity-specific search functionality.

The objective is to introduce a new GLOBAL SEARCH capability that complements these existing capabilities.

Do not replace or break the current search and filter implementations.

The new search architecture must support:

* Exact keyword search.
* Fuzzy or typo-tolerant search where appropriate.
* Semantic search.
* Hybrid keyword + semantic search.
* Structured filtering.
* Entity filtering.
* Tenant isolation.
* Record-level authorization.
* Field-level authorization.
* Metadata-driven custom attributes.
* Relationship-aware retrieval as a future capability.
* Natural-language search as a subsequent capability.

We must maintain backward compatibility with existing CRM functionality.

⸻

3. PRIMARY OBJECTIVE

Design and plan a production-grade Global Semantic Search capability.

A user should be able to search across different CRM entities using natural language, without knowing the exact words, field names, or entity structures used in the database.

Examples:

Example 1: Semantic lead search

“Find customers interested in protecting their family’s financial future.”

This should find records whose notes, descriptions, or relevant contextual information convey similar meaning, even if the exact wording differs.

Example 2: Semantic search with structured conditions

“Find qualified leads assigned to my team that haven’t been contacted in the last 30 days.”

This requires combining:

* Semantic retrieval.
* Lead entity selection.
* Status filtering.
* Ownership and team permissions.
* Activity or last-contacted information.

Example 3: Cross-entity search

“Find customers who discussed insurance but haven’t converted into opportunities.”

This could involve:

* Lead records.
* Contact records.
* Opportunity records.
* Related activity records.

Relationship-aware retrieval must be investigated and designed without assuming that all relationship data needs to be embedded into a single document.

Example 4: Exact lookup

“Rahul Sharma”

This should continue to prioritize exact and lexical matches rather than unnecessarily relying on semantic similarity.

Example 5: Tenant-defined entities

A tenant introduces a custom entity such as Loan Application with attributes such as:

* Loan Amount.
* Employment Type.
* Credit Category.
* Application Status.

The search platform should be able to include this entity through metadata configuration rather than requiring a completely new hardcoded indexing implementation.

⸻

4. FIRST TASK: COMPREHENSIVE CODEBASE DISCOVERY

Before proposing an architecture, inspect the repositories.

Do not jump directly into implementation recommendations.

Investigate the following areas.

4.1 Database architecture

Identify:

* How MongoDB connections are configured.
* How Cosmos DB MongoDB vCore connections are configured.
* How RU-based Cosmos MongoDB connections are configured.
* Whether database selection is tenant-specific.
* Whether the application supports multiple database deployment types simultaneously.
* How collections are created and managed.
* How database indexes are created.
* Whether schema or collection initialization is centralized.
* How MongoDB aggregation pipelines are implemented.
* How existing metadata is stored and retrieved.

Identify the actual database driver and version.

Determine which vector-search operators, aggregation stages, and index types are available in each deployment.

Do not assume MongoDB Atlas Vector Search APIs work identically in Azure DocumentDB.

4.2 Metadata architecture

Investigate:

* Entity metadata.
* Attribute metadata.
* Custom fields.
* Field data types.
* Field labels.
* Localized labels.
* Entity relationships.
* Relationship directionality.
* Field-level visibility.
* Record-level permissions.
* Tenant-level metadata customization.
* Metadata versioning and backward compatibility.

Identify how a generic service can discover searchable fields without hardcoding Lead, Contact, or Opportunity attributes.

4.3 Existing search and filtering

Inspect the existing keyword-search and filter-search implementations.

Identify:

* Search APIs.
* Search services.
* Query construction.
* MongoDB aggregation usage.
* Metadata-driven filter translation.
* Pagination.
* Sorting.
* Entity filtering.
* Saved filters.
* Ownership and assignment filtering.
* Authorization checks.

The new global search must integrate with these existing capabilities wherever appropriate.

Avoid duplicating functionality that already exists.

4.4 RabbitMQ and event architecture

Inspect:

* Outbox implementation.
* Event publishing.
* Consumer architecture.
* Tenant-scoped routing.
* Event contracts.
* Retry mechanisms.
* Dead-letter queues.
* Idempotency mechanisms.
* Event versioning.
* Existing lead create/update/convert events.
* Other relevant entity lifecycle events.

Determine how an indexing worker can be integrated into this architecture.

4.5 AI wrapper integration

Find the existing implementation of the company’s AI wrapper.

Identify:

* Chat completion endpoint.
* Embedding endpoint.
* Authentication.
* Request and response contracts.
* Model configuration.
* Embedding dimensions.
* Batch embedding support.
* Maximum input size.
* Maximum token limits.
* Rate limits.
* Timeouts.
* Retry policies.
* PII/SPI redaction.
* Guardrail behaviour.
* Error handling.
* Model versioning.

Reuse existing client abstractions where possible.

Do not create a second implementation of the same AI wrapper integration.

⸻

5. DATABASE VECTOR SEARCH STRATEGY

This is a critical architectural decision.

We need to support both existing Cosmos MongoDB deployment models.

5.1 Azure Cosmos DB for MongoDB vCore / Azure DocumentDB

Investigate native vector-search capabilities.

Evaluate:

* Vector storage.
* Vector indexing.
* IVF.
* HNSW.
* DiskANN.
* Supported dimensions.
* Vector data types.
* Similarity metrics.
* Pre-filtering.
* Tenant filtering.
* Metadata filtering.
* Hybrid keyword and vector retrieval.
* Full-text search capabilities.
* Index creation and management.
* Query performance.
* Version and tier restrictions.
* Operational limitations.

Determine which features are generally available, in preview, or unavailable in the actual target deployment.

Do not use preview-only functionality as a production dependency without explicitly documenting the risk and obtaining approval.

5.2 Azure Cosmos DB for MongoDB RU-based API

Investigate whether the existing RU-based MongoDB API supports native vector search.

Do not assume that vCore vector-search functionality is available in the RU-based API.

Determine:

* Supported vector operations.
* Supported index types.
* Driver compatibility.
* Query compatibility.
* Whether native hybrid search exists.
* Whether a compatible alternative is required.

If native vector search is unavailable, evaluate the following alternatives:

1. Application-managed vector retrieval, only if technically and economically viable.
2. An external search service.
3. Azure AI Search as an optional search provider.
4. Other technically justified Azure-native alternatives.

Do not implement a full vector scan over a large operational collection and present it as a production solution.

5.3 Provider abstraction

Design a database/search capability abstraction.

The application should not scatter deployment-specific vector queries throughout business modules.

Consider an architecture such as:

* SearchProvider interface.
* CosmosMongoVCoreSearchProvider.
* CosmosMongoRuSearchProvider.
* Optional AzureAISearchProvider.

Names are illustrative. Follow existing repository conventions.

The abstraction should support:

* Index initialization.
* Document upsert.
* Document deletion.
* Vector retrieval.
* Keyword retrieval.
* Hybrid retrieval where supported.
* Structured filtering.
* Tenant scoping.
* Pagination.
* Search result normalization.
* Health and capability reporting.

Do not create unnecessary abstraction layers. The abstraction must solve an actual compatibility and maintainability problem.

5.4 Capability discovery

Design a capability matrix so the application knows which search operations are supported by each configured deployment.

For example:

Capability	MongoDB vCore	RU-based MongoDB
Vector storage	Verify	Verify
Native vector indexing	Verify	Verify
ANN search	Verify	Verify
Keyword search	Verify	Verify
Hybrid retrieval	Verify	Verify
Pre-filtering	Verify	Verify
Metadata filtering	Verify	Verify

Do not fill this table with assumptions.

Verify it against the current Microsoft documentation and the actual deployment versions.

The application must fail clearly when a required feature is unavailable. It must not silently downgrade to a slow or insecure implementation.

⸻

6. SEARCH DOCUMENT ARCHITECTURE

Design a canonical, metadata-driven search document.

We should not indiscriminately embed entire MongoDB documents.

Instead, define a generic searchable projection.

A conceptual example:

{
“id”: “tenant-a_lead_101”,
“tenantId”: “tenant-a”,
“entityType”: “lead”,
“recordId”: “101”,
“title”: “Rahul Sharma”,
“searchableText”: “Interested in family financial protection”,
“attributes”: {
“status”: “qualified”,
“ownerId”: “user-123”
},
“semanticFingerprint”: “sha256-value”,
“embedding”: [],
“embeddingModel”: “approved-model”,
“embeddingVersion”: “version”,
“metadataVersion”: “version”,
“sourceVersion”: 123,
“indexedAt”: “timestamp”
}

This is illustrative, not a mandatory schema.

Determine the optimal document structure after inspecting the existing CRM metadata model.

The search projection should support:

* Tenant identity.
* Entity identity.
* Record identity.
* Human-readable title.
* Searchable text.
* Semantic content.
* Structured filter attributes.
* Ownership and authorization references.
* Metadata version.
* Embedding model version.
* Semantic fingerprint.
* Source record version.
* Indexing timestamps.
* Soft-delete and lifecycle state where applicable.

Investigate whether the projection should live in:

* A dedicated search collection.
* Existing entity collections.
* An external search service.
* A combination of these depending on deployment type.

Prefer a dedicated derived search projection if that improves lifecycle management and prevents unnecessary changes to operational documents.

⸻

7. METADATA-DRIVEN SEARCHABILITY

This is one of the most important requirements.

We cannot hardcode searchable fields for Leads, Contacts, Opportunities, or custom entities.

Design a generic mechanism that uses existing metadata.

For each attribute, consider configurable properties such as:

* Is searchable?
* Is semantically searchable?
* Is exact-match searchable?
* Is filterable?
* Is facetable?
* Should it be included in semantic text?
* Is it sensitive?
* Is it restricted by field-level permissions?
* What is its data type?
* How should it be normalized?
* What is its display label?

These properties must integrate with the existing metadata architecture.

Do not introduce an entirely separate metadata registry if the CRM already has an equivalent mechanism.

Important distinction

Not all searchable fields should be embedded.

Examples:

* Customer name: lexical and potentially semantic.
* Email: exact/normalized lookup.
* Phone number: exact/normalized lookup.
* Description: semantic and lexical.
* Interaction notes: semantic and lexical.
* Status: structured filtering.
* Owner ID: structured filtering and authorization.
* Monetary value: numeric filtering and sorting.
* Date fields: date filtering and sorting.

Design field-selection rules accordingly.

Consider localization, multilingual search, and tenant-specific display labels.

⸻

8. EMBEDDING GENERATION ARCHITECTURE

Reuse the existing company embedding endpoint.

Do not introduce another embedding provider.

Design a reusable embedding service responsible for:

* Input normalization.
* Approved model selection.
* Batch requests where supported.
* Single-input fallback where appropriate.
* Token-limit management.
* Rate limiting.
* Retry handling.
* Timeouts.
* Response validation.
* Dimension validation.
* Model version tracking.
* Error observability.

8.1 Initial indexing

Existing tenants may already contain large amounts of data.

Design a resumable backfill process.

Requirements:

* Tenant-aware processing.
* Configurable batch sizes.
* Bounded concurrency.
* Cursor-based pagination.
* Batch embedding where supported.
* Checkpoint persistence.
* Retry failed batches.
* Progress reporting.
* Pause/resume.
* Backpressure.
* Rate-limit handling.
* Reconciliation.
* No uncontrolled memory consumption.

Initial indexing must not block normal CRM operations.

8.2 Incremental indexing

For newly created or updated records, integrate with RabbitMQ.

The indexing pipeline should:

1. Receive a tenant-scoped lifecycle event.
2. Load the authoritative record.
3. Resolve current metadata.
4. Construct semantic content.
5. Calculate a deterministic fingerprint.
6. Compare with the previously indexed semantic fingerprint.
7. Generate an embedding only when semantic content has changed.
8. Update structured search attributes independently.
9. Persist indexing state.
10. Handle retries and failures safely.

A status change should not trigger embedding generation if status is not part of semantic content.

An ownership change should not trigger embedding generation unless the semantic content itself changes.

A new conversation note may require re-embedding if it changes the semantic representation.

8.3 Avoid unnecessary re-embedding

Introduce a robust semantic content fingerprint.

Consider:

* Normalization.
* Deterministic field ordering.
* Metadata changes.
* Removed attributes.
* Localized values.
* Null and empty values.
* Model changes.
* Embedding version changes.

Do not use a simple record updatedAt timestamp as the only indicator of embedding changes.

8.4 Model migrations

Design for future embedding model upgrades.

The architecture must support:

* Model versioning.
* Embedding dimension changes.
* Controlled re-embedding.
* Dual-version migration where necessary.
* Rollback.
* Reindexing without disrupting active search.
* Compatibility between document and query embeddings.

Never compare vectors generated by incompatible embedding models or dimensions.

⸻

9. EVENT CONSISTENCY AND INDEXING RELIABILITY

The indexing process is asynchronous.

Design for:

* Duplicate event delivery.
* Out-of-order events.
* Delayed event processing.
* Failed embedding requests.
* Failed database writes.
* Partial indexing.
* Database outages.
* RabbitMQ outages.
* Tenant metadata changes.
* Record deletion.
* Tenant reassignment.
* Record conversion.
* Ownership changes.
* Permission changes.

Use source record versions or equivalent ordering safeguards.

An older event must never overwrite a newer indexed representation.

Consider a durable indexing-state collection if the existing architecture does not already provide an equivalent mechanism.

Define:

* Pending.
* Processing.
* Indexed.
* Retryable failure.
* Permanent failure.
* Deleted.
* Reconciliation required.

The search index must eventually converge with the authoritative CRM data.

⸻

10. GLOBAL SEARCH QUERY ARCHITECTURE

Design a unified search API in NestJS.

The search API must support different query types without requiring separate implementations for each CRM entity.

Consider a normalized search request containing:

* Query text.
* Tenant context.
* Entity types.
* Search mode.
* Structured filters.
* Sorting.
* Pagination.
* Optional result count.
* Search scope.

Possible modes:

1. Exact/keyword.
2. Semantic.
3. Hybrid.
4. Structured-filter-assisted search.

Do not force every request through an LLM.

Simple exact searches should remain fast and inexpensive.

10.1 Query-time embedding

For semantic and hybrid search:

1. Authenticate the user.
2. Resolve tenant context.
3. Resolve authorization context.
4. Validate query and scope.
5. Call the existing embedding endpoint.
6. Validate vector dimensions and model compatibility.
7. Execute retrieval with mandatory tenant and permission filters.
8. Normalize and rank results.
9. Validate access to returned records.
10. Return normalized search results.

Do not expose sensitive fields in the search response merely because they were present in the search projection.

10.2 Hybrid retrieval

Evaluate the capabilities of each database provider.

Where native hybrid search is available, investigate using it.

Where it is not available, design an application-level fusion strategy.

Evaluate Reciprocal Rank Fusion (RRF) and alternative ranking approaches.

Avoid arbitrary combinations of incomparable raw keyword and vector scores.

Preserve exact-match priority for identifiers, email addresses, phone numbers, and names where appropriate.

10.3 LLM-assisted query interpretation

The existing chat completion endpoint may be used for a future natural-language query planner.

For example:

“Show qualified leads assigned to my team that haven’t been contacted in 30 days.”

The LLM may interpret this into a structured search plan.

However:

* The LLM must never directly generate executable MongoDB queries.
* The LLM must not bypass authorization.
* The LLM must not invent entity fields or relationships.
* The LLM output must be validated against metadata.
* The output must be translated into a safe internal query representation.
* The application must enforce allowed operators and filter limits.
* Tenant and user context must be injected and enforced by trusted backend code.

Treat LLM interpretation as an optional layer, not a mandatory dependency for core semantic retrieval.

⸻

11. TENANT ISOLATION AND AUTHORIZATION

This is a non-negotiable requirement.

Investigate the existing CRM security architecture.

Global Search must respect:

* Tenant isolation.
* User authentication.
* Role-based access.
* Record-level permissions.
* Ownership.
* Team visibility.
* Sharing rules.
* Field-level restrictions.
* Custom entity permissions.
* Tenant-specific metadata.

Never rely on the frontend to enforce these rules.

Mandatory tenant and permission constraints must be applied during retrieval wherever supported.

Do not retrieve unrestricted cross-tenant results and filter them afterward.

Search results must not leak information through:

* Titles.
* Snippets.
* Matched text.
* Counts.
* Facets.
* Ranking.
* Suggestions.
* Debug information.

PII/SPI considerations

Our company AI wrapper has PII/SPI redaction layers.

Use the existing governed embedding endpoint.

Investigate what text is redacted and how redaction affects semantic search.

Do not assume redaction is sufficient to authorize storing raw source text or embeddings.

Define:

* Which fields may be embedded.
* Which fields may be indexed lexically.
* Which fields must be excluded.
* How sensitive information is handled.
* Whether embeddings themselves require additional protection.
* How deletion and retention policies apply.

Preserve exact phone/email lookup through an appropriately secured search path.

⸻

12. ENTITY RELATIONSHIPS AND CROSS-ENTITY SEARCH

The CRM has relationships between entities.

Examples:

* Lead to Contact.
* Lead to Opportunity.
* Contact to Opportunity.
* Activities associated with Leads and Contacts.
* Tenant-defined entity relationships.

Do not assume that all related content should be copied into the parent entity’s embedding.

Investigate multiple strategies:

1. Independent semantic documents per entity.
2. Independent documents per activity or interaction.
3. Relationship metadata stored alongside search documents.
4. Retrieval followed by controlled relationship expansion.
5. Query-time joins or secondary lookups.

Evaluate their relevance, performance, index size, and consistency implications.

The architecture should support future cross-entity search without forcing expensive re-embedding of unrelated records.

⸻

13. PERFORMANCE, SCALE AND COST

Our initial planning baseline is:

* 100,000 searchable records.
* 1,536 embedding dimensions.
* Primarily business-hours traffic.
* Azure deployment in the same region as Cosmos DB.

These are initial assumptions, not permanent capacity limits.

Evaluate:

* Vector index memory.
* Storage.
* HNSW/IVF/DiskANN suitability where supported.
* Query latency.
* Indexing throughput.
* Batch embedding costs.
* Query embedding costs.
* Database RU consumption where applicable.
* Cluster tier requirements.
* Scaling limits.
* Concurrent queries.
* Index rebuild costs.
* Backup and recovery.
* Operational costs.

Do not assume that using native vector search automatically makes the feature cheaper.

Compare the true total cost of ownership for supported deployment options.

Consider growth scenarios:

* 100K records.
* 1M records.
* 10M records.

Do not recommend unnecessary infrastructure upgrades.

Also evaluate whether maintaining a dedicated search projection in Cosmos DB is more efficient than embedding every operational document.

⸻

14. OBSERVABILITY AND OPERATIONS

Design production-grade observability.

Capture:

Indexing

* Records pending.
* Records processed.
* Records indexed.
* Embedding generation failures.
* Indexing failures.
* Retry counts.
* Dead-letter events.
* Index freshness.
* Backfill progress.
* Reconciliation discrepancies.

Search

* Search latency.
* P50/P95/P99.
* Search mode.
* Entity distribution.
* Zero-result queries.
* Result counts.
* Vector retrieval latency.
* Keyword retrieval latency.
* Embedding endpoint latency.
* Search errors.

Cost

* Embedding requests.
* Embedding tokens.
* Average batch size.
* Query volume.
* RU consumption where applicable.
* Search infrastructure consumption.

Do not log raw sensitive search text or PII/SPI unnecessarily.

Use existing Sentry, logging, tracing, and observability conventions.

⸻

15. SEARCH RESULT CONTRACT AND FRONTEND EXPERIENCE

Inspect the existing Next.js global search and navigation architecture.

Design a unified response contract.

Each result should support:

* Record ID.
* Tenant ID where appropriate internally.
* Entity type.
* Entity display name.
* Record title.
* Relevant description or safe snippet.
* Match type.
* Relevance score or rank.
* Matched fields where safe.
* Navigation URL or route information.
* Optional entity icon.
* Relevant metadata.

The frontend should support:

* Global search entry point.
* Search-as-you-type where appropriate.
* Debouncing.
* Loading states.
* Empty states.
* Error handling.
* Entity filters.
* Search-mode selection if appropriate.
* Pagination or progressive loading.
* Result grouping.
* Deep linking into the existing CRM record pages.

Do not redesign the entire CRM navigation.

Reuse existing design system components and conventions.

Ensure that exact search remains responsive and is not unnecessarily dependent on embedding generation.

⸻

16. TESTING STRATEGY

Develop a comprehensive test plan.

Include:

Unit tests

* Semantic text construction.
* Fingerprint generation.
* Metadata field resolution.
* Query validation.
* Provider capability selection.
* Ranking/fusion.
* Event processing.

Integration tests

* Embedding wrapper.
* MongoDB vCore vector retrieval.
* RU-based MongoDB compatibility.
* Index upserts.
* Event-driven indexing.
* Search API.
* Authorization.

Multi-tenant tests

* Tenant isolation.
* Cross-tenant leakage.
* Owner-based filtering.
* Team-level visibility.
* Custom entity permissions.
* Field-level restrictions.

Failure tests

* Duplicate events.
* Out-of-order events.
* Embedding endpoint downtime.
* Database downtime.
* Rate limiting.
* Partial batch failure.
* Invalid embedding dimensions.
* Metadata changes.
* Deleted records.

Search quality tests

Create a representative evaluation dataset containing realistic CRM queries and expected relevant records.

Measure:

* Recall@5.
* Recall@10.
* Precision@5.
* MRR.
* NDCG where appropriate.
* Exact-match accuracy.
* Semantic retrieval quality.
* Hybrid retrieval quality.

Do not treat a successful API response as proof of search quality.

⸻

17. MIGRATION AND ROLLOUT STRATEGY

The feature must be introduced without disrupting existing customers.

Plan for:

1. Feature flags.
2. Tenant-level enablement.
3. Search capability detection.
4. Initial backfill.
5. Backfill checkpoints.
6. Shadow queries where appropriate.
7. Search quality validation.
8. Controlled rollout.
9. Monitoring.
10. Rollback.

Existing keyword and filter search must remain operational.

The system must tolerate partial indexing and tenants that have not yet completed backfill.

Do not make global search dependent on all tenant records being indexed before the feature can launch.

⸻

18. REQUIRED ARCHITECTURE DELIVERABLES

After inspecting the repositories, produce a detailed architecture proposal containing:

1. Existing architecture assessment.
2. Current search implementation assessment.
3. Database capability matrix.
4. Recommended search-provider architecture.
5. Canonical search document design.
6. Metadata-to-search mapping strategy.
7. Embedding lifecycle.
8. Initial backfill design.
9. Incremental indexing design.
10. Event consistency and retry strategy.
11. Search query architecture.
12. Hybrid ranking design.
13. Authorization and tenant isolation.
14. Relationship-aware retrieval design.
15. NestJS API design.
16. Next.js frontend integration.
17. Observability.
18. Performance and cost estimates.
19. Security and privacy assessment.
20. Migration and rollout plan.

For each major architectural decision, provide:

* The problem being solved.
* Available alternatives.
* Advantages and disadvantages.
* Operational implications.
* Performance implications.
* Cost implications.
* Security implications.
* Your recommendation.
* Why the recommendation is appropriate for this CRM.

Clearly distinguish verified facts, assumptions, and unresolved questions.

⸻

19. IMPLEMENTATION PLAN

After completing the architecture, produce an implementation roadmap with clearly separated phases.

Each phase must contain:

* Objective.
* Scope.
* Repository/module changes expected.
* Dependencies.
* API contracts.
* Database changes.
* Event changes.
* Configuration changes.
* Tests.
* Acceptance criteria.
* Rollback strategy.
* Risks.

The implementation must be incremental and independently verifiable.

Do not create a plan that requires rewriting the existing search architecture unnecessarily.

Avoid overengineering.

At the same time, do not sacrifice security, data consistency, or backward compatibility for implementation speed.

⸻

20. IMPORTANT ENGINEERING CONSTRAINTS

Follow these rules throughout the architecture exercise:

1. Reuse existing code and infrastructure where appropriate.
2. Do not duplicate existing AI wrapper integrations.
3. Do not bypass company guardrails or PII/SPI redaction.
4. Do not introduce direct OpenAI SDK dependencies.
5. Do not assume Cosmos MongoDB vCore and RU-based Cosmos MongoDB have identical vector-search support.
6. Do not introduce Azure AI Search as a mandatory dependency if native capabilities satisfy the requirements.
7. Keep Azure AI Search as a possible alternative provider for deployments that cannot support required native capabilities.
8. Do not introduce PostgreSQL, Redis vector search, or another database without a compelling justification.
9. Do not embed every database field.
10. Do not regenerate embeddings for changes that do not affect semantic content.
11. Do not synchronously generate embeddings inside regular CRM write APIs.
12. Do not trust LLM-generated database queries.
13. Do not bypass tenant or record authorization.
14. Do not use full collection scans as a production vector retrieval strategy.
15. Do not introduce breaking changes to existing APIs or metadata contracts.
16. Follow existing repository conventions and coding standards.
17. Keep the architecture backward-compatible.
18. Make indexing idempotent and recoverable.
19. Design for future embedding model changes.
20. Do not modify code while in Plan Mode.

⸻

21. FINAL INSTRUCTIONS

Your first response should NOT be an implementation.

Start by inspecting the actual repositories and producing a structured discovery report.

Then develop the architecture proposal.

If the repositories contain multiple applications or services, identify the responsibilities and boundaries of each.

If information is missing, ask focused questions and explain why the answers matter.

Do not ask questions whose answers can be discovered through code inspection.

Do not produce a generic architecture that could apply to any CRM. Every recommendation must be grounded in the actual implementation and existing platform constraints.

Challenge the proposed architecture when you identify a better approach.

Prioritize correctness, security, backward compatibility, maintainability, operational simplicity, and cost-effectiveness.

The final outcome of this Plan Mode exercise must be a complete, technically justified, repository-aware implementation blueprint for Global Semantic Search across the CRM platform.

Do not start implementation until the architecture and phased plan have been reviewed and explicitly approved.
