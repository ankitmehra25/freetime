Perform a deep architectural analysis of this codebase, focusing specifically on the persistence layer and MongoDB access patterns.

I want you to inspect the entire repository and produce a detailed report with evidence from the codebase rather than generic recommendations.

Please analyze the following:

1. Current Architecture

* How MongoDB is accessed throughout the application.
* Repository and service layer organization.
* Database abstraction (if any).
* How aggregation pipelines are constructed and reused.
* Whether there are duplicated query patterns.

2. Domain Model

* Identify all collections and their responsibilities.
* Classify which collections are platform/configuration entities and which are business/domain entities.
* Determine whether the domain model appears static or metadata-driven.

3. Dynamic Metadata

* Analyze how metadata/configuration drives entity behavior.
* Determine whether entity schemas are fixed or dynamic.
* Identify places where tenant-specific behavior is implemented.

4. Aggregation Analysis

* List all aggregation pipelines.
* Identify repeated stages such as tenant filtering, pagination, sorting, lookups, projections, security filtering, etc.
* Suggest opportunities to extract reusable pipeline builders.

5. Mongoose Suitability
    Based on the existing codebase—not generic Node.js best practices—evaluate whether introducing Mongoose would provide meaningful value.

Specifically answer:

* Which collections, if any, would genuinely benefit from Mongoose?
* Which collections should continue using the native MongoDB driver?
* Would adopting Mongoose improve maintainability, or simply add another abstraction?
* Would mixing Mongoose and the MongoDB driver be justified in this architecture?

6. Alternative Designs
    Evaluate these approaches:

* Native MongoDB Driver only
* Mongoose for all collections
* Mongoose only for platform/configuration collections
* A metadata-driven repository/query engine using the native driver

For each option, discuss:

* Maintainability
* Performance
* Complexity
* Developer experience
* Long-term scalability
* Suitability for a metadata-driven multi-tenant CRM platform

7. Repository Design
    Review the existing repositories and recommend improvements.
    Determine whether repositories should remain entity-specific (LeadRepository, ContactRepository, etc.) or evolve into a generic metadata-driven EntityRepository.
8. Future Evolution
    Based on the current architecture, identify any design decisions that could become bottlenecks as the platform evolves toward a configurable CRM similar to Salesforce or Dynamics 365.
9. Refactoring Opportunities
    Provide a prioritized list of improvements with:

* Expected architectural benefit
* Estimated implementation effort
* Risks
* Dependencies

Important instructions:

* Base every conclusion on evidence found in this repository.
* Reference the relevant files, classes, or functions for each observation.
* Clearly distinguish observations from assumptions.
* Avoid generic ORM or MongoDB advice unless it directly applies to this codebase.
* If important architectural information is missing, explicitly state what additional code or modules should be analyzed before making a recommendation.
