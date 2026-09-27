Phase 3 — Build the Reporting UI and Report Builder

1. Context

We are building a metadata-driven, multi-tenant CRM platform.

The application currently supports CRM entities such as:

* Lead
* Opportunity
* Contact
* Tenant-specific/custom fields

The existing application already has a generic filtering foundation.

The Reporting Query Engine has now been implemented as the previous phase.

Existing functionality

The application already has:

* Generic filter utility
* Lead filtering
* Opportunity filtering
* Existing filter operators
* AND / OR filter logic
* Existing operational filter/grouping behavior
* Tenant-specific/custom fields
* Saved Filters
* Saved Filter persistence
* Existing Lead and Opportunity table UI

Reporting backend

Phase 2 has now implemented the Reporting Query Engine and the associated APIs.

The reporting backend supports the reporting query concepts implemented in Phase 2, including as applicable:

* Entity selection
* Existing filter definition
* Dimensions
* Measures
* Aggregations
* Sorting
* Pagination
* Reporting result normalization
* MongoDB/Cosmos execution
* Tenant isolation
* Authorization
* Validation

The Reporting APIs already exist.

⸻

2. Primary Objective

Build the Reporting UI / Report Builder that consumes the existing Reporting APIs.

The goal is to provide users with a usable interface for creating and executing reports without writing code.

The user should be able to:

1. Select an entity
2. Configure filters
3. Select dimensions / Group By fields
4. Select measures
5. Select aggregation types
6. Configure sorting
7. Execute the report
8. View the resulting data
9. Switch between supported visual representations where appropriate

The UI must be metadata-driven.

The frontend must not hardcode tenant-specific fields.

⸻

3. Most Important Rule

Do NOT rebuild the Reporting API

Phase 2 has already implemented the backend reporting APIs.

Before making any changes:

Inspect the Phase 2 implementation and understand the actual API contracts.

Use the existing APIs exactly as they exist.

Do NOT:

* Recreate the reporting service
* Recreate the reporting query compiler
* Recreate MongoDB/Cosmos aggregation
* Create a second reporting endpoint
* Create frontend-side aggregation
* Create frontend-side database queries
* Modify backend contracts unnecessarily

If a small backend change is genuinely required to support the UI, identify it explicitly and make the smallest compatible change.

⸻

4. First Step — Inspect Before Coding

Before implementing the UI, inspect the existing application.

Identify:

Reporting APIs

Find:

* Reporting endpoints
* Request DTOs
* Response DTOs
* Dimension definitions
* Measure definitions
* Aggregation types
* Sorting contract
* Pagination contract
* Validation errors
* Metadata endpoints/services used by reporting

Document the actual API contract before building the UI.

⸻

Existing UI Architecture

Inspect:

* Next.js application structure
* Existing routes
* Existing page/layout conventions
* Existing component architecture
* Existing design system
* Existing Material UI/components if applicable
* Existing table implementation
* Existing filter UI
* Existing form components
* Existing API/client utilities
* Existing React Query usage if present
* Existing loading/error/empty states
* Existing state-management patterns

Reuse existing patterns.

Do not introduce a new UI framework.

⸻

5. Do Not Assume the Existing UI

The current Lead and Opportunity tables already have filtering capabilities.

The reporting UI should reuse the existing filter experience or filter component where practical.

Do not create a completely separate filter builder if the application already has a reusable filter component.

The desired direction is:

Existing Filter UI
        │
        ▼
Existing Filter Definition
        │
        ├── Lead Table
        ├── Opportunity Table
        │
        └── Reporting UI

This keeps filtering behavior consistent across the application.

⸻

6. Initial Reporting Screen

Create a dedicated reporting experience.

Use the existing application’s routing and layout conventions.

Conceptually:

Reports
   │
   └── Report Builder

Do not assume a specific URL.

Use the project’s existing route naming conventions.

⸻

7. Recommended Initial Layout

Build a clean report-builder experience.

Conceptually:

