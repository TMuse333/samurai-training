# Child Repo Multi-Page Loading Issue - DIAGNOSIS & FIX

## Problem Summary

**Issue**: Child repos only load 1 out of 3 pages despite having all 3 pages in `websiteData.json`

**Example**: `samurai-training` repo has 3 pages in array format, but only 1 page is accessible

## Root Cause Analysis

### The Problem

The parent repo deploys `websiteData.json` with pages as an array, but **MISSING critical metadata**:

```json
{
  "pages": [
    {
      // ❌ NO "slug" or "pageName" properties!
      "components": [...],
      "text": [...]
    },
    {
      // ❌ NO "slug" or "pageName" properties!
      "components": [...],
      "text": [...]
    },
    {
      // ❌ NO "slug" or "pageName" properties!
      "components": [...],
      "text": [...]
    }
  ]
}
```

### Why This Breaks Multi-Page Loading

The child repo's transformation code in `websiteDataSlice.ts` (lines 192-203):

```typescript
// Transform pages from array to object if needed
let pagesObject: Record<string, WebsitePage> = {};
if (Array.isArray(data.websiteData?.pages)) {
  // Convert array to object keyed by slug
  data.websiteData.pages.forEach((page: WebsitePage) => {
    const slug = page.slug || 'index';  // ❌ ALL pages default to 'index'!
    pagesObject[slug] = page;
  });
  console.log("🔄 Converted pages array to object:", Object.keys(pagesObject));
}
```

**What Happens:**
1. Page 1 (no slug) → defaults to `'index'` → `pagesObject['index'] = page1`
2. Page 2 (no slug) → defaults to `'index'` → `pagesObject['index'] = page2` (overwrites page 1!)
3. Page 3 (no slug) → defaults to `'index'` → `pagesObject['index'] = page3` (overwrites page 2!)

**Result**: Only the LAST page (page 3) exists in `pagesObject`, and it's keyed as `'index'`.

## Evidence from samurai-training repo

Checked `/Users/thomasmusial/Desktop/javascript_projects/samurai-training/frontend/src/data/websiteData.json`:

- **Line 23-499**: First page - ❌ No `slug` or `pageName`
- **Line 500-875**: Second page - ❌ No `slug` or `pageName`
- **Line 876-1107**: Third page - ❌ No `slug` or `pageName`

All pages have `components` and `text` arrays, but missing page metadata.

## Required Fix

### What Pages Should Look Like

Each page in the array MUST have `slug` and `pageName`:

```json
{
  "pages": [
    {
      "pageName": "Home",
      "slug": "index",
      "components": [...],
      "text": [...]
    },
    {
      "pageName": "Services",
      "slug": "services",
      "components": [...],
      "text": [...]
    },
    {
      "pageName": "About",
      "slug": "about",
      "components": [...],
      "text": [...]
    }
  ]
}
```

### Where to Fix This

**Parent Repo (easy-money)**: Component injection code

**File**: `src/lib/deployment/componentInjection.ts`

The function that generates `websiteData.json` for deployment must include:
- `pageName` for each page
- `slug` for each page

**Current behavior**: Only includes `components` and `text` arrays
**Required behavior**: Also include `pageName` and `slug` metadata

## Step-by-Step Fix Instructions

### 1. Check Current Injection Code

Look at where `websiteData.json` is generated in `componentInjection.ts`:

```typescript
// Current (BROKEN) - only has components and text
const pageData = {
  components: page.components,
  text: page.text
};

// Required (FIXED) - includes slug and pageName
const pageData = {
  pageName: page.pageName || 'Home',  // ✅ Add this
  slug: page.slug || 'index',          // ✅ Add this
  components: page.components,
  text: page.text
};
```

### 2. Update Component Injection

Find where `websiteData.json` content is built and ensure each page includes:

