# Progress Tracker

## Day 1: Identity & Tenant Handling ✅

### Goals Achieved

- ✅ Identity exists → app renders
- ✅ Identity missing → redirect to select
- ✅ Session-based identity management

---

## Day 2: Metadata-Driven UI ✅

### Routing & App Router Semantics

- `/select` → Identity selection page
- `/` → Guarded dashboard
- ✅ No misuse of route groups
- ✅ No fake `/app` route

### Metadata-Driven Rendering

| Tenant     | Fields Rendered | Source   |
| ---------- | --------------- | -------- |
| `tenant-a` | Email           | metadata |
| `tenant-b` | Email + Budget  | metadata |

### What Stays the Same

- Dashboard code
- Renderer components
- UI logic

### What Changes

- **Metadata only**

### Key Proof

```
UI shape = function(metadata, tenant, locale)
```

---

## Day 3: Declarative Behavior 🔄

### Theme

**Declarative behavior on top of metadata**

> Behavior must come from metadata, not code.

### Objective (Locked)

Fields should be able to:

1. **Validate themselves** based on rules
2. **Appear/disappear** based on other fields
3. **Explain why** something is invalid

### Architecture Flow

```
Schema (what exists)
  ↓
Rules (when & how it behaves)
  ↓
Renderer (how it appears)
```

### What Day 3 Will Add

- [ ] Required field validation
- [ ] Rule definitions in metadata
- [ ] Conditional visibility (`dependsOn`)
- [ ] Explainable errors (why a field failed)

### Implementation Progress

#### ✅ Type Definitions (`core/metadata/types.ts`)

```typescript
ValidationRule = "required" | "min" | "max";
VisibilityRule = { dependsOn, equals };
```

#### ✅ Metadata Updates (`data/tenants/tenant-b.json`)

- Added `validations` array to email field
- Added `visibleWhen` rule to budget field
- Version bumped to 1.1

#### ✅ Renderer Logic (`components/renderer/FormRenderer.tsx`)

- State management for form values
- Validation engine
- Conditional visibility logic
- Error display

### By End of Day 3

- ✅ Required validation works
- ✅ Errors are explainable
- ✅ Conditional visibility works
- ✅ No backend, no workflows yet

### What We Still Will NOT Add

- ❌ Backend
- ❌ Persistence
- ❌ Workflows
- ❌ APIs

---

## Separation of Concerns

### ✅ What We Did Right

- Clean separation between UI and metadata
- No premature optimizations
- Tenant isolation maintained
- Behavior driven by configuration

### ❌ What We Avoided

- ❌ Leaking business logic into UI
- ❌ Adding validations prematurely
- ❌ Adding backend prematurely
- ❌ Hardcoding entity semantics

---

## Alignment With the Vision

### ✅ Foundations Established

- ✅ Dynamic attributes
- ✅ Tenant isolation
- ✅ Localization support
- ✅ Governance hooks (ready)
- ✅ Future workflows (ready)
- ✅ Future auth (ready)
- ✅ Declarative validation rules
- ✅ Conditional field visibility

---

## Architecture Principles

1. **Metadata First**: All UI decisions driven by configuration
2. **Tenant Isolation**: Complete separation between tenant data
3. **Localization**: Multi-language support baked in
4. **Progressive Enhancement**: Add features without breaking existing code
5. **Separation of Concerns**: UI, metadata, and business logic remain distinct
6. **Declarative Behavior**: Rules define behavior, not imperative code

---

## Next Steps (Day 4+)

### Potential Enhancements

- [ ] More validation types (email, regex, custom)
- [ ] Cross-field validation
- [ ] Async validation
- [ ] Field-level permissions
- [ ] Computed fields
- [ ] Multi-step forms
- [ ] Form state persistence

### Still Deferred

- Backend integration
- Database persistence
- Authentication & authorization
- Workflow engine
- API layer