┌──────────────────────────────────────────────────────────┐
│ Reports                              [Run Report]         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Entity                                                   │
│ [ Lead ▼ ]                                               │
│                                                          │
│ Filters                                                  │
│ [ Status ] [ equals ] [ Qualified ] [+ Add Filter]      │
│                                                          │
│ Group By                                                 │
│ [ Status ▼ ]                         [+ Add Grouping]    │
│                                                          │
│ Metrics                                                  │
│ [ Count of Leads ]                  [+ Add Metric]       │
│                                                          │
│ Sort                                                     │
│ [ Count of Leads ] [ Descending ▼ ]                     │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ Results                                                  │
│                                                          │
│ Status          Lead Count                               │
│ ─────────────────────────────                            │
│ New                 4,200                                │
│ Qualified           3,100                                │
│ Converted           2,800                                │
│ Lost                2,442                                │
│                                                          │
└──────────────────────────────────────────────────────────┘

This is a conceptual layout only.

Follow the application’s existing design system.

⸻

8. Entity Selection

The report builder should allow the user to select the reporting entity.

Initially support the entities that the Phase 2 Reporting API actually supports.

For example:

Lead
Opportunity

Do not hardcode fields based on assumptions.

If the existing metadata system provides available entities, use that metadata.

⸻

9. Dynamic Field Selection

Once the user selects an entity, dynamically load or resolve the available fields from the existing metadata system.

Example:

Lead
Fields:
- First Name
- Last Name
- Status
- Agent
- Source
- Created Date
- ...
- Tenant Custom Fields

The UI must not contain:

const leadFields = [...]

unless the project already has a centralized metadata mechanism specifically intended for this.

Use the existing metadata source.

⸻

10. Filter Configuration

The report builder must support filtering using the existing filter definition.

The user should be able to:

Add Filter
    ↓
Select Field
    ↓
Select Operator
    ↓
Enter Value

Example:

Status     equals       Qualified

Multiple filters:

Status       equals       Qualified
AND
Source       equals       Website

Use the application’s existing filter semantics.

Do not implement a second filter language in the UI.

⸻

11. Reuse Existing Filter Component

If an existing reusable filter component exists, use it.

For example, if the current Lead/Opportunity table has:

FilterBuilder

or equivalent functionality, reuse it.

The reporting page should produce the same filter-definition structure already understood by the backend.

This is extremely important.

We want:

Filter UI
    ↓
Existing Filter Definition
    ↓
Reporting API

not:

Reporting Filter UI
    ↓
New Reporting Filter Definition
    ↓
Translation Layer
    ↓
Existing Filter Definition

unless the existing UI architecture makes this unavoidable.

⸻

12. Saved Filters

Existing Saved Filters should be available to the reporting experience.

At minimum, allow the user to select an existing Saved Filter and use it as the report’s filter.

Conceptually:

Filters
[ Select Saved Filter ▼ ]
or
[ Build Filter Manually ]

If the existing Saved Filter UI already has a reusable selector, use it.

Do NOT implement:

* Saved Reports
* Saved Views

in this phase.

Saved Filters already exist and should be reused.

⸻

13. Group By / Dimensions

Add a Group By section.

Example:

Group By
[ Status ▼ ]
+ Add Grouping

Allow multiple dimensions:

Group By
[ Agent  × ]
[ Status × ]
+ Add Grouping

The available fields must come from metadata.

Only fields supported by the Reporting API should be selectable.

⸻

14. Dimension Capability

The UI should distinguish between:

Queryable
Groupable
Aggregatable

where the backend metadata/API exposes these capabilities.

Do not allow users to select an obviously invalid dimension and discover the problem only after submitting.

However, the backend remains the final authority.

Frontend validation is for UX.

Backend validation remains authoritative.

⸻

15. Measures

Add a Metrics / Measures section.

Example:

Metrics
[ Count of Leads ]
+ Add Metric

When adding a metric:

Field:
[ Opportunity Amount ▼ ]
Aggregation:
[ SUM ▼ ]
Display Name:
[ Total Opportunity Amount ]

Support the aggregations exposed by the Phase 2 API.

Potentially:

COUNT
DISTINCT_COUNT
SUM
AVG
MIN
MAX

Do not expose an aggregation if the selected field is incompatible with it.

⸻

16. Count