```typescript
const websiteDataForGitHub = {
  templateName: websiteData.templateName,
  formData: websiteData.formData,
  status: websiteData.status,
  pages: websiteData.pages.map((page, index) => ({
    pageName: page.pageName || `Page ${index + 1}`,  // ✅ Critical!
    slug: page.slug || (index === 0 ? 'index' : `page-${index}`),  // ✅ Critical!
    components: page.components || [],
    text: page.text || []
  })),
  // ... other fields
};
```

### 3. Verify Parent Repo Has Page Metadata

Check that the parent repo's `WebsiteMaster` object has `slug` and `pageName` set for each page:

**File**: Look at how pages are created in the parent repo

```typescript
// Example: When creating pages for professionalThreePage template
const pages: WebsitePage[] = [
  {
    pageName: "Home",       // ✅ Must be set
    slug: "index",          // ✅ Must be set
    components: [...],
    text: [...]
  },
  {
    pageName: "Services",   // ✅ Must be set
    slug: "services",       // ✅ Must be set
    components: [...],
    text: [...]
  },
  {
    pageName: "About",      // ✅ Must be set
    slug: "about",          // ✅ Must be set
    components: [...],
    text: [...]
  }
];
```

### 4. Test the Fix

After making changes:

1. Deploy a test website
2. Check the generated `websiteData.json` in the child repo
3. Verify each page has:
   - ✅ `pageName` property
   - ✅ `slug` property
   - ✅ `components` array
   - ✅ `text` array

4. Load the child repo and verify:
   - ✅ Console shows: `🔄 Converted pages array to object: ['index', 'services', 'about']` (not just `['index']`)
   - ✅ All 3 pages are accessible via routes: `/`, `/services`, `/about`

## Verification Console Logs

### Before Fix (BROKEN)
```
🔄 [websiteDataSlice] Converted pages array to object: ['index']
// Only 'index' key - all pages collapsed into one!
```

### After Fix (WORKING)
```
🔄 [websiteDataSlice] Converted pages array to object: ['index', 'services', 'about']
// All 3 pages with correct slugs!
```

## Architecture Summary

### Parent Repo (easy-money)
- Stores pages as **array**: `pages: WebsitePage[]`
- Each page MUST include: `pageName`, `slug`, `components`, `text`
- Deploys to GitHub as array in `websiteData.json`

### Child Repo (samurai-training, next-js-template)
- Expects pages as **object**: `pages: Record<string, WebsitePage>`
- Has transformation code (lines 192-203) that converts array → object
- Transformation DEPENDS on each page having a `slug` property
- Without `slug`, ALL pages default to `'index'` and overwrite each other

### Data Flow
```
Parent Repo                Child Repo
├─ pages: [                ├─ Load from GitHub
│   {                      │
│     pageName: "Home"     │  Transform array → object
│     slug: "index"  ─────────► pagesObject['index'] = page1 ✅
│   },                     │
│   {                      │
│     pageName: "Services" │
│     slug: "services" ────────► pagesObject['services'] = page2 ✅
│   },                     │
│   {                      │
│     pageName: "About"    │
│     slug: "about" ───────────► pagesObject['about'] = page3 ✅
│   }                      │
│ ]                        └─ Access by slug: pages['index'], pages['services'], etc.
```

## Files to Modify

### Parent Repo (easy-money)
- `src/lib/deployment/componentInjection.ts` - Add `pageName` and `slug` to page data
- `src/lib/github/pageStructure.ts` - Verify `extractPageStructure` includes page metadata
- Any template definitions - Ensure pages are created with `slug` and `pageName`

### Child Repo (next-js-template)
- ✅ No changes needed - transformation logic is already correct
- ✅ Just needs parent to provide complete page data

## Priority

**HIGH** - This breaks multi-page functionality entirely. Users can only access 1 page instead of 3.

## Related Issues

- See `docs/multi-page-template-system.md` for full architecture
- See `docs/parent-repo-missing-changes.md` for other deployment fixes

---

**Status**: 🔴 Critical bug identified
**Created**: 2025-12-29
**Impact**: All multi-page deployments
**Fix Required In**: Parent repo component injection code
