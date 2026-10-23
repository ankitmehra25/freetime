Architecture Discovery: CRM Outbox, RabbitMQ, Azure Service Bus and Event Consumers

Objective

Inspect the existing codebase and relevant deployment configuration to document the CURRENT messaging architecture of our metadata-driven CRM.

We need to decide whether to retain and harden self-managed RabbitMQ running in AKS, migrate business messaging to Azure Service Bus, or use a hybrid approach.

This is a read-only architecture investigation. Do not modify code, configuration, infrastructure or dependencies. Do not implement solutions.

Inspect all relevant repositories available in the workspace, including:

* Next.js UI / BFF
* NestJS CRM API
* Tenant API
* RabbitMQ configuration and deployment manifests
* Any available shared libraries or proprietary event-framework interfaces

The Tenant API uses a proprietary managed consumer framework. Its internal implementation may be outside the repository scope. Clearly distinguish what the code proves from what remains unknown.

Instructions for reporting

For every question:

1. Describe the CURRENT behavior.
2. Provide evidence: repository, file path, class/function/configuration key and relevant line numbers where available.
3. Identify whether the finding is confirmed, partially confirmed, or unknown.
4. Do not infer runtime behavior from configuration defaults alone.
5. Do not recommend changes yet.
6. Never expose secrets, credentials, connection strings, tokens or sensitive tenant data.
7. If evidence is unavailable, explicitly state what external configuration, runtime inspection or documentation is required.

⸻

1. System architecture and event flow

1. Identify every application and worker involved in the event-driven architecture.
2. Confirm which components publish events, consume events, or do both.
3. Document the complete flow from Next.js HTTP request through NestJS database mutation, outbox publication, RabbitMQ routing, consumer processing and final downstream action.
4. Identify all event types published by the NestJS API.
5. Identify all event types consumed by the NestJS API.
6. Identify all event types consumed by the Tenant API.
7. Identify any other publishers or consumers, including background jobs and external integrations.
8. Document the exact exchange, queue, routing key and event type used for every confirmed message flow.
9. Identify which events have multiple independent consumer services.
10. Distinguish competing consumers sharing one queue from independent subscribers receiving their own copies.
11. Identify synchronous HTTP flows that bypass RabbitMQ.
12. Identify the actual runtime configuration controlling the selected event bus provider.
13. Determine whether RabbitMQ and Azure Service Bus can be enabled simultaneously, selected exclusively, or configured independently for different flows.

2. Tenant resolution and isolation

1. Determine how the tenant ID enters the Next.js BFF and how it is validated.
2. Determine how NestJS resolves the tenant database.
3. Determine how the outbox dispatcher discovers tenant IDs and database names.
4. Identify whether tenant discovery uses polling, a registry, configured lists, API requests, event triggers or a combination.
5. Identify any fallback tenant list and whether it is authoritative.
6. Document how database names are constructed and validated.
7. Determine how MongoDB clients, connection pools, database handles and initialization promises are cached.
8. Confirm whether tenant databases have independent MongoDB clients or share a client and pool.
9. Identify how tenant provisioning, deletion, migration and unavailable databases affect event dispatch.
10. Determine whether tenant IDs are validated against trusted tenant metadata before database access.
11. Determine how tenant IDs are propagated through outbox records, broker routing keys, message payloads and consumers.
12. Identify broker credentials, virtual hosts, queue permissions and other tenant-level isolation controls.
13. Determine how consumers prevent a message for one tenant from accessing another tenant’s database.
14. Identify cross-tenant or system-wide events and how they are handled.

3. Transactional outbox implementation