COUNT should have a simple user-friendly experience.

For example:

Metric:
Count of Leads

The user should not need to understand:

COUNT(*)

The UI translates the user’s selection into the API’s measure definition.

⸻

17. Metric Labels

Allow a friendly display name where the backend contract supports it.

Example:

SUM(opportunityAmount)

could display as:

Total Opportunity Amount

Do not make users work with internal database field names.

Use metadata display names.

⸻

18. Sorting

Add a sorting section.

Example:

Sort By
[ Lead Count ▼ ]
[ Descending ▼ ]

Allow sorting by:

* Dimensions
* Measures

Only expose valid sort fields.

Use the Phase 2 API contract.

⸻

19. Run Report

Provide a clear primary action:

Run Report

When clicked:

UI configuration
      ↓
Report Query
      ↓
Reporting API
      ↓
Report Result
      ↓
Render Result

Do not perform aggregation in the browser.

⸻

20. Loading State

While a report is executing:

* Show a clear loading state
* Prevent duplicate submissions where appropriate
* Keep the report configuration visible
* Do not clear the previous result unnecessarily unless that matches existing application UX

Use existing loading-state conventions.

⸻

21. Error Handling

Handle backend validation errors cleanly.

Examples:

Invalid field
Invalid aggregation
Invalid filter
Unauthorized field
Unsupported operation
Query too complex

Translate technical API errors into useful user-facing messages where possible.

Do not expose raw MongoDB/Cosmos errors to users.

⸻

22. Empty Results

If the query is valid but returns no records, show a proper empty state.

Example:

No data found
Try changing your filters or report configuration.

Do not treat an empty result as an application error.

⸻

23. Report Results Table

The initial and most important visualization should be a table.

The table must be generated dynamically from the Reporting API response.

For example:

┌──────────────┬──────────────┐
│ Status       │ Lead Count   │
├──────────────┼──────────────┤
│ New          │ 4,200        │
│ Qualified    │ 3,100        │
│ Converted    │ 2,800        │
│ Lost         │ 2,442        │
└──────────────┴──────────────┘

Do NOT hardcode columns.

The table should derive its columns from the report result metadata.

⸻

24. Multiple Dimensions in Results

For:

Group By:
Agent
Status
Metric:
Count

render:

Agent      Status       Count
──────────────────────────────
Agent A    New           120
Agent A    Qualified      85
Agent A    Converted      40
Agent B    New           150
Agent B    Qualified      91

The result renderer must be generic.

Do not create special handling specifically for Agent + Status.

⸻

25. Numeric Formatting

Use metadata/result information where available.

Examples:

4200

could display as:

4,200

Currency values should eventually use appropriate currency formatting.

Dates should use the application’s existing date formatting conventions.

Do not create a separate formatting system if one already exists.

⸻

26. Responsive UX

The reporting UI should work appropriately on the supported application screen sizes.

Do not over-optimize for mobile if the CRM is primarily desktop-oriented, but avoid creating a layout that breaks on smaller screens.

Use the existing responsive design system.

⸻

27. Visualization

Once the table-based report is working, introduce basic visualization support only where the Reporting API result is compatible.

Start with a small set of useful visualization types:

Table
KPI
Bar
Line
Pie/Donut

Do not build a massive visualization framework.

⸻

28. Visualization Selection

Provide a simple selector:

View as:
[ Table ▼ ]

Potential options:

Table
Bar Chart
Line Chart
Pie Chart
KPI

Only show visualization types that make sense for the current report.

For example:

KPI

Appropriate for:

COUNT(*)

or:

SUM(amount)

with no dimensions.

Bar Chart

Appropriate for:

Status + Count

Pie/Donut

Appropriate for:

Status + Count

with a limited number of categories.

Line Chart

Most useful when a date dimension exists.

Do not force inappropriate chart types.

⸻

29. Chart Library

Before adding a new chart library, inspect the repository.

If an existing chart/visualization library is already installed, reuse it.

Do not add another charting dependency unnecessarily.

If no suitable library exists, choose a lightweight library consistent with the application architecture.

Document the dependency decision.

⸻

30. KPI View

