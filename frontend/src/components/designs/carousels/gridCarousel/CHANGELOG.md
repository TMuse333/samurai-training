# GridCarousel Component Fix

## Fix: updateComponentProps Function Call

**Date:** 2024

### Issue
The `updateComponentProps` function was being called with only 2 arguments, but it requires 3-4 arguments according to its type signature.

**Error:**
```
Expected 3-4 arguments, but got 2.
```

### Solution
Added the missing `currentPageSlug` parameter to the function call.

**Changes:**
1. Added `currentPageSlug` retrieval from the store:
   ```typescript
   const currentPageSlug = useWebsiteStore((state) => state.currentPageSlug);
   ```

2. Updated the `updateProp` function to include `currentPageSlug` as the first argument:
   ```typescript
   // Before
   updateComponentProps(id, { [key]: value });
   
   // After
   updateComponentProps(currentPageSlug, id, { [key]: value });
   ```

### Function Signature
```typescript
updateComponentProps(
  pageSlug: string,
  componentId: string,
  props: Record<string, any>,
  metadata?: { source?: string; prompt?: string }
)
```

### Files Modified
- `frontend/src/components/designs/carousels/gridCarousel/gridCarouselEdit.tsx`