1. Locate every outbox schema, collection definition, model and repository.
2. Document all outbox record fields, including event ID, tenant ID, event type, payload, status, timestamps, attempts, maximum attempts, availability time, lease expiry, worker ID and error details.
3. Identify every status and the permitted state transitions.
4. Determine whether entity mutations and their corresponding domain outbox records are written in the same MongoDB transaction.
5. Identify operations where transaction support is conditional or unavailable.
6. Determine whether lifecycle email requests are written atomically with entity mutations or appended afterward.
7. Identify all other event paths with a similar database-to-outbox consistency gap.
8. Document the dispatcher trigger mechanism and execution frequency.
9. Document how pending records are selected, sorted, batched and claimed.
10. Determine whether claims are atomic and whether multiple dispatcher replicas can safely process events concurrently.
11. Document the lease duration, lease renewal behavior and stale-lease recovery.
12. Determine whether publication uses RabbitMQ publisher confirms.
13. Determine how unroutable messages, negative confirmations, timeouts and connection failures are handled.
14. Determine exactly when an outbox record is marked published.
15. Trace failure handling for crashes before claiming, after claiming, during publication, after broker confirmation and before updating the outbox record.
16. Document retry scheduling, backoff strategy, maximum attempts and terminal failure states.
17. Determine whether dead-lettered outbox records can be manually replayed.
18. Identify all indexes supporting pending-event lookup, sorting, claiming and tenant filtering.
19. Document the two-month TTL implementation, including the indexed timestamp and exact expiry configuration.
20. Determine whether TTL can delete pending, leased, failed or otherwise unpublished records.
21. Determine whether published records are retained for auditing or replay and whether replay is actually implemented.
22. Determine whether the dispatcher applies tenant fairness, per-tenant concurrency limits and backpressure.

4. RabbitMQ deployment and broker configuration

1. Identify the exact RabbitMQ image, version and deployment method.
2. Determine whether RabbitMQ runs as a Deployment or StatefulSet and document replica count.
3. Identify the AKS namespace, node pool placement and availability-zone configuration where available.
4. Document CPU/memory requests, limits, autoscaling settings and resource constraints.
5. Identify persistent volume claims, storage classes, volume mount paths and storage capacity.
6. Determine whether RabbitMQ definitions, configuration and data survive pod recreation and node failure.
7. Identify backup, restore and disaster-recovery procedures.
8. Determine which exchanges exist, their types, durability settings and alternate-exchange configuration.
9. Identify all queues, routing keys, bindings, queue arguments and ownership.
10. Verify the effective queue type for each critical queue: classic, quorum or another type.
11. Determine whether the statement that queues default to quorum is enforced for every queue or can be overridden.
12. Verify queue durability, message persistence and publisher confirmation settings separately.
13. Determine whether mandatory publishing, returned-message handling or equivalent unroutable-message detection is implemented.
14. Document publisher connection/channel lifecycle, heartbeats, reconnection and recovery.
15. Document consumer acknowledgements, prefetch limits, acknowledgement timeouts and connection recovery.
16. Identify retry exchanges, delayed-retry mechanisms, dead-letter exchanges and dead-letter queues.
17. Determine whether dead-lettered messages can be inspected and redriven.
18. Document TLS, credential storage, secret rotation, RabbitMQ user permissions and virtual hosts.
19. Identify network policies, private networking and external broker access restrictions.
20. Document liveness/readiness probes, disruption budgets, anti-affinity and upgrade procedures.
21. Determine what happens during pod loss, node loss, storage failure and broker restart.
22. Identify monitoring, alerts and operational runbooks for queue depth, message age, unacknowledged messages, disk alarms, connection failures and publish failures.

5. NestJS API publishers and consumers

1. Identify the RabbitMQ publishing abstraction and all direct broker-client usages.
2. Identify the implementation that publishes outbox events.
3. Identify every RabbitMQ consumer registered within the NestJS API repository.
4. Confirm the exact lifecycle queue and event envelope consumed by NestJS.
5. Document the lifecycle consumer’s acknowledgement and failure behavior.
6. Determine whether lifecycle processing applies tenant rules, templates and other business logic before recording delivery.
7. Identify the lifecycle event history or delivery records and their deduplication keys.
8. Document lead imports and external integration jobs, including their configured queue adapters.
9. Determine whether these jobs use RabbitMQ, Azure Service Bus or another provider in each environment.
10. Identify how provider selection is configured and whether it can differ by workload.
11. Determine whether consumer processes run within the API deployment or as separately scaled workers.
12. Identify graceful shutdown, in-flight message handling and duplicate-processing behavior during restarts.