Support a simple KPI representation.

Example:

TOTAL LEADS
12,542

For:

COUNT(*)

or:

SUM(opportunityAmount)

The KPI should use the report result rather than executing another query.

⸻

31. Chart Data Transformation

The frontend may transform the normalized Reporting API result into the format required by the charting library.

However:

Do not perform business aggregation in the frontend.

For example, if the API returns:

Status | Count

the frontend can map it into chart-library data structures.

It must not take raw Lead records and calculate counts itself.

⸻

32. Report Configuration State

Manage report-builder state using the application’s existing state-management conventions.

The state should conceptually contain:

Entity
Filter
Dimensions
Measures
Sort
Visualization

Avoid introducing Redux or another global state mechanism if the existing page-level state architecture is sufficient.

Use the simplest architecture consistent with the project.

⸻

33. URL / State Persistence

Do not implement Saved Reports yet.

However, where practical, consider whether the report configuration should be represented in the URL for:

* Refresh
* Browser back/forward
* Sharing a report configuration

Do not implement complex persistence unless the existing architecture makes this straightforward.

If this is deferred, document it.

⸻

34. Existing Saved Filter Persistence

Do not modify the existing Saved Filter persistence mechanism unless necessary.

The report builder should consume Saved Filters using the existing implementation.

⸻

35. Entity Switching

When the user changes:

Lead

to:

Opportunity

the UI should:

* Refresh available fields
* Refresh available dimensions
* Refresh available measures
* Clear incompatible configuration
* Preserve compatible configuration only where safe

Do not send invalid Lead fields to an Opportunity report.

⸻

36. Metadata-Driven UI

This is a critical requirement.

The UI must not contain assumptions such as:

if (entity === "lead") {
   fields = [...]
}
if (entity === "opportunity") {
   fields = [...]
}

unless such logic already exists as part of the centralized metadata system.

Instead:

Selected Entity
      ↓
Metadata
      ↓
Available Fields
      ↓
Capabilities
      ↓
UI Options

This is essential for the long-term metadata-driven CRM architecture.

⸻

37. Custom Fields in UI

Tenant-specific fields should automatically appear in the relevant field selectors if the metadata system exposes them.

For example, if Tenant A defines:

Customer Segment
Loan Amount
Policy Type

the reporting UI should be able to discover them through metadata.

Do not add frontend code specifically for those fields.

⸻

38. Field Labels

The UI should display metadata-friendly labels:

Loan Amount

rather than:

loanAmount

Use:

* Display label
* Description
* Field type

where available.

⸻

39. Field Search

If the tenant has many fields, field selectors should support search.

For example:

Group By
[ Search fields... ]
Loan Amount
Loan Type
Loan Status
Policy Type
...

Do not render hundreds of fields into an unusable dropdown.

Use the existing component library patterns.

⸻

40. Report Configuration Validation

Provide frontend validation before executing the query.

Examples:

* Entity required
* At least one measure required
* Dimension must be valid
* Measure must be valid
* Aggregation must be valid
* Sort field must exist
* Required metric configuration must be complete

However:

Backend validation remains authoritative.

Do not duplicate complex backend validation logic unnecessarily.

⸻

41. Query Execution

The frontend should construct the request according to the actual Phase 2 API contract.

Conceptually:

{
  "entity": "lead",
  "filter": {},
  "dimensions": [
    {
      "field": "status"
    }
  ],
  "measures": [
    {
      "type": "COUNT",
      "field": "*",
      "alias": "leadCount"
    }
  ],
  "sort": [
    {
      "field": "leadCount",
      "direction": "DESC"
    }
  ]
}

This is illustrative only.

Use the exact Phase 2 request contract discovered in the repository.

Do not modify the API simply to match this example.

⸻

42. API Client

Use the application’s existing API-client pattern.

If React Query is already used:

* Use the existing query/mutation conventions.
* Follow existing caching behavior.
* Follow existing error handling.

Do not introduce another API-client library.

⸻

43. Avoid Unnecessary API Calls

Do not call the reporting API every time a user changes a dropdown.

The report should generally execute explicitly through:

Run Report

