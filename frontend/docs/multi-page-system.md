# Multi-Page System Analysis

## Problem Summary

Only one page (`index`) is being loaded and displayed, even though the data contains multiple pages. Components are not rendering because the page data structure is inconsistent.

## Current Data Structure from GitHub

### Top-Level Pages (Correct Format)
```json
"pages": {
  "index": {
    "components": [...],
    "text": [...]
  }
}
```
✅ **Already an object keyed by slug** - This format works correctly.

### Versions Array (Problematic Format)
```json
"versions": [
  {
    "websiteData": {
      "pages": [
        { "components": [...] },  // ❌ No slug property!
        { "components": [...] },  // ❌ No slug property!
        { "components": [...] }   // ❌ No slug property!
      ]
    }
  }
]
```
❌ **Array format without slug properties** - This causes pages to be lost during transformation.

## Root Cause

The transformation code in `websiteDataSlice.ts` (lines 193-198) has a critical flaw:

```typescript
if (Array.isArray(data.websiteData?.pages)) {
  data.websiteData.pages.forEach((page: WebsitePage) => {
    const slug = page.slug || 'index';  // ❌ PROBLEM: All pages without slugs become 'index'
    pagesObject[slug] = page;           // ❌ Later pages overwrite earlier ones
  });
}
```

### The Issue

1. **Missing Slugs**: Pages in arrays don't have `slug` properties
2. **Default Fallback**: All pages without slugs default to `'index'`
3. **Overwriting**: Each page overwrites the previous one in the object
4. **Result**: Only the last page in the array survives, all others are lost

### Example of What Happens

```typescript
// Input array (3 pages, no slugs)
[
  { components: [...] },  // → slug = 'index'
  { components: [...] },  // → slug = 'index' (overwrites first)
  { components: [...] }   // → slug = 'index' (overwrites second)
]

// Output object (only 1 page remains)
{
  "index": { components: [...] }  // Only the last page
}
```

## Expected Behavior

The codebase expects `pages` to be an object keyed by unique slugs:

```typescript
// Type definition
pages: Record<string, WebsitePage>; // Object keyed by slug, not array

// Usage throughout codebase
websiteData.pages[pageSlug]  // Direct access by slug
Object.keys(websiteData.pages)  // Get all page slugs
Object.values(websiteData.pages)  // Get all pages
```

## Proposed Solutions

### Solution 1: Intelligent Slug Generation (Recommended)

When converting array to object, generate slugs intelligently:

```typescript
if (Array.isArray(data.websiteData?.pages)) {
  data.websiteData.pages.forEach((page: WebsitePage, index: number) => {
    let slug: string;
    
    // Priority 1: Use existing slug if present
    if (page.slug) {
      slug = page.slug;
    }
    // Priority 2: Convert pageName to slug
    else if (page.pageName) {
      slug = page.pageName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    // Priority 3: Use index-based slug
    else {
      slug = index === 0 ? 'index' : `page-${index}`;
    }
    
    // Ensure uniqueness (handle duplicates)
    let uniqueSlug = slug;
    let counter = 1;
    while (pagesObject[uniqueSlug]) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    
    pagesObject[uniqueSlug] = { ...page, slug: uniqueSlug };
  });
}
```

**Benefits:**
- Preserves all pages
- Generates meaningful slugs
- Handles edge cases (duplicates, missing data)
- Maintains backward compatibility

### Solution 2: Standardize Data Source

Ensure the data source (parent repo) always provides pages in the correct format:

**Option A**: Always use object format
```json
"pages": {
  "index": { "slug": "index", "components": [...] },
  "about": { "slug": "about", "components": [...] }
}
```

**Option B**: Always include slugs in arrays
```json
"pages": [
  { "slug": "index", "components": [...] },
  { "slug": "about", "components": [...] }
]
```

### Solution 3: Hybrid Approach

1. **Code Fix**: Implement Solution 1 (intelligent slug generation)
2. **Data Fix**: Update parent repo to always include slugs
3. **Validation**: Add validation to warn when pages lack slugs

## Implementation Priority

### Phase 1: Immediate Fix (Code)
- ✅ Implement intelligent slug generation
- ✅ Add logging to track conversions
- ✅ Handle edge cases (empty arrays, missing data)

### Phase 2: Data Standardization
- Update parent repo to always include slugs
- Add validation in save operations
- Document expected data format

### Phase 3: Validation & Monitoring
- Add runtime warnings when slugs are auto-generated
- Log which pages needed slug generation
- Track data format consistency

## Testing Checklist

After implementing the fix, verify:

- [ ] All pages from array are preserved
- [ ] Each page has a unique slug
- [ ] Pages can be accessed by slug: `websiteData.pages[slug]`
- [ ] PageSwitcher shows all pages
- [ ] PageRenderer can find pages by slug
- [ ] Navigation between pages works
- [ ] Components render correctly on all pages

## Files That Need Updates

1. **`frontend/src/stores/slices/websiteDataSlice.ts`** (lines 191-203)
   - Update array-to-object transformation logic
   - Add intelligent slug generation

2. **`frontend/src/types/website.ts`** (if needed)
   - Ensure `WebsitePage` interface allows optional `slug`
   - Document slug requirements

3. **Parent Repo** (data source)
   - Ensure pages always have slugs
   - Or document that slugs will be auto-generated

## Related Code References

- `PageRenderer.tsx` - Expects `pages` as object: `websiteData.pages[pageSlug]`
- `PageSwitcher.tsx` - Uses `Object.values(pages)` to list all pages
- `EditorialPageWrapper.tsx` - Accesses pages via slug: `pages[normalizedPageSlug]`
- `generatePageFiles.ts` - Handles both formats but expects slugs

## Questions to Resolve

1. **Which data source is actually being used?**
   - Top-level `pages` object? (should work)
   - Or `versions[0].websiteData.pages` array? (needs fixing)

2. **Should pages in arrays always have slugs?**
   - If yes → Update data source
   - If no → Code must generate them

3. **What slug generation pattern is preferred?**
   - `index`, `page-1`, `page-2`?
   - Or derive from `pageName`?

4. **Are there other places where pages arrays are used?**
   - Check all API endpoints
   - Check save operations
   - Check version history

---

**Status**: Analysis Complete - Ready for Implementation  
**Priority**: High - Blocks multi-page functionality  
**Estimated Fix Time**: 1-2 hours (code + testing)