6. Tenant API and proprietary event framework

1. Locate the Tenant API event map and all event method definitions.
2. Document the mapping from lead-created, lead-updated, lead-converted and other event types to queue names and routing keys.
3. Identify all configured event task chains and their execution order.
4. Confirm which chains send agent notifications through the email notification service.
5. Determine how task failures affect message acknowledgement and redelivery.
6. Determine whether successfully completed tasks are repeated when a later task fails.
7. Identify all idempotency or deduplication controls in the Tenant API.
8. Locate queue declarations and verify the AMQP environment flag controlling registration.
9. Identify the exact interface through which the proprietary framework dispatches listeners.
10. Document what is known about listener ownership, acknowledgement, retry, concurrency and scaling.
11. Identify the optional Azure Service Bus listener and its activation conditions.
12. Determine whether RabbitMQ and Service Bus listeners subscribe to the same logical events.
13. Establish whether simultaneous listeners can process the same business event and whether this is prevented by configuration.
14. Identify external framework behavior that cannot be confirmed from repository source.
15. List the additional configuration, package documentation or runtime inspection needed to establish that behavior.

7. Event contracts and notification semantics

1. Create a catalog of all domain event types, including lead, contact, opportunity, case, lifecycle, import, integration and target-related events.
2. Document each event’s schema, version, required fields and tenant context.
3. Distinguish domain event names from RabbitMQ envelope types and routing keys.
4. Document the difference between a lead-created domain event and a lifecycle-email-requested event.
5. Identify which user actions can produce both event paths.
6. Determine whether duplicate emails are possible or intentional and identify evidence for the intended business behavior.
7. Identify event schema versioning and backward-compatibility rules.
8. Determine how unknown event types and invalid payloads are handled.
9. Identify event IDs, correlation IDs, causation IDs, timestamps and trace context.
10. Document ordering requirements for events belonging to the same entity.
11. Determine whether the broker and consumer design preserves any required ordering guarantees.
12. Identify events requiring historical replay, audit retention or independent subscriptions.

8. Consumer reliability and downstream services

1. Determine whether each consumer provides at-least-once processing, at-most-once processing or another documented guarantee.
2. Identify message acknowledgement timing for each consumer.
3. Determine whether a message can be redelivered after processing succeeds but acknowledgement fails.
4. Identify idempotency keys and deduplication storage for each business operation.
5. Determine whether email notifications can be duplicated after retries or consumer restarts.
6. Determine whether downstream SOR/API calls support idempotency keys.
7. Document HTTP timeout, retry, circuit-breaker and rate-limit behavior.
8. Identify whether a failed downstream operation blocks unrelated consumers.
9. Determine how poison messages, invalid payloads and permanently failing integrations are handled.
10. Identify the recovery and redrive procedures for consumer dead-letter queues.
11. Determine whether consumers have independent concurrency limits and resource budgets.
12. Identify how consumer lag, retry rates, delivery failures and end-to-end latency are measured.

9. Scale, throughput and latency

1. Determine current and forecast tenant counts.
2. Identify average, peak and burst event volumes per second and per day.
3. Estimate average and maximum event payload sizes.
4. Identify the number of queues, exchanges, bindings, subscriptions and consumer instances.
5. Determine the average and maximum outbox dispatcher duration per cycle.
6. Determine how many tenant databases are examined per cycle.
7. Identify MongoDB query frequency, connection pool utilization and dispatcher resource consumption.
8. Measure average and maximum queue depth and oldest-message age.
9. Document end-to-end event processing latency and required latency objectives.
10. Identify peak backlog recovery time and the capacity available to catch up.
11. Determine whether large payloads or unusually noisy tenants cause bottlenecks.
12. Identify any consumers requiring independent replay or high-throughput event streaming.

10. Availability, security and disaster recovery