unless the existing application has an established reactive-query pattern that makes immediate execution appropriate.

Avoid excessive API traffic.

⸻

44. Report Result Refresh

After changing the configuration:

Run Report

should execute the current configuration.

The previous result may remain visible while the new result loads if that provides a better UX.

Follow existing application conventions.

⸻

45. Accessibility

The reporting UI should follow the application’s existing accessibility standards.

Ensure:

* Form controls have labels
* Buttons have accessible names
* Loading states are communicated
* Errors are visible and understandable
* Keyboard navigation works
* Charts have appropriate accessible representations where practical

Do not make the chart the only way to understand the result.

The table representation should remain available.

⸻

46. Performance

Avoid unnecessary frontend work.

Do not:

* Load all CRM records into the browser
* Perform client-side aggregation
* Fetch fields not required by the report
* Re-render the entire page for every configuration change unnecessarily
* Execute a report on every keystroke

The Reporting API is responsible for data aggregation.

The frontend is responsible for configuration and presentation.

⸻

47. Testing

Add appropriate frontend tests.

Report Builder

Test:

* Entity selection
* Field loading
* Dimension selection
* Measure selection
* Aggregation selection
* Sorting
* Filter configuration
* Run Report

⸻

Existing Saved Filters

Test:

* Existing Saved Filter can be selected
* Saved Filter is converted into the expected existing filter definition
* Report executes using that filter

Do not test nonexistent Saved Views.

⸻

Result Rendering

Test:

* Empty result
* Single dimension
* Multiple dimensions
* Multiple measures
* Numeric values
* Loading state
* Error state

⸻

Visualization

Test:

* Table
* KPI
* Bar
* Line
* Pie/Donut where implemented

Verify that visualization uses the API result rather than independently aggregating records.

⸻

Entity Switching

Test:

Lead → Opportunity

and ensure incompatible fields are removed/reset.

⸻

Custom Fields

Test that metadata-provided custom fields appear in:

* Filters
* Dimensions
* Measures where supported

without hardcoded frontend configuration.

⸻

48. Do Not Break Existing CRM UI

The reporting implementation must not break:

* Lead table
* Opportunity table
* Existing filtering
* Saved Filters
* Existing filter persistence
* Existing metadata UI
* Existing navigation
* Existing design system

Reuse existing components where possible.

⸻

49. Explicitly Out of Scope

Do NOT implement in this phase:

Persistence

* Saved Reports
* Saved Views
* Report templates
* Scheduled Reports
* Email Reports

Dashboard

* Dashboard Builder
* Dashboard persistence
* Dashboard widgets
* Drag-and-drop dashboards

Advanced analytics

* Journey analytics
* Conversion funnels
* Attribution
* Lead → Contact → Opportunity traversal
* Cross-entity reporting
* Data warehouse
* Reporting projections

Export

* CSV export
* Excel export
* PDF export

unless the existing application already has a generic export component that can be reused with essentially no additional reporting architecture.

Backend

Do NOT rewrite:

* Reporting Query Engine
* Reporting APIs
* Database aggregation
* Filter compiler
* Metadata service

Only make minimal backend changes if the UI discovers a genuine API contract gap.

⸻

50. Recommended Implementation Sequence

Step 1 — Inspect Phase 2

Understand:

* Reporting APIs
* Request contract
* Response contract
* Validation
* Supported dimensions
* Supported measures
* Metadata capabilities
* Pagination
* Errors

Do not code the UI until this is understood.

⸻

Step 2 — Inspect Existing UI

Identify:

* Layout
* Design system
* Existing table
* Existing filter component
* Existing metadata selectors
* Existing API client
* Existing state management
* Existing chart library

⸻

Step 3 — Build Report Builder Shell

Implement:

Reports
  └── Report Builder

with:

* Entity selector
* Filter section
* Group By section
* Metrics section
* Sort section
* Run Report button
* Results section

⸻

Step 4 — Integrate Existing Filters

Reuse the existing filter UI and Saved Filter functionality.

⸻

Step 5 — Integrate Dimensions

Connect metadata to the Group By selector.

⸻

Step 6 — Integrate Measures

