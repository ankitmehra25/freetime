                 Configuration Store
                        │
                  Tenant Metadata
                        │
                        ▼
                  Configuration API
                        │
                        ▼
                 Next.js CRM App
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
     Dependency Engine        Workflow Runtime



Browser
   │
   ▼
CRM / BFF
   │
   ▼
Configuration Service
   │
   ▼
Tenant Configuration Store



Tenant A
 ├── Form metadata
 ├── Validation metadata
 ├── Visibility/dependency metadata
 ├── Workflow configuration
 └── Integration configuration

Tenant B
 ├── Form metadata
 ├── Validation metadata
 ├── Visibility/dependency metadata
 ├── Workflow configuration
 └── Integration configuration


                 External Sources
                /       |        \
               /        |         \
            CSV       Partner     SOR
              \         |          /
               \        |         /
                ▼       ▼         ▼
                     Lead
                       │
                       │ Nurture
                       ▼
                    Contact
                       │
                       ▼
                  Opportunity
                       │
                       ▼
                     Quote
                       │
                       ▼
                 Application



Tenant A → CRM quote engine

Tenant B → External rating engine

Tenant C → Partner quote engine


                         ┌───────────────────────┐
                         │ Configuration Store   │
                         │                       │
                         │ Tenant A metadata     │
                         │ Tenant B metadata     │
                         │ Tenant C metadata     │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ Configuration Service │
                         └───────────┬───────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────┐
│                     CRM                                 │
│                                                         │
│ Lead → Contact → Opportunity                            │
│                     │                                   │
│                     ▼                                   │
│                  Quote                                  │
│                     │                                   │
│                     ▼                                   │
│               Application                               │
└─────────────────────┬───────────────────────────────────┘
                      │
                Commands / Events
                      │
                      ▼
              ┌─────────────────┐
              │   Event Bus     │
              └────────┬────────┘
                       │
             ┌─────────┼──────────┐
             ▼         ▼          ▼
        Quote SOR   App SOR    Other systems



{
  "tenantId": "tenant-A",

  "capabilities": {
    "quote": {
      "provider": "external-quote-engine"
    },
    "application": {
      "provider": "application-sor"
    }
  }
}{
  "tenantId": "tenant-B",

  "capabilities": {
    "quote": {
      "provider": "crm"
    },
    "application": {
      "provider": "crm"
    }
  }
}

                         ┌──────────────┐
                         │ Contact Form │
                         └──────┬───────┘
                                │
                         ┌──────▼───────┐
                         │              │
┌──────────────┐         │ Lead Intake │         ┌───────────────┐
│ CSV Upload   ├────────►│             │◄────────┤ Manual Create │
└──────────────┘         └──────┬───────┘         └───────────────┘
                                │
                                ▼
                         Deduplication
                                │
                                ▼
                         Lead Created
                                │
                                ▼
                         Lead Assignment
                                │
                                ▼
                           Nurturing
                                │
                                ▼
                           Contacted
                                │
                                ▼
                         Lead Qualified
                                │
                                ▼
                       Convert Lead
                         /        \
                        /          \
                       ▼            ▼
                   Contact      Opportunity
                                  │
                                  ▼
                                 Quote
                                  │
                                  ▼
                             Application
                                  │
                                  ▼
                                Policy



                                
Browser
   │
   │ Upload
   ▼
Blob Storage
   │
   │ File uploaded
   ▼
Ingestion Job
   │
   ▼
CSV Processor
   │
   ├── Parse
   ├── Validate
   ├── Normalize
   ├── Deduplicate
   └── Persist Leads



Raw CSV record
      │
      ▼
Normalize
      │
      ▼
Deduplication
      │
 ┌────┴────┐
 │         │
New      Duplicate
 │         │
 ▼         ▼
Create    Ignore/
Lead      merge/report


Import ID
    │
    └── identifies ingestion operation

External Lead ID
    │
    └── identifies lead in originating system

CRM Lead ID
    │
    └── identifies lead in YOUR domain

{
  "leadId": "L-100023",
  "externalReferences": [
    {
      "system": "PartnerA",
      "id": "ABC-789"
    }
  ]
}


Upload
  │
  ├── tenantId
  ├── importId
  └── blob reference
       │
       ▼
Ingestion Worker
       │
       ▼
Tenant A DB
       │
       └── leads

    event envelope
    eventId
eventType
eventVersion
tenantId
occurredAt
source
correlationId
causationId
entityType
entityId


canonical lead data

leadId
name
phone
email
source
status
assignedTo


extensions

extensions
   └── tenant-specific attributes


   {
  "eventId": "EVT-123",
  "eventType": "LeadCreated",
  "eventVersion": "1.0",
  "tenantId": "TENANT-A",
  "entityType": "Lead",
  "entityId": "L-100023",
  "occurredAt": "2026-08-25T08:30:00Z",
  "source": "CSV",

  "data": {
    "leadId": "L-100023",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+919999999999",
    "email": "john@example.com"
  },

  "extensions": {
    "campaignCode": "ABC123"
  }
}


Metadata Source
      │
      ▼
Metadata Pipeline
      │
      ├── Validate
      ├── Version
      ├── Publish
      └── Store
             │
             ▼
        Blob Storage
             │
             ▼
     Configuration Service
             │
             ▼
          CRM


          Lead
  │
  │ Agent works with lead
  │
  │ Lead agrees to pursue policy
  ▼
Convert
  │
  ├── Contact created
  │
  └── Opportunity created
event LeadConverted

data -> leadId
contactId
opportunityId
tenantId



business event vs publish events distinguishing needed

LeadCreated
     │
     ▼
LeadAssigned
     │
     ▼
LeadQualified
     │
     ▼
LeadConverted
     │
     ├─────────────► ContactCreated
     │
     └─────────────► OpportunityCreated
                              │
                              ▼
                         QuoteRequested
                              │
                              ▼
                         QuoteGenerated
                              │
                              ▼
                          QuoteAccepted
                              │
                              ▼
                     ApplicationRequested
                              │
                              ▼
                     ApplicationCreated

   

                 ┌───────────────┐
                 │ CSV File      │
                 └───────┬───────┘
                         │
                         ▼
                    Blob Storage
                         │
                         ▼
                  Import Job
                         │
                         ▼
                  Batch Processor
                         │
                ┌────────┼────────┐
                │        │        │
             Parse    Validate   Normalize
                │        │        │
                └────────┼────────┘
                         ▼
                    Deduplicate
                         │
                 ┌───────┴────────┐
                 │                │
              Duplicate          New
                 │                │
                 ▼                ▼
             Rejected        Create Lead
                                  │
                                  ▼
                            Tenant DB
                             /leads
                                  │
                                  ▼
                             Outbox
                                  │
                                  ▼
                         LeadCreated Event
                                  │
                                  ▼
                            Event Bus
                                  │
                     ┌────────────┼───────────┐
                     │            │           │
                     ▼            ▼           ▼
                 Analytics    Integration   Other
                                Layer       consumers