1. Document production availability targets and acceptable messaging interruptions.
2. Identify recovery time objective (RTO) and recovery point objective (RPO).
3. Determine whether the messaging service must survive a pod failure, node failure, availability-zone failure or regional outage.
4. Identify current AKS zone topology, node redundancy and cluster recovery arrangements.
5. Determine how RabbitMQ state is backed up and restored.
6. Identify how tenant database recovery interacts with outbox recovery and message replay.
7. Document message encryption in transit and at rest.
8. Identify access control, managed identity support, secrets handling and credential rotation.
9. Determine how tenant data in event payloads is protected and retained.
10. Identify audit, regulatory, residency and data-isolation requirements.
11. Document the team’s operational ownership, on-call coverage and incident-response procedures.

11. Cost and Azure Service Bus comparison

1. Calculate current incremental RabbitMQ costs: AKS compute, storage, networking, monitoring, backups and operational effort.
2. Identify the additional cost of making RabbitMQ highly available, including the resources needed for a multi-node deployment.
3. Identify the target Azure region and production message volume for pricing estimates.
4. Document the expected number of queues, topics, subscriptions and concurrent consumers.
5. Determine the Azure Service Bus tier being considered and its relevant regional pricing model.
6. Identify expected Service Bus message operations, payload sizes, retries, duplicate detection and dead-letter volumes.
7. Determine whether premium capacity, zone resilience, private endpoints or geo-disaster recovery are required.
8. Identify any existing Azure Service Bus resources, licenses, network configuration or operational capabilities that could affect incremental cost.
9. Compare operational effort for self-managed RabbitMQ against managed Service Bus.
10. Determine the acceptable monthly budget and any procurement constraints.
11. Establish whether lower environments must use the same broker as production.
12. Identify whether different workloads justify different brokers.

12. Migration and target architecture constraints

1. Identify every module directly coupled to RabbitMQ-specific APIs.
2. Determine whether the existing abstraction supports multiple broker providers without changing business logic.
3. Identify the differences between RabbitMQ and Service Bus message envelopes, routing, acknowledgements, retry policies and dead-letter handling.
4. Determine whether the existing outbox publisher can support provider-specific publishing semantics.
5. Identify how event IDs and deduplication would be preserved during a migration.
6. Determine whether a migration could cause duplicate, lost or reordered messages.
7. Identify coexistence and rollback requirements.
8. Document the downtime, deployment sequencing and data migration constraints.
9. Identify the actual requirements for pub/sub fan-out, competing consumers, replay and streaming.
10. Establish measurable acceptance criteria for reliability, latency, cost and recovery.

⸻

Required deliverables

Produce the following reports without changing the code:

1. Current-state architecture: Component diagram and end-to-end event-flow diagrams.
2. Event catalog: Event type, producer, exchange, routing key, queue, consumer and downstream operation.
3. Outbox assessment: Transaction boundaries, claim logic, retries, TTL and failure recovery.
4. RabbitMQ deployment assessment: Effective topology, durability, high availability, persistence and security.
5. Consumer assessment: Acknowledgements, idempotency, failure handling, concurrency and scaling.
6. Tenant isolation assessment: Tenant resolution, database access, routing and authorization boundaries.
7. Configuration inventory: Relevant environment variables, deployment settings and feature flags, with all secret values redacted.
8. Evidence-based gap register: Finding, severity, evidence, current behavior and unresolved questions. Do not propose fixes yet.
9. Workload baseline: Available throughput, latency, queue depth, tenant count and cost measurements; identify missing measurements.
10. Migration constraints: Existing broker abstractions, Service Bus listener behavior, provider-selection logic and coexistence risks.
11. Unknowns register: Every question that cannot be answered from source code and configuration, together with the external evidence needed to answer it.

Final instruction

Do not recommend RabbitMQ, Azure Service Bus or Event Hubs yet. Do not assume that a configured feature is active in production. Separate confirmed implementation facts from inferred behavior and runtime unknowns.

The objective is to establish an accurate, evidence-backed picture of the architecture we have today so that the production messaging decision can be made afterward.