Build the metric configuration UI.

⸻

Step 7 — Execute Reporting API

Connect the configuration to the Phase 2 Reporting API.

⸻

Step 8 — Build Generic Result Table

Render the API response dynamically.

⸻

Step 9 — Add Basic Visualizations

Add appropriate:

* KPI
* Bar
* Line
* Pie/Donut

only after the table works.

⸻

Step 10 — Add Loading/Error/Empty States

Make the complete flow production-ready.

⸻

Step 11 — Testing

Add unit/component/integration tests.

⸻

Step 12 — UX Review

Review:

* Configuration flow
* Field discoverability
* Responsiveness
* Error handling
* Accessibility
* Performance

⸻

51. Definition of Done

Phase 3 is complete when a user can open the Reporting UI and perform the following end-to-end workflow:

Open Reports
     ↓
Select Lead
     ↓
Choose existing filter / create filter
     ↓
Select Status as Group By
     ↓
Select Count as Metric
     ↓
Choose sorting
     ↓
Click Run Report
     ↓
Reporting API
     ↓
Display result table

The user should also be able to:

Select Opportunity
     ↓
Select an existing Saved Filter
     ↓
Group by Agent
     ↓
Add SUM / COUNT / AVG where supported
     ↓
Run report
     ↓
View results

And where supported:

Switch visualization
     ↓
Table
KPI
Bar
Line
Pie/Donut

⸻

52. Final Output Required From the Coding Agent

At the end of Phase 3, provide a concise implementation report.

1. Existing Phase 2 API discovered

Document:

* Reporting endpoints
* Request contract
* Response contract
* Supported operations

2. UI architecture implemented

Show the actual component/page structure.

For example:

ReportsPage
 ├── ReportBuilder
 │    ├── EntitySelector
 │    ├── FilterSection
 │    ├── DimensionSelector
 │    ├── MeasureSelector
 │    ├── SortSelector
 │    └── RunReportButton
 │
 └── ReportResults
      ├── ReportTable
      └── ReportVisualization

Use the actual implementation rather than forcing these names.

3. Existing components reused

List:

* Existing filter component
* Existing metadata components
* Existing table
* Existing API client
* Existing design system
* Existing chart library

4. API integration

Explain exactly how the UI constructs and submits the Phase 2 reporting query.

5. Saved Filter integration

Explain how existing Saved Filters are consumed.

Explicitly confirm:

No Saved View functionality was introduced.

6. Metadata integration

Explain how fields and capabilities are dynamically obtained.

7. Visualization

List implemented visualization types.

8. Tests

List:

* Component tests
* Integration tests
* API integration tests
* Regression tests

9. Accessibility

Summarize accessibility considerations.

10. Performance

Mention:

* API call behavior
* Rendering strategy
* Avoidance of client-side aggregation
* Any identified bottlenecks

11. Files changed

List important files/modules.

12. Backend changes

If any backend changes were required, explicitly list them and explain why.

Do not silently modify the Phase 2 API.

13. Known limitations

Clearly identify anything intentionally deferred to future phases.

⸻

Final Instruction

Implement only Phase 3 — Reporting UI and Report Builder.

The Reporting APIs already exist from Phase 2.

Inspect and consume those APIs; do not rebuild them.

The UI must be metadata-driven and must reuse the existing filtering and Saved Filter infrastructure.

There are currently no Saved Views and no Saved Reports. Do not introduce either in this phase.

Do not introduce a second filter model.

Do not perform aggregation in the browser.

Do not query MongoDB/Cosmos directly from the frontend.

Do not introduce Lead → Contact → Opportunity relationship traversal.

Do not implement dashboards or advanced journey analytics.

Build the smallest clean, extensible Report Builder that provides a complete end-to-end experience:

Configure Report
      ↓
Existing Filter
      ↓
Dimensions
      ↓
Measures
      ↓
Run
      ↓
Reporting API
      ↓
Generic Result Table
      ↓
Optional Visualization

Follow the existing application’s architecture, component library, styling, state-management, metadata, and API conventions.

Inspect first, implement incrementally, test thoroughly, and stop when Phase 3 is complete.
