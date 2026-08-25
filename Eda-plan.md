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

    

   











